import React, { useState } from 'react'
import { Button, Form, Input, DatePicker, Modal, Select, Row, Col, Space } from 'antd'
import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import { showErrorNotification } from '../../utils/notifications'
import { postApi } from '../../Api/Api'
import { removeEmptyAttributes } from './../Common/Utils'
import customParseFormat from 'dayjs/plugin/customParseFormat'
const dateFormat = 'MM-DD-YYYY'

dayjs.extend(customParseFormat)
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}
const { Option } = Select

const CreateProjectModal: React.FC<ProjectDetailsCreateModalProps> = (props) => {
  const [reviewDateFormat, setReviewDateFormat] = useState('')

  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const { artist, title, url, accountUrl, categoryId, statusId, notes, assignedTo } = values.project
    props.setLoading(true)
    const data = {
      projectLinkId: props.projectLinkIds,
      projectId: Number(props.projectId),
      artist: artist,
      title: title,
      url: url,
      assignedTo: assignedTo ? Number(assignedTo) : undefined,
      accountUrl: accountUrl,
      category: categoryId ? Number(categoryId) : undefined,
      statusId: statusId ? Number(statusId) : undefined,
      reviewDate: reviewDateFormat,
      notes: notes,
      teamId: Number(props.teamId),
    }
    postApi(removeEmptyAttributes(data), '/ProjectLink', 'Project Link updated Successfully!')
      .then(() => {
        form.resetFields()
        props.handleClose()
        props.getProjectLinks()
        props.setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        props.setLoading(false)
        showErrorNotification(error.message)
      })
  }

  const onReviewDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setReviewDateFormat(dateString)
  }

  return (
    <>
      <Modal open={props.open} title="Bulk Update Project" footer={null} width={1050} onCancel={props.handleClose}>
        <Form {...layout} labelCol={{ span: 24 }} name="nest-messages" form={form} onFinish={onFinish}>
          <Row>
            <Col span={4}>
              <Form.Item
                wrapperCol={{ span: 22 }}
                name={['project', 'artist']}
                label="Artists"
                colon={false}
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                wrapperCol={{ span: 22 }}
                name={['project', 'title']}
                label="Title"
                colon={false}
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                wrapperCol={{ span: 22 }}
                name={['project', 'categoryId']}
                label="Category"
                colon={false}
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Category">
                  {props.categoryFacets &&
                    props.categoryFacets.map((category, index) => {
                      return (
                        <Option key={index} label={category.name} value={Number(category.id)}>
                          {category.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                wrapperCol={{ span: 22 }}
                name={['project', 'assignedTo']}
                label="Assigned To"
                colon={false}
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Assignee">
                  {props.reviewerFacets &&
                    props.reviewerFacets.map((assigned, index) => {
                      return (
                        <Option key={index} label={assigned.name} value={Number(assigned.id)}>
                          {assigned.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                wrapperCol={{ span: 22 }}
                name={['project', 'reviewDate']}
                label="Review Date"
                labelCol={{ span: 24 }}
                colon={false}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={onReviewDateChange}
                  format={dateFormat}
                  placeholder=""
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                wrapperCol={{ span: 22 }}
                labelCol={{ span: 24 }}
                name={['project', 'statusId']}
                label="Status"
                colon={false}
              >
                <Select placeholder="Select Status">
                  {props.statusFacets &&
                    props.statusFacets.map((status, index) => {
                      return (
                        <Option key={index} label={status.name} value={Number(status.id)}>
                          {status.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start">
            <Col span={12}>
              <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name={['project', 'notes']} label="Notes" colon={false}>
                <Input.TextArea placeholder="Create A New Note" rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
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

export default CreateProjectModal
