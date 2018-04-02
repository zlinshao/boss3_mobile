<template>
  <div id="clearRetreat">

    <div class="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio-group v-model="form.collect_or_rent">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          @click="searchSelect(form.collect_or_rent)"
          readonly
          placeholder="选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="payWay"
          label="付款方式"
          type="textarea"
          disabled
          placeholder="付款方式已禁用">
        </van-field>
        <van-field
          v-model="price_arr"
          label="月单价"
          type="textarea"
          disabled
          placeholder="月单价已禁用">
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">房屋照片</div>
        <UpLoad :ID="'photo'" @getImg="headmanAgree" :isClear="isClear" :editImage="photos"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">退租交接单照片</div>
        <UpLoad :ID="'checkout'" @getImg="headmanAgree" :isClear="isClear" :editImage="checkouts"></UpLoad>

      </div>
      <van-cell-group>
        <van-field
          v-model="form.checkout_date"
          type="text"
          label="开始时间"
          @click="timeChoose()"
          placeholder="获取周期开始日期"
          readonly
          required>
        </van-field>
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

    <!--日期-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @change="monthDate"
        @cancel="onCancel"
        @confirm="onDate"/>
    </van-popup>

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

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        payWay: '',                   //付款方式
        price_arr: '',                //月单价

        form: {
          id: '',
          draft: 0,
          collect_or_rent: '',
          house_id: '',
          contract_id: '',              //合同id
          photo: [],                    //领导截图 数组
          checkout_photo: [],           //领导截图 数组
          checkout_date: '',            //退租时间
          remark: '',                   //备注
        },
        houseName: '',
        photos: {},
        checkouts: {},
        staff_name: '',                 //开单人name
        leader_name: '',                //负责人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.checkDetail();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      // 获取当前时间
      getNowFormatDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let strDate = date.getDate();
        this.currentDate = new Date(year, month, strDate);
      },
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord1'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'rent1'}});
        } else {
          Toast('请选择收租标记');
        }
      },
      // 日期选择
      timeChoose() {
        this.timeShow = true;
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate() {
        this.form.checkout_date = this.timeValue;
        this.onCancel();
      },

      // select关闭
      onCancel() {
        this.timeShow = false;
      },

      // 截图
      headmanAgree(val) {
        this.picStatus = !val[2];
        if (val[0] === 'photo') {
          this.form.photo = val[1];
        } else {
          this.form.checkout_photo = val[1];
        }
      },

      saveCollect(val) {
        this.form.draft = val;
        if (this.picStatus) {
          this.$http.post(this.urls + 'bulletin/checkout', this.form).then((res) => {
            if (res.data.code === '51210') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '51220') {
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
        }
      },

      checkDetail() {
        this.$http.get(this.urls + 'bulletin/checkout').then((res) => {
          if (res.data.code === '51210') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.houseName = data.address;
            this.form.photo = draft.photo;
            this.photos = data.photo;
            this.form.checkout_photo = draft.checkout_photo;
            this.checkouts = data.checkout_photo;
            this.form.checkout_date = draft.checkout_date;
            this.form.remark = draft.remark;
            this.staff_name = data.staff_name;
            this.leader_name = data.leader_name;
            this.department_name = data.department_name;
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
        this.form.house_id = '';
        this.payWay = '';
        this.price_arr = '';
        this.form.id = '';
        this.form.checkout_photo = [];
        this.checkouts = {};
        this.form.photo = [];
        this.photos = {};
        this.form.remark = '';
        this.form.checkout_date = '';
        this.houseName = '';
        this.staff_name = '';
        this.leader_name = '';
        this.department_name = '';
      },
    },
  }
</script>

<style lang="scss">
  #clearRetreat {
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
      @include flex;
      align-items: center;
      height: 44px;
      .van-radio-group{
        @include flex;
        .van-radio{
          margin-right: .3rem;
        }
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
