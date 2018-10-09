<template>
  <div class="setting">
    <div class="top-info">
      <div class="top-info-1" @click="toggle">
        <icon-svg icon-class="liebiao" />
      </div>
      <div class="top-info-2">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">{{tag.value}}</el-breadcrumb-item>
        </el-breadcrumb>
        <span class="logout" @click="logout">退出</span>
      </div>
    </div>
    <div class="top-bread">
      <el-tag
        :key="tag.value"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
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
    }
  },
  computed: {
    isCollapse () { return this.$store.state.isCollapse },
    dynamicTags () { return this.$store.state.dynamicTags },
    tag () { return this.$store.state.tag }
  },
  mounted () {
    let topinfo = document.querySelector('.top-info-1')
    if (this.isCollapse) {
      topinfo.style.transform = 'rotate(90deg)'
    } else {
      topinfo.style.transform = 'rotate(0deg)'
    }
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
      if (this.isCollapse) {
        topinfo.style.transform = 'rotate(0deg)'
        this.$store.commit('updateSidebar', false)
        setTimeout(function () {
          content.style.width = 'calc(100% - 200px)'
        }, 15)
      } else {
        topinfo.style.transform = 'rotate(90deg)'
        this.$store.commit('updateSidebar', true)
        setTimeout(function () {
          content.style.width = 'calc(100% - 64px)'
        }, 50)
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
      this.$router.push('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
