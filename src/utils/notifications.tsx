import { message } from 'antd'

export const showSuccessNotification = (description) => {
  message.success(description, 3)
}
export const showErrorNotification = (description) => {
  message.open({
    type: 'error',
    content: description,
    className: 'custom-message-top-error',
    duration: 2.5,
  })
}
export const showInfoNotification = (description) => {
  message.info(description, 3)
}
