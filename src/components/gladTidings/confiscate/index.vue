<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="充公报备"
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
      </van-cell-group>

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



    <div style="position: fixed;bottom: 0;width: 80%;margin-left: 10%;">
      <van-button size="large" type="primary" @click="confirmSubmit">提  交</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        show: false,
        show1: false,
        columns: ['请选择','充公报备', '取消报备'],
        rentType: '请选择',
        minDate: new Date(1970, 1, 1),
        maxDate: new Date(2519, 10, 1),
        currentDate: new Date(2018, 0, 1),
        date: '',
        message: '',
        totalNumber:1,
        radio:1,
        params:{
          collect_or_rent:1,
          type:'',
          contract_id:'11',
          remark:''
        }
      }
    },

    methods: {
      onClickLeft() {
        this.$router.push('/gladTidings')
      },
      onChange(picker, value, index) {
        this.params.type = value =='充公报备'?'0':'1';
        this.rentType =value;
      },
      getDate(picker){
        this.date = picker.getValues().join('-');
      },

      onRead(file) {
        console.log(file)
      },
      confirmSubmit(){
        this.$http.post(globalConfig.server + 'bulletin/confiscate',this.params).then((res) => {
          if(res.data.code === '50610'){
            this.$toast.success(res.data.msg);
          }else {
            this.$toast.fail(res.data.msg);
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped="">

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
</style>
