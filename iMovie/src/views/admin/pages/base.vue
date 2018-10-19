<template>
  <div class="main-admin">
    <sidebar></sidebar>

    <div class="content" v-if="hackReset">
      <setting></setting>
      <div class="info">
        {{tag}}
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
    isCollapse () { return this.$store.state.isCollapse },
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
/* @media screen and (max-width: 770px) { .content { width: calc(100% - 64px); margin-left: 64px; } }
@media screen and (min-width: 771px) { .content { width: calc(100% - 200px); margin-left: 200px; } } */
</style>
