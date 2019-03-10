import {Toast, Dialog} from 'vant';

export default {
  install(Vue, options) {
    Vue.prototype.routerIndex = function (url, house, id) {
      let that = this;
      alert(6)
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
      alert(7)
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
    Vue.prototype.formatDate = function (date, type = '', pre) {
      let year = date.getFullYear();
      let month;
      if (pre === 'pre') {
        month = date.getMonth();
      } else {
        month = date.getMonth() + 1;
      }
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
      if (type === 'date') {
        return year + '-' + mm + '-' + dd;
      }
      return year + '-' + mm + '-' + dd + ' ' + hh + ':' + md;
    };
    // 初始化日期组件
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
    // loading
    Vue.prototype.prompt = function (msg, type) {
      switch (type) {
        case 'send':
          Toast.loading({
            duration: 0,            // 持续展示 toast
            forbidClick: true,      // 禁用背景点击
            loadingType: 'spinner',
            message: msg
          });
          break;
        case 'succeed':
          Toast.success(msg);
          break;
        case 'fail':
          Toast.fail(msg);
          break;
        case 'close':
          Toast.clear();
          break;
        default:
          Toast(msg);
          break;
      }
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
    Vue.prototype.polishingHint = function (id) {
      this.$http.get(globalConfig.server + 'bulletin/vali_contract_complete_count/' + id).then(res => {
        if (res.data.code === '50196') {
          Dialog.alert({
            title: '提示信息',
            message: res.data.msg,
          }).then(() => {
          });
        }
        if (res.data.code === '50199') {
          Dialog.alert({
            title: '提示信息',
            message: res.data.msg,
          }).then(() => {
            this.$router.push('/index');
          });
        }
      })
    };
    // 企业微信
    Vue.prototype.weiChatAuth = function (val) {
      return new Promise((resolve, reject) => {
        this.$http.get(globalConfig.server + 'organization/wework-bulletin', {
          params: val,
        }).then(res => {
          wx.config({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: val.corpid, // 必填，企业微信的corpID
            timestamp: val.timestamp, // 必填，生成签名的时间戳
            nonceStr: val.nonceStr, // 必填，生成签名的随机串
            signature: res.data.data.signature2,// 必填，签名，见附录1
            jsApiList: ['onHistoryBack', 'hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          resolve(true);
        }).catch(err => {
          resolve(false);
        })
      })
    };
    // 钉钉认证
    Vue.prototype.personalGet = function (val) {
      let that = this;
      return new Promise((resolve, reject) => {
        that.$http.get(globalConfig.server + 'special/special/dingConfig').then((res) => {
          let _config = res.data;
          dd.config({
            agentId: _config.agentId, // 必填，微应用ID
            corpId: _config.corpId,//必填，企业ID
            timeStamp: _config.timeStamp, // 必填，生成签名的时间戳
            nonceStr: _config.nonceStr, // 必填，生成签名的随机串
            signature: _config.signature, // 必填，签名
            jsApiList: ['biz.cspace.saveFile', 'biz.cspace.preview'] // 必填，需要使用的jsapi列表，注意：不要带dd。
          });
          sessionStorage.setItem('cropID', _config.corpId);
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
            window.location.reload();
            // alert('dd error: ' + JSON.stringify(err));
          });
        });
      });
    };
    // 存储个人信息
    Vue.prototype.personalData = function (res, val, resolve) {
      let data = {};
      let power = [];
      let info = res.data.data;
      data.id = info.id;
      data.name = info.name;
      data.avatar = info.avatar;
      data.phone = info.phone;
      data.department_name = info.org[0].name;
      data.department_id = info.org[0].id;
      data.session_id=info.session_id;
      data.isCompany = '';
      info.role.forEach(str => {
        power.push(str.name);
      });
      data.status = power.indexOf('fund-master') > -1;
      sessionStorage.setItem('personal', JSON.stringify(data));
      globalConfig.personal = data;
      dd.biz.navigation.setRight({show: false});
      resolve(true);
    };
    // 关闭钉钉
    Vue.prototype.closeDD = function () {
      dd.biz.navigation.close({});
      // 钉钉头部右侧
      dd.biz.navigation.setRight({show: false});
    };
    // 生成电子收据
    Vue.prototype.previewReceipt = function (val, money_key) {
      let data = {};
      data.process_id = '0';
      if (data.house_id_rent) {
        data.house_id = val.house_id_rent;
      } else {
        if (val.house_id) {
          data.house_id = val.house_id;
        } else {
          data.house_id = '';
        }
      }
      data.department_id = val.department_id;
      data.payer = val.customer_info[0].name;
      if (val.rent_without_collect_address) {
        data.address = val.rent_without_collect_address;
      } else {
        data.address = val.address;
      }
      data.price = '';
      let pay = [];
      if (val.payPrice) {
        pay = val.payPrice;
      } else {
        pay = val.price_arr;
      }
      for (let item of pay) {
        if (item) {
          data.price = data.price + item + '元 ; '
        }
      }
      data.sign_at = val.sign_date;
      data.duration = val.month + '个月' + (val.day ? val.day : 0) + '天';
      data.pay_way = '';
      if (val.pay_way_arr) {
        for (let item of val.pay_way_arr) {
          if (item) {
            let str = '押' + val.pay_way_bet + '付' + item + ' ; ';
            data.pay_way = data.pay_way + str;
          }
        }
      } else {
        for (let item of val.pay_way) {
          data.pay_way = data.pay_way + item.pay_way_str;
        }
      }
      switch (money_key) {
        case 'front_money':
          data.payment = '定金';
          break;
        case 'rent_money':
          data.payment = '租金';
          break;
        default:
          data.payment = '押金+租金';
          break;
      }
      data.amount = val.money_sum;
      data.sum = val.money_sum;
      data.memo = val.memo;
      val.money_way.forEach((item, index) => {
        data['bank' + (index + 1)] = item;
      });
      data.account_id = val.account_id;
      this.previewJoggle(data);
    };
    Vue.prototype.previewJoggle = function (val, sign = '') {
      val.date = this.formatDate(new Date());
      return new Promise((resolve, reject) => {
        this.prompt('正在生成电子收据！', 'send');
        this.$http.post(this.urls + 'financial/receipt/generate', val).then(res => {
          if (sign !== 'sign') {
            this.prompt('', 'close');
          }
          if (res.data.code === '20000') {
            let pdfUrls = res.data.data.shorten_uri;
            if (navigator.userAgent == 'app/ApartMent') {
              Android.toBrowser(pdfUrls);
            } else {
              if (sign !== 'sign') {
                this.ddReceipt(pdfUrls, val);
              } else {
                this.receiptSignature(res.data.data.id, resolve);
              }
            }
          } else {
            this.prompt(res.data.msg);
            resolve(false);
          }
        }).catch(_ => {
          resolve(false);
          this.prompt('', 'close');
        })
      })
    };
    Vue.prototype.receiptSignature = function (id, resolve) {
      this.$http.post(this.urls + 'financial/receipt/sign/' + id).then(arr => {
        this.prompt('', 'close');
        if (arr.data.code === '20000') {
          sessionStorage.setItem('receiptId', arr.data.data.id);
          let pdfUrls = arr.data.data.shorten_uri;
          if (navigator.userAgent == 'app/ApartMent') {
            Android.toBrowser(pdfUrls);
          } else {
            let data = {};
            data.date = this.formatDate(new Date());
            this.ddReceipt(pdfUrls, data);
            resolve(true);
          }
        } else {
          this.prompt(arr.data.msg);
          resolve(false);
        }
      }).catch(_ => {
        this.prompt('', 'close');
        resolve(false);
        console.log(_);
      });
    };
    Vue.prototype.ddReceipt = function (pdfUrls, val) {
      let date = val.date.split(':').join('_');
      let name = val.address + date + ".pdf";
      dd.ready(function () {
        dd.biz.cspace.saveFile({
          corpId: sessionStorage.getItem('cropID'),
          url: pdfUrls,  // 文件在第三方服务器地址， 也可为通过服务端接口上传文件得到的media_id，详见参数说明
          name: name,
          onSuccess: function (data) {
            dd.biz.cspace.preview({
              corpId: sessionStorage.getItem('cropID'),
              spaceId: data.data[0].spaceId,
              fileId: data.data[0].fileId,
              fileName: data.data[0].fileName,
              fileSize: data.data[0].fileSize,
              fileType: "pdf",
              onSuccess: function () {
                //无，直接在native显示文件详细信息
              },
              onFail: function (err) {
                // 无，直接在native页面显示具体的错误
              }
            });
          },
          onFail: function (err) {
            console.log(err);
          }
        });
      });
    }
  }
}
