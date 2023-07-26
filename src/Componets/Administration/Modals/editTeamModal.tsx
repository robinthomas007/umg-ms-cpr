import React, { useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Upload, Select, DatePicker } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { postApi } from '../../../Api/Api'
import dayjs from 'dayjs'

const { Option } = Select

interface EditTeamModalProps {
  data: any
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  handleChangeTeamData: any
}

export default function EditTeamModal({
  isModalOpen,
  handleOk,
  handleCancel,
  handleChangeTeamData,
  data,
}: EditTeamModalProps) {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const updatedTeamObj = { ...values }
    updatedTeamObj.teamId = data.teamId
    postApi(updatedTeamObj, '/team', 'successfully created team')
      .then((res: any) => {
        handleChangeTeamData(true)
        handleCancel()
      })
      .catch((error: any) => {
        handleCancel()
        console.log('error feching data', error)
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onHandleChange = () => {}

  useEffect(() => {
    const formValues = data
    form.setFieldsValue(formValues)
  }, [data, form])

  return (
    <Modal
      destroyOnClose
      forceRender
      title="Update Team"
      width={400}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button form="createTeam" key="submit" htmlType="submit" type="primary">
          Save
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        name="createTeam"
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
        id="createTeam"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              className="text-center"
              label="Team Name"
              name="teamName"
              rules={[
                {
                  required: true,
                  message: 'Team Name is required!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
