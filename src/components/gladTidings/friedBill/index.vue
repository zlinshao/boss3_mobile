<template>
  <div id="friedBill">
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div class="titles">收租标记</div>
          <van-radio-group :disabled="counts === '2' || counts === '21'" v-model="form.collect_or_rent"
                           @change="rentChange">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <div class="checks">
          <div class="titles">报备性质</div>
          <van-radio-group v-model="form.type">
            <van-radio name="0">炸单报备</van-radio>
            <van-radio name="1">取消报备</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <div class="crop_name noBorder">
          <van-field
            v-model="form.address"
            label="房屋地址"
            type="text"
            @click="searchSelect(form.collect_or_rent)"
            readonly
            placeholder="选择房屋地址"
            required>
          </van-field>
          <div class="titleRed" v-if="form.corp_name">{{form.corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
        <van-field
          v-model="form.customers"
          class="disabling"
          @click="payWayClick(1)"
          :label="name+'姓名'"
          type="text"
          readonly
          icon="arrow"
          placeholder="已禁用">
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
          placeholder="已禁用">
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
          placeholder="已禁用">
        </van-field>
        <van-field
          class="disabling"
          :class="{'payWay': priceStatus && form.price_arr.length > 1}"
          v-model="form.finance_money"
          @click="payWayClick(2)"
          :label="paid_token+'金额'"
          type="text"
          readonly
          icon="arrow"
          placeholder="已禁用">
        </van-field>
        <van-field
          v-model="form.return_money"
          :label="return_refund+'金额'"
          type="text"
          placeholder="请填写">
        </van-field>
        <!-- <div class="accordion" v-if="priceStatus && form.price_arr.length > 1">
          <div v-for="(key,index) in form.price_arr" v-show="index !== 0">{{key}}</div>
        </div>
        <van-switch-cell v-model="refundSta" title="定金是否退还"/> -->
      </van-cell-group>
      <div class="aloneModel">
        <Upload :file="uploads[0]" :getImg="screenshots" :close="!isClear" @success="headmanAgree"></Upload>
      </div>
      <van-cell-group>
        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写">
        </van-field>
        <van-field
          v-model="form.staff_name"
          label="开单人"
          type="text"
          placeholder="已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="form.department_name"
          label="部门"
          type="text"
          placeholder="已禁用"
          disabled>
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
    <float-btn ref="float"></float-btn>
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
        picStatus: 'success',
        name: '租客',                  //房东or租客
        paid_token: '已收',            //已收款or已付款
        return_refund: '',         //退还or退款
        money_paid: '',            //已付金额
        money_token: '',           //已收金额
        payStatus: false,
        priceStatus: false,

        refundSta: false,

        form: {
          address: '',
          id: '',
          processable_id: '',
          type: '0',
          draft: 0,
          payWay: [''],                   //付款方式
          price_arr: [''],                //月单价
          finance_money: '',               //已付已收金额
          collect_or_rent: '1',
          contract_id: '',              //合同id
          house_id: '',                 //房屋地址id
          refund: 0,                    //定金退还
          screenshot_leader: [],        //领导同意截图
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',                 //开单人name
          department_name: '',            //部门name
          customers: '',                   //客户姓名
          return_money: '',                //退还金额
          uniq_code: ''

        },
        screenshots: {},                //截图
        numbers: '',
        counts: '',

        retry: 0,
        uploads: [
          {
            label: '领导同意截图',
            placeholder: '必填',
            keyName: 'screenshot_leader',
          },
        ],
      }
    },
    mounted() {
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.friedDetail('');
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
        this.friedDetail('');
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
        this.friedDetail(newID);
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
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord', end_type: 'none'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'report', end_type: 'none'}});
        } else {
          Toast('请选择收租标记');
        }
      },

      // 截图
      headmanAgree(val) {
        this.picStatus = val[2];
        this.form.screenshot_leader = val[1];
      },
      rentChange(val) {
        if (this.numbers !== val) {
          this.form.address = '';
          this.form.corp_name = '';
          this.form.customers = '';
          this.form.house_id = '';
          this.form.contract_id = '';
          this.form.payWay = [''];
          this.form.price_arr = [''];
          this.form.return_money = "";
          this.form.finance_money = '';
          this.numbers = val;
        }
        if (this.numbers == '0') {
          this.name = "房东";
          this.paid_token = '已付';
          this.return_refund = '退还'
        } else if (this.numbers == '1') {
          this.name = "租客";
          this.paid_token = '已收';
          this.return_refund = '退款'
        }
      },
      saveCollect(val) {
        if (!this.picStatus) {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          this.prompt('', 'send');
          this.haveInHand = false;
          this.form.refund = this.refundSta ? 1 : 0;
          this.form.draft = val;
          this.form.uniq_code = this.$refs.float.getCode();
          this.$http.post(this.urls + 'bulletin/lose', this.form).then((res) => {
            this.prompt('', 'close');
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '50710' || res.data.code === '50730') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              if (res.data.data.id) {
                this.routerDetail(res.data.data.id)
              } else {
                this.routerDetail(res.data.data.data.id)
              }
            } else if (res.data.code === '50720') {
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
        let detail = this.$store.state.app.searchDetail;
        if (Object.keys(detail).length > 0) {
          let val = JSON.parse(detail.house);
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.helperBulletin(val.id);
          this.form.customers = val.customers
        }
      },
      helperBulletin(id) {
        this.$http.get(this.urls + 'bulletin/helper/contract/' + id + '?collect_or_rent=' + this.form.collect_or_rent).then((res) => {
          if (res.data.code === '51110') {
            let pay = res.data.data;
            this.form.payWay = [];
            this.form.price_arr = [];
            this.form.finance_money = pay.finance_money;
            for (let i = 0; i < pay.pay_way.length; i++) {
              this.form.payWay.push(pay.pay_way[i].begin_date + '~' + pay.pay_way[i].end_date + ':' + pay.pay_way[i].pay_way_str);
            }
            for (let i = 0; i < pay.price.length; i++) {
              this.form.price_arr.push(pay.price[i].begin_date + '~' + pay.price[i].end_date + ':' + pay.price[i].price_str);
            }
          }
        })
      },
      friedDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/lose/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          }
        } else {
          type = 'bulletin/lose';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50720') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.address = draft.address;
            this.form.corp_name = draft.corp_name;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;
            this.form.refund = draft.refund;
            this.form.type = draft.type;
            this.form.contract_id = draft.contract_id;
            this.helperBulletin(draft.contract_id);
            this.form.payWay = draft.payWay;
            this.form.price_arr = draft.price_arr;
            this.form.house_id = draft.house_id;
            this.refundSta = draft.refund === 0 ? false : true;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;
            this.form.remark = draft.remark;
            this.form.staff_id = draft.staff_id;
            this.form.department_id = draft.department_id;
            this.form.staff_name = draft.staff_name;
            this.form.department_name = draft.department_name;
            this.form.customers = draft.customers;
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
        $('.imgItem').remove();
        this.picStatus = 'success';
        this.form.payWay = [''];
        this.form.price_arr = [''];
        this.form.processable_id = '';
        this.form.collect_or_rent = '';
        this.form.refund = 0;
        this.form.type = '0';
        this.refundSta = false;
        this.form.screenshot_leader = [];
        this.screenshots = {};
        this.form.remark = '';
        this.form.address = '';
        this.form.corp_name = '';
        this.form.customers = '';
        this.form.staff_name = '';
        this.form.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
      },
    },
  }
</script>

<style lang="scss">
  #friedBill {
    overflow: hidden;
  }
</style>
