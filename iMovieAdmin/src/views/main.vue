<template>
  <div class="main">
    <sidebar></sidebar>
    <vuecontent></vuecontent>
  </div>
</template>

<script>
import sidebar from './sidebar'
import vuecontent from './content'

export default {
  components: { sidebar, vuecontent },
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
