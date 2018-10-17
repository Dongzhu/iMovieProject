<template>
  <div>
    <div class="top">
      <el-header>
        <div class="top-left">
          <a href="/">BRAND</a>
        </div>
        <div class="top-right" v-if="hackReset">
          <span v-if="username !== ''">
            <span :class="['username', {'color-fff':$route.path==='/'}]">{{ username }}</span>
            <img class="userimg" src="../../assets/images/avatar.jpg" alt="">
          </span>
          <span :class="['username', {'color-fff':$route.path==='/'}]" v-if="username === ''">
            <a href="/login" @click="login">登录</a> /
            <a href="/register" @click="register">注册</a>
          </span>
          <div class="top-right-info" v-if="username !== ''">
            <ul>
              <li>我的资料</li>
              <li>我的收藏</li>
              <li @click="logout">退出</li>
            </ul>
          </div>
        </div>
        <div class="top-bottom">
          <div class="">
            <div class="top-left">
              <ul>
                <li><a href="/">首页</a></li>
                <li><a href="#">国产电影</a></li>
                <li><a href="#">国外电影</a></li>
                <li><a href="#">排行榜</a></li>
                <li @click="gotoCate"><router-link :to="{ name: 'movies'}">分类</router-link></li>
              </ul>
            </div>
            <div class="top-right search-box">
              <input v-model="searchTxt" type="text" placeholder="请输入内容" @keyup.enter="searchMovie">
              <i class="el-icon-search" @click="searchMovie"></i>
            </div>
          </div>
        </div>
      </el-header>
    </div>
  </div>
</template>

<script>
import { getMovies } from '@/api/views/movies'

export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      username: '',
      searchTxt: '',
      hackReset: false
    }
  },
  mounted () {
    this.hack()
    this.searchTxt = this.$route.query.keywords
    this.username = this.getCookie('username')
    let route = this.$route.path
    if (route.indexOf('index') > -1 || route.length === 1) {
      if (document.querySelector('.top')) {
        document.querySelector('.top').style.color = '#fff'
      }
    }
  },
  methods: {
    hack () {
      // console.log('hack it!')
      this.hackReset = false // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
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
    searchMovie () {
      if (this.searchTxt === '') return this.openError('请输入关键字搜索！')

      let params = {keywords: this.searchTxt}
      getMovies(params).then(data => {
        if (data.success) {
          this.$store.commit('updateMovies', data.movies)
          this.$router.push({path: 'movies', query: params})
        } else {
          this.movielist = []
        }
      })
    },
    gotoCate () { this.$store.commit('updateCate', '') },
    login () { window.localStorage.setItem('storage', this.$route.path) },
    register () { window.localStorage.setItem('storage', this.$route.path) },
    logout () {
      this.setCookie('koa:sess', '', -1)
      this.setCookie('koa:sess.sig', '', -1)
      this.setCookie('username', '', -1)
      this.setCookie('username.sig', '', -1)
      this.hack()
      this.username = ''
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
  height: auto !important;
  line-height: 40px;
}
.el-footer {
  line-height: 40px;
}
.username { vertical-align: text-bottom; color: #000; }
.color-fff { color: #fff; }
</style>
