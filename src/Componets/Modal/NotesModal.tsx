import React, { useCallback, useEffect, useState } from 'react'

import { Modal, Form, Input, Row, Col, Button, Space, Mentions, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getApi, postApi } from '../../Api/Api'
import moment from 'moment'
import './notesModal.css'

interface NotesModalProps {
  open: boolean
  handleClose: () => void
  soure: string
  soureName: string
  sourceId: string | number
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const { getMentions } = Mentions
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const NotesModal: React.FC<NotesModalProps> = (props) => {
  const [notes, setNotes] = useState<any>([])
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [mentions, setMentions] = useState<any>([])

  const invokeGetNotesApi = React.useCallback(() => {
    setLoading(true)
    getApi({ sourceId: props.sourceId, source: props.soure }, '/notes/getnotes')
      .then((res) => {
        setNotes(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.sourceId, props.soure])
  useEffect(() => {
    invokeGetNotesApi()
    getApi({ SearchTerm: null }, '/usersearch')
      .then((res) => {
        const newOptions: any = []
        const userList = res.userList.users
        const teamList = res.userList.teams
        for (let i = 0; i < userList.length; i++) {
          newOptions.push(userList[i].userName.replace(' ', ''))
        }
        for (let i = 0; i < teamList.length; i++) {
          newOptions.push(teamList[i].teamName)
        }

        const transformedMentionsList = newOptions.map((label, index) => ({
          value: `${label}`,
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
        sourceId: props.sourceId,
        comments: values.notes,
        source: props.soure,
        sourceName: props.soureName,
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
          {/* <Form.Item name="notes" rules={[{ required: true }]} wrapperCol={{ span: 24 }}>
            <Input.TextArea
              className="notes"
              allowClear
              onChange={onChange}
              placeholder="Create A New Note"
              style={{ marginTop: '150px', height: '100px' }}
            />
          </Form.Item> */}
          <Form.Item name="notes" labelCol={{ span: 6 }} wrapperCol={{ span: 32 }} rules={[{ required: true }]}>
            <Mentions rows={4} placeholder="Create A New Note" options={mentions} />
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
