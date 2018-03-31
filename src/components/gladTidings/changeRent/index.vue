<template>
  <div id="rentReport">
    <div class="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">转租类型</div>
          <van-radio name="0" v-model="form.trans_type">公司</van-radio>
          <van-radio name="1" v-model="form.trans_type" style="margin-left: 18px">个人</van-radio>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.month"
          type="number"
          label="租房月数"
          placeholder="请填写租房月数"
          icon="clear"
          @click-icon="form.month = ''"
          required>
        </van-field>
        <van-field
          v-model="form.sign_date"
          label="签约日期"
          readonly
          type="text"
          @click="timeChoose(1)"
          placeholder="请选择签约日期"
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
            label="开始时间"
            placeholder="获取周期开始日期"
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
        <van-field
          v-model="form.deposit"
          label="押金"
          type="text"
          placeholder="请填写押金"
          icon="clear"
          @click-icon="form.deposit = ''"
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
            label="开始时间"
            placeholder="获取周期开始日期"
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
          v-model="form.property"
          label="物业费"
          type="text"
          placeholder="请填写物业费"
          icon="clear"
          @click-icon="form.property = ''"
          required>
        </van-field>
        <van-field
          v-model="fromName"
          label="来源"
          type="text"
          readonly
          placeholder="请选择客户来源"
          @click="selectShow(4,'')"
          required>
        </van-field>
        <van-field
          v-model="property_name"
          label="物业费付款人"
          type="text"
          placeholder="请选择物业费付款人"
          @click="selectShow(1,'')"
          readonly
          required>
        </van-field>
        <van-field
          v-model="form.receipt"
          label="收据编号"
          type="text"
          placeholder="请填写收据编号"
          required>
        </van-field>
        <van-field
          v-model="form.retainage_date"
          label="尾款补齐日期"
          readonly
          type="text"
          @click="timeChoose(2)"
          placeholder="请选择尾款补齐日期"
          required>
        </van-field>
        <van-field
          v-model="form.name"
          label="客户姓名"
          type="text"
          placeholder="请填写客户姓名"
          icon="clear"
          @click-icon="form.name = ''"
          required>
        </van-field>
        <van-field
          v-model="form.phone"
          label="联系方式"
          type="number"
          placeholder="请填写客户联系方式"
          icon="clear"
          @click-icon="form.phone = ''"
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
          @click-icon="form.remark = ''"
          required>
        </van-field>
        <van-field
          v-model="staff_name"
          @click="searchSelect(2)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="leader_name"
          @click="searchSelect(3)"
          readonly
          label="负责人"
          type="text"
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          @click="searchSelect(4)"
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
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
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

        first_date: '',            //日期value

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payIndex: '',               //付款方式index

        amountMoney: 1,
        moneyNum: [''],               //分金额 付款方式

        value1: ['无', '房东', '租客', '公司'],
        value2: ['支付宝', '微信', '银行卡', 'pos机', '现金'],
        value3: ['0', '1', '2', '3'],
        value4: ['个人', '中介'],

        form: {
          id: '',
          type: 1,
          draft: 0,
          trans_type: '0',
          contract_id: '',            //房屋地址id
          house_id: '',               //房屋地址id
          month: '',                    //租房月数
          sign_date: '',                //签约日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式

          from: 1,                      //来源
          deposit: '',                  //押金
          property: '',                 //物业费
          receipt: '',                  //收据编号
          property_payer: '',           //物业费付款人
          retainage_date: '',           //尾款补齐时间
          name: '',                     //客户姓名
          phone: '',                    //电话号码
          screenshot: [],               //领导截图 数组
          photo: [],                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '92',               //负责人id
          department_id: '',            //部门id
        },
        houseName: '',
        screenshots: {},
        photos: {},
        fromName: '个人',
        property_name: '',              //物业费付款人
        staff_name: '',                  //开单人name
        leader_name: '湮灭',                //负责人name
        department_name: '',             //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.rentDetail();
    },
    activated() {
      this.houseInfo();
    },
    methods: {
      searchSelect(val) {
        switch (val) {
          case 1:
            this.$router.push({path: '/collectHouse', query: {type: 'lord1'}});
            break;
          case 2:
            this.$router.push({path: '/organize'});
            break;
          case 4:
            this.$router.push({path: '/depart'});
            break;
        }
      },

      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
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
            this.form.sign_date = this.timeValue;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(this.timeValue);
            this.datePrice.push(this.timeValue);
            this.datePay.push(this.timeValue);
            break;
          case 2:
            this.form.retainage_date = this.timeValue;
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
            this.columns = this.value1;
            break;
          case 2:
            this.columns = this.value2;
            break;
          case 3:
            this.columns = this.value3;
            break;
          case 4:
            this.columns = this.value4;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.property_name = value;
            this.form.property_payer = index + 1;
            break;
          case 2:
            this.moneyNum[this.payIndex] = value;
            this.form.money_way[this.payIndex] = index + 1;
            break;
          case 3:
            this.form.pay_way_bet = value;
            break;
          case 4:
            this.fromName = value;
            this.form.from = index + 1;
            break;
        }
        this.selectHide = false;
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
            this.form.price_arr.splice(index, 1);
            this.datePrice.splice(index, 1);
            this.periodDate(val);
          }
        } else if (val === 2) {
          this.amountPay--;
          this.form.period_pay_arr.splice(index, 1);
          this.form.pay_way_arr.splice(index, 1);
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
            begin_date: this.form.sign_date,
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

      saveCollect(val) {
        this.form.draft = val;
        if (this.picStatus) {
        this.$http.post(this.urls + 'bulletin/rent', this.form).then((res) => {
          if (res.data.code === '50210') {
            Toast.success(res.data.msg);
            this.close_();
            this.routerDetail(res.data.data.data.id);
          } else if (res.data.code === '50220') {
            Toast.success(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        })
        } else {
          Toast('图片上传中...');
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = t.house;
          this.houseName = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = t.staff;
          this.form.staff_id = val.staff_id;
          this.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.department_name = val.depart_name;
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = t.depart;
          this.department_name = val.name;
          this.form.department_id = val.id;
          this.stick();
        }
        if (t.staff === '' || t.depart === '') {
          this.stick();
        }
      },

      rentDetail() {
        this.$http.get(this.urls + 'bulletin/rent?type=1').then((res) => {
          if (res.data.code === '50210') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.trans_type = draft.trans_type;
            this.form.id = draft.id;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.houseName = data.address;
            this.form.month = draft.month;
            this.form.sign_date = draft.sign_date;
            this.first_date = [];
            this.first_date.push(draft.sign_date);

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

            this.form.deposit = draft.deposit;
            this.form.receipt = draft.receipt;
            this.form.from = draft.from;
            this.fromName = this.value4[draft.from - 1];
            this.form.property = draft.property;
            this.form.property_payer = draft.property_payer;
            this.property_name = this.value1[draft.property_payer - 1];
            this.form.retainage_date = draft.retainage_date;
            this.form.name = draft.name;
            this.form.phone = draft.phone;
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
        })
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.form.id = '';
        this.form.trans_type = '0';
        this.form.contract_id = '';
        this.form.house_id = '';
        this.houseName = '';
        this.form.month = '';
        this.form.sign_date = '';
        this.datePrice = [];
        this.datePay = [];
        this.amountPrice = 1;
        this.form.period_price_arr = [''];
        this.form.price_arr = [''];
        this.form.period_price_arr = [''];
        this.form.pay_way_bet = '';
        this.amountPay = 1;
        this.form.period_pay_arr = [''];
        this.form.pay_way_arr = [''];
        this.form.money_sum = '';
        this.amountMoney = 1;
        this.moneyNum = [''];
        this.form.money_sep = [''];
        this.form.money_way = [''];
        this.form.deposit = '';
        this.form.from = 1;
        this.fromName = '个人';
        this.form.property = '';
        this.form.receipt = '';
        this.form.property_payer = '';
        this.property_name = '';
        this.form.retainage_date = '';
        this.form.name = '';
        this.form.phone = '';
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
      }
    },
  }
</script>

<style lang="scss">
  #rentReport {
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
    .van-cell.van-hairline.van-field {
      .van-cell__title {
        width: 110px;
        span {
          font-size: 16px;
        }
      }
      .van-cell__value {
        padding-left: 110px;
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
        height: .6rem;
        line-height: .6rem;
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
