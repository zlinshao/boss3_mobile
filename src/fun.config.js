
export default {
  install(Vue, options) {
    Vue.prototype.routerIndex = function (url) {
      let that = this;
      document.addEventListener('backbutton', function (e) {
        e.preventDefault();
        that.$router.push({path: url});
      });
    };
    Vue.prototype.routerDetail = function (val) {
      this.$router.push({path: '/publishDetail', query: {data: JSON.stringify({ids: val})}});
    };
    Vue.prototype.stick  = function () {
      window.scrollTo(0, document.body.scrollHeight);
    };
  }
}
