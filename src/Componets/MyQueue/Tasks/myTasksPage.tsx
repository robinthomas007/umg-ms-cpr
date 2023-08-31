import React, { useState, useRef, useEffect } from 'react'

import type { MenuProps } from 'antd'
import { Col, Row, Menu, Space, Button, Input, Tag, Select, Divider, Progress, Typography, Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import { countValues } from '../../Common/Utils'
import {
  DownloadOutlined,
  PlusCircleFilled,
  WechatOutlined,
  SettingOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import ProjectSearchDataTable from '../../Search/ProjectSearchDataTable'
import TaskDataGrid from './myTaskDataGrid'
const { Title, Text } = Typography
const { Search } = Input

const taskSearchInitialState = {
  loading: false,
  error: '',
  tasks: [],
  updatedDate: '',
  totalPages: 0,
  totalItems: 0,
  searchTerm: '',
  itemsPerPage: '10',
  pageNumber: 1,
  sortColumns: 'updatedDate',
  sortOrder: '',
  searchWithin: ['ALL'],
  tableSearch: {},
}

function TasksPage() {
  const [searchFilters, setSearchFilters] = useState<taskSearchState>(taskSearchInitialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = React.useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [openNotesModal, setNotesModal] = useState<boolean>(false)

  const [tasks, setTasks] = useState<Tasks[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedFilters, setSelectedFilters] = React.useState<any>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const showFilterModal = () => {
    setIsFilterModalOpen(true)
  }
  const onSearch = (value: string) => {
    setSearchTerm(value)
    setSearch('')
  }
  const setSearchTerm = (searchTerm: string) => {
    setSearchFilters((prev) => ({ ...prev, searchTerm }))
  }

  const handlePageChange: PaginationProps['onChange'] = (page) => {
    setPageNumber(page)
    setSearchFilters((prev) => ({ ...prev, pageNumber: page }))
  }

  const handleLimitChange = (limit: { value: string; label: React.ReactNode }) => {
    setItemsPerPage(Number(limit.value))
    setSearchFilters((prev) => ({ ...prev, itemsPerPage: limit.value }))
  }

  const handleSelectedFilters = (filters) => {
    setSelectedFilters(Object.entries(filters))
    setSearchFilters((prevState) => ({ ...prevState, ...filters }))
    closeFilterModal()
  }
  const closeFilterModal = () => {
    setIsFilterModalOpen(false)
  }

  const columnsTasks: ColumnsType<Tasks> = [
    {
      title: 'Prirority',
      dataIndex: 'projectName',
      key: 'projectId',
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: 'Project Title',
      dataIndex: 'title',
      key: 'taskId',
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: 'Title/Artist List',
      dataIndex: 'artistList',
      key: 'artistList',
    },
    {
      title: 'Platform(s)',
      dataIndex: 'platforms',
      key: 'platforms',
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: 'My Progress',
      dataIndex: 'progress',
      key: 'progress',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => console.log('onclcick')} icon={<EditOutlined />} size={'middle'} />
          <Button onClick={() => console.log('onclcick')} icon={<WechatOutlined />} size={'middle'} />
        </Space>
      ),
    },
  ]

  return (
    <>
      {/* <Title>MyQueue</Title>
      <Menu className="admin-menu" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /> */}
      <Row style={{ padding: '50px' }}>
        <Col span={8} offset={8}>
          <Row>
            <Col span={2}>
              {' '}
              <Button onClick={showFilterModal} icon={<SettingOutlined />} size={'large'} />
            </Col>
            <Col span={22}>
              <Search
                prefix={<SearchOutlined />}
                className="search"
                onSearch={onSearch}
                size="large"
                enterButton="Search"
                allowClear
              />
            </Col>
          </Row>
          <br />
          {/* {selectedFilters &&
            selectedFilters.map((item) => {
              if (typeof item[1] !== 'undefined' && item[1] !== '' && item[1]) {
                return tagElement(item[0], item[1])
              }
              return null
            })} */}

          {/* <NotesModal projectData={project} open={openNotesModal} handleClose={handleNotesModal} /> */}
        </Col>
      </Row>
      <br />

      <Row justify="space-evenly">
        <Col span={8}>
          <Text>Viewing &nbsp;</Text>
          {''}
          <Select
            labelInValue
            defaultValue={countValues[0]}
            style={{ width: 56 }}
            onChange={handleLimitChange}
            options={countValues}
          />
          &nbsp;&nbsp;
          <Text>of {totalItems} Results</Text>
        </Col>
        <Col span={8} push={3}>
          <Pagination
            defaultCurrent={1}
            current={pageNumber}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            total={totalItems}
            showSizeChanger={false}
            responsive={true}
            showLessItems={true}
          />
        </Col>
      </Row>
      <br />
      <br />
      <Divider plain className="divider" style={{ marginBottom: '0px' }} />
      <Row className="dataTable">
        <Col span={24}>
          <TaskDataGrid loading={loading} columnsTasks={columnsTasks} tasks={tasks} />
        </Col>
      </Row>
    </>
  )
}

export default TasksPage
