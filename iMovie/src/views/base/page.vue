<template>
  <div class="pagenator">
    <span class="not-allowed">&lt;</span>
    <ul v-if="showNum==='true'">
      <li class="active">1</li>
      <li>2</li>
      <li>3</li>
    </ul>
    <span>&gt;</span>
  </div>
</template>

<script>
export default {
  props: [
    'showNum'
  ],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    // console.log(this.showNum)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pagenator { padding: 0 10px; display: inline-block; font-weight: normal; cursor: pointer; }
  .pagenator span { display: inline; }
  .pagenator span:nth-child(1) { padding-right: 5px; }
  .pagenator span,ul { display: inline-block; }
  .pagenator ul li { display: inline-block; padding-right: 5px; color: #333; }
  .pagenator ul li:hover { color: #409EFF; }
  .active { color: #409EFF !important; }
  .not-allowed { color: #c0c4cc; cursor: not-allowed; }
</style>
