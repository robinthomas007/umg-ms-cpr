import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import type { DatePickerProps } from 'antd'
import { postApi } from '../../../Api/Api'
const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'MM-DD-YYYY'
interface EventModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

export default function EventModal({ isModalOpen, handleOk, handleCancel }: EventModalProps) {
  const [form] = Form.useForm()
  const [releaseForm] = Form.useForm()
  const [holidayForm] = Form.useForm()
  const [absenseForm] = Form.useForm()
  const [selectedEvent, setSelectedEvent] = useState<number>(0)
  const [startDateFormat, setStartDateFormat] = useState('')
  const [endDateFormat, setEndDateFormat] = useState('')
  const [submitType, setSubmitType] = useState<any>('')
  const [typeOfForm, setTypeOfForm] = useState<string>('')

  useEffect(() => {}, [form])

  const events = [
    { name: 'Release', id: 1 },
    { name: 'Holiday', id: 2 },
    { name: 'Absense', id: 3 },
  ]
  const countries = [
    { name: 'India', id: 1 },
    { name: 'US', id: 2 },
    { name: 'UK', id: 3 },
  ]

  const onFinish = (values: any) => {
    console.log('submitted values', values)
  }
  const onReleaseFinish = (values: any) => {
    console.log('Relase submitted values', values)
  }
  const onHolidayFinish = (values: any) => {
    console.log('Holiday submitted values', values)
  }
  const onAbsenseFinish = (values: any) => {
    console.log('Absenses submitted values', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const handleChange = (value: number) => {
    if (value === 1) {
      setTypeOfForm('releaseForm')
      setSubmitType(() => onReleaseFinish)
    } else if (value === 2) {
      setTypeOfForm('holidayForm')
      setSubmitType(() => onHolidayFinish)
    } else {
      setTypeOfForm('absenseForm')
      setSubmitType(() => onAbsenseFinish)
    }
    setSelectedEvent(Number(value))
  }

  const onStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setStartDateFormat(dateString)
  }
  const onEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setEndDateFormat(dateString)
  }
  return (
    <Modal
      destroyOnClose
      forceRender
      title="Add Event"
      width={400}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button form={typeOfForm} onClick={submitType} key="submit" htmlType="submit" type="primary">
          Save
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          title: '',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label="Event Type"
              name="eventType"
              //   rules={[
              //     {
              //       required: true,
              //       message: 'Event type is required!',
              //     },
              //   ]}
            >
              <Select placeholder="Select Event" onChange={handleChange} showArrow allowClear>
                {events.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {selectedEvent === 1 && (
        <Form
          form={releaseForm}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            title: '',
          }}
          onFinish={onReleaseFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="releaseForm"
        >
          <Row>
            <Col span={24}>
              <Form.Item
                label="Project Name"
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: 'Project Name is required!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="text-center"
                label="Artist Name"
                name="artistName"
                rules={[
                  {
                    required: true,
                    message: 'Artist Name is required!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Release Date is required!',
                  },
                ]}
                name="releaseDate"
                label="Release Date"
                labelAlign="left"
                colon={false}
              >
                <DatePicker onChange={onStartDateChange} format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
      {selectedEvent === 2 && (
        <Form
          form={holidayForm}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            title: '',
          }}
          onFinish={onHolidayFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="holidayForm"
        >
          <Row>
            <Col span={24}>
              <Form.Item label="Holiday Name" name="holiday">
                <Input />
              </Form.Item>

              <Form.Item label="Country" name="country">
                <Select placeholder="Select Country" onChange={handleChange} showArrow allowClear>
                  {countries.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.item label="Country" name="country">
                <RangePicker picker="month" />
              </Form.item> */}
              <Form.Item label="Holiday Date" name="holidayDate">
                <RangePicker />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
      {selectedEvent === 3 && (
        <Form
          form={holidayForm}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            title: '',
          }}
          onFinish={onAbsenseFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="absenseForm"
        >
          <Row>
            <Col span={24}>
              <Form.Item
                label="User Name"
                name="userName"
                colon={false}
                rules={[
                  {
                    required: true,
                    message: 'UserName Name is required!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Team Name"
                name="teamName"
                colon={false}
                rules={[
                  {
                    required: true,
                    message: 'Team Name is required!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="startDate" label="Start Date" labelAlign="left" colon={false}>
                <DatePicker onChange={onStartDateChange} format={dateFormat} placeholder="" />
              </Form.Item>
              <Form.Item name="endDate" label="End Date" labelAlign="left" colon={false}>
                <DatePicker onChange={onEndDateChange} format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  )
}
