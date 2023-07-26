import React, { useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Upload, Select, DatePicker } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { postApi } from '../../../Api/Api'
import dayjs from 'dayjs'

const { Option } = Select

interface CreateModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  data: any
  teamAssignment: any
  country: any
  timeZone: any
  handleChangeUserData: any
}

export default function CreateModal({
  isModalOpen,
  handleOk,
  handleCancel,
  data,
  teamAssignment,
  country,
  timeZone,
  handleChangeUserData,
}: CreateModalProps) {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const createProjectObj = { ...values }
    createProjectObj.userId = 0
    postApi(createProjectObj, '/User', 'Successfuly created the User!!!')
      .then((res) => {
        handleChangeUserData(true)
        handleCancel()
      })
      .catch((err) => {
        console.log('received ERROR while creating the user')
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onHandleChange = () => {}

  useEffect(() => {
    const formValues = data
    formValues.startDate = data.startDate ? dayjs(data.startDate) : null
    formValues.endDate = data.endDate ? dayjs(data.endDate) : null
    form.setFieldsValue(formValues)
  }, [data, form])

  return (
    <Modal
      destroyOnClose
      forceRender
      title="Create User"
      width={400}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button form="createProject" key="submit" htmlType="submit" type="primary">
          Save
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        name="createProject"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        initialValues={{
          title: '',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        id="createProject"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              className="text-center"
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: 'First Name is required!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: 'Last Name is required!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Email is required!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Team Assignment"
              name="teamAssignment"
              rules={[
                {
                  required: true,
                  message: 'Team Assignment is required!',
                },
              ]}
            >
              <Select placeholder="Select" mode="multiple" onChange={onHandleChange} allowClear>
                {teamAssignment.map((item) => (
                  <Option key={item.teamId} value={item.teamId}>
                    {item.teamName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
              initialValue={'US'}
              rules={[
                {
                  required: true,
                  message: 'Country is required!',
                },
              ]}
            >
              <Select placeholder="Select" value={'UTC'} onChange={onHandleChange} allowClear>
                {country.map((item) => (
                  <Option key={Number(item.teamId)} value={Number(item.teamId)}>
                    {item.teamName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Time Zone"
              name="timeZone"
              initialValue={'UTC'}
              rules={[
                {
                  required: true,
                  message: 'Time Zone is required!',
                },
              ]}
            >
              <Select placeholder="Select" onChange={onHandleChange} allowClear>
                {timeZone.map((item) => (
                  <Option key={item.statusTypeId} value={item.statusTypeId}>
                    {item.statusTypeDescription}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
