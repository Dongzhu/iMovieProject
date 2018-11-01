<template>
  <div>
    <Header></Header>

    <div class="main category">
      <el-container>
        <div class="cate-all">
          所有分类：
          <span v-for="(item,index) in catelist" :key="index" class="tagspan" @click="gotoCate(item)">
            <router-link :to="{ name: 'category', params: { id: item._id }}" :class="{'active-span': cateid === item._id}">{{item.name}} {{item.movies.length}}</router-link>
          </span>
          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="unfold">
          </el-switch><span> {{valueText}}</span>
        </div>
        <div class="clearfix"></div>
        <div class="cate-info" v-if="cateid !== ''">
          <div class="cate-page" v-if="hackReset">
            <el-pagination
              layout="prev, pager, next"
              :page-size="pageNum"
              :total="pageTotal"
              :pager-count="5"
              @current-change="currentChange"
              class="pagenator">
            </el-pagination>
          </div>
          <h4>
            当前分类：
            <el-breadcrumb separator="/" v-if="hackReset">
              <el-breadcrumb-item :to="{ path: '/categories' }">分类</el-breadcrumb-item>
              <el-breadcrumb-item>{{category}}</el-breadcrumb-item>
            </el-breadcrumb>
          </h4>
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
        <div class="cate-info" v-else>
          <div class="cate-page" v-if="hackReset">
            <el-pagination
              layout="prev, pager, next"
              :page-size="pageNum"
              :total="pageTotal"
              :pager-count="5"
              @current-change="currentChange"
              class="pagenator">
            </el-pagination>
          </div>
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
      value: true,
      taglength: 30,
      categories: [],
      category: '',
      catemovies: [],
      // movielist: [],
      page: 1,
      pageNum: 8,
      pageTotal: 0,
      hackReset: false
    }
  },
  mounted () {
    getCategories().then(res => {
      if (res.success) {
        this.categories = res.data.categories
      } else {
        this.categories = []
      }
    })

    if (this.cateid !== '') {
      getCategory(this.cateid).then(res => {
        if (res.success) {
          this.category = res.data.category.name
          this.catemovies = res.data.movies
          this.pageTotal = res.data.movies.length
        } else {
          this.categories = []
        }
      })
    } else {
      getMovies({}).then(res => {
        if (res.success) {
          this.catemovies = res.data.movies
          this.pageTotal = res.data.movies.length
        } else {
          this.catemovies = []
        }
      })
    }

    window.addEventListener('scroll', this.handleScroll)
    this.hack()
  },
  destroyed () {
    console.log('destoryed')
    window.localStorage.setItem('storage', '')
  },
  computed: {
    catelist () {
      let templist = this.categories
      return templist.sort(this.sortLen).slice(0, this.taglength)
    },
    valueText () { return this.value ? '展开' : '折叠' },
    cateid () {
      let path = this.$route.path.split('/category/')
      return path.length > 1 ? path[1] : ''
    },
    movielist () {
      let movies = []
      let start = (this.page - 1) * this.pageNum
      let mid = start + this.pageNum - 1
      let len = this.catemovies.length
      let end = mid > len ? len : mid

      for (let i = start; i < end; i++) {
        movies.push(this.catemovies[i])
      }
      return movies
    }
  },
  methods: {
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
      getCategory(this.cateid).then(res => {
        if (res.success) {
          this.category = res.data.category.name
          this.catemovies = res.data.movies
          this.pageTotal = res.data.movies.length
          this.hack()
        } else {
          this.categories = []
        }
      })
    },
    currentChange (currentPage) {
      this.page = currentPage
      // let params = { page: currentPage, pageNum: this.pageNum }
      // getMovies(params).then(res => {
      //   if (res.success) {
      //     this.newlist = res.data.movies
      //     this.hack()
      //   } else {
      //     this.openError(res.message)
      //   }
      // })
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
