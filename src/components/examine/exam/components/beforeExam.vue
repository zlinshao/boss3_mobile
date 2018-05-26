<template>
  <div>
    <div class="container">
      <div class="content" v-show="showType==='first'">
        <div class="content_img"><img src="../../../../assets/waiting.png" style="width: 50%;"></div>
        <div class="title">您目前没有考试</div>
        <div v-show="showExamInfo">
          <div class="last_title">最近一场</div>
          <div style="margin-top: 10px;color: #333;line-height: 28px;">
            <div>场次名称：{{examData.name}}</div>
            <div>考试时间：{{examData.start_time}}</div>
          </div>
        </div>
        <van-button class="view_history" @click="goHistory">查看历史考试</van-button>
      </div>
      <div class="content" v-show="showType==='second'">
        <div class="content_img"><img src="../../../../assets/count_down.png" style="width: 50%;"></div>
        <div class="title">开考倒计时 <span style="margin-left: 15px;color: #e4393c;font-size: 20px;">{{timeString}}</span>
        </div>
        <div class="last_title">最近一场</div>
        <div style="margin-top: 10px;color: #333;line-height: 28px;">
          <div>场次名称：{{examData.name}}</div>
          <div>考试时间：{{examData.start_time}}</div>
        </div>
        <van-button class="view_history" @click="goHistory">查看历史考试</van-button>
      </div>
      <div class="content" v-show="showType==='third'">
        <div class="content_img"><img src="../../../../assets/time_out.png" style="width: 50%;"></div>
        <div class="title">您已超过规定开考时间</div>
        <div class="title" style="margin-top: 15px;color: #e4393c;">无法参加考试</div>
        <div style="margin-top: 30px;color: #333;line-height: 28px;">
          <div>如有疑问，请联系主考官</div>
        </div>
        <van-button class="view_history" @click="goHistory">查看历史考试</van-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "before-naire",
    data() {
      return {
        examData: {},
        showType: 'first',
        showExamInfo: false,
        flag: true,
        timeString: '09:59:59',
        timeClear: '',
        countDown: '',
        examDataTime: ''
      };
    },
    activated() {
      clearTimeout(this.timeClear);
      clearTimeout(this.examDataTime);
      this.confirmArrival = sessionStorage.getItem('confirmArrival');
      this.goAnswerExam();

    },
    watch: {
      countDown(num) {
        clearTimeout(this.timeClear);
        if (num >= 0) {
          this.clock(num / 1000);
        }
      },

    },
    methods: {
      goAnswerExam() {
        this.flag = false;
        this.$http.get(globalConfig.server + 'exam/active').then((res) => {
          if (res.data.code === '30000') {
            this.examData = res.data.data;
            if (this.examData.available) {
              this.flag = true;
              //有正在进行的考试
              if (this.confirmArrival && this.confirmArrival.length > 0 && this.confirmArrival.indexOf(this.examData.id) > -1) {
                this.$router.push({path: '/exam', query: {id: this.examData.id}});
              } else {
                this.$http.post(globalConfig.server + 'exam/check_in/' + this.examData.id).then((res) => {
                  if (res.data.code === '30000') {
                    let arr = [];
                    arr.push(this.examData.id);
                    sessionStorage.setItem('confirmArrival', arr);  //保存已到场的考试id
                    this.$router.push({path: '/exam', query: {id: this.examData.id}});
                  } else if (res.data.code === '30003') {
                    this.showType = 'third';
                  }
                });
              }
            } else {
              if (this.examData.id) {
                this.$http.get(globalConfig.server + 'exam/' + this.examData.id).then((res) => {
                  this.flag = true;
                  if (res.data.code === '30000') {
                    this.examData = res.data.data;
                    if ((new Date(this.examData.start_time).getTime() - (new Date().getTime())) > 10 * 60 * 1000) {
                      // 大于10分钟 暂无考试 显示最近一场考试信息
                      this.showType = 'first';
                      this.showExamInfo = true;
                    } else {
                      if ((new Date(this.examData.start_time).getTime() - (new Date().getTime())) <= 10 * 60 * 1000 && (new Date(this.examData.start_time).getTime() - (new Date().getTime())) > 0) {
                        // 距离开始时间 10分钟
                        this.flag = false;
                        clearTimeout(this.examDataTime);
                        this.showType = 'second';
                        this.countDown = new Date(res.data.data.start_time).getTime() - (new Date().getTime());
                      }
                      if ((new Date().getTime()) > (new Date(this.examData.end_time).getTime())) {
                        // 考试已结束，没有考试
                        this.showType = 'first';
                        this.showExamInfo = false;
                      }
                    }
                  }
                });
              } else {
                // 最近没有考试
                this.flag = true;
                this.showType = 'first';
                this.showExamInfo = false;
              }
              if (this.flag) {
                this.examDataTime = setTimeout(() => {
                  this.goAnswerExam();
                }, 1000);
              }
            }
          }
        });
      },
      goHistory(val) {
        this.$router.push({path: '/myExam'});
      },
      clock(n) {
        let val = Number(n);
        if (val <= 0) {
          if (this.confirmArrival && this.confirmArrival.length > 0 && this.confirmArrival.indexOf(this.examData.id) > -1) {
            this.$router.push({path: '/exam', query: {id: this.examData.id}});
          } else {
            this.$http.post(globalConfig.server + 'exam/check_in/' + this.examData.id).then((res) => {
              if (res.data.code === '30000') {
                let arr = [];
                arr.push(this.examData.id);
                localStorage.setItem('confirmArrival', arr);  //保存已到场的考试id
                this.$router.push({path: '/exam', query: {id: this.examData.id}});
              } else if (res.data.code === '30003') {
                this.showType = 'third';
              }
            });
          }
          return;
        }
        let h = Number(Math.floor(val / 3600));
        let m = 0, s = 0;
        if ((val - h * 3600) >= 0) {
          m = Number(Math.floor((val - h * 3600) / 60));
          if ((val - h * 3600 - m * 60) >= 0) {
            s = Number(Math.floor(val - h * 3600 - m * 60));
          }
        }
        if (h < 10) {
          h = '0' + h;
        }
        if (m < 10) {
          m = '0' + m;
        }
        if (s < 10) {
          s = '0' + s;
        }
        this.timeString = h + ':' + m + ':' + s;
        val--;
        this.timeClear = setTimeout(() => {
          this.clock(val);
        }, 1000);
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
    text-align: center;
    position: absolute;
    .content {
      .content_img {
        position: relative;
        margin-top: 90px;
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
      .view_history {
        position: relative;
        padding: 0px 50px;
        background: #39b1ff;
        color: #fff;
        margin-top: 20px;
      }
    }

  }

</style>
