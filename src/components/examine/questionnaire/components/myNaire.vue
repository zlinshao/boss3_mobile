<template>
  <div id="myNaire">
    <div class="container" :class="{'minHeight':questionNaireData.length<1}">
      <div style="position: relative;width: 100%;height: 20px;background: #f8f8f8;"></div>
      <div class="content" v-for="item in questionNaireData">
        <div class="top">
          <div style="float: left;"><img :src="personal.avatar" style="width: 50px;height: 50px;border-radius: 50%;">
          </div>
          <div style="width: 60%;float: left;margin-left: 20px;line-height: 28px;margin-top: 0px;">
            <p style="color: #333;font-size: 20px;">{{personal.name}}</p>
            <p style="font-size: 16px;">{{personal.department_name}}</p>
          </div>
          <div style="float: right;margin-right: 20px;height: 30px;line-height:30px;margin-top: 26px;color: #39b1ff;font-size: 15px;">
            <span style="font-size: 16px;" v-if="item.available">进行中</span>
            <span style="color: #e4393c;font-size: 16px;" v-else>已结束</span>
          </div>
        </div>
        <div class="info">
          <p>开始时间 <span>{{item.start_time}}</span></p>
          <p>问卷名称 <span>{{item.name}}</span></p>
        </div>
        <div style="position: relative;text-align: center;">
          <van-button class="view_history" @click="goDetail(item.id)">查看问卷结果</van-button>
        </div>
        <div style="position: relative;margin-top: 20px;width: 100%;height: 20px;background: #f8f8f8;"></div>
      </div>
      <div class="content" style="text-align: center;margin-top: 20px;" v-if="questionNaireData.length<1">
        <div  >
          <img src="../../../../assets/no_data.png" style="width: 40%;">
          <div style="margin-top: 10px;">暂无数据</div>
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
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('/beforeNaire', 'house');
        vm.ddRent('/beforeNaire', 'house');
      })
    },
    mounted() {
      this.personal = JSON.parse(sessionStorage.personal);
    },
    activated(){
      this.getQuesNaireData();
    },
    methods: {
      goDetail(val) {
        this.$router.push({path: '/naireStatistic', query: {id: val}});
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
  .minHeight{
    min-height: 600px;
  }
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
        margin: 0px 20px;
        position: relative;
        padding: 15px 0px;
        border-bottom: 1px solid #ebebeb;
        min-height: 80px;
        margin-right: 0;
      }
      .info {
        position: relative;
        padding: 10px 70px;
        margin-left: 20px;
        line-height: 30px;
        border-bottom: 1px solid #dddddd;
        p{
          font-size: 16px;
        }
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
