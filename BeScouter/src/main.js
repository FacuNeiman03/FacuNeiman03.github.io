import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import {router} from './router'
import store from './stores/index'
import "./assets/main.css";
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import jQuery from 'jquery'
import 'popper.js'
Vue.prototype.$jQuery = jQuery
Vue.prototype.$ = jQuery

import { PiniaVuePlugin, createPinia } from "pinia";

Vue.use(PiniaVuePlugin);
const pinia = createPinia();
Vue.use(VueRouter);

const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn) {
  store.dispatch('updateLoginStatus', isLoggedIn === 'true'); // Actualiza el estado de inicio de sesión en Vuex
}

new Vue({
  router,
  pinia,
  store,
  render: (h) => h(App),
}).$mount("#app");
