import React, { useState } from 'react'

import { Modal, Form, Input } from 'antd'
interface ModalProps {
  open: boolean
  handleClose: () => void
  projectData: any
}

const NotesModal: React.FC<ModalProps> = (props) => {
  return (
    <>
      <Modal
        title={`Notes for ${props.projectData.title} Project`}
        open={props.open}
        onCancel={props.handleClose}
        width={650}
      >
        <Form.Item name="notes" wrapperCol={{ span: 24 }}>
          <Input.TextArea
            className="notes"
            placeholder="Create A New Note"
            style={{ marginTop: '150px', height: '100px' }}
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default NotesModal
