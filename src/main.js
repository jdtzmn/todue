// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'

import axios from 'axios'
import * as Cookies from 'js-cookie'

// setup elementUI and vue-awesome for icons
Vue.use(ElementUI, { locale })
Vue.component('icon', Icon)

// add axios and js-cookie dependencies through the Vue object
Object.defineProperty(Vue.prototype, '$axios', { value: axios })
Object.defineProperty(Vue.prototype, '$cookies', {value: Cookies})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
