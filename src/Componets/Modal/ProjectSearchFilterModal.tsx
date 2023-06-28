import React, { useState } from 'react'
// import '../Search/SearchComponent.css'
import { SettingOutlined, DownOutlined } from '@ant-design/icons'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Input, Space, Modal, Form, Checkbox, message, Dropdown, Button, Select, DatePicker, Row, Col } from 'antd'
import type { MenuProps } from 'antd'
import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

dayjs.extend(customParseFormat)

const { Search } = Input
const { Option } = Select

const dateFormat = 'MM-DD-YYYY'

const options = [
  { label: 'Title', value: 'Title' },
  { label: 'Title/Artists', value: 'Title/Artists' },
  { label: 'Notes', value: 'Notes' },
]
const plainOptions = ['Title', 'Title/Artists', 'Notes']
const defaultCheckedList = ['Apple', 'Orange']

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

interface Platform {
  platformId: number
  platformName: string
}
interface Teams {
  teamId: string
  teamName: string
}
interface Status {
  statusTypeId: number
  statusTypeDescription: string
}
interface FilterProps {
  open: boolean
  close: boolean
  platformFacets: Platform[]
  teamFacets: Teams[]
  statusFacets: Status[]
  handleClose: () => void
  state: any
  dispatch: any
  handleFlterModalSubmit: any
}

const SearchComponent: React.FC<FilterProps> = (props) => {
  const [searchWithin, setSearchWithin] = useState<CheckboxValueType[]>(['All'])
  const [startDateFormat, setStartDateFormat] = useState('')
  const [endDateFormat, setEndDateFormat] = useState('')

  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  const handleCancel = () => {
    // setOpen(false)
    props.handleClose()
  }
  const onChange = (list: CheckboxValueType[]) => {
    setSearchWithin(list)
    // setIndeterminate(false)

    setIndeterminate(!!list.length && list.length < plainOptions.length)
    setCheckAll(list.length === plainOptions.length)
  }
  // const onChange = (e: CheckboxChangeEvent) => {
  //   console.log(`checked = ${e.target.checked}`)
  // }
  const onAllChange = (checkedValues) => {
    // console.log('checked!!! = ', checkedValues.target.checked)
    // setSearchWithin(checkedValues)
  }
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setSearchWithin(e.target.checked ? [] : plainOptions)
    setIndeterminate(true)
    setCheckAll(e.target.checked)
  }

  const onSelectChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value: string) => {}

  const onStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setStartDateFormat(dateString)
  }
  const onEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setEndDateFormat(dateString)
  }
  const onFinish = (values: any) => {
    const modifiedProject = values.project
    modifiedProject.startDate = startDateFormat
    modifiedProject.endDate = endDateFormat
    modifiedProject.searchWithin = searchWithin.join(',')
    props.handleFlterModalSubmit(modifiedProject)
  }

  return (
    <>
      <Modal title="Search Filters" width={600} open={props.open} onCancel={handleCancel} okText="submit" footer={null}>
        <Form name="filterModal-form" onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item name={['project', 'searchWithin']} label="Search Within" colon={false}>
            <Space>
              <Checkbox checked={true} onChange={onCheckAllChange}>
                All
              </Checkbox>

              <Checkbox.Group options={options} defaultValue={searchWithin} onChange={onChange} />
            </Space>
          </Form.Item>

          <Form.Item label="Platform" style={{ marginBottom: 0 }} colon={false}>
            <Form.Item
              name={['project', 'platform']}
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
                optionLabelProp="label"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {props.platformFacets &&
                  props.platformFacets.map((platform) => {
                    return (
                      <Option label={platform.platformName} value={platform.platformId}>
                        {platform.platformName}
                      </Option>
                    )
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              label="Team"
              name={['project', 'teams']}
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
              >
                {props.teamFacets &&
                  props.teamFacets.map((team) => {
                    return (
                      <Option key={team.teamId} label={team.teamName} value={team.teamId}>
                        {team.teamName}
                      </Option>
                    )
                  })}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Status" colon={false}>
            <Space.Compact>
              <Form.Item name={['project', 'status']} noStyle>
                <Select
                  showSearch
                  placeholder="Select a option"
                  optionFilterProp="children"
                  onChange={onSelectChange}
                  onSearch={onSearch}
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {props.statusFacets &&
                    props.statusFacets.map((status) => {
                      return (
                        <Option label={status.statusTypeDescription} value={status.statusTypeId}>
                          {status.statusTypeDescription}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="Start Date" style={{ marginBottom: 0 }} colon={false}>
            <Form.Item
              name={['project', 'startDate']}
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              colon={false}
            >
              <DatePicker onChange={onStartDateChange} format={dateFormat} placeholder="" />
            </Form.Item>

            <Form.Item
              label="End Date"
              name={['project', 'endDate']}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              colon={false}
            >
              <DatePicker onChange={onEndDateChange} format={dateFormat} placeholder="" />
            </Form.Item>
          </Form.Item>

          <Row justify="end">
            <Space>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Apply
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button onClick={() => props.handleClose()} type="primary">
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default SearchComponent
