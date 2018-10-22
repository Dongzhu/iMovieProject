<template>
  <div class="layer" v-show="hackReset">
    <div class="navbar">
      <h4>猜您喜欢</h4>
      <div id="tagscloud">
        <a href="" class="tagc1">碟中谍6：全面瓦解</a>
        <a href="" class="tagc2">碟中谍6：全面瓦解</a>
        <a href="" class="tagc3">碟中谍6：全面瓦解</a>
        <a href="" class="tagc1">碟中谍6：全面瓦解</a>
        <a href="" class="tagc2">碟中谍6：全面瓦解</a>
        <a href="" class="tagc3">碟中谍6：全面瓦解</a>
        <a href="" class="tagc1">碟中谍6：全面瓦解</a>
        <a href="" class="tagc2">碟中谍6：全面瓦解</a>
        <a href="" class="tagc3">碟中谍6：全面瓦解</a>
      </div>
    </div>
    <div class="navbar cate">
      <h4>标签<span class="more" @click="gotoCate('categories')">更多</span></h4>
      <div class="navbar-tag">
        <span v-for="(item,index) in catelist" :key="index" class="tagspan" @click="gotoCate(item)">
          <router-link :to="{ name: 'category', params: { id: item._id }}">{{item.name}} {{item.movies.length}}</router-link>
        </span>
      </div>
    </div>
    <div class="navbar best">
      <h4>口碑榜</h4>
      <ul>
        <li v-for="(item,index) in bestlist" :key="index"><a href="" class="over">{{index+1}} {{item.name}}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import '@/assets/js/cloud.js'
import { getCategories } from '@/api/views/movies'

export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      bestlist: [
        {name: '碟中谍6：全面瓦解', rate: 4.8, pubdate: '2018-08-31', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2529365085.webp'},
        {name: '阿尔法：狼伴归途 Alpha', rate: 3.8, pubdate: '2018-09-07', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2530871439.webp'},
        {name: '蚁人2：黄蜂女现身 Ant-Man', rate: 3.7, pubdate: '2018-08-24', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529389608.webp'},
        {name: '大三儿', pubdate: '2018-08-20', rate: 4.5, url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2530569532.webp'},
        {name: '传奇的诞生', pubdate: '2018-09-07', rate: 3.5, url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2531286907.webp'},
        {name: '西虹市首富', pubdate: '2018-07-27', rate: 2.8, url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.webp'}
      ],
      categories: [],
      hackReset: false
    }
  },
  mounted () {
    getCategories().then(res => {
      if (res.success) {
        this.categories = res.data.categories
      } else {
        this.categories = []
      }
    })
    this.hack()
  },
  computed: {
    catelist () {
      let templist = this.categories
      return templist.sort(this.sortLen).slice(0, 10)
    }
  },
  methods: {
    hack () {
      // console.log('hack it!')
      this.hackReset = false // hack方法强制刷新组件
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    sortLen (a, b) {
      return b.movies.length - a.movies.length
    },
    gotoCate (item) {
      if (item === 'categories') {
        this.$router.push('/categories')
      } else {
        window.localStorage.setItem('storage', item.name)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
