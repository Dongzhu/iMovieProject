import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
// import main from '@/views/main'
import choice1 from '@/views/pages/choice1'
import choice2 from '@/views/pages/choice2'
import choice3 from '@/views/pages/choice3'
import choice4 from '@/views/pages/choice4'
import choice5 from '@/views/pages/choice5'
import choice6 from '@/views/pages/choice6'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      // name: 'main',
      // component: main
      redirect: '/choice1'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    { path: '/choice1', name: 'choice1', component: choice1 },
    { path: '/choice2', name: 'choice2', component: choice2 },
    { path: '/choice3', name: 'choice3', component: choice3 },
    { path: '/choice4', name: 'choice4', component: choice4 },
    { path: '/choice5', name: 'choice5', component: choice5 },
    { path: '/choice6', name: 'choice6', component: choice6 }
  ]
})
