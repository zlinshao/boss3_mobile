<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="address"
        label="地址"
        type="text"
        placeholder="请选择地址"
        required>
      </van-field>
      <van-field
        @click="selectShow(1)"
        v-model="houseType"
        readonly
        type="text"
        label="户型"
        placeholder="请选择户型"
        required>
      </van-field>
      <van-field
        v-model="months"
        type="number"
        label="租房月数"
        placeholder="请填写收房月数"
        icon="clear"
        @click-icon="months = ''"
        required>
      </van-field>
    </van-cell-group>

    <div class="changes" v-for="(key,index) in amount">
      <div class="paddingTitle">
        <span>月单价</span>
        <span @click="deleteAmount">删除</span>
      </div>
      <van-cell-group>
        <van-field
          v-model="startDate[index]"
          type="text"
          label="开始时间"
          placeholder="请选择时间"
          readonly
          @click="monthShow = true"
          required>
        </van-field>
        <van-field
          v-model="period[index]"
          type="number"
          label="周期"
          placeholder="请填写周期"
          required>
        </van-field>
        <van-field
          v-model="unitPrice[index]"
          type="number"
          label="价格"
          placeholder="请填写金额"
          required>
        </van-field>
        <div @click="priceAmount" class="addInput">
          +增加月单价
        </div>
      </van-cell-group>
    </div>

    <van-cell-group>
      <div class="checks">
        <van-field
          @click="selectShow(2)"
          v-model="payType"
          label="付款方式"
          type="text"
          readonly
          placeholder="请选择付款方式"
          required>
        </van-field>
      </div>
    </van-cell-group>

    <van-cell-group>
      <van-field
        v-model="payType"
        label="总收入定金"
        type="text"
        placeholder="请填写金额"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="物业费"
        type="text"
        placeholder="请填写物业费"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="签约时间"
        type="text"
        placeholder="请选择签约时间"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="补齐时间"
        type="text"
        placeholder="请选择尾款补齐时间"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="客户姓名"
        type="text"
        placeholder="请填写客户姓名"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="客户手机"
        type="text"
        placeholder="请填写客户手机号"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="截图"
        type="text"
        placeholder="截图"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="合同照片"
        type="text"
        placeholder="合同照片"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="租房合同编号"
        type="text"
        placeholder="请填写租房合同编号"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="备注"
        type="text"
        placeholder="请填写备注"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="开单人"
        type="text"
        placeholder="请选择开单人"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="负责人"
        type="text"
        placeholder="请选择负责人"
        required>
      </van-field>
      <van-field
        v-model="payType"
        label="部门"
        type="text"
        placeholder="请选择部门"
        required>
      </van-field>
    </van-cell-group>


    <!--户型-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

    <!--日期-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="monthShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @change="monthDate"
        @cancel="onCancel"
        @confirm="onDate"/>
    </van-popup>

    <!--月单价-->

  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        selectHide: false,         //房型
        monthShow: false,         //日期

        address: '',              //地址
        houseType: '',            //户型
        houseTypeNum: '',         //户型ID
        months: '',               //月数

        amount: 1,
        startDate: [''],            //合同开始时间
        peakerValue: '',
        period: [''],               //周期
        unitPrice: [''],            //月单价

        payType: '',                //付款方式
        payTypeNum: '',             //付款方式ID
        checked: false,

        columns: [],
        tabs: '',
        minDate: new Date(),
        maxDate: new Date(2200, 12, 31),
        currentDate: new Date(2018, 0, 1),

      }
    },
    mounted() {
    },
    watch: {},
    methods: {
      selectShow(val) {
        this.tabs = val;
        this.selectHide = true;
        if (val === 1) {
          this.columns = ['杭州', '宁波', '温州', '嘉兴', '湖州'];
        } else if (val === 2) {
          this.columns = ['杭州', '宁波', '温州', '嘉兴', '湖州'];
        }
      },
      // 月单价增加
      priceAmount() {
        this.amount++;
        this.startDate.push('');
        this.period.push('');
        this.unitPrice.push('');
      },
      // 删除月单价
      deleteAmount() {
        if (this.amount > 1) {
          this.amount--;
        }
      },
      // 时间选择
      monthDate(peaker) {
        this.startDate = peaker.getValues().join('-');
      },
      onDate(value, index) {
        this.startDate.push(this.peakerValue);
        this.monthShow = false;
      },
      // select选择
      onConfirm(value, index) {
        if (this.tabs === 1) {
          this.houseType = value;
          this.houseTypeNum = index;
        }
        if (this.tabs === 2) {
          this.payType = value;
          this.payTypeNum = index;
        }
        this.selectHide = false;
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.monthShow = false;
      },
    },
  }
</script>

<style scoped lang="scss">
  @mixin flex {
    display: flex;
    display: -webkit-flex;
  }

  $color: #409EFF;
  .changes {
    margin-bottom: 15px;
    .paddingTitle {
      @include flex;
      justify-content: space-between;
      padding: 10px 15px;
      color: #aaaaaa;
      span:last-of-type {
        color: $color;
      }
    }
    .addInput {
      height: 44px;
      line-height: 24px;
      padding: 10px 0;
      text-align: center;
      color: $color;
    }
  }
</style>
