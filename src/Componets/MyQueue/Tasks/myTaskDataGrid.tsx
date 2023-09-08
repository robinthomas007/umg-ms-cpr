import React, { useState, useEffect } from 'react'
import { Table, Tag, Select } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
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
      onRow={(record: any, rowIndex) => {
        return {
          onClick: (event) => {
            if (event.target) {
              navigate(`/search/${record.projectId}/${record.teamId}?projectName=${record.title}`)
            }
          },
        }
      }}
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
