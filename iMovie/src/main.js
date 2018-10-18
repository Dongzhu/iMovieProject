// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

import JsEncrypt from 'jsencrypt'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import IconSvg from '@/components/IconSvg' // 引入svg组件

import '@/assets/css/base.css'
import '@/assets/js/iconfont.js'
// import '@/assets/js/cloud.js'

Vue.config.productionTip = false
Vue.prototype.$jsEncrypt = JsEncrypt
Vue.use(ElementUI)

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isCollapse: false,
    dynamicTags: [ { index: 'choice1', value: '选项1' } ],
    tag: { index: 'choice1', value: '选项1' },
    movielist: []
  },
  mutations: {
    updateSidebar (state, flag) { state.isCollapse = flag },
    addTag (state, tag) {
      if (JSON.stringify(state.dynamicTags).indexOf('"index":"' + tag.index + '",') < 0) {
        state.dynamicTags.push({index: tag.index, value: tag.value})
      }
    },
    updateTag (state, tag) {
      state.tag.index = tag.index
      state.tag.value = tag.value
    },
    updateMovies (state, movies) { state.movielist = movies }
  }
})

Vue.component('icon-svg', IconSvg) // 全局注册icon-svg

// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  // 获取store里面的token
  let token = document.cookie
  // 判断要去的路由有没有requiresAuth
  if (to.meta.requireAuth) {
    if (token.indexOf('koa:sess') > -1) {
      next()
    } else {
      next({ path: '/login' })
      // next({ path: '/login', query: { redirect: to.fullPath.split('/')[1] } })
    }
  } else {
    next() // 如果无需token,那么随它去吧
  }
})

// 设置cookie,放在main.js
Vue.prototype.setCookie = function (cName, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

// 获取cookie
Vue.prototype.getCookie = function (cName) {
  if (document.cookie.length > 0) {
    var cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      var cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
