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
          readonly
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
          readonly
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
        <van-field
          v-model="form.money_sum"
          label="总金额"
          type="number"
          placeholder="请填写总金额"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>已收金额支付方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.money_sep[index]"
            type="number"
            label="金额"
            placeholder="请填写金额"
            required>
          </van-field>
          <van-field
            @click="selectShow(1,index)"
            v-model="moneyNum[index]"
            label="支付方式"
            type="text"
            readonly
            placeholder="请选择支付方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount" class="addInput">
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
          v-model="form.retainage_date"
          label="尾款补齐日期"
          readonly
          type="text"
          @click="timeChoose()"
          placeholder="请选择尾款补齐日期"
          required>
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">领导同意截图</div>
        <UpLoad :ID="'leader'" @getImg="screenshot" :isClear="isClear" :editImage="leaders"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>凭证截图</div>
        <UpLoad :ID="'screenshot'" @getImg="screenshot" :isClear="isClear" :editImage="screenshots"></UpLoad>
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
          placeholder="部门已禁用">>
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

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeValue: '',            //日期value

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择

        periods: [],

        payStatus: false,
        priceStatus: false,

        amountMoney: 1,
        moneyNum: [''],               //分金额 付款方式
        payIndex: '',                 //分金额方式index
        other_fee_status: false,
        form: {
          address: '',
          id: '',
          draft: 0,
          month: '',
          terms: '',
          contract_id: '',            //房屋地址id
          house_id: '',               //房屋地址id
          payWay: [''],               //付款方式
          price_arr: [''],            //月单价
          is_other_fee: 0,
          other_fee: '',
          other_fee_name: '',

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式
          retainage_date: '',
          screenshot_leader: [],        //领导截图 数组
          screenshot: [],               //领导截图 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        leaders: {},
        screenshots: {},                //房屋名称

        dictValue8: [],                 //支付方式
        value8: [],
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
      dicts(val) {
        //支付方式
        this.dictionary(508, 1).then((res) => {
          this.value8 = [];
          this.dictValue8 = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.value8.push(res.data[i].dictionary_name);
          }
          this.finalDetail(val);
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
      screenshot(val) {
        this.picStatus = !val[2];
        if (val[0] === 'leader') {
          this.form.screenshot_leader = val[1];
        } else {
          this.form.screenshot = val[1];
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
        this.timeShow = true;
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
        switch (val) {
          case 1:
            this.payIndex = index;

            this.columns = this.value8;
            break;
          case 2:
            this.columns = this.periods;
            break;
        }
        this.selectHide = true;
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.moneyNum[this.payIndex] = value;
            for (let i = 0; i < this.dictValue8.length; i++) {
              if (this.dictValue8[i].dictionary_name === value) {
                this.form.money_way[this.payIndex] = this.dictValue8[i].id;
              }
            }
            break;
          case 2:
            this.form.terms = value;
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
      priceAmount() {
        this.amountMoney++;
        this.form.money_sep.push('');
        this.form.money_way.push('');
        this.moneyNum.push('');

      },
      // 删除 定金
      deleteAmount(val) {
        this.amountMoney--;
        this.form.money_sep.splice(val, 1);
        this.form.money_way.splice(val, 1);
        this.moneyNum.splice(val, 1);
      },

      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.form.is_other_fee = this.other_fee_status ? 1 : 0;
            this.$http.post(this.urls + 'bulletin/retainage', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50910') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50920') {
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
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.helperBulletin(val.id);
        }
      },

      helperBulletin(id) {
        this.$http.get(this.urls + 'bulletin/helper/contract/' + id + '?collect_or_rent=1').then((res) => {
          if (res.data.code === '51110') {
            let pay = res.data.data;
            this.form.month = pay.month;
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
        let type;
        if (val !== '') {
          type = 'bulletin/retainage/' + val;
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
            this.form.contract_id = draft.contract_id;
            this.helperBulletin(draft.contract_id);
            this.form.house_id = draft.house_id;
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

            this.other_fee_status = draft.is_other_fee === 1 ? true : false;
            this.form.other_fee_name = draft.other_fee_name;
            this.form.other_fee = draft.other_fee;

            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.leaders = data.leaders;
            this.form.remark = draft.remark;
            this.form.staff_name = draft.staff_name;
            this.form.department_name = draft.department_name;
            this.form.staff_id = draft.staff_id;
            this.form.department_id = draft.department_id;
          } else {
            this.form.id = ''
          }
        })
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.id = '';
        this.form.address = '';
        this.form.month = '';
        this.form.price_arr = [''];
        this.form.payWay = [''];
        this.form.terms = '';
        this.periods = [];
        this.form.contract_id = '';
        this.form.house_id = '';
        this.form.money_sum = '';
        this.amountMoney = 1;
        this.moneyNum = [''];
        this.form.money_sep = [''];
        this.form.money_way = [''];
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.leaders = {};
        this.form.other_fee_name = '';
        this.form.other_fee = '';
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
  }
</style>
