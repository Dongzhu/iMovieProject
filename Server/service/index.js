const koa = require('koa')
const mongoose = require('mongoose')
const session = require('koa-session')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const router = require('../routes/index')
const { connect, initSchemas, initAdmins } = require('../database/init')

const PORT = 2333

;(async () => {
  initSchemas()
  initAdmins()

  await connect()
})()

const app = new koa()

// session
app.keys = ['imovie']
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  // maxAge: 10000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: false, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
}
app.use(session(CONFIG, app))

//登陆拦截
app.use(async (ctx, next) => {
  // console.log(ctx.cookies.get('koa:sess'), ctx.path, ctx.session.user)
  if (!ctx.cookies.get('koa:sess') && ctx.path !== '/api/user/login' && ctx.path !== '/api/movies') {
    return ctx.body = { success: false, msg: '请先登录后再进行操作！' }
  } else {
    ctx.body = 'Hello Koa!'
  }
  await next()
})
app.use(router.routes(), router.allowedMethods())
app.use(bodyParser({enableTypes:['json', 'form', 'text']}))
// app.use(async (ctx, next) => { ctx.body = 'Hello Koa!' })

app.use(cors())
// app.use(cors({
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
//     maxAge: 100,
//     credentials: true,
//     allowMethods: ['GET', 'POST', 'OPTIONS'],
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
// }))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:`+PORT)
})
