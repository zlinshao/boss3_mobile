<template>
  <div id="agencyReport">

    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio-group v-model="form.collect_or_rent" @change="rentChange">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          @click="searchSelect(form.collect_or_rent)"
          readonly
          placeholder="选择房屋地址"
          required>
        </van-field>
        <van-field
          style="font-size: .18rem"
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

        <!--<div class="first_date" v-if="agencyStatus">-->
          <!--<van-field-->
            <!--style="width: 110px;"-->
            <!--class="title"-->
            <!--label="中介费"-->
            <!--required>-->
          <!--</van-field>-->
          <!--<van-field-->
            <!--v-model="form.agency_before_price"-->
            <!--type="number"-->
            <!--disabled-->
            <!--placeholder="中介费已禁用">-->
          <!--</van-field>-->
          <!--<van-field-->
            <!--v-model="form.agency_price"-->
            <!--type="number"-->
            <!--class="twoBorder"-->
            <!--placeholder="请填写修改写金额"-->
            <!--icon="clear"-->
            <!--@click-icon="form.agency_price = ''">-->
          <!--</van-field>-->
        <!--</div>-->

        <van-field
          v-model="form.agency_price"
          type="number"
          label="中介费"
          placeholder="请填写金额"
          @click-icon="form.agency_price = ''"
          icon="clear"
          required>
        </van-field>
        <van-field
          v-model="form.agency_name"
          type="text"
          v-if="agencyStatus"
          disabled
          label="中介名称"
          placeholder="中介名称已禁用"
          required>
        </van-field>
        <van-field
          v-model="form.agency_name"
          type="text"
          v-if="!agencyStatus"
          label="中介名称"
          placeholder="请填写中介名称"
          @click-icon="form.agency_name = ''"
          required>
        </van-field>
        <van-field
          v-model="form.agency_username"
          type="text"
          :disabled="agencyStatus"
          label="中介人"
          placeholder="请填写中介人"
          @click-icon="form.agency_username = ''"
          required>
        </van-field>
        <van-field
          v-model="form.agency_phone"
          type="number"
          :disabled="agencyStatus"
          label="中介联系方式"
          placeholder="请填写中介联系方式"
          @click-icon="form.agency_phone = ''"
          required>
        </van-field>

        <van-field
          v-model="form.account"
          label="卡号"
          type="number"
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
        <van-switch-cell v-if="form.collect_or_rent === '1'" v-model="settleStatus" title="是否结清"/>
      </van-cell-group>

      <div class="aloneModel required" v-if="form.collect_or_rent === '1' && settleStatus">
        <div class="title"><span>*</span>结清截图</div>
        <UpLoad :ID="'settle'" @getImg="screen" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'screenshot'" @getImg="screen" :editImage="screenshots_leader"></UpLoad>
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

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
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
        urls: globalConfig.server,
        isClear: '',              //删除图片
        picStatus: true,
        haveInHand: true,

        settleStatus: true,      //是否结清

        payStatus: false,
        priceStatus: false,

        form: {
          address: '',
          id: '',
          draft: 0,
          payWay: [''],                 //付款方式
          price_arr: [''],              //月单价
          collect_or_rent: '',
          contract_id: '',              //房屋地址id
          house_id: '',                 //房屋地址id

          agency_price: '',             //修改中介费
          agency_username: '',          //中介人
          agency_name: '',              //中介名称
          agency_phone: '',             //中介电话

          purchase_way: 509,            //支付方式
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号

          settle: 1,                    //是否结清
          screenshot: [],               //结清截图
          screenshot_leader: [],        //特殊情况
          remark: '',                   //备注
          staff_id: '',
          department_id: '',
          staff_name: '',                 //开单人name
          department_name: '',            //部门name
        },
        screenshots: {},
        screenshots_leader: {},
        numbers: '',

        agencyStatus: false,
      }
    },
    mounted() {
      this.agencyDetail('');
    },
    activated() {
      let newID = this.$route.query;
      if (newID.newID !== undefined) {
        this.agencyDetail(newID.newID);
      }
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
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
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord1'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'renter1'}});
        } else {
          Toast('请选择收租标记');
        }
      },
      screen(val) {
        this.picStatus = !val[2];
        if (val[0] === 'settle') {
          this.form.screenshot = val[1];
        } else {
          this.form.screenshot_leader = val[1];
        }
      },

      rentChange(val) {
        if (this.numbers !== val) {
          this.form.address = '';
          this.form.house_id = '';
          this.form.contract_id = '';
          this.form.payWay = [''];
          this.form.price_arr = [''];
          if (val === '0') {
            this.form.screenshot = [];
            this.screenshots = {};
            this.settleStatus = false;
            this.form.collect_or_rent = val;
          } else {
            this.settleStatus = true;
          }
          this.numbers = val;
        }
      },
      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            if (this.settleStatus) {
              this.form.settle = 1;
            } else {
              this.form.settle = 0;
            }
            this.form.draft = val;
            this.$http.post(this.urls + 'bulletin/agency', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50310') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50320') {
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
          if (val.agency_info !== null && val.agency_info.agency_name !== undefined) {
            this.agencyStatus = true;
            this.form.agency_price = val.agency_info.agency_price;
            this.form.agency_username = val.agency_info.agency_user_name;
            this.form.agency_name = val.agency_info.agency_name;
            this.form.agency_phone = val.agency_info.agency_phone;
          } else {
            if (val.agency_info.price !== null) {
              this.form.agency_price = val.agency_info.price;
            } else {
              this.form.agency_price = 0;
            }

            this.agencyStatus = false;
          }
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
        this.$http.get(this.urls + 'bulletin/helper/contract/' + id + '?collect_or_rent=' + this.form.collect_or_rent).then((res) => {
          if (res.data.code === '51110') {
            let pay = res.data.data;
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
      agencyDetail(val) {
        let type;
        if (val !== '') {
          type = 'bulletin/agency/' + val;
        } else {
          type = 'bulletin/agency';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50320') {
            this.isClear = false;
            this.agencyStatus = true;
            let data = res.data.data;
            let draft = res.data.data.draft_content;
            this.form.purchase_way = 509;
            this.form.address = draft.address;
            this.form.id = data.id;
            this.form.contract_id = draft.contract_id;
            this.helperBulletin(draft.contract_id);
            this.form.house_id = draft.house_id;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;

            this.form.agency_price = draft.agency_price;
            this.form.agency_username = draft.agency_username;
            this.form.agency_name = draft.agency_name;
            this.form.agency_phone = draft.agency_phone;

            this.form.bank = draft.bank;
            this.form.subbranch = draft.subbranch;
            this.form.account_name = draft.account_name;
            this.form.account = draft.account;
            this.form.settle = draft.settle;
            this.form.payWay = draft.payWay;
            this.form.price_arr = draft.price_arr;
            this.settleStatus = draft.settle === 1 ? true : false;
            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots_leader = data.screenshot_leader;
            this.form.remark = draft.remark;
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
        this.picStatus = true;
        this.form.payWay = [''];
        this.form.price_arr = [''];
        this.form.address = '';
        this.form.id = '';
        this.form.contract_id = '';
        this.form.house_id = '';
        this.form.collect_or_rent = '';

        this.form.agency_price = '';
        this.form.agency_username = '';
        this.form.agency_name = '';
        this.form.agency_phone = '';

        this.form.bank = '';
        this.form.subbranch = '';
        this.form.account_name = '';
        this.form.account = '';
        this.form.settle = 0;
        this.settleStatus = true;
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.screenshots_leader = {};
        this.form.remark = '';
        this.form.staff_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
        this.department_name = '';
      }
    },
  }
</script>

<style lang="scss">
  #agencyReport {
    overflow: hidden;
  }
</style>
