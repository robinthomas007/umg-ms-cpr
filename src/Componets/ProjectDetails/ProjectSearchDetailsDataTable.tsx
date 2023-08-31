import React, { useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface ProjectsProps {
  columsProjects: ColumnsType<ProjectDetails>
  projectsDetails: ProjectDetails[]
  loading: boolean,
  setSelectedRows: any,
  setSort: any
}

const DataGrid: React.FC<ProjectsProps> = ({ columsProjects, projectsDetails, loading, setSelectedRows, setSort }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setSelectedRows(newSelectedRowKeys)
  }

  const handleChange = (pagination, filters: any, sorter: any) => {
    if (sorter.order && sorter.columnKey) {
      setSort(sorter.order === 'descend' ? 'desc' : 'asc', sorter.columnKey)
    }
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
      dataSource={projectsDetails}
      onChange={handleChange}
      pagination={false}
      rowKey={'projectLinkId'}
      loading={loading}
      showSorterTooltip={false}
    />
  )
}

export default DataGrid
