<template>
  <div>
    <div class="top">
      <el-header>
        <div class="top-left">
          <div class="brand"><a href="/">BRAND</a></div>
          <div class="nav">
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="#">排行榜</a></li>
              <li><router-link :to="{ name: 'movies'}">分类</router-link></li>
              <li><a href="#">关于</a></li>
            </ul>
          </div>
        </div>
        <div class="top-right" v-if="hackReset">
          <div class="search-box" v-if="!isMobile">
            <input v-model="searchTxt" type="text" placeholder="请输入内容" @keyup.enter="searchMovie">
            <i class="el-icon-search" @click="searchMovie"></i>
          </div>
          <div :class="['userinfo', {'userinfoMobile': isMobile}]">
            <span v-if="username !== ''">
              <span class="username" v-if="!isMobile">{{ username }}</span>
              <span class="userimg"><img src="../../assets/images/avatar.jpg" alt=""></span>
            </span>
            <span class="username" v-if="username === ''">
              <a href="/login" @click="login">登录</a> /
              <a href="/register" @click="register">注册</a>
            </span>
            <div :class="['top-right-info', {'top-right-infoMobile': isMobile}]" v-if="username !== ''">
              <ul>
                <li>我的资料</li>
                <li>我的收藏</li>
                <li @click="logout">退出</li>
              </ul>
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
      bg: {
        backgroundImage: 'url(' + require('@/assets/images/bg.jpg') + ')',
        backgroundRepeat: 'round'
      },
      bg2: {
        backgroundImage: 'none'
      },
      username: '',
      searchTxt: '',
      hackReset: false
    }
  },
  mounted () {
    this.hack()
    this.searchTxt = this.$route.query.keywords
    this.username = this.getCookie('username')

    window.addEventListener('resize', this.handleResize)

    this.fullWidth = document.documentElement.clientWidth
    if (this.fullWidth <= 600) {
      this.$store.commit('updateMobile', true)
    } else {
      this.$store.commit('updateMobile', false)
    }

    // let route = this.$route.path
    // let top = document.querySelector('.top')
    // top.style.backgroundRepeat = 'round'
    // if (route.indexOf('index') > -1 || route.length === 1) {
    //   if (top) {
    //     top.style.color = '#fff'
    //   }
    // } else {
    //   top.style.backgroundImage = 'url(' + require('@/assets/images/bg.jpg') + ')'
    //   top.style.backgroundRepeat = 'round'
    // }
  },
  computed: { isMobile () { return this.$store.state.isMobile } },
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
    handleResize (event) {
      this.fullWidth = document.documentElement.clientWidth
      if (this.fullWidth <= 600) {
        this.$store.commit('updateMobile', true)
      } else {
        this.$store.commit('updateMobile', false)
      }
    },
    searchMovie () {
      if (this.searchTxt === '') return this.openError('请输入关键字搜索！')

      let params = {keywords: this.searchTxt}
      getMovies(params).then(res => {
        if (res.success) {
          this.$store.commit('updateMovies', res.data.movies)
          this.$router.push({path: '/movies', query: params})
        } else {
          this.movielist = []
        }
      })
    },
    login () { window.localStorage.setItem('storage', this.$route.path) },
    register () { window.localStorage.setItem('storage', this.$route.path) },
    logout () {
      this.setCookie('koa:sess', '', -1)
      this.setCookie('koa:sess.sig', '', -1)
      this.setCookie('username', '', -1)
      this.setCookie('username.sig', '', -1)
      this.hack()
      this.username = ''
      const page = window.localStorage.getItem('storage')
      if (page) {
        this.$router.push(page)
      } else {
        this.$router.push('/')
      }
      window.localStorage.setItem('storage', '')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header { }
.el-footer { line-height: 50px; }
.username { vertical-align: text-bottom; }
.color-fff { color: #fff; }
</style>
