const Router = require('koa-router')
const mongoose = require('mongoose')

const router = new Router()

router.get('/login', async (ctx, next) => {
  ctx.body = { success: true, params: ctx.query }
})

module.exports = router
