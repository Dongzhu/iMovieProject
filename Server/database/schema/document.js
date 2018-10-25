const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const documentSchema = new Schema({
  id: { required: true, unique: true, type: Number },
  name: { required: true, unique: true, type: String },
  url: { required: true, unique: true, type: String },
  method: { required: true, type: String },
  desc: { type: String },
  request: { type: String },
  response: { type: String },
  // request: {
  //   username: { type: String },
  //   password: { type: String },
  //   password2: { type: String }
  // },
  // response: {
  //   success: { type: Boolean },
  //   message: { type: String },
  //   rescode: { type: Number },
  //   data: { type: String }
  // },
  meta: {
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() }
  }
})

documentSchema.pre('save', function (next) {  //中间件，判断数据是否为新数据
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

mongoose.model('Document', documentSchema)
