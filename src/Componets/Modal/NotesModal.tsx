import React, { useCallback, useEffect, useState } from 'react'

import { Modal, Form, Input, Row, Col, Button, Space, Mentions } from 'antd'
import { getApi, postApi } from '../../Api/Api'
import moment from 'moment'
import './notesModal.css'
interface ModalProps {
  open: boolean
  handleClose: () => void
  projectData: any
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const { getMentions } = Mentions

const NotesModal: React.FC<ModalProps> = (props) => {
  const [notes, setNotes] = useState<any>([])
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  const invokeGetNotesApi = React.useCallback(() => {
    setLoading(true)
    getApi({ sourceId: props.projectData.projectId, source: 'Projects' }, '/notes/getnotes')
      .then((res) => {
        setNotes(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.projectData])
  useEffect(() => {
    invokeGetNotesApi()
  }, [])
  useEffect(() => {
    invokeGetNotesApi()
  }, [invokeGetNotesApi, props.projectData])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
  }
  const handleSubmit = () => {
    postApi(
      {
        sourceId: props.projectData.projectId,
        comments: comments,
        source: 'Projects',
        sourceName: props.projectData.title,
      },
      '/notes/updatenotes',
      'successfully added the notes'
    ).then((res) => {
      console.log('response of the added notes ', res)
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
          {loading && <p>...loading</p>}
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
          <Form.Item name="notes" rules={[{ required: true }]} wrapperCol={{ span: 24 }}>
            <Input.TextArea
              className="notes"
              allowClear
              onChange={onChange}
              placeholder="Create A New Note"
              style={{ marginTop: '150px', height: '100px' }}
            />
          </Form.Item>
          <Form.Item name="bio" labelCol={{ span: 6 }} wrapperCol={{ span: 32 }} rules={[{ required: true }]}>
            <Mentions
              rows={4}
              placeholder="Create A New Note"
              options={[
                {
                  value: 'afc163',
                  label: 'afc163',
                },
                {
                  value: 'zombieJ',
                  label: 'zombieJ',
                },
                {
                  value: 'yesmeck',
                  label: 'yesmeck',
                },
              ]}
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
