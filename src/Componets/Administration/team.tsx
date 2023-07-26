import React, { useState } from 'react'
import { Button, Typography, Input, Row, theme, Col, Select, Table } from 'antd'
import { SearchOutlined, CloseSquareOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import CreateModal from './Modals/createTeamModal'
import { deleteApi, postApi } from '../../Api/Api'
const { Title } = Typography
const { Search } = Input

const permissions = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Team Admin' },
  { value: 3, label: 'Read-Only' },
]

export default function Team({
  handleDragOver,
  handleDrop,
  addToTeam,
  teamColumns,
  teamData,
  dropZoneActive,
  handleChangeTeamData,
  loading,
}) {
  const { useToken }: { useToken: any } = theme
  const { token }: { token: any } = useToken()

  const [createTeamModalOpen, setCreateTeamModalOpen] = useState<boolean>(false)

  // Create Team Modal Handling changes
  const createTeamSave = () => {
    setCreateTeamModalOpen(false)
  }
  const handleCreateTeamModalCancel = () => {
    createTeamModalOpen && setCreateTeamModalOpen(false)
  }
  const showCreateTeamModal = () => {
    setCreateTeamModalOpen(true)
  }
  const deleteUserFromTeam = (userId) => {
    deleteApi(userId, '/teamuser')
      .then((res: any) => {
        handleChangeTeamData()
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
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
          {props.record.members && props.record.members.length} <CaretUpOutlined />
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
          {props.record.members && props.record.members.length} <CaretDownOutlined />
        </Button>
      )
    }
  }

  const onPermissionRoleChange = (data, roleId) => {
    const updatedMember = {
      teamId: data.teamId,
      roleId: roleId,
      userRoleId: data.userRoleId,
    }
    postApi(updatedMember, '/teamuser', 'successfully assigned role')
      .then((res: any) => {
        // handleChangeTeamData(true)
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

    return (
      <Table
        columns={memberColumn}
        dataSource={members}
        pagination={false}
        rowKey={'userId'}
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
    <div>
      {createTeamModalOpen && (
        <CreateModal
          isModalOpen={createTeamModalOpen}
          handleOk={createTeamSave}
          handleCancel={handleCreateTeamModalCancel}
          handleChangeTeamData={handleChangeTeamData}
        />
      )}
      <Title level={3}>Teams</Title>
      <Row justify={'space-between'}>
        <Col>
          <Search
            // onSearch={setSearchWord}
            allowClear
            enterButton="Search"
            size="large"
            className="custom-secondary-search"
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col>
          <Button onClick={showCreateTeamModal} style={{ background: token.colorSecondary }} size="large">
            Create Team
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Col span={24}>
          <Table
            columns={teamColumns}
            dataSource={teamData}
            pagination={false}
            scroll={{ y: 500 }}
            rowKey={'teamId'}
            loading={loading}
            expandable={{
              expandedRowRender: (record, index) => {
                return (
                  <div key={index} className={`drop-zone ${dropZoneActive ? 'active' : ''}`}>
                    {getMembersTable(record.members, record.key)}
                  </div>
                )
              },
              expandIcon: (props) => customExpandIcon(props),
            }}
          />
        </Col>
      </Row>
    </div>
  )
}
