export default {
  install(Vue, options) {
    Vue.prototype.routerIndex = function (url, house, id) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        if (url !== '' && house === 'house') {
          that.$router.push({path: url});
        } else if (url !== '' && house !== 'house') {
          that.$router.push({path: url, query: {tops: ''}});
        } else if (house === 'close') {
          dd.biz.navigation.close({
            onSuccess: function (result) {
            },
            onFail: function (err) {
            }
          });
        } else {
          that.$router.push({path: '/index'});
        }
      });
    };

    Vue.prototype.ddRent = function (url, house) {
      let that = this;
      dd.biz.navigation.setLeft({
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        onSuccess: function (result) {
          if (url !== '' && house === 'house') {
            that.$router.push({path: url});
          } else if (url !== '' && house !== 'house') {
            that.$router.push({path: url, query: {tops: ''}});
          } else if (house === 'close') {
            dd.biz.navigation.close({
              onSuccess: function (result) {
              },
              onFail: function (err) {
              }
            });
          } else {
            that.$router.push({path: '/index'});
          }
        },
        onFail: function (err) {
        }
      });
    };

    Vue.prototype.routerDetail = function (val) {
      this.$router.push({path: '/publishDetail', query: {ids: val}});
    };

    Vue.prototype.stick = function () {
      document.getElementById('main').scrollTop = document.getElementById('main').scrollHeight;
      // console.log(document.getElementsByTagName('.main')[0].scrollHeight);
    };
    Vue.prototype.valueLength = function (item, val) {
      return item.slice(0, val);
    };

    Vue.prototype.dictionary = function (data, flag) {
      return new Promise((resolve, reject) => {
        this.$http.get(globalConfig.server + 'setting/dictionary/' + data, {
          params: {status: flag}
        }).then((res) => {
          if (res.data.code === '30010') {
            resolve(res.data)
          }
        })
      })
    };
    Vue.prototype.computedDate = function (params) {
      return new Promise((resolve, reject) => {
        this.$http.get(globalConfig.server + 'bulletin/helper/calcdate', {
          params: params
        }).then((res) => {
          if (res.data.code === '51110') {
            resolve(res.data.data);
          }
        })
      })
    };

    // Vue.prototype.personalGet = function () {
    //   let that = this;
    //   that.$http.get(globalConfig.server + 'special/special/dingConfig').then((res) => {
    //     let _config = res.data;
    //     DingTalkPC.runtime.permission.requestAuthCode({
    //       corpId: _config.corpId,
    //       onSuccess: function (info) {
    //         that.$http.get(globalConfig.server + 'special/special/userInfo', {
    //           params: {
    //             'code': info.code,
    //           }
    //         }).then((res) => {
    //           if (res.data.status !== 'fail') {
    //             if (res.data !== false) {
    //               let data = {};
    //               data.id = res.data.id;
    //               data.name = res.data.name;
    //               data.avatar = res.data.avatar;
    //               data.phone = res.data.phone;
    //               data.department_name = res.data.org[0].name;
    //               data.department_id = res.data.org[0].id;
    //               sessionStorage.setItem('personal', JSON.stringify(data));
    //             }
    //           } else {
    //             DingTalkPC.device.notification.alert({
    //               message: "读取信息失败，稍后再试！",
    //               title: "提示信息",
    //               buttonName: "关闭",
    //               onSuccess: function () {},
    //               onFail: function (err) {}
    //             });
    //             dd.biz.navigation.close({
    //               onSuccess: function (result) {},
    //               onFail: function (err) {  }
    //             });
    //           }
    //         })
    //       },
    //       onFail: function (err) {
    //         DingTalkPC.device.notification.alert({
    //           message: "您不在系统内，请联系管理员添加！！",
    //           title: "提示信息",
    //           buttonName: "关闭",
    //           onSuccess: function () {},
    //           onFail: function (err) {}
    //         });
    //       }
    //     });
    //
    //     dd.ready(function () {
    //       dd.runtime.permission.requestAuthCode({
    //         corpId: _config.corpId,
    //         onSuccess: function (info) {
    //           that.$http.get(globalConfig.server + 'special/special/userInfo', {
    //             params: {
    //               'code': info.code,
    //             }
    //           }).then((res) => {
    //             if (res.data.status !== 'fail') {
    //               if (res.data !== false) {
    //                 let data = {};
    //                 data.id = res.data.id;
    //                 data.name = res.data.name;
    //                 data.avatar = res.data.avatar;
    //                 data.phone = res.data.phone;
    //                 data.department_name = res.data.org[0].name;
    //                 data.department_id = res.data.org[0].id;
    //                 sessionStorage.setItem('personal', JSON.stringify(data));
    //               } else {
    //                 setTimeout(() => {
    //                   alert('请求超时请稍后再试');
    //                   dd.biz.navigation.close({
    //                     onSuccess: function (result) {},
    //                     onFail: function (err) {}
    //                   });
    //                 }, 3000);
    //               }
    //             } else {
    //               alert('读取信息失败，稍后再试！');
    //               dd.biz.navigation.close({
    //                 onSuccess: function (result) {},
    //                 onFail: function (err) {}
    //               });
    //             }
    //           })
    //         },
    //         onFail: function (err) {
    //           alert('您不在系统内，请联系管理员添加！！');
    //           dd.biz.navigation.close({
    //             onSuccess: function (result) {},
    //             onFail: function (err) {}
    //           });
    //         }
    //       });
    //       // 钉钉头部右侧
    //       dd.biz.navigation.setRight({
    //         show: false,
    //         onSuccess: function (result) {},
    //         onFail: function (err) {}
    //       });
    //     });
    //     dd.error(function (err) {
    //       alert('dd error: ' + JSON.stringify(err));
    //     });
    //   });
    // };
  }
}
