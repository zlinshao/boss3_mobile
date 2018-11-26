<template>
  <div id="app">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="./assets/loding1.gif">
    </div>
    <div v-if="!loading">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import {md5} from './assets/js/MD5.js'
  export default {
    data() {
      return {
        urls: globalConfig.server,
        value: '',
        showKeyboard: false,
        transitionName: '',
        loading: true,
      };
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        if (to.path === '/') {
          if (this.isWeiXin()) {
            window.close();
          } else {
            this.closeDD();
          }
        }
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        // if (to.meta.index > from.meta.index) {
        //   //设置动画名称
        //   this.transitionName = 'slide-left';
        // } else {
        //   this.transitionName = 'slide-right';
        // }
      }
    },
    mounted() {
      this.paths = this.$router.options.routes;
      this.responses();
    },
    methods: {
      isWeiXin() {
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        let ua = navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        return ua.includes('micromessenger');
      },
      responses() {
        if (navigator.userAgent == 'app/ApartMent' || navigator.userAgent.indexOf('native-ios') > -1) {
          sessionStorage.setItem('queryType', 'ding');
          this.loading = true;
          // if (type === 'exam') {
          //   this.$router.push({path: '/beforeExam'});
          // } else if (type === 'questionnaire') {
          //   this.$router.push({path: '/beforeNaire'});
          // } else if (type === 'interlocution') {
          //   this.$router.push({path: '/interlocution'});
          // } else if (type === 'staffSquare') {
          //   this.$router.push({path: '/staffSquare'});
          // }
          this.$http.get(globalConfig.server + "special/special/loginInfo").then((res) => {
            let data = {};
            data.id = res.data.data.id;
            data.name = res.data.data.name;
            data.avatar = res.data.data.avatar;
            data.phone = res.data.data.phone;
            data.department_name = res.data.data.org[0].name;
            data.department_id = res.data.data.org[0].id;
            this.loading = false;
            sessionStorage.setItem('personal', JSON.stringify(data));
          }).catch(_ => {});
        } else {
          sessionStorage.setItem('queryType', 'ding');
          this.loading = true;
          if (this.isWeiXin()) {
            this.prevent();
          } else {
            this.personalGet().then(res => {
              this.loading = !res;
            });
          }
        }
        let that = this;
        this.$http.interceptors.response.use(function (response) {
          return response;
        }, function (error) {
          if (error && error.response) {
            if (error.response.status > 499) {
              alert('服务器故障,请联系产品经理~');
              if (this.isWeiXin()) {
                window.close();
              } else {
                DingTalkPC.device.notification.alert({
                  message: "服务器故障,请联系产品经理~",
                  title: "提示信息",
                  buttonName: "关闭",
                });
                that.closeDD();
              }
            }
          }
          return Promise.reject(error);
        });
      },
      prevent() {
        let query = this.$route.query;
        let url = window.location.href;
        let redirectUrl = encodeURIComponent(url);
        let objUrl = encodeURIComponent(url.split('#')[0]);
        if (!query.code) {
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${query.appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=lejia#wechat_redirect`;
        } else {
          // this.getUserId(query);
          let obj = {};
          obj.corpid = query.appid;
          obj.corpsecret = query.secret;
          obj.url = objUrl;
          obj.timestamp = Math.round(new Date().getTime() / 1000).toString();
          obj.nonceStr = md5(obj.corpid + obj.timestamp);
          this.weiChatAuth(obj).then(_ => {
            alert(_);
          });
        }
      },
      // 获取uid
      getUserId(val) {
        this.$http.get(this.urls + 'organization/getWeworkUser?appId=' + val.appid + '&code=' + val.code).then(res => {
          if (res.data.success) {
            let info = res.data.data;
            this.token = info;
            let data = {};
            data.id = info.id;
            data.name = info.name;
            data.avatar = info.avatar;
            data.phone = info.phone;
            data.department_name = info.department_name[0];
            data.department_id = info.department_id[0];
            data.isCompany = info.isCompany;
            sessionStorage.setItem('personal', JSON.stringify(data));
            globalConfig.personal = data;
            this.loading = false;
          }
        }).catch(err => {
          this.token = JSON.stringify(err);
        });
      },
      onInput(key) {
        this.value = (this.value + key).slice(0, 6);
      },
      onDelete() {
        this.value = this.value.slice(0, this.value.length - 1);
      }
    }
  };
</script>

<style lang="scss">
  #app {
    height: 100%;
    .module, .loading {
      position: fixed;
    }

    .module {
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: #f1f1f1;
    }

    .loading {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  }

  body, html {
    background-color: #f8f8f8;
    height: 100%;
  }

  .van-cell__title .van-icon {
    font-size: 18px;
  }

  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }

  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
</style>
