const router = require('koa-router')()

const movies = require('./views/movies')
const users = require('./views/users')

router.use('/movies', movies.routes(), movies.allowedMethods())
router.use('/users', users.routes(), users.allowedMethods())

module.exports = router
