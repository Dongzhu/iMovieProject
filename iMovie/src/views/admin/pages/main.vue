<template>
  <div class="main-admin">
    <sidebar></sidebar>
    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        <div class="info-section">
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="yonghu" />
            </div>
            <div class="card-pannel-right">
              Users
            </div>
          </div>
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="message" />
            </div>
            <div class="card-pannel-right">
              Messages
            </div>
          </div>
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="task" />
            </div>
            <div class="card-pannel-right">
              Tasks
            </div>
          </div>
          <div class="card-pannel">
            <div class="card-pannel-left">
              <icon-svg icon-class="news" />
            </div>
            <div class="card-pannel-right">
              News
            </div>
          </div>
        </div>
        <div class="info-section">
          2222
        </div>
        <div class="info-section">
          3333
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from '../sidebar'
import setting from '../setting'

export default {
  components: { sidebar, setting },
  data () {
    return {
      hackReset: false
    }
  },
  computed: {
    tag () { return this.$store.state.tag }
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
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
