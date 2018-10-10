const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()

/* setup.js: solve the problem "ReferenceError: navigator is not defined" */
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.window = window;
global.document = window.document;
global.navigator = { userAgent: 'node.js' };

const { JSEncrypt } = require('jsencrypt')

import { checkPassword } from '../../service/login'

router.get('/user/login', async (ctx, next) => {
  ctx.body = { msg: 'hello' }
})

router.post('/user/login', async (ctx, next) => {
  const { username, password } = ctx.request.body

  // 实例化一个JSEncrypt对象
  let jse = new JSEncrypt()
  // 设置密钥
  jse.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
  MIICXgIBAAKBgQC8ygMKjJLSUpnfXqt8lRSAdDxAHWKi9GbTFkCbAjkRCR6VUakx
  xXLXHQUtPCizKcvNpuYqZ5bO8LEgpY7SL3JEdEI9OuMnZ6ToeHPfcHeS+EgN0oYm
  dQ49RB5wZkcBEFk80OBEAM6VhnE0IuHGkU5ko9oPHq3boEQ3Ej6r3T+UhQIDAQAB
  AoGBAIO8JwEedHlE4FBovBsT4Bl+gmhu2NxC1NlpBq3jkDSd+3RQZlLvp6IJgwo8
  l13lxWv8kVF3tVkzxTW1sQJjz0RYShH8vXLl94gf6mFkJbeOPP6uA0mGDG81yINw
  KUpE0RM6ZM9yKEeVdK3u67TkEBcC6Td5KBl8Yof3q7qxiOWhAkEA4BXEtpnfhgm3
  7s1VjDxdIHTtWL1PihMT+SCOqp+Vv27ABVrxtDW/w2R3ZzR5ezROI2v1DVhj5wvs
  xPGXx6OpSQJBANetVvazS/5SQNvb+Cmjw9Rt5NilyxfX5IsSswaIojbwhZY2FVZy
  AlFH9K/YS2FYFyU7iIqN6IIkOxXpOcj/bV0CQQCRYM4MgWuotClmfkSgBJGOew14
  4uj1dUch+2NTgtFOLvXZA5WICs7sXwOwKzUdH2QKSwHitJOr0+q6ItsLpDwxAkBX
  zvDK+/CCmIZjfMkqWsxN3nf/ZHCtQm5/2Jsem94/M+mPYHGLgltDMGKEfTEjbrPt
  qrFKh8ATzCBqKUwncybZAkEAmVNW1dftWWoriZZXXMvfFkTDgYvRmytoVEThhnd0
  J/AOhZiUAs9+kHfGKivlTE209AY6Bw8aRzuTCziSwQhhBQ==
  -----END RSA PRIVATE KEY-----`)
  // 解密加密过的字符串
  let password2 = jse.decrypt(password)
  // console.log(password2) // 打印结果

  const data = await checkPassword(username, password2)
  const { user, match } = data
  console.log('data', JSON.stringify(data))

  if (match) {
    ctx.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
    console.log('ctx.session ', JSON.stringify(ctx.session))

    ctx.cookies.set('username', user.username, { httpOnly:false, maxAge: 86400000 })

    return (ctx.body = {
      success: true,
      data: {
        username: user.username,
        // email: user.email,
        superrole: user.role === 'admin' ? true : false
      }
    })
  }

  return (ctx.body = { success: false, err: '密码错误' })
})

module.exports = router
