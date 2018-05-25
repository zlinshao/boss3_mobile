<template>
  <div>
    <div class="container">
      <div class="content">
        <div v-for="item in 2">
          <div class="top">
            <div style="float: left;"><img :src="personal.avatar" style="width: 50px;height: 50px;border-radius: 50%;">
            </div>
            <div style="width: 65%;float: left;margin-left: 20px;line-height: 35px;margin-top: -6px;">
              <p style="color: #333;font-size: 20px;">{{personal.name}}</p>
              <p style="font-size: 17px;">{{personal.department_name}}</p>
            </div>
            <div style="float: right;margin-right: 20px;margin-top: -30px;color: #409EFF;">进行中</div>
          </div>
          <div class="info">
            <p>开始时间 <span>2018-01-05 10:00:00</span></p>
            <p>问卷名称 <span>2018-01-05 10:00:00</span></p>
          </div>
          <div style="position: relative;text-align: center;">
            <van-button class="view_history" @click="goDetail()">查看历史问卷</van-button>
          </div>
          <div style="position: relative;margin-top: 20px;width: 100%;height: 20px;background: #eee;"></div>
        </div>

      </div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "before-naire",
    data() {
      return {
        showType: 'first',
        personal: {},
      };
    },
    mounted() {
      this.personal = JSON.parse(sessionStorage.personal);
    },
    methods: {
      goDetail(val) {
        this.$router.push({path: '/naireStatistic'});
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    position: absolute;
    .content {
      .top {
        position: relative;
        margin: 15px 20px;
        border-bottom: 1px solid #dddddd;
        min-height: 80px;
        margin-right: 0;
      }
      .info {
        position: relative;
        padding: 10px 70px;
        margin-left: 20px;
        line-height: 30px;
        border-bottom: 1px solid #dddddd;
        span {
          color: #393939;
          margin-left: 10px;
        }
      }
      .view_history {
        position: relative;
        padding: 0px 30px;
        background: #409EFF;
        color: #fff;
        margin-top: 20px;
      }
    }

  }

</style>
