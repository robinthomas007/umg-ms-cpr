import { Component } from 'react'
import BASE_URL from '../App'

export default class Api extends Component {
  static returnApiUrl(env) {
    if (env === 'test') {
      return 'https://api-qa.umusic.net/guardian'
    }
    return BASE_URL || 'https://api.dev.cpr-portal.umgapps.com/cpr/projects'
  }

  static setAuthorizationToken() {
    let hash = {
      'content-type': 'application/json',
      Authorization: sessionStorage.getItem('accessToken'),
    }
    const header = new Headers(hash)
    return header
  }

  static get(url) {
    return this.apiCall(url, null, 'GET')
  }

  static put(url, params) {
    return this.apiCall(url, params, 'PUT')
  }

  static post(url, params) {
    return this.apiCall(url, params, 'POST')
  }

  static delete(url, params) {
    return this.apiCall(url, params, 'DELETE')
  }

  static apiCall(url, params, method) {
    const host = this.returnApiUrl(process.env.NODE_ENV)
    const fullUrl = `${host}${url}`
    return fetch(fullUrl, {
      method: method,
      headers: this.setAuthorizationToken(),
      body: params ? JSON.stringify(params) : null,
    })
      .then(function (response) {
        if (response.status === 401) {
        }
        return response
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
