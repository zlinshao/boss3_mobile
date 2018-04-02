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
        } else {
          that.$router.push({path: '/index'});
        }
      });
    };
    Vue.prototype.ddRent = function (urls, house) {
      let that = this;
      dd.biz.navigation.setLeft({
        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
        onSuccess: function (result) {
          if (urls !== '' && house === 'house') {
            that.$router.push({path: urls});
          } else if (urls !== '' && house !== 'house') {
            that.$router.push({path: urls, query: {tops: ''}});
          } else {
            that.$router.push({path: '/index'});
          }
        },
        onFail: function (err) {
        }
      });
    };
    Vue.prototype.routerDetail = function (val) {
      this.$router.push({path: '/publishDetail', query: {data: JSON.stringify({ids: val})}});
    };
    Vue.prototype.stick = function () {
      window.scrollTo(0, document.body.scrollHeight);
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
  }
}
