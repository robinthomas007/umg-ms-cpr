import React, { useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col } from 'antd'
import { postApi } from '../../../Api/Api'

interface CreateModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  handleChangeTeamData: any
  data: any
}

export default function CreateModal({
  isModalOpen,
  handleOk,
  handleCancel,
  handleChangeTeamData,
  data,
}: CreateModalProps) {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    let successMessage = 'Team Created Successfuly !'
    if (data?.teamId) {
      values = { ...data, ...values }
      successMessage = 'Team Updated Successfully!'
    }
    postApi(values, '/team', successMessage)
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

  useEffect(() => {
    if (data) {
      const formValues = data
      form.setFieldsValue(formValues)
    }
  }, [data, form])

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
