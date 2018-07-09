<template>
  <div>
    <input type="file" @change="tirggerFile($event)">
    {{file}}
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
    },
    activated() {
    },
    watch: {},
    methods: {
      tirggerFile(event) {
        this.file = event.target; // (利用console.log输出看结构就知道如何处理档案资料)
        console.log(event.target.files)
      },
    },
  }
</script>

<style lang="scss">

</style>
