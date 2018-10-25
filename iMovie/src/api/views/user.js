const axios = require('axios')
const qs = require('qs')

let base = '/api'

export function login (po) {
  var params = {
    'username': po.user,
    'password': po.password
  }
  return axios.post(`${base}/user/login`, qs.stringify(params)).then(res => { return res.data })
}

export function register (po) {
  var params = {
    'username': po.user,
    'password': po.password,
    'password2': po.password2,
    'email': po.email
  }
  return axios.post(`${base}/user/register`, qs.stringify(params)).then(res => { return res.data })
}

export function getUsers (po) {
  return axios.get(`${base}/users`).then(res => { return res.data })
}

export function getUser (username) {
  return axios.get(`${base}/user/` + username).then(res => { return res.data })
}

export function updUser (po) {
  var params = {
    'username': po.user,
    'email': po.email
  }
  return axios.put(`${base}/user`, qs.stringify(params)).then(res => { return res.data })
}
