
import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router'
import axios from 'axios'
// import FastClick from 'fastclick'
import Fun from './fun.config.js'


import { Cell, CellGroup, Icon, DatetimePicker,PasswordInput, NumberKeyboard ,Row, Col,Badge,Button,
  Loading,NavBar,Panel,Stepper,Step, Steps,Swipe, SwipeItem,Tab, Tabs,Tabbar, TabbarItem,Tag,
  Checkbox, CheckboxGroup,Field,RadioGroup,Radio,Search,Switch,Uploader,Actionsheet,Dialog,Picker,PullRefresh,CellSwipe,Popup,
  SwitchCell} from 'vant';

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

// 拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response);
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

if (localStorage.myData !== undefined) {
  let head = JSON.parse(localStorage.myData);
  globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
}

if (localStorage.personal !== undefined) {
  globalConfig.personal = JSON.parse(localStorage.personal);
}

sessionStorage.address = '/index';

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
  onSuccess: function (result) {},
  onFail: function (err) {}
});

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
