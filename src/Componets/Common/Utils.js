import getCookie from './cookie'
import jwt_decode from 'jwt-decode'
import { BASE_URL, PARTY_API_URL, WIDGET_URL } from './../../App'
import axios from 'axios'

export const getUsername = () => {
  try {
    const token = getCookie('cp3_auth')
    let user = jwt_decode(token)
    return user.name
  } catch (err) {
    console.log('Error getting Token', err)
  }
}

export const callPartyService = (track, index, handleOnchange, isSingle) => {
  const splitArtist = track.artist.split(',').pop()
  window.launchWidget({
    width: '80%',
    height: '80%',
    widgetUrl: WIDGET_URL,
    auth: 'oidc',
    apiUrl: PARTY_API_URL,
    tokenUrl: '',
    r2Auth: '',
    searchTerm: splitArtist,
    mode: 'widgetSearchSelect',
    sourceSystem: 'R2Party-Widget',
    toggles: '',
    userName: '',
    callback: function (parties) {
      let artistList = track.artist.split(',')
      artistList[artistList.length - 1] = parties ? parties[0].name : ''
      if (isSingle) {
        handleOnchange({ ...track, artist: artistList.toLocaleString() })
      } else {
        handleOnchange({ ...track, artist: artistList.toLocaleString() }, index)
      }
    },
  })
}

export const config = {
  headers: {
    cp3_auth: getCookie('cp3_auth'),
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

export const ADMIN = '4d460fe7-b447-454c-bb0d-7f60797a74a0'
export const USER = '7ac0853c-8182-42cc-b034-9e4804144f75'

export const getApi = (params, url) => {
  return axios
    .get(BASE_URL + url, {
      params: params,
      headers: {
        cp3_auth: getCookie('cp3_auth'),
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
