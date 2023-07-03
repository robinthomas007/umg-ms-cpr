import React, { useState, useEffect } from 'react'
import { Table, Tag, Select } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'

const onChange: TableProps<Project>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}
interface ProjectsProps {
  columsProjects: ColumnsType<Project>
  projects: Project[]
  state: any
}

const DataGrid: React.FC<ProjectsProps> = ({ columsProjects, projects, state }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)

  const start = () => {
    setLoading(true)
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Table
      columns={columsProjects}
      scroll={{ y: 450 }}
      rowSelection={rowSelection}
      dataSource={projects}
      onChange={onChange}
      pagination={false}
      rowKey={'projectId'}
      loading={state.loading}
    />
  )
}

export default DataGrid
