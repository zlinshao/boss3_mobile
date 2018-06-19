<template>
  <div id="app">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="./assets/loding1.gif">
    </div>
    <div v-if="!loading">
      <keep-alive>
        <router-view v-wechat-title="$route.meta.title"/>
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
        loading: false,
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
    created() {
      this.responses();
    },

    mounted() {
      this.paths = this.$router.options.routes;
    },
    methods: {
      responses() {
        if (navigator.userAgent == 'app/ApartMent' || navigator.userAgent.indexOf('native-ios')) {
          alert(1);
          alert(JSON.stringify(DataCallback()));
          sessionStorage.setItem('queryType', android.queryType());
          this.loading = true;
          // add by cj 2018-05-25
          if (android.queryType() === 'exam') {
            this.$router.push({path: '/beforeExam'});
          } else if (android.queryType() === 'questionnaire') {
            this.$router.push({path: '/beforeNaire'});
          } else if (android.queryType() === 'interlocution') {
            this.$router.push({path: '/interlocution'});
          }
          // let head = {};
          // head.token_type = "Bearer";
          // head.access_token = android.queryToken();
          // sessionStorage.setItem('myData', JSON.stringify(head));
          globalConfig.header.Authorization = "Bearer" + ' ' + android.queryToken();
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
          alert(2);
          sessionStorage.setItem('queryType', 'ding');
          this.loading = true;
          this.corp();
          // if (sessionStorage.myData !== undefined) {
          //   let head = JSON.parse(sessionStorage.myData);
          //   globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
          // } else {
          //   this.loading = true;
          //   this.corp();
          // }
        }
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
          }
          return Promise.reject(error);
        });
      },

      // 认证
      corp() {
        let that = this;
        this.$http.get(this.urls + 'special/special/dingConfig').then((res) => {
          let _config = res.data;
          DingTalkPC.runtime.permission.requestAuthCode({
            corpId: _config.corpId,
            onSuccess: function (info) {
              that.$http.get(that.urls + 'special/special/userInfo', {
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
                    sessionStorage.setItem('personal', JSON.stringify(data));
                    globalConfig.personal = data;
                    that.$http.post(that.address + 'oauth/token', {
                      client_secret: globalConfig.client_secret,
                      client_id: globalConfig.client_id,
                      grant_type: 'password',
                      username: res.data.phone,
                      password: res.data.code,
                    }).then((res) => {
                      let head = res.data.data;
                      globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
                      that.loading = false;
                    });
                  } else {
                    setTimeout(() => {
                      DingTalkPC.device.notification.alert({
                        message: "请求超时请稍后再试",
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
                    }, 3000);
                  }
                } else {
                  DingTalkPC.device.notification.alert({
                    message: "读取信息失败，稍后再试！",
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
                message: "您不在系统内，请联系管理员添加！！",
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
                that.$http.get(that.urls + 'special/special/userInfo', {
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
                      sessionStorage.setItem('personal', JSON.stringify(data));
                      globalConfig.personal = data;
                      that.$http.post(that.address + 'oauth/token', {
                        client_secret: globalConfig.client_secret,
                        client_id: globalConfig.client_id,
                        grant_type: 'password',
                        username: res.data.phone,
                        password: res.data.code,
                      }).then((res) => {
                        let head = res.data.data;
                        globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
                        that.loading = false;
                      });
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
                    alert('读取信息失败，稍后再试！');
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
                alert('您不在系统内，请联系管理员添加！！');
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
        })
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
