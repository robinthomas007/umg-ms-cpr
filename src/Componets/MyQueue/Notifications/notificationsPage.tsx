import React, { useState, useRef, useEffect } from 'react'
import { getApi } from '../../../Api/Api'

import NotificationGridData from './notificationDataGrid'
import type { MenuProps } from 'antd'
import { Col, Row, Menu, Space, Button, Input, Tag, Select, Divider, Progress, Typography, Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import { countValues } from '../../Common/Utils'
import NotificationsSearchFilterModal from './NotificationsSearchFilterModal'
import NotesModal from '../../Modal/NotesModal'
import {
  DownloadOutlined,
  PlusCircleFilled,
  WechatOutlined,
  SettingOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
const { Title, Text } = Typography
const { Search } = Input

const notificationSearchInitialState = {
  loading: false,
  error: '',
  notifications: [],
  reportedBy: '',
  type: '',
  updatedFrom: '',
  updatedTo: '',
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

function NotificationsPage() {
  const [searchFilters, setSearchFilters] = useState<notificationSearchState>(notificationSearchInitialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = React.useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [openNotesModal, setNotesModal] = useState<boolean>(false)
  const [userFacets, setUserFacts] = useState<ReportedUser[]>([])
  const [typeFacets, setTypeFacets] = useState<NotificationType[]>([])

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedFilters, setSelectedFilters] = React.useState<any>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedNoti, setSelectedNoti] = useState<any>({})

  const typeData = ['Notification', 'Task']

  useEffect(() => {
    const {
      searchTerm,
      itemsPerPage,
      reportedBy,
      updatedFrom,
      updatedTo,
      type,
      pageNumber,
      sortColumns,
      sortOrder,
      tableSearch,
      searchWithin,
    } = searchFilters
    setLoading(true)
    const params = {
      searchTerm,
      sortColumn: sortColumns,
      sortOrder,
      searchWithins: searchWithin ? searchWithin.toString() : 'ALL',
      reportedBy,
      updatedFrom,
      updatedTo,
      type,
      itemsPerPage,
      pageNumber,
    }

    getApi(params, '/notificationsearch')
      .then((res) => {
        setLoading(false)
        setNotifications(res.notificationResponse)
        setTotalItems(res.totalItems)
        setUserFacts(res.usersFacets)
        setTypeFacets(res.typeFacets)
        setTotalPages(Number(res.totalPages))
      })
      .catch((err) => {
        setLoading(false)
        console.log('error feching data', err)
        // showErrorNotification(err.message)
      })
  }, [searchFilters])

  const showFilterModal = () => {
    setIsFilterModalOpen(true)
  }
  const onSearch = (value: string) => {
    setSearchTerm(value)
    setSearch('')
  }
  const getUpdatedNotificationList = () => {
    setSearchFilters({ ...searchFilters, pageNumber: 1 })
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
  const columnsNotification: ColumnsType<Notification> = [
    {
      title: 'Updated Date',
      dataIndex: 'updatedDateTime',
      key: 'notificationId',
    },
    {
      title: 'Project',
      dataIndex: 'sourceName',
      key: 'notificationId',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      // render: (text, record: any) => {
      //   // Check if the cell should be highlighted
      //   const isHighlighted = record.description === 'Vishveshwar Duraiswamy just added a new note for the Project'

      //   // Define the cell's style based on the highlighting condition
      //   const cellStyle = isHighlighted ? { color: 'red' } : {}

      //   return <div style={cellStyle}>{text}</div>
      // },
    },
    {
      title: 'Note',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'ReportedBy',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Actions',
      render: (_, record: any) => (
        <Space size="middle">
          <Button onClick={(e) => showNotesModal(e, record.notificationId)} icon={<WechatOutlined />} size={'middle'} />
        </Space>
      ),
    },
  ]

  const showNotesModal = (e, notificationId) => {
    e.stopPropagation()
    const selectedNotification = notifications.find(
      (notification: any) => notification.notificationId === notificationId
    )
    setSelectedNoti(selectedNotification)
    setNotesModal(true)
  }

  const handleTagClose = (removedTag) => {
    const modifiiedFilters = selectedFilters.filter((item) => item[0] !== removedTag)
    setSelectedFilters(modifiiedFilters)
    setSearchFilters((prev) => ({ ...prev, [removedTag]: null }))
  }

  const renderFilterTags = (type: string, tag) => {
    const dropDownFacets = {
      reportedBy: userFacets,
      type: typeFacets,
    }
    if (dropDownFacets[type]) {
      return dropDownFacets[type].find((item) => item.id === tag).name
    }
    return `${tag}`
  }

  const tagElement = (type, tag) => {
    const tagElem = (
      <>
        <span>{`${type}:`}</span>
        <Tag
          color={'#85D305'}
          closable
          onClose={(e) => {
            e.preventDefault()
            handleTagClose(type)
          }}
          style={{ margin: '5px' }}
        >
          {/* {type === 'reportedBy' && userFacets[Number(tag)]}
          {type === 'type' && typeFacets[Number(tag)]} */}
          {tag && renderFilterTags(type, tag)}
        </Tag>
      </>
    )
    return tagElem
  }
  const handleNotesModal = () => {
    setNotesModal(false)
  }

  return (
    <>
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
          {selectedFilters &&
            selectedFilters.map((item) => {
              if (typeof item[1] !== 'undefined' && item[1] !== '' && item[1]) {
                return tagElement(item[0], item[1])
              }
              return null
            })}
          <NotificationsSearchFilterModal
            open={isFilterModalOpen}
            userFacets={userFacets}
            typeFacets={typeFacets}
            handleClose={closeFilterModal}
            state={searchFilters}
            handleSelectedFilters={handleSelectedFilters}
            loading={loading}
            selectedFilters={selectedFilters}
          />
          <NotesModal
            soureName={selectedNoti.sourceName}
            sourceId={selectedNoti.notificationId}
            soure={'Notifications'}
            open={openNotesModal}
            handleClose={handleNotesModal}
          />

          {/* <NotesModal projectData={project} open={openNotesModal} handleClose={handleNotesModal} /> */}
        </Col>
      </Row>

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
        <Col span={8} className="paginationAlignment">
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
      <Divider plain className="divider" style={{ marginBottom: '0px' }} />
      <Row className="dataTable">
        <Col span={24}>
          <NotificationGridData
            loading={loading}
            columnsNotifications={columnsNotification}
            notifications={notifications}
            getUpdatedNotificationList={getUpdatedNotificationList}
          />
        </Col>
      </Row>
    </>
  )
}

export default NotificationsPage
