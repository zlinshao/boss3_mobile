<template>
  <div id="attendance">
    <div class="headTop">
      <div class="topLeft">
        <div class="avatarImg">
          <img :src="avatar" alt="" v-if="avatar">
          <img src="../../assets/head.png" alt="" v-else>
        </div>
        <span class="name">{{name}}</span>
      </div>
      <div class="date" @click="showTime = true">
        <span>{{currentDate}}</span>
        <span>{{currentWeek}}</span>
      </div>
      <!-- 时间选择器 -->
      <van-popup v-model="showTime" position="bottom" :overlay="true">
        <van-datetime-picker v-model="selectTime" type="year-month" :min-date="minDate" @confirm="confirmTime" @cancel="cancelTime" />
      </van-popup>
    </div>
    <!-- <div class="calendar"  @touchmove="handleTouchMove" @touchstart="handleTouchStart" @touchend="hanfleTouchEnd"> -->
    <div class="calendar">
      <table class="bgtable">
      <thead>
          <tr>
          <!--汉字表头-->
          <th v-for="(item,index) in daynamearr" :key="index">{{item}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in arr" :key="index">
          <td v-for="(item, index) in week" :key="index" :class="{'gray': item.prevmonth || item.nextmonth}" @click.stop="viewattendance(item.day)">
            {{item.day}}
            <!-- <div class="dot" :class="{ 'colorA': item.typesetting == 'A', 'colorB': item.typesetting == 'B','colorC': item.typesetting == 'C','colorD': item.typesetting == '休' }">{{item.typesetting}} -->
            <!-- <div class="dot" :class="{ 'success': item.typesetting == 'A' || item.typesetting == 'B'|| item.typesetting == 'C','colorD': item.typesetting == '休' }">{{item.typesetting}} -->
              <div class="dot" :class="[item.correct ? 'success' : 'warning']">
              </div>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="info">
      <p>
        <span>职位:</span>
        <span>{{role}}</span>
        <!-- <span>9:00-18:00</span> -->
      </p>
      <p>
        <span>班次:</span>
        <span>{{attendanceShift}}</span>
      </p>
    </div>
    <div class="punchNum">
      <van-icon name="clock" style="color: #409eff;" />
      <span>今日打卡{{punchNum}}次，工时共计{{timeTotal}}</span>
    </div>
    <div class="steps" v-if="recode.length>0">
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
    </div>
      <div class="noData" v-else>无打卡时间</div>
      <!-- 加载 -->
      <div class="loading">
        <!-- <van-loading type="spinner" color="#409eff" v-if="loading"/> -->
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attendanceShift: "",
      typesettingDate: [],
      isNormal: "",
      isAbnormal: "",
      loading: false,
      minDate: new Date(2017, 1, 1),
      selectTime: new Date(),
      showTime: false,
      name: "",
      avatar: "", // 头像
      currentDate: "",   //
      currentWeek: "",
      position: "",
      role: "",
      typesetting: {}, // 排班
      currentYear: "", // 返回年份
      currentMonth: "", // 返回月份
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
      startX: "", // 手指开始坐标
      moverX: "", //手指滑动坐标
      endX: "",
      daynamearr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], //本月的本期构成
      dayarr: [],
      arr: [],
      recode: ""
    };
  },
  computed: {},
  methods: {
    // 获取当前排班记录
    getAttendance(date) {
      this.$http.get(globalConfig.server + "attendance/sort/sort?user_id=289&arrange_month=" + date).then(res => {   // 测试数据
      // this.$http.get(globalConfig.server + "attendance/sort/sort?arrange_month=" + date).then(res => {
          this.typesetting = {};
          console.log(res, "11111");
          if (res.data.code == "20000") {
            let arr = [];
            let userdimension = res.data.data.data.users.sort_dimension
            userdimension.forEach((item, index) => {
            let obj = {};
              item.forEach((val, kay) => {
                console.log(val)
                if(val.event_attribute == 1 && val.status == 0) {
                  obj["a"] = true;
                } else if(val.event_attribute == 2 && val.status == 0) {
                  obj["b"] = true;
                } else {

                }
              })
                arr.push(obj)
            })
            arr.forEach((item, index) => {
              if(item.a && item.b) {
                this.typesettingDate[index] = true
              } else {
                this.typesettingDate[index] = false;
              }
            })
            console.log(this.typesettingDate)
            this.typesetting = res.data.data.data.arrange;
            this.currentMonth = res.data.data.month;
            this.currentYear = res.data.data.year;
            this.getCalendar(this.currentYear, this.currentMonth, true);
            
          } else {
            this.typesetting = {};
            this.currentMonth = res.data.data.month;
            this.currentYear = res.data.data.year;
            this.getCalendar(this.currentYear, this.currentMonth, true)
          }
        });
    },
    // 获取每天的打卡记录
    getPunch(date) {
      // this.$http.get(globalConfig.server +"attendance/summary/self?sign_date=" + date).then(res => {
      this.$http.get(globalConfig.server + "attendance/summary/self?user_id=289&sign_date=" + date).then(res => { // 测试数据
          this.position = "";
          this.role = "";
          this.recode = [];
          this.goWork = "";
          this.goOffWork = "";
          this.resultWork = "";
          this.resultOffWork = "";
          this.timeTotal = 0;
          this.loading = true;
          if (res.data.code == "20000") {
            this.avatar = res.data.data.avatar;
            this.name = res.data.data.name;
            res.data.data.org.forEach((item, index) => {
              this.role += item.name + " "
            })
            res.data.data.role.forEach((item, index) => {
              this.role += item.display_name + " "
            })
            this.recode = res.data.data.sort_dimension;
            if(this.recode.length==0) {
              this.punchNum = 0
            }
            let attendanceObj = {};
            let attendanceArr = [];
            this.recode.forEach((item, index) => {
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
                this.punchNum = 1;
                this.timeTotal = 0;
                this.goWork = item.dimensions.hour + ":" + item.dimensions.minute; // 上班时间
                this.loading = false;
                this.countGoWorkTime = new Date(item.dimensions.time.replace(/-/g, "/")).getTime();
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
                this.punchNum = 2;
                this.workOff = true;
                this.goOffWork = item.dimensions.hour + ":" + item.dimensions.minute; // 下班时间
                this.counttGoOffWorkTime = new Date(item.dimensions.time.replace(/-/g, "/")).getTime();
                this.timeTotal = this.counttGoOffWorkTime - this.countGoWorkTime;
                this.timeTotal = this.getWorkTime(this.counttGoOffWorkTime,this.countGoWorkTime);
              } else if (item.event_attribute == 3) {
                this.workShift =
                  item.dimensions.hour + ":" + item.dimensions.minute; // 上班排班时间
              } else if (item.event_attribute == 4) {
                this.workOffShift =
                  item.dimensions.hour + ":" + item.dimensions.minute; // 下班排班时间
              } else {
                this.workOff = false;
                 this.punchNum = 0;
              }
            });
          }
        });
    },
    // 选择时间
    confirmTime(value) {
      this.currentYear = new Date(value).getFullYear();
      this.currentMonth = new Date(value).getMonth() + 1;
      let ym = this.currentYear + "-" + this.currentMonth
      this.currentDate = new Date(value).getFullYear() + "-" + (new Date(value).getMonth() + 1) + "-1";
      this.showTime = false;
      this.getAttendance(ym);
      this.getPunch(this.currentDate);
      this.getCalendar(this.currentYear, this.currentMonth, true);
    },
    cancelTime() {
      this.showTime = false;
    },
    // 点击日历获取排班
    viewattendance(val) {
      this.currentDate = this.currentYear + "-" + this.currentMonth + "-" + val;
      this.getCurrentWeek((new Date(this.currentDate)).getDay());
      this.getPunch(this.currentDate);
    },
    
    // 日历滑动
    handleTouchStart(e) {
      // e.preventDefault();
      this.startX = e.changedTouches[0].pageX;
    },
    handleTouchMove(e) {
      //  e.preventDefault();
      this.moverX = e.changedTouches[0].pageX;
      this.endX = this.moverX - this.startX;
    },
     hanfleTouchEnd(e) {
       let windowWidth = document.body.clientWidth / 2;
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
        let ym = this.currentYear + "-" +  this.currentMonth;
      this.currentDate = this.currentYear + "-" +  this.currentMonth + "-" + "1";
      this.getCurrentWeek((new Date(this.currentDate).getDay()));
      this.getAttendance(ym);
      this.getCalendar(this.currentYear, this.currentMonth, true);
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
        let ym = this.currentYear + "-" +  this.currentMonth;
      this.currentDate = this.currentYear + "-" +  this.currentMonth + "-" + "1";
      this.getCurrentWeek((new Date(this.currentDate).getDay()));
      this.getAttendance(ym)
      this.getCalendar(this.currentYear, this.currentMonth, true);
      }
      
    },
    // 计算上班时间
    getWorkTime(time1, time2) {
      let dateDiff = time1 - time2;
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); 
      let leave1 = dateDiff % (24 * 3600 * 1000); 
      let hours = Math.floor(leave1 / (3600 * 1000)); 
      let leave2 = leave1 % (3600 * 1000); 
      let minutes = Math.floor(leave2 / (60 * 1000)); 
      let leave3 = leave2 % (60 * 1000); 
      let seconds = Math.round(leave3 / 1000);
      return hours + "小时" + minutes + "分钟";
    },
    // 获取当天日期
    getCurrentDay() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let ym = y + "-" + m;
      this.currentDate = y + "-" + m +"-" + d;
      this.getAttendance(ym);
      this.getPunch(this.currentDate)
       this.getCalendar(y, m);
    },
    // 获取当天星期几
    getCurrentWeek(w) {
      let date = new Date();
      if(w == undefined) {
        w =date.getDay();
      }
     switch(w) {
       case 0: {
         this.currentWeek = "星期日";
       } break;
       case 1: {
          this.currentWeek = "星期一";
       } break;
       case 2: {
         this.currentWeek = "星期二";
       } break;
       case 3: {
         this.currentWeek = "星期三";
       } break;
       case 4: {
         this.currentWeek = "星期四";
       } break;
       case 5: {
         this.currentWeek = "星期五";
       } break;
       case 6: {
         this.currentWeek = "星期六";
       } break;
     }
    },
    // 获取日历
    getCalendar(year, month, isClear) {
      if (isClear) {
        this.dayarr = [];
      }
      var themonth1stday = new Date(year, month - 1, 1).getDay(); 
      // console.log(themonth1stday, "本月第一天星期几");
      var y = month == 12 ? year + 1 : year;
      var m = month == 12 ? 1 : month;
      var themonthdaysamount = new Date(new Date(y, m, 1) - 1).getDate();
      // console.log(themonthdaysamount, "这个月多少天");
      var prevmonthlastday = new Date(
        new Date(year, month - 1, 1) - 1
      ).getDate();
      // console.log(prevmonthlastday, "上个月多少天");
      while (themonth1stday-- > 0) {
        this.dayarr.unshift({
          day: prevmonthlastday--,
          prevmonth: true,
          currentmonth: false
        });
      } //本月的日期
      var count = 0;
      while (themonthdaysamount--) {
        this.dayarr.push({
          day: ++count,
          currentmonth: true
        });
      }
      var c = 42 - this.dayarr.length;
      var count2 = 1;
      while (c-- > 0) {
        this.dayarr.push({
          day: count2++,
          nextmonth: true,
          currentmonth: false
        });
      }
      var _arr = [];
      for (var i = 0; i < 6; i++) {
        var _week = [];
        for (var j = 0; j < 7; j++) {
          _week.push(this.dayarr[i * 7 + j]);
        }
        _arr.push(_week);
      }
      let _this = this;
      let settingObj = Object.values(this.typesetting);
        console.log(this.typesettingDate);
        let typeArr = [];
        // typeArr = Object.values(this.typesettingDate);
        for(let key in _this.typesettingDate) {
          typeArr.push(_this.typesettingDate[key])
        // console.log(typeArr);
        }
      _arr.forEach((item, index) => {
          item.forEach((val, key) => {
            if (val.currentmonth) {
              settingObj.forEach((a, b) => {
                if (_arr[index][key].day == b + 1) {
                  _arr[index][key]["typesetting"] = a;
                }
              });
              typeArr.forEach((c, d) => {
                // console.log(_arr[index][key].day)
                if(_arr[index][key].day == d + 1) {
                  _arr[index][key]["correct"] = c
                }
              })
            }
          });
      });
      console.log(_arr, "00000 ")
      this.arr = _arr
    },
  },
  activated() {
    this.getCurrentDay();
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
    // position: relative;
    // z-index: 999;
    width: 100%;
    text-align: center;
    background: rgba(235, 235, 235, 0.2);
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 10px 15px;
    }
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
  .dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin: 0 auto;
  }
  .gray {
    color: gray;
    visibility: hidden;
  }
  .warning {
    background-color: #f90;
  }
  .success {
    background-color: #4d90fe;
  }
  .colorA {
    background-color: #f56c6c;
  }
  .colorB {
    background-color: #e6a23c;
  }
  .colorC {
    background-color: #67c23a;
  }
  .colorD {
    background-color: #c4c4c4;
  }
  .noData {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #999;
  }
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }
}
</style>
