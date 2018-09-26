const request = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

// http://api.douban.com/v2/movie/subject/1764796

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
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
  //   { doubanId: 26925317,
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

  console.log('==========movies[0]==========')
  console.log(movies[0])

  // for (let i=0; i<[movies[0]].length; i++) {
  for (let i=0; i<movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)
    console.log('==========movieData==========')
    console.log(movieData)
    if (movieData) {
      let genres = movieData.genres || []
      movie.genres = genres
      // movie.tags = movieData.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.original_title = movieData.original_title || ''
      movie.year = movieData.year || '2500'
      movie.countries = movieData.countries || []
      movie.aka = movieData.aka || []
      movie.subtype = movieData.subtype || ''
      movie.comments_count = movieData.comments_count || 0
      movie.ratings_count = movieData.ratings_count || 0

      for (let i=0; i<movieData.directors.length; i++) {
        let item = movieData.directors[i]
        movie.directors.push(item)
      }

      for (let i=0; i<movie.genres.length; i++) {
        let item = movie.genres[i]
        let cate = await Category.findOne({ name: item })
        if (!cate) {
          cate = new Category({ name: item, movies: [movie._id] })
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

      genres.forEach(tag => {
        if(tag.name!==null && tag.name!==undefined){
          movie.genres.push(tag.name)
        }
      })

      console.log('============movie============')
      console.log(movie)
      await movie.save()
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
