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
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`

import { checkPassword, checkRegister } from '../../service/login'

router.get('/user/login', async (ctx, next) => {
  ctx.body = { message: 'hello' }
})

router.post('/user/register', async (ctx, next) => {
  const { username, password, password2 } = ctx.request.body

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
  let decrypted = jse.decrypt(password)
  let decrypted2 = jse.decrypt(password2)

  if (decrypted === decrypted2) {
    let register = await checkRegister(username)

    if (!register) {
      // create a user a new user
      const User = mongoose.model('User')
      const user = new User({
        username: username,
        password: decrypted,
        // email: '123456@gmail.com',
        role: 'normal'
      })
      user.save()

      return (ctx.body = {
        success: true,
        message: '注册成功',
        rescode: 10010,
        data: { username: user.username }
      })
    } else {
      return ctx.body = { success: false, message: '当前用户已存在', rescode: 10012, data: {} }
    }
    return ctx.body = { success: false, message: '哦噢，出了点小问题，请联系管理员！', rescode: 10011, data: {} }
  }
})

router.post('/user/login', async (ctx, next) => {
  const { username, password } = ctx.request.body

  // 实例化一个JSEncrypt对象
  let jse = new JSEncrypt()
  // 设置密钥
  jse.setPrivateKey(privateKey)
  // 解密加密过的字符串
  let decrypted = jse.decrypt(password)
  // console.log(decrypted) // 打印结果

  const data = await checkPassword(username, decrypted)
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
      message: '登录成功',
      rescode: 10020,
      data: {
        username: user.username,
        // email: user.email,
        superrole: user.role === 'admin' ? true : false
      }
      // { "success": true, "message": "登录成功", "rescode": 10020, "data": { "username": user.username, "superrole": false }
    })
  } else {
    return (ctx.body = { success: false, message: '密码错误', rescode: 10022, data: {} })
  }

  return ctx.body = { success: false, message: '哦噢，出了点小问题，请联系管理员！', rescode: 10021, data: {} }
})

async function getDocumentId(){
  const Document = mongoose.model('Document')
  let documents = await Document.find({})
  if (documents) {
    return documents[documents.length - 1].id + 1
  }
  return 1001
}

// router.post('/document', async (ctx, next) => {
//   console.log(ctx.request.body)
//   return
//   const { name, url, method, desc, request, response } = ctx.request.body
//   let requestJSON = {}
//   let responseJSON = {}
//
//   // console.log(getDocumentId(), typeof getDocumentId())
//   try {
//     requestJSON = JSON.parse(request)
//     try {
//       responseJSON = JSON.parse(response)
//     } catch (e1) {
//       return ctx.body = { success: true, message: '添加失败', rescode: 30032, data: { e1 } }
//     }
//   } catch (e2) {
//     return ctx.body = { success: true, message: '添加失败', rescode: 30031, data: { e2 } }
//   }
//
//   const Document = mongoose.model('Document')
//   const id = await getDocumentId()
//   const document = new Document({
//     id: id,
//     name: name,
//     url: url,
//     method: method,
//     desc: desc,
//     request: requestJSON,
//     response: responseJSON
//   })
//
//   try {
//     document.save()
//   } catch (e) {
//     console.log(2333, e);
//     // return ctx.body = { success: false, message: '添加失败', rescode: 30023, data: {} }
//   }
//   // return ctx.body = { success: true, message: '添加成功', rescode: 30020, data: { document } }
// })

router.get('/users', async(ctx, next) => {
  const User = mongoose.model('User')
  const users = await User.find({}).sort({ 'meta.createdAt': -1 })

  if (users) {
    return (ctx.body = { success: true, message: '查找成功', rescode: 10030, data: { users } })
  } else {
    return (ctx.body = { success: false, message: '查找用户信息失败', rescode: 10031, data: {} })
  }
})

router.get('/user/:username', async(ctx, next) => {
  const username = ctx.params.username
  let params = {}
  if (username) params.username = username

  const User = mongoose.model('User')
  const users = await User.findOne(params).sort({ 'meta.createdAt': -1 })

  if (users) {
    return (ctx.body = { success: true, message: '查找成功', rescode: 10040, data: { users } })
  } else {
    return (ctx.body = { success: false, message: '查找用户信息失败', rescode: 10041, data: {} })
  }
})

module.exports = router
