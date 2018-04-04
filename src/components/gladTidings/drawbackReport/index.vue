<template>
  <div id="drawbackReport">

    <div class="main">
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect()"
          placeholder="请选择房屋地址"
          required>
        </van-field>

        <van-field
          :class="{'payWay': payStatus}"
          @click="payWayClick(1)"
          v-model="payWay"
          label="付款方式"
          type="text"
          readonly
          icon="arrow"
          placeholder="付款方式已禁用">
        </van-field>
        <div class="accordion" v-if="payStatus">
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
        </div>
        <van-field
          :class="{'payWay': priceStatus}"
          v-model="price_arr"
          @click="payWayClick(2)"
          label="月单价"
          type="text"
          readonly
          icon="arrow"
          placeholder="月单价已禁用">
        </van-field>
        <div class="accordion" v-if="priceStatus">
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
        </div>
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
        isClear: false,           //删除图片
        picStatus: true,

        payWay: '1',                   //付款方式
        price_arr: '1',                //月单价
        recMoney: '',

        payStatus: false,
        priceStatus: false,

        form: {
          id: '',
          draft: 0,
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
    },
    activated() {
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
      changeRadio() {

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
      searchSelect() {
        this.$router.push({path: '/collectHouse', query: {type: 'renter', bulletin: 'bulletin_refund'}});
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

      saveCollect(val) {
        this.form.draft = val;
        if (this.picStatus) {
          this.$http.post(this.urls + 'bulletin/refund', this.form).then((res) => {
            if (res.data.code === '50810') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '50820') {
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
          let val = JSON.parse(t.house);
          this.houseName = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.payWay = val.pay_way;
          this.price_arr = val.month_price;
          this.recMoney = val.mortgage_price;
          this.staff_name = val.staff_name;
          this.department_name = val.department_name;
        }
      },

      refundDetail() {
        this.$http.get(this.urls + 'bulletin/refund').then((res) => {
          if (res.data.code === '50810') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.houseName = data.address;
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
    overflow: hidden;
  }
</style>
