import Vue from 'vue'
import App from './App'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;
Vue.use(BootstrapVue);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  
  
  render: h => h(App)
});
