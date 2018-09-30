const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

const Movie = mongoose.model('Movie')

;(async () => {
  let movies = await Movie.find({
    $or: [
      {video: {$exists: false}},
      {video: null}
    ]
  }).exec()

  let invoked = false
  let script = resolve(__dirname, '../crawler/video')
  let child = cp.fork(script, [])

  child.on('error', err => {
    if (invoked) return
    invoked = true

    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = false
    let err = code === 0 ? null : new Error('exit code ' + code)

    console.log(err)
  })

  child.on('message', async data => {
    let id = data.id
    let movie = await Movie.findOne({
      id: id
    }).exec()

    if (data.video) {
      movie.video = data.video
      movie.cover = data.cover

      await movie.save()
    } else {
      await movie.remove()
    }
  })

  child.send(movies)
})()
