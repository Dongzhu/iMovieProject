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

app.use( router.routes(), router.allowedMethods() )
app.use(bodyParser())
app.use(async (ctx, next) => { ctx.body = 'Hello Koa!' })

// session
app.keys = ['imovie']
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: false, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
}
app.use(session(CONFIG, app))

app.use(cors())
// app.use(cors({
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
//     maxAge: 100,
//     credentials: true,
//     allowMethods: ['GET', 'POST', 'OPTIONS'],
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
// }))

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:`+PORT)
})
