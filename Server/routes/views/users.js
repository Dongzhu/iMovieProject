const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()

import { checkPassword } from '../../service/login'

router.get('/user/login', async (ctx, next) => {
  ctx.body = { msg: 'hello' }
})

router.post('/user/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const data = await checkPassword(username, password)
  const { user, match } = data
  console.log('data', JSON.stringify(data))

  if (match) {
    ctx.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email
    }
    console.log('ctx.session ', JSON.stringify(ctx.session))

    return (ctx.body = {
      success: true,
      data: {
        username: user.username,
        email: user.email
      }
    })
  }

  return (ctx.body = { success: false, err: '密码错误' })
})

module.exports = router
