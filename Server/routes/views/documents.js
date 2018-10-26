const router = require('koa-router')()
const mongoose = require('mongoose')
const ObjectID = require('mongodb').ObjectID

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

    console.log(ctx.request.body)
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
