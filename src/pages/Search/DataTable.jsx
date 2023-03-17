import { Button, DatePicker, Input, Space, Table } from 'antd'
import { useRef } from 'react'
import { SearchOutlined } from '@ant-design/icons'

const dataSource = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => ({
  key: String(item),
  trackTitle: `Some Track title ${item}`,
  Artist: 'Some Artist',
  Album: 'Some Album',
  ISRC: '123456789',
  Label: 'Universal Music',
  Policy: 'Block',
  LeakDate: '01/01/2022',
  ReleaseDate: '01/01/2022',
}))

const DataTable = () => {
  const searchInput = useRef(null) //To focus the element
  const handleOnChange = (_, filters, sorter) => {
    console.log('sorter', sorter)
    console.log('filters', filters)
  }

  const getColumnSearchProps = () => ({
    filterIcon: <SearchOutlined />,
    filterDropdown: ({ setSelectedKeys, confirm }) => (
      <div className="cx-column-search">
        <Input.Search
          ref={searchInput}
          allowClear
          enterButton
          onSearch={(value) => {
            setSelectedKeys(value)
            confirm()
          }}
        />
      </div>
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.focus(), 100)
      }
    },
  })

  const getColumnDateFilterProps = () => ({
    // NOTE: setSelectedKeys accepts only array or string but not object
    filterIcon: <SearchOutlined />,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div className="cx-column-search">
        <Space>
          <DatePicker
            placeholder="From"
            onChange={(date) => {
              const to = selectedKeys[0]?.to
              const from = date ? date.format('YYYY-MM-DD') : undefined
              if (from || to) {
                setSelectedKeys([{ from, to }])
              } else {
                setSelectedKeys([])
              }
              confirm()
            }}
          />
          <span>-</span>
          <DatePicker
            placeholder="To"
            onChange={(date) => {
              const from = selectedKeys[0]?.from
              const to = date ? date.format('YYYY-MM-DD') : undefined
              if (from || to) {
                setSelectedKeys([{ from, to }])
              } else {
                setSelectedKeys([])
              }
              confirm()
            }}
          />
        </Space>
      </div>
    ),
  })

  const columns = [
    {
      title: 'Track Title',
      dataIndex: 'trackTitle',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: true,
      ...getColumnSearchProps(),
    },
    {
      title: 'Artist',
      dataIndex: 'Artist',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: true,
    },
    {
      title: 'Album',
      dataIndex: 'Album',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: true,
    },
    {
      title: 'ISRC',
      dataIndex: 'ISRC',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: true,
      ...getColumnSearchProps(),
    },
    {
      title: 'Label',
      dataIndex: 'Label',
      filters: [...Array(100).keys()].map((index) => ({
        text: `Universal Music India Label - ${index}`,
        value: `Universal Music India Label - ${index}`,
      })),
      filterIcon: <SearchOutlined />,
    },
    {
      title: 'Policy',
      dataIndex: 'Policy',
    },
    {
      title: 'Leak Date',
      dataIndex: 'LeakDate',
      ...getColumnDateFilterProps(),
    },
    {
      title: 'Release Date',
      dataIndex: 'ReleaseDate',
      ...getColumnDateFilterProps(),
    },
    {
      title: 'Notes',
      dataIndex: '',
      render: () => <Button shape="circle" icon={<SearchOutlined />} />,
      className: 'cx-action-column',
      align: 'center',
    },
    {
      title: 'Actions',
      dataIndex: '',
      render: () => (
        <Space size={'large'}>
          <Button shape="circle" icon={<SearchOutlined />} />
          <Button shape="circle" icon={<SearchOutlined />} />
        </Space>
      ),
      className: 'cx-action-column',
      align: 'center',
    },
  ]

  return (
    <Table rowSelection={{}} columns={columns} dataSource={dataSource} pagination={false} onChange={handleOnChange} />
  )
}

export default DataTable
