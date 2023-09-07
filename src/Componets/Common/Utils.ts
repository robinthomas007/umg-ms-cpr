import getCookie from './cookie'
import jwt_decode from 'jwt-decode'
import { BASE_URL } from './../../App'
import axios from 'axios'
import { ADMIN, TEAM_ADMIN, TEAM_MEMBER } from './StaticDatas'

export const getUsername = () => {
  try {
    const token = getCookie('cpr_portal')
    let user: { name: string } = jwt_decode(token)
    return user.name
  } catch (err) {
    console.log('Error getting Token', err)
  }
}
export const countValues = [
  {
    value: '10',
    label: '10',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '100',
    label: '100',
  },
]
export const config = {
  headers: {
    cpr_portal: getCookie('cpr_portal'),
  },
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function FormatPlatforms(string) {
  let strArr = string.split(',')
  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i] === 'youtube') {
      strArr[i] = 'YouTube'
    } else {
      strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1)
    }
  }
  return strArr ? strArr.join(', ') : ''
}

// export const ADMIN = '4d460fe7-b447-454c-bb0d-7f60797a74a0'
export const USER = '7ac0853c-8182-42cc-b034-9e4804144f75'

export const getApi = (params, url) => {
  return axios
    .get(BASE_URL + url, {
      params: params,
      headers: {
        cpr_portal: getCookie('cpr_portal'),
      },
    })
    .then((res) => {
      return res.data
    })
}

export const isSessionExpired = (err) => {
  try {
    const ErrStatus = JSON.parse(JSON.stringify(err))
    if (ErrStatus.status === 403 || ErrStatus.status === 401) {
      alert('Session Expired..!')
      window.location.reload()
    }
  } catch {
    console.log('Error in isSessionExpired method')
  }
}
export function deepClone(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let clonedObj: any = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }

  return clonedObj
}

export function removeEmptyAttributes(obj) {
  const newObj = {}

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      newObj[key] = obj[key]
    }
  }

  return newObj
}

export const restrictUser = (role) => {
  return role === ADMIN || role === TEAM_ADMIN || role === TEAM_MEMBER ? false : true
}
