<template>
  <div id="finalReport">
    <div class="main" id="main">
      <van-cell-group>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect()"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.customer_name"
          label="客户姓名"
          type="text"
          placeholder="客户姓名已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="form.month"
          type="text"
          label="租房月数"
          placeholder="租房月数已禁用"
          disabled>
        </van-field>
        <van-field
          class="disabling"
          :class="{'payWay': payStatus && form.payWay.length > 1}"
          @click="payWayClick(1)"
          v-model="form.payWay[0]"
          label="付款方式"
          type="text"
          disabled
          icon="arrow"
          placeholder="付款方式已禁用">
        </van-field>
        <div class="accordion" v-if="payStatus && form.payWay.length > 1">
          <div v-for="(key,index) in form.payWay" v-show="index !== 0">{{key}}</div>
        </div>
        <van-field
          class="disabling"
          :class="{'payWay': priceStatus && form.price_arr.length > 1}"
          v-model="form.price_arr[0]"
          @click="payWayClick(2)"
          label="月单价"
          type="text"
          disabled
          icon="arrow"
          placeholder="月单价已禁用">
        </van-field>
        <div class="accordion" v-if="priceStatus && form.price_arr.length > 1">
          <div v-for="(key,index) in form.price_arr" v-show="index !== 0">{{key}}</div>
        </div>
        <van-field
          v-model="form.terms"
          @click="selectShow(2,'')"
          label="房租期数"
          type="text"
          placeholder="请选择房租期数"
          readonly>
        </van-field>
      </van-cell-group>

      <!--<div class="aloneModel">-->
        <!--<div class="title">历史凭证截图</div>-->
        <!--<div class="showPics" v-if="certificate_photo.length > 0">-->
          <!--<img v-for="(key,index) in certificate_photo" :src="key" @click="bigPic(certificate_photo, index)">-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="aloneModel">-->
        <!--<div class="title">历史押金收条</div>-->
        <!--<div class="showPics" v-if="deposit_photos.length > 0">-->
          <!--<img v-for="(key,index) in deposit_photos" :src="key" @click="bigPic(deposit_photos, index)">-->
        <!--</div>-->
      <!--</div>-->

      <van-cell-group>
        <van-field
          v-model="form.front_money"
          type="text"
          class="number"
          label="定金"
          @keyup="moneyAll"
          placeholder="请填写金额">
        </van-field>
        <van-field
          v-model="form.deposit_payed"
          label="押金"
          @keyup="moneyAll"
          type="text"
          class="number"
          placeholder="请填写押金">
        </van-field>
        <van-field
          v-model="form.rent_money"
          label="租金"
          @keyup="moneyAll"
          type="text"
          class="number"
          placeholder="请填写租金">
        </van-field>
        <van-field
          v-model="form.money_sum"
          type="text"
          class="number"
          label="总金额"
          placeholder="请填写总金额">
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>已收金额支付方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index,1)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.money_sep[index]"
            type="text"
            class="number"
            label="金额"
            placeholder="请填写金额"
            required>
          </van-field>
          <van-field
            @click="selectShow(1,index)"
            v-model="form.money_way[index]"
            label="汇款帐户"
            type="text"
            readonly
            placeholder="请选择汇款帐户"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(1)" class="addInput">
        +支付方式变化
      </div>

      <van-cell-group>
        <!--<van-field-->
          <!--v-model="form.deposit"-->
          <!--label="押金"-->
          <!--type="text"-->
          <!--class="number"-->
          <!--placeholder="请填写已收押金"-->
          <!--required>-->
        <!--</van-field>-->
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
          v-model="form.retainage_date"
          label="尾款补齐日期"
          readonly
          type="text"
          @click="timeChoose()"
          placeholder="请选择尾款补齐日期"
          required>
        </van-field>
        <van-switch-cell v-model="is_receipt" title="电子收据"/>
        <div class="is_receipt_css" v-if="!is_receipt">{{isReceiptMsg.content1}}</div>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountReceipt" v-if="!is_receipt">
        <div class="paddingTitle">
          <span>收据编号<span v-if="amountReceipt > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountReceipt > 1" @click="deleteAmount(index,2)">删除</span>
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
      <div @click="priceAmount(2)" class="addInput" v-if="!is_receipt">
        +增加收据编号
      </div>

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
          label="开单人"
          type="text"
          disabled
          placeholder="开单人已禁用">
        </van-field>
        <van-field
          v-model="form.department_name"
          label="部门"
          type="text"
          readonly
          placeholder="部门已禁用">
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
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';
  import {Dialog} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast, ImagePreview},
    data() {
      return {
        haveInHand: true,
        urls: globalConfig.server,
        isClear: false,           //删除图片
        picStatus: 'success',

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeValue: '',            //日期value

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择

        certificate_photo: [],    //凭证截图
        // certificate_id: [],       //凭证截图
        deposit_photos: [],        //押金收条
        // deposit_id: [],           //押金收条

        periods: [],

        payStatus: false,
        priceStatus: false,

        amountMoney: 1,
        payIndex: '',                 //分金额方式index

        amountReceipt: 1,                  //收据编号
        receiptDate: '',

        other_fee_status: false,

        is_receipt: false,               //电子收据
        isReceiptMsg: {},                //电子收据
        form: {
          address: '',
          id: '',
          processable_id: '',
          draft: 0,
          month: '',
          terms: '',
          contract_id: '',              //房屋地址id
          house_id: '',                 //房屋地址id
          payWay: [''],                 //付款方式
          price_arr: [''],              //月单价
          is_other_fee: 0,
          other_fee: '',
          other_fee_name: '',
          customer_name: '',            //客户姓名
          is_receipt: 1,                //1是 2不是
          receipt: [],                  //收据编号
          front_money: '',              //定金
          deposit: '',                  //押金
          deposit_payed: '',            //已收押金
          rent_money: '',               //租金
          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式
          account_id: [],               //汇款方式ID
          retainage_date: '',           //尾款补齐日期
          screenshot_leader: [],        //领导截图 数组
          screenshot: [],               //凭证截图 数组
          screenshot_old: [],           //凭证截图 数组
          screenshot_new: [],           //凭证截图 数组
          deposit_photo: [],            //押金收条 数组
          deposit_photo_old: [],        //押金收条 数组
          deposit_photo_new: [],        //押金收条 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        leaders: {},
        screenshots: {},
        receipts: {},

        dictValue8: [],                 //支付方式
        value8: [],

        counts: '',
        retry: 0,
      }
    },
    watch: {
      is_receipt(val) {
        if (val) {
          Dialog.alert({
            title: this.isReceiptMsg.title,
            message: this.isReceiptMsg.msg
          }).then(() => {});
        }
        if (this.form.is_receipt === 1) {
          this.amountReceipt = 1;
          this.form.receipt = [];
          this.form.receipt[0] = this.receiptDate;
        }
      }
    },
    mounted() {
      this.isReceiptMsg = isReceiptMessage;
      this.getNowFormatDate();
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
    methods: {
      moneyAll() {
        this.form.money_sum = this.countMoney(this.form);
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
            this.finalDetail(val);
          }
        });
      },

      receiptNum() {
        // 收据编号默认城市
        this.form.receipt = [];
        this.$http.get(this.urls + 'setting/others/ip_address').then((res) => {
          if (res.data.code === '1000120') {
            // 收据编号默认日期
            if (res.data.data.py) {
              this.receiptDate = res.data.data.py + res.data.data.year;
              let receipt = res.data.data.py + res.data.data.year;
              this.form.receipt.push(receipt);
            } else {
              this.receiptDate = 'NJ' + res.data.data.year;
              let receipt = 'NJ' + res.data.data.year;
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
      // 截图
      getImgData(val) {
        this.picStatus = val[2];
        if (val[0] === 'leader') {
          this.form.screenshot_leader = val[1];
        } else if (val[0] === 'receipt') {
          this.form.deposit_photo_new = val[1];
        } else {
          this.form.screenshot_new = val[1];
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
      timeChoose() {
        setTimeout(() => {
          this.timeShow = true;
        }, 200);
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate() {
        this.timeShow = false;
        this.form.retainage_date = this.timeValue;
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
            this.columns = this.value8;
            break;
          case 2:
            this.columns = this.periods;
            break;
          case 3:
            this.columns = this.cities;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.form.money_way[this.payIndex] = value;
            this.dictValue8.forEach(res => {
              if (res.bank_info === value) {
                this.form.account_id[this.payIndex] = res.id;
              }
            });
            break;
          case 2:
            this.form.terms = value;
            break;
          case 3:
            this.form.receipt[this.payIndex].city = value;
            break;
        }
        this.selectHide = false;
      },
      searchSelect() {
        this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
      },

      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
      },
      // 增加 定金
      priceAmount(val) {
        if (val === 1) {
          this.amountMoney++;
          this.form.money_sep.push('');
          this.form.money_way.push('');
          this.form.account_id.push('');
        } else {
          this.amountReceipt++;
          this.form.receipt.push(this.receiptDate);
        }

      },
      // 删除 定金
      deleteAmount(index, val) {
        if (val === 1) {
          this.amountMoney--;
          this.form.money_sep.splice(index, 1);
          this.form.money_way.splice(index, 1);
          this.form.account_id.splice(index, 1);
        } else {
          this.amountReceipt--;
          this.form.receipt.splice(index, 1);
        }
      },
      noRepeat(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
              arr.splice(j, 1);
              j--;
            }
          }
        }
        return arr;
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
          let certificatePics = [];
          let depositPics = [];
          certificatePics = this.form.screenshot_new.concat(this.form.screenshot_old);
          this.form.screenshot = this.noRepeat(certificatePics);
          depositPics = this.form.deposit_photo_new.concat(this.form.deposit_photo_old);
          this.form.deposit_photo = this.noRepeat(depositPics);
          this.form.is_receipt = this.is_receipt ? 1 : 0;
          this.amountReceipt = receipt.length === 0 ? 1 : receipt.length;
          this.form.receipt = receipt;
          this.form.draft = val;
          this.form.is_other_fee = this.other_fee_status ? 1 : 0;
          this.$http.post(this.urls + 'bulletin/retainage', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '50910' || res.data.code === '50930') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '50920') {
              if (receipt.length === 0) {
                this.form.receipt = [];
                this.form.receipt.push(this.receiptDate);
              }
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
          this.form.customer_name = val.customers;
          this.form.address = val.house_name;
          this.form.month = val.month;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.helperBulletin(val.id);
          this.deposit_photos = [];
          this.form.deposit_photo_old = [];
          this.certificate_photo = [];
          this.form.screenshot_old = [];
          // this.getPic(val.album.deposit_photo, 1);
          // this.getPic(val.album.certificate_photo, 2);
          this.form.deposit_photo_old = val.album.deposit_photo;
          this.form.screenshot_old = val.album.certificate_photo;
        }
      },

      getPic(album, val) {
        this.$http.post(this.urls + 'special/special/picUrl', {
          id: album,
        }).then((res) => {
          if (res.data.code === '10000') {
            if (val === 1) {
              res.data.data.forEach((arr) => {
                this.deposit_photos.push(arr.uri);
              });
            } else {
              res.data.data.forEach((arr) => {
                this.certificate_photo.push(arr.uri);
              });
            }
          }
        })
      },
      bigPic(arr, index) {
        ImagePreview(arr, index);
      },
      helperBulletin(id) {
        this.$http.get(this.urls + 'bulletin/helper/contract/' + id + '?collect_or_rent=1').then((res) => {
          if (res.data.code === '51110') {
            let pay = res.data.data;
            // this.form.month = pay.month;
            this.periods = [];
            for (let i = 0; i < pay.terms; i++) {
              this.periods.push(i + 1);
            }
            this.form.payWay = [];
            this.form.price_arr = [];
            for (let i = 0; i < pay.pay_way.length; i++) {
              this.form.payWay.push(pay.pay_way[i].begin_date + '~' + pay.pay_way[i].end_date + ':' + pay.pay_way[i].pay_way_str);
            }
            for (let i = 0; i < pay.price.length; i++) {
              this.form.price_arr.push(pay.price[i].begin_date + '~' + pay.price[i].end_date + ':' + pay.price[i].price_str);
            }

          }
        })
      },

      finalDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/retainage/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          }
        } else {
          type = 'bulletin/retainage';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50920') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.address = draft.address;
            this.form.month = draft.month;
            this.form.price_arr = draft.price_arr;
            this.form.payWay = draft.payWay;
            this.form.terms = draft.terms;

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
            this.form.contract_id = draft.contract_id;
            this.helperBulletin(draft.contract_id);
            this.form.house_id = draft.house_id;

            this.form.front_money = draft.front_money;
            this.form.deposit = draft.deposit;
            this.form.deposit_payed = draft.deposit_payed ? draft.deposit_payed : '';
            this.form.rent_money = draft.rent_money;
            this.form.money_sum = draft.money_sum;
            this.form.money_sep = draft.money_sep;
            this.form.money_way = draft.money_way;
            for (let i = 0; i < draft.money_way.length; i++) {
              this.amountMoney = i + 1;
              for (let j = 0; j < this.dictValue8.length; j++) {
                if (this.dictValue8[j].bank_info === draft.money_way[i]) {
                  this.form.account_id[i] = this.dictValue8[j].id;
                }
              }
            }

            this.form.retainage_date = draft.retainage_date;
            this.other_fee_status = draft.is_other_fee === 1 ? true : false;
            this.form.other_fee_name = draft.other_fee_name;
            this.form.other_fee = draft.other_fee;
            this.form.customer_name = draft.customer_name;

            this.form.screenshot_leader = draft.screenshot_leader;
            this.leaders = data.screenshot_leader;
            this.form.screenshot = draft.screenshot;
            this.form.screenshot_new = draft.screenshot_new;
            this.form.screenshot_old = draft.screenshot_old;
            this.screenshots = data.screenshot_new;
            this.form.deposit_photo = draft.deposit_photo;
            this.form.deposit_photo_new = draft.deposit_photo_new;
            this.form.deposit_photo_old = draft.deposit_photo_old;
            this.receipts = data.deposit_photo_new;
            // this.getPic(draft.deposit_photo_old, 1);
            // this.getPic(draft.screenshot_old, 2);
            this.form.remark = draft.remark;
            this.form.staff_name = draft.staff_name;
            this.form.department_name = draft.department_name;
            this.form.staff_id = draft.staff_id;
            this.form.department_id = draft.department_id;
          } else {
            this.receiptNum();
            this.form.id = ''
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
        $('.imgItem').remove();
        this.picStatus = 'success';
        this.form.id = '';
        this.form.processable_id = '';
        this.form.address = '';
        this.form.month = '';
        this.certificate_photo = [];

        this.deposit_photos = [];

        this.form.price_arr = [''];
        this.form.payWay = [''];
        this.form.terms = '';
        this.periods = [];
        this.form.contract_id = '';
        this.form.house_id = '';
        this.form.front_money = '';
        this.form.deposit = '';
        this.form.deposit_payed = '';
        this.form.rent_money = '';
        this.form.money_sum = '';
        this.form.retainage_date = '';
        this.amountMoney = 1;
        this.form.account_id = [];
        this.form.money_sep = [''];
        this.form.money_way = [''];
        this.form.screenshot = [];
        this.form.screenshot_new = [];
        this.form.screenshot_old = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.leaders = {};
        this.form.deposit_photo = [];
        this.form.deposit_photo_new = [];
        this.form.deposit_photo_old = [];
        this.receipts = {};
        this.amountReceipt = 1;
        this.is_receipt = false;
        this.form.receipt = [];
        this.form.receipt[0] = this.receiptDate;

        this.form.other_fee_name = '';
        this.form.other_fee = '';
        this.form.customer_name = '';
        this.form.is_other_fee = 0;
        this.other_fee_status = false;

        this.form.remark = '';
        this.form.staff_name = '';
        this.form.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
      }
    },
  }
</script>

<style lang="scss">
  #finalReport {
    overflow: hidden;
    .showPics {
      img {
        width: 1.2rem;
        height: 1.2rem;
        margin: .24rem 0 0 .24rem;
      }
    }
  }
</style>
