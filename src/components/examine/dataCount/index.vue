<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="form.counter"
        label="总业绩"
        type="text"
        @blur="percent(form.counter)"
        placeholder="请填写总业绩"
        required>
      </van-field>
      <van-field
        v-model="form.comm_rate"
        label="提成百分比"
        type="text"
        placeholder="已禁用"
        disabled>
      </van-field>
    </van-cell-group>
    <div class="titles">收房</div>
    <van-cell-group>
      <van-field
        v-model="form.lord_month_price"
        label="收房价格"
        type="text"
        placeholder="请填写收房价格"
        required>
      </van-field>
      <van-field
        v-model="form.lord_duration"
        label="收房时长"
        type="text"
        placeholder="请填写收房时长"
        required>
      </van-field>
      <van-field
        v-model="form.lord_agency_count"
        label="收房中介费"
        type="text"
        placeholder="请填写收房中介费"
        required>
      </van-field>
    </van-cell-group>
    <div class="titles">租房</div>
    <van-cell-group>
      <van-field
        v-model="form.rent_month_price"
        label="租房价格"
        type="text"
        placeholder="请填写租房价格"
        required>
      </van-field>
      <van-field
        v-model="form.rent_duration"
        label="租房时长"
        type="text"
        placeholder="请填写租房时长"
        required>
      </van-field>
      <van-field
        v-model="form.rent_agency_count"
        label="租房中介费"
        type="text"
        placeholder="请填写租房中介费"
        required>
      </van-field>
    </van-cell-group>
    <div class="titles"></div>
    <van-cell-group>
      <van-field
        v-model="allCounter"
        label="总收益"
        type="text"
        placeholder="已禁用"
        disabled>
      </van-field>
      <!--<van-field-->
      <!--v-model="form.sign_date"-->
      <!--label="签约日期"-->
      <!--readonly-->
      <!--type="text"-->
      <!--@focus="timeChoose('sign_date', form.sign_date)"-->
      <!--placeholder="请选择签约日期"-->
      <!--required>-->
      <!--</van-field>-->
    </van-cell-group>
    <div class="onBtn" @click="countMoney">计算收益</div>
    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></ChooseTime>
  </div>
</template>

<script>
  import ChooseTime from './chooseTime.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {ChooseTime, Toast},
    data() {
      return {
        url: globalConfig.server,
        timeModule: false,              //日期
        formatData: {
          paramsKey: '',                //格式化日期
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
        },
        form: {
          counter: '',
          comm_rate: '',
          lord_month_price: '',
          lord_duration: '',
          lord_agency_count: '',
          rent_month_price: '',
          rent_duration: '',
          rent_agency_count: '',
        },
        allCounter: '',
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {},
    computed: {},
    methods: {
      countMoney() {
        this.$http.get(this.url + 'salary/overflowrate/getCounter', {
          params: this.form,
        }).then(res => {
          if (res.data.code === '50010') {
            this.allCounter = res.data.data.counter;
          }
          Toast(res.data.msg);
        });
      },
      // 提成百分比
      percent(val) {
        this.$http.get(this.url + 'salary/overflowrate/getOverflowRate?num=' + val).then(res => {
          if (res.data.code === '50020') {
            this.form.comm_rate = res.data.data.comm_rate;
          } else {
            Toast(res.data.msg);
          }
        })
      },
      // 显示日期
      timeChoose(val, time) {
        setTimeout(() => {
          this.timeModule = true;
        }, 200);
        this.formatData.dateVal = time;
        this.formatData.dataKey = val;
      },
      // 确定日期
      onConTime(val) {
        this.form[val.dataKey] = val.dateVal;
        this.onCancel();
      },
      // 关闭模态框
      onCancel() {
        this.timeModule = false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .titles {
    background-color: #e5e5e5;
    height: .7rem;
    line-height: .7rem;
    padding: 0 .3rem;
    color: #aaaaaa;
  }

  .onBtn {
    width: 100%;
    background: #409EFF;
    color: #FFFFFF;
    text-align: center;
    height: .8rem;
    line-height: .82rem;
    margin: .3rem 0;
  }
</style>
