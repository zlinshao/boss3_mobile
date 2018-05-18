<template>
  <div id="transferReport">
    <div class="main" id="main">
      <van-cell-group style="margin-bottom: 12px;">
        <van-field
          v-model="form.old_house_name"
          label="原房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择原房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.old_staff_name"
          label="原开单人"
          type="text"
          disabled
          placeholder="原房屋原开单人已禁用">
        </van-field>
        <van-field
          class="disabling"
          :class="{'payWay': payStatus && form.old_pay_way_arr.length > 1}"
          @click="payWayClick(1)"
          v-model="form.old_pay_way_arr[0]"
          label="原付款方式"
          type="text"
          readonly
          icon="arrow"
          placeholder="原房屋付款方式已禁用">
        </van-field>
        <div class="accordion" v-if="payStatus && form.old_pay_way_arr.length > 1">
          <div class="accordion" v-if="priceStatus && form.old_pay_way_arr.length > 1">
            <div v-for="(key,index) in form.old_pay_way_arr" v-show="index !== 0">{{key}}</div>
          </div>
        </div>
        <van-field
          class="disabling"
          :class="{'payWay': priceStatus && form.old_price.length > 1}"
          v-model="form.old_price[0]"
          @click="payWayClick(2)"
          label="月单价"
          type="text"
          readonly
          icon="arrow"
          placeholder="月单价已禁用">
        </van-field>
        <div class="accordion" v-if="priceStatus && form.old_price.length > 1">
          <div v-for="(key,index) in form.old_price" v-show="index !== 0">{{key}}</div>
        </div>
        <van-field
          v-model="form.old_money_sum"
          label="定金"
          type="text"
          disabled
          placeholder="原房屋定金已禁用">
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.address"
          label="现房屋地址"
          type="text"
          readonly
          @click="searchSelect(2)"
          placeholder="请选择房现房屋地址"
          required>
        </van-field>
        <!--<van-field-->
        <!--v-if="rooms.length !== 0"-->
        <!--v-model="roomsName"-->
        <!--type="text"-->
        <!--label="合租房"-->
        <!--readonly-->
        <!--@click="selectShow(4,'')"-->
        <!--placeholder="请选择合租房"-->
        <!--required>-->
        <!--</van-field>-->
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
            placeholder="请填写月数">
          </van-field>
          <van-field
            class="twoBorder"
            v-model="form.day"
            type="number"
            placeholder="请填写天数">
          </van-field>
        </div>
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
            label="开始日期"
            placeholder="款项开始时间"
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
          v-model="form.discount"
          label="让价总金额"
          type="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.discount = 0"
          required>
        </van-field>
        <van-switch-cell v-model="corp" title="是否公司单"/>
        <van-field
          v-model="form.receipt"
          label="收据编号"
          type="text"
          placeholder="请填写收据编号">
        </van-field>
        <van-field
          v-model="form.contract_number"
          label="合同编号"
          type="text"
          placeholder="请填写合同编号"
          icon="clear"
          @click-icon="form.contract_number = ''">
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
          @click="searchSelect(3)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="form.department_name"
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

        first_date: [],            //日期value

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payIndex: '',               //付款方式index

        amountMoney: 1,
        moneyNum: [''],             //分金额 付款方式

        corp: true,                    //公司单
        rooms: [],
        roomsName: '',

        payStatus: false,
        priceStatus: false,
        other_fee_status: false,

        form: {
          old_staff_name: '',
          old_pay_way_arr: [''],
          old_price: [''],
          old_money_sum: '',
          old_house_name: '',

          address: '',
          id: '',
          draft: 0,
          contract_id_rent: '',         //原租房合同id
          contract_id: '',              //现房屋合同id
          house_id_rent: '',
          house_id: '',
          room_id: '',                  //合租房间ID
          rooms_mate: [],               //合租房间
          month: '',                    //签约时长
          day: '',                      //签约时长天
          begin_date: '',               //合同开始日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式

          discount: 0,                   //让价金额
          contract_number: 'LJZF',           //合同编号
          is_corp: 1,                   //是否公司单  0个人1公司
          receipt: '',                  //收据编号
          retainage_date: '',           //尾款补齐时间

          is_other_fee: 0,
          other_fee: '',
          other_fee_name: '',

          screenshot: '',               //领导截图 数组
          screenshot_leader: [],        //领导截图 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',                  //开单人name
          department_name: '',             //部门name
        },
        screenshots: {},
        photos: {},
        leaders: {},

        dictValue8: [],         //支付方式
        value8: [],

        isValue1: true,
        isValue2: false,
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
      userInfo(val1, val2) {
        if (val1 && val2) {
          let per = JSON.parse(sessionStorage.personal);
          this.form.staff_id = per.id;
          this.form.staff_name = per.name;
          this.form.department_id = per.department_id;
          this.form.department_name = per.department_name;
        }
      },

      dicts(val) {
        //支付方式
        this.dictionary(508, 1).then((res) => {
          this.value8 = [];
          this.dictValue8 = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.value8.push(res.data[i].dictionary_name);
          }
          this.rentDetail(val);
        });
      },
      payWayClick(val) {
        if (val === 1) {
          this.payStatus = !this.payStatus;
          this.priceStatus = false;
        } else {
          this.priceStatus = !this.priceStatus;
          this.payStatus = false;
        }
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
            this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
            break;
          case 3:
            this.$router.push({path: '/organize'});
            break;
          case 5:
            this.$router.push({path: '/depart'});
            break;
        }
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
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        this.selectHide = true;
        switch (val) {
          case 2:
            this.columns = this.value8;
            break;
          case 3:
            this.columns = dicts.value9;
            break;
          case 4:
            this.columns = this.rooms;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
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
            for (let i = 0; i < this.form.rooms_mate.length; i++) {
              if (this.form.rooms_mate[i].name === value) {
                this.form.room_id = this.form.rooms_mate[i].id;
              }
            }
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

      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.form.is_corp = this.corp ? 1 : 0;
            this.form.is_other_fee = this.other_fee_status ? 1 : 0;
            this.form.day = this.form.day === '' ? '0' : this.form.day;
            this.form.contract_number = this.form.contract_number === 'LJZF' ? '' : this.form.contract_number;
            this.$http.post(this.urls + 'bulletin/change', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50510') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50520') {
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
          if (t.type === 'renter') {
            this.form.old_house_name = val.house_name;
            this.form.contract_id_rent = val.id;
            this.form.house_id_rent = val.house_id;

            this.$http.get(this.urls + 'bulletin/helper/contract/' + val.id + '?collect_or_rent=1').then((res) => {
              if (res.data.code === '51110') {
                let pay = res.data.data;
                this.form.old_staff_name = pay.staff.name;
                this.form.old_money_sum = pay.money_sum;
                this.form.old_pay_way_arr = [];
                this.form.old_price = [];
                for (let i = 0; i < pay.pay_way.length; i++) {
                  this.form.old_pay_way_arr.push(pay.pay_way[i].begin_date + '~' + pay.pay_way[i].end_date + ':' + pay.pay_way[i].pay_way_str);
                }
                for (let i = 0; i < pay.price.length; i++) {
                  this.form.old_price.push(pay.price[i].begin_date + '~' + pay.price[i].end_date + ':' + pay.price[i].price_str);
                }
              }
            })

          } else {
            this.form.address = val.house_name;
            this.form.contract_id = val.id;
            this.form.house_id = val.house_id;
          }
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
        this.userInfo(this.isValue1, this.isValue2);
      },

      rentDetail(val) {
        this.isValue2 = true;
        this.userInfo(true, true);
        let type;
        if (val !== '') {
          type = 'bulletin/change/' + val;
        } else {
          type = 'bulletin/change';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50520') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.month = draft.month;
            this.form.day = draft.day === '0' ? '' : draft.day;
            this.form.contract_number = this.form.contract_number === 'LJZF' ? '' : this.form.contract_number;

            this.form.address = draft.address;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.contract_id_rent = draft.contract_id_rent;
            this.form.house_id_rent = draft.house_id_rent;

            this.form.old_house_name = draft.old_house_name;
            this.form.old_staff_name = draft.old_staff_name;
            this.form.old_pay_way_arr = draft.old_pay_way_arr;
            this.form.old_price = draft.old_price;
            this.form.old_money_sum = draft.old_money_sum;

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
            this.is_corp = draft.is_corp;
            this.corp = draft.is_corp === 1 ? true : false;
            this.form.period_pay_arr = draft.period_pay_arr;
            this.countDate(2, draft.period_pay_arr);
            this.form.pay_way_arr = draft.pay_way_arr;

            this.form.money_sum = draft.money_sum;
            for (let i = 0; i < draft.money_sep.length; i++) {
              this.amountMoney = i + 1;
              this.form.money_way.push('');
              for (let j = 0; j < this.dictValue8.length; j++) {
                if (this.dictValue8[j].id === draft.money_way[i]) {
                  this.moneyNum[i] = this.dictValue8[j].dictionary_name;
                }
              }
            }
            this.form.money_sep = draft.money_sep;
            this.form.money_way = draft.money_way;

            this.form.receipt = draft.receipt;
            this.form.discount = draft.discount;
            this.form.retainage_date = draft.retainage_date;

            this.other_fee_status = draft.is_other_fee === 1 ? true : false;
            this.form.other_fee_name = draft.other_fee_name;
            this.form.other_fee = draft.other_fee;

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
            this.form.id = '';
          }
        })
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.userInfo(true, true);
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.address = '';

        this.form.old_house_name = '';
        this.form.old_staff_name = '';
        this.form.old_pay_way_arr = [''];
        this.form.old_price = [''];
        this.form.old_money_sum = '';

        this.form.id = '';
        this.form.contract_id_rent = '';
        this.form.contract_id = '';
        this.form.house_id_rent = '';
        this.form.house_id = '';
        this.form.month = '';
        this.form.day = '';
        this.form.rooms_mate = [];
        this.form.room_id = '';
        this.rooms = [];
        this.roomsName = '';
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

        this.is_corp = 1;
        this.corp = true;
        this.form.receipt = '';
        this.form.discount = 0;
        this.form.retainage_date = '';
        this.form.contract_number = 'LJZF';
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.leaders = {};
        this.form.photo = [];
        this.photos = {};
        this.form.remark = '';

        this.form.other_fee_name = '';
        this.form.other_fee = '';
        this.form.is_other_fee = 0;
        this.other_fee_status = false;
      },
    },
  }
</script>

<style lang="scss">
  #transferReport {
    overflow: hidden;
  }
</style>
