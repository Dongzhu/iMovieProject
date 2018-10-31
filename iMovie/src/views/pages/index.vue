<template>
  <div>
    <div class="bg">
      <Header></Header>

      <el-container>
        <div class="banner">
          <el-carousel :interval="4000" type="card"  @change="showChange">
            <el-carousel-item v-for="(item,index) in bannerlist" :key="index">
              <h3>{{ item.name}}</h3>
              <img v-lazy="item.url" alt="" width="100%" height="100%">
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-container>
    </div>

    <div class="main">
      <el-container>
        <div class="section">
          <!-- <div class="section-item">
            <div class="section-header">
              <h4>高分推荐
                <el-pagination
                  small
                  layout="prev, pager, next"
                  :total="50">
                </el-pagination>
              </h4>
            </div>
            <div class="section-body">
              <div class="card" v-for="(item,index) in heighlist" :key="index" :title="item.title+' '+item.rate">
                <div class="card-bg">
                  <a :href="'/detail/'+item.id"><img v-lazy="item.poster" :alt="item.title" width="100%" height="100%" class="image"></a>
                  <span class="card-rate">{{ item.rate }}</span>
                </div>
                <div class="video">
                  <video
                    src="http://120.132.18.193:8080/vod/2018/6/29/1530263522730512.mp4"
                    width="100%" height="100%"
                    onMouseOver="this.play()" onMouseOut="this.pause()" :poster="item.url">
                    您的浏览器不支持video标签
                  </video>
                </div>
                <div class="card-info">
                  <p class="over"><a :href="'/detail/'+item.id">{{item.title}}</a></p>
                  <p class="bottom clearfix">
                    <time class="time"><a :href="'/detail/'+item.id">{{ item.year }}</a></time>
                  </p>
                </div>
              </div>
            </div>
          </div> -->

          <div class="section-item">
            <div class="section-header">
              <h4>最近更新
                <span class="tag">
                  <span class="active-tag">热门</span>
                  <span @click="sortBy('newest')">最新</span>
                  <span @click="sortBy('highrate')">豆瓣高分</span>
                  <span @click="sortBy('coldfilm')">冷门佳片</span>
                  <span @click="sortBy('chinese')">华语</span>
                  <span @click="sortBy('EUAmerica')">欧美</span>
                  <span @click="sortBy('KoJapan')">日韩</span>
                </span>
                <!-- <span>
                  <page showNum='true' style="float:right;"></page>
                </span> -->
                <el-pagination
                  small
                  layout="prev, pager, next"
                  :page-size="pageNum"
                  :total="pageTotal"
                  :pager-count="5"
                  @current-change="currentChange"
                  class="pagenator">
                </el-pagination>
              </h4>
            </div>
            <div class="section-body" v-if="hackReset">
              <div class="card" v-for="(item,index) in newlist" :key="index" :title="item.title+' '+item.rate">
                <div class="card-bg">
                  <a :href="'/detail/'+item.id"><img v-lazy="item.poster" :alt="item.title" width="100%" height="100%"></a>
                </div>
                <div class="card-info">
                  <p class="over"><a :href="'/detail/'+item.id">{{item.title}}</a></p>
                  <p class="bottom clearfix">
                    <time class="time"><a :href="'/detail/'+item.id">{{ item.year }}</a></time>
                  </p>
                </div>
              </div>
              <div class="loadmore">
                <span @click="loadmore" v-if="page < 3">加载更多</span>
                <span @click="loadmore" v-else>
                  <router-link :to="{ name: 'movies' }">查看更多</router-link>
                </span>
              </div>
            </div>
          </div>
        </div>

        <Sidebar></Sidebar>
      </el-container>
    </div>
    <div class="clearfix"></div>

    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../base/header'
import Footer from '../base/foot'
import Page from '../base/page'
import Sidebar from '../base/sidebar'

import { getMovies } from '@/api/views/movies'

export default {
  components: { Header, Footer, Page, Sidebar },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      bannerlist: [
        {id: 1, name: '伯德小姐', rate: 4.8, pubdate: '2018-08-31', url: require('@/assets/images/image1.jpg')},
        {id: 2, name: '那片星空', rate: 4.9, pubdate: '2018-08-31', url: require('@/assets/images/image2.jpg')},
        {id: 3, name: '泰坦尼克号', rate: 4.7, pubdate: '2018-08-31', url: require('@/assets/images/image3.jpg')},
        {id: 4, name: '权力的游戏', rate: 4.8, pubdate: '2018-08-31', url: require('@/assets/images/image4.jpg')},
        {id: 5, name: '中国有嘻哈', rate: 4.5, pubdate: '2018-08-31', url: require('@/assets/images/image5.jpg')}
      ],
      heighlist: [
        {id: 1, name: '狄仁杰之四大天王', pubdate: '2018-07-27', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526405034.jpg'},
        {id: 1, name: '瞒天过海：美人计 Oceans Eight', pubdate: '2018-06-08', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2508259902.jpg'},
        {id: 1, name: '致所有我曾爱过的男孩 To All the Boys I have Loved Before', pubdate: '2018-08-17', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529112058.jpg'},
        {id: 1, name: '遗传厄运 Hereditary', pubdate: '2018-06-08', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2518865763.jpg'},
        {id: 1, name: '复仇者联盟3：无限战争 Avengers: Infinity War', pubdate: '2018-05-11', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2517753454.jpg'},
        {id: 1, name: '燃烧 버닝', pubdate: '2018-05-16', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2520095279.jpg'},
        {id: 1, name: '大象席地而坐', pubdate: '2018-02-16', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2511811355.jpg'},
        {id: 1, name: '肆式青春 詩季織々', pubdate: '2018-08-04', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526429256.jpg'},
        {id: 1, name: '奇迹男孩 Wonder', pubdate: '2018-01-19', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2507709428.jpg'},
        {id: 1, name: '行动时刻 Action Point', pubdate: '2018-06-01', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520177065.jpg'}
      ],
      newlist: [],
      page: 1,
      pageNum: 18,
      pageTotal: 0,
      hackReset: false
    }
  },
  mounted () {
    let route = this.$route.path
    if (route.indexOf('index') > -1 || route.length === 1) {
      document.querySelector('.main').style.marginTop = '0'
      document.querySelector('.bg').style.paddingTop = '0'
      document.querySelector('.banner').style.marginTop = '90px'
    }

    getMovies({page: this.page, pageNum: this.pageNum}).then(res => {
      if (res.success) {
        this.newlist = res.data.movies
        this.pageTotal = res.data.legth
        this.hack()
      } else {
        this.newlist = []
      }
    })

    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    // heighlist () {
    //   let templist = this.newlist
    //   return templist.sort(this.sortRate).slice(0, 6)
    // }
  },
  methods: {
    handleScroll () {
      let scrollY = 480
      if (document.documentElement.clientWidth <= 600) {
        scrollY = 280
      }
      if (window.scrollY > scrollY) {
        document.querySelector('.top').style.background = '#f8f8f8'
        document.querySelector('.username').style.color = '#000'
      } else {
        document.querySelector('.top').style.background = 'none'
        document.querySelector('.username').style.color = '#fff'
      }
    },
    hack () {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    showChange (index) {
      document.querySelector('.bg').style.backgroundImage = 'url(' + this.bannerlist[index].url + ')'
    },
    sortRate (a, b) {
      return b.rate - a.rate
    },
    loadmore () {
      if (this.page < 3) {
        getMovies({page: ++this.page, pageNum: this.pageNum}).then(res => {
          if (res.success) {
            res.data.movies.forEach(item => {
              this.newlist.push(item)
            })
          }
        })
      } else {
        this.$router.push('/movies')
      }
    },
    sortBy (condition) {
      console.log(condition)
      // newest 最新、highrate 豆瓣高分、coldfilm 冷门佳片、chinese 华语、EUAmerica 欧美、KoJapan

      let params = { page: this.page, pageNum: this.pageNum }
      if (condition === 'chinese') params.country = '中国'
      if (condition === 'EUAmerica') params.country = '欧美'
      if (condition === 'KoJapan') params.country = '韩国,日本'

      getMovies(params).then(res => {
        if (res.success) {
          this.newlist = res.data.movies
          this.hack()
        } else {
          this.openError(res.message)
        }
      })
    },
    currentChange (currentPage) {
      let params = { page: currentPage, pageNum: this.pageNum }
      getMovies(params).then(res => {
        if (res.success) {
          this.newlist = res.data.movies
          this.hack()
        } else {
          this.openError(res.message)
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
