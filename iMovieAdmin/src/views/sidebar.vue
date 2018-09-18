<template>
  <div class="sidebar">
    <el-menu :default-active="tag" class="el-menu-vertical-demo" id="el-menu"
      @open="handleOpen" @close="handleClose"  @select="handdleSelect"
      :collapse="isCollapse" router :collapse-transition="true" mode="vertical" :show-timeout="200"
      :default-openeds="openeds"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF">
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="choice1" @click="checkTag('choice1','选项1')">选项1</el-menu-item>
          <el-menu-item index="choice2" @click="checkTag('choice2','选项2')">选项2</el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      <el-submenu :index="item.index" v-for="item in menulist" :key="item.index" v-if="item.menuitem">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item-group v-for="subitem in item.menuitem" :key="subitem.index">
          <el-menu-item :index="subitem.index" @click="checkTag(subitem.index,subitem.name)">{{subitem.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item :index="item.index" v-for="item in menulist" :key="item.index" v-if="!item.menuitem" @click="checkTag(item.index, item.name)">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // isCollapse: false
      first: true,
      menulist: [
        { index: '1', icon: 'el-icon-location', name: '导航一', menuitem: [ {index: 'choice1', name: '选项1'}, {index: 'choice2', name: '选项2'} ] },
        { index: '2', icon: 'el-icon-menu', name: '导航二', menuitem: [ {index: 'choice3', name: '选项3'}, {index: 'choice4', name: '选项4'} ] },
        { index: 'choice5', icon: 'el-icon-document', name: '导航三' },
        { index: 'choice6', icon: 'el-icon-setting', name: '导航四' }
      ]
    }
  },
  beforeCreate () { if (/(iPhone | Andriod)/i.test(navigator.userAgent)) this.$store.commit('updateSidebar', true) },
  mounted () {
    let h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
    document.querySelector('.sidebar').style.height = h.toString() + 'px'
    let content = document.querySelector('.content')
    if (this.isCollapse) {
      content.style.width = 'calc(100% - 64px)'
    } else {
      content.style.width = 'calc(100% - 200px)'
    }
  },
  computed: {
    isCollapse () { return this.$store.state.isCollapse },
    tag () { return this.$route.path.split('/')[1] },
    openeds () {
      let arr = []
      this.menulist.forEach(item => { arr.push(this.menulist.indexOf(item).toString()) })
      return arr
    }
  },
  methods: {
    checkTag (choice, tag) {
      // console.log(choice, tag)
      this.$store.commit('addTag', {index: choice, value: tag})
      this.$store.commit('updateTag', choice)
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
    min-height: 400px;
  }
</style>
