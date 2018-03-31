<template>
  <div id="friedBill">
    <div class="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio name="0" v-model="form.collect_or_rent">收房</van-radio>
          <van-radio name="1" v-model="form.collect_or_rent" style="margin-left: 18px">租房</van-radio>
        </div>
      </van-cell-group>
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">报备性质</div>
          <van-radio name="0" v-model="form.type">炸单报备</van-radio>
          <van-radio name="1" v-model="form.type" style="margin-left: 18px">取消报备</van-radio>
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
          v-model="bulletinDate"
          label="喜报日期"
          type="text"
          disabled
          placeholder="喜报日期已禁用">
        </van-field>
        <van-field
          v-model="payWay"
          label="付款方式"
          type="text"
          disabled
          placeholder="付款方式已禁用">
        </van-field>
        <van-field
          v-model="price_arr"
          label="月单价"
          type="text"
          disabled
          placeholder="月单价已禁用">
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <div class="dingJin">
          <div>定金是否退还</div>
          <van-switch v-model="refundSta"></van-switch>
        </div>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'headman'" @getImg="headmanAgree" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>
      <van-cell-group>
        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写备注">
        </van-field>
        <van-field
          v-model="staff_name"
          label="开单人"
          type="text"
          placeholder="开单人已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="leader_name"
          label="负责人"
          type="text"
          placeholder="负责人已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          placeholder="部门已禁用"
          disabled>
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

        bulletinDate: '',             //喜报日期
        payWay: '',                   //付款方式
        price_arr: '',                //月单价
        refundSta: false,
        form: {
          id: '',
          type: '0',
          draft: 0,
          collect_or_rent: '',
          contract_id: '',              //合同id
          house_id: '',                 //房屋地址id
          refund: '0',                  //定金退还
          screenshot_leader: [],        //领导同意截图
          remark: '',                   //备注
        },
        houseName: '',
        screenshots: {},                //截图
        staff_name: '',                 //开单人name
        leader_name: '',                //负责人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.friedDetail();
    },
    activated() {
      this.houseInfo();
    },
    methods: {
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord4'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'rent4'}});
        } else {
          Toast('请选择收租标记');
        }
      },

      // 截图
      headmanAgree(val) {
        this.form.screenshot_leader = val[1];
      },

      saveCollect(val) {
        if (this.refundSta) {
          this.form.refund = '1';
        } else {
          this.form.refund = '0';
        }
        this.form.draft = val;
        this.$http.post(this.urls + 'bulletin/lose', this.form).then((res) => {
          if (res.data.code === '50710') {
            Toast.success(res.data.msg);
            this.close_();
            this.routerDetail(res.data.data.data.id);
          } else if (res.data.code === '50720') {
            Toast.success(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        })
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = t.house;
          this.houseName = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
        }
      },

      friedDetail() {
        this.$http.get(this.urls + 'bulletin/lose').then((res) => {
          if (res.data.code === '50710') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.houseName = data.address;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.form.refund = draft.refund;
            this.form.type = draft.type;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.refundSta = draft.refund == '0' ? false : true;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;
            this.form.remark = draft.remark;
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
        this.bulletinDate = '';
        this.payWay = '';
        this.price_arr = '';
        this.form.id = '';
        this.form.collect_or_rent = '';
        this.form.refund = '0';
        this.form.type = '0';
        this.refundSta = false;
        this.form.screenshot_leader = [];
        this.screenshots = {};
        this.form.remark = '';
        this.houseName = '';
        this.staff_name = '';
        this.leader_name = '';
        this.department_name = '';
      },
    },
  }
</script>

<style lang="scss">
  #friedBill {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    $color: #409EFF;
    .aloneModel {
      background: #fff;
      width: 100%;
      margin: 5px 0;
      padding-bottom: 10px;
      .title {
        padding: 10px 15px;
      }
    }

    .checks {
      display: -webkit-flex;
      align-items: center;
      height: 44px;
    }

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
          display: flex;
          display: -webkit-flex;
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
