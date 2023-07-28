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
  loading: boolean
}

const DataGrid: React.FC<ProjectsProps> = ({ columsProjects, projects, loading }) => {
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
      columns={columsProjects}
      scroll={{ y: 450 }}
      rowSelection={rowSelection}
      dataSource={projects}
      onChange={onChange}
      pagination={false}
      rowKey={'projectId'}
      loading={loading}
    />
  )
}

export default DataGrid
