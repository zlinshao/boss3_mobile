<template>
  <div id="collectReport">
    <div v-show="!searchShow">
      <van-cell-group>
        <van-field
          v-model="form.house_id"
          label="房屋地址"
          type="text"
          readonly
          placeholder="请选择房屋地址"
          required>
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

        <div class="aloneModel">
          <div class="title">组长同意截图</div>
          <UpLoad :ID="'collectPhoto'" @getImg="contractPhoto"></UpLoad>
        </div>

        <van-field
          v-model="form.remark"
          label="备注"
          type="text"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.remark = ''"
          required>
        </van-field>
        <van-field
          v-model="form.staff_id"
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="form.leader_id"
          label="负责人"
          type="text"
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="form.department_id"
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
      <div class="footer">
        <van-button size="small" type="primary" @click="saveCollect(1)">草稿</van-button>
        <van-button size="small" type="primary" @click="saveCollect(0)">发布</van-button>
      </div>
    </div>

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

  export default {
    name: "index",
    components: {UpLoad},
    data() {
      return {
        urls: globalConfig.server,
        searchShow: false,        //搜索
        searchValue: '',          //搜索

        form: {
          house_id: '',                 //房屋地址id
          amount: '',                   //退款金额
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '',                //负责人id
          department_id: '',            //部门id
        },
        staff_name: '',                 //开单人name
        leader_name: '',                //负责人name
        department_name: '',            //部门name
        lists: [],
      }
    },
    watch: {},
    methods: {
      // 搜索
      onSearch() {
        this.$http.get(this.urls + 'credit/manage/other?search=' + this.searchValue).then((res) => {
          this.lists = res.data.data;
        })
      },
      // 合同照片
      contractPhoto(val) {
        this.form.photo = val[1];
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
        this.searchShow = false;
      },

      saveCollect() {
        this.$http.post(this.urls + 'bulletin/collect', this.form).then((res) => {

        })
      },
    },
  }
</script>

<style lang="scss">
  #collectReport {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    .searchClass {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      z-index: 99999;
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

    .footer {
      margin-top: 20px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-around;
      padding: 10px;
      background: #ffffff;
      button {
        background: $color;
        border: 0;
      }
      span {
        color: #FFFFFF;
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
