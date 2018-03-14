<template>
  <div id="information">
    <div class="title">出差基本信息</div>
    <div class="information">
      <div class="formList">
        <div>出差事由</div>
        <div><input type="text" v-model="content" placeholder="请输入"></div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>出发地</div>
        <div><input type="text" v-model="content" placeholder="请输入"></div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>目的地</div>
        <div><input type="text" v-model="content" placeholder="请输入"></div>
      </div>
    </div>

    <div class="title">报销费用明细</div>
    <div class="information">
      <div class="formList">
        <div>费用日期</div>
        <div><input type="date" v-model="content" placeholder="请输入"></div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>住宿费</div>
        <div class="money">
          <input type="text" v-model="content" placeholder="请输入">
          <span>元</span>
        </div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>餐饮费</div>
        <div class="money">
          <input type="text" v-model="content" placeholder="请输入">
          <span>元</span>
        </div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>交通费</div>
        <div class="money">
          <input type="text" v-model="content" placeholder="请输入">
          <span>元</span>
        </div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>其他费用</div>
        <div class="money">
          <input type="text" v-model="content" placeholder="请输入">
          <span>元</span>
        </div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>合计</div>
        <div class="money">
          <input type="text" v-model="content" placeholder="请输入">
          <span>元</span>
        </div>
      </div>
    </div>
    <div class="information">
      <div class="formList">
        <div>费用明细</div>
        <div>
          <textarea name="" id="" rows="3" placeholder="请输入"></textarea>
        </div>
      </div>
    </div>

    <div class="footer">
      <router-link to="">提交</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        content: '',             //出差事由
      }
    },
    mounted() {
    },
    watch: {},
    methods: {},
  }
</script>

<style scoped lang="scss">
  $onColor: #39b1ff;
  @mixin flex {
    display: flex;
    display: -webkit-flex;
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: #dddddd;
  }

  input::-moz-placeholder, textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #dddddd;
  }

  input:-moz-placeholder, textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #dddddd;
  }

  input:-ms-input-placeholder, textarea:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #dddddd;
  }

  .title {
    color: $onColor;
    padding: .2rem .3rem;
  }

  #information {
    padding-bottom: 2rem;
  }

  .information {
    background: #ffffff;
    .formList {
      padding: 0 .3rem;
      @include flex;
      justify-content: space-between;
      align-items: center;
      min-height: .88rem;
      border-bottom: 1px solid #ebebeb;
      div {
        font-size: .33rem;
      }
      div:first-of-type {
        width: 1.66rem;
        text-align: right;
      }
      div:last-of-type {
        width: 100%;
        input {
          height: .6rem;
          padding: .06rem .3rem 0;
        }
        textarea, input {
          border: 0;
          width: 100%;
          box-sizing: border-box;
          padding: .2rem .3rem;
          color: #505050;
        }
      }
      div.money {
        @include flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.25rem;
    background: #FFFFFF;
    padding: .25rem .4rem;
    z-index: 999999;
    a {
      display: inline-block;
      text-align: center;
      color: #ffffff;
      width: 100%;
      height: 1.25rem - .5rem;
      line-height: 1.25rem - .51rem;
      background: $onColor;
      -webkit-border-radius: .05rem;
      -moz-border-radius: .05rem;
      border-radius: .05rem;
    }
  }
</style>
