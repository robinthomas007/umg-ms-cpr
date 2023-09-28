import React, { useCallback, useEffect, useState } from 'react'

import { Modal, Form, Input, Row, Col, Button, Space, Mentions, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getApi, postApi } from '../../Api/Api'
import moment from 'moment'
import './notesModal.css'
import { hexArray } from './../Common/StaticDatas'

interface NotesModalProps {
  open: boolean
  handleClose: () => void
  source: string
  sourceName: string
  sourceId: string | number
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const { Option } = Mentions

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const NotesModal: React.FC<NotesModalProps> = (props) => {
  const [notes, setNotes] = useState<any>([])
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [mentions, setMentions] = useState<any>([])

  const invokeGetNotesApi = React.useCallback(() => {
    setLoading(true)
    getApi({ sourceId: props.sourceId, source: props.source }, '/notes/getnotes')
      .then((res) => {
        setNotes(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.sourceId, props.source])
  useEffect(() => {
    invokeGetNotesApi()
    getApi({ SearchTerm: null }, '/usersearch')
      .then((res) => {
        const newOptions: any = []
        const userList = res.userList.users
        const teamList = res.userList.teams

        for (let i = 0; i < userList.length; i++) {
          newOptions.push(userList[i].userName)
        }
        for (let i = 0; i < teamList.length; i++) {
          newOptions.push(teamList[i].teamName)
        }

        const transformedMentionsList = newOptions.map((label, index) => ({
          value: `${label.replace(' ', '')}`,
          label: label.toLowerCase(),
        }))
        setMentions(transformedMentionsList)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
  }, [])
  useEffect(() => {
    invokeGetNotesApi()
  }, [invokeGetNotesApi, props.sourceId])

  const handleSubmit = (values) => {
    postApi(
      {
        source: props.source,
        sourceId: props.sourceId,
        comments: values.notes,

        sourceName: props.sourceName,
      },
      '/notes/updatenotes',
      'successfully added the notes'
    ).then((res) => {
      invokeGetNotesApi()
      setComments('')
      form.resetFields()
    })
  }
  const validateMessages = {
    required: 'comments is required!',
  }

  const getUserAliance = (name) => {
    let fName = name.split(' ')[0].charAt(0)
    let lName = name.split(' ')[1] ? name.split(' ')[1].charAt(0) : null
    if (!lName) {
      lName = name.charAt(1)
    }
    return fName.toUpperCase() + lName.toUpperCase()
  }

  return (
    <>
      <Modal title={`Notes`} open={props.open} footer={null} onCancel={props.handleClose} width={700}>
        <br />
        <br />
        <div className="notesContents">
          {loading && <Spin indicator={antIcon} style={{ display: 'block' }} />}
          {notes.map((note, index) => {
            return (
              <p key={index} style={{ background: '#000', borderRadius: '43px', padding: '16px' }}>
                <span style={{ paddingLeft: '12px' }}>
                  {note.userName} - {note.createdOn}
                </span>{' '}
                <span style={{ display: '-webkit-inline-box', width: '350px', marginLeft: '10px' }}>
                  {note.comments}
                </span>
              </p>
            )
          })}
        </div>
        <Form {...layout} name="nest-messages" onFinish={handleSubmit} validateMessages={validateMessages} form={form}>
          <Form.Item name="notes" labelCol={{ span: 6 }} wrapperCol={{ span: 32 }} rules={[{ required: true }]}>
            <Mentions
              rows={4}
              placeholder="Create A New Note"
              options={mentions.map(({ value, label }) => ({
                key: value,
                value: value,
                className: 'antd-demo-dynamic-option',
                label: (
                  <div style={{ width: 250, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <span
                      style={{
                        background: hexArray[Math.floor(Math.random() * hexArray.length)],
                        borderRadius: '50%',
                        padding: '5px 7px',
                        marginRight: 10,
                      }}
                    >
                      {getUserAliance(value)}
                    </span>
                    <span>{label}</span>
                  </div>
                ),
              }))}
            />
          </Form.Item>
          <Row justify="end">
            <Space>
              <Col>
                <Form.Item>
                  <Button style={{ background: '#F5F5F5', color: '#000' }} onClick={() => props.handleClose()}>
                    Close
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Space>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default NotesModal
