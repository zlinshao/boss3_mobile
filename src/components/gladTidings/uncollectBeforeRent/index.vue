<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="未收先祖报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <van-cell-group>
      <van-field
        v-model="username"
        label="原喜报地址"
        icon="clear"
        placeholder="请输入原喜报地址"
        required
        @click-icon="username = ''"
      ></van-field>
      <van-field
        label="现地址"
        placeholder="请输入现地址"
        required
      ></van-field>
      <van-field
        label="月单价"
        placeholder="请输入月单价"
      ></van-field>
      <van-field
        label="租房月数"
        placeholder="请输入租房月数"
      ></van-field>
      <van-field
        label="总收入定金"
        placeholder="请输入总收入定金"
      ></van-field>
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
      <van-field
        label="签约时间"
        v-model="date"
        readonly
        @focus="show = true"
        placeholder="请选择签约时间"
      ></van-field>

      <van-field
        label="补齐尾款时间"
        v-model="date"
        readonly
        @focus="show = true"
        placeholder="请选择补齐尾款时间"
      ></van-field>
      <van-field
        label="客户姓名"
        placeholder="请输入客户姓名"
      ></van-field>

      <van-field
        label="手机号码"
        placeholder="请输入手机号码"
      ></van-field>
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

    <van-popup v-model="show" position="bottom" :overlay-style="{'background':'rgba(0,0,0,.2)'}">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @cancel='show = false'
        @confirm='show = false'
        @change='getDate'
        :min-date="minDate"
        :max-date="maxDate"
      ></van-datetime-picker>
    </van-popup>

    <!--<van-picker :columns="columns" @change="onChange" />-->

  </div>
</template>

<script>
  //  import { Cell, CellGroup, Icon, DatetimePicker,PasswordInput, NumberKeyboard , Row, Col} from 'vant';

  export default {
//    components: {
//      [Cell.name]: Cell,
//      [CellGroup.name]: CellGroup,
//      [Icon.name]: Icon,
//      [DatetimePicker.name]: DatetimePicker,
//      [PasswordInput.name]: PasswordInput,
//      [NumberKeyboard.name]: NumberKeyboard,
//      [Row.name]: Row,
//      [Col.name]: Col,
//
//    },
    data() {
      return {
        username: '',
        password: '',
        minHour: 10,
        maxHour: 20,
        minDate: new Date(1970, 1, 1),
        maxDate: new Date(2519, 10, 1),
        currentDate: new Date(2018, 0, 1),
        columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        show: false,
        date: "",
        message: "",
        totalNumber: 1,
      };
    },
    mounted() {

    },
    methods: {
      onChange(picker, value, index) {
        console.log(`当前值：${value}, 当前索引：${index}`);
      },
      getDate(picker){
        this.date = picker.getValues().join('-');
      },
      onClickLeft() {
        this.$router.push('/gladTidings')
      },
      onClickRight() {
      },
      //增加报销明细
      addNumber(){
        this.totalNumber++;
      },
      //删除报销明细
      deleteNumber(index){
        this.totalNumber--;
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped="">
  .showMore {
    background: #fff;
    color: #409EFF;
    padding: 10px 0;
    text-align: center;
    margin-bottom: 5px;
    cursor: pointer;
    &:hover {
      background: #f4f4f4;
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
