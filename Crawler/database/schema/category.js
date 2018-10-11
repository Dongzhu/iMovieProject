const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const categorySchema = new Schema({
  name: { unique: true, type: String },
  movies: [ { type: ObjectId, name: String, ref: 'Movie'} ],
  meta: {
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() }
  }
})

categorySchema.pre('save', function (next) {  //中间件，判断数据是否为新数据
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

mongoose.model('Category', categorySchema)