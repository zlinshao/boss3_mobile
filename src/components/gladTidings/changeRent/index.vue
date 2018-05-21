<template>
  <div id="rentReport">
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">转租类型</div>
          <van-radio name="0" v-model="form.trans_type">公司</van-radio>
          <van-radio name="1" v-model="form.trans_type" style="margin-left: 18px">个人</van-radio>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
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
        <div class="first_date">
          <van-field
            style="width: 110px;"
            class="title"
            label="签约时长"
            required>
          </van-field>
          <van-field
            v-model="form.month"
            type="number"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写月数">
          </van-field>
          <van-field
            class="twoBorder"
            v-model="form.day"
            type="number"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写天数">
          </van-field>
        </div>
        <van-field
          v-model="form.begin_date"
          label="合同开始日期"
          readonly
          type="text"
          @click="timeChoose(3)"
          placeholder="请选择合同开始日期"
          required>
        </van-field>
        <van-field
          v-model="form.end_date"
          label="合同结束日期"
          readonly
          type="text"
          @click="timeChoose(4)"
          placeholder="请选择合同结束日期"
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
            :disabled="amountPrice === 1 && form.period_price_arr[index] === form.month"
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
        +月单价变化
      </div>

      <van-cell-group>
        <van-field
          v-model="form.pay_way_bet"
          type="number"
          label="押"
          placeholder="请填写付款方式-押"
          @click="selectShow(3, '')"
          readonly
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountPay">
        <div class="paddingTitle">
          <span>付<span v-if="amountPay > 1">({{index + 1}})</span></span>
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
            :disabled="amountPay === 1 && form.period_pay_arr[index] === form.month"
            @keyup="periodDate(2)"
            placeholder="请填写付款方式周期"
            required>
          </van-field>
          <van-field
            v-model="form.pay_way_arr[index]"
            label="付款方式"
            type="number"
            placeholder="请填写付款方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(2)" class="addInput">
        +付款方式变化
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
          <span>已收金额支付方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
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
            label="支付方式"
            type="text"
            readonly
            placeholder="请选择支付方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(3)" class="addInput">
        +支付方式变化
      </div>

      <van-cell-group>
        <van-switch-cell v-model="other_fee_status" @change="fee_status" title="是否有其他金额"/>
        <van-field
          v-if="other_fee_status"
          v-model="form.other_fee_name"
          label="费用名称"
          type="text"
          placeholder="请填写名称"
          icon="clear"
          @click-icon="form.other_fee_name = ''"
          required>
        </van-field>
        <van-field
          v-if="other_fee_status"
          v-model="form.other_fee"
          label="费用金额"
          type="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.other_fee = ''"
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
        <van-field
          v-model="form.discount"
          label="让价总金额"
          type="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.discount = 0"
          required>
        </van-field>
        <van-switch-cell v-model="cusFrom" title="是否中介"/>
        <div style="border-bottom: 1px solid #f4f4f4;" v-if="cusFrom">
          <van-field
            v-model="form.agency_name"
            label="中介名称"
            type="text"
            placeholder="请填写中介名称"
            icon="clear"
            @click-icon="form.agency_name = ''"
            required>
          </van-field>
          <van-field
            v-model="form.agency_price"
            label="中介费"
            type="number"
            placeholder="请填写中介费"
            icon="clear"
            @click-icon="form.agency_price = ''"
            required>
          </van-field>
          <van-field
            v-model="form.agency_user_name"
            label="中介人"
            type="text"
            placeholder="请填写中介人"
            icon="clear"
            @click-icon="form.agency_user_name = ''"
            required>
          </van-field>
          <van-field
            v-model="form.agency_phone"
            label="中介联系方式"
            type="number"
            placeholder="请填写中介联系方式"
            icon="clear"
            @click-icon="form.agency_phone = ''"
            required>
          </van-field>
        </div>
        <van-field
          v-model="property_name"
          label="物业费付款人"
          type="text"
          placeholder="请选择物业费付款人"
          @click="selectShow(1,'')"
          readonly
          required>
        </van-field>
        <van-switch-cell v-model="corp" title="是否公司单"/>
      </van-cell-group>
      <div class="changes" v-for="(key,index) in amountReceipt">
        <div class="paddingTitle">
          <span>收据编号<span v-if="amountReceipt > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountReceipt > 1" @click="deleteAmount(index,4)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            @click="selectShow(5,index)"
            v-model="form.receipt[index].city"
            label="城市"
            type="text"
            readonly
            placeholder="请选择城市">
          </van-field>
          <van-field
            v-model="form.receipt[index].date"
             @keyup="form.receipt[index].date = valueLength(form.receipt[index].date, 4)"
            type="number"
            label="年份"
            placeholder="请填写年份">
          </van-field>
          <van-field
            v-model="form.receipt[index].num"
             @keyup="form.receipt[index].num = valueLength(form.receipt[index].num, 7)"
            type="text"
            label="编号"
            placeholder="请填写编号">
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(4)" class="addInput">
        +增加收据编号
      </div>
      <van-cell-group>
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
        <van-field
          v-model="form.contract_number"
          label="合同编号"
          type="text"
          placeholder="请填写合同编号"
          icon="clear"
          @click-icon="form.contract_number = ''">
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">领导同意截图</div>
        <UpLoad :ID="'leader'" @getImg="getImgData" :isClear="isClear" :editImage="leaders"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>凭证截图</div>
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
          v-model="form.staff_name"
          @click="searchSelect(2)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="form.department_name"
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
        haveInHand: true,
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

        amountReceipt: 1,                  //收据编号
        receiptDate: '',                   //收据编号年份
        receiptCity: '',                   //收据编号城市
        cities: [],                        //城市

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payIndex: '',               //付款方式index

        amountMoney: 1,
        moneyNum: [''],               //分金额 付款方式

        cusFrom: false,                //客户来源
        corp: true,                    //公司单
        other_fee_status: false,

        rooms: [],
        roomsName: '',

        form: {
          address: '',
          id: '',
          type: 2,
          draft: 0,
          trans_type: '0',
          contract_id: '',            //房屋地址id
          house_id: '',               //房屋地址id

          room_id: '',                  //合租房间ID
          rooms_mate: [],               //合租房间

          month: '',                    //租房月数
          day: '',                      //租房天数
          begin_date: '',               //合同开始日期
          sign_date: '',                //签约开始日期
          end_date: '',                 //签约结束日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式

          is_other_fee: 0,
          other_fee: '',
          other_fee_name: '',

          is_agency: 0,                 //客户来源    0个人1中介
          agency_name: '',              //中介名
          agency_price: '',             //中介费
          agency_user_name: '',         //中介人
          agency_phone: '',             //中介手机号

          is_corp: 1,                   //是否公司单  0个人1公司
          deposit: '',                  //押金
          contract_number: 'LJZF',      //合同编号
          discount: 0,                  //让价金额
          receipt: [{city: '', date: '', num: ''}], //收据编号
          property_payer: '',           //物业费付款人
          retainage_date: '',           //尾款补齐时间
          name: '',                     //客户姓名
          phone: '',                    //电话号码
          screenshot: [],               //领导截图 数组
          screenshot_leader: [],        //领导截图 数组
          photo: [],                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',                  //开单人name
          department_name: '',             //部门name
        },
        screenshots: {},
        photos: {},
        leaders: {},
        property_name: '',              //物业费付款人

        dictValue6: [],         //房东租客
        value6: [],
        dictValue8: [],         //支付方式
        value8: [],

        isValue1: true,
      }
    },
    watch: {
      cusFrom(val) {
        if (!val) {
          this.form.agency_name = '';
          this.form.agency_price = '';
          this.form.agency_user_name = '';
          this.form.agency_phone = '';
        }
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.dicts('');
    },
    activated() {
      let newID = this.$route.query;
      if (newID.newID !== undefined) {
        this.dicts(newID.newID);
      }
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      userInfo(val1) {
        if (val1) {
          let per = JSON.parse(sessionStorage.personal);
          this.form.staff_id = per.id;
          this.form.staff_name = per.name;
          this.form.department_id = per.department_id;
          this.form.department_name = per.department_name;
        }
      },

      dicts(val) {
        // 城市
        this.dictionary(306, 1).then((res) => {
          this.cities = [];
          for (let i = 0; i < res.data.length; i++) {
            this.cities.push(res.data[i].dictionary_name);
          }
          this.receiptNum();
        });
        //房东租客
        this.dictionary(449, 1).then((res) => {
          this.value6 = [];
          this.dictValue6 = res.data;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].dictionary_name !== '房东承担') {
              this.value6.push(res.data[i].dictionary_name);
            }
          }
          //支付方式
          this.dictionary(508, 1).then((res) => {
            this.value8 = [];
            this.dictValue8 = res.data;
            for (let i = 0; i < res.data.length; i++) {
              this.value8.push(res.data[i].dictionary_name);
            }
            this.rentDetail(val);
          });

        });
      },

      // 收据编号
      receiptNum(val1, val2) {
        this.amountReceipt = 1;
        if (val2 === 'receipt') {
          this.form.receipt = [{city: '', date: '', num: val1}];
        } else {
          this.form.receipt = [{city: '', date: '', num: ''}];
        }
        // 收据编号默认日期
        let date = new Date();
        this.form.receipt[0].date = date.getFullYear();
        this.receiptDate = date.getFullYear();
        // 收据编号默认城市
        this.$http.get(this.urls + 'setting/others/ip_address').then((res) => {
          if (res.data.code === '1000120') {
            this.form.receipt[0].city = res.data.data.data[2] + '市';
            this.receiptCity = res.data.data.data[2] + '市';
          }
        });
      },

      fee_status(val) {
        if (!val) {
          this.form.other_fee_name = '';
          this.form.other_fee = '';
        }
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
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
        } else if (val[0] === 'leader') {
          this.form.screenshot_leader = val[1];
        } else {
          this.form.photo = val[1];
        }
      },

      // 结束日期
      endDate(time, month, day, val) {
        let params = {};
        params.begin_date = time;
        params.month = month;
        params.day = day;
        params.type = val;
        if (time && (month || day)) {
          this.computedDate(params).then((date) => {
            this.form.end_date = date;
          })
        } else {
          this.form.end_date = '';
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
        setTimeout(() => {
          this.timeShow = true;
        }, 200);
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
            break;
          case 2:
            this.form.retainage_date = this.timeValue;
            break;
          case 3:
            this.form.begin_date = this.timeValue;
            this.endDate(this.timeValue, this.form.month, this.form.day, 2);
            this.form.period_price_arr[0] = this.form.month;
            this.form.period_pay_arr[0] = this.form.month;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(this.timeValue);
            this.datePrice.push(this.timeValue);
            this.datePay.push(this.timeValue);
            this.countDate(1, this.form.period_price_arr);
            this.countDate(2, this.form.period_pay_arr);
            break;
          case 4:
            this.form.end_date = this.timeValue;
            break;
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        setTimeout(() => {
          this.selectHide = true;
        }, 200);
        switch (val) {
          case 1:
            this.columns = this.value6;
            break;
          case 2:
            this.columns = this.value8;
            break;
          case 3:
            this.columns = dicts.value9;
            break;
          case 4:
            this.columns = this.rooms;
            break;
          case 5:
            this.columns = this.cities;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.property_name = value;
            for (let i = 0; i < this.dictValue6.length; i++) {
              if (this.dictValue6[i].dictionary_name === value) {
                this.form.property_payer = this.dictValue6[i].id;
              }
            }
            break;
          case 2:
            this.moneyNum[this.payIndex] = value;
            for (let i = 0; i < this.dictValue8.length; i++) {
              if (this.dictValue8[i].dictionary_name === value) {
                this.form.money_way[this.payIndex] = this.dictValue8[i].id;
              }
            }
            break;
          case 3:
            this.form.pay_way_bet = value;
            break;
          case 4:
            this.roomsName = value;
            for (let i = 0; i < this.roomsMate.length; i++) {
              if (this.roomsMate[i].name === value) {
                this.form.room_id = this.roomsMate[i].id;
              }
            }
            break;
          case 5:
            this.form.receipt[this.payIndex].city = value;
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
        } else if (val === 3) {
          this.amountMoney++;
          this.form.money_sep.push('');
          this.form.money_way.push('');
          this.moneyNum.push('');
        } else {
          this.amountReceipt++;
          this.form.receipt.push({city: this.receiptCity, date: this.receiptDate, num: ''});
        }
      },
      // 删除月单价
      deleteAmount(index, val) {
        if (val === 1) {
          this.amountPrice--;
          this.form.period_price_arr.splice(index, 1);
          this.form.price_arr.splice(index, 1);
          this.datePrice.splice(index, 1);
          this.periodDate(val);
        } else if (val === 2) {
          this.amountPay--;
          this.form.period_pay_arr.splice(index, 1);
          this.form.pay_way_arr.splice(index, 1);
          this.datePay.splice(index, 1);
          this.periodDate(val);
        } else if (val === 3) {
          this.amountMoney--;
          this.form.money_sep.splice(index, 1);
          this.form.money_way.splice(index, 1);
          this.moneyNum.splice(index, 1);
        } else {
          this.amountReceipt--;
          this.form.receipt.splice(index, 1);
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

      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.form.is_agency = this.cusFrom ? 1 : 0;
            this.form.is_corp = this.corp ? 1 : 0;
            this.form.is_other_fee = this.other_fee_status ? 1 : 0;
            this.form.day = this.form.day === '' ? '0' : this.form.day;
            this.form.contract_number = this.form.contract_number === 'LJZF' ? '' : this.form.contract_number;
            this.$http.post(this.urls + 'bulletin/rent', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50210') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50220') {
                this.form.day = this.form.day === '0' ? '' : this.form.day;
                this.form.contract_number = this.form.contract_number === '' ? 'LJZF' : this.form.contract_number;
                this.form.id = res.data.data.id;
                Toast.success(res.data.msg);
              } else {
                Toast(res.data.msg);
              }
            })
          } else {
            Toast('正在提交...');
          }
        } else {
          Toast('图片上传中...');

        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          // this.rooms = [];
          // this.roomsMate = val.rooms;
          // for (let i = 0; i < val.rooms.length; i++) {
          //   this.rooms.push(val.rooms[i].name);
          // }
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.is_agency = val.is_agency;                            //是否中介
          this.cusFrom = val.is_agency === 1 ? true : false;              //是否中介
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = JSON.parse(t.staff);
          this.form.staff_id = val.staff_id;
          this.form.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.form.department_name = val.depart_name;
          this.isValue1 = val.activeRevise;
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.form.department_name = val.name;
          this.form.department_id = val.id;
          this.isValue1 = val.activeRevise;
          this.stick();
        }
        if (t.tops === '') {
          this.stick();
        }
        this.userInfo(this.isValue1);
      },

      rentDetail(val) {
        this.userInfo(true);
        let type;
        if (val !== '') {
          type = 'bulletin/rent/' + val;
        } else {
          type = 'bulletin/rent?type=2';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50220') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.trans_type = draft.trans_type;
            this.form.id = data.id;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.address = draft.address;
            this.form.month = draft.month;
            this.form.discount = draft.discount;
            this.form.day = draft.day === '0' ? '' : draft.day;
            this.form.sign_date = draft.sign_date;
            this.form.end_date = draft.end_date;
            this.form.begin_date = draft.begin_date;
            this.first_date = [];
            this.first_date.push(draft.begin_date);
            this.datePrice[0] = draft.begin_date;
            this.datePay[0] = draft.begin_date;
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
            this.form.money_way = draft.money_way;
            this.form.money_sep = draft.money_sep;
            for (let i = 0; i < draft.money_sep.length; i++) {
              this.amountMoney = i + 1;
              for (let j = 0; j < this.dictValue8.length; j++) {
                if (this.dictValue8[j].id === draft.money_way[i]) {
                  this.moneyNum[i] = this.dictValue8[j].dictionary_name;
                }
              }
            }

            this.form.contract_number = this.form.contract_number === 'LJZF' ? '' : this.form.contract_number;
            this.form.deposit = draft.deposit;
            this.is_agency = draft.is_agency;
            this.cusFrom = draft.is_agency === 1 ? true : false;
            this.form.agency_name = draft.agency_name;
            this.form.agency_price = draft.agency_price;
            this.form.agency_user_name = draft.agency_user_name;
            this.form.agency_phone = draft.agency_phone;

            this.is_corp = draft.is_corp;
            this.corp = draft.is_corp === 1 ? true : false;

            this.form.property_payer = draft.property_payer;
            for (let j = 0; j < this.dictValue6.length; j++) {
              if (this.dictValue6[j].id === draft.property_payer) {
                this.property_name = this.dictValue6[j].dictionary_name;
              }
            }

            if (typeof draft.receipt !== "string") {
              this.amountReceipt = draft.receipt_raw.length;
              this.form.receipt = draft.receipt_raw;
            } else {
              this.receiptNum(draft.receipt, 'receipt');
            }

            this.other_fee_status = draft.is_other_fee === 1 ? true : false;
            this.form.other_fee_name = draft.other_fee_name;
            this.form.other_fee = draft.other_fee;

            this.form.retainage_date = draft.retainage_date;
            this.form.name = draft.name;
            this.form.phone = draft.phone;
            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.leaders = data.screenshot_leader;
            this.form.photo = draft.photo;
            this.photos = data.photo;
            this.form.remark = draft.remark;

            // this.form.staff_id = draft.staff_id;
            // this.form.staff_name = draft.staff_name;
            // this.form.department_id = draft.department_id;
            // this.form.department_name = draft.department_name;
          } else {
            this.receiptNum();
            this.form.id = '';
          }
        })
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.userInfo(true);
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.id = '';
        this.form.trans_type = '0';
        this.form.contract_id = '';
        this.form.house_id = '';
        this.form.address = '';
        this.form.month = '';
        this.form.day = '';
        this.form.begin_date = '';
        this.form.sign_date = '';
        this.form.end_date = '';
        this.datePrice = [];
        this.datePay = [];
        this.amountPrice = 1;
        this.form.period_price_arr = [''];
        this.form.price_arr = [''];
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
        this.form.discount = 0;
        this.is_corp = 1;
        this.corp = true;
        this.is_agency = 0;
        this.cusFrom = false;
        this.form.agency_name = '';
        this.form.agency_price = '';
        this.form.agency_user_name = '';
        this.form.agency_phone = '';

        this.form.other_fee_name = '';
        this.form.other_fee = '';
        this.form.is_other_fee = 0;
        this.other_fee_status = false;

        this.receiptNum();

        this.form.contract_number = 'LJZF';
        this.form.property_payer = '';
        this.property_name = '';
        this.form.retainage_date = '';
        this.form.name = '';
        this.form.phone = '';
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.leaders = {};
        this.form.photo = [];
        this.photos = {};
        this.form.remark = '';
      }
    },
  }
</script>

<style lang="scss">
  #rentReport {
    overflow: hidden;
  }
</style>
