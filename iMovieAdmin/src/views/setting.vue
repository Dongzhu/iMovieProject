<template>
  <div class="setting">
    <div class="top-info">
      <div class="top-info-1" @click="toggle">
        <icon-svg icon-class="liebiao" />
      </div>
      <div class="top-info-2">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">{{tag.value}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="top-bread">
      <el-tag
        :key="tag.value"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        <span @click="viewTag(tag)">{{tag.value}}</span>
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // dynamicTags: ['标签一', '标签二', '标签三']
    }
  },
  computed: {
    isCollapse () { return this.$store.state.isCollapse },
    dynamicTags () { return this.$store.state.dynamicTags },
    tag () { return this.$store.state.tag }
  },
  mounted () {
    let topinfo = document.querySelector('.top-info-1')
    if (this.isCollapse) {
      topinfo.style.transform = 'rotate(90deg)'
    } else {
      topinfo.style.transform = 'rotate(0deg)'
    }
  },
  methods: {
    handleClose (tag) {
      console.log(this.dynamicTags)
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      if (this.dynamicTags.length !== 0) {
        this.$router.push(this.dynamicTags[this.dynamicTags.length - 1].index)
        this.$store.commit('updateTag', this.dynamicTags[this.dynamicTags.length - 1].index)
      }
    },
    toggle () {
      let topinfo = document.querySelector('.top-info-1')
      let content = document.querySelector('.content')
      if (this.isCollapse) {
        topinfo.style.transform = 'rotate(0deg)'
        this.$store.commit('updateSidebar', false)
        setTimeout(function () {
          content.style.width = 'calc(100% - 200px)'
        }, 15)
      } else {
        topinfo.style.transform = 'rotate(90deg)'
        this.$store.commit('updateSidebar', true)
        setTimeout(function () {
          content.style.width = 'calc(100% - 64px)'
        }, 50)
      }
      this.rotate = !this.rotate
    },
    viewTag (tag) {
      this.$router.push(tag.index)
      this.$store.commit('updateTag', {index: tag.index, value: tag.value})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-info {
  height: 50px; line-height: 50px; padding: 0 10px;
  border-bottom: solid 1px rgb(84, 92, 100, .3);
}
.top-bread {
  min-height: 30px;
  padding: 5px 10px; cursor: pointer;
  box-shadow: 0 5px 5px rgba(0,0,0,.1);
  overflow: auto;
}
.top-info-1, .top-info-2 { display: inline-block; }
.top-info-2 { margin-left: 5px; }
.top-info-1 {
  /* transform:rotate(0deg);  */
  transition:transform .3s linear; cursor: pointer; }
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
