const koa = require('koa')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('../database/init')

;(async () => {
  initSchemas()
  const Movie = mongoose.model('Movie')
  // const movies = await Movie.find({})
  // console.log(movies)

  // require('../tasks/movie.js')
  require('../tasks/api.js')

  await connect()
})()

const app = new koa()

app.use(async (ctx, next) => {
  ctx.body = 'index'
})

app.listen(2333)
