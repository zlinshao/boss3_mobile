<template>
  <div id="app">
    <div class="module" v-if="loading">
      {{token}}
    </div>
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

  export default {
    data() {
      return {
        urls: globalConfig.server,
        address: globalConfig.attestation,
        value: '',
        showKeyboard: false,
        transitionName: '',
        loading: true,
        token: '',
      };
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = 'slide-left';
        } else {
          this.transitionName = 'slide-right';
        }
      }
    },
    mounted() {
      this.paths = this.$router.options.routes;
      console.log(this.$route.query);
      this.responses();
    },
    methods: {
      responses() {
        if (navigator.userAgent == 'app/ApartMent' || navigator.userAgent.indexOf('native-ios') > -1) {
          let type, token;
          if (navigator.userAgent.indexOf('native-ios') > -1) {
            token = this.$route.query.token;
            type = this.$route.query.type;
          } else {
            token = android.queryToken();
            type = android.queryType();
          }
          sessionStorage.setItem('queryType', type);
          this.loading = true;
          if (type === 'exam') {
            this.$router.push({path: '/beforeExam'});
          } else if (type === 'questionnaire') {
            this.$router.push({path: '/beforeNaire'});
          } else if (type === 'interlocution') {
            this.$router.push({path: '/interlocution'});
          } else if (type === 'staffSquare') {
            this.$router.push({path: '/staffSquare'});
          }
          globalConfig.header.Authorization = "Bearer" + ' ' + token;
          this.$http.get(globalConfig.server + "special/special/loginInfo").then((res) => {
            this.loading = false;

            let data = {};
            data.id = res.data.data.id;
            data.name = res.data.data.name;
            data.avatar = res.data.data.avatar;
            data.phone = res.data.data.phone;
            data.department_name = res.data.data.org[0].name;
            data.department_id = res.data.data.org[0].id;
            sessionStorage.setItem('personal', JSON.stringify(data));
          });
        } else {
          sessionStorage.setItem('queryType', 'ding');
          this.loading = true;
          this.prevent();
        }
        let that = this;
        this.$http.interceptors.response.use(function (response) {
          return response;
        }, function (error) {
          if (error && error.response) {
            if (error.response.status > 499) {
              alert('服务器故障,请联系产品经理~');
              DingTalkPC.device.notification.alert({
                message: "服务器故障,请联系产品经理~",
                title: "提示信息",
                buttonName: "关闭",
              });
              that.closeDD();
            }
          }
          return Promise.reject(error);
        });
      },
      prevent() {

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
