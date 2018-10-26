// const router = require('koa-router')({prefix: '/api'})
const Router = require('koa-router')
const router = new Router({prefix: '/api'})
const koaBody = require('koa-body')
router.use(koaBody())
const mongoose = require('mongoose')
const ObjectID = require('mongodb').ObjectID

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

import { checkPassword, checkRegister } from '../service/login'

// user
router.post('/user/register', async (ctx, next) => {
  if (!ctx.request.body) return ctx.body = { success: false, message: '注册失败，缺少参数', rescode: 10011, data: {} }
  const { username, password, password2, email } = ctx.request.body
  // 实例化一个JSEncrypt对象
  let jse = new JSEncrypt()
  // 设置密钥
  jse.setPrivateKey(privateKey)
  // 解密加密过的字符串
  let decrypted = jse.decrypt(password)
  let decrypted2 = jse.decrypt(password2)
  if (decrypted !== decrypted2) return ctx.body = { success: false, message: '注册失败，两次密码不一致', rescode: 10012, data: {} }

  if (decrypted === decrypted2) {
    let register = await checkRegister(username)

    if (!register) {
      // create a user a new user
      const User = mongoose.model('User')
      const user = new User({
        username: username,
        password: decrypted,
        email: email,
        role: 'normal'
      })

      try {
        const save = await user.save()

        return (ctx.body = {
          success: true,
          message: '注册成功',
          rescode: 10010,
          data: {
            save: {
              _id: save._id, username: save.username, email: save.email, role: save.role, meta: save.meta
            }
          }
        })
      } catch (error) {
        return ctx.body = { success: false, message: '注册失败', rescode: 10015, data: { err } }
      }
    } else {
      return ctx.body = { success: false, message: '当前用户已存在', rescode: 10014, data: {} }
    }
    return ctx.body = { success: false, message: '哦噢，出了点小问题，请联系管理员！', rescode: 10013, data: {} }
  }
})

router.post('/user/login', async (ctx, next) => {
  if (!ctx.request.body) return ctx.body = { success: false, message: '登录失败，缺少参数', rescode: 10021, data: {} }
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
  // console.log('data', JSON.stringify(data))

  if (match) {
    ctx.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
    // console.log('ctx.session ', JSON.stringify(ctx.session))

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
    return (ctx.body = { success: false, message: '密码错误', rescode: 10023, data: {} })
  }

  return ctx.body = { success: false, message: '哦噢，出了点小问题，请联系管理员！', rescode: 10022, data: {} }
})

router.put('/user', async (ctx, next) => {
  if (!ctx.request.body) return ctx.body = { success: false, message: '请求参数错误', rescode: 10031, data: {} }

  const { _id, username, password, email, role } = ctx.request.body
  if (!_id) return ctx.body = { success: false, message: '请求参数错误', rescode: 10032, data: {} }
  if (!(role !== 'admin' || role !== 'normal')) {
    return ctx.body = { success: false, message: '请求参数错误', rescode: 10033, data: {} }
  }

  if (password) {
    // 实例化一个JSEncrypt对象
    let jse = new JSEncrypt()
    // 设置密钥
    jse.setPrivateKey(privateKey)
    // 解密加密过的字符串
    let decrypted = jse.decrypt(password)
  }

  const User = mongoose.model('User')
  const user = await User.findOne({_id: ObjectID(_id)})

  // console.log(user)
  if (user) {
    if (role && user.username === 'admin') {
      return ctx.body = { success: false, message: '请求参数错误', rescode: 10034, data: {} }
    }

    if (username) user.username = username
    if (password) user.password = decrypted
    if (email) user.email = email
    if (role) user.role = role

    try {
      const save = await user.save()  // save() 异步操作
      return ctx.body = {
        success: true, message: '更改成功', rescode: 10030, data: {
          save: {
            _id: save._id, username: save.username, email: save.email, role: save.role, meta: save.meta
          }
        }
      }
    } catch (err) {
      return ctx.body = { success: false, message: '更改失败', rescode: 10036, data: { err } }
    }
  } else {
    return ctx.body = { success: false, message: '哦噢，出了点小问题，请联系管理员！', rescode: 10035, data: {} }
  }
})

router.get('/users', async(ctx, next) => {
  let params = {}
  if (ctx.request.query && ctx.request.query.keywords) {
    const keywords = ctx.request.query.keywords
    params = {
      $or: [
        { username: { $regex: keywords, $options:'i' } },
        { email: { $regex: keywords, $options:'i' } }
      ]
    }
  }

  const User = mongoose.model('User')
  const users = await User.find(params).sort({ 'meta.createdAt': -1 })

  if (users) {
    return (ctx.body = { success: true, message: '查找成功', rescode: 10040, data: { users } })
  } else {
    return (ctx.body = { success: false, message: '查找用户信息失败', rescode: 10041, data: {} })
  }
})

router.get('/user/:username', async(ctx, next) => {
  const username = ctx.params.username
  let params = {}
  if (username) {
    params.username = username
  }
  else {
    return ctx.body = { success: false, message: '查找失败，缺少参数', rescode: 10051, data: {} }
  }

  const User = mongoose.model('User')
  const users = await User.findOne(params).sort({ 'meta.createdAt': -1 })

  if (users) {
    return ctx.body = { success: true, message: '查找成功', rescode: 10050, data: { users } }
  } else {
    return ctx.body = { success: false, message: '查找用户信息失败', rescode: 10052, data: {} }
  }
})

router.del('/user', async (ctx, next) => {
  const _id = ctx.request.query._id
  if (!_id) return ctx.body = { success: false, message: '删除失败，缺少参数', rescode: 10061, data: {} }

  const User = mongoose.model('User')
  await User.remove({_id:ObjectID(_id)}, (err, res) => {
    if (err) {
      return ctx.body = { success: false, message: '删除失败', rescode: 10062, data: { err } }
    } else {
      return ctx.body = { success: true, message: '删除成功', rescode: 10060, data: {} }
    }
  })
})

// movies
router.get('/movies', async (ctx, next) => {
  let cate = ctx.request.query.cate
  let country = ctx.request.query.country
  let year = ctx.request.query.year
  let rate = ctx.request.query.rate
  let page = parseInt(ctx.request.query.page)
  let pageNum = parseInt(ctx.request.query.pageNum)
  let keywords = parseInt(ctx.request.query.keywords) || ctx.request.query.keywords

  if (!page) { page = 1, pageNum = 9999 }
  if (page && !pageNum) { page = 1, pageNum = 10 }

  let params = {}
  if (country && country.indexOf('all') < 0) {
    params.country = new RegExp(`^.*`+country+`.*$`)
  }
  if (year && year.indexOf('all') < 0) {
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
  let movies = []
  // console.log('keywords: ',keywords)
  if (keywords) {
    let queryrate = parseFloat(keywords)
    params = {
      $or: [
        { country: new RegExp(`^.*`+keywords+`.*$`) },
        { year: new RegExp(`^.*`+keywords+`.*$`) },
        { summary: new RegExp(`^.*`+keywords+`.*$`) }
      ]
    }
    movies = await Movie.find(params).limit(pageNum).skip((page-1) * pageNum).sort({ 'meta.createdAt': -1 })
  } else {
    movies = await Movie.find(params).limit(pageNum).skip((page-1) * pageNum).sort({
      'meta.createdAt': -1
    })
  }

  ctx.body = { success: true, message: '查询成功', rescode: 20010, data: { movies, legth: movies.length } }
})

router.get('/movies/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id
  const movie = await Movie.findOne({id:id}).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, message: '查询成功', rescode: 20020, data: { movie } }
})

router.get('/categories', async (ctx, next) => {
  const Category = mongoose.model('Category')
  const categories = await Category.find({}).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, message: '查询成功', rescode: 20030, data: { categories } }
})

router.get('/category/:id', async (ctx, next) => {
  const Category = mongoose.model('Category')
  const id = ctx.params.id
  const category = await Category.findOne({_id:id})

  let movies = [], moviesid = category.movies
  const Movie = mongoose.model('Movie')
  for (let i=0; i<moviesid.length; i++) {
    let item = moviesid[i]
    let movie = await Movie.findOne({_id:mongoose.Types.ObjectID(item)})
    movies.push(movie)
  }
  if (movies !== '') {
    ctx.body = { success: true, message: '查询成功', rescode: 20020, data: { category, movies, length: movies.length } }
  } else {
    ctx.body = { success: false, message: '查询失败', rescode: 20021, data: { movies } }
  }
})

// document
router.get('/documents', async (ctx, next) => {
  let page = parseInt(ctx.request.query.page)
  let pageNum = parseInt(ctx.request.query.pageNum)
  let keywords = parseInt(ctx.request.query.keywords) || ctx.request.query.keywords

  let params = {}
  if (!page) { page = 1, pageNum = 9999 }
  if (page && !pageNum) { page = 1, pageNum = 10 }
  if (keywords) {
    params = {
      $or: [
        { id: parseInt(keywords) ? parseInt(keywords) : '' },
        { name: new RegExp(`^.*`+keywords+`.*$`) },
        { url: new RegExp(`^.*`+keywords+`.*$`) }
      ]
    }
  }

  const Document = mongoose.model('Document')
  const documents = await Document.find(params).limit(pageNum).skip((page-1) * pageNum).sort({ 'meta.createdAt': -1 })

  if (documents) {
    ctx.body = { success: true, message: '查询成功', rescode: 30010, data: { page, pageNum, documents } }
  } else {
    ctx.body = { success: false, message: '查询失败', rescode: 30011, data: {} }
  }
})

router.get('/document/:id', async (ctx, next) => {
  const id = ctx.params.id

  const Document = mongoose.model('Document')
  const document = await Document.findOne({_id:id})

  if (document !== '') {
    ctx.body = { success: true, message: '查询成功', rescode: 30020, data: { document } }
  } else {
    ctx.body = { success: false, message: '查询失败', rescode: 30021, data: { document } }
  }
})

async function getDocumentId(){
  const Document = mongoose.model('Document')
  let documents = await Document.find({})
  if (documents &&　documents.length > 0) {
    return documents[documents.length - 1].id + 1
  }
  return 1001
}

router.post('/document', async (ctx, next) => {
  if (ctx.request.body) {
    const { name, url, method, desc, request, response } = ctx.request.body

    const Document = mongoose.model('Document')
    const id = await getDocumentId()
    const document = new Document({
      id: id,
      name: name,
      url: url,
      method: method,
      desc: desc,
      request: request,
      response: response
    })

    try {
      const save = await document.save()  // save() 异步操作
      // 保存成功执行的操作
      return ctx.body = { success: true, message: '添加成功', rescode: 30030, data: { save } }
    } catch (err) {
      // 保存失败执行的操作
      return ctx.body = { success: false, message: '添加失败', rescode: 30034, data: { err } }
    }
  } else {
    return ctx.body = { success: false, message: '添加失败', rescode: 30031, data: {} }
  }
})

router.put('/document', async (ctx, next) => {
  if (ctx.request.body) {
    const { _id, name, url, method, desc, request, response } = ctx.request.body

    if (!_id) return ctx.body = { success: false, message: '更改失败，缺少参数', rescode: 30042, data: {} }

    const Document = mongoose.model('Document')
    const id = await getDocumentId()
    const document = await Document.findOne({_id:ObjectID(_id)})
    if (!document) return ctx.body = { success: false, message: '更改失败', rescode: 30044, data: { err } }

    if (name) document.name = name
    if (url) document.url = url
    if (method) document.method = method
    if (desc) document.desc = desc
    if (request) document.request = request
    if (response) document.response = response

    try {
      const save = await document.save()  // save() 异步操作
      return ctx.body = { success: true, message: '更改成功', rescode: 30040, data: { save } }
    } catch (err) {
      return ctx.body = { success: false, message: '更改失败', rescode: 30045, data: { err } }
    }
  } else {
    return ctx.body = { success: false, message: '更改失败', rescode: 30041, data: {} }
  }
})

router.del('/document', async (ctx, next) => {
  const _id = ctx.request.query._id
  if (!_id) return ctx.body = { success: false, message: '删除失败，缺少参数', rescode: 30051, data: {} }

  const Document = mongoose.model('Document')
  await Document.remove({_id:ObjectID(_id)}, (err, res) => {
    if (err) {
      return ctx.body = { success: false, message: '删除失败', rescode: 30052, data: { err } }
    } else {
      return ctx.body = { success: true, message: '删除成功', rescode: 30050, data: {} }
    }
  })
})

module.exports = router
