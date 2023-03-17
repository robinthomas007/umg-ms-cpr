import { Avatar, Button, Input, Layout, List, Pagination, Select, Space, Tag, Tooltip } from 'antd'
import { DatePicker, Form, Modal } from 'antd'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { SearchOutlined } from '@ant-design/icons'
import Icon from '@ant-design/icons'

import DataTable from './DataTable'
const { Search } = Input
const { Option } = Select

const items = [
  {
    label: 'Search',
    key: 'logo',
    icon: <SearchOutlined />,
  },
  {
    label: 'Policy',
    key: 'cis',
    icon: <SearchOutlined />,
  },
]

const listData = [
  {
    title: 'Track Title',
    key: 'trackTitle',
    id: 'trackTitle',
  },
  {
    title: 'Artist',
    key: 'Artist',
    id: 'Artist',
    hide: true,
  },
  {
    title: 'Album',
    key: 'Album',
    id: 'Album',
  },
  {
    title: 'ISRC',
    key: 'ISRC',
    id: 'ISRC',
  },
  {
    title: 'Label',
    key: 'Label',
    id: 'Label',
  },
  {
    title: 'Policy',
    key: 'Policy',
    id: 'Policy',
    hide: true,
  },
  {
    title: 'Leak Date',
    key: 'LeakDate',
    id: 'LeakDate',
  },
  {
    title: 'Release Date',
    key: 'ReleaseDate',
    id: 'ReleaseDate',
  },
]

export default function Search2() {
  const [current, setCurrent] = useState(items[0].key)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenRecord, setIsOpenRecord] = useState(false)
  const [form] = Form.useForm()
  const onClick = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  const onCreateRecord = (values) => {
    console.log(values)
  }
  const onCancel = () => {
    form.resetFields()
    setIsOpenRecord(false)
  }

  const [headers, setHeaders] = useState(listData)
  const reorderColumns = (options) => {
    if (options?.destination?.index >= 0) {
      const headersCopy = [...headers]
      const item = headersCopy.splice(options.source.index, 1)[0]
      headersCopy.splice(options.destination.index, 0, item)
      setHeaders(headersCopy)
    }
  }

  const changeVisibility = (item) => {
    const headersCopy = [...headers]
    const index = headers.indexOf(item)
    headersCopy[index] = { ...item, hide: !item.hide }
    setHeaders(headersCopy)
  }

  return (
    <>
      <div className="cx-search-filter">
        <Modal
          title="Search Filter Settings"
          width={700}
          open={isOpen}
          onOk={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
          okText="Apply"
          cancelText="Reset to Default"
        >
          <span>Search Within</span>
          <br />
          <Select
            style={{ width: '100%' }}
            mode="multiple"
            showArrow
            defaultValue={['title', 'artist', 'album']}
            options={[
              { label: 'Title', value: 'title' },
              { label: 'Artist', value: 'artist' },
              { label: 'Album', value: 'album' },
              { label: 'ISRC', value: 'isrc' },
              { label: 'Notes', value: 'notes' },
            ]}
          />
          <br />
          <br />
          <span>Column visibility & order</span>
          <br />
          <List className="cx-columns-list" size="small" bordered>
            <DragDropContext onDragEnd={reorderColumns}>
              <Droppable droppableId="columns">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {headers.map((item, index) => (
                      <Draggable key={item.key} draggableId={item.key} index={index}>
                        {(provided) => (
                          <>
                            <List.Item ref={provided.innerRef} {...provided.draggableProps}>
                              <List.Item.Meta
                                avatar={
                                  <Icon
                                    className="cx-icon-lg"
                                    component={<SearchOutlined />}
                                    {...provided.dragHandleProps}
                                    style={{ cursor: 'move' }}
                                  />
                                }
                                title={item.title}
                              />
                              <Button
                                shape="circle"
                                onClick={() => changeVisibility(item)}
                                icon={
                                  <Icon
                                    className="cx-icon-lg"
                                    component={item.hide ? <SearchOutlined /> : <SearchOutlined />}
                                  />
                                }
                              />
                            </List.Item>
                          </>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </Modal>
        <Space>
          <Tooltip title="Search Filter Settings">
            <Button icon={<SearchOutlined />} size="large" onClick={() => setIsOpen(true)} />
          </Tooltip>
          <Search className="cx-search" allowClear enterButton="Search" size="large" prefix={<SearchOutlined />} />
        </Space>
      </div>
      <div className="cx-selected-filters">
        <Tag closable>Do not search: ISRC</Tag>
        <Tag closable>Hide Column: Artist</Tag>
        <Tag closable>Hide Column: Policy</Tag>
      </div>
      <div className="cx-toolbar">
        <Space>
          <span>Viewing</span>
          <Select defaultValue="10">
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="50">50</Option>
          </Select>
          <span className="cx-result-count">of 264 Results</span>
        </Space>
        <Pagination defaultCurrent={1} total={50} />
        <Space>
          <Button icon={<SearchOutlined />} onClick={() => setIsOpenRecord(true)}>
            Create
          </Button>
          <Button icon={<SearchOutlined />}>Export</Button>
        </Space>
      </div>
      <Modal
        onCancel={onCancel}
        title="Create Record"
        width={700}
        open={isOpenRecord}
        closeIcon={<SearchOutlined />}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button type="primary" form="create-record-form" key="submit" htmlType="submit">
            Submit
          </Button>,
        ]}
      >
        <Form
          id="create-record-form"
          colon={false}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          form={form}
          onFinish={onCreateRecord}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="policy" label="Policy" rules={[{ required: true, message: 'Policy is required' }]}>
            <Select>
              <Option value="policy1">Policy 1</Option>
              <Option value="policy2">Policy 2</Option>
              <Option value="policy3">Policy 3</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Release Date"
            rules={[{ required: true, message: 'Release Date is required' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item name="leakDate" label="Leak Date">
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
      <div className="cx-data-table">
        <DataTable />
      </div>
    </>
  )
}
