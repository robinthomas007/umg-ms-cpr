import React, { useState, useEffect } from 'react'
import { Button, Form, Input, DatePicker, Modal, Select, Row, Col, Space } from 'antd'
import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import { showErrorNotification } from '../../utils/notifications'
import { postApi } from '../../Api/Api'

import customParseFormat from 'dayjs/plugin/customParseFormat'
const dateFormat = 'MM-DD-YYYY'

dayjs.extend(customParseFormat)
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}
const { Option } = Select

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}
/* eslint-enable no-template-curly-in-string */

const CreateProjectModal: React.FC<ProjectDetailsCreateModalProps> = (props) => {
  const [reviewDateFormat, setReviewDateFormat] = useState('')
  const [form] = Form.useForm()
  const { projectLinkData } = props

  useEffect(() => {
    const copyProject = { ...projectLinkData }
    const modifiedProject = copyProject
    const { reviewDate } = copyProject
    if (reviewDate) {
      setReviewDateFormat(dayjs(copyProject.reviewDate).format('MM-DD-YYYY'))
      modifiedProject.reviewDate = dayjs(copyProject.reviewDate)
    }
    const getAssignedUserId = props.reviewerFacets.some((user) => Number(user.id) === modifiedProject.assignedTo)
    modifiedProject.assignedTo = getAssignedUserId ? modifiedProject.assignedTo : null
    form.setFieldsValue({ project: modifiedProject })
  }, [projectLinkData, form])

  const onFinish = (values: any) => {
    const { artist, title, url, accountUrl, categoryId, statusId, notes, assignedTo } = values.project
    props.setLoading(true)
    const data = {
      projectLinkId: props.projectLinkData ? [props.projectLinkData?.projectLinkId] : [0],
      projectId: Number(props.projectId),
      artist: artist,
      title: title,
      url: url,
      assignedTo: Number(assignedTo),
      accountUrl: accountUrl,
      category: Number(categoryId),
      statusId: Number(statusId),
      reviewDate: reviewDateFormat,
      notes: notes,
      teamId: props.teamId,
    }
    postApi(
      data,
      '/ProjectLink',
      `Project Link ${props.projectLinkData?.projectLinkId ? 'Updated' : 'Created'} Successfully!`
    )
      .then(() => {
        form.resetFields()
        props.handleClose()
        setTimeout(() => {
          props.setLoading(false)
          props.getProjectLinks()
        }, 100)
      })
      .catch((error) => {
        showErrorNotification(error.message)
        props.setLoading(false)
      })
  }

  const onReviewDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setReviewDateFormat(dateString)
  }

  const validateURL = (rule, value, callback) => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,4})(\/[^\s]*)?$/
    if (value && !urlPattern.test(value)) {
      callback('Please Enter a valid Url')
    } else {
      callback()
    }
  }

  return (
    <>
      <Modal open={props.open} title="Create Project" centered footer={null} width={450} onCancel={props.handleClose}>
        <Form {...layout} name="nest-messages" form={form} onFinish={onFinish} validateMessages={validateMessages}>
          <Row>
            <Col span={24}>
              <Form.Item
                name={['project', 'url']}
                rules={[{ required: true, message: 'Please Enter URL' }, { validator: validateURL }]}
                label="URL"
                labelAlign="left"
                colon={false}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['project', 'accountUrl']}
                rules={[{ required: true, message: 'Please Enter Account URL' }, { validator: validateURL }]}
                label="Account URL"
                labelAlign="left"
                colon={false}
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name={['project', 'artist']}
                rules={[{ required: true, message: 'Please Enter Artist' }]}
                label="Artist"
                colon={false}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['project', 'title']}
                rules={[{ required: true, message: 'Please Enter Title' }]}
                label="Title"
                labelAlign="left"
                colon={false}
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                rules={[{ required: true, message: 'Please Select Category' }]}
                name={['project', 'categoryId']}
                label="Category"
                colon={false}
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
              <Form.Item
                labelAlign="left"
                rules={[{ required: true, message: 'Please Select Reviewer' }]}
                name={['project', 'assignedTo']}
                label="Reviewer"
                colon={false}
              >
                <Select placeholder="Select Reviewer">
                  {props.reviewerFacets &&
                    props.reviewerFacets.map((team, index) => {
                      return (
                        <Option key={index} label={team.name} value={Number(team.id)}>
                          {team.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>

              <Form.Item
                name={['project', 'reviewDate']}
                rules={[{ required: true, message: 'Please Enter Review Date' }]}
                label="Review Date"
                labelAlign="left"
                colon={false}
              >
                <DatePicker onChange={onReviewDateChange} format={dateFormat} placeholder="" />
              </Form.Item>

              <Form.Item
                labelAlign="left"
                rules={[{ required: true, message: 'Please Select Status' }]}
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
