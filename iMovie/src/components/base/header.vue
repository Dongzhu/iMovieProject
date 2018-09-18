<template>
  <div>
    <el-header>
      <div class="top">
        <div class="top-left">
          <a href="/">BRAND</a>
        </div>
        <div class="top-right">
          <img src="../../assets/images/avatar.jpg" alt="">
        </div>
        <div class="top-bottom">
          <div class="">
            <div class="top-left">
              <ul>
                <li><a href="/">首页</a></li>
                <li><a href="#">国产电影</a></li>
                <li><a href="#">国外电影</a></li>
                <li><a href="#">排行榜</a></li>
                <li><a href="#">分类</a></li>
              </ul>
            </div>
            <div class="top-right search-box">
              <input type="text" placeholder="请输入内容">
              <i class="el-icon-search"></i>
            </div>
          </div>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted(){
      let route = this.$route.path;
      if(route.indexOf('index')>-1 || route.length===1){
        document.querySelector('.top').style.color = '#fff';
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
  height: auto !important;
  line-height: 40px;
}
.el-footer {
  line-height: 40px;
}
</style>
