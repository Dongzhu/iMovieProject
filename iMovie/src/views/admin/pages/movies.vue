<template>
  <div class="main-admin">
    <sidebar></sidebar>
    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        <div class="info-section">
          <div class="card card-admin" v-for="(item,index) in movielist" :key="index">
            <div class="card-bg" :title="item.title+' '+item.rate">
              <a :href="'/detail/'+item.id"><img :src="item.poster" :alt="item.title" width="100%" height="100%" class="image"></a>
              <span class="card-rate">{{ item.rate }}</span>
            </div>
            <!-- <div class="video">
              <video
                src="http://120.132.18.193:8080/vod/2018/6/29/1530263522730512.mp4"
                width="100%" height="100%"
                onMouseOver="this.play()" onMouseOut="this.pause()" :poster="item.url">
                您的浏览器不支持video标签
              </video>
            </div> -->
            <div class="card-info">
              <p class="over"><a :href="'/detail/'+item.id">{{item.title}}</a></p>
              <p class="bottom clearfix">
                <time class="time"><a :href="'/detail/'+item.id">{{ item.year }}</a></time>
              </p>
              <p>
                <el-button type="text" class="button">置顶</el-button>
                <el-button type="text" class="button">编辑</el-button>
                <el-button type="text" class="button">删除</el-button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

import { getMovies } from '@/api/views/movies'

export default {
  components: { sidebar, setting },
  data () {
    return {
      hackReset: false,
      movielist: []
    }
  },
  computed: {
    tag () { return this.$store.state.tag },
    isMobile () { return this.$store.state.isMobile },
    isCollapse () { return this.$store.state.isCollapse }
  },
  mounted () {
    this.hackReset = true
    this.$nextTick(() => {
      let content = document.querySelector('.content')
      if (this.isCollapse) {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 36px)'
      } else {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 200px)'
      }

      getMovies({}).then(res => {
        if (res.success) {
          this.movielist = res.data.movies
        } else {
          this.openError(res.message)
        }
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
