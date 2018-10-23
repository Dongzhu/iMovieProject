const router = require('koa-router')()
const mongoose = require('mongoose')

router.get('/documents', async (ctx, next) => {
  let page = parseInt(ctx.request.query.page)
  let pageNum = parseInt(ctx.request.query.pageNum)
  let keywords = parseInt(ctx.request.query.keywords) || ctx.request.query.keywords

  let params = {}
  if (!page) { page = 1, pageNum = 9999 }
  if (page && !pageNum) { page = 1, pageNum = 10 }
  if (keywords) {
    console.log('keywords: ', keywords)
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
