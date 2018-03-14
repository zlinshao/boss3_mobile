<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="退款报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <van-cell-group>
      <van-field label="地址" required placeholder="请选择地址"></van-field>
      <van-field label="付款方式" disabled placeholder="输入框已禁用"></van-field>
      <van-field label="月单价" disabled placeholder="输入框已禁用"></van-field>
      <van-field label="已收金额" disabled placeholder="输入框已禁用"></van-field>
      <van-field label="实退金额" required placeholder="请输入实退金额"></van-field>
      <van-field label="银行" required placeholder="请输入银行" readonly @focus="show = true"></van-field>
      <van-field label="开户名" required placeholder="请选择开户名"></van-field>
      <van-field label="支行" required placeholder="请输入支行"></van-field>
      <van-field label="卡号" required placeholder="请输入卡号"></van-field>
    </van-cell-group>
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

    <van-popup v-model="show" position="bottom" :overlay-style="{'background':'rgba(0,0,0,.2)'}">
      <van-picker :columns="columns" @change="onChange"></van-picker>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        show: false,
        rentType:'',
        columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        message:'',
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
</style>
