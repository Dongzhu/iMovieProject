const axios = require('axios')
const base = '/api'

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
