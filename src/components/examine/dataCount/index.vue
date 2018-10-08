<template>
  <div id="dataCount">
    <div class="checks">
      <div class="checkTitle">出租类型</div>
      <van-radio-group v-model="rentType">
        <van-radio name="0">新租</van-radio>
        <van-radio name="1">二次出租</van-radio>
      </van-radio-group>
    </div>
    <van-cell-group>
      <van-field
        v-model="form.counter"
        label="总业绩"
        type="text"
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
        label="收房年限(年)"
        type="text"
        placeholder="请填写收房年限"
        required>
      </van-field>
      <van-field
        v-if="rentType === '0'"
        v-model="form.lord_agency_count"
        label="收房中介费"
        type="text"
        placeholder="请填写收房中介费"
        required>
      </van-field>
      <van-field
        v-if="rentType === '0'"
        v-model="form.lord_vacancy_date"
        label="收房空置期"
        type="text"
        placeholder="请填写天数"
        required>
      </van-field>
      <van-field
        v-if="rentType === '0'"
        v-model="formatData.payWay"
        @click="selectShow()"
        label="收房付款方式"
        placeholder="请填写选择付款方式"
        type="text"
        readonly
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
        v-model="form.rent_agency_count"
        label="租房中介费"
        type="text"
        placeholder="请填写租房中介费"
        required>
      </van-field>
      <van-field
        v-model="form.rent_pay_way"
        label="租房付款方式"
        type="text"
        placeholder="请填写月数"
        required>
      </van-field>
      <van-field
        v-model="form.rent_vacancy_date"
        label="租房消耗空置期"
        type="text"
        placeholder="请填写天数"
        required>
      </van-field>
      <van-field
        v-model="form.rent_return_day"
        label="回款时长"
        type="text"
        placeholder="请填写天数"
        required>
      </van-field>
      <van-field
        v-model="form.rent_return_money"
        label="未回款金额"
        type="text"
        placeholder="请填写未回款金额"
        required>
      </van-field>
    </van-cell-group>
    <!--<van-cell-group>-->
    <!--<van-field-->
    <!--v-model="form.sign_date"-->
    <!--label="签约日期"-->
    <!--readonly-->
    <!--type="text"-->
    <!--@focus="timeChoose('sign_date', form.sign_date)"-->
    <!--placeholder="请选择签约日期"-->
    <!--required>-->
    <!--</van-field>-->
    <!--</van-cell-group>-->
    <div class="onBtn" @click="countMoney">计算收益</div>
    <div class="result">
      <div class="result1">
        <div class="result2">
          <div class="title">类型</div>
          <div v-for="(key,index) in showData">{{key}}</div>
        </div>
      </div>
      <div class="result1">
        <div class="result2 collect">
          <div class="title">收房人</div>
          <div v-for="key in Object.keys(showData)">
            <span v-if="lordData[key]">{{lordData[key]}}</span>
            <span v-else>/</span>
          </div>
        </div>
      </div>
      <div class="result1">
        <div class="result2 renter">
          <div class="title">租房人</div>
          <div v-for="key in Object.keys(showData)">
            <span v-if="rentData[key]">{{rentData[key]}}</span>
            <span v-else>/</span>
          </div>
        </div>
      </div>
      <div class="result1">
        <div class="result2 all">
          <div class="title">合计</div>
          <div v-for="key in Object.keys(showData)">
            <span v-if="allData[key]">{{allData[key]}}</span>
            <span v-else>/</span>
          </div>
        </div>
      </div>
    </div>

    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="pickerModule" position="bottom"
               :overlay="true">
      <van-picker
        show-toolbar
        :columns="payValues"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

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
        address: '',
        rentType: '0',
        timeModule: false,              //日期
        pickerModule: false,            //
        payValues: [],
        payKeys: [],
        payWay: {
          '1': '月付',
          '2': '双月付',
          '3': '季付',
          '4': '半年付',
          '5': '年付',
        },
        formatData: {
          paramsKey: '',                //格式化日期
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          payWay: '',
        },
        form: {
          comm_rate: 100,
        },

        lordData: {},
        rentData: {},
        allData: {},
        showData: {}
      }
    },
    created() {
      this.resetting();
    },
    mounted() {
      this.address = 'salary/achievement_counter/getCounter';
    },
    activated() {
    },
    watch: {
      rentType(val) {
        this.resetting();
        if (val === '0') {
          this.address = 'salary/achievement_counter/getCounter';
        } else {
          this.address = 'salary/overflowrate/getSecondRent';
          delete this.showData.push_rate;
        }
      }
    },
    computed: {},
    methods: {
      // 计算收益
      countMoney() {
        Toast.loading({
          duration: 0,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: 'loading...'
        });
        this.$http.post(this.url + this.address, this.form).then(res => {
          Toast.clear();
          if (res.data.code === '50010') {
            this.handleData(res.data.data);
          } else {
            Toast(res.data.msg);
          }
        }).catch(() => {
          Toast.clear();
        });
      },
      handleData(data) {
        this.rentData = data.rent;
        this.rentData.pay_way_rent = data.rent.pay_way;
        this.rentData.agency_count_rent = data.rent.agency_count;
        this.allData = data.all;
        if (this.rentType === '1') return;
        this.lordData = data.lord;
        this.lordData.pay_way_lord = data.lord.pay_way;
        this.lordData.agency_count_lord = data.lord.agency_count;

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
      // select
      selectShow() {
        setTimeout(() => {
          this.pickerModule = true;
        }, 200);
        this.payValues = Object.values(this.payWay);
        this.payKeys = Object.keys(this.payWay);
      },
      // select
      onConfirm(value, index) {
        this.form.lord_pay_way = this.payKeys[index];
        this.formatData.payWay = value;
        this.onCancel();
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
        this.pickerModule = false;
        this.timeModule = false;
      },
      // 重置
      resetting() {
        this.form = {};
        this.lordData = {};
        this.rentData = {};
        this.allData = {};
        this.form.comm_rate = 100;
        this.showData = JSON.parse(JSON.stringify(rentTitle));
      },
    },
  }
</script>

<style lang="scss">
  #dataCount {
    .checks {
      display: flex;
      display: -webkit-flex;
      padding: 0 15px;
      background-color: #fff;
      .checkTitle {
        max-width: 150px;
      }
    }
    .van-cell.van-hairline.van-field {
      .van-cell__title {
        width: 150px;
      }
      /*.van-cell__value {*/
      /*padding-left: 150px;*/
      /*}*/
    }
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
    .result {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      div {
        text-align: center;
      }
      .result1 {
        width: 100%;
        .result2 {
          display: flex;
          flex-direction: column;
          div {
            white-space: nowrap;
            padding: .2rem;
            border-top: 1px solid #fff;
          }
          .title {
            border: 0;
            background-color: rgba(0, 0, 0, .3);
            color: #FFF;
          }
        }
        .collect {
          div {
            background: #409EFF;
            color: #fff;
          }
        }
        .renter {
          div {
            background: #FF8000;
            color: #fff;
          }
        }
        .all {
          div {
            background: #3DCF52;
            color: #fff;
          }
        }
      }
    }
  }
</style>
