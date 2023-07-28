import axios from 'axios'
import { Component } from 'react'
import { BASE_URL } from '../App'
import getCookie from '../Componets/Common/cookie'
export default class Api extends Component {
  static setAuthorizationToken() {
    const header = new Headers({ cpr_portal: localStorage.getItem('cpr_portal') })
    return header
  }

  static get(url, params) {
    return this.apiCall(url, params, 'GET')
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
    return axios({
      url: BASE_URL + url,
      method: method,
      headers: {
        cpr_portal: getCookie('cpr_portal'),
      },
      params: params && method === 'GET' ? params : null,
      data: params && method === 'POST' ? params : null,
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
