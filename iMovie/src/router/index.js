import Vue from 'vue'
import Router from 'vue-router'

import index from '@/views/pages/index'
import detail from '@/views/pages/detail'

import login from '@/views/admin/login'
import register from '@/views/admin/register'
import choice1 from '@/views/admin/pages/choice1'
import choice2 from '@/views/admin/pages/choice2'
import choice3 from '@/views/admin/pages/choice3'
import choice4 from '@/views/admin/pages/choice4'
import choice5 from '@/views/admin/pages/choice5'
import choice6 from '@/views/admin/pages/choice6'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // iMovie
    // { path: '/', redirect: '/index' },
    { path: '/', component: index },
    { path: '/index', name: 'index', component: index },
    { path: '/detail/:id', name: 'detail', component: detail },

    // admin
    { path: '/login', name: 'login', component: login },
    { path: '/register', name: 'register', component: register },
    { path: '/admin', name: 'admin', component: choice1, meta: { requireAuth: true } },
    { path: '/choice1', name: 'choice1', component: choice1, meta: { requireAuth: true } },
    { path: '/choice2', name: 'choice2', component: choice2, meta: { requireAuth: true } },
    { path: '/choice3', name: 'choice3', component: choice3, meta: { requireAuth: true } },
    { path: '/choice4', name: 'choice4', component: choice4, meta: { requireAuth: true } },
    { path: '/choice5', name: 'choice5', component: choice5, meta: { requireAuth: true } },
    { path: '/choice6', name: 'choice6', component: choice6, meta: { requireAuth: true } }
  ]
})
