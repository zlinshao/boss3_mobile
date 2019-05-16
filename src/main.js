import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router/index.js'
import axios from 'axios'
import VueRouter from 'vue-router'
import Fun from './fun.config.js'
import myUtils from './utils/myUtils'
import Vuex from 'vuex'
import store from './store/index.js'
import floatButton from './components/common/floatButton'
import '@/assets/js/api.js'
import '@/assets/js/formData.js'
import 'vant/lib/index.css'
// import 'vue2-editor/node_modules/quill/dist/quill.bubble.css'

import VConsole from 'vconsole/dist/vconsole.min.js'; //import vconsole
let vConsole = new VConsole(); // 初始化
Vue.use(vConsole);

import {
  Cell,
  Collapse,
  CollapseItem,
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
  Popup,
  SwitchCell,
  AddressList,
  List
} from 'vant';

Vue.use(Row).use(Collapse).use(CollapseItem).use(Col).use(Cell).use(RadioGroup).use(CellGroup).use(Icon).use(DatetimePicker).use(PasswordInput).use(NumberKeyboard).use(Badge).use(Button).use(Loading).use(NavBar).use(Panel).use(Stepper).use(Step).use(Steps).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Tag).use(Checkbox).use(CheckboxGroup).use(Field).use(Radio).use(Search).use(Switch).use(Uploader).use(Actionsheet).use(Dialog).use(PullRefresh).use(SwitchCell).use(Picker).use(Popup).use(AddressList).use(List);
Vue.use(require('vue-wechat-title'));
Vue.component('float-btn', floatButton);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Boss);
Vue.use(Fun);
Vue.prototype.myUtils = myUtils;
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Env'] = globalConfig.env;
axios.defaults.headers = globalConfig.header;
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  next();
});

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.meta.title) {
    dd.biz.navigation.setTitle({
      title: route.meta.title,//控制标题文本，空字符串表示显示默认文本
      onSuccess(result) {
      },
      onFail(err) {
      }
    });
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
