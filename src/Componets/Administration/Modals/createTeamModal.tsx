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
  handleChangeTeamData: any
}

export default function CreateModal({ isModalOpen, handleOk, handleCancel, handleChangeTeamData }: CreateModalProps) {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const createTeamObj = { ...values }
    createTeamObj.teamId = 0
    console.log('create Team data', createTeamObj)
    postApi(createTeamObj, '/team', 'successfully created team')
      .then((res: any) => {
        handleChangeTeamData(true)
        handleCancel()
      })
      .catch((error: any) => {
        handleCancel()
        console.log('error feching data', error)
      })
    // {"userId":0,"firstName":"bbb","lastName":"ccc","email":"bbbccc@gmail.com",
    // "country":"US","timeZone":"UTC","teamAssignment":[1,2],"isDelete":false}
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onHandleChange = () => {}

  //   useEffect(() => {
  //     const formValues = data
  //     form.setFieldsValue(formValues)
  //   }, [data, form])

  return (
    <Modal
      destroyOnClose
      forceRender
      title="Create Team"
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
