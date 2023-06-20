import React, { useState } from 'react'
// import '../Search/SearchComponent.css'
import { SettingOutlined, DownOutlined } from '@ant-design/icons'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Input, Space, Modal, Form, Checkbox, message, Dropdown, Button, Select, DatePicker, Row, Col } from 'antd'
import type { MenuProps } from 'antd'
import type { DatePickerProps } from 'antd'

const { Search } = Input

const options = [
  { label: 'All', value: 'All' },
  { label: 'Title', value: 'Title' },
  { label: 'Title/Artists', value: 'Title/Artists' },
  { label: 'Notes', value: 'Notes' },
]

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
  {
    label: '4rd menu item',
    key: '4',
  },
]

const handleMenuClick: MenuProps['onClick'] = (e) => {
  message.info('Click on menu item.')
}

const menuProps = {
  items,
  onClick: handleMenuClick,
}

const onSearch = (value: string) => console.log(value)
const onChange = (checkedValues: CheckboxValueType[]) => {
  console.log('checked = ', checkedValues)
}
interface IMyProps {
  open: boolean
  close: boolean
  handleClose: () => void
}

const SearchComponent: React.FC<IMyProps> = (props) => {
  //   const [open, setOpen] = useState(false)
  //   const showModal = () => {
  //     setOpen(true)
  //   }
  const handleCancel = () => {
    // setOpen(false)
    props.handleClose()
  }

  const onSelectChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
  }

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }

  return (
    <>
      <Space direction="horizontal">
        {/* <Search
          addonBefore={<SettingOutlined onClick={showModal} />}
          className="search"
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        /> */}
        <Modal title="Search Filters" open={props.open} onCancel={handleCancel} okText="submit" footer={null}>
          <Form
            name="complex-form"
            // onFinish={onFinish}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Search Within" colon={false}>
              <Space>
                <Checkbox.Group options={options} defaultValue={['All']} />
              </Space>
            </Form.Item>

            <Form.Item label="Platform" style={{ marginBottom: 0 }} colon={false}>
              <Form.Item
                name="year"
                rules={[{ required: true }]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                <Select
                  style={{ width: '125px' }}
                  showSearch
                  placeholder="Select a option"
                  optionFilterProp="children"
                  onChange={onSelectChange}
                  onSearch={onSearch}
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: 'Option 1',
                      label: 'Option 1',
                    },
                    {
                      value: 'Option 2',
                      label: 'Option 2',
                    },
                    {
                      value: 'Option 3',
                      label: 'Option 3',
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Team"
                name="month"
                style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                colon={false}
              >
                <Select
                  style={{ width: '130px' }}
                  showSearch
                  placeholder="Select a option"
                  optionFilterProp="children"
                  onChange={onSelectChange}
                  onSearch={onSearch}
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: 'Option 1',
                      label: 'Option 1',
                    },
                    {
                      value: 'Option 2',
                      label: 'Option 2',
                    },
                    {
                      value: 'Option 3',
                      label: 'Option 3',
                    },
                  ]}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label="Status" colon={false}>
              <Space.Compact>
                <Form.Item noStyle>
                  <Select
                    showSearch
                    placeholder="Select a option"
                    optionFilterProp="children"
                    onChange={onSelectChange}
                    onSearch={onSearch}
                    filterOption={(input: any, option: any) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: 'Option 1',
                        label: 'Option 1',
                      },
                      {
                        value: 'Option 2',
                        label: 'Option 2',
                      },
                      {
                        value: 'Option 3',
                        label: 'Option 3',
                      },
                    ]}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>

            <Form.Item label="LeakDate" style={{ marginBottom: 0 }} colon={false}>
              <Form.Item
                name="year"
                rules={[{ required: true }]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                colon={false}
              >
                <DatePicker onChange={onDateChange} placeholder="" />
              </Form.Item>

              <Form.Item
                label="to"
                name="month"
                // rules={[{ required: true }]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                colon={false}
              >
                <DatePicker onChange={onDateChange} placeholder="" />
              </Form.Item>
            </Form.Item>
            <Form.Item label="ReleaseDate" style={{ marginBottom: 0 }} colon={false}>
              <Form.Item
                name="year"
                rules={[{ required: true }]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                colon={false}
              >
                <DatePicker onChange={onDateChange} placeholder="" />
              </Form.Item>

              <Form.Item
                label="to"
                name="month"
                // rules={[{ required: true }]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                colon={false}
              >
                <DatePicker onChange={onDateChange} placeholder="" />
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </>
  )
}

export default SearchComponent
