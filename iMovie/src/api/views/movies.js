const axios = require('axios')

// let base = 'http://localhost:2333/api'
let base = '/api'

export function getMovies (po) {
  return axios.get(`${base}/movies`).then(res => { return res.data })
}

export function getMovie (id) {
  return axios.get(`${base}/movies/` + id).then(res => { return res.data })
}
