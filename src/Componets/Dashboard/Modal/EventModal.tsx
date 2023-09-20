import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import type { DatePickerProps } from 'antd'
import { postApi } from '../../../Api/Api'
// import { v4 as uuidv4 } from 'uuid'

import dayjs from 'dayjs'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'MM-DD-YYYY'
interface EventModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  data: any
}

export default function EventModal({ isModalOpen, handleOk, handleCancel, data }: EventModalProps) {
  const [form] = Form.useForm()
  const [releaseForm] = Form.useForm()
  const [holidayForm] = Form.useForm()
  const [absenseForm] = Form.useForm()
  const [selectedEvent, setSelectedEvent] = useState<number>(0)
  const [submitType, setSubmitType] = useState<any>('')
  const [typeOfForm, setTypeOfForm] = useState<string>('')
  // const uniqueId = uuidv4()
  useEffect(() => {
    const updatedEvent = { ...data }
    console.log('updated event', updatedEvent)
    const selectedEventType = events.find((event) => event.name === updatedEvent.categories)
    console.log('selectedEventType', selectedEventType)
    setFormType(selectedEventType?.id)
    form.setFieldsValue({ eventType: selectedEventType?.id })
  }, [data])

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

  const getEventPayload = (data, startDate, endDate) => {
    const payload: any = {
      id: '',
      subject: data.subject,
      start: {
        dateTime: startDate,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDate,
        timeZone: 'UTC',
      },
      body: {
        contentType: 1,
        content: data.content,
      },
      reminderMinutesBeforeStart: 1440,
      categories: data.category,
    }
    if (data.category[0] === 'Holiday') {
      const selectedCountry = countries.find((country) => country.id === Number(data.country))
      payload.location = { displayName: selectedCountry?.name }
    }
    // if (data.category[0] === 'Release') {
    //   payload.singleValueExtendedProperties = [
    //     {
    //       id: `String ${uniqueId}`,
    //       value: `${data.projectName}`,
    //     },
    //     {
    //       id: `String ${uniqueId}`,
    //       value: `${data.artistName}`,
    //     },
    //   ]
    // }
    // console.log(`${data.category[0]} submitted value ${JSON.stringify(payload)}}`)
    postApi(payload, '/calendar/AddEvents', '')
      .then((res) => {
        handleOk()
      })
      .catch((err) => {
        console.log(`getting error when adding ${data.category[0]} event`, err)
      })
  }

  const onReleaseFinish = (values: any) => {
    const modifiedRelese = { ...values }
    modifiedRelese.category = ['Release']
    modifiedRelese.subject = `New Release`
    modifiedRelese.content = `${modifiedRelese.artistName}/${modifiedRelese.projectName}`
    const releaseDate = dayjs(modifiedRelese.releaseDate.$d)
    const dateWithZeroTime = releaseDate.set('hour', 0).set('minute', 0).set('second', 0)
    const releaseDateFormat = dateWithZeroTime.format('YYYY-MM-DDTHH:mm:ss')
    getEventPayload(modifiedRelese, releaseDateFormat, releaseDateFormat)
  }
  const onHolidayFinish = (values: any) => {
    const updatedHolidayObj = { ...values }
    updatedHolidayObj.content = ``
    updatedHolidayObj.subject = updatedHolidayObj.holiday
    updatedHolidayObj.category = ['Holiday']
    const startDate = dayjs(updatedHolidayObj.startDate.$d)
    const endDate = dayjs(updatedHolidayObj.endDate.$d)
    const startDateFormat = startDate.format('YYYY-MM-DDTHH:mm:ss')
    const endDateFormat = endDate.format('YYYY-MM-DDTHH:mm:ss')
    getEventPayload(updatedHolidayObj, startDateFormat, endDateFormat)
  }
  const onAbsenseFinish = (values: any) => {
    const updatedAbsenseObj = { ...values }
    updatedAbsenseObj.subject = 'Vacation'
    updatedAbsenseObj.category = ['Absense']
    const startDate = dayjs(updatedAbsenseObj.startDate.$d)
    const endDate = dayjs(updatedAbsenseObj.endDate.$d)
    const startDateFormat = startDate.format('YYYY-MM-DDTHH:mm:ss')
    const endDateFormat = endDate.format('YYYY-MM-DDTHH:mm:ss')
    updatedAbsenseObj.content = `${updatedAbsenseObj.userName}/${updatedAbsenseObj.teamName}`
    getEventPayload(updatedAbsenseObj, startDateFormat, endDateFormat)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const setFormType = (value) => {
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
  const handleChange = (value: number) => {
    setFormType(value)
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
                    message: 'Date is required!',
                  },
                ]}
                name="releaseDate"
                label="Release Date"
                labelAlign="left"
                colon={false}
              >
                <DatePicker format={dateFormat} placeholder="" />
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
                <Select placeholder="Select Country" showArrow allowClear>
                  {countries.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Start Date is required!',
                  },
                ]}
                name="startDate"
                label="Start Date"
                labelAlign="left"
                colon={false}
              >
                <DatePicker format={dateFormat} placeholder="" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'End Date is required!',
                  },
                ]}
                name="endDate"
                label="End Date"
                labelAlign="left"
                colon={false}
              >
                <DatePicker format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
      {selectedEvent === 3 && (
        <Form
          form={absenseForm}
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
                <DatePicker format={dateFormat} placeholder="" />
              </Form.Item>
              <Form.Item name="endDate" label="End Date" labelAlign="left" colon={false}>
                <DatePicker format={dateFormat} placeholder="" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  )
}
