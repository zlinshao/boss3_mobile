<template>
  <div id="dataCount">
    <div class="module" v-if="loading">
      <img src="../../../assets/data_count.jpg">
    </div>
    <div v-if="!loading">
      <div class="dataMain">
        <div v-show="showContent !== 3">
          <van-cell-group>
            <van-field
              v-model="form.house_name"
              label="房屋地址"
              type="text"
              readonly
              @click="searchSelect('house')"
              placeholder="请选择房屋地址"
              required>
            </van-field>
          </van-cell-group>
          <div class="checks">
            <div class="checkTitle">出租类型</div>
            <van-radio-group v-model="rentType" class="radioRent">
              <van-radio name="0">新租</van-radio>
              <van-radio name="1">二次出租</van-radio>
            </van-radio-group>
          </div>
          <van-cell-group>
            <van-field
              v-model="form.counter"
              label="总业绩"
              type="number"
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
              type="number"
              placeholder="请填写收房价格"
              required>
            </van-field>
            <van-field
              v-if="rentType === '1'"
              v-model="form.lord_duration"
              label="收房年限(年)"
              type="number"
              placeholder="请填写收房年限"
              disabled
              required>
            </van-field>
            <van-field
              v-if="rentType === '0'"
              v-model="form.lord_duration"
              label="收房年限(年)"
              type="number"
              placeholder="请填写收房年限"
              required>
            </van-field>
            <van-field
              v-if="rentType === '0'"
              v-model="form.lord_vacancy_date"
              label="收房空置期"
              type="number"
              placeholder="请填写天数"
              required>
            </van-field>
            <van-field
              v-if="rentType === '0'"
              v-model="form.lord_agency_count"
              label="收房渠道费"
              type="number"
              placeholder="请填写收房渠道费"
              required>
            </van-field>

            <van-field
              v-if="rentType === '0'"
              v-model="formatData.lord_pay_way"
              @click="selectShow('lord_pay_way')"
              label="收房付款方式"
              placeholder="请填写选择付款方式"
              type="text"
              readonly
              required>
            </van-field>
            <!-- <van-field
              v-model="form.lord_property_fee"
              v-if="rentType === '0'"
              label="物业费"
              type="number"
              placeholder="请填写收房物业费"
              required>
            </van-field> -->
          </van-cell-group>
          <div class="titles">租房</div>
          <van-cell-group>
            <van-field
              v-model="form.rent_month_price"
              label="租房价格"
              type="number"
              placeholder="请填写租房价格"
              required>
            </van-field>
            <van-field
              v-model="form.rent_pay_way"
              label="租房付款方式"
              type="number"
              placeholder="请填写月数"
              required>
            </van-field>
            <van-field
              v-model="form.rent_vacancy_date"
              label="租房消耗空置期"
              type="number"
              placeholder="请填写天数"
              required>
            </van-field>
            <van-field
              v-model="form.rent_agency_count"
              label="租房渠道费"
              type="number"
              placeholder="请填写租房渠道费"
              required>
            </van-field>
            <van-field
              v-model="form.rent_sign_month"
              label="签约时长(月)"
              type="number"
              placeholder="请填写"
              required>
            </van-field>
            <!-- <van-field
              v-show='false'
              v-if="rentType === '0'"
              v-model="form.rent_return_day"
              label="回款时长"
              type="number"
              placeholder="请填写天数"
              disabled
              required>
            </van-field>
            <van-field
              v-show='false'
              v-if="rentType === '0'"
              v-model="form.rent_return_money"
              label="未回款金额"
              type="number"
              placeholder="请填写未回款金额"
              disabled
              required>
            </van-field> -->
          </van-cell-group>
          <!--<van-cell-group>-->
          <!--<van-field-->
          <!--v-model="form.sign_date"-->
          <!--label="签约日期"-->
          <!--readonly-->
          <!--type="number"-->
          <!--@focus="timeChoose('sign_date', form.sign_date)"-->
          <!--placeholder="请选择签约日期"-->
          <!--required>-->
          <!--</van-field>-->
          <!--</van-cell-group>-->
          <div class="titles" v-show="showContent === 2">计算结果</div>
        </div>
        <!--v-show="showContent === 2"-->
        <div class="results" v-show="showContent === 2">
          <div class="result">
            <div class="result1">
              <div class="result2 types">
                <div class="title">类型</div>
                <div v-for="(key,index) in showData" :class="{'colorRed': index === 'real_money'}">{{key}}</div>
              </div>
            </div>
            <div class="result1">
              <div class="result2 collect">
                <div class="title">收房人</div>
                <div v-for="key in Object.keys(showData)"
                     :class="{'colorRed': key === 'real_money' || key === 'extra_award'}">
                  <span v-if="lordData[key]">{{lordData[key]}}</span>
                  <span v-else>/</span>
                </div>
              </div>
            </div>
            <div class="result1">
              <div class="result2 renter">
                <div class="title">租房人</div>
                <div v-for="key in Object.keys(showData)"
                     :class="{'colorRed': key === 'real_money' || key === 'extra_award'}">
                  <span v-if="rentData[key]">{{rentData[key]}}</span>
                  <span v-else>/</span>
                </div>
              </div>
            </div>
            <div class="result1">
              <div class="result2 all">
                <div class="title">合计</div>
                <div v-for="key in Object.keys(showData)"
                     :class="{'colorRed': key === 'real_money' || key === 'extra_award'}">
                  <span v-if="allData[key]">{{allData[key]}}</span>
                  <span v-else>/</span>
                </div>
              </div>
            </div>
          </div>
          <div class="managerData">
            <div class="manager title">
              <div>&nbsp;</div>
              <div>区域经理</div>
              <div>片区经理</div>
            </div>
            <div class="manager nums">
              <div class="title">
                业绩
              </div>
              <div>
                {{warden.ach}}
              </div>
              <div>
                {{manager.ach}}
              </div>
            </div>
            <div class="manager nums">
              <div class="title">
                收房空置期认责
              </div>
              <div>
                {{warden.duty}}
              </div>
              <div>
                {{manager.duty}}
              </div>
            </div>
          </div>
        </div>
        <div v-show="showContent === 3">
          <van-cell-group>
            <van-field
              v-for="(item,index) in setData"
              :key="index"
              v-model="params[item.setting_key]"
              :label="item.setting_desc"
              type="number"
              placeholder="请填写数字"
              required>
            </van-field>
          </van-cell-group>
        </div>
      </div>

      <div class="footerReport" v-if="showContent === 3">
        <div @click="showContent = 1">返回上一步</div>
        <div @click="setScale()">确认设置</div>
      </div>
      <div class="footerReport" v-if="showContent !== 3">
        <div @click="emptyForm">清空</div>
        <div v-show="noPower" @click="getScale(2)">设置影响比例</div>
        <div @click="countMoney">计算收益</div>
      </div>
      <Picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onCancel"
              @succeed="onConPicker"></Picker>
    </div>
    <!--日期筛选-->
    <!--<ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></ChooseTime>-->
  </div>
</template>

<script>
  import ChooseTime from '../../common/chooseTime.vue'
  import Picker from '../../common/picker.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {ChooseTime, Toast, Picker},
    data() {
      return {
        url: globalConfig.server,
        address: '',
        rentType: '0',
        timeModule: false,              //日期
        pickerModule: false,            //下拉框
        showContent: 1,                 //显示模块
        //显示模块
        noPower: false,
        payValues: [],
        payKeys: [],
        // 下拉相关
        pickers: {
          id: '',
          ids: [],
          index: '',
          columns: [],                    //下拉数据
        },
        formatData: {
          paramsKey: '',                //格式化日期
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          lord_pay_way: '',             //收房付款方式
        },
        form: {},
        manager: {},
        warden: {},
        lordData: {},
        rentData: {},
        allData: {},
        showData: {},

        setData: [],
        params: {},
        loading: true,                //加载动画
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.path === '/index') {
          vm.loading = true;
        }
        setTimeout(() => vm.loading = false, 1500);
        let detail = vm.$store.state.app.searchDetail;
        if (Object.keys(detail).length > 0) {
          switch (from.path) {
            case '/searchHouse':
              vm.searchInfo(detail, 'house');
              break;
            case '/searchStaff':
              vm.searchInfo(detail, 'staff');
              break;
            case '/searchDepart':
              vm.searchInfo(detail, 'depart');
              break;
          }
        }
      })
    },
    created() {
      this.showData = JSON.parse(JSON.stringify(rentTitle_calculate));
    },
    mounted() {
      this.emptyForm();
      this.address = 'salary/achievement_counter/getCounter';
      this.getScale(1);
    },
    activated() {
      this.goBack('/index');
    },
    watch: {
      rentType(val) {
        this.resetting();
        if (val === '0') {
          this.address = 'salary/achievement_counter/getCounter';
        } else {
          this.form.lord_duration = 3;
          this.address = 'salary/overflowrate/getSecondRent';
          delete this.showData.push_rate;
        }
      }
    },
    computed: {},
    methods: {
      searchInfo(data, val) {
        switch (val) {
          case 'house':
            this.form.house_id = data.house_id;
            this.form.house_name = data.house_name;
            this.form.comm_rate = '';
            this.form.counter = 400000;

            this.form.lord_month_price = data.archievementdata.lord_month_price;
            // this.form.lord_duration = data.archievementdata.lord_duration;
            // this.form.lord_duration = 3;
            this.form.lord_agency_count = data.archievementdata.lord_agency_count;
            this.form.lord_vacancy_date = data.archievementdata.lord_vacancy_date;
            // this.formatData.lord_pay_way = data.archievementdata.lord_pay_way;
            this.form.lord_property_fee = data.archievementdata.lord_property_fee;

            this.form.rent_month_price = '';
            this.form.rent_agency_count = '';
            this.form.rent_pay_way = '';
            this.form.rent_vacancy_date = '';
            this.form.rent_sign_month = 0;  //签约时长
            this.form.rent_return_day = 0;
            this.form.rent_return_money = 0;
            console.log("-----form");
            console.log(this.form);
            this.form = Object.assign({}, this.form);
            // this.$set(this.form,Object.keys(this.form), Object.values(this.form))

            break;
          case 'staff':
            this.form.staff_id = data.staff_id;
            this.form.staff_name = data.staff_name;
            break;
          case 'depart':
            this.form.department_id = data.id;
            this.form.department_name = data.name;
            break;
        }
      },
      // 获取设置比例 参数
      getScale(val) {
        this.$http.get(this.url + 'salary/achievement_counter/getSettings').then(res => {
          if (res.data.code === '50030') {
            if (val !== 1) {
              this.showContentVal(3);
            }
            this.noPower = true;
            this.setData = res.data.data;
            for (let item of res.data.data) {
              this.params[item.setting_key] = item.setting_value;
            }
          } else {
            if (res.data.code !== '50099') {
              Toast(res.data.msg);
            }
          }
        });
      },
      //跳到搜索框
      searchSelect(val) {
        switch (val) {
          case 'house':
            this.routLink('/searchHouse', {type: 'lord'});
            break;
          case 'staff':
            this.routLink('/searchStaff');
            break;
          case 'depart':
            this.routLink('/searchDepart');
            break;
        }
      },
      // 设置影响比列
      setScale() {
        this.showLoad('正在设置...');
        this.$http.post(this.url + 'salary/achievement_counter/saveSettings', this.params).then(res => {
          Toast.clear();
          if (res.data.code === '50040') {
            this.showContentVal(1);
            Toast.success(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        }).catch(() => {
          Toast.clear();
        });
      },
      // 变更数据
      handleData(data) {
        this.rentData = data.rent;
        this.rentData.pay_way_rent = data.rent.pay_way;
        this.rentData.agency_count_rent = data.rent.agency_count;
        this.allData = data.all;
        // if (this.rentType === '1') return;
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
      // 显示下拉
      selectShow(val, index) {
        setTimeout(() => {
          this.pickerModule = true;
        }, 200);
        let dict;
        if (typeof val === 'string') {
          dict = dicties[val];
        } else {
          dict = this.dictData[val];
        }
        this.pickers.columns = Object.values(dict);
        this.pickers.ids = Object.keys(dict);
        this.pickers.id = val;
        this.pickers.index = index;
      },
      // 下拉选择结果
      onConPicker(value, index) {
        this.form = value;
        this.formatData = index;
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
        this.lordData = {};
        this.rentData = {};
        this.allData = {};
        this.emptyForm();
        this.showData = JSON.parse(JSON.stringify(rentTitle_calculate));
      },
      // 清空表单
      emptyForm() {
        window.scrollTo(0, 0);
        this.showContentVal(1);
        this.formatData.lord_pay_way = '';
        this.form = {};
        this.form.counter = 400000;
        this.form.comm_rate = 100;
        this.form.rent_return_day = 0;
        this.form.rent_return_money = 0;
        // this.form.lord_duration = 3;
      },
      showContentVal(val) {
        this.showContent = val;
      },
      showLoad(msg) {
        Toast.loading({
          duration: 0,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: msg
        });
      }
    },
  }
</script>

<style lang="scss">
  @import "../../../../static/common.scss";

  #dataCount {
    overflow-x: hidden;
    .module {
      position: fixed;
      display: flex;
      display: -webkit-flex;
      align-items: flex-end;
      img {
        min-width: 100%;
        max-width: 100%;
        min-height: 100%;
      }
    }

    .module {
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: #f1f1f1;
      overflow: hidden;
    }

    .dataMain {
      padding-bottom: 1.2rem;
    }
    .checks {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      padding: 10px 15px;
      background-color: #fff;
      .checkTitle {
        min-width: 130px;
        max-width: 130px;
      }
      .radioRent {
        display: flex;
        display: -webkit-flex;
        margin-left: -.42rem;
        div + div {
          margin-left: .3rem;
        }
      }
    }
    .van-field {
      .van-cell__title {
        min-width: 130px;
        max-width: 130px;
      }
    }
    .titles {
      background-color: #e5e5e5;
      padding: .3rem;
      color: #aaa;
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
            height: .77rem;
            line-height: .77rem;
            padding: 0 .15rem;
            border-top: 1px solid #f8f8f8;
          }
          .title {
            border: 0;
            background-color: #409EFF;
            color: #fff;
          }
        }
        .types {
          div {
            background: rgba(0, 0, 0, .3);
            white-space: nowrap;
            color: #fff;
          }
        }
        .collect {
          div {
            color: #409EFF;
          }
        }
        .renter {
          div {
            color: #FF8000;
          }
        }
        .all {
          div {
            color: #3DCF52;
          }
        }
        .collect, .renter, .all {
          word-break: break-all;
          .colorRed {
            font-weight: bold;
            background-color: red;
            color: #fff;
          }
        }
      }
    }
    /*.results {*/
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 10rem;*/
    /*right: 0;*/
    /*bottom: 1rem;*/
    /*padding-bottom: .2rem;*/
    /*background-color: #fff;*/
    /*transition: all .5s;*/
    /*z-index: 1;*/
    /*}*/
    /*.showResult {*/
    /*overflow-x: hidden;*/
    /*overflow-y: auto;*/
    /*-webkit-overflow-scrolling: touch;*/
    /*left: 0;*/
    /*}*/
    .managerData {
      border-top: 1px solid #f8f8f8;
      .manager {
        display: flex;
        display: -webkit-flex;
        border-bottom: 1px solid $bodyBg;
        background-color: $color;
        div + div {
          border-left: 1px solid $bodyBg;
        }
        div {
          width: 100%;
          text-align: center;
          color: #fff;
          padding: .2rem;
        }
      }
      .manager.nums {
        background-color: #fff;
        div {
          color: red;
        }
        .title {
          color: #616161;
        }
      }
    }
  }
</style>
