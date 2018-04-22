import Vue from 'vue'
import App from './App'
import Boss from './boss.config.js'
import router from './router'
import axios from 'axios'
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

Vue.use(Boss);
Vue.use(Fun);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Env'] = globalConfig.env;
axios.defaults.headers = globalConfig.header;
Vue.config.productionTip = false;

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

router.beforeEach((to, from, next) => {
  if (from.path !== '/') {
    axios.get(globalConfig.server + 'special/special/dingConfig').then((res) => {
      let _config = res.data;
      DingTalkPC.runtime.permission.requestAuthCode({
        corpId: _config.corpId,
        onSuccess: function (info) {
          axios.get(globalConfig.server + 'special/special/userInfo', {
            params: {
              'code': info.code,
            }
          }).then((res) => {
            if (res.data.status !== 'fail') {
              if (res.data !== false) {
                let data = {};
                data.id = res.data.id;
                data.name = res.data.name;
                data.avatar = res.data.avatar;
                data.phone = res.data.phone;
                data.department_name = res.data.org[0].name;
                data.department_id = res.data.org[0].id;
                globalConfig.personal = data;
              }
            } else {
              DingTalkPC.device.notification.alert({
                message: "您不在系统内，请联系管理员添加！",
                title: "提示信息",
                buttonName: "关闭",
                onSuccess: function () {
                },
                onFail: function (err) {
                }
              });
              dd.biz.navigation.close({
                onSuccess: function (result) {
                },
                onFail: function (err) {
                }
              });
            }
          })
        },
        onFail: function (err) {
          DingTalkPC.device.notification.alert({
            message: "您不在系统内，请联系管理员添加！",
            title: "提示信息",
            buttonName: "关闭",
            onSuccess: function () {
            },
            onFail: function (err) {
            }
          });
        }
      });

      dd.ready(function () {
        dd.runtime.permission.requestAuthCode({
          corpId: _config.corpId,
          onSuccess: function (info) {
            axios.get(globalConfig.server + 'special/special/userInfo', {
              params: {
                'code': info.code,
              }
            }).then((res) => {
              if (res.data.status !== 'fail') {
                if (res.data !== false) {
                  let data = {};
                  data.id = res.data.id;
                  data.name = res.data.name;
                  data.avatar = res.data.avatar;
                  data.phone = res.data.phone;
                  data.department_name = res.data.org[0].name;
                  data.department_id = res.data.org[0].id;
                  globalConfig.personal = data;
                } else {
                  setTimeout(() => {
                    alert('请求超时请稍后再试');
                    dd.biz.navigation.close({
                      onSuccess: function (result) {
                      },
                      onFail: function (err) {
                      }
                    });
                  }, 3000);
                }
              } else {
                alert('您不在系统内，请联系管理员添加！');
                dd.biz.navigation.close({
                  onSuccess: function (result) {
                  },
                  onFail: function (err) {
                  }
                });
              }
            })
          },
          onFail: function (err) {
            alert('您不在系统内，请联系管理员添加！');
            dd.biz.navigation.close({
              onSuccess: function (result) {
              },
              onFail: function (err) {
              }
            });
          }
        });
        // 钉钉头部右侧
        dd.biz.navigation.setRight({
          show: false,
          onSuccess: function (result) {
          },
          onFail: function (err) {
          }
        });
      });
      dd.error(function (err) {
        alert('dd error: ' + JSON.stringify(err));
      });
    });
  }
  next();
});


new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
