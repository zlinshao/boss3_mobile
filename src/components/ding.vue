<template>
  <div v-wechat-title="$route.meta.title">

  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        address: globalConfig.attestation,
      }
    },
    mounted() {
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
          dd.runtime.permission.requestAuthCode({
            corpId: _config.corpId,
            onSuccess: function (info) {
              that.$http.get(that.urls + 'special/special/userInfo', {
                params: {
                  'code': info.code,
                  corpId: _config.corpId
                }
              }).then((res) => {
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
                  localStorage.setItem('myData', JSON.stringify(res.data.data));
                  let head = res.data.data;
                  globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
                  that.$router.push({path: '/index'});
                });
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

</style>
