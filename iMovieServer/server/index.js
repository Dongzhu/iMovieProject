const koa = require('koa')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('../database/init')
// const router = require('../routes')
const R  = require('ramda')
const MIDDLEWWARES = ['router']

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `../middlewares/${name}`)
    )
  )(MIDDLEWWARES)
}

;(async () => {
  console.log(1111)
  initSchemas()
  const Movie = mongoose.model('Movie')
  // const movies = await Movie.find({})
  // console.log(movies)

  // require('../tasks/movie.js')
  // require('../tasks/api.js')

  await connect()

  const app = new koa()
  await useMiddlewares(app)
  app.listen(2333)
})()


// app
//   .use(router.routes())
//   .use(router.allowedMethods())

// app.use(async (ctx, next) => {
//   ctx.body = 'Hello Koa!'
// })
