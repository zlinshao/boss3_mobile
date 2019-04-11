<template>
  <div>

  </div>
</template>

<script>
  import {Toast} from 'vant';

  export default {
    name: "index",
    data() {
      return {}
    },
    mounted() {
      this.RouterGo();
    },
    activated() {
    },
    watch: {
      $route: {
        handler(val) {
          if (val.path === '/ca') {
            this.RouterGo();
          }
        },
        deep: true
      },
    },
    computed: {},
    methods: {
      RouterGo() {
        this.$http.get(globalConfig.server + 'fdd/certification/ca',).then(res => {
          if (res.data.code === '20000') {
            window.location.href = res.data.data.url;
          } else {
            Toast.fail(res.data.msg);
            this.$router.go(-1);
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
