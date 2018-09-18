<template>
  <div class="">
    <svg class="svg-icon" aria-hidden="true">
      <use :xlink:href="iconName"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'icon-svg',
  props: {
    iconClass: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  font-size: 1.3em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
