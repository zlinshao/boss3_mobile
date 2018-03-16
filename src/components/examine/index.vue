<template>
  <div class="hello">
    <div class="top">
      <div @click="active = 1" :class="{'onDiv': active === 1}">
        <p>
          <i class="iconfont icon-wancheng"></i>
        </p>
        <h1>已完成事项</h1>

      </div>
      <div @click="active = 2" :class="{'onDiv': active === 2}">
        <p>
          <i class="iconfont icon-faqiyingyong"></i>
        </p>
        <h1>我发起的</h1>
      </div>
      <div @click="active = 3" :class="{'onDiv': active === 3}">
        <p>
          <i class="iconfont icon-chaosong"></i>
        </p>
        <h1>抄送我的</h1>
      </div>
    </div>

    <!--已完成事项-->
    <div class="okFinish" v-if="active === 1">
      <div class="inRough">
        <div class="main">
          <div class="mainTop">
            <div onclick="alert(2)">
              <span>客服部问题申报</span>
              <span>8</span>
            </div>
            <div>
              收起
            </div>
          </div>
          <div class="mainMain">
            <div v-for="key in 8">
              <p>
                <i class="iconfont icon-wancheng"></i>
              </p>
              <h1>客服部转租问题申报</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="inRough">
        <div class="main">
          <div class="mainTop">
            <div>
              <span>出勤休假</span>
              <span>3</span>
            </div>
            <div>
              收起
            </div>
          </div>
          <div class="mainMain">
            <div v-for="key in 8">
              <p>
                <i class="iconfont icon-wancheng"></i>
              </p>
              <h1>补卡申请</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--我发起的-->
    <div class="started" v-if="active === 2">
      <div class="startedMain" v-for="key in 10">
        <div class="leftPic">
          <img src="../../assets/head.png" alt="">
        </div>
        <div class="rightTitle">
          <div class="title">
            <h2>
              <span>李巧俊</span>- <span>研发部卡申请犯得上地方撒范德萨发生</span>
            </h2>
            <span class="times">0000-00-00</span>
          </div>
          <h3>
            开始时间：0000-00-00 00:00:00
          </h3>
          <h3>
            结束时间：0000-00-00 00:00:00
          </h3>
          <div class="progress">
            <div>
              <h4 :style="progress"></h4>
              <h5></h5>
            </div>
            <div>
              未完成
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--抄送我的-->
    <div class="sendTo" v-if="active === 3">
      <div class="sendTop">
        <div @click="readActive = 1" :class="{'readStatus': readActive === 1}"><span>全部</span></div>
        <div @click="readActive = 2" :class="{'readStatus': readActive === 2}"><span>未读(99)</span></div>
      </div>
      <div class="sendMain">
        <div class="startedMain" v-for="key in 10">
          <div class="leftPic">
            <img src="../../assets/head.png" alt="">
          </div>
          <div class="rightTitle">
            <div class="title">
              <h2>
                <span>李巧俊</span>- <span>离职申请</span>
              </h2>
              <span class="times">0000-00-00</span>
            </div>
            <h3>
              姓名：李巧俊
            </h3>
            <h3>
              身份证：101010101010101100
            </h3>
            <h3>
              所属部门：研发部
            </h3>
            <h4>审批通过</h4>
          </div>
        </div>
      </div>
    </div>

    <!--底部-->
    <div class="footer">
      <div @click="footActive = 1" :class="{'onDiv': footActive === 1}">
        <h2>
          <i class="iconfont icon-shenpi"></i>
        </h2>
        <h1>我的审批</h1>
      </div>
      <div @click="footActive = 2" :class="{'onDiv': footActive === 2}">
        <h2>
          <i class="iconfont icon-daiban"></i>
        </h2>
        <h1>待办事项</h1>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        active: 1,
        readActive: 1,
        footActive: 1,
        progress: {
          width: '50%',
        },
        checks: '',
      }
    },
    methods: {
      hhhhhh() {
        alert(1);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  $color: #a4a5a8;
  img {
    width: 100%;
    height: 100%;
  }

  .top, .started, .inRough, .footer {
    background: #FFFFFF;
    P, h2 {
      text-align: center;
      i {
        font-size: .42rem;
        color: #ffffff;
      }
    }

  }

  .top {
    @include flex;
    justify-content: space-around;
    height: 2rem;
    div {
      @include flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p {
        width: .9rem;
        height: .9rem;
        line-height: .9rem;
        @include border_radius(50%);
        margin-bottom: .26rem;
        background: #e2e3e4;
        i {
          font-size: .42rem;
          color: $color;
        }
      }
      h1 {
        font-size: .28rem;
        color: $color;
      }
    }
  }

  .okFinish, .started, .sendTo {
    margin-bottom: 2rem;
  }

  /*已完成事项*/
  .okFinish {
    .inRough {
      padding: .4rem;
      margin-top: .4rem;
      .main {
        .mainTop {
          @include flex;
          justify-content: space-between;
          div, span {
            color: #818386;
            span:first-of-type {
              color: #101010;
            }
          }
        }
        .mainMain {
          @include flex;
          flex-wrap: wrap;
          margin-top: .5rem;
          div {
            width: 25%;
            text-align: center;
            P {
              margin: .3rem auto .2rem;
              @include border_radius(6px);
              background: red;
              width: .86rem;
              height: .86rem;
              line-height: .86rem;
            }
            h1 {
              font-size: .24rem;
              padding: 0 .1rem;
              line-height: .36rem;
            }
          }
        }
      }
    }
  }

  /*我发起的*/
  .started {
    margin-top: .4rem;
    padding: .3rem .3rem 0;
    @include flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .started, .sendMain {
    @include flex;
    .startedMain {
      width: 100%;
      @include flex;
      padding-bottom: .3rem;
      .leftPic {
        min-width: .9rem;
        max-width: .9rem;
        min-height: .9rem;
        max-height: .9rem;
        margin-right: .3rem;
      }
      .rightTitle {
        width: 100%;
        border-bottom: .02rem solid #ebebeb;
        padding-bottom: .3rem;
        span {
          color: #9c9c9c;
        }
        div.title, div.progress {
          @include flex;
          justify-content: space-between;
        }
        div.title {
          h2 {
            max-width: 3.5rem;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              color: #101010;
            }
          }
          span.times {
            min-width: 88px;
            text-align: right;
          }
        }
        h3 {
          margin: .15rem 0;
          color: $color;
        }
        div.progress {
          div {
            @include border_radius(10px);
          }
          div:first-of-type {
            width: 100%;
            @include flex;
            align-items: center;
            h4, h5 {
              height: .06rem;
              width: 100%;
              background: #cccccc;
            }
            h4 {
              background: -webkit-linear-gradient(left, #2BD7A1, #39b1ff);
              background: -o-linear-gradient(left, #2BD7A1, #39b1ff);
              background: -moz-linear-gradient(left, #2BD7A1, #39b1ff);
              background: linear-gradient(left, #2BD7A1, #39b1ff);
            }
          }
          div:last-of-type {
            margin-top: -.03rem;
            min-width: 1rem;
            text-align: right;
            color: $onColor;
          }
        }
      }
    }
  }

  /*抄送我的*/
  .sendTo {
    .sendTop {
      @include flex;
      justify-content: space-around;
      border-bottom: .02px solid #ebebeb;
      div {
        height: .8rem;
        width: 40%;
        line-height: .8rem;
        text-align: center;
        span {
          color: #101010;
        }
      }
      .readStatus {
        border-bottom: .03px solid $onColor;
        span {
          color: $onColor;
        }
      }
    }
    .sendMain {
      flex-wrap: wrap;
      background: #ffffff;
      .startedMain {
        border-bottom: .02rem solid #ebebeb;
        padding: .3rem;
        .rightTitle {
          border: 0;
          padding: 0;
          h4 {
            color: $onColor;
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
    border-top: 1px solid #ebebeb;
    @include flex;
    background: #FFFFFF;
    justify-content: space-around;
    z-index: 999999;
    div {
      @include flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h2 {
        width: .5rem;
        height: .5rem;
        text-align: center;
        line-height: .5rem;
        margin-bottom: .1rem;
        background: transparent;
        color: $color;
        i {
          color: $color;
        }
      }
      h1 {
        color: $color;
      }
    }
  }

  .hello {
    .onDiv {
      h1 {
        color: $onColor;
      }
      p {
        background: $onColor;
        i {
          color: #ffffff;
        }
      }
      h2 {
        i {
          color: $onColor;
        }
      }

    }
  }

</style>
