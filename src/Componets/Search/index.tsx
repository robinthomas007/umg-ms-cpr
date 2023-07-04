import React, { useEffect, useState, useRef } from 'react'
import './search.css'
import { Col, Row, Space, Button, Input, Tag, Select, Divider, Progress, Typography, Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import Highlighter from 'react-highlight-words'
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
import type { ColumnsType, ColumnType } from 'antd/es/table'
import { searchReducer, searchInitialState } from './searchReducer'
import axios from 'axios'
import { BASE_URL } from '../../../src/App'
import EditProjectModal from '../Modal/EditProjectModal'
import NotesModal from '../Modal/NotesModal'
import { platform } from 'os'

const { Search } = Input
const { Text } = Typography

const SearchInput: React.FC = () => {
  const [state, dispatch] = React.useReducer(searchReducer, searchInitialState)
  const [search, setSearch] = React.useState('')
  const [open, setOpen] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [openCreateProject, setOpenCreateProject] = useState<boolean>(false)
  const [openNotesModal, setNotesModal] = useState<boolean>(false)

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

  function getCookie(name: string) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  }

  const getSearchPageData = React.useCallback(
    (isExport: any) => {
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
            startDate: filter.startDate,
            endDate: filter.endDate,
          },
          headers: {
            cpr_portal: getCookie('cpr_portal'),
          },
        })
        .then((res) => {
          console.log('fetched results', res.data)
          setProjects(res.data.projects)
          setTotalItems(res.data.totalItems)
          setTotalPages(Number(res.data.totalPages))
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

  React.useEffect(() => {
    getSearchPageData(false)
  }, [getSearchPageData])

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
    setItemsPerPage(Number(limit.value))
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

  const handleTagClose = (removedTag) => {
    const modifiiedFilters = selectedFilters.filter((item) => item[0] !== removedTag)
    setSelectedFilters(modifiiedFilters)
    dispatch({
      type: 'SET_FILTER',
      payload: { filter: Object.fromEntries(modifiiedFilters) },
    })
  }

  const renderFilterTags = (type: string, tag) => {
    if (type === 'platform') {
      return `${state.platformFacets[tag - 1].platformName}`
    }
    if (type === 'status') {
      return `${state.statusFacets[tag - 1].statusTypeDescription}`
    }
    if (type === 'teams') {
      return `${state.teamFacets[tag - 1].teamName}`
    }
    return tag
  }

  const tagElement = (type, tag) => {
    const tagElem = (
      <Tag
        color={'#85D305'}
        closable
        onClose={(e) => {
          e.preventDefault()
          handleTagClose(type)
        }}
      >
        {tag && renderFilterTags(type, tag)}
      </Tag>
    )
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {}
        {type}: {tagElem}
      </span>
    )
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    console.log('selectedKeys', selectedKeys[0])
    console.log('setSearchedColumn', dataIndex)

    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
    dispatch({
      type: 'SET_SEARCH',
      payload: {
        searchTerm: selectedKeys[0],
        sortColumn: dataIndex,
        filter: state.searchCriteria.filter,
      },
    })
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
    dispatch({
      type: 'SET_SEARCH',
      payload: {
        searchTerm: '',
        filter: state.searchCriteria.filter,
      },
    })
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
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Title/ Artist List',
      dataIndex: 'artistList',
      key: 'artistList',
      ...getColumnSearchProps('artistList'),
    },
    {
      title: 'Platform',
      dataIndex: 'platformName',
      key: 'platformName',
      ...getColumnSearchProps('platformName'),
    },
    {
      title: 'Teams',
      dataIndex: 'teamName',
      key: 'teams',
      ...getColumnSearchProps('teamName'),
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
      ...getColumnSearchProps('statusTypeDescription'),
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
  const showNotesModal = (projectId) => {
    const selectedProject = state.projects.find((project) => project.projectId === projectId)
    setProject(selectedProject)
    setNotesModal(true)
  }
  const handleNotesModal = () => {
    setNotesModal(false)
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
                return tagElement(item[0], item[1])
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
            getSearchPageData={getSearchPageData}
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
              handleClose={handleEditProjectClose}
              getSearchPageData={getSearchPageData}
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
            style={{ width: 60 }}
            onChange={handleLimitChange}
            options={countValues}
          />
          &nbsp;&nbsp;
          <Text>of {totalItems} results</Text>
        </Col>
        <Col span={8} push={3}>
          <Pagination
            // defaultCurrent={pageNumber}
            current={pageNumber}
            onChange={handlePageChange}
            total={totalItems}
            defaultCurrent={1}
          />
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
