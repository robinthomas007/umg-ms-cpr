import React, { useState } from 'react'
import { Button, Form, Input, InputNumber, DatePicker, Modal, Select, Row, Col, Upload, Space } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import type { DatePickerProps } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
const { RangePicker } = DatePicker
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
interface Platform {
  platformId: number
  platformName: string
}
interface Teams {
  teamId: number
  teamName: string
}
interface Status {
  statusTypeId: number
  statusTypeDescription: string
}

interface ModalProps {
  open: boolean
  close: boolean
  platformFacets: Platform[]
  teamFacets: Teams[]
  statusFacets: Status[]
  handleClose: () => void
  state: any
  dispatch: any
}

const CreateProjectModal: React.FC<ModalProps> = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('Content of the modal')
  const [startDateFormat, setStartDateFormat] = useState('')
  const [endDateFormat, setEndDateFormat] = useState('')

  const onFinish = (values: any) => {
    const { artist, projectTitle, platforms, teams, status, startDate, endDate, dragger, notes } = values.project
    const data = {
      projectId: 0,
      artistList: artist,
      title: projectTitle,
      platformId: platforms,
      teamId: teams,
      statusTypeId: status,
      progress: 50,
      startDate: startDateFormat,
      endDate: endDateFormat,
      notes: notes,
      userId: 1,
      isDeleted: false,
      userEmail: 'vinoth.periyasamy@umusic.com',
    }
    axios.post('https://api.dev.cpr-portal.umgapps.com/gateway/cpr/projects', data).then((response) => {
      props.dispatch({ type: 'CHANGE_LIMIT', payload: 10 })
      props.handleClose()
    })
  }

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds')
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmLoading(false)
    }, 2000)
  }
  const normFile = (e: any) => {
    // console.log('Upload event:', e)
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

  // const onFinish = (values: any) => {
  //   console.log('Received values of form: ', values)
  // }

  return (
    <>
      <Modal
        open={props.open}
        title="Create Project"
        onOk={handleOk}
        centered
        confirmLoading={confirmLoading}
        footer={null}
        width={700}
        onCancel={props.handleClose}
      >
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
          <Row>
            <Col span={14}>
              <Form.Item
                name={['project', 'projectTitle']}
                rules={[{ required: true, message: 'Please input title' }]}
                label="Project Title"
                labelAlign="left"
                colon={false}
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                name={['project', 'artist']}
                rules={[{ required: true, message: 'Please input Artist' }]}
                label="Ttiles/Artists"
                colon={false}
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                rules={[{ required: true, message: 'Please select platform' }]}
                name={['project', 'platforms']}
                label="Platform(s)"
                colon={false}
              >
                <Select>
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
                labelAlign="left"
                rules={[{ required: true, message: 'Please select Teams' }]}
                name={['project', 'teams']}
                label="Team Assignment"
                colon={false}
              >
                <Select>
                  {props.teamFacets &&
                    props.teamFacets.map((team) => {
                      return (
                        <Option label={team.teamName} value={team.teamId}>
                          {team.teamName}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
              <Form.Item
                labelAlign="left"
                rules={[{ required: true, message: 'Please select status' }]}
                name={['project', 'status']}
                label="Status"
                colon={false}
              >
                <Select>
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
              <Form.Item name={['project', 'startDate']} label="Start Date" labelAlign="left" colon={false}>
                <DatePicker onChange={onStartDateChange} format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
            <Col span={10} className="divideComponent">
              <Form.Item>
                <Form.Item name={['project', 'dragger']} valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>

              <Form.Item
                name={['project', 'notes']}
                label="Notes"
                labelAlign="left"
                className="notesContent"
                colon={false}
                rules={[{ required: true, message: 'Please input Notes' }]}
              >
                <Input.TextArea showCount maxLength={100} />
              </Form.Item>
              <Form.Item name={['project', 'endDate']} label="End Date" labelAlign="left" colon={false}>
                <DatePicker onChange={onEndDateChange} format={dateFormat} placeholder="" />
              </Form.Item>
              <Row justify="end">
                <Space>
                  <Col>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
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
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default CreateProjectModal
