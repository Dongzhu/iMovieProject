import Vue from 'vue'
import Router from 'vue-router'

import index from '@/views/pages/index'
import detail from '@/views/pages/detail'
import movies from '@/views/pages/movies'
import category from '@/views/pages/category'

import login from '@/views/admin/login'
import register from '@/views/admin/register'
import main from '@/views/admin/pages/main'
import document from '@/views/admin/pages/document'
import usercenter from '@/views/admin/pages/users'
import moviecenter from '@/views/admin/pages/movies'
import choice3 from '@/views/admin/pages/choice3'
import choice4 from '@/views/admin/pages/choice4'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // iMovie
    // { path: '/', redirect: '/index' },
    { path: '/', component: index },
    { path: '/index', name: 'index', component: index },
    { path: '/detail/:id', name: 'detail', component: detail },
    { path: '/movies', name: 'movies', component: movies },
    { path: '/categories', name: 'categories', component: category },
    { path: '/category/:id', name: 'category', component: category },

    // admin
    { path: '/login', name: 'login', component: login },
    { path: '/register', name: 'register', component: register },
    { path: '/admin', name: 'admin', component: main, meta: { requireAuth: true } },
    { path: '/main', name: 'main', component: main, meta: { requireAuth: true } },
    { path: '/document', name: 'document', component: document, meta: { requireAuth: true } },
    { path: '/usercenter', name: 'usercenter', component: usercenter, meta: { requireAuth: true } },
    { path: '/moviecenter', name: 'moviecenter', component: moviecenter, meta: { requireAuth: true } },
    { path: '/choice3', name: 'choice3', component: choice3, meta: { requireAuth: true } },
    { path: '/choice4', name: 'choice4', component: choice4, meta: { requireAuth: true } }
  ]
})
