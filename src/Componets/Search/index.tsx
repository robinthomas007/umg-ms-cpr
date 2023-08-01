import React, { useEffect, useState, useRef } from 'react'
import './search.css'
import { Col, Row, Space, Button, Input, Tag, Select, Divider, Progress, Typography, Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import Highlighter from 'react-highlight-words'
import { showErrorNotification } from '../../utils/notifications'
import { getApi } from '../../Api/Api'
import Api from '../../lib/api'
import {
  DownloadOutlined,
  PlusCircleFilled,
  WechatOutlined,
  SettingOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons'
import ProjectSearchDataTable from './ProjectSearchDataTable'
import ProjectSearchFilterModal from '../Modal/ProjectSearchFilterModal'
import CreateProjectModal from '../Modal/CreateProjectModal'
import type { ColumnsType, ColumnType } from 'antd/es/table'
// import { searchReducer } from './searchReducer'
import axios from 'axios'
import { BASE_URL } from '../../../src/App'
import EditProjectModal from '../Modal/EditProjectModal'
import NotesModal from '../Modal/NotesModal'
// @ts-ignore
import { CSVLink } from 'react-csv'
import { SEARCH_TITLES } from '../Common/StaticDatas'

const { Search } = Input
const { Text } = Typography

const searchInitialState = {
  loading: false,
  error: '',
  projects: [],
  platforms: null,
  teams: null,
  status: null,
  platformFacets: [],
  teamFacets: [],
  statusFacets: [],

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

const SearchInput: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<searchState>(searchInitialState)
  const [loading, setLoading] = useState<boolean>(false)
  // const [state, dispatch] = React.useReducer(searchReducer, searchInitialState)
  const [search, setSearch] = React.useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [openNotesModal, setNotesModal] = useState<boolean>(false)

  const [platformFacets, setPlatformFacets] = useState<Platform[]>([])
  const [teamFacets, setTeamFacets] = useState<Teams[]>([])
  const [statusFacets, setStatusFacets] = useState<Status[]>([])

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
      platforms: platforms,
      teams: teams,
      status: status,
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

  const handleTagClose = (removedTag) => {
    const modifiiedFilters = selectedFilters.filter((item) => item[0] !== removedTag)
    setSelectedFilters(modifiiedFilters)
    setSearchFilters((prev) => ({ ...prev, [removedTag]: null }))
  }

  const renderFilterTags = (type: string, tag) => {
    if (type === 'platforms') {
      return `${platformFacets[tag - 1].platformName}`
    }
    if (type === 'status') {
      return `${statusFacets[tag - 1].statusTypeDescription}`
    }
    if (type === 'teams') {
      return `${teamFacets.find((teams) => teams.teamId === tag)?.teamName}`
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
          {tag && renderFilterTags(type, tag)}
        </Tag>
      </>
    )
    return tagElem
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
  // const handleSortTable=(selectedColumn)= {
  //   return null
  // }

  const columnsProject: ColumnsType<Project> = [
    {
      title: 'Project Title',
      dataIndex: 'title',
      key: 'projectId',
      sorter: (a, b) => a.title.length - b.title.length,
      // ...getColumnSearchProps('title'),
    },
    {
      title: 'Title/ Artist List',
      dataIndex: 'artistList',
      key: 'artistList',
      // ...getColumnSearchProps('artistList'),
    },
    {
      title: 'Platform',
      dataIndex: 'platformName',
      key: 'platformName',
      // ...getColumnSearchProps('platformName'),
    },
    {
      title: 'Teams',
      dataIndex: 'teamName',
      key: 'teams',
      // ...getColumnSearchProps('teamName'),
    },
    {
      title: 'Links/Progress',
      key: 'progress',
      render: (_, record) => (
        <Progress percent={record.progress} strokeColor={{ '0%': '#85D305', '50%': '#F68B0D', '100%': '#CA1919' }} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusTypeDescription',
      key: 'statusTypeDescription',
      // ...getColumnSearchProps('statusTypeDescription'),
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
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => editProject(record.projectId)} icon={<EditOutlined />} size={'middle'} />
          <Button onClick={() => showNotesModal(record.projectId)} icon={<WechatOutlined />} size={'middle'} />
        </Space>
      ),
    },
  ]

  const showFilterModal = () => {
    setIsFilterModalOpen(true)
  }
  const editProject = (projectId) => {
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
  const showNotesModal = (projectId) => {
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

  const countValues = [
    {
      value: '10',
      label: '10',
    },
    {
      value: '25',
      label: '25',
    },
    {
      value: '50',
      label: '50',
    },
    {
      value: '100',
      label: '100',
    },
  ]
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
              statusFacets={statusFacets}
              loading={loading}
              projectData={project}
              getSearchPageData={getUpdatedProjectList}
              open={isEditModalOpen}
              state={searchFilters}
              handleClose={closeEditModal}
            />
          )}
          <NotesModal projectData={project} open={openNotesModal} handleClose={handleNotesModal} />
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

        <Col span={4} offset={4}>
          <Row justify="end">
            <Space wrap>
              <Button onClick={showCreateProjectModal} icon={<PlusCircleFilled />} size={'middle'}>
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
