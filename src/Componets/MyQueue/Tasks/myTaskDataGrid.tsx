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
  setSort: any
}

const TaskDataGrid: React.FC<TaskProps> = ({ columnsTasks, tasks, loading, setSort }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const handleChange = (pagination, filters: any, sorter: any) => {
    if (sorter.order && sorter.columnKey) {
      setSort(sorter.order === 'descend' ? 'desc' : 'asc', sorter.columnKey)
    }
  }

  return (
    <Table
      columns={columnsTasks}
      scroll={{ y: 450 }}
      rowSelection={rowSelection}
      dataSource={tasks}
      onChange={handleChange}
      pagination={false}
      rowKey={'taskId'}
      loading={loading}
    />
  )
}

export default TaskDataGrid
