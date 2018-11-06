import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router/index.js'
import axios from 'axios'
import VueRouter from 'vue-router'
import Fun from './fun.config.js'
import Vuex from 'vuex'
import store from './store/index.js'
import '@/assets/js/api.js'
import '@/assets/js/formData.js'
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

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Boss);
Vue.use(Fun);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Env'] = globalConfig.env;
axios.defaults.headers = globalConfig.header;
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (from.path === '/') {
    alert(window.location.href);
    let redirectUrl = window.location.href;
    redirectUrl = encodeURIComponent(redirectUrl);
    alert(redirectUrl);
    const appId = 'ww469e1dbe19ea6189';
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
  }
  next();
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
      }, 300);
    }
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
