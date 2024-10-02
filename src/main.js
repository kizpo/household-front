import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
import store from './store'


// BootstrapVueをプロジェクト全体で利用できるようにする
Vue.use(BootstrapVue)

// BootstrapVueアイコンコンポーネントプラグインの使用
Vue.use(IconsPlugin)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

