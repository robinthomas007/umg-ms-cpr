import React, { useState } from 'react'
import './search.css'
import { Col, Row, Space, Button, Input, Select, Divider } from 'antd'
import { DownloadOutlined, PlusCircleOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons'
import ProjectSearchDataTable from './ProjectSearchDataTable'
import ProjectSearchFilterModal from '../Modal/ProjectSearchFilterModal'

const { Search } = Input

const SearchInput: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const showModal = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (value: { value: string; label: React.ReactNode }) => {
    console.log(value) // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  }
  const onSearch = (value: string) => console.log(value)
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
              <Button onClick={showModal} icon={<SettingOutlined />} size={'middle'} />
            </Col>
            <Col span={22}>
              <Search
                prefix={<SearchOutlined />}
                className="search"
                onSearch={onSearch}
                size="middle"
                enterButton="Search"
              />
            </Col>
          </Row>

          <ProjectSearchFilterModal open={open} close={true} handleClose={handleClose} />
        </Col>
      </Row>
      <br />

      <Row justify="space-evenly">
        <Col span={12}>
          <span>View Counts &nbsp;</span>
          {''}
          <Select
            labelInValue
            defaultValue={countValues[0]}
            style={{ width: 60 }}
            onChange={handleChange}
            options={countValues}
          />
          &nbsp;&nbsp;
          <span>of 247 results</span>
        </Col>

        <Col span={5} offset={7}>
          <Row justify="end">
            <Space wrap>
              <Button type="primary" icon={<PlusCircleOutlined />} size={'middle'}>
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
          <ProjectSearchDataTable />
        </Col>
      </Row>
    </div>
  )
}

export default SearchInput
