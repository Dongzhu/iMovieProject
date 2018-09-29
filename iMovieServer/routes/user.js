const Router = require('koa-router')
const mongoose = require('mongoose')

// const router = new Router()
const { controller, get, post, put } = require('../lib/decorator')
const { checkPassword } = require('../service/user')

// 装饰器
@controller('/api/v0/user')
exports class userControler {
  @post('/')
  async login (ctx, next) {
    const { email, password } = ctx.query
    const matchData = await checkPassword(email, password)

    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }

    if (matchData.match) {
      return (ctx.body = {
        success: true
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码不正确'
    })
  }

module.exports = router
