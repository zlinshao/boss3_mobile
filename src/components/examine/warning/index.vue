<template>
  <div id="warning">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../../assets/loding1.gif">
    </div>
    <div v-if="!loading">
      <div class="disappear" v-if="recall">
        <div class="a1">
          <img src="../../../assets/disappear.png">
        </div>
        <div class="a2">{{titles}}</div>
      </div>
      <div class="navTop" v-if="recall1">
        <div class="top0">
          <div class="top1">
            {{myData.title}}
          </div>
          <div class="top2">
            <span>{{myData.date}}</span>
            <span>南京乐伽商业管理有限公司</span>
          </div>
        </div>
        <div class="top3">
          <b>
            <i class="iconfont icon-yanjing"></i>
            <span>{{myData.read_count}}人</span>
          </b>
          <b>
            <i class="iconfont icon-yanjingclose"></i>
            <span>{{myData.unread_count}}人</span>
          </b>
        </div>
      </div>
      <div class="mainWarning" v-if="recall1">
        <div class="mainTop">公司各部门：</div>
        <div class="mainTitle">
          <p v-html="myData.content"></p>
        </div>
        <div class="mainFooter">
          <div>
            <p>南京乐伽商业管理有限公司</p>
            <p>{{myData.date}}</p>
          </div>
        </div>
      </div>
      <div class="appendix" v-if="recall1 && attachment.length !== 0">
        <div class="appendixMain">
          <div class="appendixTitle">附件：</div>
          <a class="upload" v-for="key in attachment" :href="key.data.uri">
            <p v-if="key.data.uri.indexOf('.docx') > -1 || key.data.uri.indexOf('.doc') > -1" class="a1"></p>
            <p v-if="key.data.uri.indexOf('.xls') > -1" class="a2"></p>
            <p v-if="key.data.uri.indexOf('.txt') > -1" class="a3"></p>
            <p v-if="key.data.uri.indexOf('.pdf') > -1" class="a4"></p>
            <p v-if="key.data.uri.indexOf('.jpg') > -1" class="a5"></p>
            <p v-if="key.data.uri.indexOf('.png') > -1" class="a5"></p>
            <p v-if="key.data.uri.indexOf('.pptx') > -1" class="a5"></p>
            <span>{{key.data.display_name}}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        address: globalConfig.attestation,
        myData: {},
        attachment: {},
        loading: false,
        ids: '',
        recall: false,
        recall1: false,
        titles: '',
      }
    },
    mounted() {
      this.ids = this.$route.query.id;
      if (sessionStorage.myData !== undefined) {
        this.loading = false;
        this.recall = false;
        this.recall1 = false;
        this.warningList(this.ids);
      } else {
        this.corp();
      }
    },
    watch: {},
    methods: {
      warningList(val) {
        this.loading = false;
        this.$http.get(this.urls + 'announcement/' + val).then((res) => {
          if (res.data.code === "80010") {
            this.myData = res.data.data;
            this.attachment = res.data.data.attachment;
            this.recall = false;
            this.recall1 = true;
          } else if (res.data.code === "80044") {
            this.recall = true;
            this.recall1 = false;
            this.titles = '此消息已被撤回';
          } else if (res.data === 'pass') {
            this.warningList(val);
          } else {
            this.recall = true;
            this.recall1 = false;
            this.titles = '此消息消失不见了';
          }
        })
      },
      corp() {
        this.loading = true;
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
                    that.warningList(that.ids);
                  });
                }
                }else{
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
                        that.warningList(that.ids);
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
            alert('您不在系统内，请联系管理员添加！');
            dd.biz.navigation.close({
              onSuccess: function (result) {
              },
              onFail: function (err) {
              }
            });
          });
        })
      }
    },
  }
</script>

<style lang="scss">
  #warning {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    @mixin bgPic($n) {
      background: url($n) no-repeat;
      background-size: 100% 100%;
    }

    .disappear {
      div {
        text-align: center;
      }
      .a1 {
        width: 3rem;
        height: 3rem;
        margin: 2rem auto 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .a2 {
        margin-top: .6rem;
        font-size: .4rem;
        color: #aaaaaa;
      }
    }
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

    .navTop {
      padding: .4rem;
      /*margin-top: .4rem;*/
      height: 3.54rem;
      background: url("../../../assets/shenp1.jpg") no-repeat;
      background-size: 100% 100%;
      @include flex;
      flex-wrap: wrap;
      align-content: space-between;
      .top0 {
        width: 100%;
        .top1 {
          color: #ff943e;
          font-weight: bold;
          font-size: .4rem;
          margin-bottom: .3rem;
        }
        .top2 {
          width: 100%;
          @include flex;
          justify-content: space-between;
        }
      }
      .top3 {
        width: 100%;
        @include flex;
        justify-content: flex-end;
        b {
          @include flex;
          margin-left: .36rem;
          i {
            color: #e0e0e0;
            padding-right: .1rem;
            font-size: .36rem;
          }
        }
      }
    }

    .mainWarning {
      padding: .4rem;
      @include flex;
      flex-wrap: wrap;
      align-content: space-around;
      .mainTop, .mainTitle, .mainFooter {
        width: 100%;
      }
      .mainTitle {
        line-height: .5rem;
        margin: .36rem 0 .6rem;
      }
      .mainFooter {
        @include flex;
        justify-content: flex-end;
        div {
          p {
            margin: .12rem 0;
            text-align: center;
          }
        }
      }
    }
    .appendix {
      .appendixMain {
        padding: .3rem;
        border-top: .03rem solid #DDDDDD;
        .appendixTitle {

        }
        .upload {
          @include flex;
          align-items: center;
          margin-top: .3rem;
          p {
            min-width: .8rem;
            min-height: .8rem;
            margin-right: .2rem;
          }
          .a1 {
            @include bgPic("../../../assets/doc.png");
          }
          .a2 {
            @include bgPic("../../../assets/xls.png");
          }
          .a3 {
            @include bgPic("../../../assets/txt.png");
          }
          .a4 {
            @include bgPic("../../../assets/pdf.png");
          }
          .a5 {
            @include bgPic("../../../assets/file.png");
          }
        }
      }

    }
  }
</style>
