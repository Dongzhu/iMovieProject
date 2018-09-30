const Router = require('koa-router')
const koaBody = require('koa-body')

const movies = require('./views/movies')
const users = require('./views/users')

const router = new Router({prefix: '/api'})

router.use(movies.routes(), koaBody(), movies.allowedMethods())
router.use(users.routes(), koaBody(), users.allowedMethods())

module.exports = router
