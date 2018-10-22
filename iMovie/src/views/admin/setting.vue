<template>
  <div class="setting">
    <div class="top-info">
      <div class="top-info-1" @click="toggle">
        <icon-svg icon-class="liebiao" />
      </div>
      <div class="top-info-2">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{tag.value}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="avatar" v-if="username !== ''">
          <span><img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" height="100%" alt=""></span>
          <span>{{username}}</span>
          <span class="logout" @click="logout">退出</span>
        </div>
      </div>
    </div>
    <div class="top-bread">
      <el-tag
        :key="tag.value"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="true"
        @close="handleClose(tag)">
        <span @click="viewTag(tag)">{{tag.value}}</span>
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // dynamicTags: ['标签一', '标签二', '标签三']
      username: ''
    }
  },
  computed: {
    isCollapse () { return this.$store.state.isCollapse },
    dynamicTags () { return this.$store.state.dynamicTags },
    tag () { return this.$store.state.tag },
    isMobile () { return this.$store.state.isMobile }
  },
  mounted () {
    let topinfo = document.querySelector('.top-info-1')
    if (this.isCollapse) {
      topinfo.style.transform = 'rotate(90deg)'
    } else {
      topinfo.style.transform = 'rotate(0deg)'
    }
    this.username = this.getCookie('username')
  },
  methods: {
    handleClose (tag) {
      console.log(this.dynamicTags)
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      if (this.dynamicTags.length !== 0) {
        this.$router.push(this.dynamicTags[this.dynamicTags.length - 1].index)
        let last = this.dynamicTags[this.dynamicTags.length - 1]
        this.$store.commit('updateTag', {index: last.index, value: last.value})
      }
    },
    toggle () {
      let topinfo = document.querySelector('.top-info-1')
      let content = document.querySelector('.content')
      let elmenuitem = document.querySelector('.el-menu-item')
      if (this.isCollapse) {
        topinfo.style.transform = 'rotate(0deg)'
        this.$store.commit('updateSidebar', false)
        if (!this.isMobile) {
          setTimeout(function () {
            content.style.width = 'calc(100% - 200px)'
            elmenuitem.style.padding = '0 20px'
          }, 15)
        }
      } else {
        topinfo.style.transform = 'rotate(90deg)'
        this.$store.commit('updateSidebar', true)
        if (!this.isMobile) {
          setTimeout(function () {
            content.style.width = 'calc(100% - 36px)'
            elmenuitem.style.padding = '0 10px !important'
          }, 50)
        }
      }
      this.rotate = !this.rotate
    },
    viewTag (tag) {
      this.$router.push(tag.index)
      this.$store.commit('updateTag', {index: tag.index, value: tag.value})
    },
    logout () {
      this.setCookie('koa:sess', '', -1)
      this.setCookie('koa:sess.sig', '', -1)
      this.setCookie('username', '', -1)
      this.setCookie('username.sig', '', -1)
      this.$router.push('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
