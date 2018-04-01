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
    Vue.prototype.routerDetail = function (val) {
      this.$router.push({path: '/publishDetail', query: {data: JSON.stringify({ids: val})}});
    };
    Vue.prototype.stick = function () {
      window.scrollTo(0, document.body.scrollHeight);
    };
  }
}
