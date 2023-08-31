import React, { useState, useEffect } from 'react'
import { Table, Tag, Select } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import { useNavigate } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'

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

  const navigate = useNavigate()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Table
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            if (event.target) {
              navigate(`/search/${record.projectId}/${record.teamId}`)
            }
          },
        }
      }}
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
