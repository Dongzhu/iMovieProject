const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTORY = 10
const MAX_LOGIN_ATTEMPTS = 5 //最大登录次数
const LOCK_TIME = 2 * 60 * 60 * 1000  //锁定时长：两小时

const userSchema = new Schema({
  username: { required: true, unique: true, type: String },
  password: { required: true, unique: true, type: String },
  email: { required: true, unique: true, type: String },
  loginAttempts: { required: true, type: Number, default: 0 },
  lockUntil: Number,
  meta: {
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
  }
})

//定义虚拟字段isLocked判断用户账号是否被锁定，不会存入数据库
userSchema.virtual('isLocked').get( function () {
  //两次取反操作拿到true或者false值
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
})

//中间件，判断数据是否为新数据，并且对密码字段进行加盐加密操作
userSchema.pre('save', function (next) {
  if (!user.isModified('password')) return next() //判断密码是否被修改

  bcrypt.genSalt(SALT_WORK_FACTORY, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error)

      this.password = hash
      next()
    })
    next()
  })

  next()
})

//验证密码是否正确
userSchema.methods = {
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  incLoginAttepts: (user) => {
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: { loginAttempts: 1 },
          $unset: { loginUntil: 1 }
        }, (err) => {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = { $inc: { loginAttempts: 1 } }

        if (!this.isLocked &&　this.loginAttempts+1 >= MAX_LOGIN_ATTEMPTS) {
          updates.$set = { lockUntil: Date.now() + LOCK_TIME }
        }

        this.update(updates, err => {
          if (err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', userSchema)
