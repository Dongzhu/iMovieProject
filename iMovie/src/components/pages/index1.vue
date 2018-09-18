<template>
  <div>
    <div class="bg">
      <Header></Header>

      <el-container>
        <div class="banner">
          <el-carousel :interval="4000" type="card"  @change="showChange">
            <el-carousel-item v-for="(item,index) in bannerlist" :key="index">
              <h3>{{ item.title}}</h3>
              <img :src="item.url" alt="" width="100%" height="100%">
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-container>
    </div>

    <div class="main">
      <el-container>
      <div class="section">
        <div class="section-item">
          <div class="section-header">
            <h4>正在热映
              <span>
                <page style="float:right;"></page>
              </span>
            </h4>
          </div>
          <div class="section-body">
            <div class="card" v-for="(item,index) in releaselist" :key="index" :title="item.name">
              <div class="card-bg">
                <img :src="item.url" :alt="item.name" width="100%" height="100%" class="image">
              </div>
              <!-- <div class="video">
                <video
                  src="http://120.132.18.193:8080/vod/2018/6/29/1530263522730512.mp4"
                  width="100%" height="100%"
                  onMouseOver="this.play()" onMouseOut="this.pause()" :poster="item.url">
                  您的浏览器不支持video标签
                </video>
              </div> -->
              <div class="card-info">
                <span class="over">{{item.name}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.pubdate }}</time>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-item">
          <div class="section-header">
            <h4>最近更新
              <span><span class="active-tag">热门</span><span>最新</span><span>豆瓣高分</span><span>冷门佳片</span><span>华语</span><span>欧美</span><span>韩国</span><span>日本</span></span>
              <span>
                <page showNum='true' style="float:right;"></page>
              </span>
            </h4>
          </div>
          <div class="section-body" v-for="(item0,index0) in list">
            <div class="card" v-for="(item,index) in newlist" :key="index" :title="item.name" v-if="Math.floor(index/6)==index0">
              <div class="card-bg">
                <img :src="item.url" :alt="item.name" width="100%" height="100%" class="image">
              </div>
              <div class="card-info">
                <span class="over">{{item.name}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.pubdate }}</time>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="section-body">
            <div class="card" v-for="(item,index) in newlist" :key="index" :title="item.name">
              <div class="card-bg">
                <img :src="item.url" :alt="item.name" width="100%" height="100%" class="image">
              </div>
              <div class="card-info">
                <span class="over">{{item.name}}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.pubdate }}</time>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="layer">
        <div class="navbar">
          <h4>猜您喜欢{{list}}</h4>
        </div>
        <div class="navbar">
          <h4>口碑榜</h4>
        </div>
      </div>
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

export default {
  components: { Header, Footer, Page },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      bannerlist: [
        {
          title: '伯德小姐',
          url: require('@/assets/images/image1.jpg')
        },
        {
          title: '那片星空',
          url: require('@/assets/images/image2.jpg')
        },
        {
          title: '泰坦尼克号',
          url: require('@/assets/images/image3.jpg')
        },
        {
          title: '权力的游戏',
          url: require('@/assets/images/image4.jpg')
        },
        {
          title: '中国有嘻哈',
          url: require('@/assets/images/image5.jpg')
        }
      ],
      releaselist: [
        {name:'碟中谍6：全面瓦解',pubdate:'2018-08-31',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2529365085.webp'},
        {name:'阿尔法：狼伴归途 Alpha',pubdate:'2018-09-07',url:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2530871439.webp'},
        {name:'蚁人2：黄蜂女现身 Ant-Man',pubdate:'2018-08-24',url:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529389608.webp'},
        {name:'大三儿',pubdate:'2018-08-20',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2530569532.webp'},
        {name:'传奇的诞生',pubdate:'2018-09-07',url:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2531286907.webp'},
        {name:'西虹市首富',pubdate:'2018-07-27',url:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.webp'}
      ],
      newlist: [
        {name:'狄仁杰之四大天王',pubdate:'2018-07-27',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526405034.jpg'},
        {name:'瞒天过海：美人计 Oceans Eight',pubdate:'2018-06-08',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2508259902.jpg'},
        {name:'致所有我曾爱过的男孩 To All the Boys I have Loved Before',pubdate:'2018-08-17',url:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529112058.jpg'},
        {name:'遗传厄运 Hereditary',pubdate:'2018-06-08',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2518865763.jpg'},
        {name:'复仇者联盟3：无限战争 Avengers: Infinity War',pubdate:'2018-05-11',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2517753454.jpg'},
        {name:'燃烧 버닝',pubdate:'2018-05-16',url:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2520095279.jpg'},
        {name:'大象席地而坐',pubdate:'2018-02-16',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2511811355.jpg'},
        {name:'肆式青春 詩季織々',pubdate:'2018-08-04',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526429256.jpg'},
        {name:'奇迹男孩 Wonder',pubdate:'2018-01-19',url:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2507709428.jpg'},
        {name:'行动时刻 Action Point',pubdate:'2018-06-01',url:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2520177065.jpg'}
      ]
    }
  },
  computed:{
    list(){
      let arr = [], index = -1;
      for(let i=0; i<this.newlist.length; i++){
        if((i+1)%6 === 0){
          index++;
          arr.push(index);
        }
      }
      if((this.newlist.length+1)%6 != 0){
        index++;
        arr.push(index);
      }
      return arr;
    }
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
