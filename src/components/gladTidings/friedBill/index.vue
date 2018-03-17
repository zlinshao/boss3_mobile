<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="炸单报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft">
      </van-nav-bar>
    </div>

    <div v-if="!searchShow">
      <van-cell-group>
        <div class="checks" style="">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio name="0" v-model="form.trans_type">收房</van-radio>
          <van-radio name="1" v-model="form.trans_type" style="margin-left: 18px">租房</van-radio>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="bulletinDate"
          label="喜报日期"
          @click="timeChoose"
          type="text"
          readonly
          placeholder=""
          required>
        </van-field>
        <van-field
          v-model="payWay"
          label="付款方式"
          type="text"
          readonly
          placeholder=""
          required>
        </van-field>
        <van-field
          v-model="price_arr"
          label="月单价"
          type="text"
          readonly
          placeholder=""
          required>
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <div class="dingJin">
          <div>定金是否退还</div>
          <van-switch v-model="refundSta"></van-switch>
        </div>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">组长同意截图</div>
        <UpLoad :ID="'headman'" @getImg="headmanAgree"></UpLoad>
      </div>
      <van-cell-group>
        <van-field
          v-model="staff_name"
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="leader_name"
          label="负责人"
          type="text"
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <!--select 选择-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

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

  export default {
    name: "index",
    components: {UpLoad},
    data() {
      return {
        checked1: false,
        checked2: false,
        refundSta: false,
        selectHide: false,
        searchShow: false,        //搜索
        searchValue: '',          //搜索

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        lists: [],
        columns: [],

        bulletinDate: '',             //喜报日期
        payWay: '',                   //付款方式
        price_arr: '',                //月单价
        form: {
          contract_id: '',               //合同id
          refund: '',                   //定金退还
          screenshot_leader: '',        //领导截图 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '',                //负责人id
          department_id: '',            //部门id
        },
        staff_name: '',               //开单人name
        leader_name: '',              //负责人name
        department_name: '',          //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
    },
    watch: {},
    methods: {
      // 搜索
      onSearch() {
        this.$http.get(this.urls + 'credit/manage/other?search=' + this.searchValue).then((res) => {
          this.lists = res.data.data;
        })
      },
      // 获取当前时间
      getNowFormatDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let strDate = date.getDate();
        this.currentDate = new Date(year, month, strDate);
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
        this.timeShow = false;
        this.bulletinDate = this.timeValue;
      },
      // select关闭
      onCancel() {
        this.searchShow = false;
        this.selectHide = false;
      },

      onClickLeft() {
        this.$router.push('/gladTidings')
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.roomName = value;
            this.form.room = index;
            break;
        }
        this.selectHide = false;
      },

      // 截图
      headmanAgree(val) {
        this.form.screenshot_leader = val[1];
        console.log(val);
      },
    },
  }
</script>

<style lang="scss">
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

  .canBeMore {
    margin: 5px 0 0 0;
    .title {
      color: #333;
      padding: 10px 15px;
      display: flex;
      display: -webkit-flex; /* Safari */
      align-items: center;
      justify-content: space-between;
    }
  }

  .dingJin {
    padding: 10px 15px 10px 0;
    display: flex;
    display: -webkit-flex; /* Safari */
    align-items: center;
    justify-content: space-between;
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
</style>
