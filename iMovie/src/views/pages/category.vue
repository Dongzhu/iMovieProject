<template>
  <div>
    <Header></Header>

    <div class="main category" v-if="hackReset">
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
        <div class="cate-info" v-loading="loading" v-if="cateid !== ''">
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
        </div>
        <div class="cate-info" v-loading="loading" v-else>
          <div class="catemovies" v-for="(item,index) in movielist" :key="index">
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
          <div v-if="(!loading && movielist.length === 0) || (loading && movielist.length !== 0)">
            <p style="height:200px;line-height:200px;text-align:center">暂无数据</p>
          </div>
        </div>
        <div class="loadmore" v-if="movielist.length !== 0">
          <span @click="nextPage">加载更多</span>
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
      loading: true,
      value: true,
      taglength: 30,
      categories: [],
      category: '',
      catemovies: [],
      // movielist: [],
      page: 1,
      pageNum: 10,
      hackReset: false,
      next: true
    }
  },
  mounted () {
    let query = this.$route.query
    if (query.page) this.page = query.page
    getCategories().then(res => {
      if (res.success) {
        this.categories = res.data.categories

        if (this.cateid !== '') {
          getCategory(this.cateid).then(res2 => {
            if (res2.success) {
              this.category = res2.data.category.name
              this.catemovies = res2.data.movies
              this.updateMovies(res2.data.movies)
            } else {
              this.categories = []
            }
            this.loading = false
          })
        } else {
          getMovies({}).then(res2 => {
            if (res2.success) {
              this.catemovies = res2.data.movies
              this.updateMovies(res2.data.movies)
            } else {
              this.catemovies = []
            }
            this.loading = false
          })
        }
      } else {
        this.categories = []
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
    catelist () {
      let templist = this.categories
      return templist.sort(this.sortLen).slice(0, this.taglength)
    },
    valueText () { return this.value ? '展开' : '折叠' },
    cateid () {
      let path = this.$route.path.split('/category/')
      return path.length > 1 ? path[1] : ''
    },
    movielist () { return this.$store.state.movielist }
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
          this.page = 1
          this.category = res.data.category.name
          this.catemovies = res.data.movies
          this.updateMovies(res.data.movies)
          this.hack()
        } else {
          this.categories = []
        }
      })
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
      this.$store.commit('updateMovies', movies)
      if (movies.length < 10) this.next = false
      else this.next = true
      this.hack()
    },
    nextPage () {
      if (this.cateid === '') {
        if (this.next) {
          this.page++
          this.updateMovies(this.catemovies)
          this.$router.push({path: 'categories', query: { page: this.page }})
        } else {
          this.openError('当前已是最后一页！')
        }
      } else {
        if (this.next) {
          console.log(this.$route.path)
          console.log(this.$route.query)
          this.page++
          this.updateMovies(this.catemovies)
          this.$router.push({path: this.cateid, query: { page: this.page }})
        } else {
          this.openError('当前已是最后一页！')
        }
      }
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
