import React, { useState, useEffect } from 'react'
import { Table, Tag, Select } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'

const onChange: TableProps<Notification>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}
interface NotificationProps {
  columnsNotifications: ColumnsType<Notification>
  notifications: Notification[]
  loading: boolean
}

const MyQueueDataGrid: React.FC<NotificationProps> = ({ columnsNotifications, notifications, loading }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Table
      columns={columnsNotifications}
      scroll={{ y: 450 }}
      rowSelection={rowSelection}
      dataSource={notifications}
      onChange={onChange}
      pagination={false}
      rowKey={'notificationId'}
      loading={loading}
    />
  )
}

export default MyQueueDataGrid
