<template>
  <div id="myNaire">
    <div class="container" v-if="examData.length>0">
      <div style="position: relative;width: 100%;height: 20px;background: #f8f8f8;"></div>
      <div class="content" v-for="item in examData">
        <div class="top">
          <div style="float: left;">
            <img v-if="personal.avatar" :src="personal.avatar" style="width: 50px;height: 50px;border-radius: 50%;">
            <img src="../../../../assets/head.png" v-else style="width: 50px;height: 50px;border-radius: 50%;">
          </div>
          <div style="width: 60%;float: left;margin-left: 20px;line-height: 28px;margin-top: 0px;">
            <p style="color: #333;font-size: 20px;">{{personal.name}}</p>
            <p style="font-size: 16px;">{{personal.department_name}}</p>
          </div>
          <div style="float: right;margin-right: 20px;height: 30px;line-height:30px;margin-top: 26px;color: #39b1ff;">
            <span style="font-size: 16px;" v-if="item.available">进行中</span>
            <span style="color: #e4393c;font-size: 16px;" v-else>已结束</span>
          </div>
        </div>
        <div class="info">
          <p>考试时间 <span>{{item.start_time}}</span></p>
          <p>考试名称 <span>{{item.name}}</span></p>
          <p>考试时长 <span>{{item.duration}} </span>分钟</p>
        </div>
        <div style="position: relative;text-align: center;">
          <van-button class="view_history disabled" v-if="!item.available && !item.result_id " disabled>缺考</van-button>
          <van-button class="view_history" @click="goDetail(item)" v-if="item.result_id !== 0">查看考试结果</van-button>
          <van-button class="view_history" @click="answerExam(item)" v-if="item.result_id == 0 && item.available">点击作答
          </van-button>
        </div>
        <div style="position: relative;margin-top: 20px;width: 100%;height: 20px;background: #f8f8f8;"></div>
      </div>
    </div>
    <div class="no_data" v-if="examData.length<1">
      <div class="content" style="text-align: center;margin-top: 20px;background: #fff;">
        <div class="content_img"><img src="../../../../assets/no_data2.png" style="width: 40%;"></div>
        <div class="last_title">暂无数据 ...</div>
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
        examData: {},
      };
    },

    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('/beforeExam', 'house');
        vm.ddRent('/beforeExam', 'house');
      })
    },
    mounted() {
      this.personal = JSON.parse(sessionStorage.personal);
    },
    activated() {
      this.getExamData();
    },
    methods: {
      answerExam(val) {
        this.$router.push({path: '/beforeExam', query: {id: val.id}});
      },
      goDetail(val) {
        this.$router.push({path: '/lookExam', query: {result_id: val.result_id, exam_id: val.id}});
      },
      getExamData() {
        this.$http.get(globalConfig.server + 'exam/exam/my?enrolled=1&page=1&limit=500').then((res) => {
          if (res.data.code === '30000') {
            this.examData = res.data.data.data;
            if (res.data.data.data.length < 1) {
              this.examData = [];
            }
          } else {
            this.examData = [];
          }
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .minHeight {
    min-height: 600px;
  }

  .no_data {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    .content {
      .content_img {
        position: relative;
        margin-top: 150px;
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
        font-size: 18px;
      }
    }
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
        border-bottom: 1px solid #ebebeb;
        p {
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
      .view_history.disabled {
        background: #aaaaaa;
      }
    }

  }

</style>
