import React, { useState, useEffect } from 'react'
import { Button, Typography, Input, Row, Col, Table, Select, Space } from 'antd'
import ReactDragListView from 'react-drag-listview'
import { SearchOutlined } from '@ant-design/icons'
import CreateModal from './Modals/createUserModal'
import { EditOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import { deleteApi, postApi, getApi } from '../../Api/Api'
import type { ColumnsType } from 'antd/es/table'

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

  useEffect(() => {
    setUserColumns(userColumn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  useEffect(() => {
    setLoadingUserData(true)
    getApi('', '/user/getalluser')
      .then((res) => {
        setLoadingUserData(false)
        setTeamList(res.teams)
        setUserData(res.users)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
  }, [isUserDataUpdated, reloadUserDataFromTeam])

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
    const index = row.teamList.indexOf(val);
    if (index !== -1) {
      row.teamList.splice(index, 1);
    }
    row.teamAssignment = row.teamList
    postApi(row, '/User', 'successfully assigned role')
      .then((res: any) => {
        setIsUserDataUpdated(!isUserDataUpdated)
        reloadTeamData()
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
  }


  const deleteUser = (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      deleteApi(userId, '/user', "User has been deleted ")
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
      width: 60,
      render: (team) => <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />,
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      width: 140,
    },
    {
      title: 'Country',
      dataIndex: 'country',
    },
    {
      title: 'Timezone',
      dataIndex: 'timeZone',
    },
    {
      title: 'Team(s)',
      dataIndex: 'teamList',
      width: 260,
      render: (teams, row) => {
        const transformedTeamList = teamList.map(({ teamId, teamName }) => ({
          value: teamId,
          label: teamName
        }));
        return (
          <Select
            mode="tags"
            showArrow
            onSelect={(val) => updateUserTeam(val, row)}
            onDeselect={(val) => removeUserTeam(val, row)}
            value={teams}
            style={{ width: '80%' }}
            tokenSeparators={[',']}
            options={transformedTeamList}
            placeholder="Select Teams"
          />
        )
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      width: 100,
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
    <div>
      {createModalOpen && (
        <CreateModal
          data={editRecord}
          isModalOpen={createModalOpen}
          handleOk={userCreateSave}
          handleCancel={handleCreateModalCancel}
          teamAssignment={teamList}
          country={[]}
          timeZone={[]}
          handleChangeUserData={handleReloadUserData}
        />
      )}

      <Title level={3}>Users</Title>
      <Row justify={'space-between'}>
        <Col>
          <Search
            // onSearch={setSearchWord}
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
      <Row style={{ marginTop: 30 }}>
        <Col span={24}>
          <ReactDragListView.DragColumn nodeSelector={'tr'} onDragEnd={(fromIndex, toIndex) => { }}>
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
      </Row>
    </div>
  )
}
