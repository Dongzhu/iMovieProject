const Router = require('koa-router')
const mongoose = require('mongoose')

// const router = new Router()
const { controller, get, post, put } = require('../lib/decorator')
const { getAllMovies, getMovieDetail, getRelativeMovies } = require('../service/movie')

// 装饰器
@controller('/api/v0/movies')
exports class movieControler {
  @get('/')
  async getMovies (ctx, next) {
    // const Movie = mongoose.model('Movie')
    // const movies = await Movie.find({}).sort({
    //   'meta.createdAt': -1
    // })
    const { type, year } = ctx.query
    const movies = await getAllMovies(type, year)

    ctx.body = { movies }
  }

  @get('/:id')
  async getMovieDetail (ctx, next) {
    // const Movie = mongoose.model('Movie')
    // const id = ctx.params.id
    // const movie = await Movie.find({_id:id}).sort({
    //   'meta.createdAt': -1
    // })
    // ctx.body = { movie }

    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: { movie, relativeMovies },
      success: true
    }
  }
}

// router.get('/movies', async (ctx, next) => {
//   const Movie = mongoose.model('Movie')
//   const movies = await Movie.find({}).sort({
//     'meta.createdAt': -1
//   })
//
//   ctx.body = { movies }
// })
//
// router.get('/movies/:id', async (ctx, next) => {
//   const Movie = mongoose.model('Movie')
//   const id = ctx.params.id
//   const movie = await Movie.find({_id:id}).sort({
//     'meta.createdAt': -1
//   })
//
//   ctx.body = { movie }
// })

module.exports = router
