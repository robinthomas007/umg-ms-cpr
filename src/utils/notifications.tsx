import { message } from 'antd'

export const showSuccessNotification = (description) => {
  message.success(description, 3)
}
export const showErrorNotification = (description) => {
  message.error(description, 3)
}
export const showInfoNotification = (description) => {
  message.info(description, 3)
}
