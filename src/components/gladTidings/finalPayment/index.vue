<template>
  <div style="padding-bottom: 100px">
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="尾款房租报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <div>
      <van-cell-group>
        <van-field label="房屋地址" placeholder="请输入房屋地址"></van-field>
        <van-field label="月单价" placeholder="请输入月单价"></van-field>
        <van-field label="租房月数" placeholder="请输入租房月数"></van-field>
        <van-field label="付款方式" placeholder="请选择付款方式" readonly @focus="show = true"></van-field>
        <van-field label="总收入定金" v-model="params.money_sum" placeholder="请输入总收入定金"></van-field>
      </van-cell-group>

      <div class="canBeMore" v-for="item in totalNumber">
        <div class="title">
          <div>定金详情({{item}})</div>
          <div style="color: #409EFF" v-if="totalNumber>1" @click="deleteNumber(item-1)">删除</div>
        </div>
        <van-cell-group>
          <van-field label="定金" placeholder="请输入定金" v-model="params.money_sep[item-1]"></van-field>
          <van-field label="定金方式" placeholder="请选择定金方式"  v-model="params.money_way[item-1]" readonly @focus="showType(item-1)"></van-field>
        </van-cell-group>
      </div>
      <div class="showMore" @click="addNumber">+添加定金详情{{totalNumber}}</div>
      <!-- -->
      <div class="aloneModel">
        <div class="title">截图</div>
        <UpLoad :ID="'jieTu'" @getImg="getImgData"></UpLoad>
      </div>
      <div>{{params.remark}}</div>
      <van-cell-group>
        <van-field
          v-model="params.remark"
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

    <div style="position: fixed;bottom: 0;width: 80%;margin-left: 10%;">
      <van-button size="large" type="primary" @click="confirmSubmit">提  交</van-button>
    </div>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import {Toast} from 'vant'
  export default {
    name: "index",
    components:{UpLoad,[Toast.name]: Toast,},
    data() {
      return {
        show: false,
        show1: false,
        columns: ['1', '2', '3', '4'],
        rentType: '',
        minDate: new Date(1970, 1, 1),
        maxDate: new Date(2519, 10, 1),
        currentDate: new Date(2018, 0, 1),
        date: '',
        message: '',
        totalNumber:1,

        params:{
          contract_id:'13',
          money_sum:'',
          money_sep:[],
          money_way:[],
          screenshot:[],
          remark:'33333333333',
        },
        activeIndex:''
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
        this.params.money_way[this.activeIndex] = value;
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
        this.params.remark = 'hjjjjjjjjjjj'

      },
      //删除报销明细
      deleteNumber(index){
        this.totalNumber--;
      },

      showType(val){
          this.show = true
          this.activeIndex = val;
      },
      getImgData(val){
        this.params.screenshot = val[1]
      },
      confirmSubmit(){
        alert(1);
        this.$http.post(globalConfig.server + 'bulletin/retainage',this.params).then((res) => {
          if(res.data.code === '50910'){
            alert(2);
            this.$toast.success(res.data.msg);
          }else {
            alert(3);
            this.$toast.fail(res.data.msg);
          }
        })
      }
    },
  }
</script>

<style scoped lang="scss">

  .aloneModel {
    background: #fff;
    width: 100%;
    margin: 5px 0 ;
    padding-bottom: 10px;
    .title {
      padding: 10px 15px;
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
