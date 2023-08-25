import React, { useState, useEffect } from 'react'
import { Table, Tag, Select } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'

const onChange: TableProps<Tasks>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}
interface TaskProps {
  columnsTasks: ColumnsType<Tasks>
  tasks: Tasks[]
  loading: boolean
}

const TaskDataGrid: React.FC<TaskProps> = ({ columnsTasks, tasks, loading }) => {
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
      columns={columnsTasks}
      scroll={{ y: 450 }}
      rowSelection={rowSelection}
      dataSource={tasks}
      onChange={onChange}
      pagination={false}
      rowKey={'taskId'}
      loading={loading}
    />
  )
}

export default TaskDataGrid
