<template>
  <div id="transferReport" v-wechat-title="$route.meta.title">

    <div v-show="!searchShow" class="main">
      <van-cell-group>
        <div class="checks" style="">
          <div style="min-width: 110px;">转租类型</div>
          <van-radio name="0" v-model="form.trans_type">公司</van-radio>
          <van-radio name="1" v-model="form.trans_type" style="margin-left: 18px">个人</van-radio>
        </div>
      </van-cell-group>
      <van-cell-group style="margin-bottom: .2rem;">
        <van-field
          v-model="form.contract_id_rent"
          label="原房屋地址"
          type="text"
          readonly
          placeholder="请选择原房屋地址"
          required>
        </van-field>
        <van-field
          v-model="oldForm.price_arr"
          label="原月单价"
          type="text"
          disabled
          placeholder="原房屋月单价已禁用">
        </van-field>
        <van-field
          v-model="oldForm.pay_way_arr"
          label="原付款方式"
          type="text"
          disabled
          placeholder="原房屋付款方式已禁用">
        </van-field>
        <van-field
          v-model="oldForm.price"
          label="价格"
          type="text"
          disabled
          placeholder="原房屋价格已禁用">
        </van-field>
        <van-field
          v-model="oldForm.money_sum"
          label="定金"
          type="text"
          disabled
          placeholder="原房屋定金已禁用">
        </van-field>
        <van-field
          v-model="oldForm.bulletinDate"
          label="喜报日期"
          type="text"
          disabled
          placeholder="原房屋喜报日期已禁用">
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.contract_id"
          label="现房屋地址"
          type="text"
          readonly
          placeholder="请选择房现房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.month"
          type="number"
          label="签约时长"
          placeholder="请填写签约时长(月数)"
          icon="clear"
          @click-icon="form.month = ''"
          required>
        </van-field>
        <van-field
          v-model="form.begin_date"
          type="text"
          label="开始日期"
          placeholder="获取开始日期"
          @click="timeChoose(2)"
          readonly
          required>
        </van-field>
      </van-cell-group>
      <div class="changes" v-for="(key,index) in amountPrice">
        <div class="paddingTitle">
          <span>月单价<span v-if="amountPrice > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountPrice > 1" @click="deleteAmount(index,1)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.period_price_arr[index]"
            type="number"
            label="周期"
            @keyup="periodDate(1)"
            placeholder="请填写月单价周期"
            required>
          </van-field>
          <van-field
            v-model="datePrice[index]"
            type="text"
            label="开始日期"
            placeholder="款项开始时间"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.price_arr[index]"
            type="number"
            label="价格"
            placeholder="请填写金额"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(1)" class="addInput">
        +增加月单价
      </div>

      <van-cell-group>
        <van-field
          v-model="form.pay_way_bet"
          type="number"
          label="付款方式-押"
          placeholder="请填写付款方式-押"
          icon="clear"
          @click-icon="form.pay_way_bet = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountPay">
        <div class="paddingTitle">
          <span>付款方式-付<span v-if="amountPay > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountPay > 1" @click="deleteAmount(index,2)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.period_pay_arr[index]"
            type="number"
            label="周期"
            @keyup="periodDate(2)"
            placeholder="请填写付款方式周期"
            required>
          </van-field>
          <van-field
            v-model="datePay[index]"
            type="text"
            label="开始日期"
            placeholder="款项开始时间"
            disabled
            required>
          </van-field>
          <van-field
            @click="selectShow(1,index)"
            v-model="payTypeNum[index]"
            label="付款方式"
            type="text"
            readonly
            placeholder="请选择付款方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(2)" class="addInput">
        +增加付款方式
      </div>

      <van-cell-group>
        <van-field
          v-model="form.money_sum"
          type="number"
          label="总金额"
          placeholder="请填写总金额"
          icon="clear"
          @click-icon="form.money_sum = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>分额付款<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index,3)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.money_sep[index]"
            type="text"
            label="分额"
            placeholder="请填写分额"
            required>
          </van-field>
          <van-field
            @click="selectShow(2,index)"
            v-model="moneyNum[index]"
            label="分额方式"
            type="text"
            readonly
            placeholder="请选择分额方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(3)" class="addInput">
        +增加分额付款
      </div>

      <van-cell-group>
        <van-field
          v-model="form.retainage_date"
          label="尾款补齐日期"
          readonly
          type="text"
          @click="timeChoose(1)"
          placeholder="请选择尾款补齐日期"
          required>
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">截图</div>
        <UpLoad :ID="'screenshot'" @getImg="getImgData"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">合同照片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="staff_name"
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="leader_name"
          label="负责人"
          type="text"
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <div v-show="!searchShow" class="footer">
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

    <div :class="{'searchClass':searchShow}" v-if="searchShow">
      <van-search
        v-model="searchValue"
        show-action
        @search="onSearch">
        <div slot="action" @click="onCancel" style="padding: 0 10px;color: #06bf04;">取消</div>
      </van-search>
      <div class="searchContent">
        <div class="searchList" v-for="key in 30">
          <div>{{key}}</div>
          <div>{{key}}回复</div>
        </div>
      </div>
    </div>

    <!--户型-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

    <!--日期-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @change="monthDate"
        @cancel="onCancel"
        @confirm="onDate"/>
    </van-popup>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast},
    data() {
      return {
        urls: globalConfig.server,
        searchShow: false,        //搜索
        searchValue: '',          //搜索
        lists: [],                //搜索
        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payType: [''],              //付款方式ID
        payTypeNum: [''],           //付款方式
        payIndex: '',               //付款方式index

        amountMoney: 1,
        moneyNum: [''],             //分金额 付款方式

        oldForm:{
          price_arr: '',
          pay_way_arr: '',
          price: '',
          money_sum: '',
          bulletinDate: '',
        },

        form: {
          type: 1,
          draft: 0,
          trans_type: '0',
          contract_id_rent: '22',       //原租房合同id
          contract_id: '33',            //现房屋合同id
          month: '',                    //签约时长
          begin_date: '',                //合同开始日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式

          retainage_date: '',           //尾款补齐时间

          screenshot: '',               //领导截图 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '12',                 //开单人id
          leader_id: '13',                //负责人id
          department_id: '16',            //部门id
        },
        staff_name: '',                  //开单人name
        leader_name: '',                 //负责人name
        department_name: '',             //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
    },

    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },
      // 搜索
      onSearch() {
        this.$http.get(this.urls + 'credit/manage/other?search=' + this.searchValue).then((res) => {
          this.lists = res.data.data;
        })
      },
      // 截图
      getImgData(val) {
        if (val[0] === 'screenshot') {
          this.form.screenshot = val[1];
        } else {
          this.form.photo = val[1];
        }
      },
      // 获取当前时间
      getNowFormatDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let strDate = date.getDate();
        this.currentDate = new Date(year, month, strDate);
      },

      // 日期选择
      timeChoose(val) {
        this.timeShow = true;
        this.timeIndex = val;
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate(val) {
        console.log(val);
        this.timeShow = false;
        switch (this.timeIndex) {
          case 1:
            this.form.retainage_date = this.timeValue;
            break;
            case 2:
            this.form.begin_date = this.timeValue;
            break;
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        this.selectHide = true;
        switch (val) {
          case 1:
            this.columns = ['月付', '双月付', '季付', '半年付', '年付'];
            break;
          case 2:
            this.columns = ['支付宝', '微信', '银行卡', 'pos机', '现金'];
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.payTypeNum[this.payIndex] = value;
            this.form.pay_way_arr[this.payIndex] = index + 1;
            break;
          case 2:
            this.moneyNum[this.payIndex] = value;
            this.form.money_way[this.payIndex] = index + 1;
            break;
        }
        this.selectHide = false;
      },
      // select关闭
      onCancel() {
        this.searchShow = false;
        this.selectHide = false;
        this.timeShow = false;
      },
      // 月单价增加
      priceAmount(val) {
        if (val === 1) {
          this.amountPrice++;
          this.form.period_price_arr.push('');
          this.form.price_arr.push('');
        } else if (val === 2) {
          this.amountPay++;
          this.form.period_pay_arr.push('');
          this.form.pay_way_arr.push('');
          this.payTypeNum.push('');
        } else {
          this.amountMoney++;
          this.form.money_sep.push('');
          this.form.money_way.push('');
          this.moneyNum.push('');
        }
      },

      // 删除月单价
      deleteAmount(index, val) {
        if (val === 1) {
          if (this.amountPrice > 1) {
            this.amountPrice--;
            this.form.period_price_arr.splice(val, 1);
            this.price_arr.splice(val, 1);
          }
        } else if (val === 2) {
          this.amountPay--;
          this.form.period_pay_arr.splice(val, 1);
          this.pay_way_arr.splice(val, 1);
          this.payTypeNum.splice(val, 1);
        } else {
          this.amountMoney--;
          this.form.money_sep.splice(val, 1);
          this.form.money_way.splice(val, 1);
          this.moneyNum.splice(val, 1);
        }
      },
      // 日期计算
      periodDate(val) {
        let period;
        if (val === 1) {
          period = this.form.period_price_arr;
        } else {
          period = this.form.period_pay_arr;
        }
        this.$http.get(this.urls + '/bulletin/helper/date', {
          params: {
            begin_date: this.form.begin_date,
            period: period
          }
        }).then((res) => {
          if (res.data.code === '51110') {
            if (val === 1) {
              this.datePrice = res.data.data;
            } else {
              this.datePay = res.data.data;
            }
          } else {
            Toast(res.data.msg);
          }
        })
      },
      saveCollect(val) {
        this.form.draft = val;
        this.$http.post(this.urls + 'bulletin/change', this.form).then((res) => {
          if(res.data.code === '50510'){
            Toast.success(res.data.msg);
            this.$router.push({path: '/publishDetail',query:{ids: res.data.data.data.id}});
          } else {
            Toast(res.data.msg);
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  #transferReport {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    $color: #409EFF;
    .checks {
      display: -webkit-flex;
      align-items: center;
      height: 44px;
    }
    .van-switch.van-switch--on {
      background: $color;
    }
    .van-icon.van-icon-checked {
      color: $color;
    }
    .van-cell.van-hairline.van-field.van-cell--required {
      .van-cell__title {
        width: 110px;
      }
      .van-cell__value {
        padding-left: 110px;
      }
    }
    .searchClass {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      z-index: 999;
      .searchContent {
        overflow: auto;
        height: 77%;
        .searchList {
          @include flex;
          justify-content: space-between;
          padding: 15px 20px;
          &:hover {
            background: #DDDDDD;
          }
        }
      }
    }

    .aloneModel {
      background: #fff;
      width: 100%;
      margin: .2rem 0;
      padding-bottom: .26rem;
      .title {
        padding: .26rem .3rem 0;
      }
    }
    .paddingTitle {
      @include flex;
      justify-content: space-between;
      padding: .26rem .3rem;
      color: #aaaaaa;
      .colors {
        color: $color;
      }
    }
    .addInput {
      height: .9rem;
      line-height: .9rem;
      text-align: center;
      color: $color;
      background: #ffffff;
      margin-bottom: .2rem;
    }

    .top, .footer {
      position: fixed;
      left: 0;
      right: 0;
      height: .9rem;
      z-index: 666;
      background: #ffffff;
    }
    .main {
      margin: .2rem 0 1.2rem;
    }
    .top {
      top: 0;
      box-shadow: 0 3px 10px 0 #dddddd;
      .van-hairline--top-bottom::after {
        border-bottom: 0;
      }
    }
    .footer {
      bottom: 0;
      height: 1rem;
      padding: 10px;
      @include flex;
      align-items: center;
      border-top: 1px solid #ebebeb;
      div + div {
        border-left: 1px solid #ebebeb;
      }
      div {
        width: 50%;
        text-align: center;
        color: $color;
      }
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #dddddd;
    }

    input::-moz-placeholder, textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #dddddd;
    }

    input:-moz-placeholder, textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #dddddd;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #dddddd;
    }
  }
</style>
