<template>
  <div style="padding-bottom: 100px">
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="中介费报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <van-cell-group>
      <van-field label="中介费" required placeholder="请输入中介费"></van-field>
      <van-field label="收房状态" v-model="rentType" required placeholder="请选择收房状态" readonly @focus="show = true"></van-field>
      <van-field label="地址" required placeholder="请选择地址"></van-field>
      <van-field label="付款方式" placeholder="请选择付款方式" readonly @focus="show = true"></van-field>
      <van-field label="月单价" placeholder="情书如月单价" ></van-field>
      <van-field label="银行" required placeholder="请输入选择银行" readonly @focus="show = true"></van-field>
      <van-field label="开户名" required v-model="params.account" placeholder="请选择开户名"></van-field>
      <van-field label="支行" required v-model="params.subbranch" placeholder="请输入支行"></van-field>
      <van-field label="卡号" required v-model="params.account_name" placeholder="请输入卡号"></van-field>
      <van-field label="中介名称" required v-model="params.name" placeholder="请输入中介名称"></van-field>
    </van-cell-group>

    <div v-if="rentType === '租房'">
      <van-cell-group>
        <div class="dingJin">
          <div style="color: #333">定金是否退还</div>
          <van-switch v-model="params.settle" ></van-switch>
        </div>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">组长同意截图</div>
        <UpLoad :ID="'jieTu'" @getImg="getImgData"></UpLoad>
      </div>
    </div>

    <div class="aloneModel">
      <div class="title">特殊情况要有领导报备截图</div>
      <UpLoad :ID="'lingDao'" @getImg="getImgData"></UpLoad>
    </div>

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

    <van-popup v-model="show" position="bottom" :overlay-style="{'background':'rgba(0,0,0,.2)'}">
      <van-picker :columns="contract_id" @change="onChange"></van-picker>
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
    components:{UpLoad, [Toast.name]: Toast,},
    data() {
      return {
        show: false,
        rentType:'',
        columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        contract_id:['收房','租房'],
        message:'',
        radio:1,
        params:{
          collect_or_rent: "0",                 //"collect_or_rent"	收租标记 0收房1租房
          contract_id: "2",                      //"contract_id"	合同id
          amount: "123123",                     //"amount"	数量
          bank: "njbank",                       //"bank"	银行名称
          subbranch: "hsroad",                  //"subbranch"	支行名称
          account_name: "qsl",                  //"account_name"	帐户名称
          account: "123123123123123",           //"account"	帐号
          name: "qsl",                          //"name"	中介名称
          settle: false,                          //"settle"	是否结清 0否1是
          screenshot: [],                       //"screenshot"	结清截图 数组
          screenshot_leader: [],                //"screenshot_leader"	领导同意截图 数组
          remark: "123",                        //"remark"	备注
          staff_id: "11",                       //"staff_id"	开单人id
          leader_id: "1",                       //"leader_id"	负责人id
          department_id: "1"                    //"leader_id"	负责人id
        }
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
      getImgData(val){

      },
      //确认提交
      confirmSubmit(){
        this.$http.post(globalConfig.server + 'bulletin/agency',this.params).then((res) => {
          if(res.data.code === '50310'){
            this.$toast.success(res.data.msg);
          }else {
            this.$toast.fail(res.data.msg);
          }
        })
      }
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
      padding: 10px 15px;
      display: flex;
      display: -webkit-flex; /* Safari */
      align-items: center;
      justify-content: space-between;
    }
  }
  /*.van-cell {*/
    /*.van-radio__input {*/
      /*float: right;*/
      /*position: static;*/
    /*}*/

    /*.van-radio__label {*/
      /*margin: 0;*/
    /*}*/
  /*}*/
  .dingJin{
    padding: 10px 15px 10px 0;
    display: flex;
    display: -webkit-flex; /* Safari */
    align-items: center;
    justify-content:space-between;
  }
</style>
