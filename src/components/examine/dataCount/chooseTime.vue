<template>
  <div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="onCancel"
        @confirm="onDate"/>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "choose-time",
    props: ['module', 'formatData'],
    data() {
      return {
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeValue: '',            //日期value
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.timeShow = val;
        this.chooseTime(this.formatData.dateVal);
      },
      timeShow(val) {
        if (!val) {
          this.$emit('close');
        }
      }
    },
    computed: {},
    methods: {
      getNowTime() {
        this.timeValue = '';
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let strDate = date.getDate();
        this.currentDate = new Date(year, month, strDate);
      },
      chooseTime(val) {
        if (!val) {
          this.getNowTime();
          return
        }
        this.timeValue = val;
        let time = val.split('-');
        let time1 = Number(time[1]) - 1;
        let time2 = Number(time[2]);
        this.currentDate = new Date(time[0], time1, time2);
      },
      // 确认日期
      onDate(val) {
        this.timeValue = this.formatDate(val);
        this.timeShow = false;
        let data = {};
        data.dateVal = this.timeValue;
        data.dataKey = this.formatData.dataKey;
        this.$emit('onDate', data);
      },
      // select关闭
      onCancel() {
        this.timeShow = false;
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
