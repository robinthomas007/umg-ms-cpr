import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Alert, DatePicker, Modal, Select, Row, Col, Upload, Space } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import type { DatePickerProps } from 'antd'
import { useAuth } from '../../Context/authContext'
import Api from '../../lib/api'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications'

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

const EditProjectModal: React.FC<ModalProps> = (props) => {
  const [startDateFormat, setStartDateFormat] = useState('')
  const [endDateFormat, setEndDateFormat] = useState('')
  const [form] = Form.useForm()
  const { projectData, getSearchPageData, open, platformFacets, teamFacets, statusFacets, handleClose } = props
  const { user } = useAuth()

  useEffect(() => {
    const copyProject = { ...projectData }
    const modifiedProject = copyProject
    const { startDate, endDate } = copyProject
    if (startDate) {
      setStartDateFormat(dayjs(copyProject.startDate).format('MM-DD-YYYY'))
      modifiedProject.startDate = dayjs(copyProject.startDate, dateFormat)
    }
    if (endDate) {
      setEndDateFormat(dayjs(copyProject.endDate).format('MM-DD-YYYY'))
      modifiedProject.endDate = dayjs(copyProject.endDate, dateFormat)
    }
    form.setFieldsValue(modifiedProject)
  }, [projectData, form])

  const onFinish = (values: any) => {
    const { artistList, title, platformId, teamId, statusTypeId, dragger, notes } = values
    const data = {
      projectId: projectData.projectId,
      artistList: artistList,
      title: title,
      platformId: platformId,
      teamId: teamId,
      statusTypeId: statusTypeId,
      progress: 50,
      startDate: startDateFormat,
      endDate: endDateFormat,
      notes: notes,
      userId: 1,
      isDeleted: false,
      userEmail: user.upn,
    }
    setEndDateFormat('')
    setStartDateFormat('')
    return Api.post('projects', data)
      .then((response) => {
        if (response.status === 200) {
          getSearchPageData(false)
          showSuccessNotification('Project Updated successfully')
        }
        handleClose()
      })
      .catch((error) => {
        console.log('Error received', error.message)
        showErrorNotification(error.message)
      })
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }
  const onStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setStartDateFormat(dateString)
  }
  const onEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setEndDateFormat(dateString)
  }

  return (
    <>
      <Modal open={open} title="Edit Project" centered footer={null} width={750} onCancel={handleClose}>
        <Form {...layout} name="nest-messages" form={form} onFinish={onFinish} validateMessages={validateMessages}>
          <Row>
            <Col span={14}>
              <Form.Item name="title" label="Project Title" labelAlign="left" colon={false}>
                <Input />
              </Form.Item>
              <Form.Item labelAlign="left" name="artistList" label="Ttiles/Artists" colon={false}>
                <Input />
              </Form.Item>
              <Form.Item labelAlign="left" name="platformId" label="Platform(s)" colon={false}>
                <Select>
                  {platformFacets &&
                    platformFacets.map((platform, index) => {
                      return (
                        <Option key={index} label={platform.platformName} value={platform.platformId}>
                          {platform.platformName}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
              <Form.Item labelAlign="left" name="teamId" label="Team Assignment" colon={false}>
                <Select>
                  {teamFacets &&
                    teamFacets.map((team, index) => {
                      return (
                        <Option key={index} label={team.teamName} value={team.teamId}>
                          {team.teamName}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
              <Form.Item labelAlign="left" name="statusTypeId" label="Status" colon={false}>
                <Select>
                  {statusFacets &&
                    statusFacets.map((status, index) => {
                      return (
                        <Option key={index} label={status.statusTypeDescription} value={status.statusTypeId}>
                          {status.statusTypeDescription}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
              <Form.Item name="startDate" label="Start Date" labelAlign="left" colon={false}>
                <DatePicker onChange={onStartDateChange} format={dateFormat} placeholder="" />
              </Form.Item>
              <Form.Item name="endDate" label="End Date" labelAlign="left" colon={false}>
                <DatePicker onChange={onEndDateChange} format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
            <Col span={10} className="divideComponent">
              <Form.Item>
                <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <span className="ant-upload-text">
                      <span>Upload CSV</span>
                      <br />
                      <span> Click to Browse</span>
                      <br /> <span>or Drag & Drop</span>
                    </span>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>

              <Form.Item
                name="notes"
                label="Notes"
                labelAlign="left"
                className="notesContent"
                colon={false}
                rules={[{ required: true, message: 'Please input Notes' }]}
              >
                <Input.TextArea showCount maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space>
              <Col>
                <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                  <Button onClick={() => handleClose()}>Cancel</Button>
                </Form.Item>
              </Col>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default EditProjectModal
