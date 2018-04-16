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
        if (sessionStorage.myData !== undefined) {
          let head = JSON.parse(sessionStorage.myData);
          globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
        } else {
          this.loading = true;
          this.corp();
        }

        if (sessionStorage.personal !== undefined) {
          globalConfig.personal = JSON.parse(sessionStorage.personal);
        }
        let that = this;
        this.$http.interceptors.response.use(function (response) {
          return response;
        }, function (error) {
          if (error && error.response) {
            if(error.response.status === 500){
              alert('服务器故障,请联系产品经理');
              DingTalkPC.device.notification.alert({
                message: "服务器故障,请联系产品经理！",
                title: "提示信息",
                buttonName: "关闭",
                onSuccess: function () {
                },
                onFail: function (err) {
                }
              });
              dd.biz.navigation.close({
                onSuccess: function (result) {},
                onFail: function (err) {}
              });
            }
            if (error.response.data.status_code === 401) {
              that.loading = false;
              that.corp();
            }
          }
          return Promise.reject(error);
        });

      },
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
                    data.name = res.data.name;
                    data.avatar = res.data.avatar;
                    data.phone = res.data.phone;
                    // data.depart = res.data.org[0].name;
                    // data.display_name = res.data.role[0].display_name;
                    sessionStorage.setItem('personal', JSON.stringify(data));
                    globalConfig.personal = data;

                    that.$http.post(that.address + 'oauth/token', {
                      client_secret: globalConfig.client_secret,
                      client_id: globalConfig.client_id,
                      grant_type: 'password',
                      username: res.data.phone,
                      password: res.data.code,
                    }).then((res) => {
                      sessionStorage.setItem('myData', JSON.stringify(res.data.data));
                      let head = res.data.data;
                      globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
                      that.loading = false;
                    });
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
                that.$http.get(that.urls + 'special/special/userInfo', {
                  params: {
                    'code': info.code,
                  }
                }).then((res) => {
                  if (res.data.status !== 'fail') {
                    if (res.data !== false) {
                      let data = {};
                      data.name = res.data.name;
                      data.avatar = res.data.avatar;
                      data.phone = res.data.phone;
                      // data.depart = res.data.org[0].name;
                      // data.display_name = res.data.role[0].display_name;
                      sessionStorage.setItem('personal', JSON.stringify(data));
                      globalConfig.personal = data;
                      that.$http.post(that.address + 'oauth/token', {
                        client_secret: globalConfig.client_secret,
                        client_id: globalConfig.client_id,
                        grant_type: 'password',
                        username: res.data.phone,
                        password: res.data.code,
                      }).then((res) => {
                        sessionStorage.setItem('myData', JSON.stringify(res.data.data));
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

  body {
    background-color: #f8f8f8;
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
