<template>
  <div id="hello" class="hello">

    <div class="top" :class="{'shadow': active !== 3 && active !== 4}">
      <div @click="tabTag(1)" :class="{'onDiv': active === 1}">
        <p>
          <i class="iconfont icon-wancheng"></i>
        </p>
        <h1>我审批的</h1>
      </div>
      <div @click="tabTag(3)" :class="{'onDiv': active === 3}">
        <p>
          <i class="iconfont icon-faqiyingyong"></i>
        </p>
        <h1>我发起的</h1>
      </div>
      <div @click="tabTag(4)" :class="{'onDiv': active === 4}">
        <p>
          <i class="iconfont icon-chaosong"></i>
        </p>
        <h1>抄送我的</h1>
      </div>
    </div>

    <div class="okFinish" v-if="footActive === 1">
      <div class="inRough">
        <div class="main">
          <div class="mainTop">
            <div>
              <span>报备</span>
              <!--<span>8</span>-->
            </div>
            <!--<div>收起</div>-->
          </div>
          <div class="mainMain">
            <div v-for="(key,index) in paths" v-if="key.hidden === 'glad'" @click="routerLink(key.path)">
              <p :style="{'background': key.back}">
                <i :class="key.icon"></i>
              </p>
              <h1>{{key.name}}</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="inRough">
        <div class="main">
          <div class="mainTop">
            <div>
              <span>审批</span>
              <!--<span>3</span>-->
            </div>
            <!--<div>收起</div>-->
          </div>
          <div class="mainMain default">
            <div v-for="key in 4">
              <p>
                <i class="iconfont icon-qita1"></i>
              </p>
              <h1>敬请期待...</h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--我发起的-->
    <div v-if="active !== 0 " class="waterfall"
         :class="{'marTop': active === 1 || active === 2}">
      <div class="sendTop" v-if="active !== 1 && active === 3">
        <div @click="finish(1)" :class="{'readStatus': readActive === 1}"><span>已完成</span></div>
        <div @click="finish(2)" :class="{'readStatus': readActive === 2}"><span>未完成</span></div>
      </div>
      <div class="sendTop" v-if="active !== 1 && active === 4">
        <div @click="finish(1)" :class="{'readStatus': readActive === 1}"><span>已读</span></div>
        <div @click="finish(2)" :class="{'readStatus': readActive === 2}"><span>未读 <a
          v-if="paging !== ''">({{paging}})</a></span></div>
      </div>
      <ul v-show="list.length !== 0"
          v-waterfall-lower="loadMore"
          waterfall-disabled="disabled"
          waterfall-offset="300">
        <li class="started">
          <div class="startedMain" v-for="item in list" @click="routerDetail(item.id)">
            <div class="leftPic">
              <img :src="item.avatar" v-if="item.avatar !== ''">
              <img src="../assets/head.png" v-else>
            </div>
            <div class="rightTitle">
              <div class="title">
                <h2>
                  <span>{{item.name}}</span>- <span>{{item.depart}}</span>
                </h2>
                <span class="times">{{item.created_at}}</span>
              </div>
              <h3>
                报备类型：{{item.bulletin}}
              </h3>
              <h3>
                <!--结束时间：0000-00-00 00:00:00-->
              </h3>
              <div class="progress"
                   :class="{'published':item.status === 'published','rejected':item.status === 'rejected','cancelled':item.status === 'cancelled'}">
                <div>
                  <h4></h4>
                  <h5></h5>
                </div>
                <div>
                  {{item.place}}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="bottom" v-if="list.length === 0 && disabled" style="background: #FFFFFF;">
        <span>暂无数据...</span>
      </div>
      <div class="bottom" v-else>
        <span v-show="disabled && list.length > 6">我是有底线的</span>
        <van-loading v-show="!disabled" type="spinner" color="black"/>
      </div>
    </div>


    <!--底部-->
    <div class="footer">
      <div @click="routerLink('/index')" :class="{'onDiv': footActive === 1}">
        <h2>
          <i class="iconfont icon-shenpi"></i>
        </h2>
        <h1>发起审批</h1>
      </div>
      <div @click="tabTag(2)" :class="{'onDiv': active === 2}">
        <h2>
          <i class="iconfont icon-daiban"></i>
        </h2>
        <h1>待办事项</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';
  import {Toast} from 'vant';

  export default {
    name: 'HelloWorld',
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper')
    },
    components: {Toast},
    data() {
      return {
        urls: globalConfig.server_user,

        list: [],
        page: 1,
        disabled: false,

        paths: [],
        active: 0,
        readActive: 1,
        footActive: 1,
        checks: '',

        params: {},

        paging: '',
      }
    },
    mounted() {
      this.paths = this.$router.options.routes;
    },

    methods: {
      tabTag(val) {
        this.list = [];
        this.footActive = 0;
        this.active = val;
        this.readActive = 1;
        this.page = 1;
        this.disabled = false;
      },
      routerDetail(id) {
        this.$router.push({path: '/publishDetail', query: {ids: id}});
      },

      routerLink(val) {
        if (val === '/index') {
          this.footActive = 1;
        }
        this.active = 0;
        this.disabled = false;
        this.$router.push({path: val});
      },
      loadMore() {
        if (!this.disabled) {
          this.lists(this.page, this.active, this.readActive);
          this.page++;
        }
      },
      finish(read) {
        this.list = [];
        this.page = 1;
        this.readActive = read;
        this.disabled = false;
      },
      lists(val, active, read) {
        this.params = {};
        switch (active) {
          case 1:
            this.params.type = active;
            this.params.page = val;
            this.processList(this.params);
            break;
          case 2:
            this.params.type = active;
            this.params.page = val;
            this.processList(this.params);
            break;
          case 3:
            this.params.type = active;
            this.params.published = read;
            this.params.page = val;
            this.processList(this.params);
            break;
          case 4:
            this.params.type = active;
            this.params.read_at = read;
            this.params.page = val;
            this.processList(this.params);
            break;
        }
      },
      processList(val) {
        this.$http.get(this.urls + 'api/v1/process', {
          params: val,
        }).then((res) => {
          let data = res.data.data;
          if (res.data.status === 'success' && data.length !== 0 && val.type === 3) {
            for (let i = 0; i < data.length; i++) {
              let user = {};
              user.id = data[i].id;
              user.avatar = data[i].user[0].avatar;
              user.name = data[i].user[0].name;
              user.staff = data[i].user[0].org[0].name;
              user.depart = data[i].user[0].role[0].display_name;
              user.created_at = data[i].created_at;
              user.place = data[i].place.display_name;
              user.status = data[i].place.status;
              if (data[i].content.type) {
                user.bulletin = data[i].content.type.name;
              } else {
                user.bulletin = '';
              }
              this.list.push(user);
              console.log(user)
            }
          } else if (res.data.status === 'success' && data.length !== 0 && (val.type === 1 || val.type === 2 || val.type === 4)) {
            for (let i = 0; i < data.length; i++) {
              let user = {};
              user.id = data[i].id;
              user.avatar = data[i].flow.user.avatar;
              user.name = data[i].flow.user.name;
              user.staff = data[i].flow.user.org[0].name;
              user.depart = data[i].flow.user.role[0].display_name;
              user.created_at = data[i].created_at;
              user.place = data[i].flow.place.display_name;
              user.status = data[i].flow.place.status;
              if (data[i].flow.content.type) {
                user.bulletin = data[i].flow.content.type.name;
              } else {
                user.bulletin = '';
              }
              this.list.push(user);
            }
            if (val.type === 4) {
              this.paging = res.data.meta.total;
            } else {
              this.paging = '';
            }
          }
          else {
            this.disabled = true;
          }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #hello {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    @mixin border_radius($p) {
      -webkit-border-radius: $p;
      -moz-border-radius: $p;
      border-radius: $p;
    }

    @mixin img($p) {
      min-width: $p;
      max-width: $p;
      min-height: $p;
      max-height: $p;
    }

    $onColor: #39b1ff;
    $color: #a4a5a8;

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

    .top.shadow {
      -webkit-box-shadow: 0 0 10px 0 #dddddd;
      -moz-box-shadow: 0 0 10px 0 #dddddd;
      box-shadow: 0 0 10px 0 #dddddd;
    }

    .waterfall {
      margin-top: 2.9rem;
      margin-bottom: 1.2rem;
      .bottom {
        @include flex;
        justify-content: center;
        align-items: center;
        padding: .3rem 0;
        color: #DDDDDD;
      }
    }

    .waterfall.marTop {
      margin-top: 2.3rem;
    }

    .top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      @include flex;
      justify-content: space-around;
      height: 2.1rem;
      border-top: .2rem solid #F8F8F8;
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

    .okFinish, .sendTo {
      margin-bottom: 1.5rem;
    }

    .okFinish {
      margin-top: 2.3rem;
      .inRough {
        padding: .4rem;
        margin-top: .3rem;
        .main {
          .mainTop {
            @include flex;
            justify-content: space-between;
            div, span {
              color: #818386;
              span:first-of-type {
                padding-left: .4rem;
                color: #101010;
                font-size: .33rem;
              }
            }
          }
          .mainMain {
            @include flex;
            flex-wrap: wrap;
            margin-top: .3rem;
            div {
              width: 25%;
              text-align: center;
              P {
                background: $onColor;
                margin: .3rem auto .2rem;
                @include border_radius(6px);
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
          .mainMain.default {
            div {
              p {
                background: #aaaaaa;
              }
              h1 {
                color: #aaaaaa;
              }
            }
          }
        }
      }
    }

    /*我发起的*/
    .started {
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
          @include img(.9rem);
          margin-right: .3rem;
          img {
            @include img(.9rem);
            @include border_radius(50%);
          }
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
              min-width: 2rem;
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
              min-width: 2.4rem;
              text-align: right;
              color: $onColor;
            }
          }
          /*通过*/
          div.published {
            div:first-of-type {
              h5 {
                width: 0;
              }
            }
            div:last-of-type {
              color: #2BD7A1;
            }
          }
          /*拒绝*/
          div.rejected {
            div:first-of-type {
              h5 {
                width: 0;
              }
              h4 {
                background: -webkit-linear-gradient(left, #2BD7A1, #e4393c);
                background: -o-linear-gradient(left, #2BD7A1, #e4393c);
                background: -moz-linear-gradient(left, #2BD7A1, #e4393c);
                background: linear-gradient(left, #2BD7A1, #e4393c);
              }
            }
            div:last-of-type {
              color: #e4393c;
            }
          }
          /*撤回*/
          div.cancelled {
            div:first-of-type {
              h4 {
                width: 0;
              }
            }
            div:last-of-type {
              color: #cccccc;
            }
          }
        }
      }
    }

    /*抄送我的*/
    .sendTo {
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

    .sendTo, .waterfall {
      .sendTop {
        position: fixed;
        background: #F8F8F8;
        top: 2.1rem;
        left: 0;
        right: 0;
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
          border-bottom: .03rem solid $onColor;
          span {
            color: $onColor;
          }
        }
      }
    }

    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rem;
      border-top: 1px solid #ebebeb;
      @include flex;
      background: #FFFFFF;
      justify-content: space-around;
      z-index: 999999;
      div + div {
        border-left: 1px solid #EEEEEE;
      }
      div {
        width: 50%;
        margin: .2rem 0;
        text-align: center;
        h2 {
          color: $color;
          i {
            color: $color;
            font-size: .34rem;
          }
        }
        h1 {
          padding-top: .06rem;
          font-size: .2rem;
          color: $color;
        }
      }
    }

    .top, .footer {
      .onDiv {
        h1, h2 {
          color: $onColor;
          i {
            color: $onColor;
          }
        }
        p {
          background: $onColor;
          i {
            color: #FFFFFF;
          }
        }
      }
    }
  }
</style>
