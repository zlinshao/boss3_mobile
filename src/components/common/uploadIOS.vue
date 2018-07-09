<template>
  <div>
    <div :id="ID" @click="active" style="width: 200px;height: 30px;background-color: #aaaaaa;"></div>
  </div>
</template>

<script>
  export default {
    name: "upload-ios",
    props: ['ID', 'editImage', 'isClear'],
    data() {
      return {}
    },
    mounted() {
    },
    activated() {
    },
    watch: {},
    methods: {
      active() {
        window.webkit.messageHandlers.senderModel.postMessage();
      },
    },
  }
</script>

<style lang="scss">

</style>
