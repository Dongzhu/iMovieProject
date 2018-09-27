const koa = require('koa')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('../database/init')
const router = require('../routes')

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

app
  .use(router.routes())
  .use(router.allowedMethods())

app.use(async (ctx, next) => {
  ctx.body = 'Hello Koa!'
})

app.listen(2333)
