import React, { useEffect, useState } from 'react'
import { SettingOutlined, DownOutlined } from '@ant-design/icons'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import {
  Input,
  Space,
  Modal,
  Mentions,
  Form,
  Checkbox,
  message,
  Dropdown,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd'
import type { MenuProps } from 'antd'
import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { format } from 'path'

dayjs.extend(customParseFormat)

const { Option } = Select

const dateFormat = 'MM-DD-YYYY'

const reportedByData = ['vinod', 'selvam', 'kumar', 'vinoth', 'robin', 'vishva']
const typeData = ['Notification', 'Task']

const FilterModal: React.FC<MyQueueModalProps> = (props) => {
  const [searchWithin, setSearchWithin] = useState<any>(['ALL'])
  const [startDateFormat, setStartDateFormat] = useState('')
  const [endDateFormat, setEndDateFormat] = useState('')
  const [form] = Form.useForm()

  const handleCancel = () => {
    props.handleClose()
  }

  const onStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setStartDateFormat(dateString)
  }
  const onEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setEndDateFormat(dateString)
  }
  const onFinish = (values: any) => {
    const modifiedSelectedFilters = { ...values }
    console.log('values', values)
    if (modifiedSelectedFilters.updatedFrom) {
      modifiedSelectedFilters.updatedFrom = dayjs(modifiedSelectedFilters.updatedFrom).format('MM-DD-YYYY')
    }
    if (modifiedSelectedFilters.updatedTo) {
      modifiedSelectedFilters.updatedTo = dayjs(modifiedSelectedFilters.updatedTo).format('MM-DD-YYYY')
    }

    modifiedSelectedFilters.searchWithin = searchWithin.join(',')
    console.log('after modified data', modifiedSelectedFilters)
    props.handleSelectedFilters(modifiedSelectedFilters)
    // setStartDateFormat('')
    // setEndDateFormat('')
    // setSearchWithin(sea)
    // form.setFieldsValue
    // form.resetFields()
  }
  const defaultSelectedFilters = {
    updatedTo: '',
    updatedFrom: '',
    searchWithin: 'ALL',
    reportedBy: '',
    type: '',
  }
  useEffect(() => {
    const modifiedFilters: any = { ...defaultSelectedFilters, ...Object.fromEntries(props.selectedFilters) }
    if (modifiedFilters.searchWithin === 'ALL' && !searchWithin.includes('ALL')) {
      setSearchWithin(['ALL'])
    }
    if (modifiedFilters.updatedFrom) {
      modifiedFilters.updatedFrom = dayjs(modifiedFilters.updatedFrom).format('MM-DD-YYYY')
    }
    if (modifiedFilters.updatedTo) {
      modifiedFilters.updatedTo = dayjs(modifiedFilters.updatedTo).format('MM-DD-YYYY')
    }
    form.setFieldsValue(modifiedFilters)
  }, [props.selectedFilters, form])

  const onCheckAllChange = (e: any) => {
    if (e.target.type === 'checkbox') {
      let arr = searchWithin
      if (e.target.checked) {
        if (e.target.id === 'ALL') {
          arr = []
        } else {
          let index = arr.indexOf('ALL')
          if (index !== -1) {
            arr.splice(index, 1)
          }
        }
        arr.push(e.target.id)
      } else {
        arr = arr.filter(function (item: any) {
          return item !== e.target.id
        })
        if (arr.length === 0) {
          arr.push('ALL')
        }
      }
      const modifiedFilterArray = [...arr]
      setSearchWithin(modifiedFilterArray)
    } else {
      console.log('not a checkbox type')
    }
  }

  return (
    <>
      <Modal
        title="Search Filters"
        style={{ top: 20 }}
        width={600}
        open={props.open}
        onCancel={handleCancel}
        okText="submit"
        footer={null}
      >
        <Form name="filterModal-form" form={form} onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item name="searchWithin" label="Search Within" colon={false}>
            <Space>
              <Checkbox
                defaultChecked={searchWithin.includes('ALL')}
                checked={searchWithin.includes('ALL')}
                onChange={onCheckAllChange}
                id="ALL"
              >
                All
              </Checkbox>
              {/* <Checkbox
                id="updatedDateTime"
                name="updatedDateTime"
                defaultChecked={searchWithin.includes('updatedDateTime')}
                checked={searchWithin.includes('updatedDateTime')}
                onChange={onCheckAllChange}
              >
                Updated Date
              </Checkbox> */}
              <Checkbox
                id="reportedBy"
                name="reportedBy"
                defaultChecked={searchWithin.includes('reportedBy')}
                checked={searchWithin.includes('reportedBy')}
                onChange={onCheckAllChange}
              >
                Reported By
              </Checkbox>
              <Checkbox
                id="type"
                name="type"
                defaultChecked={searchWithin.includes('type')}
                checked={searchWithin.includes('type')}
                onChange={onCheckAllChange}
              >
                Type
              </Checkbox>
            </Space>
          </Form.Item>

          <Form.Item label="Updated From" style={{ marginBottom: 0 }} colon={false}>
            <Form.Item name="updatedFrom" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} colon={false}>
              <DatePicker onChange={onStartDateChange} format={dateFormat} placeholder="" />
            </Form.Item>

            <Form.Item
              label="Updated To"
              name="updatedTo"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              colon={false}
            >
              <DatePicker onChange={onEndDateChange} format={dateFormat} placeholder="" />
            </Form.Item>
          </Form.Item>

          <Form.Item label="ReportedBy" style={{ marginBottom: 0 }} colon={false}>
            <Form.Item name="reportedBy" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
              <Select
                style={{ width: '125px' }}
                showSearch
                placeholder="Select a option"
                optionFilterProp="children"
                optionLabelProp="label"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {props.userFacets &&
                  props.userFacets.map((user, index) => {
                    return (
                      <Option key={index} label={user.name} value={user.id}>
                        {user.name}
                      </Option>
                    )
                  })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              colon={false}
            >
              <Select
                style={{ width: '125px' }}
                showSearch
                placeholder="Select a option"
                optionFilterProp="children"
                optionLabelProp="label"
              >
                {props.typeFacets &&
                  props.typeFacets.map((type, index) => {
                    return (
                      <Option key={index} label={type.name} value={type.id}>
                        {type.name}
                      </Option>
                    )
                  })}
              </Select>
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
                  <Button onClick={() => props.handleClose()}>Cancel</Button>
                </Form.Item>
              </Col>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default FilterModal
