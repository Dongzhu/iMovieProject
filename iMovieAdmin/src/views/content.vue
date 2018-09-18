<template>
  <div class="content" id="con">
    <setting></setting>
    <vueinfo></vueinfo>
  </div>
</template>

<script>
import setting from './setting'
import vueinfo from './info'

export default {
  components: { setting, vueinfo },
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
