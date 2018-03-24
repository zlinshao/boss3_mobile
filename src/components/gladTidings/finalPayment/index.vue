<template>
  <div id="rentReport" v-wechat-title="$route.meta.title">

    <div v-show="!houseShow || !staffModule" class="main">
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="month"
          type="text"
          label="租房月数"
          placeholder="租房月数已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="price_arr"
          label="月单价"
          readonly
          type="text"
          placeholder="月单价已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="payWay"
          label="付款方式"
          type="text"
          placeholder="付款方式已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="periods"
          label="房租期数"
          type="text"
          placeholder="房租期数已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="form.money_sum"
          label="总金额"
          type="text"
          placeholder="请填写总金额"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>已收金额付款方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.money_sep[index]"
            type="text"
            label="金额"
            placeholder="请填写金额"
            required>
          </van-field>
          <van-field
            @click="selectShow(index)"
            v-model="moneyNum[index]"
            label="付款方式"
            type="text"
            readonly
            placeholder="请选择付款方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount" class="addInput">
        +增加付款方式
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>截图</div>
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
          label="开单人"
          type="text"
          disabled
          placeholder="开单人已禁用">
        </van-field>
        <van-field
          v-model="leader_name"
          label="负责人"
          type="text"
          readonly
          placeholder="负责人已禁用">>
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          readonly
          placeholder="部门已禁用">>
        </van-field>
      </van-cell-group>
    </div>

    <div v-show="!houseShow || !staffModule" class="footer">
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

    <CollectHouse :module="houseShow" @close="onCancel" :type="organizeType" @house="house_"></CollectHouse>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import CollectHouse from '../collectHouse.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast,CollectHouse},
    data() {
      return {
        urls: globalConfig.server,
        houseShow: false,         //搜索
        staffModule: false,       //搜索
        organizeType: '',         //搜索

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择

        month: '',
        price_arr: '',
        payWay: '',
        periods: '',


        amountMoney: 1,
        moneyNum: [''],               //分金额 付款方式
        payIndex: '',                 //分金额方式index

        form: {
          draft: 0,
          contract_id: '12',            //房屋地址id

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式

          screenshot: '',               //领导截图 数组
          remark: '',                   //备注
        },
        houseName: '',                  //房屋名称
        staff_name: '',                  //开单人name
        leader_name: '',                 //负责人name
        department_name: '',             //部门name
      }
    },

    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },

      // 截图
      screenshot(val) {
        this.form.screenshot = val[1];
      },
      // select 显示
      selectShow(index) {
        this.payIndex = index;
        this.selectHide = true;
        this.columns = ['月付', '双月付', '季付', '半年付', '年付'];

      },
      // select选择
      onConfirm(value, index) {
        this.moneyNum[this.payIndex] = value;
        this.form.money_way[this.payIndex] = index + 1;
        this.selectHide = false;
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            this.houseShow = true;
            break;
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

      // 房屋地址
      house_(val) {
        this.houseName = val.houseName;
        this.form.contract_id = val.contract_id;
        this.form.house_id = val.house_id;
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
        this.houseShow = false;
        this.staffModule = false;
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
        this.form.draft = val;
        this.$http.post(globalConfig.server + 'bulletin/retainage', this.form).then((res) => {
          if (res.data.code === '50910') {
            this.$toast.success(res.data.msg);
            this.$router.push({path: '/publishDetail',query:{ids: res.data.data.data.id}});
          } else {
            this.$toast(res.data.msg);
          }
        })
      }
    },
  }
</script>

<style lang="scss">
  #rentReport {
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
    .aloneModel {
      background: #fff;
      width: 100%;
      margin: .2rem 0;
      padding-bottom: .26rem;
      .title {
        padding: .26rem .3rem 0;
      }
    }
    .aloneModel.required {
      .title {
        padding-left: .2rem;
        span {
          color: #f44;
        }
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
