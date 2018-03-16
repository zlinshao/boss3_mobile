<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="炸单报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <div>
      <van-cell-group>
        <van-field label="报备性质" placeholder="请选择报备性质" v-model="rentType" readonly @focus="show = true"></van-field>
        <van-field label="房屋地址" placeholder="请输入房屋地址"></van-field>
        <van-field label="喜报日期" placeholder="请选择喜报日期" readonly v-model="date" @focus="show1 = true"></van-field>
        <van-field label="月单价" placeholder="请输入月单价"></van-field>
        <van-field label="付款方式" placeholder="请选择付款方式" readonly @focus="show = true"></van-field>
        <div class="dingJin">
          <div style="color: #333">定金是否退还</div>
          <van-switch v-model="checked" ></van-switch>
        </div>
      </van-cell-group>

      <!-- -->
      <div class="aloneModel">
        <div class="title">组长同意截图</div>
        <UpLoad :ID="'jieTu'" @getImg="getImgData"></UpLoad>
      </div>
      <van-cell-group>
        <van-field
          v-model="message"
          label="备注"
          type="textarea"
          placeholder="请输入备注"
          rows="1"
          autosize
        ></van-field>

        <van-field
          label="开单人"
          placeholder="请选择开单人"
        ></van-field>
        <van-field
          label="负责人"
          placeholder="请选择负责人"
        ></van-field>
        <van-field
          label="部门"
          placeholder="请选择部门"
        ></van-field>
      </van-cell-group>
    </div>


    <van-popup v-model="show" position="bottom" :overlay-style="{'background':'rgba(0,0,0,.2)'}">
      <van-picker :columns="columns" @change="onChange"></van-picker>
    </van-popup>

    <van-popup v-model="show1" position="bottom" :overlay-style="{'background':'rgba(0,0,0,.2)'}">
      <van-datetime-picker
        type="date"
        @cancel='show1 = false'
        @confirm='show1 = false'
        @change='getDate'
        :min-date="minDate"
        :max-date="maxDate"
      ></van-datetime-picker>
    </van-popup>

    <van-popup v-model="show1" position="bottom" :overlay-style="{'background':'rgba(0,0,0,.2)'}">
      <van-datetime-picker
        type="date"
        @cancel='show1 = false'
        @confirm='show1 = false'
        @change='getDate'
        :min-date="minDate"
        :max-date="maxDate"
      ></van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  export default {
    name: "index",
    components:{UpLoad},
    data() {
      return {
        show: false,
        show1: false,
        columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        rentType: '',
        minDate: new Date(1970, 1, 1),
        maxDate: new Date(2519, 10, 1),
        currentDate: new Date(2018, 0, 1),
        date: '',
        message: '',
        totalNumber:1,
        radio:'1',
        checked:true,
      }
    },
    mounted() {

    },
    watch: {},
    methods: {
      onClickLeft() {
        this.$router.push('/gladTidings')
      },
      onChange(picker, value, index) {
        this.rentType = value;
      },
      getDate(picker){
        this.date = picker.getValues().join('-');
      },

      onRead(file) {
        console.log(file)
      },
      //增加报销明细
      addNumber(){
        this.totalNumber++;
      },
      //删除报销明细
      deleteNumber(index){
        this.totalNumber--;
      },
      //照片
      getImgData(val){

      },
    },
  }
</script>

<style lang="scss">

  .aloneModel {
    background: #fff;
    width: 100%;
    margin: 5px 0;
    padding-bottom: 10px;
    .title {
      padding: 10px 15px;
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
  .dingJin{
    padding: 10px 15px 10px 0;
    display: flex;
    display: -webkit-flex; /* Safari */
    align-items: center;
    justify-content:space-between;
  }
</style>
