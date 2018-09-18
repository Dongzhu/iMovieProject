import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/pages/index'
import detail from '@/components/pages/detail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: detail
    }
  ]
})
