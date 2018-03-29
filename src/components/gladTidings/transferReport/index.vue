<template>
  <div id="transferReport">
    <div class="main">
      <van-cell-group style="margin-bottom: 12px;">
        <van-field
          v-model="oldHouseName"
          label="原房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择原房屋地址"
          required>
        </van-field>
        <van-field
          v-model="oldForm.staff_name"
          label="原开单人"
          type="text"
          disabled
          placeholder="原房屋原开单人已禁用">
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
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="newHouseName"
          label="现房屋地址"
          type="text"
          readonly
          @click="searchSelect(2)"
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
            v-model="datePrice[index]"
            type="text"
            label="开始日期"
            placeholder="款项开始时间"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_price_arr[index]"
            type="number"
            label="周期"
            @keyup="periodDate(1)"
            placeholder="请填写月单价周期"
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
          @click="selectShow(3, '')"
          readonly
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
            v-model="datePay[index]"
            type="text"
            label="开始日期"
            placeholder="款项开始时间"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_pay_arr[index]"
            type="number"
            label="周期"
            @keyup="periodDate(2)"
            placeholder="请填写付款方式周期"
            required>
          </van-field>
          <van-field
            v-model="form.pay_way_arr[index]"
            label="付款方式"
            type="number"
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
          label="已收金额"
          placeholder="请填写已收金额"
          icon="clear"
          @click-icon="form.money_sum = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>已收金额付款方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index,3)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.money_sep[index]"
            type="text"
            label="金额"
            placeholder="请填写金额"
            required>
          </van-field>
          <van-field
            @click="selectShow(2,index)"
            v-model="moneyNum[index]"
            label="付款方式"
            type="text"
            readonly
            placeholder="请选择付款方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(3)" class="addInput">
        +增加付款方式
      </div>

      <van-cell-group>
        <van-field
          v-model="form.receipt"
          label="收据编号"
          type="text"
          placeholder="请填写收据编号">
        </van-field>
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
        <UpLoad :ID="'screenshot'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">合同照片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData" :isClear="isClear" :editImage="photos"></UpLoad>
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
          @click="searchSelect(3)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="leader_name"
          @click="searchSelect(4)"
          readonly
          label="负责人"
          type="text"
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          @click="searchSelect(5)"
          readonly
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1,1)">草稿</div>
      <div class="" @click="saveCollect(0,1)">发布</div>
    </div>

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
        isClear: false,           //删除图片
        picStatus: true,

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        first_date: [],            //日期value

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payIndex: '',               //付款方式index

        amountMoney: 1,
        moneyNum: [''],             //分金额 付款方式

        value1: ['支付宝', '微信', '银行卡', 'pos机', '现金'],
        value2: ['0', '1', '2', '3'],

        oldForm: {
          staff_name: '',
          pay_way_arr: '',
          price: '',
          money_sum: '',
        },

        form: {
          id: '',
          type: 1,
          draft: 0,
          contract_id_rent: '',         //原租房合同id
          contract_id: '',              //现房屋合同id
          house_id_rent: '',
          house_id: '',
          month: '',                    //签约时长
          begin_date: '',               //合同开始日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式

          receipt: '',                  //收据编号
          retainage_date: '',           //尾款补齐时间

          screenshot: '',               //领导截图 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '92',              //负责人id
          department_id: '',            //部门id
        },
        oldHouseName: '',
        newHouseName: '',
        screenshots: {},
        photos: {},
        staff_name: '',                  //开单人name
        leader_name: '湮灭',                //负责人name
        department_name: '',             //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.rentDetail();
      this.routerIndex();
    },

    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },
      searchSelect(val) {
        this.saveCollect(1, 2);
        switch (val) {
          case 1:
            this.$router.replace({path: '/collectHouse', query: {type: 'rent1'}});
            break;
          case 2:
            this.$router.replace({path: '/collectHouse', query: {type: 'lord1'}});
            break;
          case 3:
            this.$router.replace({path: '/organize'});
            break;
          case 5:
            this.$router.replace({path: '/depart'});
            break;
        }
      },
      // 截图
      getImgData(val) {
        this.picStatus = !val[2];
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
        this.timeShow = false;
        switch (this.timeIndex) {
          case 1:
            this.form.retainage_date = this.timeValue;
            break;
          case 2:
            this.form.begin_date = this.timeValue;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(this.timeValue);
            this.datePrice.push(this.timeValue);
            this.datePay.push(this.timeValue);
            break;
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        this.selectHide = true;
        switch (val) {
          case 2:
            this.columns = this.value1;
            break;
          case 3:
            this.columns = this.value2;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 2:
            this.moneyNum[this.payIndex] = value;
            this.form.money_way[this.payIndex] = index + 1;
            break;
          case 3:
            this.form.pay_way_bet = value;
            break;
        }
        this.selectHide = false;
      },

      // select关闭
      onCancel() {
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
            this.form.period_price_arr.splice(index, 1);
            this.price_arr.splice(index, 1);
            this.datePrice.splice(index, 1);
            this.periodDate(val);
          }
        } else if (val === 2) {
          this.amountPay--;
          this.form.period_pay_arr.splice(index, 1);
          this.pay_way_arr.splice(index, 1);
          this.datePay.splice(index, 1);
          this.periodDate(val);
        } else {
          this.amountMoney--;
          this.form.money_sep.splice(index, 1);
          this.form.money_way.splice(index, 1);
          this.moneyNum.splice(index, 1);
        }
      },
      // 日期计算
      periodDate(val) {
        let per;
        if (val === 1) {
          per = this.form.period_price_arr;
        } else {
          per = this.form.period_pay_arr;
        }
        this.countDate(val, per);
      },
      // 日期计算
      countDate(val, per) {
        this.$http.get(this.urls + '/bulletin/helper/date', {
          params: {
            begin_date: this.form.begin_date,
            period: per,
          }
        }).then((res) => {
          if (res.data.code === '51110') {
            if (val === 1) {
              this.datePrice = this.first_date.concat(res.data.data);
            } else {
              this.datePay = this.first_date.concat(res.data.data);
            }
          }
        })
      },
      saveCollect(val, num) {
        this.form.draft = val;
        if (this.picStatus) {
          this.$http.post(this.urls + 'bulletin/change', this.form).then((res) => {
            if (res.data.code === '50510') {
              Toast.success(res.data.msg);
              this.$router.push({path: '/publishDetail', query: {ids: res.data.data.data.id}});
            } else if (res.data.code === '50520') {
              num === 1 ? Toast.success(res.data.msg) : false;
            } else {
              Toast(res.data.msg);
            }
          })
        } else {
          Toast('图片上传中...');
        }
      },

      rentDetail() {
        this.$http.get(this.urls + 'bulletin/change').then((res) => {
          if (res.data.code === '50510') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = draft.id;
            this.form.month = draft.month;

            this.form.begin_date = draft.begin_date;
            this.first_date = [];
            this.first_date.push(draft.begin_date);

            for (let i = 0; i < draft.price_arr.length; i++) {
              this.amountPrice = i + 1;
              this.form.period_price_arr.push('');
              this.form.price_arr.push('');
            }
            this.form.period_price_arr = draft.period_price_arr;
            this.countDate(1, draft.period_price_arr);
            this.form.price_arr = draft.price_arr;

            this.form.pay_way_bet = draft.pay_way_bet;
            for (let i = 0; i < draft.pay_way_arr.length; i++) {
              this.amountPay = i + 1;
              this.form.period_pay_arr.push('');
              this.form.pay_way_arr.push('');
            }
            this.form.period_pay_arr = draft.period_pay_arr;
            this.countDate(2, draft.period_pay_arr);
            this.form.pay_way_arr = draft.pay_way_arr;

            this.form.money_sum = draft.money_sum;
            for (let i = 0; i < draft.money_sep.length; i++) {
              this.amountMoney = i + 1;
              this.form.money_sep.push('');
              this.form.money_way.push('');
              this.moneyNum[i] = this.value2[draft.money_way[i] - 1]
            }
            this.form.money_sep = draft.money_sep;
            this.form.money_way = draft.money_way;

            this.form.receipt = draft.receipt;
            this.form.retainage_date = draft.retainage_date;

            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.photo = draft.photo;
            this.photos = data.photo;

            this.form.remark = draft.remark;
            this.form.staff_id = draft.staff_id;
            this.staff_name = data.staff_name;
            this.form.leader_id = draft.leader_id;
            this.leader_name = data.leader_name;
            this.form.department_id = draft.department_id;
            this.department_name = data.department_name;
          } else {
            this.form.id = '';
          }
          let t = this.$route.query;
          if (t.house !== undefined && t.house !== '') {
            let val = t.house;
            if (t.type === 'rent1') {
              this.oldHouseName = val.house_name;
              this.form.contract_id_rent = val.id;
              this.form.house_id_rent = val.house_id;
            } else {
              this.newHouseName = val.house_name;
              this.form.contract_id = val.id;
              this.form.house_id = val.house_id;
            }
          }
          if (t.staff !== undefined && t.staff !== '') {
            let val = t.staff;
            this.form.staff_id = val.staff_id;
            this.staff_name = val.staff_name;
            this.form.department_id = val.depart_id;
            this.department_name = val.depart_name;
            window.scrollTo(0, document.body.scrollHeight);
          }
          if (t.depart !== undefined && t.depart !== '') {
            let val = t.depart;
            this.department_name = val.name;
            this.form.department_id = val.id;
            window.scrollTo(0, document.body.scrollHeight);
          }
          if (t.staff === '' || t.depart === '') {
            window.scrollTo(0, document.body.scrollHeight);
          }
        })
      },
      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.form.id = '';
        this.form.month = '';

        this.form.begin_date = '';
        this.first_date = [];

        this.amountPrice = 1;

        this.form.period_price_arr = [''];

        this.form.price_arr = [''];
        this.datePay = [];
        this.datePrice = [];
        this.form.pay_way_bet = '';
        this.amountPay = 1;
        this.form.period_pay_arr = [''];
        this.form.pay_way_arr = [''];

        this.form.money_sum = '';
        this.amountMoney = 1;
        this.moneyNum = [''];

        this.form.money_sep = [];
        this.form.money_way = [];

        this.form.receipt = '';
        this.form.retainage_date = '';

        this.form.screenshot = [];
        this.screenshots = {};
        this.form.photo = [];
        this.photos = {};

        this.form.remark = '';
        this.form.staff_id = '';
        this.staff_name = '';
        this.form.leader_id = '92';
        this.leader_name = '湮灭';
        this.form.department_id = '';
        this.department_name = '';
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
    .van-cell {
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
