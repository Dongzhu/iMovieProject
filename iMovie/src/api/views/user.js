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
