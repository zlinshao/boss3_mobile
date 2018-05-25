<template>
  <div id="myNaire">
    <div class="container">
      <div class="content">
        <div v-for="item in questionNaireData">
          <div class="top">
            <div style="float: left;"><img :src="personal.avatar" style="width: 50px;height: 50px;border-radius: 50%;">
            </div>
            <div style="width: 65%;float: left;margin-left: 20px;line-height: 35px;margin-top: -6px;">
              <p style="color: #333;font-size: 20px;">{{personal.name}}</p>
              <p style="font-size: 17px;">{{personal.department_name}}</p>
            </div>
            <div style="float: right;margin-right: 20px;margin-top: -30px;color: #39b1ff;">
              <span v-if="item.available" >进行中</span>
              <span v-else>已结束</span>
          </div>
          </div>
          <div class="info">
            <p>开始时间 <span>{{item.start_time}}</span></p>
            <p>问卷名称 <span>{{item.name}}</span></p>
          </div>
          <div style="position: relative;text-align: center;">
            <van-button class="view_history" @click="goDetail(item.id)">查看问卷结果</van-button>
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
        questionNaireData: {},
      };
    },
    mounted() {
      this.personal = JSON.parse(sessionStorage.personal);
      this.getQuesNaireData();
    },
    methods: {
      goDetail(val) {
        this.$router.push({path: '/naireStatistic', query:{id: val}});
      },
      getQuesNaireData() {
        this.$http.get(globalConfig.server + 'questionnaire/my').then((res) => {
          if (res.data.code === '30000') {
            this.questionNaireData = res.data.data.data;
            if (res.data.data.data.length < 1) {
              this.questionNaireData = [];
            }
          } else {
            this.questionNaireData = [];
          }
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    .content {
      background: #fff;
      width: 100%;
      height: 100%;
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
        background: #39b1ff;
        color: #fff;
        margin-top: 20px;
      }
    }

  }

</style>
