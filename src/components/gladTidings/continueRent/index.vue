<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="续租报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <div>
      <van-cell-group>
        <van-field label="租房类型" placeholder="请选择租房类型" v-model="rentType" readonly @focus="show = true"></van-field>
        <van-field label="房屋地址" placeholder="请输入房屋地址"></van-field>
        <van-field label="月单价" placeholder="请输入月单价"></van-field>
        <van-field label="租房月数" placeholder="请输入租房月数"></van-field>
        <van-field label="付款方式" placeholder="请选择付款方式" readonly @focus="show = true"></van-field>
        <van-field label="总收入定金" placeholder="请输入总收入定金"></van-field>
      </van-cell-group>

      <div class="canBeMore" v-for="item in totalNumber">
        <div class="title">
          <div>定金详情({{item}})</div>
          <div style="color: #409EFF" v-if="totalNumber>1" @click="deleteNumber(item-1)">删除</div>
        </div>
        <van-cell-group>
          <van-field label="定金" placeholder="请输入定金"></van-field>
          <van-field label="定金方式" placeholder="请选择定金方式" readonly @focus="show = true"></van-field>
        </van-cell-group>
      </div>
      <div class="showMore" @click="addNumber">+添加定金详情</div>

      <van-cell-group>
        <van-field label="物业费" placeholder="请输入物业费"></van-field>
        <van-field label="签约时间" placeholder="请选择签约时间" readonly v-model="date" @focus="show1 = true"></van-field>
        <van-field label="补齐尾款时间" placeholder="请选择补齐尾款时间" readonly v-model="date" @focus="show1 = true"></van-field>
        <van-field label="客户姓名" placeholder="请输入客户姓名"></van-field>
        <van-field label="客户手机号" placeholder="请输入客户手机号"></van-field>
        <van-field label="合同编号" placeholder="请输入合同编号"></van-field>
      </van-cell-group>
      <!-- -->
      <div class="aloneModel">
        <div class="title">截图</div>
        <div class="upPic">
          <div class="upButton">
            <span class="plus">+</span>
          </div>
        </div>
      </div>
      <div class="aloneModel">
        <div class="title">合同照片</div>
        <div class="upPic">
          <div class="upButton">
            <span class="plus">+</span>
          </div>
        </div>
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
  </div>
</template>

<script>
  export default {
    name: "index",
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
    },
  }
</script>

<style scoped lang="scss">

  .aloneModel {
    background: #fff;
    width: 100%;
    margin: 5px 0;
    .title {
      padding: 10px 15px;
    }
    .upPic {
      padding: 10px 15px;
      margin: 5px 0;
      .upButton {
        width: .9rem;
        height: .9rem;
        border-radius: .09rem;
        background: #eee;
        display: flex;
        display: -webkit-flex; /* Safari */
        align-items: center;
        justify-content: center;
        .plus {
          font-size: .5rem;
          color: #aaa;
        }
      }
    }
  }

  .canBeMore {
    margin: 5px 0 0 0;
    .title {
      padding: 10px 15px;
      display: flex;
      display: -webkit-flex; /* Safari */
      align-items: center;
      justify-content: space-between;
    }
  }

  .showMore {
    background: #fff;
    color: #409EFF;
    padding: 10px 0;
    text-align: center;
    margin-bottom: 5px;
    cursor: pointer;
    &:hover{
      background: #f4f4f4;
    }
  }
</style>
