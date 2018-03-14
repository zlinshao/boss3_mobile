
import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router'
import axios from 'axios'

Vue.use(Boss);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.baseURL = globalConfig.server;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Env'] = globalConfig.env;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
