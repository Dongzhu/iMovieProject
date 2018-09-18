<template>
  <div class="info">
    {{tag}}
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  computed: {
    isCollapse () { return this.$store.state.isCollapse },
    tag () { return this.$store.state.tag }
  },
  mounted () {
    let content = document.querySelector('.content')
    if (this.isCollapse) {
      content.style.width = 'calc(100% - 64px)'
    } else {
      content.style.width = 'calc(100% - 200px)'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
