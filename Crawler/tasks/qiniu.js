const qiniu = require('qiniu')
const mongoose = require('mongoose')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const Movie = mongoose.model('Movie')

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      }
      else {
        if (info.statusCode === 200) {
          resolve({ key })
        } else {
          reject(info)
        }
      }
    })
  })
}

;(async () => {
  // let movies = [{
  //   id: 26925317,
  //   cover: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2529571873.jpg',
  //   video: 'http://vt1.doubanio.com/201810121437/62eca37fa3b314b26510b0f5932ad913/view/movie/M/402340740.mp4',
  //   poster: 'https://img1.doubanio.com/img/trailer/medium/2530290917.jpg'
  // }]
  let movies = await Movie.find({
    $or: [
      {videoKey: {$exists: false}},
      {videoKey: null},
      {videoKey: ''}
    ]
  }).exec()

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]

    if (movie.video && !movie.videoKey) {
      try {
        console.log('开始传video');
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        console.log('开始传cover');
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
        console.log('开始传poster');
        let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

        console.log(videoData)
        console.log(movie)

        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }

        await movie.save()
      } catch (err) {
        console.log(err)
      }
    }
  }
})()
