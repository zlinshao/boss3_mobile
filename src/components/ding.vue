<template>
  <div>
    111111111111111
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    },
    mounted() {
      let that = this;
      this.$http.get('http://test.v3.api.boss.lejias.cn/special/special/dingConfig').then((res) => {
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
              that.$http.get('http://test.v3.api.boss.lejias.cn/special/special/userInfo', {
                params: {
                  'code': info.code,
                  corpId: _config.corpId
                }
              }).then((res) => {
                alert(JSON.stringify(res.data));
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
