const axios = require('axios')
const base = '/api'
const qs = require('qs')

export function getDocuments (po) {
  let params = {
    keywords: po.keywords,
    page: po.page,
    pageNum: po.pageNum
  }
  return axios.get(`${base}/documents`, { params: params })
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function getDocument (id) {
  return axios.get(`${base}/document/` + id)
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function AddDocument (po) {
  var params = {
    name: po.name,
    url: po.url,
    method: po.method,
    desc: po.desc,
    request: po.request,
    response: po.response
  }
  return axios.post(`${base}/document`, qs.stringify(params)).then(res => { return res.data })
}

export function UpdDocument (po) {
  var params = {
    _id: po.id,
    name: po.name,
    url: po.url,
    method: po.method,
    desc: po.desc,
    request: po.request,
    response: po.response
  }
  return axios.put(`${base}/document`, qs.stringify(params)).then(res => { return res.data })
}

export function DelDocument (po) {
  return axios.delete(`${base}/document`, { params: { _id: po.id } }).then(res => { return res.data })
}
