import React, { useState } from 'react'
import { Button, Typography, Input, Row, Col, Table } from 'antd'
import ReactDragListView from 'react-drag-listview'
import { SearchOutlined } from '@ant-design/icons'
import CreateModal from './Modals/createUserModal'

const { Title } = Typography
const { Search } = Input

export default function User({ userColumns, userData, handleDragStart, teamList, loading, handleChangeUserData }) {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const [editRecord, setEditRecord] = useState({})

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
          handleChangeUserData={handleChangeUserData}
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
          <Button type="primary" size="large" onClick={showCreateModal}>
            Create User
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Col span={24}>
          <ReactDragListView.DragColumn nodeSelector={'tr'} onDragEnd={(fromIndex, toIndex) => {}}>
            <Table
              columns={userColumns}
              dataSource={userData}
              pagination={false}
              loading={loading}
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
