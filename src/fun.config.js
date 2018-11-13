import {md5} from './assets/js/MD5.js'

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
    // 钉钉返回
    Vue.prototype.goBack = function (url, data) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        that.$router.push({path: url, query: data});
      });

      dd.biz.navigation.setLeft({
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        onSuccess() {
          that.$router.push({path: url, query: data});
        },
      });
    };
    Vue.prototype.routLink = function (path, params) {
      if (path === 'back') {
        this.$router.go(-1);
      } else {
        this.$router.push({path: path, query: params});
      }
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

    Vue.prototype.routerTo = function (url, id, val) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        that.$router.push({path: url, query: {ids: id}});
      });
      dd.biz.navigation.setLeft({
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        onSuccess: function () {
          that.$router.push({path: url, query: {ids: id}});
        },
        onFail: function (err) {
        }
      });
    };
    // 详情页
    Vue.prototype.routerDetail = function (val) {
      console.log(val);
      this.$router.push({path: '/publishDetail', query: {ids: val}});
    };
    // 数组去空字符串
    Vue.prototype.filter_array = function (array) {
      return array.filter(item => item !== '');
    };
    // 已收金额计算
    Vue.prototype.countMoney = function (form) {
      let sum1 = form.front_money;
      let sum2 = form.deposit_payed;
      let sum3 = form.rent_money;
      sum1 = sum1 ? sum1 : 0;
      sum2 = sum2 ? sum2 : 0;
      sum3 = sum3 ? sum3 : 0;
      return Number(sum1) + Number(sum2) + Number(sum3);
    };
    // 格式化日期 yyyy-MM-dd
    Vue.prototype.formatDate = function (date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();

      let mm = month.toString();  //月
      let dd = day.toString();    //日
      let hh = h.toString();      //时
      let md = m.toString();      //分
      let ss = s.toString();      //秒
      mm = mm[1] ? mm : '0' + mm;
      dd = dd[1] ? dd : '0' + dd;
      hh = hh[1] ? hh : '0' + hh;
      md = md[1] ? md : '0' + md;
      ss = md[1] ? ss : '0' + ss;
      return year + '-' + mm + '-' + dd + ' ' + hh + ':' + md;
    };
    // 初始化日期
    Vue.prototype.chooseTime = function (val) {
      let time = val.split('-');
      let time1 = Number(time[1]) - 1;
      let time2 = Number(time[2]);
      return new Date(time[0], time1, time2);
    };
    // 底部
    Vue.prototype.stick = function () {
      window.scrollTo(0, document.getElementById('main').scrollHeight);
    };
    // input 长度
    Vue.prototype.valueLength = function (item, val) {
      return item.slice(0, val);
    };
    // 字典
    Vue.prototype.dictionary = function (data, flag) {
      return new Promise((resolve, reject) => {
        this.$http.get(globalConfig.server + 'setting/dictionary/' + data, {
          params: {status: flag}
        }).then((res) => {
          if (res.data.code === '30010') {
            resolve(res.data)
          }
        })
      }).catch(err => {
        alert(JSON.stringify(err));
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
    Vue.prototype.alertMsg = function (val) {
      switch (val) {
        case 'net':
          alert('网络连接失败,请检查网络是否正常!');
          break;
        case 'sub':
          return '正在提交，请耐心等待...';
        case 'pic':
          return '图片上传中...';
        case 'errPic':
          return '请删除上传失败的文件并重新上传!';
      }
    };
    // 企业微信
    Vue.prototype.weiChatAuth = function (val) {
      return new Promise((resolve, reject) => {
        val.timestamp = new Date().getTime();
        val.nonceStr = md5(val.corpid + val.timestamp);
        this.$http.get(globalConfig.server + 'organization/wework-bulletin', {
          params: val,
        }).then(res => {
          alert(JSON.stringify(res.data.data));
          alert(JSON.stringify({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: val.corpid, // 必填，企业微信的corpID
            timestamp: val.timestamp, // 必填，生成签名的时间戳
            nonceStr: val.nonceStr, // 必填，生成签名的随机串
            signature: res.data.data.signature,// 必填，签名，见附录1
            jsApiList: ['onHistoryBack', 'hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          }));
          wx.config({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: val.corpid, // 必填，企业微信的corpID
            timestamp: val.timestamp, // 必填，生成签名的时间戳
            nonceStr: val.nonceStr, // 必填，生成签名的随机串
            signature: res.data.data.signature,// 必填，签名，见附录1
            jsApiList: ['onHistoryBack', 'hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          resolve(true);
        }).catch(err => {
          resolve(false);
          console.log(JSON.stringify(err))
        })
      })
    };
    // 钉钉认证
    Vue.prototype.personalGet = function (val) {
      let that = this;
      return new Promise((resolve, reject) => {
        that.$http.get(globalConfig.server + 'special/special/dingConfig').then((res) => {
          let _config = res.data;
          // PC端
          DingTalkPC.runtime.permission.requestAuthCode({
            corpId: _config.corpId,
            onSuccess(info) {
              that.$http.get(globalConfig.server + 'special/special/userInfo', {
                params: {
                  'code': info.code,
                }
              }).then((res) => {
                if (res.data.status !== 'fail') {
                  if (res.data !== false) {
                    that.personalData(res, val, resolve);
                  } else {
                    setTimeout(() => {
                      DingTalkPC.device.notification.alert({
                        message: "请求超时请稍后再试",
                        title: "提示信息",
                        buttonName: "关闭",
                      });
                      that.closeDD();
                    }, 3000);
                  }
                } else {
                  DingTalkPC.device.notification.alert({
                    message: "读取信息失败，稍后再试！",
                    title: "提示信息",
                    buttonName: "关闭",
                  });
                  that.closeDD();
                }
              })
            },
            onFail() {
              DingTalkPC.device.notification.alert({
                message: "您不在系统内，请联系管理员添加！！",
                title: "提示信息",
                buttonName: "关闭",
              });
            }
          });
          // 移动端
          dd.ready(function () {
            dd.runtime.permission.requestAuthCode({
              corpId: _config.corpId,
              onSuccess(info) {
                that.$http.get(globalConfig.server + 'special/special/userInfo', {
                  params: {
                    'code': info.code,
                  }
                }).then((res) => {
                  if (res.data.status !== 'fail') {
                    if (res.data !== false) {
                      that.personalData(res, val, resolve);
                    } else {
                      setTimeout(() => {
                        alert('请求超时请稍后再试');
                        that.closeDD();
                      }, 3000);
                    }
                  } else {
                    alert('读取信息失败，稍后再试！');
                    that.closeDD();
                  }
                })
              },
              onFail() {
                alert('您不在系统内，请联系管理员添加！！');
                that.closeDD();
              }
            });
          });
          dd.error(function (err) {
            alert('dd error: ' + JSON.stringify(err));
          });
        });
      });
    };
    // 存储个人信息
    Vue.prototype.personalData = function (res, val, resolve) {
      let data = {};
      data.id = res.data.id;
      data.name = res.data.name;
      data.avatar = res.data.avatar;
      data.phone = res.data.phone;
      data.department_name = res.data.org[0].name;
      data.department_id = res.data.org[0].id;
      data.isCompany = '';
      sessionStorage.setItem('personal', JSON.stringify(data));
      globalConfig.personal = data;
      resolve(true);
    };
    // 关闭钉钉
    Vue.prototype.closeDD = function () {
      dd.biz.navigation.close({});
      // 钉钉头部右侧
      dd.biz.navigation.setRight({show: false});
    };
  }
}
