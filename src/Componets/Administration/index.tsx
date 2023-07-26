import React, { useState, useEffect } from 'react'
import { Typography, Space, Layout, Row, theme, Col, Select, Table, Menu } from 'antd'
import { Content } from 'antd/es/layout/layout'
import type { MenuProps } from 'antd'
import './admin.css'
import { EditOutlined, DeleteOutlined, HolderOutlined, PlusSquareOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { deleteApi, postApi } from '../../Api/Api'
import User from './user'
import Team from './team'
import { deepClone } from '../Common/Utils'
import { getApi } from '../../Api/Api'
import EditUserModal from './Modals/editUserModal'
import EditTeamModal from './Modals/editTeamModal'

const { Title } = Typography

interface UserDataType {
  key: React.Key
  username: string
  country: string
  timezone: string
  teams: any
}

interface teamDataType {
  key: React.Key
  teamName: string
  teamAdmin: string
  members: any
  percentage: string
}

const { Option } = Select

export default function Administration() {
  const [current, setCurrent] = useState('user')
  const [userColumns, setUserColumns] = useState<ColumnsType<UserDataType>>([])
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false)
  const [isUserDataUpdated, setIsUserDataUpdated] = useState<boolean>(false)
  const [teamColumns, setTeamColumns] = useState<ColumnsType<teamDataType>>([])
  const [loadingTeamData, setloadingTeamData] = useState<boolean>(false)
  const [isTeamDataUpdated, setIsTeamDataUpdated] = useState<boolean>(false)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [teamData, setTeamData] = useState([])
  const [userData, setUserData] = useState([])
  const [teamList, setTeamList] = useState([])
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [editTeamModalOpen, setEditTeamModalOpen] = useState<boolean>(false)
  const [editRecord, setEditRecord] = useState<any>({})
  const [editTeamRecord, setEditTeamRecord] = useState<any>({})

  const { useToken }: { useToken: any } = theme
  const { token }: { token: any } = useToken()

  const items: MenuProps['items'] = [
    {
      label: 'User & Team Management',
      key: 'user',
    },
    {
      label: 'Reporting',
      key: 'report',
    },
    {
      label: 'CPR Metrics',
      key: 'cpr',
    },
  ]

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
        members.forEach((member: any) => teamAdmins.push(member.userName.split(' ')[0]))
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
            <EditOutlined onClick={() => showEditTeamModal(data.teamId)} style={{ fontSize: '18px' }} />
            <PlusSquareOutlined style={{ fontSize: '18px' }} />
            <DeleteOutlined onClick={() => deleteTeam(data.teamId)} style={{ fontSize: '18px' }} />
          </Space>
        )
      },
    },
  ]

  const handleDragStart = (event, item) => {
    setDraggedItem(item)
  }

  const handleDrop = (event, key) => {
    event.preventDefault()
    const modifiedTeamData = deepClone(teamData)
    let index = -1
    const dropTeamIndex = modifiedTeamData.filter((val, i) => {
      if (val.key === key) {
        index = i
      }
      return val.key === key
    })[0]
    dropTeamIndex['members'] = [...dropTeamIndex['members'], draggedItem]
    if (index >= 0) {
      modifiedTeamData[index] = dropTeamIndex
      setTeamData(modifiedTeamData)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDropZoneActive(true)
  }
  const deleteUser = (userId) => {
    deleteApi(userId, '/user')
      .then((res: any) => {
        handleUserData()
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
  }

  const deleteTeam = (teamId) => {
    console.log('deleted Team', teamId)
    deleteApi(teamId, '/team')
      .then((res: any) => {
        handleTeamData()
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
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
        return (
          <Select
            mode="tags"
            showArrow
            value={teamList.filter((team: any) => teams.includes(team.teamId)).map((team: any) => team.teamId)}
            style={{ width: '80%' }}
            tokenSeparators={[',']}
            placeholder="Select Teams"
          >
            {teamList.map((option: any) => (
              <Option key={option.teamId} value={option.teamId}>
                {option.teamName}
              </Option>
            ))}
          </Select>
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
                showEditModal(data.userId)
              }}
              style={{ fontSize: '18px' }}
            />
            <DeleteOutlined onClick={() => deleteUser(data.userId)} style={{ fontSize: '18px' }} />
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    setUserColumns(userColumn)
    setTeamColumns(teamColumn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, teamData])

  useEffect(() => {
    // user API
    setLoadingUserData(true)
    getApi('', '/user/getalluser')
      .then((res) => {
        setLoadingUserData(false)
        console.log('userData', res)
        setTeamList(res.teams)
        setUserData(res.users)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
    // {"userId":0,"firstName":"bbb","lastName":"ccc","email":"bbbccc@gmail.com",
    // "country":"US","timeZone":"UTC","teamAssignment":[1,2],"isDelete":false}
    // team API
  }, [isUserDataUpdated])

  useEffect(() => {
    setloadingTeamData(true)
    getApi('', '/TeamUser')
      .then((res) => {
        setloadingTeamData(false)
        console.log('teamsData', res)
        setTeamData(res)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
  }, [isTeamDataUpdated])

  const addToTeam = () => {}

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
  }
  const handleUserData = () => {
    setIsUserDataUpdated(!isUserDataUpdated)
  }

  const handleTeamData = () => {
    setIsTeamDataUpdated(!isTeamDataUpdated)
  }
  const showEditModal = (userId) => {
    const user = userData.find((user: any) => user.userId === userId)
    console.log('selectedUser', user)
    setEditRecord(user)
    setEditModalOpen(true)
  }

  const handleEditModalCancel = () => {
    editModalOpen && setEditModalOpen(false)
  }

  const userEditSave = () => {
    setEditModalOpen(false)
  }
  const showEditTeamModal = (teamId) => {
    const team = teamData.find((team: any) => team.teamId === teamId)
    setEditTeamRecord(team)
    setEditTeamModalOpen(true)
  }

  const handleEditTeamModalCancel = () => {
    editTeamModalOpen && setEditTeamModalOpen(false)
  }

  const teamEditSave = () => {
    setEditTeamModalOpen(false)
  }

  return (
    <Layout>
      <Content style={{ padding: '70px 70px 60px' }} className="admin-wrapper">
        <Title level={3}>User & Team Management</Title>
        <Menu
          style={{ background: token.colorDark, margin: '30px auto' }}
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
        ;
        <Row justify={'space-between'}>
          <Col span={11}>
            <User
              userColumns={userColumns}
              loading={loadingUserData}
              teamList={teamList}
              userData={userData}
              handleDragStart={handleDragStart}
              handleChangeUserData={handleUserData}
            />
          </Col>
          <Col span={11} offset={1}>
            <Team
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              addToTeam={addToTeam}
              teamColumns={teamColumns}
              teamData={teamData}
              dropZoneActive={dropZoneActive}
              handleChangeTeamData={handleTeamData}
              loading={loadingTeamData}
            />
          </Col>
        </Row>
      </Content>
      {editModalOpen && (
        <EditUserModal
          data={editRecord}
          isModalOpen={editModalOpen}
          handleOk={userEditSave}
          handleCancel={handleEditModalCancel}
          teamAssignment={teamList}
          country={[]}
          timeZone={[]}
          handleChangeUserData={handleUserData}
        />
      )}
      {editTeamModalOpen && (
        <EditTeamModal
          data={editTeamRecord}
          isModalOpen={editTeamModalOpen}
          handleOk={teamEditSave}
          handleCancel={handleEditTeamModalCancel}
          handleChangeTeamData={handleTeamData}
        />
      )}
    </Layout>
  )
}
