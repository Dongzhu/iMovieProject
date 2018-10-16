<template>
  <div>
    <el-header>
      <div class="top">
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
              <input type="text" placeholder="请输入内容">
              <i class="el-icon-search"></i>
            </div>
          </div>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      username: '',
      hackReset: false
    }
  },
  mounted () {
    this.hack()
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
