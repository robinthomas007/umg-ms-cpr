import React, { useEffect, useState } from 'react'
import { Space, Modal, Form, Checkbox, Button, Select, DatePicker, Row, Col } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const { Option } = Select

const dateFormat = 'MM-DD-YYYY'

const FilterModal: React.FC<ProjectDetailsCreateModalProps> = (props) => {
  const [searchWithin, setSearchWithin] = useState<any>(['ALL'])

  const [form] = Form.useForm()

  const handleCancel = () => {
    props.handleClose()
  }

  const onFinish = (values: any) => {
    const modifiedProject = { ...values }
    if (modifiedProject.reviewDateTo) {
      modifiedProject.reviewDateTo = dayjs(modifiedProject.reviewDateTo).format('MM-DD-YYYY')
    }
    if (modifiedProject.reviewDateFrom) {
      modifiedProject.reviewDateFrom = dayjs(modifiedProject.reviewDateFrom).format('MM-DD-YYYY')
    }
    modifiedProject.searchWithin = searchWithin.join(',')
    props.handleSelectedFilters(modifiedProject)
  }
  const defaultSelectedFilters = {
    endDate: '',
    platforms: undefined,
    searchWithin: 'ALL',
    reviewDate: '',
    status: undefined,
    teams: undefined,
  }

  useEffect(() => {
    const modifiedFilters: any = { ...defaultSelectedFilters, ...Object.fromEntries(props.selectedFilters) }
    if (modifiedFilters.searchWithin === 'ALL' && !searchWithin.includes('ALL')) {
      setSearchWithin(['ALL'])
    }
    if (modifiedFilters.reviewDateFrom) {
      modifiedFilters.reviewDateFrom = dayjs(modifiedFilters.reviewDateFrom, dateFormat)
    }
    if (modifiedFilters.reviewDateTo) {
      modifiedFilters.reviewDateTo = dayjs(modifiedFilters.reviewDateTo, dateFormat)
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
        <Form name="filterModal-form" form={form} onFinish={onFinish} labelCol={{ span: 7 }} wrapperCol={{ span: 14 }}>
          <Row>
            <Col>
              <Form.Item name="searchWithin" label="Search Within " colon={false}>
                <Space size={12}>
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
                    Artists
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
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Item label="Category" name="categoryId" colon={false}>
                <Select
                  showSearch
                  placeholder="Select a option"
                >
                  {props.categoryFacets &&
                    props.categoryFacets.map((category, index) => {
                      return (
                        <Option key={index} label={category.name} value={category.id}>
                          {category.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Assigned To" name="assignedTo" colon={false}>
                <Select
                  showSearch
                  placeholder="Select a option"
                >
                  {props.reviewerFacets &&
                    props.reviewerFacets.map((team, index) => {
                      return (
                        <Option key={index} label={team.name} value={team.id}>
                          {team.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Item name="statusId" colon={false} label="Status">
                <Select
                  showSearch
                  placeholder="Select a option"
                >
                  {props.statusFacets &&
                    props.statusFacets.map((status, index) => {
                      return (
                        <Option key={index} label={status.name} value={status.id}>
                          {status.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Item label="Review From" name="reviewDateFrom" colon={false}>
                <DatePicker style={{ width: '100%' }} format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="To" labelCol={{ span: 2 }} name="reviewDateTo" colon={false}>
                <DatePicker style={{ width: '100%' }} format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
          </Row>
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
