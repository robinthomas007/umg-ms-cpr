import React, { useState, useRef, useEffect } from 'react'

import type { MenuProps } from 'antd'
import { Col, Row, Menu, Space, Button, Input, Tag, Select, Divider, Progress, Typography, Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import { countValues } from '../../Common/Utils'
import { getApi, deleteApi } from '../../../Api/Api'
import {
  DownloadOutlined,
  PlusCircleFilled,
  WechatOutlined,
  SettingOutlined,
  SearchOutlined,
  EditOutlined,
  DoubleRightOutlined,
  UpOutlined,
  DownOutlined,
  ProfileOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons'

import { ColumnsType } from 'antd/es/table'
import { Facebook, SoundCloud, DailyMotion, Image, Vimeo, Instagram, Tiktok, Twitter, Youtube } from './../../../images'

import TaskDataGrid from './myTaskDataGrid'
import ProjectSearchFilterModal from './ProjectSearchFilterModal'
import NotesModal from '../../Modal/NotesModal'
const { Title, Text } = Typography
const { Search } = Input

const platformImages = {
  FaceBook: Facebook,
  Soundcloud: SoundCloud,
  DailyMotion: DailyMotion,
  Vimeo: Vimeo,
  AudioMack: SoundCloud,
  Image: Image,
  Instagram: Instagram,
  TikTok: Tiktok,
  Twitter: Twitter,
  YouTube: Youtube,
}

const PriorityImg = {
  None: '',
  Low: <DownOutlined />,
  Medium: <ProfileOutlined />,
  High: <UpOutlined />,
  Critical: <DoubleRightOutlined />,
}
const taskSearchInitialState = {
  loading: false,
  error: '',
  tasks: [],
  totalPages: 0,
  totalItems: 0,
  searchTerm: '',
  batch: 1,
  status: '',
  teams: '',
  platforms: null,
  priority: null,
  startDate: '',
  endDate: '',
  assignedTo: '',
  itemsPerPage: '10',
  pageNumber: 1,
  sortColumns: 'priorityId',
  sortOrder: 'asc',
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
  const [task, setTask] = useState<any>([])

  const [pageNumber, setPageNumber] = useState(1)
  const [selectedFilters, setSelectedFilters] = React.useState<any>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [platformFacets, setPlatformFacets] = useState<Platform[]>([])
  const [teamFacets, setTeamFacets] = useState<Teams[]>([])
  const [statusFacets, setStatusFacets] = useState<Status[]>([])
  const [priorityFacets, setPriorityFacets] = useState<Priority[]>([])

  useEffect(() => {
    const {
      searchTerm,
      itemsPerPage,
      pageNumber,
      sortColumns,
      sortOrder,
      tableSearch,
      searchWithin,
      teams,
      platforms,
      status,
      priority,
      startDate,
      endDate,
    } = searchFilters
    setLoading(true)
    const params = {
      searchTerm: searchTerm,
      itemsPerPage: itemsPerPage,
      pageNumber: pageNumber,
      sortColumns: sortColumns,
      sortOrder: sortOrder,
      searchWithin: searchWithin ? searchWithin.toString() : 'ALL',
      platforms: platforms != null ? platforms.join(',') : platforms,
      teams: teams,
      status: status,
      priority: priority,
      startDate: startDate,
      endDate: endDate,
    }

    getApi(params, '/TaskSearch')
      .then((res) => {
        setLoading(false)

        setTasks(res.projects)
        setTotalItems(res.totalItems)
        setTotalPages(Number(res.totalPages))
        setPlatformFacets(res.platformFacets)
        setPriorityFacets(res.priorityFacets)
        setTeamFacets(res.teamFacets)
        setStatusFacets(res.statusFacets)
      })
      .catch((err) => {
        setLoading(false)
        console.log('error feching data', err)
        // showErrorNotification(err.message)
      })
  }, [searchFilters])

  const showNotesModal = (e, projectId) => {
    e.stopPropagation()
    const selectedTask = tasks.find((project) => project.projectId === projectId)
    setTask(selectedTask)
    setNotesModal(true)
  }
  const handleNotesModal = () => {
    setNotesModal(false)
  }

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

  const getUpdatedProjectList = () => {
    setSearchFilters({ ...searchFilters, pageNumber: 1 })
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

  const renderFilterTags = (type: string, tag) => {
    if (type === 'platforms') {
      return tag.split(',').map((tagProp) => {
        return `${platformFacets.find((platform) => platform.platformId === Number(tagProp))?.platformName}`
      })
    }
    if (type === 'status') {
      return `${statusFacets.find((status) => status.statusTypeId === tag)?.statusTypeDescription}`
    }
    if (type === 'priority') {
      return `${priorityFacets.find((priority) => priority.priorityId === tag)?.priorityName}`
    }
    if (type === 'teams') {
      return `${teamFacets.find((teams) => teams.teamId === tag)?.teamName}`
    }
    return `${tag}`
  }
  const handleTagClose = (removedTag, el?) => {
    let modifiiedFilters = []
    if (el) {
      modifiiedFilters = selectedFilters.map(([key, value]) => {
        if (key === removedTag && Array.isArray(value)) {
          return [key, value.filter((item) => item !== el)]
        }
        return [key, value]
      })
      const updatedVal = searchFilters[removedTag].filter((id) => id !== el)
      setSearchFilters((prev) => ({ ...prev, [removedTag]: updatedVal }))
      if (updatedVal.length === 0) {
        setSelectedFilters(selectedFilters.filter((item) => item[0] !== removedTag))
      } else {
        setSelectedFilters(modifiiedFilters)
      }
    } else {
      modifiiedFilters = selectedFilters.filter((item) => item[0] !== removedTag)
      setSearchFilters((prev) => ({ ...prev, [removedTag]: null }))
      setSelectedFilters(modifiiedFilters)
    }
  }

  const setSort = (order, field) => {
    setSearchFilters({
      ...searchFilters,
      sortOrder: order,
      sortColumns: field,
    })
  }

  const removeMyTask = (e, projectId: number) => {
    e.stopPropagation()
    deleteApi(projectId, '/TaskSearch')
      .then((res: any) => {
        getUpdatedProjectList()
      })
      .catch((error: any) => {
        console.log('error feching data', error)
      })
  }

  const tagElement = (type, tag) => {
    const labels = {
      status: 'Status',
      platforms: 'Platform(s)',
      priority: 'Priority',
      startDate: 'Start Date',
      endDate: 'End Date',
      searchWithin: 'Search Within',
    }
    if (Array.isArray(tag)) {
      return (
        <>
          <span>{`${labels[type]}:`}</span>
          {tag.map((el, i) => {
            return (
              <Tag
                key={i}
                color={'#85D305'}
                closable
                onClose={(e) => {
                  e.preventDefault()
                  handleTagClose(type, el)
                }}
                style={{ margin: '5px' }}
              >
                {tag && renderFilterTags(type, el)}
              </Tag>
            )
          })}
        </>
      )
    } else {
      return (
        <>
          <span>{`${labels[type]}:`}</span>
          <Tag
            color={'#85D305'}
            closable
            onClose={(e) => {
              e.preventDefault()
              handleTagClose(type)
            }}
            style={{ margin: '5px' }}
          >
            {tag && renderFilterTags(type, tag)}
          </Tag>
        </>
      )
    }
  }

  const columnsTasks: ColumnsType<Tasks> = [
    {
      title: 'Prirority',
      dataIndex: 'priorityName',
      key: 'priorityId',

      render: (_, record: any) => (
        <div className={`priority-img ${record.priorityName}`}>
          {PriorityImg[record.priorityName]}
          <span style={{ marginLeft: 6 }}>{record.priorityName}</span>
        </div>
      ),
    },
    {
      title: 'Project Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Title/Artist List',
      dataIndex: 'artistList',
      key: 'artistList',
    },
    {
      title: 'Platform(s)',
      dataIndex: 'platformId',
      key: 'platformId',
      render: (_, record: any) => {
        return (
          record.platformId &&
          record.platformId.map((platform) => {
            const extractPlatform: any = platformFacets.find((item) => item.platformId === platform)
            return <img style={{ padding: '5px' }} src={platformImages[extractPlatform?.platformName]} alt={platform} />
          })
        )
      },
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: 'My Progress',
      render: (_, record: any) => (
        <>
          <Progress
            percent={record.linkPercentage}
            strokeColor={{ '0%': '#85D305', '50%': '#F68B0D', '100%': '#CA1919' }}
          />
          <span className="progressContent">{`${record.linkCompletedCount} / ${record.totalLink}`}</span>
        </>
      ),
      key: 'linkPercentage',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: {},
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: {},
    },
    {
      title: 'Status',
      dataIndex: 'statusTypeDescription',
      key: 'status',
      sorter: {},
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={(e) => showNotesModal(e, record.projectId)}
            icon={<WechatOutlined />}
            size={'large'}
            style={{ border: 'none', borderColor: '' }}
          />
          <Button
            onClick={(e) => removeMyTask(e, Number(record.projectId))}
            icon={<CloseSquareOutlined />}
            size={'large'}
            style={{ border: 'none', borderColor: '' }}
          />
          {/* <CloseSquareOutlined onClick={() => console.log('onclcick')} style={{ fontSize: '25px' }} /> */}
        </Space>
      ),
    },
  ]

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
          <ProjectSearchFilterModal
            platformFacets={platformFacets}
            teamFacets={teamFacets}
            statusFacets={statusFacets}
            priorityFacets={priorityFacets}
            open={isFilterModalOpen}
            handleClose={closeFilterModal}
            state={searchFilters}
            handleSelectedFilters={handleSelectedFilters}
            loading={loading}
            selectedFilters={selectedFilters}
          />

          {openNotesModal && (
            <NotesModal
              soureName={task.title}
              sourceId={task.projectId}
              soure={'Tasks'}
              open={openNotesModal}
              handleClose={handleNotesModal}
            />
          )}
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
          <TaskDataGrid loading={loading} setSort={setSort} columnsTasks={columnsTasks} tasks={tasks} />
        </Col>
      </Row>
    </>
  )
}

export default TasksPage
