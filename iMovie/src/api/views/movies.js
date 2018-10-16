const axios = require('axios')
const base = '/api'

export function getMovies (po) {
  let params = {
    cate: po.cate,
    country: po.country,
    year: po.year,
    rate: po.rate,
    page: po.page,
    pageNum: po.pageNum
  }
  console.log('params', JSON.stringify(params))
  return axios.get(`${base}/movies`, { params: params })
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function getMovie (id) {
  return axios.get(`${base}/movies/` + id)
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function getCategories (po) {
  return axios.get(`${base}/categories`)
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function getCategory (id) {
  return axios.get(`${base}/category/` + id)
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}
