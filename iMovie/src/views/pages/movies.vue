<template>
  <div>
    <Header></Header>

    <div class="main category">
      <el-container>
        <div class="category-all">
          <p class="condition">年份：
            <span v-for="(item, index) in yearlist" :key="index" @click="searchMovie('year', item)" :class="{'active-span': item === currentyear}">
              {{item}}
            </span>
          </p>
          <p class="condition">地区：
            <span v-for="(item, index) in countrylist" :key="index" @click="searchMovie('country', item)" :class="{'active-span': item === currentcountry}">
              {{item}}
            </span>
          </p>
          <p class="category-rate">
            <span style="cursor: default">评分：</span>
            <span>
              <el-slider
                v-model="rate"
                range :max="10"
                @change="changerate">
              </el-slider>
            </span>
            <span>{{rate[0]}}, {{rate[1]}}</span>
          </p>
        </div>
        <div class="clearfix"></div>
        <div class="cate-info" v-if="hackReset">
          <!-- <div class="cate-page" v-if="pageTotal !== 0">
            <el-pagination
              layout="prev, pager, next"
              :page-size="pageNum"
              :total="200"
              :pager-count="5"
              @current-change="currentChange"
              class="pagenator">
            </el-pagination>
          </div> -->
          <div class="catemovies" v-for="(item,index) in movielist" :key="index" v-if="movielist.length !== 0">
            <div class="movielogo">
              <router-link :to="{ name: 'detail', params: {id:item.id} }">
                <img v-lazy="item.poster" :alt="item.title" width="100%" height="100%">
              </router-link>
            </div>
            <div class="movieinfo">
              <h4>
                <router-link :to="{ name: 'detail', params: {id:item.id} }">
                  {{item.title}} <span>{{item.rate}}</span>
                </router-link>
              </h4>
              <p>主演：<span v-for="(item,index) in item.cast || ''" :key="index"><span v-if="index !== 0"> / </span>{{item}}</span></p>
              <p>上映日期：<span v-for="(item,index) in item.pubdate || ''" :key="index">{{item}} </span></p>
              <p>剧情简介：{{item.summary}}</p>
            </div>
          </div>
          <div v-if="movielist && movielist.length === 0">
            <p style="padding: 100px 0; text-align: center">暂无数据</p>
          </div>
          <div class="loadmore" v-if="movielist && movielist.length !== 0">
            <span @click="nextPage">加载更多</span>
          </div>
        </div>
      </el-container>
    </div>
    <div class="clearfix"></div>

    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../base/header'
import Footer from '../base/foot'
import Sidebar from '../base/sidebar'

import { getMovies } from '@/api/views/movies'

export default {
  components: { Header, Footer, Sidebar },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      yearlist: [ '所有', '2018', '2017', '2010年代', '2000年代', '1990年代', '1980年代' ],
      countrylist: [ '所有', '中国大陆', '美国', '香港', '台湾', '日本', '韩国', '英国', '法国', '德国', '意大利', '西班牙', '印度', '泰国', '俄罗斯', '伊朗', '加拿大', '澳大利亚', '爱尔兰', '瑞典', '巴西', '丹麦' ],
      movies: [],
      rate: [0, 10],
      page: 1,
      pageNum: 10,
      pageTotal: 0,
      hackReset: false,
      next: true
    }
  },
  mounted () {
    let query = this.$route.query
    let params = {}
    if (query.cate) params.cate = query.cate
    if (query.country) params.country = query.country
    if (query.year) params.year = query.year
    if (query.rate) {
      params.rate = query.rate
      this.rate = query.rate.split(',')
    }
    if (query.page) params.page = query.page
    if (query.pageNum) params.pageNum = query.pageNum
    if (query.keywords) {
      params.keywords = query.keywords
    }

    getMovies(params).then(res => {
      if (res.success) {
        // this.$store.commit('updateMovies', res.data.movies)
        this.movies = res.data.movies
        this.updateMovies(res.data.movies)
        this.hack()
      } else {
        this.movielist = []
      }
    })

    window.addEventListener('scroll', this.handleScroll)
    this.hack()
  },
  destroyed () {
    console.log('destoryed')
    window.localStorage.setItem('storage', '')
  },
  computed: {
    movielist () { return this.$store.state.movielist },
    currentyear () {
      let year = this.$route.query.year
      return year === 'all' ? '所有' : year
    },
    currentcountry () {
      let country = this.$route.query.country
      return country === 'all' ? '所有' : country
    }
  },
  methods: {
    openSuccess (text) {
      this.$message({
        message: text,
        type: 'success'
      })
    },
    openError (text) {
      this.$message({
        showClose: true,
        message: text,
        type: 'error'
      })
    },
    hack () {
      // console.log('hack it!')
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    handleScroll () {
      document.querySelector('.top').style.background = '#f8f8f8'
      document.querySelector('.username').style.color = '#000'
    },
    sortLen (a, b) { return b.movies.length - a.movies.length },
    currentChange (currentPage) {
      this.page = currentPage
    },
    nextPage () {
      if (this.next) {
        let query = this.$route.query
        let params = {}
        if (query.cate) params.cate = query.cate
        if (query.country) params.country = query.country
        if (query.year) params.year = query.year
        if (query.rate) {
          params.rate = query.rate
          this.rate = query.rate.split(',')
        }
        if (query.page) params.page = query.page
        else params.page = this.page
        if (query.pageNum) params.pageNum = query.pageNum
        else params.pageNum = this.pageNum
        if (query.keywords) {
          params.keywords = query.keywords
        }
        params.page++

        getMovies(params).then(res => {
          if (res.success) {
            // this.$store.commit('updateMovies', res.data.movies)
            this.movies = res.data.movies
            this.updateMovies(res.data.movies)
            this.$router.push({path: 'movies', query: params})
            this.hack()
          } else {
            this.movielist = []
          }
        })
      } else {
        this.openError('当前已是最后一页！')
      }
    },
    updateMovies (list) {
      let movies = []
      let start = (this.page - 1) * this.pageNum
      let mid = start + this.pageNum - 1
      let len = list.length
      let end = mid > len ? len : mid
      for (let i = start; i <= end; i++) {
        if (list[i]) movies.push(list[i])
      }
      if (movies.length < 10) this.next = false
      else this.next = true
      this.$store.commit('updateMovies', movies)
    },
    searchMovie (type, item) {
      let query = this.$route.query
      let params = {}
      if (query.cate) params.cate = query.cate
      if (query.country) params.country = query.country
      if (query.year) params.year = query.year
      if (query.rate) params.rate = query.rate
      if (query.page) params.page = '1'
      if (query.pageNum) params.pageNum = query.pageNum

      if (type === 'year') { params.year = item === '所有' ? 'all' : item }
      if (type === 'country') { params.country = item === '所有' ? 'all' : item }

      getMovies(params).then(res => {
        if (res.success) {
          params.page = 1
          // this.$store.commit('updateMovies', res.data.movies)
          this.$router.push({path: 'movies', query: params})
          this.updateMovies(res.data.movies)
          this.hack()
        } else {
          this.movielist = []
        }
      })
    },
    changerate (rate) {
      let query = this.$route.query
      let params = {}
      if (query.cate) params.cate = query.cate
      if (query.country) params.country = query.country
      if (query.year) params.year = query.year
      if (query.rate) params.rate = query.rate
      if (query.page) params.page = query.page
      if (query.pageNum) params.pageNum = query.pageNum
      params.rate = rate.join(',')

      getMovies(params).then(res => {
        if (res.success) {
          this.page = 1
          // this.$store.commit('updateMovies', res.data.movies)
          this.$router.push({path: 'movies', query: params})
          this.updateMovies(res.data.movies)
          this.hack()
        } else {
          this.movielist = []
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 50px;
    margin: 0;
    width: 100%;
    position: fixed; bottom: 0;
    background-color: #333;
    color: #fff;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .is-active { width:70%; margin-left: -10%; }
</style>
