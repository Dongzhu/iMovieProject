<template>
  <div class="container" @click="clickHandle('test click', $event)">
    <!-- <div class="navigate">
      <div class="logo">
        <img src="" alt="">
      </div>
      <div class="search"></div>
    </div> -->

    <!-- <div class="nav" @click="bindViewTap"> -->
    <div class="nav" @click="">
      <!-- <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" /> -->
      <!-- <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div> -->
      <div class="flex-container">
        <div class="flex-item">
          <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
        </div>
        <div class="flex-item">
          <i class="icon_search"></i>
          <input type="text" class="form-control" v-model="serachTxt" placeholder="请输入关键字..." />
        </div>
      </div>
    </div>

    <!-- <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>

    <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
    </form> -->
    <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {
        nickName: 'momo',
        avatarUrl: '../../../static/images/avatar.jpg',
        serachTxt: ''
      }
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}
.userinfo-avatar {
  width: 80rpx;
  height: 80rpx;
  margin: 20rpx;
  border-radius: 50%;
  display: inline-block;
}
.userinfo-nickname {
  color: #aaa;
}
.usermotto {
  margin-top: 150px;
}
.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}
.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}

.nav { display: flex; flex-direction: column; }
.nav_logo { float: left; }
.nav_avatar {
  width: 80rpx;
  height: 80rpx;
  margin: 20rpx 20rpx 20rpx 0;
  border-radius: 50%;
}
.nav_search { float: right; display: inline-block; }
.flex-container {
  display: flex;
  justify-content: center;
}

/* 以下为辅助样式 */

.flex-container{
  /* background-color: #F0f0f0; */
  margin: 20rpx;
}
.flex-container .flex-item{
  /* background-color: #B1FF84; */
}
.flex-container .flex-item:first-child{
  /* background-color: #F5DE25; */
}
.flex-container .flex-item:last-child{
  flex: 1; position: relative;
  margin: 35rpx 0;
  /* background-color: #90D9F7; */
}
.flex-container .flex-item:last-child input{
  border-radius: 40rpx;
}
.icon_search {
  background: url("../../../static/images/icon_search.png") no-repeat scroll 0 0;
  display: inline-block;
  position: absolute;
  top: 15rpx; right: 20rpx;
  width: 30rpx; height: 100%;
}
</style>
