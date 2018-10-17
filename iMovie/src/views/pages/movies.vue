<template>
  <div>
    <Header></Header>

    <div class="main category">
      <el-container>
        <div class="category-all">
          <p class="condition">年份：
            <span v-for="(item, index) in yearlist" :key="index" @click="searchMovie('year', item)" :class="{'active-span': item===currentyear}">
              {{item}}
            </span>
          </p>
          <p class="condition">地区：
            <span v-for="(item, index) in countrylist" :key="index" @click="searchMovie('country', item)" :class="{'active-span': item===currentcountry}">
              {{item}}
            </span>
          </p>
          <p class="category-rate">
            <span style="cursor: default">评分：</span>
            <span>
              <el-slider
                v-model="rate"
                range
                :max="10"
                @change="changerate">
              </el-slider>
            </span>
            <span>{{rate[0]}}, {{rate[1]}}</span>
          </p>
        </div>
        <div class="clearfix"></div>
        <div class="cate-info">
          <div class="catemovies" v-for="(item,index) in movielist" :key="index" v-if="movielist.length !== 0">
            <div class="movielogo">
              <router-link :to="{ name: 'detail', params: {id:item.id} }">
                <img :src="item.poster" :alt="item.title" width="100%" height="100%">
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
          <div v-if="movielist.length === 0">
            <p style="padding: 100px 0; text-align: center">暂无数据</p>
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
      value: true,
      movielist: [],
      yearlist: [ '所有', '2018', '2017', '2010年代', '2000年代', '1990年代', '1980年代' ],
      countrylist: [ '所有', '中国大陆', '美国', '香港', '台湾', '日本', '韩国', '英国', '法国', '德国', '意大利', '西班牙', '印度', '泰国', '俄罗斯', '伊朗', '加拿大', '澳大利亚', '爱尔兰', '瑞典', '巴西', '丹麦' ],
      // rate: [0, 10],
      bestlist: [
        {name: '碟中谍6：全面瓦解', rate: 4.8, pubdate: '2018-08-31', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2529365085.webp'},
        {name: '阿尔法：狼伴归途 Alpha', rate: 3.8, pubdate: '2018-09-07', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2530871439.webp'},
        {name: '蚁人2：黄蜂女现身 Ant-Man', rate: 3.7, pubdate: '2018-08-24', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529389608.webp'},
        {name: '大三儿', pubdate: '2018-08-20', rate: 4.5, url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2530569532.webp'},
        {name: '传奇的诞生', pubdate: '2018-09-07', rate: 3.5, url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2531286907.webp'},
        {name: '西虹市首富', pubdate: '2018-07-27', rate: 2.8, url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.webp'}
      ],
      hackReset: false
    }
  },
  mounted () {
    let query = this.$route.query
    let params = {}
    if (query.cate) params.cate = query.cate
    if (query.country) params.country = query.country
    if (query.year) params.year = query.year
    if (query.rate) params.rate = query.rate
    if (query.page) params.page = query.page
    if (query.pageNum) params.pageNum = query.pageNum
    getMovies(params).then(data => {
      if (data.success) {
        this.movielist = data.movies
      } else {
        this.movielist = []
      }
    })

    this.hack()
  },
  destroyed () {
    console.log('destoryed')
    window.localStorage.setItem('storage', '')
  },
  computed: {
    currentyear () { return this.$route.query.year || '' },
    currentcountry () { return this.$route.query.country || '' },
    rate (){ return this.$route.query.rate.split(',') || [0,10] }
  },
  methods: {
    hack () {
      // console.log('hack it!')
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    sortLen (a, b) { return b.movies.length - a.movies.length },
    searchMovie (type, item) {
      let query = this.$route.query
      let params = {}
      if (query.cate) params.cate = query.cate
      if (query.country) params.country = query.country
      if (query.year) params.year = query.year
      if (query.rate) params.rate = query.rate
      if (query.page) params.page = query.page
      if (query.pageNum) params.pageNum = query.pageNum

      if (type === 'year') params.year = item
      if (type === 'country') params.country = item
      console.log(params)
      getMovies(params).then(data => {
        if (data.success) {
          this.movielist = data.movies

          this.$router.push({path: 'movies', query: params})
        } else {
          this.movielist = []
        }
      })
    },
    changerate (rate) {
      console.log(rate)
      let query = this.$route.query
      let params = {}
      if (query.cate) params.cate = query.cate
      if (query.country) params.country = query.country
      if (query.year) params.year = query.year
      if (query.rate) params.rate = query.rate
      if (query.page) params.page = query.page
      if (query.pageNum) params.pageNum = query.pageNum

      // if (query.rate !== undefined && rate.length !== 0) {
      //   let newrate = rate.join(',')
      //   if (query.rate !== newrate) {
      //     params.rate = newrate
      //   }
      // }
      params.rate = rate.join(',')
      console.log(params)
      getMovies(params).then(data => {
        if (data.success) {
          this.movielist = data.movies

          this.$router.push({path: 'movies', query: params})
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
