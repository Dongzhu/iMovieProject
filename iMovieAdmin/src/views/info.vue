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
    tag () {
      return this.$store.state.tag
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
