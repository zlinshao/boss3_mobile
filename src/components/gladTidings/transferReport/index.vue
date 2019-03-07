<template>
  <div id="transferReport">
    <div class="main" id="main">
      <van-cell-group style="margin-bottom: 12px;">
        <div class="crop_name noBorder">
          <van-field
            v-model="form.old_house_name"
            label="原房屋地址"
            type="text"
            readonly
            @click="searchSelect(1)"
            placeholder="请选择原房屋地址"
            required>
          </van-field>
          <div class="titleRed" v-if="form.old_corp_name">{{form.old_corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
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
          v-model="form.old_front_money"
          label="定金"
          type="text"
          disabled
          placeholder="原房屋定金已禁用">
        </van-field>

      </van-cell-group>
      <van-cell-group>
        <div class="crop_name noBorder">
          <van-field
            v-model="form.address"
            label="现房屋地址"
            type="text"
            readonly
            @click="searchSelect(2)"
            placeholder="请选择房现房屋地址"
            required>
          </van-field>
          <div class="titleRed" v-if="form.corp_name">{{form.corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
        <van-field
          v-model="form.sign_date"
          @click="timeChoose('sign_date', form.sign_date)"
          label="签约日期"
          type="text"
          class="number"
          placeholder="请填写签约日期"
          icon="clear"
          readonly
          @click-icon="form.sign_date = ''">
        </van-field>
        <div class="first_date noBorder">
          <div class="titles required">签约时长</div>
          <van-field
            v-model="form.month"
            type="text"
            class="number"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写月数">
          </van-field>
          <van-field
            class="twoBorder number"
            v-model="form.day"
            type="text"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写天数">
          </van-field>
        </div>
        <van-field
          v-model="form.begin_date"
          type="text"
          label="合同开始日期"
          placeholder="获取开始日期"
          @click="timeChoose('begin_date', form.begin_date)"
          readonly
          required>
        </van-field>
        <van-field
          v-model="form.end_date"
          type="text"
          label="合同结束日期"
          placeholder="获取结束日期"
          @click="timeChoose('end_date', form.end_date)"
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
            type="text"
            class="number"
            label="周期"
            :disabled="amountPrice === 1 && form.period_price_arr[index] === form.month"
            @keyup="periodDate(1)"
            placeholder="请填写月单价周期"
            required>
          </van-field>
          <van-field
            v-model="form.price_arr[index]"
            type="text"
            class="number"
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
          type="text"
          class="number"
          label="押"
          placeholder="请填写付款方式-押"
          @click="selectShow(3)"
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
            type="text"
            class="number"
            label="周期"
            :disabled="amountPay === 1 && form.period_pay_arr[index] === form.month"
            @keyup="periodDate(2)"
            placeholder="请填写付款方式周期"
            required>
          </van-field>
          <van-field
            v-model="form.pay_way_arr[index]"
            label="付(月数)"
            type="text"
            class="number"
            placeholder="如:半年付请输入6"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(2)" class="addInput">
        +付款方式变化
      </div>
      <div class="changes">
        <div class="paddingTitle">
          <span>本次已收金额</span>
        </div>
      </div>
      <van-cell-group>
        <div class="checks">
          <div class="titles required">本次金额为</div>
          <van-radio-group v-model="receivedPrice">
            <van-radio name="front_money">定金</van-radio>
            <van-radio name="deposit_payed">租金+押金</van-radio>
          </van-radio-group>
        </div>
        <van-field
          v-model="form.money_sum"
          type="text"
          class="number"
          label="总金额"
          placeholder="请填写总金额"
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
            v-model="form.real_pay_at[index]"
            type="text"
            readonly
            class="number"
            @click="timeChoose('real_pay_at', form.real_pay_at[index], index)"
            label="实际收款时间"
            placeholder="付款凭证截图上的时间"
            required>
          </van-field>
          <van-field
            @click="selectShow(2,index)"
            v-model="form.money_way[index]"
            label="汇款帐户"
            type="text"
            readonly
            placeholder="请选择汇款帐户"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(3)" class="addInput">
        +支付方式变化
      </div>

      <van-cell-group>
        <van-field
          v-model="form.name"
          label="客户姓名"
          type="text"
          placeholder="请填写客户姓名"
          icon="clear"
          @click-icon="form.name = ''">
        </van-field>
        <van-field
          v-model="form.phone"
          label="联系方式"
          type="text"
          class="number"
          placeholder="请填写客户联系方式"
          icon="clear"
          @click-icon="form.phone = ''">
        </van-field>
        <van-field
          v-model="form.memo"
          label="收款备注"
          type="textarea"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.memo = ''">
        </van-field>
        <div class="addInput" @click="previewReceipt(form, receivedPrice)">预览电子收据</div>
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
          type="text"
          class="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.other_fee = ''"
          required>
        </van-field>
        <van-field
          v-model="form.discount"
          label="让价总金额"
          type="text"
          class="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.discount = 0"
          required>
        </van-field>
        <van-switch-cell v-model="corp" title="是否公司单"/>
        <van-switch-cell v-model="is_receipt" title="电子收据"/>
        <div class="is_receipt_css" v-if="!is_receipt">{{isReceiptMsg.content1}}</div>
      </van-cell-group>
      <div class="changes" v-for="(key,index) in amountReceipt" v-if="!is_receipt">
        <div class="paddingTitle">
          <span>收据编号<span v-if="amountReceipt > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountReceipt > 1" @click="deleteAmount(index,4)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.receipt[index]"
            type="text"
            label="收据编号"
            placeholder="请填写收据编号">
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(4)" class="addInput" v-if="!is_receipt">
        +增加收据编号
      </div>
      <van-cell-group>
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
          @click="timeChoose('retainage_date', form.retainage_date)"
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
        <div class="title">
          押金收条
          <div v-if="is_receipt">{{isReceiptMsg.content2}}</div>
        </div>
        <UpLoad :ID="'receipt'" @getImg="getImgData" :isClear="isClear" :editImage="receipts"></UpLoad>
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

    <div class="footer" v-if="counts === '2' || counts === '21'">
      <div @click="saveCollect(0)">修改</div>
    </div>

    <div class="footer" v-if="counts === '1' || counts === '11'">
      <div @click="close_()">重置</div>
      <div @click="saveCollect(1)">草稿</div>
      <div @click="saveCollect(0)">发布</div>
    </div>

    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel"
                @onDate="onConTime"></ChooseTime>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import ChooseTime from '../../common/chooseTime.vue'
  import {Toast} from 'vant';
  import {Dialog} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast, ChooseTime},
    data() {
      return {
        timeModule: false,              //日期
        formatData: {
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          dateType: '',                 //日期类型
          idx: '',                      //下标
        },
        haveInHand: true,
        urls: globalConfig.server,
        isClear: false,           //删除图片
        picStatus: 'success',

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择
        timeShow: false,          //日期状态
        first_date: [],            //日期value
        receivedPrice: 'front_money',   //本次金额为

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payIndex: '',               //付款方式index

        amountMoney: 1,

        amountReceipt: 1,                  //收据编号
        receiptDate: '',

        corp: true,                    //公司单

        payStatus: false,
        priceStatus: false,
        other_fee_status: false,
        is_receipt: false,               //电子收据
        isReceiptMsg: {},                //电子收据
        form: {
          old_staff_name: '',
          old_pay_way_arr: [''],
          old_price: [''],
          old_front_money: '',
          old_house_name: '',
          old_corp_name: '',

          sign_date: '',
          name: '',
          phone: '',

          address: '',
          corp_name: '',
          id: '',
          processable_id: '',
          draft: 0,
          house_id_rent: '',
          contract_id_rent: '',         //原租房合同id
          house_id: '',
          contract_id: '',              //现房屋合同id
          month: '',                    //签约时长
          day: '',                      //签约时长天
          begin_date: '',               //合同开始日期
          end_date: '',                 //合同结束日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期

          front_money: '',              //定金
          deposit: '',                  //押金
          deposit_payed: '',            //已收押金
          rent_money: '',               //租金
          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          real_pay_at: [''],            //实际收款时间
          money_way: [''],              //分金额 方式
          account_id: [],               //汇款帐户ID
          memo: '',                     //收款备注

          discount: 0,                   //让价金额
          contract_number: 'LJZF',       //合同编号
          is_corp: 1,                    //是否公司单  0个人1公司
          receipt: [''],                 //收据编号
          retainage_date: '',            //尾款补齐时间

          is_other_fee: 0,
          other_fee: '',
          other_fee_name: '',

          screenshot: '',               //凭证截图 数组
          screenshot_leader: [],        //领导截图 数组
          deposit_photo: [],            //押金收条 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        screenshots: {},
        photos: {},
        leaders: {},
        receipts: {},

        dictValue8: [],         //支付方式
        value8: [],

        isValue1: true,
        counts: '',

        retry: 0,
      }
    },
    mounted() {
      this.isReceiptMsg = isReceiptMessage;
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.dicts('');
      }
    },
    activated() {
      let count = sessionStorage.count;
      this.counts = count;

      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
      }
      if (count === '1') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.dicts('');
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      if (count === '21') {
        this.isValue1 = false;
        let newID = JSON.parse(sessionStorage.process);
        if (newID.type === 2) {
          this.routerTo('/publishDetail', newID.ids);
        } else {
          this.counts = '1';
          this.routerIndex('');
          this.ddRent('');
        }
      }
      if (count === '2') {
        sessionStorage.setItem('process', JSON.stringify(this.$route.query));
        let newID = JSON.parse(sessionStorage.process);
        if (newID.type === 2) {
          this.close_();
          this.routerTo('/publishDetail', newID.ids);
        } else {
          this.counts = '1';
          this.close_();
          this.routerIndex('');
          this.ddRent('');
        }
        this.close_();
        this.dicts(newID);
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      this.houseInfo();
    },
    watch: {
      receivedPrice() {
        this.form.money_sum = '';
        this.form.front_money = '';
        this.form.deposit_payed = '';
      },
      is_receipt(val) {
        if (val) {
          Dialog.alert({
            title: this.isReceiptMsg.title,
            message: this.isReceiptMsg.msg
          }).then(() => {
          });
        }
        if (this.form.is_receipt === 1) {
          this.amountReceipt = 1;
          this.form.receipt = [];
          this.form.receipt[0] = this.receiptDate;
        }
      }
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
        this.receiptNum();
        // 收款帐户
        let per = JSON.parse(sessionStorage.personal);
        this.$http.get(this.urls + 'financial/account_alloc/map?org_id=' + per.department_id).then(res => {
          if (res.data.code === '20000') {
            this.value8 = [];
            this.dictValue8 = res.data.data;
            res.data.data.forEach(item => {
              this.value8.push(item.bank_info);
            });
          }
          this.rentDetail(val);
        });
      },
      receiptNum() {
        // 收据编号默认城市
        this.form.receipt = [];
        this.$http.get(this.urls + 'setting/others/ip_address').then((res) => {
          if (res.data.code === '1000120') {
            // 收据编号默认日期
            if (res.data.data.py) {
              this.receiptDate = res.data.data.data.py + res.data.data.data.year;
              let receipt = res.data.data.data.py + res.data.data.data.year;
              this.form.receipt.push(receipt);
            } else {
              this.receiptDate = 'NJ' + res.data.data.data.year;
              let receipt = 'NJ' + res.data.data.data.year;
              this.form.receipt.push(receipt);
            }
          }
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
            this.$router.push({path: '/collectHouse', query: {type: 'report'}});
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
        this.picStatus = val[2];
        if (val[0] === 'screenshot') {
          this.form.screenshot = val[1];
        } else if (val[0] === 'leader') {
          this.form.screenshot_leader = val[1];
        } else if (val[0] === 'receipt') {
          this.form.deposit_photo = val[1];
        } else {
          this.form.photo = val[1];
        }
      },
      // 显示日期
      timeChoose(val, time, index = '') {
        setTimeout(() => {
          this.timeModule = true;
        }, 200);
        this.formatData.dateVal = time;
        this.formatData.dataKey = val;
        if (val === 'real_pay_at') {
          this.formatData.dateType = 'datetime';
          this.formatData.idx = index;
        } else {
          this.formatData.dateType = 'date';
        }
      },
      // 确定日期
      onConTime(val) {
        switch (val.dataKey) {
          case 'begin_date':
            this.form[val.dataKey] = val.dateVal;
            this.endDate(val.dateVal, this.form.month, this.form.day, 2);
            this.form.period_price_arr[0] = this.form.month;
            this.form.period_pay_arr[0] = this.form.month;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(val.dateVal);
            this.datePrice.push(val.dateVal);
            this.datePay.push(val.dateVal);
            this.countDate(1, this.form.period_price_arr);
            this.countDate(2, this.form.period_pay_arr);
            break;
          case 'real_pay_at':
            this.form[val.dataKey][this.formatData.idx] = val.dateVal;
            break;
          default:
            this.form[val.dataKey] = val.dateVal;
            break;
        }
        this.onCancel();
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
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeModule = false;
      },
      // select 显示
      selectShow(val, index = '') {
        this.tabs = val;
        this.payIndex = index;
        setTimeout(() => {
          this.selectHide = true;
        }, 200);
        switch (val) {
          case 2:
            this.columns = this.value8;
            break;
          case 3:
            this.columns = dicts.value9;
            break;
          case 5:
            this.columns = this.cities;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 2:
            this.form.money_way[this.payIndex] = value;
            this.dictValue8.forEach(res => {
              if (res.bank_info === value) {
                this.form.account_id[this.payIndex] = res.id;
              }
            });
            break;
          case 3:
            this.form.pay_way_bet = value;
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
          this.form.real_pay_at.push('');
          this.form.account_id.push('');
        } else {
          this.amountReceipt++;
          this.form.receipt.push(this.receiptDate);
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
          this.form.real_pay_at.splice(index, 1);
          this.form.account_id.splice(index, 1);
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
        if (this.picStatus === 'err') {
          Toast(this.alertMsg('errPic'));
          return;
        } else if (this.picStatus === 'lose') {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          this.haveInHand = false;
          let receipt = [];
          for (let i = 0; i < this.form.receipt.length; i++) {
            if (this.form.receipt[i] !== this.receiptDate) {
              receipt.push(this.form.receipt[i]);
            }
          }
          this.form[this.receivedPrice] = this.form.money_sum;
          this.amountReceipt = receipt.length === 0 ? 1 : receipt.length;
          this.form.receipt = receipt;
          this.form.draft = val;
          this.form.is_corp = this.corp ? 1 : 0;
          this.form.is_receipt = this.is_receipt ? 1 : 0;
          this.form.is_other_fee = this.other_fee_status ? 1 : 0;
          this.form.day = this.form.day === '' ? '0' : this.form.day;
          this.form.contract_number = this.form.contract_number === 'LJZF' ? '' : this.form.contract_number;
          this.$http.post(this.urls + 'bulletin/change', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '50510' || res.data.code === '50530') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              if (res.data.data.id) {
                this.routerDetail(res.data.data.id)
              } else {
                this.routerDetail(res.data.data.data.id)
              }
            } else if (res.data.code === '50520') {
              if (receipt.length === 0) {
                this.form.receipt = [];
                this.form.receipt.push(this.receiptDate);
              }
              this.form.day = this.form.day === '0' ? '' : this.form.day;
              this.form.contract_number = this.form.contract_number === '' ? 'LJZF' : this.form.contract_number;
              this.form.id = res.data.data.id;
              Toast.success(res.data.msg);
            } else {
              Toast(res.data.msg);
            }
          }).catch((error) => {
            this.haveInHand = true;
            if (error.response === undefined) {
              this.alertMsg('net');

            } else {
              if (error.response.status === 401) {
                this.personalGet().then((data) => {
                  if (data && this.retry === 0) {
                    this.retry++;

                    this.saveCollect(this.form.draft);
                  }
                });
              }
            }
          })
        } else {
          Toast(this.alertMsg('sub'));
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          if (t.type === 'report') {
            console.log(val)
            this.form.old_house_name = val.house_name;
            this.form.old_corp_name = val.corp_name;
            this.form.contract_id_rent = val.id;
            this.form.house_id_rent = val.house_id;
            this.form.sign_date = val.start_at;
            this.form.name = val.customers;
            this.form.old_front_money = val.front_money;
            this.form.phone = val.cusPhone;

            this.$http.get(this.urls + 'bulletin/helper/contract/' + val.id + '?collect_or_rent=1').then((res) => {
              if (res.data.code === '51110') {
                let pay = res.data.data;
                this.form.old_staff_name = pay.staff ? pay.staff.name : '---';
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
            this.form.corp_name = val.corp_name;
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
        this.userInfo(this.isValue1);
      },

      rentDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/change/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          } else {
            this.userInfo(true);
          }
        } else {
          this.userInfo(true);
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
            this.form.contract_number = draft.contract_number === 'LJZF' ? '' : draft.contract_number;

            this.form.address = draft.address;
            this.form.corp_name = draft.corp_name;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.contract_id_rent = draft.contract_id_rent;
            this.form.house_id_rent = draft.house_id_rent;

            this.form.old_house_name = draft.old_house_name;
            this.form.old_corp_name = draft.old_corp_name;
            this.form.old_staff_name = draft.old_staff_name;
            this.form.old_pay_way_arr = draft.old_pay_way_arr;
            this.form.old_price = draft.old_price;
            this.form.old_front_money = draft.old_front_money;

            this.form.sign_date = draft.sign_date;
            this.form.name = draft.name;
            this.form.phone = draft.phone;

            this.form.begin_date = draft.begin_date;
            this.form.end_date = draft.end_date;
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

            this.form.front_money = draft.front_money;
            this.form.deposit = draft.deposit;
            this.form.deposit_payed = draft.deposit_payed ? draft.deposit_payed : '';
            if (this.form.deposit_payed) {
              this.receivedPrice = 'deposit_payed';
            } else if (this.form.front_money) {
              this.receivedPrice = 'front_money';
            } else {
              this.receivedPrice = 'rent_money';
            }
            this.$nextTick(function () {
              this.form.money_sum = draft.money_sum;
            });
            this.form.memo = draft.memo ? draft.memo : '';
            this.form.money_sep = draft.money_sep;
            this.form.money_way = draft.money_way;
            for (let i = 0; i < draft.money_way.length; i++) {
              if (draft.real_pay_at) {
                this.form.real_pay_at[i] = draft.real_pay_at[i];
              } else {
                this.form.real_pay_at.push('');
              }
              this.amountMoney = i + 1;
              for (let j = 0; j < this.dictValue8.length; j++) {
                if (this.dictValue8[j].bank_info === draft.money_way[i]) {
                  this.form.account_id[i] = this.dictValue8[j].id;
                }
              }
            }

            if (draft.is_receipt) {
              this.is_receipt = true;
              this.form.is_receipt = 1;
              if (!this.is_receipt) {
                this.getReceipt(draft);
              }
            } else {
              this.is_receipt = false;
              this.form.is_receipt = 0;
              this.getReceipt(draft);
            }

            this.form.discount = draft.discount;
            this.form.retainage_date = draft.retainage_date;

            this.other_fee_status = draft.is_other_fee === 1 ? true : false;
            this.form.other_fee_name = draft.other_fee_name;
            this.form.other_fee = draft.other_fee;

            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot ? data.screenshot : {};
            this.form.screenshot_leader = draft.screenshot_leader;
            this.leaders = data.screenshot_leader ? data.screenshot_leader : {};
            this.form.photo = draft.photo;
            this.photos = data.photo ? data.photo : {};
            this.form.deposit_photo = draft.deposit_photo;
            this.receipts = data.deposit_photo ? data.deposit_photo : {};

            this.form.remark = draft.remark;

            if (val !== '' && val.type === 2) {
              this.form.staff_id = draft.staff_id;
              this.form.staff_name = draft.staff_name;
              this.form.department_id = draft.department_id;
              this.form.department_name = draft.department_name;
            }
          } else {
            this.receiptNum();
            this.form.id = '';
          }
        })
      },
      getReceipt(draft) {
        if (typeof draft.receipt !== "string") {
          if (draft.receipt.length !== 0) {
            this.amountReceipt = draft.receipt.length;
            this.form.receipt = [];
            for (let i = 0; i < draft.receipt.length; i++) {
              this.form.receipt.push(draft.receipt[i]);
            }
          } else {
            this.amountReceipt = 1;
            this.form.receipt = [];
            this.form.receipt[0] = this.receiptDate;
          }
        } else {
          this.amountReceipt = 1;
          this.form.receipt = [];
          this.form.receipt[0] = draft.receipt;
        }
      },
      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.userInfo(true);
        $('.imgItem').remove();
        this.picStatus = 'success';
        this.form.address = '';
        this.form.corp_name = '';

        this.form.old_house_name = '';
        this.form.old_corp_name = '';
        this.form.old_staff_name = '';
        this.form.old_pay_way_arr = [''];
        this.form.old_price = [''];
        this.form.old_font_money = '';
        this.receivedPrice = 'front_money';
        this.form.sign_date = '';
        this.form.name = '';
        this.form.phone = '';
        this.form.processable_id = '';
        this.form.contract_id_rent = '';
        this.form.contract_id = '';
        this.form.house_id_rent = '';
        this.form.house_id = '';
        this.form.month = '';
        this.form.day = '';
        this.form.room_id = '';
        this.form.begin_date = '';
        this.form.end_date = '';
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

        this.form.front_money = '';
        this.form.deposit_payed = '';
        this.form.deposit = '';
        this.form.money_sum = '';
        this.amountMoney = 1;

        this.form.money_sep = [];
        this.form.real_pay_at = [''];
        this.form.money_way = [];
        this.form.account_id = [];

        this.is_corp = 1;
        this.corp = true;

        this.is_receipt = false;
        this.form.is_receipt = 1;
        this.amountReceipt = 1;
        this.form.receipt = [];
        this.form.receipt[0] = this.receiptDate;

        this.form.discount = 0;
        this.form.retainage_date = '';
        this.form.contract_number = 'LJZF';
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.leaders = {};
        this.form.photo = [];
        this.photos = {};
        this.form.deposit_photo = [];
        this.receipts = {};
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
