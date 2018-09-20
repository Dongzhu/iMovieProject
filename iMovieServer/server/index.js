const koa = require('koa')
const app = new koa()

app.use(async (ctx, next) => {
  ctx.body = 'index'
})

app.listen(2333)
