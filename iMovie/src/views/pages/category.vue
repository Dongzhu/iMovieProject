<template>
  <div>
    <div class="bg">
      <Header></Header>
    </div>

    <div class="main category">
      <el-container>
        <div class="cate-all">
          所有分类：
          <span v-for="(item,index) in catelist" :key="index" class="tagspan" @click="gotoCate(item)">
            <router-link :to="{ name: 'category', params: { id: item._id }}">{{item.name}} {{item.movies.length}}</router-link>
          </span>
          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="unfold">
          </el-switch><span> {{valueText}}</span>
        </div>
        <div class="clearfix"></div>
        <div class="cate-info" v-if="category !== ''">
          <h4>
            当前分类：
            <el-breadcrumb separator="/" v-if="hackReset">
              <el-breadcrumb-item :to="{ path: '/categories' }">分类</el-breadcrumb-item>
              <el-breadcrumb-item>{{category}}</el-breadcrumb-item>
            </el-breadcrumb>
          </h4>
          <div class="catemovies" v-for="(item,index) in catemovies" :key="index">
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
        </div>
        <div class="cate-info" v-else>
          <div class="catemovies" v-for="(item,index) in movielist" :key="index">
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

import { getMovies, getCategories, getCategory } from '@/api/views/movies'

export default {
  components: { Header, Footer, Sidebar },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      // category: window.localStorage.getItem('storage') || '',
      value: true,
      taglength: 30,
      categories: [],
      catemovies: [],
      movielist: [],
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
    getMovies().then(data => {
      if (data.success) {
        this.movielist = data.movies
      } else {
        this.movielist = []
      }
    })

    getCategories().then(data => {
      if (data.success) {
        this.categories = data.categories
      } else {
        this.categories = []
      }
    })

    getCategory(this.cateid).then(data => {
      if (data.success) {
        this.catemovies = data.movies
      } else {
        this.categories = []
      }
    })

    this.hack()
  },
  destroyed () {
    console.log('destoryed')
    window.localStorage.setItem('storage', '')
  },
  computed: {
    category () { return this.$store.state.category },
    catelist () {
      let templist = this.categories
      return templist.sort(this.sortLen).slice(0, this.taglength)
    },
    valueText () { return this.value ? '展开' : '折叠' },
    cateid () {
      let path = this.$route.path.split('/category/')
      return path.length > 1 ? path[1] : ''
    }
  },
  methods: {
    hack () {
      console.log('hack it!')
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    sortLen (a, b) {
      return b.movies.length - a.movies.length
    },
    unfold (value) {
      if (value) {
        this.taglength = 30
      } else {
        this.taglength = 9999
      }
    },
    gotoCate (item) {
      this.$store.commit('updateCate', item.name)
      getCategory(this.cateid).then(data => {
        if (data.success) {
          this.catemovies = data.movies
          this.hack()
        } else {
          this.categories = []
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
