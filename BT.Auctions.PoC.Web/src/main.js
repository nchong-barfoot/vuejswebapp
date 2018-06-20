import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../components/App.vue'
import Home from '../components/Home.vue'
import Admin from '../components/Admin.vue'
import AdminMedia from '../components/AdminMedia.vue'
import AdminBidding from '../components/AdminBidding.vue'
import Client from '../components/Client.vue'
import ClientMedia from '../components/ClientMedia.vue'
import ClientBidding from '../components/ClientBidding.vue'
import ClockTest from '../components/ClockTest.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/Home', name:'Home', component: Home },
    { path: '/Admin', component: Admin },
    { path: '/Clock', component: ClockTest},
    { path: '/Admin/Media', component: AdminMedia },
    { path: '/Admin/Bidding', component: AdminBidding },
    { path: '/Client', component: Client },
    { path: '/Client/Media', component: ClientMedia },
    { path: '/Client/Bidding', component: ClientBidding }
  ]
})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
