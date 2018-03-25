<template>
  <div id="drawbackReport">

    <div v-show="!houseShow || !staffModule" class="main">
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
          @click="searchSelect(form.collect_or_rent)"
          readonly
          placeholder="选择房屋地址">
        </van-field>
        <van-field
          v-model="form.amount"
          type="number"
          label="中介费"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.amount = ''"
          required>
        </van-field>
        <van-field
          v-model="form.name"
          type="text"
          label="中介名称"
          placeholder="请填写中介名称"
          icon="clear"
          @click-icon="form.name = ''"
          required>
        </van-field>
        <van-field
          v-model="payWay"
          type="text"
          label="付款方式"
          placeholder="付款方式已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="monthPrice"
          type="text"
          label="月单价"
          placeholder="月单价已禁用"
          disabled>
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
      <van-cell-group>
        <div class="dingJin">
          <div>是否结清</div>
          <van-switch v-model="settleStatus"></van-switch>
        </div>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">结清截图</div>
        <UpLoad :ID="'settle'" @getImg="screenshot"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'screenshot'" @getImg="screenshot"></UpLoad>
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
          @click="searchStaff(2)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="leader_name"
          @click="searchStaff(3)"
          readonly
          label="负责人"
          type="text"
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          @click="searchStaff(4)"
          readonly
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <div v-show="!houseShow || !staffModule" class="footer">
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

    <CollectHouse :module="houseShow" @close="onCancel" :type="organizeType" @house="house_"></CollectHouse>

    <Organization :type="organizeType" :module="staffModule" @close="onCancel" @organization="staff_"></Organization>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import CollectHouse from '../collectHouse.vue'
  import Organization from '../organize.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast, CollectHouse, Organization},
    data() {
      return {
        urls: globalConfig.server,
        refundSta: false,
        houseShow: false,         //搜索
        staffModule: false,       //搜索
        organizeType: '',         //搜索

        settleStatus: false,      //是否结清

        payWay: '',               //付款方式
        monthPrice: '',           //月单价

        form: {
          draft: 0,
          collect_or_rent: '',
          contract_id: '',              //房屋地址id
          house_id: '',                 //房屋地址id
          amount: '',                   //数量
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          name: '',                     //中介名称
          settle: 0,                    //是否结清
          screenshot: [],               //结清截图
          screenshot_leader: [],        //特殊情况
          remark: '',                   //备注
          staff_id: '',                //开单人id
          leader_id: '3',                //负责人id
          department_id: '',           //部门id
        },
        houseName: '',                  //房屋name
        staff_name: '',                 //开单人name
        leader_name: '湮灭',                //负责人name
        department_name: '',            //部门name
      }
    },

    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },

      searchSelect(val) {
        if (val === '0') {
          this.organizeType = 'collect';
          this.houseShow = true;
        } else if (val === '1') {
          this.houseShow = true;
          this.organizeType = 'rent'
        } else {
          Toast('请选择收租标记');
        }
      },
      screenshot(val) {
        if (val[0] === 'settle') {
          this.form.screenshot = val[1];
        } else {
          this.form.screenshot_leader = val[1];
        }
      },
      searchStaff(val) {
        switch (val) {
          case 2:
            this.staffModule = true;
            this.organizeType = 'staff';
            break;
          // case 3:
          //   this.staffModule = true;
          //   this.organizeType = 'leader';
          //   break;
        }
      },
      // 开单人
      staff_(val) {
        this.form.staff_id = val.staff_id;
        this.staff_name = val.staff_name;
        this.form.department_id = val.depart_id;
        this.department_name = val.depart_name;
        this.onCancel();
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

      // 房屋地址
      house_(val, type, detail) {
        this.houseName = val.houseName;
        this.form.contract_id = val.contract_id;
        this.form.house_id = val.house_id;
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.houseShow = false;
      },
      saveCollect(val) {
        if (this.settleStatus) {
          this.form.settle = 1;
        } else {
          this.form.settle = 0;
        }
        this.form.draft = val;
        this.$http.post(this.urls + 'bulletin/agency', this.form).then((res) => {
          if (res.data.code === '51110') {
            Toast.success(res.data.msg);
            this.$router.push({path: '/publishDetail', query: {ids: res.data.data.data.id}});
          } else {
            Toast(res.data.msg);
          }
        })
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

    .dingJin {
      padding: 10px 15px 10px 0;
      display: flex;
      display: -webkit-flex; /* Safari */
      align-items: center;
      justify-content: space-between;
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
