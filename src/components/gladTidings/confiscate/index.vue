<template>
  <div id="confiscate">
    <div class="top">
      <van-nav-bar
        title="充公报备"
        left-text="返回"
        left-arrow
        @click-left="routerLink('/gladTidings')">
      </van-nav-bar>
    </div>

    <div class="main" v-if="!searchShow">
      <van-cell-group>
        <div class="checks" style="">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio name="0" v-model="form.collect_or_rent">收房</van-radio>
          <van-radio name="1" v-model="form.collect_or_rent" style="margin-left: 18px">租房</van-radio>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.houseName"
          label="房屋地址"
          type="text"
          @click="searchShow = true"
          readonly
          placeholder="选择房屋地址"
          required>
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
        <van-field
          v-model="form.remark"
          label="备注"
          type="text"
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

    <div v-if="!searchShow" class="footer" @click="saveCollect()">发布</div>

    <div :class="{'searchClass':searchShow}" v-if="searchShow">
      <van-search
        v-model="searchValue"
        show-action
        @search="onSearch">
        <div slot="action" @click="onCancel" style="padding: 0 10px;color: #06bf04;">取消</div>
      </van-search>
      <div class="searchContent">
        <div class="searchList" v-for="key in 30">
          <div>{{key}}</div>
          <div>{{key}}回复</div>
        </div>
      </div>
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
        searchShow: false,        //搜索
        searchValue: '',          //搜索

        bulletinDate: '',             //喜报日期
        payWay: '',                   //付款方式
        price_arr: '',                //月单价

        form: {
          type: 0,
          collect_or_rent: '',
          contract_id: '33',            //合同id
          remark: '',                   //备注
          staff_id: '1',                //开单人id
          leader_id: '2',               //负责人id
          department_id: '3',           //部门id
        },
        houseName: '',
        staff_name: '',                 //开单人name
        leader_name: '',                //负责人name
        department_name: '',            //部门name
      }
    },

    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },
      // 搜索
      onSearch() {
        this.$http.get(this.urls + 'credit/manage/other?search=' + this.searchValue).then((res) => {
          this.lists = res.data.data;
        })
      },

      // select关闭
      onCancel() {
        this.searchShow = false;
      },

      saveCollect() {
        this.$http.post(this.urls + 'bulletin/confiscate', this.form).then((res) => {
          if (res.data.code === '50610') {
            Toast.success(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        })
      }
    },
  }
</script>

<style lang="scss">
  #confiscate {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    $color: #409EFF;
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
      margin: 1.2rem 0;
    }
    .top {
      top: 0;
      box-shadow: 0 3px 10px 0 #dddddd;
      .van-hairline--top-bottom::after {
        border-bottom: 0;
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      background: #ffffff;
      z-index: 666;
      color: $color;
      border-top: 1px solid #ebebeb;
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
