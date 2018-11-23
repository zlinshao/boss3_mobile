<template>
  <div id="drawbackReport">

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
          v-model="form.money_sum"
          type="text"
          label="已收金额"
          placeholder="已收金额已禁用"
          disabled>
        </van-field>

        <van-field
          v-model="form.amount"
          type="text"
          class="number"
          label="退款金额"
          placeholder="请填写退款金额"
          icon="clear"
          @click-icon="form.amount = ''"
          required>
        </van-field>

        <van-field
          v-model="form.account"
          label="卡号"
          type="text"
          class="number"
          @blur="accountBank(form.account)"
          placeholder="请填写卡号"
          icon="clear"
          @click-icon="form.account = ''"
          required>
        </van-field>
        <van-field
          v-model="form.bank"
          label="银行"
          type="text"
          placeholder="请填写银行名称"
          icon="clear"
          @click-icon="form.bank = ''"
          required>
        </van-field>
        <van-field
          v-model="form.subbranch"
          label="支行"
          type="text"
          placeholder="请填写支行"
          icon="clear"
          @click-icon="form.subbranch = ''">
        </van-field>
        <van-field
          v-model="form.account_name"
          label="开户名"
          type="text"
          placeholder="请填写开户名"
          icon="clear"
          @click-icon="form.account_name = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="aloneModel required">
        <div class="title"><span>*</span>领导同意截图</div>
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
          disabled
          label="开单人"
          type="text"
          placeholder="开单人已禁用">
        </van-field>
        <van-field
          v-model="form.department_name"
          disabled
          label="部门"
          type="text"
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
        isClear: false,               //删除图片
        picStatus: 'success',

        payStatus: false,
        priceStatus: false,

        form: {
          address: '',
          id: '',
          processable_id: '',
          draft: 0,
          payWay: [''],                 //付款方式
          price_arr: [''],              //月单价
          money_sum: '',
          contract_id: '',              //房屋地址id
          house_id: '',                 //房屋地址id
          amount: '',                   //退款金额
          bank: '',                     //银行名称
          purchase_way: 509,            //支付方式
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          screenshot_leader: [],        //领导同意截图
          remark: '',                   //备注
          staff_id: '',                 //开单人name
          department_id: '',            //部门name
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        screenshots: {},                //截图
        counts: '',

        retry: 0,
      }
    },
    mounted() {
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.refundDetail('');
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
        this.refundDetail('');
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
        this.refundDetail(newID);
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      this.houseInfo();
    },

    methods: {
      payWayClick(val) {
        if (val === 1) {
          this.payStatus = !this.payStatus;
          this.priceStatus = false;
        } else {
          this.priceStatus = !this.priceStatus;
          this.payStatus = false;
        }
      },
      accountBank(val) {
        this.$http.get(this.urls + 'bulletin/helper/bankname?card=' + val).then((res) => {
          if (res.data.code === '51110') {
            this.form.bank = res.data.data;
          }
        })
      },
      screenshot(val) {
        this.picStatus = val[2];
        this.form.screenshot_leader = val[1];
      },

      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
      },
      searchSelect() {
        this.$router.push({path: '/collectHouse', query: {type: 'report', end_type: 'none'}});
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
          this.form.draft = val;
          this.$http.post(this.urls + 'bulletin/refund', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '50810' || res.data.code === '50830') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              if (res.data.data.id) { this.routerDetail(res.data.data.id) } else { this.routerDetail(res.data.data.data.id) }
            } else if (res.data.code === '50820') {
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
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.contractID(val.id);
        }
      },
      contractID(id) {
        this.$http.get(this.urls + 'bulletin/helper/contract/' + id + '?collect_or_rent=1').then((res) => {
          if (res.data.code === '51110') {
            let pay = res.data.data;
            this.form.money_sum = pay.money_sum;
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

      refundDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/refund/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          }
        } else {
          type = 'bulletin/refund';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50820') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;
            this.form.purchase_way = 509;
            this.form.id = data.id;
            this.form.address = draft.address;
            this.form.contract_id = draft.contract_id;
            this.contractID(draft.contract_id);
            this.form.house_id = draft.house_id;
            this.form.money_sum = draft.money_sum;
            this.form.amount = draft.amount;
            this.form.account = draft.account;
            this.form.bank = draft.bank;
            this.form.subbranch = draft.subbranch;
            this.form.remark = draft.remark;
            this.form.account_name = draft.account_name;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;
            this.form.staff_name = draft.staff_name;
            this.form.department_name = draft.department_name;
            this.form.staff_id = draft.staff_id;
            this.form.department_id = draft.department_id;
          } else {
            this.form.id = '';
          }
        })
      },

      close_() {
        this.form.purchase_way = 509;
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        $('.imgItem').remove();
        this.picStatus = 'success';
        this.form.processable_id = '';
        this.form.payWay = [''];
        this.form.price_arr = [''];
        this.form.money_sum = '';
        this.form.amount = '';
        this.form.account = '';
        this.form.bank = '';
        this.form.subbranch = '';
        this.form.remark = '';
        this.form.account_name = '';
        this.form.screenshot_leader = [];
        this.screenshots = {};
        this.form.address = '';
        this.form.staff_name = '';
        this.form.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
      },
    },
  }
</script>

<style lang="scss">
  #drawbackReport {
    overflow: hidden;
  }
</style>
