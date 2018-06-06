<template>
  <div id="interLocution">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../../assets/loding1.gif">
    </div>
    <div class="searchClass bgColor" v-if="!noPower && !loading ">
      <div class="searchCustom">
        <div class="bgColor" style="border: #f8f9ff;">
          <i class="van-icon van-icon-search" style="font-size: 20px;vertical-align: middle;"></i>
          <!--<input class="bgColor" type="text" @focus="interModule = true" v-model="form.search" @keyup.enter="search">-->
          <input class="bgColor" type="text" v-model="form.search" @focus="interModule = true" @keyup.enter="search"
                 placeholder="请输入标题"
                 style="padding: 6px 0;">
          <!--<i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>-->
        </div>
        <p @click="search" style="color: #666666;">搜索</p>
        <!--<p v-if="searchValue.length > 0 && interModule" @click="search" style="color: #666666;">搜索</p>-->
        <!--<p v-if="searchValue.length < 1 && interModule" @click="onCancel">取消</p>-->
      </div>
      <div id="interMain" class="interMain">
        <div id="mainContent">
          <div class="mainContent" v-for="(item,index) in questions">
            <div class="main1 boxShadow">
              <div class="mainTop">
                <div class="mainTopA">
                  <p>
                    <img :src="item.asker.avatar" v-if="item && item.asker && item.asker.avatar && !item.is_anonymous"
                         style="border-radius: 50%;">
                    <img src="../../../assets/head.png" v-else>
                    <span>
                  <span v-if="!item.is_anonymous">{{item && item.asker && item.asker.name}}</span>
                  <span v-if="item.is_anonymous">匿名</span>
                  <span v-if="!item.is_anonymous">
                      <span v-if="item && item.asker && item.asker.org.length>0" v-for="v in item.asker.org">&nbsp;{{v.name}}&nbsp;</span>-
                      <span v-if="item && item.asker && item.asker.role.length>0" v-for="v in item.asker.role">&nbsp;{{v.display_name}}&nbsp;</span>
                  </span>
                </span>
                  </p>
                </div>
                <div class="topTime">
                  {{item.create_time}}
                </div>
              </div>
              <div class="contents1">
                <p style="margin: 5px 0;line-height: 28px;font-size: 18px;">{{item.title}}</p>
                <div style="line-height: 26px;font-size: 15px;">
                  {{item.description}}
                </div>
              </div>
              <div class="interFooter">
                <div style="font-size: 15px;line-height: 24px;">{{item.answers_count}}条回答</div>
                <div style="font-size: 15px;line-height: 24px;" @click="showAll(item.id)"
                     v-if="item.answers_count>0 && !disabledIds[item.id]">显示全部
                </div>
                <div style="font-size: 15px;line-height: 24px;" @click="answerDetail=[];disabledIds[item.id]=false"
                     v-if="item.answers_count>0 && disabledIds[item.id]">收起
                </div>
              </div>
            </div>
            <div class="main2">
              <div v-for="(value,key) in answerDetail" class="allContent" v-if="showHide === item.id && showStatus">
                <div class="mainTop padNone topNone">
                  <div class="mainTopA">
                    <p>
                      <img :src="value.staff.avatar" v-if="value.staff.avatar" style="border-radius: 50%;">
                      <img src="../../../assets/head.png" v-else>
                      <span>{{value.staff.name}}
                      <span>
                        <span v-if="value.staff.org.length>0" v-for="v in value.staff.org">&nbsp;{{v.name}}&nbsp;</span>-
                        <span v-if="value.staff.role.length>0" v-for="v in value.staff.role">&nbsp;{{v.display_name}}&nbsp;</span>
                      </span>
                    </span>
                    </p>
                  </div>
                  <div class="topTime">
                    {{value.create_time}}
                  </div>
                </div>
                <div class="boxShadow" style="border-bottom: 1px solid #E0E0E0;">
                  <div class="contents2">
                    <div style="line-height: 28px;">
                      {{value.content}}
                    </div>
                    <div class="con" @click="commentNum(value.id)" v-if="value.comments_count>0">
                      <i class="iconfont icon-pinglun"></i><span>评论({{value.comments_count}})</span>
                    </div>
                    <div class="con" v-if="value.comments_count<1">
                      <i class="iconfont icon-pinglun"></i><span>评论({{value.comments_count}})</span>
                    </div>
                  </div>
                </div>
                <div class="boxShadow man3" :class="{'marginBot': comments === value.id && comStatus}">
                  <div class="contents3" v-for="comment in commentDetail" v-if="comments === value.id && comStatus">
                    <div class="mainTop padNone">
                      <div class="mainTopA">
                        <p>
                          <img :src="comment.staff.avatar" v-if="comment && comment.staff && comment.staff.avatar"
                               style="border-radius: 50%;">
                          <img src="../../../assets/head.png" v-else>
                          <span>
                          <span>{{comment.staff.name}}</span>&nbsp;&nbsp;
                          <span>
                            <span v-if="comment.staff.org.length>0" v-for="v in comment.staff.org">&nbsp;{{v.name}}&nbsp;</span>-
                            <span v-if="comment.staff.role.length>0" v-for="v in comment.staff.role">&nbsp;{{v.display_name}}&nbsp;</span>
                          </span>
                        </span>
                        </p>
                      </div>
                      <div class="topTime">
                        {{comment.create_time}}
                      </div>
                    </div>
                    <div class="article" style="line-height: 28px;">
                      {{comment.content}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no_data" style="top: 70px;" v-if="noData">
          <div class="content" style="text-align: center;margin-top: 20px;background: #fff;">
            <div class="content_img"><img src="../../../assets/no_data2.png" style="width: 40%;"></div>
            <div class="last_title">暂无数据 ...</div>
            <!--<div @click="propQuestion" class="ques_btn">我要提问</div>-->
          </div>
        </div>
      </div>

      <div class="question_btn" @click="propQuestion">
        <span>我要提问</span>
      </div>
      <!--遮罩-->
      <div v-if="interModule" class="interModule" @click="interModule=false"></div>
    </div>
    <div class="searchClass bgColor" v-if="!noPower && !loading && noData && first">
      <!--暂无数据-->
      <div class="no_data" v-if="noData && form.search==''">
        <div class="content" style="text-align: center;margin-top: 20px;background: #fff;">
          <div class="content_img"><img src="../../../assets/no_data2.png" style="width: 40%;"></div>
          <div class="last_title">暂无数据 ...</div>
          <div @click="propQuestion" class="ques_btn">我要提问</div>
        </div>
      </div>
    </div>
    <div class="container" v-if="noPower">
      <div class="content">
        <div class="content_img"><img src="../../../assets/no_power.png" style="width: 50%;"></div>
        <div class="last_title" style="font-size: 18px;color: #42474d">我在努力寻找进入你的接口...</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {Toast},
    data() {
      return {
        loading: true,
        searchValue: '',
        interModule: false,
        showHide: '',
        showStatus: false,
        comments: '',
        comStatus: false,
        questions: [],
        answerDetail: [],
        commentDetail: [],
        form: {
          search: '',
          page: 1,
          limit: 500,
        },
        noPower: false,  //无权
        noData: false, //无数据
        disabledIds: {},  //全部显示 和收起的显示
        scrollTop: 0,
        first: true,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // vm.routerIndex('');
        // vm.ddRent('');
      });
    },
    activated() {
      // let mainHeight = $('body').height() - 140;
      // $('#interMain').css('height', mainHeight + 'px');

      // let _this = this;
      // $('#interMain').scroll(function () {
      //   _this.scroll_bar_move();
      // });
      this.returnIndex();
      this.loading = true;
      this.noPower = false;
      this.noData = false;
      this.getListData();
    },
    watch: {
      loading(val) {
        if (val) {
          this.noPower = false;
          this.noData = false;
        }
      }
    },
    methods: {
      returnIndex() {
        let that = this;
        document.addEventListener('backbutton', function (e) {
          e.preventDefault();
          that.first = true;
          that.form.search = '';
          that.loading = true;
          that.$router.push({path: '/index'});
        });
        dd.biz.navigation.setLeft({
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          onSuccess: function (result) {
            that.first = true;
            that.form.search = '';
            that.loading = true;
            that.$router.push({path: '/index'});
          },
          onFail: function (err) {
          }
        });
      },
      //滚动条
      scroll_bar_move() {
        let mainContent = $('#interMain');
        let body_height = mainContent.height();
        let body_scrollTop = mainContent.scrollTop();
        this.scrollTop = mainContent.scrollTop();
        let scroll_height = $('#mainContent').height();

        if (this.scrollHeight < scroll_height) {
          this.isGetMore = true;
        }
        this.scrollHeight = scroll_height;
        if (scroll_height - body_scrollTop - body_height < 500) {
          // this.getMore();
          // this.isGetMore = false;
        }
      },
      propQuestion() {
        this.$router.push({path: '/proposeQuestion'});
      },
      search() {
        this.first = false;
        this.getListData();
      },
      getListData() {
        this.loading = true;
        this.$http.get(globalConfig.server + "qa/front/question", {params: this.form}).then((res) => {
          this.interModule = false;
          this.loading = false;
          if (res.data.code === "70210") {
            this.questions = res.data.data;
            if (res.data.data.length > 0) {
              res.data.data.forEach((item) => {
                if (this.disabledIds[item.id] == null || this.disabledIds[item.id] == undefined) {
                  this.$set(this.disabledIds, item.id, false);
                }
              });
            }
            if (res.data.data.length < 1) {
              this.questions = [];
              this.noData = true;
            }
          } else if (res.data.code === '70288') {
            this.questions = [];
            this.noPower = true;
          } else {
            this.questions = [];
            Toast.fail(res.data.code);
          }
        });
      },
      onCancel() {
        this.interModule = false;
      },
      showAll(id) {
        this.disabledIds[id] = true;
        for (var v in this.disabledIds) {
          if (v != id) {
            this.disabledIds[v] = false;
          }
        }
        // if (this.showHide === id) {
        //   this.showStatus = !this.showStatus;
        // } else {
        this.showStatus = true;
        this.showHide = id;
        // }
        this.$http.get(globalConfig.server + 'qa/front/answer?question_id=' + id).then((res) => {
          if (res.data.code === '70310') {
            this.answerDetail = res.data.data;
          } else {
            this.answerDetail = [];
            Toast.fail(res.data.msg);
          }
        });
      },
      commentNum(id) {
        if (this.comments === id) {
          this.comStatus = !this.comStatus;
        } else {
          this.comStatus = true;
          this.comments = id;
        }
        this.$http.get(globalConfig.server + 'qa/front/comment?answer_id=' + id).then((res) => {
          if (res.data.code === '70410') {
            this.commentDetail = res.data.data;
          } else {
            this.commentDetail = [];
            Toast.fail(res.data.msg);
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .question_btn {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 100px;
    background: #FFFFFF;
    text-align: center;
    font-size: 20px;
    box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.15);
    span {
      margin-top: 30px;
      color: #FFFFFF;
      display: inline-block;
      background: #536DFE;
      width: 96%;
      height: 50px;
      line-height: 50px;
      box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.40);
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
  }

  .no_data {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    .content {
      .content_img {
        position: relative;
        margin-top: 150px;
      }
      .title {
        position: relative;
        margin-top: 20px;
        font-size: 25px;
        color: #39b1ff;
      }
      .last_title {
        position: relative;
        margin-top: 30px;
        font-size: 18px;
      }
      .ques_btn {
        cursor: pointer;
        margin-top: 20px;
        color: #FFFFFF;
        display: inline-block;
        background: #536DFE;
        border-radius: 4px;
        padding: 15px 50px;
        box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.40);
      }
    }
  }

  .container {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    .content {
      .content_img {
        position: relative;
        margin-top: 100px;
      }
      .title {
        position: relative;
        margin-top: 20px;
        font-size: 25px;
        color: #39b1ff;
      }
      .last_title {
        position: relative;
        margin-top: 30px;
        font-size: 14px;
      }
    }

  }

  #interLocution {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    $colorTitle: #212121;
    $colorLeft: #FF4081;
    $colorRight: #536DFE;
    $colorP: #757575;
    $bottom: 1px solid #E0E0E0;
    $bgColor: #F8F9FF;

    @mixin boxShadow {
      -webkit-box-shadow: 0 6px 10px rgba(61, 90, 254, .1);
      -moz-box-shadow: 0 6px 10px rgba(61, 90, 254, .1);
      box-shadow: 0 6px 10px rgba(61, 90, 254, .1);
    }
    .bgColor {
      background-color: $bgColor;
    }
    .boxShadow {
      @include boxShadow;
    }
    .interMain {
      height: 500px;
      overflow-y: scroll;
      overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;

      .main1 {
        padding: .2rem .4rem;
        background: #FFFFFF;
      }
      #mainContent {
        margin-bottom: 100px;
      }
      .mainContent {
        margin-bottom: .2rem;
        .contents1 {
          border-top: $bottom;
          p {
            color: $colorTitle;
            padding: .2rem 0;
            font-size: .30rem;
          }
          div {
            color: $colorP;
            line-height: .36rem;
          }
        }
        .contents2 {
          margin: 0 .36rem 0 1.1rem;
          div {
            color: $colorTitle;
            line-height: .36rem;
          }
          .con {
            color: #BDBDBD;;
            margin: .16rem 0 0;
            width: 1.8rem;
            padding-bottom: .2rem;
            span {
              font-size: 13px;
              vertical-align: top;
            }
          }
        }
        .contents3 {
          .article {
            margin: 0 .2rem 0 1.1rem;
            padding-bottom: .3rem;
            line-height: .35rem;
            border-bottom: $bottom;
          }
        }
        .contents3:last-of-type {
          .article {
            border-bottom: 0;
          }
        }
        .interFooter {
          @include flex;
          justify-content: space-between;
          align-items: center;
          border-top: $bottom;
          margin-top: .3rem;
          padding-top: .2rem;
          div:first-of-type {
            color: $colorLeft;
          }
          div:last-of-type {
            color: $colorRight;
          }
        }
        .padNone {
          padding: 0;
        }
      }
      .main2 {
        padding: .2rem 0 0;
        .allContent {
          .mainTop {
            padding: .1rem .2rem 0;
          }
          .man3 {
            margin: 0 .3rem;
          }
          .marginBot {
            margin-bottom: .12rem;
          }
        }
      }
    }
    .mainTop {
      @include flex;
      justify-content: space-between;
      align-items: center;
      color: $colorP;
      padding-bottom: .2rem;
      .mainTopA {
        p {
          @include flex;
          justify-content: center;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            margin-right: .2rem;
          }
          span {
            width: 2.6rem;
            height: 20px;
            line-height: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .topTime {
        min-width: 3rem;
        text-align: right;
      }
    }
    .topNone {
      background-color: $bgColor;
    }

    .interModule {
      position: fixed;
      background-color: rgba(0, 0, 0, .4);
      top: 1.4rem;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .searchCustom {
      height: 1.41rem;
      padding: .24rem .3rem;
      border-top: .16rem solid $bgColor;
      border-bottom: $bottom;
      background-color: #FFFFFF;
    }

    .inter {
      padding: .24rem 0 .24rem .3rem;
    }

    .mainOver {
      /*overflow-y: hidden;*/
    }
  }
</style>
