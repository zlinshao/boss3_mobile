<template>
  <div>
    <div class="module"></div>
    <div class="loading" v-if="loading">
      <img src="../../../assets/loding1.gif">
    </div>
    <div class="navTop" v-if="!loading">
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
    <div class="main">
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
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        address: globalConfig.attestation,
        loading: true,
        myData: {},
      }
    },
    mounted() {
      let ids = this.$route.query.id;
      let that = this;
      this.$http.get(this.urls + 'special/special/dingConfig').then((res) => {
        let _config = res.data;
        dd.config({
          agentId: _config.agentId,
          corpId: _config.corpId,
          timeStamp: _config.timeStamp,
          nonceStr: _config.nonceStr,
          signature: _config.signature,
          type: 0,
          jsApiList: ['runtime.info', 'biz.contact.choose',
            'device.notification.confirm', 'device.notification.alert',
            'device.notification.prompt', 'biz.ding.post',
            'biz.util.openLink']
        });
        dd.ready(function () {
          // 钉钉头部右侧
          dd.biz.navigation.setRight({
            show: false,
            onSuccess: function (result) {
            },
            onFail: function (err) {
            }
          });
          dd.runtime.permission.requestAuthCode({
            corpId: _config.corpId,
            onSuccess: function (info) {
              that.$http.get(that.urls + 'special/special/userInfo', {
                params: {
                  'code': info.code,
                  corpId: _config.corpId
                }
              }).then((res) => {
                alert(JSON.stringify(res.data));
                if (res.data !== false) {
                  let data = {};
                  data.name = res.data.name;
                  data.avatar = res.data.avatar;
                  data.phone = res.data.phone;
                  data.depart = res.data.org[0].name;
                  data.display_name = res.data.role[0].display_name;
                  localStorage.setItem('personal', JSON.stringify(data));
                  globalConfig.personal = data;
                  that.$http.post(that.address + 'oauth/token', {
                    client_secret: 'udMntGnEJBgsevojFrMicLuW8G2ABBAsmRlK9fIC',
                    grant_type: 'password',
                    client_id: '2',
                    username: res.data.phone,
                    password: res.data.code,
                  }).then((res) => {
                    that.loading = false;
                    localStorage.setItem('myData', JSON.stringify(res.data.data));
                    let head = res.data.data;
                    globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;

                    this.$http.get(this.urls + 'announcement/' + ids).then((res) => {
                      this.myData = res.data.data;
                    });

                  });
                } else {
                  setTimeout(() => {
                    alert('请求超时请稍后再试');
                  }, 3000);
                }
              })
            },
            onFail: function (err) {
              alert('fail: ' + JSON.stringify(err));
            }
          });
        });
        dd.error(function (err) {
          alert('dd error: ' + JSON.stringify(err));
        });
      })
    },
    watch: {},
    methods: {},
  }
</script>

<style scoped lang="scss">
  @mixin flex {
    display: flex;
    display: -webkit-flex;
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

  .main {
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
</style>
