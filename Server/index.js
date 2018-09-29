const koa = require('koa')
const mongoose = require('mongoose')
const router = require('./routes/index')
const { connect, initSchemas } = require('./database/init')

const PORT = 2333

;(async () => {
  initSchemas()

  await connect()
})()

const app = new koa()

app.use( router.routes(), router.allowedMethods() )
app.use(async (ctx, next) => { ctx.body = 'Hello Koa!' })

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:`+PORT)
})
