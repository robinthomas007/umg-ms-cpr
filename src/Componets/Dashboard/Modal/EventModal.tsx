import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Row, Col, Select, DatePicker } from 'antd'
import type { DatePickerProps } from 'antd'
import { postApi } from '../../../Api/Api'
// import { v4 as uuidv4 } from 'uuid'

import { useAuth } from '../../../Context/authContext'

import dayjs from 'dayjs'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker
const dateFormat = 'MM-DD-YYYY'
interface EventModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  selectedEventdata: any
  setLoading: any
  setIsStateUpdated: any
  isStateUpdated: boolean
  selectedDay: any
}

export default function EventModal({
  isModalOpen,
  handleOk,
  handleCancel,
  selectedEventdata,
  setLoading,
  isStateUpdated,
  selectedDay,
  setIsStateUpdated,
}: EventModalProps) {
  const [form] = Form.useForm()
  const [releaseForm] = Form.useForm()
  const [holidayForm] = Form.useForm()
  const [absenseForm] = Form.useForm()
  const [selectedEvent, setSelectedEvent] = useState<number>(0)
  const [submitType, setSubmitType] = useState<any>('')
  const [typeOfForm, setTypeOfForm] = useState<string>('')

  const { user } = useAuth()
  // const uniqueId = uuidv4()
  useEffect(() => {
    if (selectedEventdata !== null && selectedEventdata) {
      const updatedEvent = { ...selectedEventdata }
      console.log('updated event', updatedEvent)
      const selectedEventType = events.find((event) => event.name === updatedEvent.categories[0])
      console.log('selectedEventType', selectedEventType)
      setFormType(selectedEventType?.id, updatedEvent)
      form.setFieldsValue({ eventType: selectedEventType?.id })
    }
  }, [selectedEventdata])

  const events = [
    { name: 'Release', id: 1 },
    { name: 'Holiday', id: 2 },
    { name: 'Absense', id: 3 },
  ]
  const countries = [
    // { name: 'India', id: 1 },
    { name: 'US', id: 1 },
    // { name: 'UK', id: 3 },
  ]

  const onFinish = (values: any) => {
    console.log('submitted values', values)
  }

  const convertDateFormat = (date) => {
    const dateInstance = dayjs(date.$d)
    const dateWithZeroTime = dateInstance.set('hour', 0).set('minute', 0).set('second', 0)
    const dateFormat = dateWithZeroTime.format('YYYY-MM-DDTHH:mm:ss')
    return dateFormat
  }

  const getEventPayload = (data, startDate, endDate) => {
    const payload: any = {
      customRequest: null,
      events: {
        id: selectedEventdata !== null && selectedEventdata ? selectedEventdata.id : '',
        subject: data.subject,
        start: {
          dateTime: startDate,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endDate,
          timeZone: 'UTC',
        },
        reminderMinutesBeforeStart: 1440,
        categories: data.category,
      },
    }
    // if (data.category[0] === 'Holiday') {
    //   const selectedCountry = countries.find((country) => country.id === Number(data.country))
    //   payload.location = { displayName: selectedCountry?.name }
    // }
    if (data.category[0] === 'Release') {
      payload.customRequest = {
        eventType: 'Release',
        projectName: data.projectName,
        artistName: data.artistName,
      }
      payload.events.body = {
        contentType: 1,
        content: data.content,
      }
    }
    setLoading(true)
    handleOk()
    postApi(payload, '/calendar/AddEvents', '')
      .then((res) => {
        setIsStateUpdated(!isStateUpdated)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(`getting error when adding ${data.category[0]} event`, err)
      })
  }

  const onReleaseFinish = (values: any) => {
    const modifiedRelese = { ...values }
    modifiedRelese.category = ['Release']
    modifiedRelese.subject = `New Release`
    modifiedRelese.content = `${modifiedRelese.artistName} / ${modifiedRelese.projectName}`
    const releaseDate = dayjs(modifiedRelese.releaseDate.$d)
    const dateWithZeroTime = releaseDate.set('hour', 0).set('minute', 0).set('second', 0)
    const releaseDateFormat = dateWithZeroTime.format('YYYY-MM-DDTHH:mm:ss')
    getEventPayload(modifiedRelese, releaseDateFormat, releaseDateFormat)
  }
  const onHolidayFinish = (values: any) => {
    const updatedHolidayObj = { ...values }
    // updatedHolidayObj.content = `Holiday`
    updatedHolidayObj.subject = `Holiday: ${updatedHolidayObj.holidayName}`
    updatedHolidayObj.category = ['Holiday']
    const startDate = convertDateFormat(updatedHolidayObj.startDate)
    const endDate = convertDateFormat(updatedHolidayObj.endDate)
    getEventPayload(updatedHolidayObj, startDate, endDate)
  }
  const onAbsenseFinish = (values: any) => {
    const updatedAbsenseObj = { ...values }
    updatedAbsenseObj.subject = `${user.name} - OOO`
    updatedAbsenseObj.category = ['Absense']
    const startDate = convertDateFormat(updatedAbsenseObj.startDate)
    const endDate = convertDateFormat(updatedAbsenseObj.endDate)
    getEventPayload(updatedAbsenseObj, startDate, endDate)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const setFormType = (value, selectedForm?) => {
    if (value === 1) {
      setTypeOfForm('releaseForm')
      setSubmitType(() => onReleaseFinish)
      if (selectedForm) {
        selectedForm.projectName = selectedForm.eventCustomResponse.projectName
        selectedForm.artistName = selectedForm.eventCustomResponse.artistName
        const formatedDate = dayjs(selectedForm.start.dateTime).format('MM-DD-YYYY')
        selectedForm.releaseDate = dayjs(formatedDate)
        releaseForm.setFieldsValue(selectedForm)
      }
    } else if (value === 2) {
      setTypeOfForm('holidayForm')
      setSubmitType(() => onHolidayFinish)
      if (selectedForm) {
        selectedForm.holidayName = selectedForm.subject.split(':')[1]
        const formatedStartDate = dayjs(selectedForm.start.dateTime).format('MM-DD-YYYY')
        const formatedEndDate = dayjs(selectedForm.end.dateTime).format('MM-DD-YYYY')
        selectedForm.startDate = dayjs(formatedStartDate)
        selectedForm.endDate = dayjs(formatedEndDate)
        // selectedForm.country = 1
        holidayForm.setFieldsValue(selectedForm)
      }
    } else {
      setTypeOfForm('absenseForm')
      setSubmitType(() => onAbsenseFinish)
      if (selectedForm) {
        const formatedStartDate = dayjs(selectedForm.start.dateTime).format('MM-DD-YYYY')
        const formatedEndDate = dayjs(selectedForm.end.dateTime).format('MM-DD-YYYY')
        selectedForm.startDate = dayjs(formatedStartDate)
        selectedForm.endDate = dayjs(formatedEndDate)
        absenseForm.setFieldsValue(selectedForm)
      }
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
        <Button
          form={typeOfForm}
          onClick={submitType}
          disabled={typeOfForm === ''}
          key="submit"
          htmlType="submit"
          type="primary"
        >
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
              rules={[
                {
                  required: true,
                  message: 'Event type is required!',
                },
              ]}
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
          onFinish={onReleaseFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="releaseForm"
          initialValues={{ releaseDate: dayjs(selectedDay) }}
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
          initialValues={{ startDate: dayjs(selectedDay), endDate: dayjs(selectedDay) }}
          onFinish={onHolidayFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="holidayForm"
        >
          <Row>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Holiday Name is required!',
                  },
                ]}
                label="Holiday Name"
                name="holidayName"
              >
                <Input />
              </Form.Item>

              {/* <Form.Item label="Country" name="country">
                <Select placeholder="Select Country" defaultValue={1} showArrow allowClear>
                  {countries.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}
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
          initialValues={{ startDate: dayjs(selectedDay), endDate: dayjs(selectedDay) }}
          onFinish={onAbsenseFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          name="absenseForm"
        >
          <Row>
            <Col span={24}>
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
