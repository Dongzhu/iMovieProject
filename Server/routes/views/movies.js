const router = require('koa-router')()
const mongoose = require('mongoose')
const ObjectID = require('mongodb').ObjectID
// const Schema = mongoose.Schema
// const { ObjectId } = Schema.Types
// const CircularJSON = require('circular-json')

// router.get('/movies', async (ctx, next) => {
//   const Movie = mongoose.model('Movie')
//   const movies = await Movie.find({}).sort({
//     'meta.createdAt': -1
//   })
//
//   ctx.body = { success: true, message: '查询成功', movies }
// })

router.get('/movies', async (ctx, next) => {
  let cate = ctx.request.query.cate
  let country = ctx.request.query.country
  let year = ctx.request.query.year
  let rate = ctx.request.query.rate
  let page = parseInt(ctx.request.query.page)
  let pageNum = parseInt(ctx.request.query.pageNum)
  console.log('ctx.request.query: ', ctx.request.query)

  if (!page) { page = 1, pageNum = 9999 }
  if (page && !pageNum) { page = 1, pageNum = 10 }

  let params = {}
  if (country && country.indexOf('all') < 0) {
    params.country = new RegExp(`^.*`+country+`.*$`)
  }
  if (year.indexOf('all') < 0) {
    if (year.indexOf('年代') > -1) {
      let gte = parseInt(year.split('年代')[0]), lte = gte + 9
      params.year = { $gte:gte, $lte: lte}
    } else {
      params.year = new RegExp(`^.*`+year+`.*$`)
    }
  }
  if (rate) {
    let gte = rate.split(',')[0], lte = rate.split(',')[1]
    params.rate = { $gte:gte, $lte: lte}
  }
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find(params).limit(pageNum).skip((page-1) * pageNum).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, length: movies.length, message: '查询成功', movies }
})

router.get('/movies/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id
  const movie = await Movie.find({id:id}).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, message: '查询成功', movie }
})

router.get('/categories', async (ctx, next) => {
  const Category = mongoose.model('Category')
  const categories = await Category.find({}).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, message: '查询成功', categories }
})

router.get('/category/:id', async (ctx, next) => {
  const Category = mongoose.model('Category')
  const id = ctx.params.id
  const category = await Category.findOne({_id:id})

  let movies = [], moviesid = category.movies
  const Movie = mongoose.model('Movie')
  for (let i=0; i<moviesid.length; i++) {
    let item = moviesid[i]
    let movie = await Movie.findOne({_id:mongoose.Types.ObjectId(item)})
    movies.push(movie)
  }
  if (movies !== '') {
    ctx.body = { success: true, message: '查询成功', movies }
  } else {
    ctx.body = { success: false, message: '查询失败', movies }
  }
})

module.exports = router
