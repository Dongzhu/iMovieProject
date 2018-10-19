<template>
  <div>
    <div class="mobile-warp" v-if="!isCollapse && isMobile" @click="closesidebar"></div>
    <div :class="['sidebar', { 'isCollapse': isCollapse }]" v-if="(!isCollapse || !isMobile) && hackReset">
      <el-menu :default-active="tag" class="el-menu-vertical-demo" id="el-menu"
        @open="handleOpen" @close="handleClose"
        :collapse="isCollapse" router :collapse-transition="true" mode="vertical" :show-timeout="200"
        :default-openeds="openeds"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF">
        <div class="item" v-for="item in menulist" :key="item.index">
          <el-submenu :index="item.index" v-if="item.menuitem">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <el-menu-item-group v-for="subitem in item.menuitem" :key="subitem.index">
              <el-menu-item :index="subitem.index" @click="checkTag(subitem.index,subitem.name)">{{subitem.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item :index="item.index" v-if="!item.menuitem" @click="checkTag(item.index, item.name)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // isCollapse: false
      hackReset: false,
      menulist: [
        { index: 'main', icon: 'el-icon-document', name: '概览' },
        { index: 'document', icon: 'el-icon-menu', name: 'API接口' },
        { index: 'business', icon: 'el-icon-location', name: '业务中心', menuitem: [ {index: 'usercenter', name: '用户中心'}, {index: 'moviecenter', name: '影视中心'} ] },
        { index: 'setting', icon: 'el-icon-setting', name: '设置中心', menuitem: [ {index: 'choice3', name: '选项3'}, {index: 'choice4', name: '选项4'} ] }
      ],
      fullWidth: document.documentElement.clientWidth
    }
  },
  beforeCreate () { if (document.documentElement.clientWidth <= 600) this.$store.commit('updateSidebar', true) },
  mounted () {
    let h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
    let sidebar = document.querySelector('.sidebar')
    if (sidebar) sidebar.style.height = h.toString() + 'px'
    if (document.documentElement.clientWidth <= 600) this.$store.commit('updateMobile', true)

    this.hackReset = true
    this.$nextTick(() => {
      let content = document.querySelector('.content')
      if (this.isCollapse) {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 36px)'
      } else {
        if (content && !this.isMobile) content.style.width = 'calc(100% - 200px)'
      }
    })

    window.addEventListener('resize', this.handleResize)
    this.hack()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    isCollapse () { return this.$store.state.isCollapse },
    tag () { return this.$route.path.split('/')[1] },
    openeds () {
      let arr = []
      let that = this
      that.menulist.forEach(item => { arr.push(that.menulist.indexOf(item).toString()) })
      return arr
    },
    isMobile () { return this.$store.state.isMobile }
  },
  methods: {
    hack () {
      // console.log('hack it!')
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    closesidebar () {
      this.$store.commit('updateSidebar', true)
    },
    handleResize (event) {
      this.fullWidth = document.documentElement.clientWidth
      let content = document.querySelector('.content')
      if (this.fullWidth <= 600) {
        this.$store.commit('updateSidebar', true)
        this.$store.commit('updateMobile', true)
        content.style.width = '100%'
      } else {
        this.$store.commit('updateSidebar', false)
        this.$store.commit('updateMobile', false)
        content.style.width = 'calc(100% - 200px)'
      }
      this.hack()
    },
    checkTag (choice, tag) {
      // console.log(choice, tag)
      this.$store.commit('addTag', {index: choice, value: tag})
      this.$store.commit('updateTag', {index: choice, value: tag})
    },
    handleOpen (key, keyPath) { console.log(key, keyPath) },
    handleClose (key, keyPath) { console.log(key, keyPath) }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
  }
</style>
