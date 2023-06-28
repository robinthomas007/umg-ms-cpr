import React, { useState } from 'react'

import { Modal, Form, Input } from 'antd'

const NotesModal: React.FC = ({}) => {
  return (
    <>
      {/* <Modal title="Notes for t3" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={650}> */}
      <Modal title="Notes for t3" width={650}>
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
