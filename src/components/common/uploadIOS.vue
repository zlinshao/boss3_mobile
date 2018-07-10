<template>
  <div>
    <div :id="ID" style="width: 200px;height: 50px;background-color: #AAA;"></div>
  </div>
</template>

<script>
  export default {
    name: "upload-ios",
    props: ['ID', 'editImage', 'isClear'],
    data() {
      return {
        file: {},
      }
    },
    mounted() {
      this.getTokenMessage();
    },
    activated() {
    },
    watch: {},
    methods: {
      // 获取token
      getTokenMessage() {
        this.$http.get(globalConfig.server_user + 'files').then((res) => {
          let token = res.data.data;
          let domain = globalConfig.domain;
          let config = {
            useCdnDomain: true,
            disableStatisticsReport: false,
            retryCount: 2,
            // region: qiniu.region.z2,
          };
          let putExtra = {
            fname: "",
            params: {},
            mimeType: null,
          };
          this.uploadWithSDK(token, putExtra, config, domain);
        })
      },
      uploadWithSDK(token, putExtra, config, domain) {
        let that = this;
        $(that.ID).unbind("change").bind("change", function () {
          let file = this.files[0];
          console.log(file);
          alert(file);
          let finishedAttr = [];
          let compareChunks = [];
          let observable;
          if (file) {
            let key = file.name;
          }
        });
      }
    },
  }
</script>

<style lang="scss">

</style>
