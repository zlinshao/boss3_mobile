<template>
  <div id="app">
    <div class="module" v-if="loading">
      <div class="formInput">
        <div class="logos">
          <div class="logoBig">
            <img src="./assets/logoheyuanquan@3x.png" alt="">
          </div>
          <div class="logoSmall">
            <img src="./assets/logowenzi@3x.png" alt="">
          </div>
        </div>
        <div class="userInfo">
          <span></span>
          <input v-model="phone" placeholder="请输入手机号" type="text"/>
        </div>
        <div class="codeInfo">
          <span></span><input v-model="code" placeholder="请输入验证码" type="text"/>
          <b v-if="!loadingSms" class="codes" @click="phoneLogin">获取验证码</b>
          <b v-if="loadingSms" class="codes">发送中({{loadingNum}})</b>
        </div>
        <div class="loginEnter" @click="sureLogin(phone, code)">登录</div>
      </div>
    </div>
    <div v-if="!loading">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';

  export default {
    data() {
      return {
        urls: globalConfig.server,
        value: '',
        showKeyboard: false,
        transitionName: '',
        loading: true,
        loadingSms: false,
        loadingNum: 60,
        phone: '',
        code: '',
      };
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        if(to.path === '/'){
          this.loading = true;
          this.loadingSms = false;
          this.loadingNum = 60;
          this.phone = '';
          this.code = '';
        }
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
      console.log(this.$route.query.status);
      this.paths = this.$router.options.routes;
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
        }
        this.$http.interceptors.response.use(function (response) {
          return response;
        }, function (error) {
          if (error && error.response) {
            if (error.response.status > 499) {
              alert('服务器故障,请联系产品经理~');
            }
          }
          return Promise.reject(error);
        });
      },

      phoneLogin() {
        this.$http.post(globalConfig.attestation + 'api/v1/sms', {
          phone: this.phone,
        }).then((res) => {
          let msg = res.data.message;
          if (res.data.status === 'success') {
            this.countDown();
            this.loadingSms = true;
            Toast.success(msg);
          } else {
            if (typeof msg !== 'string') {
              Toast(res.data.message.phone[0]);
            } else {
              Toast(res.data.message);
            }
          }
        })
      },

      countDown() {
        new Promise((resolve, reject) => {
          let interval = setInterval(() => {
            if (this.loadingNum > 0) {
              this.loadingNum--;
            }
            if (this.loadingNum === 0) {
              this.loadingNum = 60;
              clearInterval(interval);
              this.loadingSms = false;
            }
          }, 1000)
        })
      },

      sureLogin(a, b) {
        this.$http.post(globalConfig.server_token + 'oauth/token', {
          client_secret: globalConfig.client_secret,
          client_id: globalConfig.client_id,
          grant_type: 'password',
          username: a,
          password: b,
        }).then((res) => {
          let head = res.data.data;
          globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;

          this.$http.get(globalConfig.server + "special/special/loginInfo").then((res) => {
            let data = {};
            data.id = res.data.data.id;
            data.name = res.data.data.name;
            data.avatar = res.data.data.avatar;
            data.phone = res.data.data.phone;
            data.department_name = res.data.data.org[0].name;
            data.department_id = res.data.data.org[0].id;
            sessionStorage.setItem('personal', JSON.stringify(data));
            globalConfig.personal = data;
            this.loading = false;
            Toast.success('登录成功');
          });
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
    @mixin flex {
      display: flex;
      display: -webkit-flex;
      align-items: center;
    }
    @mixin radius {
      -webkit-border-radius: .08rem;
      -moz-border-radius: .08rem;
      border-radius: .08rem;
    }
    height: 100%;
    .module {
      width: 100%;
      height: 100%;
      background-image: url("http://s.lejias.cn/group_2@3x.png");
      background-size: 100% 100%;
      @include flex();
      justify-content: center;
      .formInput {
        background-color: #fff;
        @include radius();
        padding: 0 .36rem;
        .userInfo, .codeInfo {
          height: 1.3rem;
          border-bottom: 1px solid #e0e0e0;
        }
        .userInfo {
          @include flex();
          span {
            height: .5rem;
            background-image: url("./assets/shouji@3x.png");
          }
        }
        .codeInfo {
          @include flex();
          .codes {
            @include radius();
            width: 1.6rem;
            height: .6rem;
            line-height: .6rem;
            color: #58d788;
            font-size: .24rem;
            margin-left: .2rem;
            background-color: rgba(88, 215, 136, 0.20);
            text-align: center;
          }
          span {
            height: .45rem;
            background-image: url("./assets/shoujiyanzhengma@3x.png");
          }
        }
        span {
          margin-right: .12rem;
          width: .4rem;
          background-size: 100% 100%;
        }
        .logoBig {
          margin-top: -1.2rem;
          text-align: center;
          img {
            width: 2rem;
            height: 2rem;
          }
        }
        .logoSmall {
          text-align: center;
          margin: .2rem 0 .5rem;
          img {
            width: 1.4rem;
            height: .8rem;
          }
        }
      }
      input {
        width: 3rem;
        @include radius();
        border: none;
        @include radius();
        padding: .12rem .24rem;
      }
      .loginEnter {
        margin: .6rem 0 1rem;
        background-image: linear-gradient(-135deg, #ffd54f 0%, #feb300 100%);
        box-shadow: 0 2px 20px 0 rgba(255, 179, 0, 0.30);
        color: #FFFFFF;
        text-align: center;
        padding: .2rem 0;
        @include radius();
      }
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
