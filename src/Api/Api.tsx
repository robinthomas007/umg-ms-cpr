import axios from 'axios'
import getCookie from '../Componets/Common/cookie'
import { message } from 'antd'
import { showSuccessNotification } from '../utils/notifications'

export const cprUrls = (env) => {
  switch (env) {
    case 'dev':
      return 'https://api.dev.cpr-portal.umgapps.com/gateway/cpr'

    case 'qa':
      return 'https://api.qa.cpr-portal.umgapps.com/gateway/cpr'

    case 'uat':
      return 'https://api.uat.cpr-portal.umgapps.com/gateway/cpr'

    case 'prod':
      return 'https://api.cpr-portal.umgapps.com/gateway/cpr'

    default:
      return 'https://api.dev.cpr-portal.umgapps.com/gateway/cpr'
  }
}

const BASE_URL = cprUrls(process.env.REACT_APP_ENV || 'dev')

export const config = {
  headers: {
    cpr_portal: getCookie('cpr_portal'),
  },
}

export const getApi = async (params, url) => {
  const res = await axios.get(BASE_URL + url, {
    params: params,
    headers: {
      cpr_portal: getCookie('cpr_portal'),
    },
  })
  return res.data
}

export const deleteApi = async (id, url, customMessage?) => {
  const res = await axios.delete(BASE_URL + url + `/${id}`, {
    headers: {
      cpr_portal: getCookie('cpr_portal'),
    },
  })
  showNotification(res.status, customMessage)
  return res.data
}

export const deleteApiWithReqBody = async (payload, url, customMessage?) => {
  const res = await axios.delete(BASE_URL + url, {
    headers: {
      cpr_portal: getCookie('cpr_portal'),
    },
    data: payload,
  })
  showNotification(res.status, customMessage)
  return res.data
}

export const postApi = async (data, url, customMessage) => {
  const res = await axios.post(BASE_URL + url, data, config)
  showNotification(res.status, customMessage)
  return res.data
}

const showNotification = (status, customMessage) => {
  message.config({
    top: 0,
    maxCount: 1,
  })
  if (status === 200) {
    showSuccessNotification(customMessage || 'Successfully Saved')
    message.open({
      type: 'success',
      content: customMessage || 'Successfully Saved',
      className: 'custom-message-top',
      duration: 2.5,
    })
  }

  if (status !== 200) {
    message.open({
      type: 'error',
      content: customMessage || 'Error Saving Data',
      duration: 0,
    })
  }
}
