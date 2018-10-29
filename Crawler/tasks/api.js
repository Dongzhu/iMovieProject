const request = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

// http://api.douban.com/v2/movie/subject/1764796

// 延时函数
const sleep = time => new Promise(resolve =>  {
  setTimeout(resolve, time)
})

async function fetchMovie(item) {
  sleep(10000)

  const url = `http://api.douban.com/v2/movie/${item.id}`
  const res = await request(url)

  let body
  try {
    body = JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
  return body
}

;(async () => {
  // let movies = [
  //   { id: 26925317,
  //   title: '动物世界',
  //   rate: 7.3,
  //   poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2525528688.jpg' }
  // ]
  let movies = await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { year: { $exists: false } },
      { title: '' },
      { summary: '' }
    ]
  })
  // console.log(movies);

  // for (let i=0; i<[movies[0]].length; i++) {
  for (let i=0; i<movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    // console.log('movieData')
    // console.log(movieData)
    if (movieData) {
      movie.author = movieData.author || []
      movie.title = movieData.title || ''
      movie.alt_title = movieData.alt_title || ''
      movie.image = movieData.image || ''
      movie.summary = movieData.summary || ''
      movie.tags = movieData.tags || []

      if (movieData.attrs) {
        let attrs = movieData.attrs
        movie.language = attrs.language || []
        movie.pubdate = attrs.pubdate || []
        movie.country = attrs.country || []
        movie.writer = attrs.writer || []
        movie.director = attrs.director || []
        movie.cast = attrs.cast || []
        movie.movie_duration = attrs.movie_duration || []
        movie.year = attrs.year || []
        movie.movie_type = attrs.movie_type || []
      }

      for (let i=0; i<movie.tags.length; i++) {
        let item = movie.tags[i]
        let cate = await Category.findOne({ name: item.name })
        if (!cate) {
          cate = new Category({ name: item.name, movies: [ movie._id ] })
        } else {
          if (cate.movies.indexOf(movie._id) === -1) {
            cate.movies.push(movie._id)
          }
        }

        await cate.save()

        if (!movie.category) {
          movie.category.push(cate._id)
        } else {
          if (movie.category.indexOf(cate._id) === -1) {
            movie.category.push(cate._id)
          }
        }
      }

      // await movie.save()
      try {
        // console.log('movie')
        // console.log(movie)
        const save = await movie.save();
          // 保存成功执行的操作
      } catch(err){
          // 保存失败执行的操作
          console.log('err')
          console.log(err)
      }
    }
  }

  // movies.map(async movie => {
  //   let data = await fetchMovie(movie)
  //   try {
  //     data = JSON.parse(data)
  //     console.log(data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // })
})()
