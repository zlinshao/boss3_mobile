<template>
  <div id="contract">
    <div class="contractInfo" v-for="item in 5">
      <van-row class="contractItem">
        <van-col class="itemWord" span="6">房屋地址 : </van-col>
        <van-col class="itemWord" span="18">天华硅谷12-3-301</van-col>
      </van-row>
      <van-row class="contractItem">
        <van-col class="itemWord" span="6">合同状态 : </van-col>
        <van-col class="itemWord" span="18">天华硅谷12-3-301</van-col>
      </van-row>
      <van-row class="contractItem">
        <van-col span="12">
          <van-row>
            <van-col class="itemWord" span="10">报备时间 : </van-col>
            <van-col class="itemWord" span="14">天华</van-col>
          </van-row>
        </van-col>
        <van-col span="12">
          <van-row>
            <van-col class="itemWord" span="10">签约时长 : </van-col>
            <van-col class="itemWord" span="14">天华硅谷12</van-col>
          </van-row>
        </van-col>
      </van-row>
      <van-row class="contractItem">
        <van-col span="12">
          <van-row>
            <van-col class="itemWord" span="10">开单人 : </van-col>
            <van-col class="itemWord" span="14">天华</van-col>
          </van-row>
        </van-col>
        <van-col span="12">
          <van-row>
            <van-col class="itemWord" span="10">客户姓名 : </van-col>
            <van-col class="itemWord" span="14">天华硅谷12-3</van-col>
          </van-row>
        </van-col>
      </van-row>
      <van-row class="contractItem">
        <van-col span="12">
          <van-row>
            <van-col class="itemWord" span="10">所属部门 : </van-col>
            <van-col class="itemWord" span="14">天华</van-col>
          </van-row>
        </van-col>
        <van-col span="12">
          <van-row>
            <van-col class="itemWord" span="10">结束时间 : </van-col>
            <van-col class="itemWord" span="14">天华硅谷12</van-col>
          </van-row>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #contract{
    padding: .15rem;
    .flex {
      display: -webkit-flex; /* Safari */
      display: flex;
    }
    .contractInfo{
      border-bottom: 1px solid #DDDDDD;
      &:last-child{
        border: none;
      }
      padding: .2rem 0;
      .contractItem{
        padding: .05rem 0;
        .itemWord{
          font-size: .28rem;
        }
      }
    }
  }
</style>
