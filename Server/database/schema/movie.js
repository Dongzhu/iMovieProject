const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
  // id: { unique: true, type: String },
  // category: [ { type: ObjectId, ref: 'Category' } ],
  // rate: Number,
  // title: String,
  // original_title: String,
  // countries: [String],
  // summary: String,
  // year: String,
  // genres: [String],
  // directors: [
  //   { alt: String, name: String, id: String }
  // ],
  // aka: [String],
  // subtype: String,
  // comments_count: Number,
  // ratings_count: Number,
  //
  // recommend: { type: Boolean, default: false },
  //
  // video: String,
  // poster: String,
  // cover: String,
  // videoKey: String,
  // posterKey: String,
  // coverKey: String,
  //
  // meta: {
  //   createAt: { type: Date, default: Date.now() },
  //   updateAt: { type: Date, default: Date.now() },
  // }
  id: { unique: true, type: String },
  category: [ { type: ObjectId, ref: 'Category' } ],
  author: [ { name: String } ],
  title: String,
  alt_title: String,
  image: String,
  summary: String,
  language: [ String ],
  pubdate: [ String ],
  country: [ String ],
  writer: [ String ],
  director: [ String ],
  cast: [ String ],
  movie_duration: [ String ],
  year: [ String ],
  movie_type: [ String ],
  tags: [ { name: String, count: Number } ],

  rate: Number,
  recommend: { type: Boolean, default: false },

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
