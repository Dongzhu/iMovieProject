const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-trainer' //数据库连接
const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
  //glob方法同步引入schema目录下的所有js文件，__dirname是相对于当前目录
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initAdmins = async () => {
  // create a user a new user
  const User = mongoose.model('User')

  let user = await User.findOne({ username: 'admin' })
  if (!user) {
    const user = new User({
      username: 'admin',
      password: '123456',
      email: '123456@gmail.com'
    })
    console.log('================')
    await user.save()
    // save user to database
    // await user.save(function(err) {
    //   console.log(2333)
    //   if (err) throw err
    //   // fetch user and test password verification
    //   User.findOne({ username: 'admin' }, function(err, user) {
    //     if (err) throw err
    //     // test a matching password
    //     user.comparePassword('123456', function(err, isMatch) {
    //       if (err) throw err
    //       console.log('123456:', isMatch) // -> 123456: true
    //     })
    //     // test a failing password
    //     user.comparePassword('abcdefg', function(err, isMatch) {
    //       if (err) throw err
    //       console.log('abcdefg:', isMatch) // -> 123Password: false
    //     })
    //   })
    // })
  }
}

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes<5) {
        mongoose.connect(db)
      } else {
        console.log('数据库挂了，快去修吧')
      }
    })

    mongoose.connection.on('error', err => {
      reject(err)
      console.log(err)
    })

    mongoose.connection.on('open', () => {
      // const Dog = mongoose.model('Dog', { name: String })
      // const dogA = new Dog({ name: 'Alpha' })
      //
      // dogA.save().then(() => {
      //   console.log('Woo')
      // })

      // resolve()
      console.log('MongoDB connected successful!')
    })
  })
}
