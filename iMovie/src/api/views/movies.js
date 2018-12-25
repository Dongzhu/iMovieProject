const axios = require('axios')
const qs = require('qs')

const base = '/api'

export function getMovies (po) {
  let params = {
    cate: po.cate,
    country: po.country,
    year: po.year,
    rate: po.rate,
    page: po.page,
    pageNum: po.pageNum,
    keywords: po.keywords
  }
  return axios.get(`${base}/movies`, { params: params })
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function getRecommend (po) {
  let params = {
    page: po.page,
    pageNum: po.pageNum
  }
  return axios.get(`${base}/movies/recommend`, { params: params })
    .then(res => { return res.data })
    .catch(error => { console.log(error) })
}

export function getMovie (id) {
  return axios.get(`${base}/movie/` + id)
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

export function AddMovie (po) {
  var params = {
    author: po.author,
    title: po.title,
    alt_title: po.alt_title,
    image: po.image,
    summary: po.summary,
    language: po.language,
    pubdate: po.pubdate,
    country: po.country,
    writer: po.writer,
    director: po.director,
    cast: po.cast,
    movie_duration: po.movie_duration,
    year: po.year,
    movie_type: po.movie_type,
    rate: po.rate,
    recommend: po.recommend
  }
  return axios.post(`${base}/movie`, qs.stringify(params)).then(res => { return res.data })
}

export function UpdMovie (po) {
  var params = {
    id: po.id,
    author: po.author,
    title: po.title,
    alt_title: po.alt_title,
    image: po.image,
    summary: po.summary,
    language: po.language,
    pubdate: po.pubdate,
    country: po.country,
    writer: po.writer,
    director: po.director,
    cast: po.cast,
    movie_duration: po.movie_duration,
    year: po.year,
    movie_type: po.movie_type,
    rate: po.rate,
    recommend: po.recommend
  }
  return axios.put(`${base}/movie`, qs.stringify(params)).then(res => { return res.data })
}

export function RecommendMovie (po) {
  var params = {
    id: po.id,
    recommend: po.recommend
  }
  return axios.put(`${base}/movie`, qs.stringify(params)).then(res => { return res.data })
}

export function DelMovie (po) {
  return axios.delete(`${base}/movie`, { params: { _id: po.id } }).then(res => { return res.data })
}
