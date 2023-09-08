import React, { useEffect, useState, useRef } from 'react'
import './search.css'
import { Col, Row, Space, Button, Input, Tag, Select, Divider, Progress, Typography, Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import Highlighter from 'react-highlight-words'
import { showErrorNotification } from '../../utils/notifications'
import { getApi } from '../../Api/Api'
import { countValues } from '../../Componets/Common/Utils'
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
} from '@ant-design/icons'
import ProjectSearchDataTable from './ProjectSearchDataTable'
import ProjectSearchFilterModal from '../Modal/ProjectSearchFilterModal'
import CreateProjectModal from '../Modal/CreateProjectModal'
import type { ColumnsType, ColumnType } from 'antd/es/table'

import EditProjectModal from '../Modal/EditProjectModal'
import NotesModal from '../Modal/NotesModal'
// @ts-ignore
import { CSVLink } from 'react-csv'
import { SEARCH_TITLES } from '../Common/StaticDatas'
import { Facebook, SoundCloud, DailyMotion, Image, Vimeo, Instagram, Tiktok, Twitter, Youtube } from './../../images'
import { useAuth } from '../../Context/authContext'
import { restrictUser } from '../Common/Utils'

const { Search } = Input
const { Text } = Typography

const searchInitialState = {
  loading: false,
  error: '',
  projects: [],
  platforms: null,
  teams: null,
  status: null,
  priority: null,
  platformFacets: [],
  teamFacets: [],
  statusFacets: [],
  priorityFacets: [],

  startDate: '',
  endDate: '',
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

const SearchInput: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<searchState>(searchInitialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = React.useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [openNotesModal, setNotesModal] = useState<boolean>(false)

  const [platformFacets, setPlatformFacets] = useState<Platform[]>([])
  const [teamFacets, setTeamFacets] = useState<Teams[]>([])
  const [statusFacets, setStatusFacets] = useState<Status[]>([])
  const [priorityFacets, setPriorityFacets] = useState<Priority[]>([])

  const [projects, setProjects] = useState<Project[]>([])
  const [project, setProject] = useState<any>({})
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedFilters, setSelectedFilters] = React.useState<any>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [csvData, setcsvData] = React.useState([])
  const csvLink = React.createRef<any>()
  const [exportLoading, setExportLoading] = useState<boolean>(false)

  const auth = useAuth()
  const enableToAddAndEdit = restrictUser(auth.user.role)

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
      itemsPerPage: exportLoading ? '10000' : itemsPerPage,
      pageNumber: exportLoading ? 1 : pageNumber,
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

    getApi(params, '/projectSearch')
      .then((res) => {
        setLoading(false)
        if (exportLoading) {
          setcsvData(res.projects)
          setExportLoading(false)
        } else {
          setProjects(res.projects)
          setTotalItems(res.totalItems)
          setTotalPages(Number(res.totalPages))
          setPlatformFacets(res.platformFacets)
          setPriorityFacets(res.priorityFacets)
          setTeamFacets(res.teamFacets)
          setStatusFacets(res.statusFacets)
        }
      })
      .catch((err) => {
        setLoading(false)
        console.log('error feching data', err)
        showErrorNotification(err.message)
      })
  }, [searchFilters])

  const exportData = () => {
    setExportLoading(true)
    getUpdatedProjectList()
  }

  React.useEffect(() => {
    if (csvData.length > 0 && csvLink) {
      csvLink.current.link.click()
    }
  }, [csvData])

  const setSearchTerm = (searchTerm: string) => {
    setSearchFilters((prev) => ({ ...prev, searchTerm }))
  }
  const clearSearch = () => {
    setSearch('')
    setSearchTerm('')
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

  const tagElement = (type, tag) => {
    const labels = {
      status: 'Status',
      platforms: 'Platform(s)',
      teams: 'Teams',
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
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
    // dispatch({
    //   type: 'SET_SEARCH',
    //   payload: {
    //     searchTerm: '',
    //     filter: state.searchCriteria.filter,
    //   },
    // })
  }

  type DataIndex = keyof Project
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Project> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 24,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: 'rgb(116, 182, 7, 0.6)',
            color: '#fff',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columnsProject: ColumnsType<Project> = [
    {
      title: 'Project Title',
      dataIndex: 'title',
      key: 'projectId',
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: 'Title/ Artist List',
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
      title: 'Teams',
      dataIndex: 'teamName',
      key: 'teams',
    },
    {
      title: 'Links/Progress',
      key: 'progress',
      render: (_, record: any) => (
        <>
          <Progress
            percent={record.linkPercentage}
            strokeColor={{ '0%': '#85D305', '50%': '#F68B0D', '100%': '#CA1919' }}
          />
          <span className="progressContent">{`${record.linkCompletedCount} / ${record.totalLink}`}</span>
        </>
      ),
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
      title: 'Priority',
      key: 'priorityName',
      render: (_, record) => (
        <div className={`priority-img ${record.priorityName}`}>
          {PriorityImg[record.priorityName]}
          <span style={{ marginLeft: 6 }}>{record.priorityName}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusTypeDescription',
      key: 'statusTypeDescription',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={enableToAddAndEdit}
            onClick={(e) => editProject(e, record.projectId)}
            icon={<EditOutlined />}
            size={'middle'}
          />
          <Button onClick={(e) => showNotesModal(e, record.projectId)} icon={<WechatOutlined />} size={'middle'} />
        </Space>
      ),
    },
  ]

  const showFilterModal = () => {
    setIsFilterModalOpen(true)
  }
  const editProject = (e, projectId) => {
    e.stopPropagation()
    const selectedProject = projects.find((project) => project.projectId === projectId)
    setProject(selectedProject)
    setIsEditModalOpen(true)
  }
  const showCreateProjectModal = () => {
    setIsCreateModalOpen(true)
  }
  const closeFilterModal = () => {
    setIsFilterModalOpen(false)
  }
  const showNotesModal = (e, projectId) => {
    e.stopPropagation()
    const selectedProject = projects.find((project) => project.projectId === projectId)
    setProject(selectedProject)
    setNotesModal(true)
  }
  const handleNotesModal = () => {
    setNotesModal(false)
  }
  const handleCreateProjectClose = () => {
    setIsCreateModalOpen(false)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
  }

  const onSearch = (value: string) => {
    setSearchTerm(value)
    setSearch('')
  }

  const getUpdatedProjectList = () => {
    setSearchFilters({ ...searchFilters, pageNumber: 1 })
  }

  return (
    <div className="search-wrapper">
      <Row>
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
          {isCreateModalOpen && (
            <CreateProjectModal
              platformFacets={platformFacets}
              teamFacets={teamFacets}
              statusFacets={statusFacets}
              priorityFacets={priorityFacets}
              open={isCreateModalOpen}
              getSearchPageData={getUpdatedProjectList}
              handleClose={handleCreateProjectClose}
              state={searchFilters}
              loading={loading}
            />
          )}
          {Object.keys(project).length > 0 && (
            <EditProjectModal
              platformFacets={platformFacets}
              teamFacets={teamFacets}
              priorityFacets={priorityFacets}
              statusFacets={statusFacets}
              loading={loading}
              projectData={project}
              getSearchPageData={getUpdatedProjectList}
              open={isEditModalOpen}
              state={searchFilters}
              handleClose={closeEditModal}
            />
          )}
          {openNotesModal && (
            <NotesModal
              soureName={project.title}
              sourceId={project.projectId}
              soure={'Projects'}
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

        <Col span={8}>
          <Row justify="end">
            <Space wrap>
              <Button
                onClick={showCreateProjectModal}
                disabled={enableToAddAndEdit}
                icon={<PlusCircleFilled />}
                size={'middle'}
              >
                Create
              </Button>
              <Button onClick={exportData} icon={<DownloadOutlined />} size={'middle'}>
                {exportLoading ? 'Exporting' : 'Export'}
              </Button>
              <CSVLink
                data={csvData}
                headers={SEARCH_TITLES.map((elm: any) => ({ key: elm.id, label: elm.name }))}
                filename="projects.csv"
                className="hidden"
                ref={csvLink}
                target="_blank"
              />
            </Space>
          </Row>
        </Col>
      </Row>
      <Divider plain className="divider" style={{ marginBottom: '0px' }} />
      <Row className="dataTable">
        <Col span={24}>
          <ProjectSearchDataTable loading={loading} columsProjects={columnsProject} projects={projects} />
        </Col>
      </Row>
    </div>
  )
}

export default SearchInput
