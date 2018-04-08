<template>
  <div v-wechat-title="$route.meta.title">
    <div class="module">
    </div>
    <div class="loading" v-if="loading">
      <img src="../assets/loding1.gif">
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
      }
    },
    mounted() {
      alert(window.location.href);
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
                    that.$router.push({path: '/index'});
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

<style scoped>
  div {
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
</style>
