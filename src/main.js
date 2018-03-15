
import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router'
import axios from 'axios'


import { Cell, CellGroup, Icon, DatetimePicker,PasswordInput, NumberKeyboard ,Row, Col,Badge,Button,
  Loading,NavBar,Panel,Stepper,Step, Steps,Swipe, SwipeItem,Tab, Tabs,Tabbar, TabbarItem,Tag,
  Checkbox, CheckboxGroup,Field,RadioGroup,Radio,Search,Switch,Uploader,Actionsheet,Dialog,Picker,PullRefresh,CellSwipe,Popup ,
  SwitchCell} from 'vant';

Vue.use(Row).use(Col).use(Cell).use(RadioGroup).use(CellGroup).use(Icon).use(DatetimePicker).use(PasswordInput).use(NumberKeyboard).use(Badge).use(Button).use(Loading).use(NavBar).use(Panel).use(Stepper).use(Step).use(Steps).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Tag).use(Checkbox).use(CheckboxGroup).use(Field).use(Radio).use(Search).use(Switch).use(Uploader).use(Actionsheet).use(Dialog).use(PullRefresh).use(CellSwipe).use(SwitchCell).use(Picker).use(Popup);

Vue.use(Boss);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.baseURL = globalConfig.server;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Env'] = globalConfig.env;
axios.defaults.headers = globalConfig.header;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
