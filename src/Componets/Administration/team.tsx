import React, { useState, useEffect } from 'react'
import { Button, Typography, Input, Row, theme, Col, Select, Table, Space, Pagination } from 'antd'
import { SearchOutlined, CloseSquareOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import CreateModal from './Modals/createTeamModal'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { deleteApi, postApi, getApi, deleteApiWithReqBody } from '../../Api/Api'
import { deepClone } from '../Common/Utils'

const { Title } = Typography
const { Search } = Input

interface teamDataType {
  teamId: React.Key
  teamName: string
  teamAdmin: string
  members: any
  percentage: string
}

const permissions = [
  { value: 1, label: 'Team Member' },
  { value: 2, label: 'Team Admin' },
  { value: 3, label: 'Read-Only' },
]

export default function Team({ draggedItem, updateTeamDataFromUser, reloadUserData, setTeamList }) {
  const { useToken }: { useToken: any } = theme
  const { token }: { token: any } = useToken()

  const [createTeamModalOpen, setCreateTeamModalOpen] = useState<boolean>(false)
  const [teamColumns, setTeamColumns] = useState<ColumnsType<teamDataType>>([])
  const [loadingTeamData, setloadingTeamData] = useState<boolean>(false)
  const [teamData, setTeamData] = useState([])
  const [isTeamDataUpdated, setIsTeamDataUpdated] = useState<boolean>(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const [editRecord, setEditRecord] = useState({})
  const [searchTeam, setSearchTeam] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setloadingTeamData(true)
    const params = {
      SearchTerm: searchTeam,
      ItemsPerPage: itemsPerPage,
      PageNumber: pageNumber
    }
    getApi(params, '/teamsearch')
      .then((res) => {
        setloadingTeamData(false)
        setTeamData(res.teamList)
        setTeamList(res.teamList)
        setTotalItems(res.totalItems)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
  }, [isTeamDataUpdated, updateTeamDataFromUser, searchTeam, itemsPerPage, pageNumber])

  const setSearchWord = (searchVal) => {
    setSearchTeam(searchVal)
  }

  const handlePageChange = (page) => {
    setPageNumber(page)
  }

  const deleteTeam = (teamId) => {
    const confirmed = window.confirm('Are you sure you want to delete this team?');
    if (confirmed) {
      deleteApi(teamId, '/team')
        .then((res: any) => {
          setIsTeamDataUpdated(!isTeamDataUpdated)
        })
        .catch((error: any) => {
          console.log('error feching data', error)
        })
    }
  }

  const handleDrop = (event, key) => {
    event.preventDefault()
    const modifiedTeamData = deepClone(teamData)
    let index = -1
    const dropTeamIndex = modifiedTeamData.filter((val, i) => {
      if (val.teamId === key) {
        index = i
      }
      return val.teamId === key
    })[0]

    const updatedMember = {
      teamId: [dropTeamIndex.teamId],
      userId: [draggedItem.userId],
    }
    postApi(updatedMember, '/teamuser', 'successfully assigned role')
      .then((res: any) => {
        if (res.result) {
          draggedItem.roleId = 3 // default user Role
          dropTeamIndex['members'] = [...dropTeamIndex['members'], draggedItem]
          if (index >= 0) {
            modifiedTeamData[index] = dropTeamIndex
            setTeamData(modifiedTeamData)
          }
          setIsTeamDataUpdated(!isTeamDataUpdated)
          reloadUserData()
        }
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDropZoneActive(true)
  }

  const teamColumn = [
    {
      title: 'Team Name',
      dataIndex: 'teamName',
    },
    {
      title: 'Team Admin(s)',
      dataIndex: '',
      render: (data, row) => {
        const members = data.members && data.members.filter((member) => member.roleId && member.roleId === 2)
        let teamAdmins: string[] = []
        members && members.forEach((member: any) => teamAdmins.push(member.userName.split(' ')[0]))
        return <p>{teamAdmins.join(', ')}</p>
      },
    },
    {
      title: 'Members',
      dataIndex: 'members',
      render: (members, row) => '',
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Capacity',
      dataIndex: 'percentage',
      render: (percentage) => <Typography style={{ color: '#85D305' }}>{percentage} %</Typography>,
    },
    {
      title: 'Action',
      dataIndex: '',
      width: 120,
      key: 'x',
      render: (data) => {
        return (
          <Space>
            <EditOutlined onClick={() => showCreateTeamModal(data)} style={{ fontSize: '18px' }} />
            {/* <PlusSquareOutlined style={{ fontSize: '18px' }} /> */}
            <DeleteOutlined onClick={() => deleteTeam(data.teamId)} style={{ fontSize: '18px' }} />
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    setTeamColumns(teamColumn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamData])

  // Create Team Modal Handling changes
  const createTeamSave = () => {
    setCreateTeamModalOpen(false)
  }
  const handleCreateTeamModalCancel = () => {
    createTeamModalOpen && setCreateTeamModalOpen(false)
  }
  const showCreateTeamModal = (data) => {
    setEditRecord(data)
    setCreateTeamModalOpen(true)
  }
  const deleteUserFromTeam = (userRoleId) => {
    const confirmed = window.confirm('Are you sure you want to delete this team user?');
    if (confirmed) {
      deleteApiWithReqBody({ userRoleId: userRoleId }, '/teamuser')
        .then((res: any) => {
          setIsTeamDataUpdated(!isTeamDataUpdated)
          reloadUserData()
        })
        .catch((error: any) => {
          console.log('error feching data', error)
        })
    }
  }

  const customExpandIcon = (props) => {
    if (props.expanded) {
      return (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            props.onExpand(props.record, e)
          }}
        >
          {(props.record.members && props.record.members.length) || 0} <CaretUpOutlined />
        </Button>
      )
    } else {
      return (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            props.onExpand(props.record, e)
          }}
        >
          {(props.record.members && props.record.members.length) || 0} <CaretDownOutlined />
        </Button>
      )
    }
  }

  const onPermissionRoleChange = (data, roleId) => {
    const updatedMember = {
      teamId: [data.teamId],
      roleId: roleId,
      userRoleId: data.userRoleId,
    }
    postApi(updatedMember, '/teamuser', 'successfully assigned role')
      .then((res: any) => {
        console.log(res.result)
        setIsTeamDataUpdated(!isTeamDataUpdated)
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
  }

  const getMembersTable = (members, key) => {
    const memberColumn = [
      {
        title: 'User Name',
        dataIndex: 'userName',
      },
      {
        title: 'Permission Level',
        dataIndex: '',
        width: 300,
        render: (data) => {
          return (
            <Select
              showArrow
              defaultValue={data.roleId}
              onChange={(val) => onPermissionRoleChange(data, val)}
              style={{ width: '80%' }}
              options={permissions}
              placeholder="Select Teams"
            />
          )
        },
      },
      {
        title: 'Remove',
        dataIndex: '',
        align: 'center' as const,
        width: 120,
        key: 'x',
        render: (data) => (
          <CloseSquareOutlined onClick={() => deleteUserFromTeam(data.userRoleId)} style={{ fontSize: '18px' }} />
        ),
      },
    ]

    const renderEmptyRow = () => {
      return (
        <div onDrop={(event) => handleDrop(event, key)} onDragOver={(event) => handleDragOver(event)} >
          <div>No data found</div>
        </div>
      );
    };

    return (
      <Table
        columns={memberColumn}
        dataSource={members}
        pagination={false}
        rowKey={'userId'}
        locale={{
          emptyText: renderEmptyRow,
        }}
        onRow={(record, rowIndex) => {
          return {
            onDragOver: (event) => handleDragOver(event),
            onDrop: (event) => handleDrop(event, key),
          }
        }}
      />
    )
  }

  return (
    <div style={{ paddingLeft: 40 }}>
      {createTeamModalOpen && (
        <CreateModal
          isModalOpen={createTeamModalOpen}
          handleOk={createTeamSave}
          handleCancel={handleCreateTeamModalCancel}
          handleChangeTeamData={setIsTeamDataUpdated}
          data={editRecord}
        />
      )}
      <Title level={3}>Teams</Title>
      <Row justify={'space-between'}>
        <Col>
          <Search
            onSearch={setSearchWord}
            allowClear
            enterButton="Search"
            size="large"
            className="custom-secondary-search"
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col>
          <Button className='secondary-btn' onClick={() => showCreateTeamModal(null)} style={{ background: token.colorSecondary }} size="large">
            Create Team
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }} justify={'end'}>
        <Col span={24}>
          <Table
            columns={teamColumns}
            dataSource={teamData}
            pagination={false}
            scroll={{ y: 500 }}
            rowKey={'teamId'}
            loading={loadingTeamData}
            expandable={{
              expandedRowRender: (record, index) => {
                return (
                  <div key={index} className={`drop-zone ${dropZoneActive ? 'active' : ''}`}>
                    {getMembersTable(record.members, record.teamId)}
                  </div>
                )
              },
              expandIcon: (props) => customExpandIcon(props),
            }}
          />
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
