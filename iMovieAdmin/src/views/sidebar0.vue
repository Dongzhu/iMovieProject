<template>
  <div class="sidebar">
    <el-menu default-active="choice1" class="el-menu-vertical-demo" id="el-menu"
      @open="handleOpen" @close="handleClose" @select="handdleSelect"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item-group>
          <span slot="title">分组一</span>
          <el-menu-item index="choice1" @click="checkTag('choice1','选项1')">选项1</el-menu-item>
          <el-menu-item index="choice2" @click="checkTag('choice2','选项2')">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="choice3" @click="checkTag('choice3','选项3')">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="choice4">
          <span slot="title" @click="checkTag('choice4','选项4')">选项4</span>
          <el-menu-item index="choice4-1" @click="checkTag('choice4-1','选项4-1')">选项4-1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // isCollapse: false
    }
  },
  mounted () {
    let h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
    document.querySelector('.sidebar').style.height = h.toString() + 'px'
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    }
  },
  methods: {
    checkTag (choice, tag) {
      this.$store.commit('addTag', {index: choice, value: tag})
      this.$store.commit('updateTag', choice)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handdleSelect (key, keyPath) {
      console.log(key, keyPath)
      let topinfo = document.querySelector('.top-info-1')
      let content = document.querySelector('.content')
      // console.log(content.style)
      if (/(iPhone | Andriod)/i.test(navigator.userAgent)) {
        if (this.isCollapse) {
          topinfo.style.transform = 'rotate(0deg)'
          this.$store.commit('updateSidebar', false)
          setTimeout(function () {
            content.style.width = 'calc(100% - 200px)'
            content.style.marginLeft = '200px'
          }, 15)
        } else {
          topinfo.style.transform = 'rotate(90deg)'
          this.$store.commit('updateSidebar', true)
          setTimeout(function () {
            content.style.width = 'calc(100% - 64px)'
            content.style.marginLeft = '64px'
          }, 50)
        }
      }
      this.$router.push(key)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
