<template>
  <div id="drawbackReport">

    <div class="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio name="0" v-model="form.collect_or_rent">收房</van-radio>
          <van-radio name="1" v-model="form.collect_or_rent" style="margin-left: 18px">租房</van-radio>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(form.collect_or_rent)"
          placeholder="请选择房屋地址"
          required>
        </van-field>

        <van-field
          v-model="payWay"
          type="textarea"
          label="付款方式"
          placeholder="付款方式已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="price_arr"
          type="textarea"
          label="月单价"
          placeholder="月单价已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="recMoney"
          type="text"
          label="已收金额"
          placeholder="已收金额已禁用"
          disabled>
        </van-field>

        <van-field
          v-model="form.amount"
          type="number"
          label="退款金额"
          placeholder="请填写退款金额"
          icon="clear"
          @click-icon="form.amount = ''"
          required>
        </van-field>

        <van-field
          v-model="form.account"
          label="卡号"
          type="number"
          @keyup="subAccount(form.account)"
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
          @click-icon="form.subbranch = ''"
          required>
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

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
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
          v-model="staff_name"
          disabled
          label="开单人"
          type="text"
          placeholder="开单人已禁用">
        </van-field>
        <van-field
          v-model="leader_name"
          disabled
          label="负责人"
          type="text"
          placeholder="负责人已禁用">
        </van-field>
        <van-field
          v-model="department_name"
          disabled
          label="部门"
          type="text"
          placeholder="部门已禁用">
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1,1)">草稿</div>
      <div class="" @click="saveCollect(0,1)">发布</div>
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
        isClear: false,           //删除图片
        picStatus: true,

        payWay: '',
        price_arr: '',
        recMoney: '',

        form: {
          id: '',
          draft: 0,
          collect_or_rent: '',
          contract_id: '',              //房屋地址id
          house_id: '',                 //房屋地址id
          amount: '',                   //退款金额
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          screenshot_leader: [],        //领导同意截图
          remark: '',                   //备注
        },
        screenshots: {},                //截图
        houseName: '',                  //房屋名称
        staff_name: '',                 //开单人name
        leader_name: '',                //负责人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.refundDetail();
      this.routerIndex();
    },
    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },

      screenshot(val) {
        this.picStatus = !val[2];
        this.form.screenshot_leader = val[1];
      },
      // 获取银行
      subAccount(val) {
        this.$http.get(this.urls + 'bulletin/helper/bankname?card=' + val).then((res) => {
          if (res.data.code === '51110') {
            this.form.bank = res.data.data;
          } else {
            this.form.bank = '';
          }
        })
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
      },
      searchSelect(val) {
        if (val === '0') {
          this.saveCollect(1, 2);
          this.$router.replace({path: '/collectHouse', query: {type: 'lord1'}});
        } else if (val === '1') {
          this.saveCollect(1, 2);
          this.$router.replace({path: '/collectHouse', query: {type: 'rent1'}});
        } else {
          Toast('请选择收租标记');
        }
      },

      // // 房屋地址
      // house_(val, type, form) {
      //   for (let i = 0; i < form.month_price.length; i++) {
      //     this.payWay = '第' + (i + 1) + '期' + form.pay_way[i].period + '个月' + form.pay_way[i].pay_way_str + ';';
      //     this.price_arr = '第' + (i + 1) + '期' + form.month_price[i].period + '个月' + form.month_price[i].price + '元/月' + ';';
      //   }
      //   this.houseName = val.houseName;
      //   this.form.contract_id = val.contract_id;
      //   this.form.house_id = val.house_id;
      //   this.onCancel();
      // },

      saveCollect(val, num) {
        this.form.draft = val;
        if (this.picStatus) {
          this.$http.post(this.urls + 'bulletin/refund', this.form).then((res) => {
            if (res.data.code === '50810') {
              Toast.success(res.data.msg);
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '50820') {
              num === 1 ? Toast.success(res.data.msg) : false;
            } else {
              Toast(res.data.msg);
            }
          })
        } else {
          Toast('图片上传中...');
        }
      },
      refundDetail() {
        this.$http.get(this.urls + 'bulletin/refund').then((res) => {
          if (res.data.code === '50810') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = draft.id;
            this.houseName = data.address;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.amount = draft.amount;
            this.form.account = draft.account;
            this.form.bank = draft.bank;
            this.form.subbranch = draft.subbranch;
            this.form.remark = draft.remark;
            this.form.account_name = draft.account_name;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;
          } else {
            this.form.id = '';
          }
          let t = this.$route.query;
          if (t.house !== undefined && t.house !== '') {
            let val = t.house;
            this.houseName = val.house_name;
            this.form.contract_id = val.id;
            this.form.house_id = val.house_id;
          }
        })
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.form.payWay = '';
        this.form.price_arr = '';
        this.form.recMoney = '';
        this.form.id = '';
        this.form.amount = '';
        this.form.account = '';
        this.form.bank = '';
        this.form.subbranch = '';
        this.form.remark = '';
        this.form.account_name = '';
        this.form.screenshot_leader = [];
        this.screenshots = {};
        this.houseName = '';
        this.staff_name = '';
        this.leader_name = '';
        this.department_name = '';
      },
    },
  }
</script>

<style lang="scss">
  #drawbackReport {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    .checks {
      display: -webkit-flex;
      align-items: center;
      height: 44px;
    }
    $color: #409EFF;
    .van-switch.van-switch--on {
      background: $color;
    }
    .van-icon.van-icon-checked {
      color: $color;
    }
    .van-cell.van-hairline.van-field {
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
