// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import JsonView from 'jsonview-vue';

import '@/style/index.less'
// import './assets/webix/webix'
// import './assets/webix/webix.css'
//
// import './assets/webix/querybuilder/querybuilder'
// import './assets/webix/querybuilder/querybuilder.css'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(JsonView);
// const webix = require('webix')
// webix.ready(function() {

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
// })
/* eslint-disable no-new */

