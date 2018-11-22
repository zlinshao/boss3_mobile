<template>
  <div class="tablebox1">
    <table class="bgtable" >
      <thead>
          <tr>
          <!--汉字表头-->
          <th v-for="(item,index) in daynamearr" :key="index">{{item}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in theweek()" :key="index">
          <td v-for="(item, index) in week" :key="index" :class="{'gray': item.prevmonth || item.nextmonth}" @click="viewattendance(item.day)">
            {{item.day}}
            <div class="dot" :class="{ 'colorA': item.typesetting == 'A', 'colorB': item.typesetting == 'B','colorC': item.typesetting == 'C','colorD': item.typesetting == '休' }"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  // props: ["typesetting", "currentMonth", "currentYear"],
  props: {
    typesetting: {
      type: Object,
      default: {}
    },
    currentYM: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      daynamearr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], //本月的本期构成
      dayarr: [],
      year: "",
      month: "",
      setting: ""
    };
  },
  watch: {
    deep: true,
    typesetting(val) {
      this.setting = val;
    },
    currentYM(val) {
      this.getCalendar(val);
    }
  },
  mounted() {
    // this.getCalendar(this.month);
  },
  methods: {
    // 向父组件传值
    viewattendance(day) {
      this.$emit("myclick", day);
    },
    getCalendar(yearMonth) {
      if (yearMonth[2]) {
        this.dayarr = [];
      }
      let month = yearMonth[0];
      let year = yearMonth[1];
      var themonth1stday = new Date(year, month - 1, 1).getDay(); //需要知道这个月的第一天是星期几
      console.log(themonth1stday, "本月第一天星期几");
      //本月有多少天，这个月的最后一天就是下个月的最后一天减去一毫秒
      var y = month == 12 ? year + 1 : year;
      var m = month == 12 ? 1 : month;
      var themonthdaysamount = new Date(new Date(y, m, 1) - 1).getDate();
      console.log(themonthdaysamount, "这个月多少天");
      //上个月有多少天
      var prevmonthlastday = new Date(
        new Date(year, month - 1, 1) - 1
      ).getDate();
      console.log(prevmonthlastday, "上个月多少天");
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
    },
    theweek: function() {
      var _arr = [];
      for (var i = 0; i < 6; i++) {
        var _week = [];
        for (var j = 0; j < 7; j++) {
          _week.push(this.dayarr[i * 7 + j]);
        }
        _arr.push(_week);
      }
      let _this = this;
      let settingObj = Object.values(this.setting);
      _arr.forEach((item, index) => {
        item.forEach((val, key) => {
          if (val.currentmonth) {
            settingObj.forEach((a, b) => {
              if (_arr[index][key].day == b + 1) {
                _arr[index][key]["typesetting"] = a;
              }
            });
          }
        });
      });
      return _arr;
    },
  }
};
</script>

<style lang="scss">
.tablebox1 {
  width: 100%;
  text-align: center;
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 10px 20px;
  }
  .gray {
    color: gray;
    // visibility: hidden;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 auto;
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
}
</style>
