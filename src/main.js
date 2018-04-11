import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router'
import axios from 'axios'
// import FastClick from 'fastclick'
import Fun from './fun.config.js'
import '@/assets/js/api.js'

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
  SwitchCell
} from 'vant';

Vue.use(Row).use(Col).use(Cell).use(RadioGroup).use(CellGroup).use(Icon).use(DatetimePicker).use(PasswordInput).use(NumberKeyboard).use(Badge).use(Button).use(Loading).use(NavBar).use(Panel).use(Stepper).use(Step).use(Steps).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Tag).use(Checkbox).use(CheckboxGroup).use(Field).use(Radio).use(Search).use(Switch).use(Uploader).use(Actionsheet).use(Dialog).use(PullRefresh).use(CellSwipe).use(SwitchCell).use(Picker).use(Popup);
Vue.use(require('vue-wechat-title'));

Vue.use(Boss);
Vue.use(Fun);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Env'] = globalConfig.env;
axios.defaults.headers = globalConfig.header;
Vue.config.productionTip = false;

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '请求错误';
        break;
      case 401:
        error.message = '未授权，请登录';
        break;
      case 403:
        error.message = '拒绝访问';
        break;
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`;
        break;
      case 408:
        error.message = '请求超时';
        break;
      case 500:
        error.message = '服务器内部错误';
        break;
      case 501:
        error.message = '服务未实现';
        break;
      case 502:
        error.message = '网关错误';
        break;
      case 503:
        error.message = '服务不可用';
        break;
      case 504:
        error.message = '网关超时';
        break;
      case 505:
        error.message = 'HTTP版本不受支持';
        break;
      default:
    }
  }
  if (error.response.data.status_code === 401) {

  }
  return Promise.reject(error);
});

if (sessionStorage.myData !== undefined) {
  let head = JSON.parse(sessionStorage.myData);
  globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
}

if (sessionStorage.personal !== undefined) {
  globalConfig.personal = JSON.parse(sessionStorage.personal);
}

let u = navigator.userAgent, app = navigator.appVersion;
let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if (isAndroid) {
  router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
  });
}
if (isIOS) {

}

// 钉钉头部右侧
dd.biz.navigation.setRight({
  show: false,
  onSuccess: function (result) {
  },
  onFail: function (err) {
  }
});

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
