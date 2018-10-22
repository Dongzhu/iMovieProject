const axios = require('axios')
const base = '/api'

export function getDocuments (po) {
  return axios.get(`${base}/documents`)
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function getDocument (id) {
  return axios.get(`${base}/document/` + id)
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}
