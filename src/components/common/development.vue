<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="content_img"><img src="../../assets/development.png" style="width: 60%;"></div>
        <div class="last_title" style="font-size: 18px;">披星戴月开发中...</div>
        <div class="last_title" style="font-size: 18px;color: #58D788;">即将上线</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "development",
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .container {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    .content {
      .content_img {
        position: relative;
        margin-top: 100px;
      }
      .title {
        position: relative;
        margin-top: 20px;
        font-size: 25px;
        color: #39b1ff;
      }
      .last_title {
        position: relative;
        margin-top: 30px;
        font-size: 14px;
      }
    }

  }

</style>
