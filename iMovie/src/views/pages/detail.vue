<template>
  <div>
    <Header></Header>

    <div class="main detail">
      <el-container>
        <div class="section" v-if="itemInfo">
          <div class="section-header">
            <h4>{{itemInfo.title || ''}}</h4>
          </div>
          <div class="section-body">
            <div class="section-info">
              <div class="section-info1">
                <img :src="itemInfo.poster || ''" :alt="itemInfo.title || ''" width="100%">
              </div>
              <div class="section-info2">
                <p>导演：<span v-for="(item,index) in itemInfo.director || ''" :key="index">{{item}} </span></p>
                <p>主演：<span v-for="(item,index) in itemInfo.cast || ''" :key="index"><span v-if="index !== 0"> / </span>{{item}}</span></p>
                <p>语言：<span v-for="(item,index) in itemInfo.language || ''" :key="index">{{item}} </span></p>
                <p>时长：<span v-for="(item,index) in itemInfo.movie_duration || ''" :key="index">{{item}} </span></p>
                <p>类型：<span v-for="(item,index) in itemInfo.movie_type || ''" :key="index">{{item}} </span></p>
                <p>地区：<span v-for="(item,index) in itemInfo.country || ''" :key="index">{{item}} </span></p>
                <p>上映日期：<span v-for="(item,index) in itemInfo.pubdate || ''" :key="index">{{item}} </span></p>
                <p>年份：{{itemInfo.year || ''}}</p>
                <p>评分：
                  <el-rate
                    v-model="itemInfo.rate"
                    disabled
                    text-color="#ff9900">
                  </el-rate>
                  <span>{{itemInfo.rate*2}}</span>
                </p>
                <p>剧情简介：{{itemInfo.summary || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section" v-else><p>暂无数据</p></div>

        <Sidebar></Sidebar>
      </el-container>
    </div>
    <div class="clearfix"></div>

    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../base/header'
import Footer from '../base/foot'
import Page from '../base/page'
import Sidebar from '../base/sidebar'

import { getMovie } from '@/api/views/movies'

export default {
  components: { Header, Footer, Page, Sidebar },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      rate: 8.6,
      itemInfo: {
        // id: 1,
        // name: '碟中谍6：全面瓦解',
        // director: '克里斯托弗·麦奎里',
        // rate: 8.3,
        // actor: ['汤姆·克鲁斯', '亨利·卡维尔', '文·瑞姆斯', '西蒙·佩吉', '丽贝卡·弗格森'],
        // type: ['动作', '惊悚', '冒险'],
        // area: ['美国'],
        // language: ['英语', '法语'],
        // duration: 147,
        // pubdate: '2018-08-31',
        // url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2529365085.webp'
      },
      bestlist: [
        {name: '碟中谍6：全面瓦解', rate: 4.8, pubdate: '2018-08-31', url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2529365085.webp'},
        {name: '阿尔法：狼伴归途 Alpha', rate: 3.8, pubdate: '2018-09-07', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2530871439.webp'},
        {name: '蚁人2：黄蜂女现身 Ant-Man', rate: 3.7, pubdate: '2018-08-24', url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529389608.webp'},
        {name: '大三儿', pubdate: '2018-08-20', rate: 4.5, url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2530569532.webp'},
        {name: '传奇的诞生', pubdate: '2018-09-07', rate: 3.5, url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2531286907.webp'},
        {name: '西虹市首富', pubdate: '2018-07-27', rate: 2.8, url: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.webp'}
      ]
    }
  },
  mounted () {
    let doubanId = this.$route.path.split('detail/')[1]
    getMovie(doubanId).then(data => {
      if (data.success) {
        this.itemInfo = data.movie
        this.itemInfo.rate = this.itemInfo.rate / 2
      } else {
        console.log('Error')
      }
    })
  },
  methods: {
    showChange (index) {
      // console.log(index)
      document.querySelector('.bg').style.backgroundImage = 'url(' + this.bannerlist[index].url + ')'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 50px;
    margin: 0;
    width: 100%;
    position: fixed; bottom: 0;
    background-color: #333;
    color: #fff;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .is-active { width:70%; margin-left: -10%; }
</style>
