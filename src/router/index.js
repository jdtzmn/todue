import Vue from 'vue'
import Router from 'vue-router'

import Welcome from '@/components/Welcome'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/app',
      name: 'Home',
      component: Home
    }
  ]
})
