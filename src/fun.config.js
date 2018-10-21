export default {
  install(Vue, options) {
    Vue.prototype.routerIndex = function (url, house) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        if (url !== '' && house === 'house') {
          that.$router.push({path: url});
        } else if (url !== '' && house !== 'house') {
          that.$router.push({path: url, query: {tops: ''}});
        } else if (house === 'close') {

        } else {
          that.$router.push({path: '/index'});
        }
      });
    };
    Vue.prototype.ddRent = function (url, house) {
      let that = this;
      this.routerIndex(url, house);
    };
    Vue.prototype.routLink = function (path, params) {
      if (path === 'back') {
        this.$router.go(-1);
      } else {
        this.$router.push({path: path, query: params});
      }
    };
    Vue.prototype.routerTo = function (url, id) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        that.$router.push({path: url, query: {ids: id}});
      });
    };
    // 算钱
    Vue.prototype.countMoney = function (form) {
      let sum1 = form.front_money;
      let sum2 = form.deposit_payed;
      let sum3 = form.rent_money;
      sum1 = sum1 ? sum1 : 0;
      sum2 = sum2 ? sum2 : 0;
      sum3 = sum3 ? sum3 : 0;
      return Number(sum1) + Number(sum2) + Number(sum3);
    };
    // 数组去空字符串
    Vue.prototype.filter_array = function (array) {
      return array.filter(item => item !== '');
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
    Vue.prototype.routerDetail = function (val) {
      this.$router.push({path: '/publishDetail', query: {ids: val}});
    };

    Vue.prototype.chooseTime = function (val) {
      let time = val.split('-');
      let time1 = Number(time[1]) - 1;
      let time2 = Number(time[2]);
      return new Date(time[0], time1, time2);
    };

    Vue.prototype.stick = function () {
      window.scrollTo(0, document.getElementById('main').scrollHeight);
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
    // that.$http.get(globalConfig.server + "special/special/loginInfo").then((res) => {
    //   let data = {};
    //   data.id = res.data.data.id;
    //   data.name = res.data.data.name;
    //   data.avatar = res.data.data.avatar;
    //   data.phone = res.data.data.phone;
    //   data.department_name = res.data.data.org[0].name;
    //   data.department_id = res.data.data.org[0].id;
    //   sessionStorage.setItem('personal', JSON.stringify(data));
    //   globalConfig.personal = data;
    //   resolve(true);
    // });
    Vue.prototype.personalGet = function () {
      let that = this;
      return new Promise((resolve, reject) => {
        that.$router.push({path: '/'});
        resolve(false);
      });
    };
  }
}

// window.onerror = handleError;
//
// function handleError(msg, url, line) {
//   // let txt = "There was an error on this page.\n\n";
//   let txt = "";
//   txt += "Error: " + msg + "\n";
//   txt += "URL: " + url + "\n";
//   txt += "Line: " + line + "\n\n";
//   // txt += "Click OK to continue.\n\n";
//   // alert(txt);
//   return true;        //如果返回值为 false，则在控制台 (JavaScript console) 中显示错误消息。反之则不会
// }
