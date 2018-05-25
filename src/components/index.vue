<template>
  <div id="hello" class="hello">
    <div class="top" :class="{'shadow': footActive === 1}">
      <div @click="tabTag(1,0)" :class="{'onDiv': active === 1}">
        <p>
          <i class="iconfont icon-wancheng"></i>
        </p>
        <h1>我审批的</h1>
      </div>
      <div @click="tabTag(3,0)" :class="{'onDiv': active === 3}">
        <p>
          <i class="iconfont icon-faqiyingyong"></i>
        </p>
        <h1>我发起的</h1>
      </div>
      <div @click="tabTag(4,0)" :class="{'onDiv': active === 4}">
        <p>
          <i class="iconfont icon-chaosong"></i>
        </p>
        <h1>抄送我的</h1>
      </div>
    </div>

    <div class="okFinish" v-if="footActive === 1">
      <div class="inRough" v-if="queryType == 0 || queryType === 'ding'">
        <div class="mainIndex">
          <div class="mainTop">
            <div>
              <span>报备</span>
              <!--<span>8</span>-->
            </div>
            <!--<div>收起</div>-->
          </div>
          <div class="mainMain">
            <router-link v-for="(key,index) in paths" v-if="key.hidden === 'glad'" :to="key.path" :key="index">
              <p :style="{'background': key.back}">
                <i :class="key.icon"></i>
              </p>
              <h1>{{key.name}}</h1>
            </router-link>
            <a v-for="(key,index) in paths" v-if="key.hidden === 'exam'">
              <p :style="{'background': key.back}" @click="goBefore(key.path)">
                <i :class="key.icon"></i>
              </p>
              <h1>{{key.name}}
                <span v-if="key.name==='我的考试' && examData && examData.available" class="circle_red"></span>
                <span v-if="key.name==='问卷调查' && questionnaireData && questionnaireData.available"
                      class="circle_red"></span>
              </h1>
            </a>
          </div>
        </div>
      </div>

      <div class="inRough" v-if="queryType == 1 || queryType === 'ding'">
        <div class="mainIndex">
          <div class="mainTop">
            <div>
              <span>补齐资料</span>
              <!--<span>3</span>-->
            </div>
            <!--<div>收起</div>-->
          </div>
          <div class="mainMain">
            <router-link v-for="(key,index) in paths" v-if="key.hidden === 'polish'" :to="key.path" :key="index">
              <p :style="{'background': key.back}">
                <i :class="key.icon"></i>
              </p>
              <h1>{{key.name}}</h1>
            </router-link>
          </div>
        </div>
      </div>

      <div class="inRough" v-if="queryType == 2 || queryType === 'ding'">
        <div class="mainIndex">
          <div class="mainTop">
            <div>
              <span>房产管控中心</span>
              <!--<span>3</span>-->
            </div>
            <!--<div>收起</div>-->
          </div>
          <div class="mainMain">
            <router-link v-for="(key,index) in paths" v-if="key.hidden === 'product'" :to="key.path" :key="index">
              <p :style="{'background': key.back}">
                <i :class="key.icon"></i>
              </p>
              <h1>{{key.name}}</h1>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!--我发起的-->
    <div v-if="active !== 0 " class="waterfall"
         :class="{'marTop': active === 1 || active === 2}">
      <div class="sendTop" v-if="active !== 3 && active !== 4">
        <div @click="searchRouter"><i class="iconfont icon-sousuo" style="vertical-align: middle;"></i><span>搜索</span>
        </div>
      </div>
      <div class="sendTop" v-if="active !== 1 && active === 3">
        <div @click="searchRouter"><i class="iconfont icon-sousuo" style="vertical-align: middle;"></i>搜索</div>
        <div @click="finish(0)" :class="{'readStatus': readActive === 0}"><span>未完成({{paging}})</span></div>
        <div @click="finish(1)" :class="{'readStatus': readActive === 1}"><span>已完成</span></div>
      </div>
      <div class="sendTop" v-if="active !== 1 && active === 4">
        <div @click="searchRouter"><i class="iconfont icon-sousuo" style="vertical-align: middle;"></i>搜索</div>
        <div @click="finish(0)" :class="{'readStatus': readActive === 0}"><span>未读({{paging}})</span></div>
        <div @click="finish(1)" :class="{'readStatus': readActive === 1}"><span>已读</span></div>
      </div>
      <ul v-show="list.length !== 0"
          v-waterfall-lower="loadMore"
          waterfall-disabled="disabled"
          waterfall-offset="300">
        <li class="started">
          <div class="startedMain" v-for="item in list" @click="routerDetail(item.id)">
            <div class="leftPic">
              <img :src="item.avatar" v-if="item.avatar !== '' && item.avatar !== null">
              <img src="../assets/head.png" v-else>
            </div>
            <div class="rightTitle">
              <div class="title">
                <h2>
                  <span>{{item.name}}</span><span>&nbsp;-&nbsp;{{item.depart}}</span>
                </h2>
                <span class="times">{{item.created_at}}</span>
              </div>
              <h3>
                报备类型：
                <span v-if="active !== 3">{{item.title}}</span>
                <span v-if="active === 3">我的{{item.bulletin}}</span>
              </h3>
              <h3>
                房屋地址：
                <span>{{item.house_name}}</span>
              </h3>
              <!--<h3>-->
              <!--结束时间：0000-00-00 00:00:00-->
              <!--</h3>-->
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
    <div class="footerIndex">
      <div @click="routerLink('/index')" :class="{'onDiv': footActive === 1}">
        <h2>
          <i class="iconfont icon-shenpi"></i>
        </h2>
        <h1>发起报备</h1>
      </div>
      <div @click="tabTag(2,0)" :class="{'onDiv': active === 2}">
        <h2>
          <i class="iconfont icon-daiban"></i>
          <span class="titleNum" v-if="processType2 > 0 && processType2 < 100">{{processType2}}</span>
          <span class="titleNum fontMini" v-if="processType2 > 99">99+</span>
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
        readActive: 0,
        footActive: 1,
        checks: '',
        params: {},
        paging: 0,
        processType2: '',
        queryType: '',
        examData: {},
        questionnaireData: {},
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.toDone();
      })
    },
    mounted() {
      this.paths = this.$router.options.routes;
      this.queryType = sessionStorage.getItem('queryType');
      this.scrollTops();
      this.toDone();
      //个人门户下的考试和调查1分钟轮询一次
      this.getExamNaireRedCircle();
      setTimeout(() => {
        this.getExamNaireRedCircle();
      }, 60 * 1000);
    },
    activated() {
      this.routerIndex('');
      this.ddRent('', 'close');
      this.disabled = false;
      this.scrollTops();
      this.confirmArrival = localStorage.getItem('confirmArrival');
    },
    methods: {
      goBefore(val) {
        this.getExamNaireRedCircle();
        if (val === '/exam') {
          // if (this.examData.available) {
          //   if (this.confirmArrival && this.confirmArrival.length > 0 && this.confirmArrival.indexOf(this.examData.id) > -1) {
          //     this.$router.push({path: val, query: {id: this.examData.id, type: ''}});
          //   } else {
          //     this.$http.post(globalConfig.server + 'exam/check_in/' + this.examData.id).then((res) => {
          //       if (res.data.code === '30000') {
          //         let arr = [];
          //         arr.push(this.examData.id);
          //         localStorage.setItem('confirmArrival', arr);  //保存已到场的考试id
          //         this.$router.push({path: val, query: {id: this.examData.id, type: ''}});
          //       }
          //     });
          //   }
          // } else {
          //   this.$router.push({path: val, query: {id: this.examData.id, type: 'first'}});
          // }
          // this.$router.push({path: '/beforeExam'});
          this.$router.push({path: val, query: {id: this.examData.id, type: 'first'}});
        }else if(val === '/questionnaire') {
           this.$router.push({path: '/beforeNaire'});
        }
      },
      getExamNaireRedCircle() {
        this.$http.get(globalConfig.server + 'exam/active').then((res) => {
          if (res.data.code === '30000') {
            this.examData = res.data.data;
          }
        });
        this.$http.get(globalConfig.server + 'questionnaire/active').then((res) => {
          if (res.data.code === '30000') {
            this.questionnaireData = res.data.data;
          }
        });
      },
      // 搜索
      searchRouter() {
        this.$router.push({path: '/searchList', query: {term: JSON.stringify(this.params)}});
      },
      // 待办事项
      toDone() {
        this.$http.get(this.urls + 'process?type=2&count=1').then((res) => {
          this.processType2 = res.data.data;
        })
      },
      // 详情页
      routerDetail(id) {
        this.disabled = true;
        this.$router.push({path: '/publishDetail', query: {ids: id}});
      },
      // 返回顶部
      scrollTops() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      },
      tabTag(val, red) {
        this.list = [];
        this.footActive = 0;
        this.active = val;
        this.readActive = red;
        this.page = 1;
        this.disabled = false;
        this.scrollTops();
      },
      loadMore() {
        if (!this.disabled) {
          this.lists(this.page, this.active, this.readActive);
          this.page++;
        }
      },
      routerLink(val) {
        this.scrollTops();
        if (val === '/index') {
          this.footActive = 1;
        }
        this.active = 0;
        this.disabled = false;
      },
      finish(read) {
        this.list = [];
        this.page = 1;
        this.readActive = read;
        this.disabled = false;
        this.scrollTops();
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
        this.$http.get(this.urls + 'process', {
          params: val,
        }).then((res) => {
          if (res.data.status === 'success') {
            if ((val.published === 0 && val.type === 3) || (val.read_at === 0 && val.type === 4)) {
              this.paging = res.data.meta.total;
            }
            let data = res.data.data;
            if (res.data.status === 'success' && data.length !== 0) {
              for (let i = 0; i < data.length; i++) {
                let user = {};
                user.title = data[i].title;
                user.created_at = data[i].created_at;
                if (val.type === 3) {
                  if (data[i].content.house) {
                    user.house_name = data[i].content.house.name;
                  } else {
                    user.house_name = '/';
                  }
                  if (data[i].user) {
                    user.avatar = data[i].user.avatar;
                    user.name = data[i].user.name;
                    user.depart = data[i].user.org[0].name;
                  } else {
                    user.avatar = '';
                    user.name = '';
                    user.staff = '';
                  }
                  user.id = data[i].id;
                  user.place = data[i].place.display_name;
                  user.status = data[i].place.status;
                  user.bulletin = data[i].content.bulletin_name;
                }
                if (val.type === 1 || val.type === 2 || val.type === 4) {
                  if (data[i].flow) {
                    if (user.house_name = data[i].flow.content.house) {
                      user.house_name = data[i].flow.content.house.name;
                    } else {
                      user.house_name = '/';
                    }
                    if (data[i].user) {
                      user.avatar = data[i].flow.user.avatar;
                      user.name = data[i].flow.user.name;
                      user.depart = data[i].flow.user.org[0].name;
                    } else {
                      user.avatar = '';
                      user.name = '';
                      user.staff = '';
                    }
                    user.id = data[i].flow.id;
                    user.place = data[i].flow.place.display_name;
                    user.status = data[i].flow.place.status;
                    if (data[i].flow.content.type) {
                      user.bulletin = data[i].flow.content.type.name;
                    } else {
                      user.bulletin = '';
                    }
                  } else {
                    user.place = '';
                    user.status = '';
                    user.bulletin = '';
                  }
                }
                this.list.push(user);
              }
            } else {
              this.disabled = true;
            }
          } else {
            this.paging = 0;
          }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .circle_red {
    width: 5px;
    height: 5px;
    background: red;
    display: inline-block;
    border-radius: 50%;
  }

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

    .top, .started, .inRough, .footerIndex {
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
      margin-top: 3.1rem;
      padding-bottom: 1.2rem;
      .bottom {
        @include flex;
        justify-content: center;
        align-items: center;
        padding: .3rem 0;
        color: #DDDDDD;
      }
    }

    .waterfall.marTop {
      margin-top: 3.1rem;
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

    .okFinish {
      padding-bottom: 1.5rem;
    }

    .okFinish {
      margin-top: 2.3rem;
      .inRough {
        padding: .4rem;
        margin-top: .3rem;
        .mainIndex {
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
            a {
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
            a {
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
            align-items: center;
          }
          div.title {
            line-height: .42rem;
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

    .waterfall {
      .sendTop {
        position: fixed;
        background: #FFFFFF;
        top: 2.1rem;
        left: 0;
        right: 0;
        @include flex;
        justify-content: space-around;
        border-top: .2rem solid #f4f4f4;
        border-bottom: .02rem solid #ebebeb;
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

    .footerIndex {
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

    .top, .footerIndex {
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
    .titleNum {
      position: absolute;
      top: .08rem;
      background-color: red;
      color: #FFFFFF;
      border-radius: 80%;
      width: .28rem;
      height: .28rem;
      line-height: .28rem;
      font-size: .18rem;
      text-align: center;
    }
    .titleNum.fontMini {
      font-size: .12rem;
    }
  }
</style>
