const router = require('koa-router')()
const mongoose = require('mongoose')

router.get('/movies', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({}).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, movies }
})

router.get('/movies/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id
  const movie = await Movie.find({id:id}).sort({
    'meta.createdAt': -1
  })
  console.log(movie)

  ctx.body = { success: true, movie }
})

module.exports = router
