// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import IconSvg from '@/components/IconSvg' // 引入svg组件

import '@/assets/css/base.css'
import '@/assets/js/iconfont.js'
// import '@/assets/js/cloud.js'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isCollapse: false,
    dynamicTags: [ { index: 'choice1', value: '选项1' } ],
    tag: { index: 'choice1', value: '选项1' }
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
    }
  }
})

Vue.component('icon-svg', IconSvg) // 全局注册icon-svg

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
