<template>
  <div v-wechat-title="$route.meta.title">
    <!--<div class="module" v-if="loading"></div>-->
    <!--<div class="loading" v-if="loading">-->
      <!--<img src="../assets/loding1.gif">-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        // urls: globalConfig.server,
        // loading: true,
      }
    },
    mounted() {
      this.$router.push('/index');
      // this.corp();
    },
    methods: {
      // corp() {
      //   let that = this;
      //   this.$http.get(this.urls + 'special/special/dingConfig').then((res) => {
      //     let _config = res.data;
      //     dd.ready(function () {
      //       dd.runtime.permission.requestAuthCode({
      //         corpId: _config.corpId,
      //         onSuccess: function (info) {
      //           that.$http.get(that.urls + 'special/special/userInfo', {
      //             params: {
      //               'code': info.code,
      //             }
      //           }).then((res) => {
      //             if (res.data.status !== 'fail') {
      //               if (res.data !== false) {
      //                 let data = {};
      //                 data.name = res.data.name;
      //                 data.avatar = res.data.avatar;
      //                 data.phone = res.data.phone;
      //                 // data.depart = res.data.org[0].name;
      //                 // data.display_name = res.data.role[0].display_name;
      //                 sessionStorage.setItem('personal', JSON.stringify(data));
      //                 globalConfig.personal = data;
      //                 that.$http.post(that.address + 'oauth/token', {
      //                   client_secret: globalConfig.client_secret,
      //                   client_id: globalConfig.client_id,
      //                   grant_type: 'password',
      //                   username: res.data.phone,
      //                   password: res.data.code,
      //                 }).then((res) => {
      //                   that.loading = false;
      //                   sessionStorage.setItem('myData', JSON.stringify(res.data.data));
      //                   let head = res.data.data;
      //                   globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
      //                   that.$router.push({path: '/index'});
      //                 });
      //               } else {
      //                 setTimeout(() => {
      //                   alert('请求超时请稍后再试');
      //                   dd.biz.navigation.close({
      //                     onSuccess: function (result) {
      //                     },
      //                     onFail: function (err) {
      //                     }
      //                   });
      //                 }, 3000);
      //               }
      //             } else {
      //               alert('您不在系统内，请联系管理员添加！');
      //               dd.biz.navigation.close({
      //                 onSuccess: function (result) {
      //                 },
      //                 onFail: function (err) {
      //                 }
      //               });
      //             }
      //           })
      //         },
      //         onFail: function (err) {
      //           alert('您不在系统内，请联系管理员添加！');
      //           dd.biz.navigation.close({
      //             onSuccess: function (result) {
      //             },
      //             onFail: function (err) {
      //             }
      //           });
      //         }
      //       });
      //       // 钉钉头部右侧
      //       dd.biz.navigation.setRight({
      //         show: false,
      //         onSuccess: function (result) {
      //         },
      //         onFail: function (err) {
      //         }
      //       });
      //     });
      //     dd.error(function (err) {
      //       alert('dd error: ' + JSON.stringify(err));
      //
      //     });
      //   })
      // }
    },
  }
</script>

<style scoped>
  /*.module, .loading {*/
    /*position: fixed;*/
  /*}*/

  /*.module {*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*background: #f1f1f1;*/
  /*}*/

  /*.loading {*/
    /*top: 50%;*/
    /*left: 50%;*/
    /*transform: translate(-50%, -50%);*/
    /*z-index: 1;*/
  /*}*/
</style>
