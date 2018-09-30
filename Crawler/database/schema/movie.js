const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
  id: { unique: true, type: String },
  category: [ { type: ObjectId, ref: 'Category' } ],
  rate: Number,
  reviews_count: Number,
  wish_count: Number,
  collect_count: Number,
  year: String,
  images: { small: String, large: String, medium: String },
  alt: String,
  mobile_url: String,
  share_url: String,
  title: String,
  original_title: String,
  countries: [String],
  summary: String,
  genres: [String],
  directors: [
    { alt: String, name: String, id: String }
  ],
  casts: [
    { alt: String, name: String, id: String, avatars: { small: String, large: String, medium: String } }
  ],
  aka: [String],
  subtype: String,
  comments_count: Number,
  ratings_count: Number,

  video: String,
  poster: String,
  cover: String,
  videoKey: String,
  posterKey: String,
  coverKey: String,

  meta: {
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
  }
})

movieSchema.pre('save', function (next) {  //中间件，判断数据是否为新数据
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

mongoose.model('Movie', movieSchema)
