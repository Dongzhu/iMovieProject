const Router = require('koa-router')
const koaBody = require('koa-body')

const movies = require('./views/movies')
const users = require('./views/users')
const documents = require('./views/documents')

const router = new Router({prefix: '/api'})

router.use(movies.routes(), koaBody(), movies.allowedMethods())
router.use(users.routes(), koaBody(), users.allowedMethods())
router.use(documents.routes(), koaBody(), documents.allowedMethods())

module.exports = router
