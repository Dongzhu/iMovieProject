<template>
  <div class="main-admin">
    <sidebar></sidebar>
    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        <div class="info-section info-users">
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="yonghu" />
            </div>
            <div class="card-pannel-right">
              <div>
                <span>Users</span>
                <span>2333</span>
              </div>
            </div>
          </div>
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="message" />
            </div>
            <div class="card-pannel-right">
              <div>
                <span>Messages</span>
                <span>2333</span>
              </div>
            </div>
          </div>
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="task" />
            </div>
            <div class="card-pannel-right">
              <div>
                <span>Tasks</span>
                <span>2333</span>
              </div>
            </div>
          </div>
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="news" />
            </div>
            <div class="card-pannel-right">
              <div>
                <span>News</span>
                <span>2333</span>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="info-section">
          <div id="ChartOne"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

import { getCategories } from '@/api/views/movies'

export default {
  components: { sidebar, setting },
  data () {
    return {
      hackReset: false,
      categories: []
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

      getCategories({}).then(res => {
        if (res.success) {
          this.categories = res.data.categories
          this.drawLine()
        } else {
          this.openError(res.message)
        }
      })
    })
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
    drawLine () {
      let data1 = []
      let data2 = []
      this.categories.forEach(item => {
        if (item.movies && item.movies.length > 5) {
          data1.push(item.name)
          data2.push(item.movies.length)
        }
      })
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('ChartOne'))
      // 绘制图表
      myChart.setOption({
        title: { text: '电影数目分类表' },
        tooltip: {},
        xAxis: {
          data: data1
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          data: data2
        }]
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
