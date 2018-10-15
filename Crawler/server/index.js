const koa = require('koa')
const mongoose = require('mongoose')
const { connect, initSchemas } = require('../database/init')

const app = new koa()

;(async () => {
  initSchemas()
  // const Movie = mongoose.model('Movie')
  // const movies = await Movie.find({})
  // console.log(movies)

  // require('../tasks/movie.js')
  require('../tasks/api.js')

  await connect()

})()

app.use(async (ctx, next) => {
  ctx.body = 'Hello Koa!'
})

app.listen(2334)
