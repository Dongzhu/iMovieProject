const router = require('koa-router')()
const mongoose = require('mongoose')

router.get('/documents', async (ctx, next) => {
  const Document = mongoose.model('Document')
  const documents = await Document.find({}).sort({
    'meta.createdAt': -1
  })

  if (documents) {
    ctx.body = { success: true, message: '查询成功', rescode: 30010, data: { documents } }
  } else {
    ctx.body = { success: false, message: '查询失败', rescode: 30011, data: {} }
  }
})

router.get('/document/:id', async (ctx, next) => {
  const Document = mongoose.model('Document')
  const id = ctx.params.id
  const document = await Document.findOne({_id:id})

  if (document !== '') {
    ctx.body = { success: true, message: '查询成功', rescode: 30020, data: { document } }
  } else {
    ctx.body = { success: false, message: '查询失败', rescode: 30021, data: { document } }
  }
})

module.exports = router
