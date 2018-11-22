<template>
  <div id="attendance"  @touchmove="handleTouchMove" @touchstart="handleTouchStart" @touchend="hanfleTouchEnd">
    <div class="headTop">
      <div class="topLeft">
        <div class="avatarImg">
          <img :src="avatar" alt="" v-if="avatar">
          <img src="../../assets/head.png" alt="" v-else>
        </div>
        <span class="name">{{name}}</span>
      </div>
      <div class="date">
        <span>{{currentDate}}</span>
        <span>{{currentWeek}}</span>
      </div>
    </div>
    <div class="calendar" >
      <calendar :typesetting="typesetting"  :currentYM="currentYM"  @myclick="changeattendance" ></calendar>
    </div>
    <div class="info">
      <p>
        <span>职位:</span>
        <span>{{role}}</span>
        <span>9:00-18:00</span>
      </p>
      <p>
        <span>考勤组:</span>
        <span>{{position}}</span>
      </p>
    </div>
    <div class="punchNum">
      <van-icon name="clock" style="color: #409eff;" />
      <span>今日打卡{{punchNum}}次，工时共计{{timeTotal}}</span>
    </div>
    <div class="steps">
      <van-steps direction="vertical" :active-color="'#409eff'">
        <van-step>
          <span>打卡时间</span>
          <span>{{goWork}}</span>
          <span>(上班时间{{workShift}})</span>
          <p>
            <van-tag round type="primary">{{resultWork}}</van-tag>
          </p>
        </van-step>
        <van-step v-if="workOff">
          <span>打卡时间</span>
          <span>{{goOffWork}}</span>
          <span>(下班时间{{workOffShift}})</span>
          <p>
            <van-tag round type="primary" :class="{'warning': resultOffWork =='补卡'}">{{resultOffWork}}</van-tag>
          </p>
        </van-step>
      </van-steps>
      <!-- <div class="noData">{{msg}}</div> -->
    </div>
  </div>
</template>

<script>
import calendar from "./calendar";
export default {
  components: { calendar },
  data() {
    return {
      // active: 0,
      name: "",
      currentDate: "",
      currentWeek: "",
      position: "",
      role: "",
      typesetting: {}, // 排班
      currentYear: "", // 年
      currentMonth: "", // 当前月
      currentYM: [],
      avatar: "", // 头像
      resultWork: "", //上班打卡正常
      resultOffWork: "", // 下班打卡正常
      goWork: "", //上班时间
      goOffWork: "", //下班时间
      workShift: "", //上班排班时间
      workOffShift: "", //下班排班时间
      timeTotal: "", // 工作时长
      punchNum: "", // 打卡次数
      workOff: "", // 下班
      countGoWorkTime: "", // 上班打卡时间
      counttGoOffWorkTime: "", // 下班打卡时间
      viewDate: "", // 子组件日期
      currentTime: "",
      noData: true,
      msg: "",
      startX: "", // 手指开始坐标
      moverX: "", //手指滑动坐标
      endX: "",
      yearMonth: "",
      // isClear: false,
    };
  },
  watch: {},
  methods: {
    // 获取当前排班记录
    getAttendance(date) {
      console.log(date, "66666");
      this.$http.get(globalConfig.server + "attendance/sort/sort?arrange_month=" + date).then(res => {
          console.log(res, "7777");
           this.position = "";
            this.role = "";
          if (res.data.code == "20000") {
            this.name = res.data.data.data.users.name;
            this.avatar = res.data.data.data.users.avatar;
            res.data.data.data.users.org.forEach((item, index) => {
              this.position += item.name + " ";
            });
            res.data.data.data.users.role.forEach((item, index) => {
              this.role += item.display_name + " ";
            });
            this.typesetting = res.data.data.data.arrange;
            this.currentMonth = res.data.data.month;
            this.currentYear = res.data.data.year;
            this.currentYM = [this.currentMonth,  this.currentYear, this.isClear];
            console.log(this.typesetting, "33333");
            
          } else {
            Toast(res.msg);
            this.typesetting = {}
          }
        });
    },
    // 获取登陆的打卡以及审批记录
    getPunch(date) {
      this.$http.get(globalConfig.server +"attendance/summary/self?sign_date=" + date).then(res => {
          // this.$http.get(globalConfig.server + "attendance/summary/self?user_id=289").then(res => {
          if (res.data.code == "20000") {
            let recode = res.data.data.sort_dimension;
            let attendanceObj = {};
            let attendanceArr = [];
            recode.forEach((item, index) => {
              if (item.event_attribute == 1) {
                if (item.status == 0) {
                  this.resultWork = "正常";
                } else if (item.status == 1) {
                  this.resultWork = "迟到";
                } else if (item.status == 3) {
                  this.resultWork = "补卡";
                } else if (item.status == 4) {
                  this.resultWork = "外勤";
                }
                // attendanceArr.push(this.resultWork)
                this.punchNum = 1;
                this.timeTotal = 0;
                this.goWork =
                  item.dimensions.hour + ":" + item.dimensions.minute; // 上班时间
                this.countGoWorkTime = new Date(
                  item.dimensions.time.replace(/-/g, "/")
                ).getTime();
              } else if (item.event_attribute == 2) {
                if (item.status == 2) {
                  this.resultOffWork = "早退";
                } else if (item.status == 3) {
                  this.resultOffWork = "补卡";
                } else if (item.status == 0) {
                  this.resultOffWork = "正常";
                } else if (item.status == 4) {
                  this.resultWork = "外勤";
                }
                // attendanceArr.push(this.resultWork)
                this.punchNum = 2;
                this.workOff = true;
                // this.active = 1;
                this.goOffWork =
                  item.dimensions.hour + ":" + item.dimensions.minute; // 下班时间
                this.counttGoOffWorkTime = new Date(
                  item.dimensions.time.replace(/-/g, "/")
                ).getTime();
                this.timeTotal =
                  this.counttGoOffWorkTime - this.countGoWorkTime;
                this.timeTotal = this.getWorkTime(
                  this.counttGoOffWorkTime,
                  this.countGoWorkTime
                );
              } else if (item.event_attribute == 3) {
                this.workShift =
                  item.dimensions.hour + ":" + item.dimensions.minute; // 上班排班时间
              } else if (item.event_attribute == 4) {
                this.workOffShift =
                  item.dimensions.hour + ":" + item.dimensions.minute; // 下班排班时间
              } else {
                this.workOff = false;
              }
            });
            // console.log(attendanceArr, "000000");
            
          } else {
            this.timeTotal = 0;
            this.punchNum = 0;
            // this.noData = false;
            this.msg = res.data.msg;
          }
        });
    },
    // 接受子组件的日期
    changeattendance(val) {
      console.log(val, "2222");
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      this.viewDate = y + "-" + m + "-" + val;
      this.getPunch(this.viewDate);
      this.currentDate = this.viewDate;
      this.getCurrentWeek(new Date(this.viewDate).getDay());
    },
    // 计算上班时间
    getWorkTime(time1, time2) {
      let dateDiff = time1 - time2;
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
      //计算相差秒数
      let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);
      return hours + "小时" + minutes + "分钟";
    },
    // 获取日期
    getCurrentDate() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      this.yearMonth = y + "-" + m;
      this.currentDate = y + "-" + m + "-" + d;
      this.currentTime = new Date(this.currentDate).getDay();
    },
    // 获取周几
    getCurrentWeek(aa) {
      let date = new Date();
      let w = date.getDay();
      if (aa == undefined) {
        aa = w;
      }
      switch (aa) {
        case 0:
          {
            this.currentWeek = "星期日";
          }
          break;
        case 1:
          {
            this.currentWeek = "星期一";
          }
          break;
        case 2:
          {
            this.currentWeek = "星期二";
          }
          break;
        case 3:
          {
            this.currentWeek = "星期三";
          }
          break;
        case 4:
          {
            this.currentWeek = "星期四";
          }
          break;
        case 5:
          {
            this.currentWeek = "星期五";
          }
          break;
        case 6:
          {
            this.currentWeek = "星期六";
          }
          break;
        case 7:
          {
            this.currentWeek = "星期日";
          }
          break;
      }
    },
    // 手机点击事件
    handleTouchStart(e) {
      // e.preventDefault();
      this.startX = e.changedTouches[0].pageX;
    },
    // 手机 滑动事件
    handleTouchMove(e) {
      // e.preventDefault();
      this.moverX = e.changedTouches[0].pageX;
      this.endX = this.moverX - this.startX;
    },
    // 手机滑动结束事件
    hanfleTouchEnd(e) {
       let windowWidth = document.body.clientWidth / 3;
      //  e.preventDefault();
      //  向左滑动
      if (this.endX > 0 && Math.abs(this.endX) > windowWidth) {
        if (this.currentMonth == 0) {
          this.currentMonth = 12;
          this.currentYear = Number(this.currentYear) - 1;
        } else {
          this.currentMonth = Number(this.currentMonth) - 1;
        }
        this.typesetting = {}
      } 
      // 向右滑动
      if(this.endX < 0 && Math.abs(this.endX) > windowWidth) {
        if(this.currentMonth == 12) {
          this.currentMonth = 1;
          this.currentYear = Number(this.currentYear) + 1;
        } else {
          this.currentMonth = Number(this.currentMonth) + 1;
        }
        this.typesetting = {}
      }
      this.isClear = true;
      this.currentYM = [this.currentMonth, this.currentYear, this.isClear]
      let yM = this.currentYear + "-" + this.currentMonth;
      this.currentDate = yM + "-" + "1";
      this.getCurrentWeek(new Date(this.currentDate).getDay())
      this.getAttendance(yM);
    }
  },
  created() {
    this.getAttendance(this.yearMonth);
    this.getPunch();
    this.getCurrentDate();
    this.getCurrentWeek();
  }
};
</script>

<style lang="scss">
#attendance {
  .headTop {
    padding: 10px;
    overflow: hidden;
    font-size: 12px;
    background-color: #fff;
  }
  .topLeft {
    position: relative;
    width: 28%;
    float: left;
  }
  .avatarImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: inline-block;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .name {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .date {
    float: right;
    margin-top: 20px;
  }
  .calendar {
    position: relative;
    z-index: 999;
    width: 100%;
    text-align: center;
    background: rgba(235, 235, 235, 0.2);
  }
  .info {
    line-height: 30px;
    padding-left: 10px;
    margin-bottom: 2px;
    font-size: 12px;
    color: #999;
  }
  .punchNum {
    line-height: 30px;
    background: #fff;
    padding-left: 10px;
    margin-bottom: 2px;
  }
  .van-step--vertical {
    padding: 20px 10px 20px 0;
  }
  .warning {
    background-color: #f90;
  }
  .noData {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #999;
  }
}
</style>
