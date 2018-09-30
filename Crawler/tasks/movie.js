const childprocess = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const script = resolve(__dirname, '../crawler/trainer-list') //引入脚本
  const child = childprocess.fork(script, []) //利用child_process的fork运行脚本

  let invoked = false //标识脚本是否启动

  child.on('error', err => {  //监听错误信息
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {  //监听退出信息
    if (invoked) return
    invoked = true
    let err = code===0 ? null : new Error('exit code ' + code)
    console.log(err)
  })

  child.on('message', data => {  //监听消息信息
    let result = data.result

    console.log('===========result===========')
    console.log(result)
    result.forEach(async (item) => {
      let movie = await Movie.findOne({ id: item.id }).exec()
      if (!movie) {
        // console.log(item, item.id)
        movie = new Movie(item)
        await movie.save()
      }
    })
  })
})()
