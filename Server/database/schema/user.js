const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTORY = 10 //在node.bcrypt.js中SALT_WORK_FACTOR默认使用的是10
const MAX_LOGIN_ATTEMPTS = 5 //最大登录次数
const LOCK_TIME = 2 * 60 * 60 * 1000  //锁定时长：两小时

const userSchema = new Schema({
  username: { required: true, unique: true, type: String },
  password: { required: true, unique: true, type: String },
  email: { unique: true, type: String },
  role: { required: true, type: String },
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
  next()
})

//中间件，判断数据是否为新数据，并且对密码字段进行加盐加密操作
userSchema.pre('save', function(next) {
 var user = this
 // only hash the password if it has been modified (or is new)
 if (!user.isModified('password')) return next()
 // generate a salt
 bcrypt.genSalt(SALT_WORK_FACTORY, function(err, salt) {
  if (err) return next(err)
  // hash the password using our new salt
  bcrypt.hash(user.password, salt, function(err, hash) {
   if (err) return next(err)
   // override the cleartext password with the hashed one
   user.password = hash
   next()
  })
 })
})
// userSchema.pre('save', function (next) {
//   //产生密码hash当密码有更改的时候(或者是新密码)
//   let user = this
//   if (!user.isModified('password')) return next() //判断密码是否被修改
//
//   //产生一个salt
//   bcrypt.genSalt(SALT_WORK_FACTORY, (err, salt) => {
//     if (err) return next(err)
//     // 结合salt产生新的hash
//     bcrypt.hash(user.password, salt, (error, hash) => {
//       console.log(233333)
//       console.log(user.password, salt, error, hash)
//       if (error) return next(error)
//
//       // 使用hash覆盖明文密码
//       user.password = hash
//       next()
//     })
//     next()
//   })
//   next()
// })

//验证密码是否正确
userSchema.methods = {
  comparePassword: (_password, password) => {
    console.log(_password, password)
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
