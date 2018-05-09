<template>
  <div>
    <div class="m">
      <video id="my-video" class="video-js" controls preload="auto" width="340" height="400"
             poster="../../../assets/video.js/m.png" data-setup="{}">
        <source src="http://jq22com.qiniudn.com/jq22-sp.mp4" type="video/mp4">
      </video>
    </div>
  </div>
</template>

<script>
  export default {
    name: "video1",
    data() {
      return {}
    },
    mounted() {
      videojs("my-video").ready(function () {
        this.play();
      });
    },
    watch: {},
    methods: {},
  }
</script>

<style lang="scss">
  .m {
    width: 740px;
    height: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
  }
</style>
