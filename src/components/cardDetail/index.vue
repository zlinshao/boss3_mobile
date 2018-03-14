<template>
  <div id="cardDetail">
    <div class="detail">
      <div class="detailLeft">
        <div>
          <img src="../../assets/head.png" alt="">
        </div>
      </div>
      <div class="detailRight">
        <div class="topRight">
          <div class="personal">
            <p>李巧俊</p>
            <p>研发部-产品经理方式发士大夫撒旦撒</p>
          </div>
          <div class="status">
            <img src="../../assets/tongguo.png" alt="">
          </div>
        </div>
        <div class="topTitle">
          <div>
            <p>审批编号</p>
            <h1>32321312321321321312321</h1>
          </div>
          <div>
            <p>所在部门</p>
            <h1>南京乐伽商业管理有限公司</h1>
          </div>
          <div>
            <p>开始时间</p>
            <h1>0000-00-00 00:00:00</h1>
          </div>
          <div>
            <p>结束时间</p>
            <h1>0000-00-00 00:00:00</h1>
          </div>
          <div>
            <p>缺卡原因</p>
            <h1>地方还是卡积分</h1>
          </div>
          <div>
            <p>证明人</p>
            <h1>杜帅 王坤</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="process">
      <div class="pro">
        <div class="proLeft border_d">
          <h1>0000-00-00</h1>
          <h2>00:00</h2>
          <h3></h3>
        </div>
        <div class="proRight">
          <p>
            <img src="../../assets/head.png" alt="">
          </p>
          <h2>李巧俊发</h2>
          <h3>发起申请</h3>
        </div>
      </div>
      <div class="pro">
        <div class="proLeft">
          <h1>0000-00-00</h1>
          <h2>00:00</h2>
          <h3></h3>
        </div>
        <div class="proRight">
          <p>
            <img src="../../assets/head.png" alt="">
          </p>
          <h2>沈晶晶</h2>
          <h3><span>@杜帅</span><span>@张琳琳</span></h3>
        </div>
      </div>
      <div class="pro">
        <div class="proLeft">
          <h1>0000-00-00</h1>
          <h2>00:00</h2>
          <h3></h3>
        </div>
        <div class="proRight">
          <p>
            <img src="../../assets/head.png" alt="">
          </p>
          <h2>杜帅</h2>
          <h3>证明</h3>
        </div>
      </div>
      <div class="pro">
        <div class="proLeft">
          <h1>0000-00-00</h1>
          <h2>00:00</h2>
          <h3></h3>
        </div>
        <div class="proRight">
          <p>
            <img src="../../assets/head.png" alt="">
          </p>
          <h2>张琳琳</h2>
          <h3>证明</h3>
        </div>
      </div>
      <div class="pro">
        <div class="proLeft">
          <h1>0000-00-00</h1>
          <h2>00:00</h2>
          <h3></h3>
        </div>
        <div class="proRight">
          <p>
            <img src="../../assets/head.png" alt="">
          </p>
          <h2>沈晶晶</h2>
          <h3>已同意</h3>
        </div>
      </div>
      <div class="pro">
        <div class="proLeft">
          <h1>0000-00-00</h1>
          <h2>00:00</h2>
          <h3></h3>
        </div>
        <div class="proRight">
          <p>
            <img src="../../assets/head.png" alt="">
          </p>
          <h2>马旭明</h2>
          <h3>已同意</h3>
        </div>
      </div>
    </div>
    <div class="copyPerson">
      <p>审批通过后通知抄送人</p>
      <div class="headPhoto">
        <h1>抄送人：</h1>
        <div>
          <h2 v-for="key in 6">
            <img src="../../assets/head.png" alt="">
          </h2>
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
      return {}
    },
    mounted() {
    },
    watch: {},
    methods: {},
  }
</script>

<style scoped lang="scss">
  @mixin flex {
    display: flex;
    display: -webkit-flex;
  }

  @mixin border_radius($p) {
    -webkit-border-radius: $p;
    -moz-border-radius: $p;
    border-radius: $p;
  }

  $onColor: #39b1ff;
  $borColor: #9c9c9c;
  img {
    width: 100%;
    height: 100%;
  }

  #cardDetail {
    background: #ffffff;
    .detail {
      padding: .3rem .3rem 0;
      @include flex;
      .detailLeft {
        min-width: .9rem;
        max-width: .9rem;
        margin-right: .3rem;
        div {
          height: .9rem;
          margin-top: .34rem;
        }
      }
      .detailRight {
        width: 100%;
        .topRight {
          padding-bottom: .3rem;
          @include flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ebebeb;
          .personal {
            p {
              width: 3.6rem;
              line-height: .5rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p:first-of-type {
              color: #101010;
            }
          }
          .status {
            width: 1.5rem;
            height: 1.5rem;
          }
        }
        .topTitle {
          padding: .3rem 0;
          div {
            margin-bottom: .12rem;
            @include flex;
            p {
              min-width: 1.2rem;
              max-width: 1.2rem;
              text-align: right;
              margin-right: .3rem;
              line-height: .4rem;
            }
            h1 {
              color: #101010;
              line-height: .4rem;
            }
          }
        }
      }
    }

    .process {
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      padding: 0 .3rem;
      .pro {
        height: 1.2rem;
        @include flex;
        justify-content: center;
        text-align: center;
        .proLeft {
          position: relative;
          min-width: 1.8rem;
          max-width: 1.8rem;
          padding-right: .2rem;
          border-right: .02rem solid $borColor;
          text-align: right;
          @include flex;
          flex-direction: column;
          justify-content: center;
          h1 {
            font-size: .24rem;
          }
          h2 {
            font-size: .3rem;
            margin-top: .12rem;
            color: $borColor;
          }
          h3 {
            position: absolute;
            right: -.15rem;
            width: .3rem;
            height: .3rem;
            background: $borColor;
            @include border_radius(50%);
            border: .08rem solid #ffffff;
          }
        }
        .border_d {
          border-right-color: $onColor;
          h3 {
            background: $onColor;
          }
        }
        .proRight {
          width: 100%;
          @include flex;
          align-items: center;
          p {
            @include border_radius(50%);
            min-width: .8rem;
            max-width: .8rem;
            max-height: .8rem;
            min-height: .8rem;
            margin: 0 .1rem 0 .2rem;
          }
          h2 {
            min-width: 1.15rem;
            max-width: 1.15rem;
            margin-right: .24rem;
            text-align: left;
          }
          h3 {
            color: $onColor;
          }
          h2, h3 {
            font-size: .24rem;
            span {
              font-size: .24rem;
              color: #FF953e;
            }
            span + span {
              padding-left: .06rem;
            }
          }
        }
      }
    }

    .copyPerson {
      padding: .3rem;
      margin-bottom: 2rem;
      p {
        text-align: center;
        margin-bottom: .3rem;
      }
      .headPhoto {
        @include flex;
        h1 {
          margin-top: .24rem;
          min-width: 1.5rem;
          max-width: 1.5rem;
        }
        div {
          @include flex;
          align-items: center;
          flex-wrap: wrap;
          h2 {
            width: .8rem;
            height: .8rem;
            margin-bottom: .2rem;
            margin-right: .2rem;
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
    z-index: 99999;
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
