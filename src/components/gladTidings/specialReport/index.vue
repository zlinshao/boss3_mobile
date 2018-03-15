<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="特殊事项报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <div>
      <van-cell-group>
        <van-field label="房屋地址" placeholder="请输入房屋地址"></van-field>

        <van-field
          v-model="message"
          label="报备内容"
          type="textarea"
          placeholder="请输入报备内容"
          rows="1"
          autosize
        ></van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">截图</div>
        <UpLoad :ID="upID" @getImg="getImgData"></UpLoad>
      </div>

      <!-- -->
      <div class="aloneModel">
        <div class="title">组长同意截图</div>
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
        radio:1,
        upID:"PICID"
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
        console.log(val)
      }
    },
  }
</script>

<style lang="scss">

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
</style>
