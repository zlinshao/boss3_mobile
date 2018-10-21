import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router/index.js'
import axios from 'axios'
import VueRouter from 'vue-router'
import Fun from './fun.config.js'
import '@/assets/js/api.js'
import 'vue2-editor/node_modules/quill/dist/quill.bubble.css'

import {
  Cell,
  CellGroup,
  Icon,
  DatetimePicker,
  PasswordInput,
  NumberKeyboard,
  Row,
  Col,
  Badge,
  Button,
  Loading,
  NavBar,
  Panel,
  Stepper,
  Step,
  Steps,
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Tabbar,
  TabbarItem,
  Tag,
  Checkbox,
  CheckboxGroup,
  Field,
  RadioGroup,
  Radio,
  Search,
  Switch,
  Uploader,
  Actionsheet,
  Dialog,
  Picker,
  PullRefresh,
  CellSwipe,
  Popup,
  SwitchCell,
  AddressList
} from 'vant';

Vue.use(Row).use(Col).use(Cell).use(RadioGroup).use(CellGroup).use(Icon).use(DatetimePicker).use(PasswordInput).use(NumberKeyboard).use(Badge).use(Button).use(Loading).use(NavBar).use(Panel).use(Stepper).use(Step).use(Steps).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Tag).use(Checkbox).use(CheckboxGroup).use(Field).use(Radio).use(Search).use(Switch).use(Uploader).use(Actionsheet).use(Dialog).use(PullRefresh).use(CellSwipe).use(SwitchCell).use(Picker).use(Popup).use(AddressList);
Vue.use(require('vue-wechat-title'));

Vue.use(VueRouter);
Vue.use(Boss);
Vue.use(Fun);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Env'] = globalConfig.env;
axios.defaults.headers = globalConfig.header;
Vue.config.productionTip = false;

// axios.defaults.retry = 2;
// axios.defaults.retryDelay = 1000;
// axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//   let config = err.config;
//   // If config does not exist or the retry option is not set, reject
//   if(!config || !config.retry) return Promise.reject(err);
//
//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0;
//
//   // Check if we've maxed out the total number of retries
//   if(config.__retryCount >= config.retry) {
//     // Reject with the error
//     return Promise.reject(err);
//   }
//
//   // Increase the retry count
//   config.__retryCount += 1;
//
//   // Create new promise to handle exponential backoff
//   let backoff = new Promise(function(resolve) {
//     setTimeout(function() {
//       resolve();
//     }, config.retryDelay || 1);
//   });
//
//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function() {
//     return axios(config);
//   });
// });


// const router = new VueRouter({
//   mode: 'history',
//   routes:routes.options.routes,
//
//   scrollBehavior (to, from, savedPosition) {
//     if(to.path === '/productControlCenter') {
//
//       return savedPosition
//     }else {
//       return { x: 0, y: 0 }
//     }
//   }
// });


router.beforeEach((to, from, next) => {
  if (from.path !== '/' && to.path === '/index') {
    axios.get(globalConfig.server + "special/special/loginInfo").then((res) => {
      let data = {};
      data.id = res.data.data.id;
      data.name = res.data.data.name;
      data.avatar = res.data.data.avatar;
      data.phone = res.data.data.phone;
      data.department_name = res.data.data.org[0].name;
      data.department_id = res.data.data.org[0].id;
      sessionStorage.setItem('personal', JSON.stringify(data));
      globalConfig.personal = data;
    });
  }
  if (to.path === '/') {
    sessionStorage.removeItem('personal');
    globalConfig.header.Authorization = '';
  }
  let data = sessionStorage.getItem("personal");
  if (!data && to.path !== '/') {
    next({path: '/'});
  } else {
    next();
  }
});

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    document.title = route.meta.title;
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement('iframe');
      hackIframe.style.display = 'none';
      hackIframe.src = '/static/html/fixIosTitle.html?r=' + Math.random();
      document.body.appendChild(hackIframe);
      setTimeout(_ => {
        document.body.removeChild(hackIframe);
      }, 300)
    }
  }
});

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
