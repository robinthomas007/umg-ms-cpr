import React, { useState, useEffect } from 'react'
import { Button, Typography, Input, Row, Col, Table, Select, Space, Pagination } from 'antd'
import ReactDragListView from 'react-drag-listview'
import { SearchOutlined } from '@ant-design/icons'
import CreateModal from './Modals/createUserModal'
import { EditOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import { deleteApi, postApi, getApi, deleteApiWithReqBody } from '../../Api/Api'
import type { ColumnsType } from 'antd/es/table'
import { tagRender } from './../Common/common'

const { Title } = Typography
const { Search } = Input

interface UserDataType {
  key: React.Key
  username: string
  country: string
  timezone: string
  teams: any
}

export default function User({ handleDragStart, reloadTeamData, reloadUserDataFromTeam }) {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [userColumns, setUserColumns] = useState<ColumnsType<UserDataType>>([])
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false)
  const [editRecord, setEditRecord] = useState({})
  const [userData, setUserData] = useState([])
  const [teamList, setTeamList] = useState([])
  const [isUserDataUpdated, setIsUserDataUpdated] = useState<boolean>(false)
  const [searchTeam, setSearchTeam] = useState('')

  useEffect(() => {
    setUserColumns(userColumn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  useEffect(() => {
    setLoadingUserData(true)
    const params = {
      SearchTerm: searchTeam,
    }
    getApi(params, '/usersearch')
      .then((res) => {
        setLoadingUserData(false)
        setTeamList(res.userList.teams)
        setUserData(res.userList.users)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
  }, [isUserDataUpdated, reloadUserDataFromTeam, searchTeam])

  const setSearchWord = (searchVal) => {
    setSearchTeam(searchVal)
  }

  const updateUserTeam = (val, row) => {
    const updatedMember = {
      teamId: [val],
      userId: [row.userId],
    }
    postApi(updatedMember, '/teamuser', 'successfully assigned role')
      .then((res: any) => {
        reloadTeamData()
        setIsUserDataUpdated(!isUserDataUpdated)
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
  }

  const removeUserTeam = (val, row) => {
    deleteApiWithReqBody({ userId: [row.userId], teamId: [val] }, '/teamuser', 'successfully re-assigned team')
      .then((res: any) => {
        setIsUserDataUpdated(!isUserDataUpdated)
        reloadTeamData()
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
  }

  const deleteUser = (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (confirmed) {
      deleteApi(userId, '/user', 'User has been deleted ')
        .then((res: any) => {
          handleReloadUserData()
        })
        .catch((error: any) => {
          console.log('error feching data', error)
        })
    }
  }

  const handleReloadUserData = () => {
    setIsUserDataUpdated(!isUserDataUpdated)
  }

  const userColumn = [
    {
      title: '',
      dataIndex: '',
      width: 40,
      render: (team) => <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />,
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      width: 200,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      width: 100,
    },
    {
      title: 'Timezone',
      dataIndex: 'timeZone',
      width: 100,
    },
    {
      title: 'Team(s)',
      dataIndex: 'teamList',
      width: 240,
      render: (teams, row) => {
        const transformedTeamList = teamList.map(({ teamId, teamName }) => ({
          value: teamId,
          label: teamName,
        }))
        return (
          <Select
            mode="multiple"
            tagRender={tagRender}
            showArrow
            onSelect={(val) => updateUserTeam(val, row)}
            onDeselect={(val) => removeUserTeam(val, row)}
            value={teams}
            style={{ width: '100%' }}
            options={transformedTeamList}
            placeholder="Select Teams"
            clearIcon={false}
            maxTagCount={'responsive'}
          />
        )
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      width: 70,
      key: 'x',
      render: (data) => {
        return (
          <Space>
            <EditOutlined
              onClick={() => {
                showCreateModal(data)
              }}
              style={{ fontSize: '18px' }}
            />
            <DeleteOutlined onClick={() => deleteUser(data.userId)} style={{ fontSize: '18px' }} />
          </Space>
        )
      },
    },
  ]

  const showCreateModal = (data) => {
    setEditRecord(data)
    setCreateModalOpen(true)
  }

  const userCreateSave = () => {
    setCreateModalOpen(false)
  }

  const handleCreateModalCancel = () => {
    createModalOpen && setCreateModalOpen(false)
  }

  return (
    <div style={{ paddingRight: 40 }}>
      {createModalOpen && (
        <CreateModal
          data={editRecord}
          isModalOpen={createModalOpen}
          handleOk={userCreateSave}
          handleCancel={handleCreateModalCancel}
          teamAssignment={teamList}
          userData={userData}
          country={[]}
          timeZone={[]}
          handleChangeUserData={handleReloadUserData}
          reloadTeamData={reloadTeamData}
        />
      )}

      <Title level={3}>Users</Title>
      <Row justify={'space-between'}>
        <Col>
          <Search
            style={{ width: '400px' }}
            onSearch={setSearchWord}
            allowClear
            enterButton="Search"
            size="large"
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col>
          <Button type="primary" size="large" onClick={() => showCreateModal(null)}>
            Create User
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }} justify={'end'}>
        <Col span={24}>
          <ReactDragListView.DragColumn nodeSelector={'tr'} onDragEnd={(fromIndex, toIndex) => {}}>
            <Table
              columns={userColumns}
              dataSource={userData}
              pagination={false}
              loading={loadingUserData}
              scroll={{ y: 500 }}
              rowKey={'userId'}
              onRow={(record, rowIndex) => {
                return {
                  onDragStart: (event) => handleDragStart(event, record),
                }
              }}
            />
          </ReactDragListView.DragColumn>
        </Col>
        {/* <Col>
          <div style={{ marginTop: 10 }}>
            <Pagination
              defaultCurrent={1}
              current={pageNumber}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              total={totalItems}
              showSizeChanger={false}
              responsive={true}
              showLessItems={true}
            />
          </div>
        </Col> */}
      </Row>
    </div>
  )
}
