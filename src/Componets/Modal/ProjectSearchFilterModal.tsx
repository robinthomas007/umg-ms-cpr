import React, { useEffect, useState } from 'react'
import { SettingOutlined, DownOutlined } from '@ant-design/icons'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { Input, Space, Modal, Form, Checkbox, message, Dropdown, Button, Select, DatePicker, Row, Col } from 'antd'
import type { MenuProps } from 'antd'
import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { format } from 'path'

dayjs.extend(customParseFormat)

const { Option } = Select

const dateFormat = 'MM-DD-YYYY'

const FilterModal: React.FC<ModalProps> = (props) => {
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
    const modifiedProject = { ...values }
    if (modifiedProject.startDate) {
      modifiedProject.startDate = dayjs(modifiedProject.startDate).format('MM-DD-YYYY')
    }
    if (modifiedProject.endDate) {
      modifiedProject.endDate = dayjs(modifiedProject.endDate).format('MM-DD-YYYY')
    }
    modifiedProject.searchWithin = searchWithin.join(',')
    props.handleSelectedFilters(modifiedProject)
    // setStartDateFormat('')
    // setEndDateFormat('')
    // setSearchWithin(sea)
    // form.setFieldsValue
    // form.resetFields()
  }
  const defaultSelectedFilters = {
    endDate: '',
    platforms: undefined,
    searchWithin: 'ALL',
    startDate: '',
    status: undefined,
    teams: undefined,
  }
  useEffect(() => {
    const modifiedFilters: any = { ...defaultSelectedFilters, ...Object.fromEntries(props.selectedFilters) }
    if (modifiedFilters.searchWithin === 'ALL' && !searchWithin.includes('ALL')) {
      setSearchWithin(['ALL'])
    }
    if (modifiedFilters.startDate) {
      modifiedFilters.startDate = dayjs(modifiedFilters.startDate, dateFormat)
    }
    if (modifiedFilters.endDate) {
      modifiedFilters.endDate = dayjs(modifiedFilters.endDate, dateFormat)
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
              <Checkbox
                id="title"
                name="title"
                defaultChecked={searchWithin.includes('title')}
                checked={searchWithin.includes('title')}
                onChange={onCheckAllChange}
              >
                Title
              </Checkbox>
              <Checkbox
                id="artistList"
                name="artistList"
                defaultChecked={searchWithin.includes('artistList')}
                checked={searchWithin.includes('artistList')}
                onChange={onCheckAllChange}
              >
                Title/Artists List
              </Checkbox>
              <Checkbox
                id="notes"
                name="notes"
                defaultChecked={searchWithin.includes('notes')}
                checked={searchWithin.includes('notes')}
                onChange={onCheckAllChange}
              >
                Notes
              </Checkbox>
            </Space>
          </Form.Item>

          <Form.Item label="Platform" style={{ marginBottom: 0 }} colon={false}>
            <Form.Item name="platforms" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
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
                {props.platformFacets &&
                  props.platformFacets.map((platform, index) => {
                    return (
                      <Option key={index} label={platform.platformName} value={platform.platformId}>
                        {platform.platformName}
                      </Option>
                    )
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              label="Team"
              name="teams"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
              colon={false}
            >
              <Select
                style={{ width: '130px' }}
                showSearch
                placeholder="Select a option"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {props.teamFacets &&
                  props.teamFacets.map((team, index) => {
                    return (
                      <Option key={index} label={team.teamName} value={team.teamId}>
                        {team.teamName}
                      </Option>
                    )
                  })}
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Status" colon={false}>
            <Space.Compact>
              <Form.Item name="status" noStyle>
                <Select
                  showSearch
                  placeholder="Select a option"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {props.statusFacets &&
                    props.statusFacets.map((status, index) => {
                      return (
                        <Option key={index} label={status.statusTypeDescription} value={status.statusTypeId}>
                          {status.statusTypeDescription}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="Start Date" style={{ marginBottom: 0 }} colon={false}>
            <Form.Item name="startDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} colon={false}>
              <DatePicker onChange={onStartDateChange} format={dateFormat} placeholder="" />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
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
