import React, { useEffect, useState } from 'react'
import './search.css'
import { Col, Row, Space, Button, Input, Tag, Select, Divider, Progress, Typography, Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import {
  DownloadOutlined,
  PlusCircleOutlined,
  WechatOutlined,
  SettingOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons'
import ProjectSearchDataTable from './ProjectSearchDataTable'
import ProjectSearchFilterModal from '../Modal/ProjectSearchFilterModal'
import CreateProjectModal from '../Modal/CreateProjectModal'
import type { ColumnsType } from 'antd/es/table'
import { searchReducer, searchInitialState } from './searchReducer'
import axios from 'axios'
import { BASE_URL } from '../../../src/App'
import EditProjectModal from '../Modal/EditProjectModal'

const { Search } = Input
const { Text } = Typography

interface Platforms {
  label: string
  value: string
}
interface Project {
  key?: React.Key
  projectId: React.Key
  title: string
  artistList: string
  platform: string
  teams: string
  status: string
  progress: number
  startDate: string
  endDate: string
  notes: string
  updatedOn: string
}

const SearchInput: React.FC = () => {
  const [state, dispatch] = React.useReducer(searchReducer, searchInitialState)
  const [search, setSearch] = React.useState('')
  const [open, setOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [openCreateProject, setOpenCreateProject] = useState<boolean>(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [project, setProject] = useState<any>({})
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedFilters, setSelectedFilters] = React.useState<any>([])
  const [totalItems, setTotalItems] = useState<number>(0)

  function getCookie(name: string) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  }

  const getSearchPageData = React.useCallback(
    (isExport: any, isReport: any) => {
      const { searchTerm, itemsPerPage, pageNumber, sortColumn, sortOrder, filter, tableSearch } = state.searchCriteria

      dispatch({ type: 'FETCH_REQUEST', payload: '' })
      axios
        .get(BASE_URL + 'ProjectSearch', {
          params: {
            searchTerm: searchTerm,
            itemsPerPage: isExport ? '' : itemsPerPage,
            pageNumber: isExport ? '' : pageNumber,
            sortColumns: sortColumn,
            sortOrder: sortOrder,
            searchWithin: filter.searchWithin ? filter.searchWithin.toString() : 'ALL',
            platforms: filter.platform,
            teams: filter.teams,
            status: filter.status,
            // startDate: filter.releaseFrom,
            // endDate: filter.releaseTo,
          },
          headers: {
            cpr_portal: getCookie('cpr_auth'),
          },
        })
        .then((res) => {
          setProjects(res.data.projects)
          setTotalItems(res.data.totalItems)
          dispatch({ type: 'FETCH_SUCCESS', payload: res.data })
          dispatch({ type: 'SET_FACETS', payload: res.data })
        })
        .catch((err) => {
          dispatch({ type: 'FETCH_FAILURE', payload: err.Message })
          console.log('error feching data', err)
        })
    },
    [state.searchCriteria]
  )

  const setSearchTerm = (searchTerm: string) => {
    dispatch({
      type: 'SET_SEARCH',
      payload: {
        searchTerm: searchTerm,
        filter: state.searchCriteria.filter,
      },
    })
  }
  const clearSearch = () => {
    setSearch('')
    setSearchTerm('')
  }

  const handlePageChange: PaginationProps['onChange'] = (page) => {
    setPageNumber(page)
    dispatch({ type: 'PAGE_CHANGE', payload: { pageNumber: page } })
  }

  const handleLimitChange = (limit: { value: string; label: React.ReactNode }) => {
    dispatch({ type: 'CHANGE_LIMIT', payload: limit.value })
  }

  const handleFlterModalSubmit = (project: any) => {
    setSelectedFilters(Object.entries(project))
    dispatch({
      type: 'SET_FILTER',
      payload: { filter: project },
    })
    handleClose()
  }

  const filters = ['searchWithin', 'Platform(s)', 'Teams', 'Status', 'StartDate', 'End Date']

  const handleTagClose = (removedTag) => {
    const modifiiedFilters = selectedFilters.filter((item) => item[0] !== removedTag)
    dispatch({
      type: 'SET_FILTER',
      payload: { filter: Object.fromEntries(modifiiedFilters) },
    })
    setSelectedFilters(modifiiedFilters)
  }

  const forMap = (type, tag) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault()
          handleTagClose(type)
        }}
      >
        {tag && tag}
      </Tag>
    )
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {type}: {tagElem}
      </span>
    )
  }

  React.useEffect(() => {
    getSearchPageData(false, '')
  }, [getSearchPageData])

  const columnsProject: ColumnsType<Project> = [
    {
      title: 'Project Title',
      dataIndex: 'title',
      defaultSortOrder: 'descend',
      key: 'projectId',
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: 'Title/ Artist List',
      dataIndex: 'artistList',
      defaultSortOrder: 'descend',
      key: 'artistList',
    },
    {
      title: 'Platform(s)',
      dataIndex: 'platformName',
      defaultSortOrder: 'descend',
      key: 'platform',
    },
    {
      title: 'Teams',
      dataIndex: 'teamName',
      defaultSortOrder: 'descend',
      key: 'teams',
    },
    {
      title: 'Links/Progress',
      defaultSortOrder: 'descend',
      key: 'progress',
      render: (_, record) => (
        <Progress percent={record.progress} strokeColor={{ '0%': '#85D305', '50%': '#F68B0D', '100%': '#CA1919' }} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusTypeDescription',
      defaultSortOrder: 'descend',
      key: 'status',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      defaultSortOrder: 'descend',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      defaultSortOrder: 'descend',
      key: 'endDate',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => editProject(record.projectId)} icon={<EditOutlined />} size={'middle'} />
          <Button icon={<WechatOutlined />} size={'middle'} />
        </Space>
      ),
    },
  ]

  const showFilterModal = () => {
    setOpen(true)
  }
  const editProject = (projectId) => {
    const selectedProject = projects.find((project) => project.projectId === projectId)
    setProject(selectedProject)
    setEditModal(true)
  }
  const showCreateProjectModal = () => {
    setOpenCreateProject(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleCreateProjectClose = () => {
    setOpenCreateProject(false)
  }
  const handleEditProjectClose = () => {
    setEditModal(false)
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
      value: '20',
      label: '20',
    },
    {
      value: '30',
      label: '30',
    },
  ]

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
              />
            </Col>
          </Row>
          <br />
          {selectedFilters &&
            selectedFilters.map((item) => {
              if (typeof item[1] !== 'undefined' && item[1]) {
                return forMap(item[0], item[1])
              }
            })}

          <ProjectSearchFilterModal
            platformFacets={state.platformFacets}
            teamFacets={state.teamFacets}
            statusFacets={state.statusFacets}
            open={open}
            close={true}
            handleClose={handleClose}
            state={state}
            dispatch={dispatch}
            handleFlterModalSubmit={handleFlterModalSubmit}
          />
          <CreateProjectModal
            platformFacets={state.platformFacets}
            teamFacets={state.teamFacets}
            statusFacets={state.statusFacets}
            open={openCreateProject}
            close={true}
            handleClose={handleCreateProjectClose}
            state={state}
            dispatch={dispatch}
          />
          {Object.keys(project).length > 0 && (
            <EditProjectModal
              platformFacets={state.platformFacets}
              teamFacets={state.teamFacets}
              statusFacets={state.statusFacets}
              projectData={project}
              open={editModal}
              close={true}
              handleClose={handleEditProjectClose}
              state={state}
              dispatch={dispatch}
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
            style={{ width: 60 }}
            onChange={handleLimitChange}
            options={countValues}
          />
          &nbsp;&nbsp;
          <Text>of {totalItems} results</Text>
        </Col>
        <Col span={8} push={3}>
          <Pagination current={pageNumber} onChange={handlePageChange} total={projects.length} />
        </Col>

        <Col span={4} offset={4}>
          <Row justify="end">
            <Space wrap>
              <Button type="primary" onClick={showCreateProjectModal} icon={<PlusCircleOutlined />} size={'middle'}>
                Create
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} size={'middle'}>
                Export
              </Button>
            </Space>
          </Row>
        </Col>
      </Row>
      <Divider plain className="divider" />
      <Row className="dataTable">
        <Col span={24}>
          <ProjectSearchDataTable state={state} columsProjects={columnsProject} projects={projects} />
        </Col>
      </Row>
    </div>
  )
}

export default SearchInput
