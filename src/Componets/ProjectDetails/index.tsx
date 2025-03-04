import React, { useEffect, useState } from 'react'
import { Col, Row, Space, Button, Input, Tag, Select, Divider, Typography, Pagination } from 'antd'
import { showErrorNotification } from '../../utils/notifications'
import { getApi } from '../../Api/Api'
import {
  DownloadOutlined,
  PlusCircleFilled,
  WechatOutlined,
  SettingOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { PaginationProps } from 'antd'
import { Link } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import FilterModal from './ProjectSearchFilterModal'
import CreateProjectModal from './CreateProjectModal'
import BulkProjectModal from './BulkProjectModal'
import NotesModal from '../Modal/NotesModal'
// @ts-ignore
import { CSVLink } from 'react-csv'
import { LINK_TITLES, countValues, ADMIN, TEAM_ADMIN } from '../Common/StaticDatas'
import ProjectSearchDetailsDataTable from './ProjectSearchDetailsDataTable'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../Context/authContext'
import { useLocation } from 'react-router-dom'
import { restrictUser } from '../Common/Utils'

const { Search } = Input
const { Text, Title } = Typography
const { Option } = Select

const facetsInitalState = {
  userFacets: [],
  categoryFacets: [],
  statusFacets: [],
  totalItems: '',
}

const searchInitialState = {
  searchTerm: '',
  itemsPerPage: '10',
  pageNumber: 1,
  assignedTo: null,
  sortOrder: '',
  sortColumns: '',
  statusId: '',
  categoryId: null,
  reviewDateTo: '',
  reviewDateFrom: '',
  searchWithin: 'ALL',
}

export default function ProjectDetails() {
  const [searchFilters, setSearchFilters] = useState<LinksearchState>(searchInitialState)
  const [facets, setFacets] = useState<any>(facetsInitalState)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = React.useState<any>([])
  const [projectLinks, setProjectLinks] = React.useState<any>([])
  const [projectLinkData, setProjectLinkData] = React.useState<any>()
  const [projectLinkIds, setprojectLinkIds] = React.useState<any>([])
  const [csvData, setcsvData] = React.useState([])
  const [exportLoading, setExportLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [openNotesModal, setNotesModal] = useState<boolean>(false)

  const { projectId, teamId } = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const projectName = queryParams.get('projectName')
  const assignedTo = Number(queryParams.get('assignedTo'))

  const auth = useAuth()
  const enableBulkEdit =
    (projectLinkIds.length >= 1 && auth.user.role === ADMIN) || auth.user.role === TEAM_ADMIN ? false : true
  const enableToAddAndEdit = restrictUser(auth.user.role)

  const csvLink = React.createRef<any>()

  const getProjectLinks = React.useCallback(() => {
    setLoading(true)
    const params = {
      SearchTerm: searchFilters.searchTerm,
      ProjectId: projectId,
      TeamId: teamId,
      ItemsPerPage: searchFilters.itemsPerPage,
      PageNumber: searchFilters.pageNumber,
      SortColumn: searchFilters.sortColumns,
      SortOrder: searchFilters.sortOrder,
      SearchWithins: searchFilters.searchWithin,
      AssignedTo: assignedTo ? assignedTo : arrayToString(searchFilters.assignedTo),
      StatusId: arrayToString(searchFilters.statusId),
      CategoryId: arrayToString(searchFilters.categoryId),
      ReviewDateTo: searchFilters.reviewDateTo,
      ReviewDateFrom: searchFilters.reviewDateFrom,
    }
    getApi(params, '/ProjectLinkSearch')
      .then((res) => {
        if (exportLoading) {
          setcsvData(res.projectLinks)
          setExportLoading(false)
        } else {
          setFacets({
            ...facets,
            statusFacets: res.statusFacets,
            userFacets: res.userFacets,
            categoryFacets: res.categoryFacets,
            totalItems: res.totalItems,
          })
          setProjectLinks(res.projectLinks)
        }
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log('error feching data', err)
        showErrorNotification(err.message)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, teamId, searchFilters])

  const arrayToString = (val) => {
    if (Array.isArray(val)) {
      return val.join(',')
    } else {
      return val
    }
  }

  useEffect(() => {
    getProjectLinks()
    return () => {}
  }, [getProjectLinks])

  React.useEffect(() => {
    if (csvData.length > 0 && csvLink) {
      csvLink.current.link.click()
    }
  }, [csvData])

  const exportData = () => {
    setExportLoading(true)
    setSearchFilters({ ...searchFilters, pageNumber: 1, itemsPerPage: '10000' })
  }

  const onSearch = (value: string) => {
    setSearchFilters({
      ...searchFilters,
      searchTerm: value,
    })
  }

  const handleLimitChange = (limit: { value: string; label: React.ReactNode }) => {
    setSearchFilters({
      ...searchFilters,
      itemsPerPage: limit.value,
    })
  }

  const handlePageChange: PaginationProps['onChange'] = (page) => {
    setSearchFilters({
      ...searchFilters,
      pageNumber: page,
    })
  }

  const showCreateProjectModal = () => {
    setIsCreateModalOpen(true)
  }

  const showBulkProjectModal = () => {
    !enableBulkEdit && setIsBulkModalOpen(true)
  }

  const handleCreateProjectClose = () => {
    setIsCreateModalOpen(false)
    setIsBulkModalOpen(false)
    setProjectLinkData(null)
  }

  const editProject = (record) => {
    const selectedProject = projectLinks.find((link) => link.projectLinkId === record.projectLinkId)
    setProjectLinkData(selectedProject)
    setIsCreateModalOpen(true)
  }

  const closeFilterModal = () => {
    setIsFilterModalOpen(false)
  }

  const showFilterModal = () => {
    setIsFilterModalOpen(true)
  }

  const handleSelectedFilters = (filters) => {
    setSelectedFilters(Object.entries(filters))
    setSearchFilters((prevState) => ({ ...prevState, ...filters }))
    closeFilterModal()
  }

  const handleChangeAssignee = (data) => {
    setSearchFilters({
      ...searchFilters,
      assignedTo: data,
    })
  }

  const setSort = (order, field) => {
    setSearchFilters({
      ...searchFilters,
      sortOrder: order,
      sortColumns: field,
    })
  }

  const showNotesModal = (record) => {
    const selectedProject = projectLinks.find((link) => link.projectLinkId === record.projectLinkId)
    setProjectLinkData(selectedProject)
    setNotesModal(true)
  }

  const columnsProject: ColumnsType<ProjectDetails> = [
    {
      title: 'URL',
      key: 'url',
      sorter: {},
      render: (_, record) => <a href={record.url}>{record.url}</a>,
    },
    {
      title: 'Account URL',
      key: 'accountUrl',
      sorter: {},
      render: (_, record) => <a href={record.accountUrl}>{record.accountUrl}</a>,
    },
    {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist',
      sorter: {},
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: {},
    },
    {
      title: 'Category',
      key: 'categoryName',
      sorter: {},
      dataIndex: 'categoryName',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedName',
      key: 'assignedName',
      sorter: {},
    },
    {
      title: 'Review Date',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
    },
    {
      title: 'Status',
      dataIndex: 'statusName',
      key: 'statusName',
      sorter: {},
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={enableToAddAndEdit}
            onClick={() => editProject(record)}
            icon={<EditOutlined />}
            size={'middle'}
          />
          <Button onClick={() => showNotesModal(record)} icon={<WechatOutlined />} size={'middle'} />
        </Space>
      ),
    },
  ]

  const handleTagClose = (removedTag, el?) => {
    let modifiiedFilters = []
    if (el) {
      modifiiedFilters = selectedFilters.map(([key, value]) => {
        if (key === removedTag && Array.isArray(value)) {
          return [key, value.filter((item) => item !== el)]
        }
        return [key, value]
      })
      setSearchFilters((prev) => ({ ...prev, [removedTag]: searchFilters[removedTag].filter((id) => id !== el) }))
    } else {
      modifiiedFilters = selectedFilters.filter((item) => item[0] !== removedTag)
      setSearchFilters((prev) => ({ ...prev, [removedTag]: null }))
    }
    setSelectedFilters(modifiiedFilters)
  }

  const tagElement = (type, tag) => {
    const labels = {
      statusId: 'Status',
      categoryId: 'Category',
      assignedTo: 'Assigned To',
      reviewDateTo: 'Review Date To',
      reviewDateFrom: 'Review Date From',
      searchWithin: 'Search Within',
    }
    if (Array.isArray(tag)) {
      return (
        <>
          {tag.length > 0 && <span>{`${labels[type]}:`}</span>}
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
            {tag}
          </Tag>
        </>
      )
    }
  }

  const renderFilterTags = (type: string, tag) => {
    const dropDownFacets = {
      statusId: facets.statusFacets,
      categoryId: facets.categoryFacets,
      assignedTo: facets.userFacets,
    }
    if (dropDownFacets[type]) {
      return dropDownFacets[type].find((item) => item.id === tag).name
    }
  }

  const handleNotesModal = () => {
    setNotesModal(false)
    setProjectLinkData(null)
  }

  return (
    <div className="search-wrapper">
      <Row justify={'space-between'}>
        <Col>
          <Title level={3}>Project: {projectName}</Title>
          <Link to={assignedTo ? '/myqueue?type=tasks' : '/search'}> &larr; Back to Projects</Link>
        </Col>
        <Col md={4}>
          <label style={{ marginRight: 10 }}>Assigned To : </label>
          <Select
            style={{ minWidth: 150 }}
            defaultValue={assignedTo ? assignedTo : 'ALL'}
            placeholder="ALL"
            onChange={handleChangeAssignee}
            allowClear
          >
            {facets.userFacets &&
              facets.userFacets.map((team, index) => {
                return (
                  <Option key={index} label={team.name} value={Number(team.id)}>
                    {team.name}
                  </Option>
                )
              })}
          </Select>
        </Col>
      </Row>
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
            selectedFilters.map((item, i) => {
              if (typeof item[1] !== 'undefined' && item[1] !== '' && item[1]) {
                return <span key={i}>{tagElement(item[0], item[1])}</span>
              }
              return null
            })}
          <FilterModal
            categoryFacets={facets.categoryFacets}
            reviewerFacets={facets.userFacets}
            statusFacets={facets.statusFacets}
            open={isFilterModalOpen}
            handleClose={closeFilterModal}
            state={searchFilters}
            handleSelectedFilters={handleSelectedFilters}
            loading={false}
            teamId={teamId}
            selectedFilters={selectedFilters}
          />
          {isCreateModalOpen && (
            <CreateProjectModal
              categoryFacets={facets.categoryFacets}
              reviewerFacets={facets.userFacets}
              statusFacets={facets.statusFacets}
              open={isCreateModalOpen}
              handleClose={handleCreateProjectClose}
              state={searchFilters}
              loading={false}
              projectId={projectId}
              projectLinkData={projectLinkData}
              teamId={teamId}
              getProjectLinks={getProjectLinks}
              setLoading={setLoading}
            />
          )}
          {isBulkModalOpen && (
            <BulkProjectModal
              categoryFacets={facets.categoryFacets}
              reviewerFacets={facets.userFacets}
              statusFacets={facets.statusFacets}
              open={isBulkModalOpen}
              handleClose={handleCreateProjectClose}
              state={searchFilters}
              loading={false}
              projectLinkIds={projectLinkIds}
              teamId={teamId}
              projectId={projectId}
              getProjectLinks={getProjectLinks}
              setLoading={setLoading}
            />
          )}
          {openNotesModal && (
            <NotesModal
              sourceName={projectLinkData?.projectName}
              sourceId={projectLinkData?.projectLinkId}
              source={'Links'}
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
          <Text>of {facets.totalItems} Results</Text>
        </Col>
        <Col span={8} push={3}>
          <Pagination
            defaultCurrent={1}
            current={searchFilters.pageNumber}
            pageSize={Number(searchFilters.itemsPerPage)}
            onChange={handlePageChange}
            total={facets.totalItems}
            showSizeChanger={false}
            responsive={true}
            showLessItems={true}
          />
        </Col>

        <Col span={5} offset={3}>
          <Row justify="end">
            <Space wrap>
              <Button onClick={showBulkProjectModal} disabled={enableBulkEdit} icon={<EditOutlined />} size={'middle'}>
                Bulk Edit
              </Button>
              <Button
                onClick={showCreateProjectModal}
                disabled={enableToAddAndEdit}
                icon={<PlusCircleFilled />}
                size={'middle'}
              >
                Create
              </Button>
              <Button onClick={exportData} icon={<DownloadOutlined />} size={'middle'}>
                Export
              </Button>
              <CSVLink
                data={csvData}
                headers={LINK_TITLES.map((elm: any) => ({ key: elm.id, label: elm.name }))}
                filename="projectsLink.csv"
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
          <ProjectSearchDetailsDataTable
            setSort={setSort}
            loading={loading}
            setSelectedRows={setprojectLinkIds}
            columsProjects={columnsProject}
            projectsDetails={projectLinks}
          />
        </Col>
      </Row>
    </div>
  )
}
