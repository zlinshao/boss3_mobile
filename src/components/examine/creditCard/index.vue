<template>
  <div>
    <div class="creditCard">
      <div class="information">
        <div class="formList">
          <div>开始时间</div>
          <div><input type="date" v-model="content"></div>
        </div>
      </div>
      <div class="information">
        <div class="formList">
          <div>结束时间</div>
          <div><input type="date" v-model="content"></div>
        </div>
      </div>
      <div class="information">
        <div class="formList">
          <div>缺卡原因</div>
          <div>
            <textarea name="" id="" rows="3" placeholder="请输入"></textarea>
          </div>
        </div>
      </div>
      <div class="information">
        <div class="formList">
          <div>证明人</div>
          <div><input type="text" v-model="content" placeholder="请输入"></div>
        </div>
      </div>
      <div class="approveMan">
        <p>审批人</p>
        <div class="photos">
          <div class="title">
            审批人已由管理员预置,并将自动去重
          </div>
          <div class="personal">
            <h1>
              <img src="../../../assets/head.png" alt="">
            </h1>
            <h2>反对点的</h2>
            <h3>第1级主管</h3>
          </div>
          <div class="personal">
            <h1>
              <img src="../../../assets/head.png" alt="">
            </h1>
            <h2>反对点的</h2>
            <h3>第1级主管</h3>
          </div>
          <div class="personal">
            <h1>
              <img src="../../../assets/head.png" alt="">
            </h1>
            <h2>反对点的</h2>
            <h3>第1级主管</h3>
          </div>
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
        content: '',
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

  img {
    width: 100%;
    height: 100%;
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
  .creditCard{
    background: #ffffff;
    margin-top: .4rem;
    margin-bottom: 2rem;
    padding-bottom: .4rem;
    border-bottom: 1px solid #ebebeb;
    .information {
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
      }
    }

    .approveMan {
      padding: 0 .3rem;
      @include flex;
      background: #ffffff;
      p {
        min-width: 1.5rem;
        margin-top: 1.2rem;
        font-size: .33rem;
      }
      .photos {
        width: 100%;
        .title {
          margin: .4rem 0;
          color: #aaaaaa;
          font-size: .26rem;
        }
        .personal {
          float: left;
          width: 1.3rem;
          margin-right: .4rem;
          h1 {
            margin: 0 auto;
            width: 1rem;
            height: 1rem;
          }
          h2, h3 {
            text-align: center;
          }
          h2 {
            font-size: .3rem;
            margin: .2rem 0 .1rem;
            color: #101010;
          }
          h3 {
            color: $onColor;
            font-size: .1rem;
          }
        }
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
