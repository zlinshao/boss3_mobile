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
            <div class="main1">
              <div class="mainTop">
                <div class="mainTopA">
                  <div v-if="!item.is_anonymous">
                    <div style="float: left;">
                      <img :src="item.asker.avatar" v-if="item && item.asker && item.asker.avatar"
                           style="border-radius: 50%;">
                      <img src="../../../assets/head.png" v-else>
                    </div>
                    <div style="margin-left: 50px;">
                      <div>{{item && item.asker && item.asker.name}}</div>
                      <div class="text_ellipsis">
                        <span v-if="item && item.asker && item.asker.org.length>0" v-for="v in item.asker.org">{{v.name}}&nbsp;</span>-
                        <span v-if="item && item.asker && item.asker.role.length>0" v-for="v in item.asker.role">{{v.display_name}}&nbsp;</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.is_anonymous"
                       style="display: flex;justify-content: center;align-items: center;">
                    <img src="../../../assets/head.png">
                    <span style="width: 2.6rem;margin-left: 10px;">匿名</span>
                  </div>
                </div>
                <div class="topTime">
                  {{item.create_time}}
                </div>
              </div>
              <div class="contents1">
                <p style="margin: 10px 0 8px;line-height: 28px;font-size: 18px;">
                  {{item.title}}
                </p>
                <div>
                  <div class="second_line_camp" :id="`desc-${item.id}`" style="line-height: 26px;font-size: 15px;">
                    {{item.description}}
                  </div>
                  <div style="color: #536DFE;margin-top: 15px;font-size: 15px;" v-if="showDescIds[item.id]" @click="showDesc(item.id, 'show')">
                    显示全部
                  </div>
                  <div style="color: #536DFE;margin-top: 15px;font-size: 15px;" v-if="showDescIds[item.id] == false"
                       @click="showDesc(item.id, 'hide')">
                    收起
                  </div>
                </div>
              </div>
              <div class="interFooter">
                <div>
                  <span v-if="item.answers_count>0 && !disabledIds[item.id]" @click="showAll(item.id)">显示回答 ({{item.answers_count}})</span>
                  <span v-if="item.answers_count>0 && disabledIds[item.id]"
                        @click="answerDetail=[];disabledIds[item.id]=false;answerLoading=false">收起回答 ({{item.answers_count}})</span>
                </div>
                <div @click="writeAnswer(item.id)">
                  <van-icon name="chat" style="font-size: 18px;"/>
                </div>
              </div>
            </div>
            <div class="main2">
              <div style="text-align: center;position: relative;margin-left: 45%;" v-if="showHide === item.id && answerLoading">
                <van-loading type="spinner" color="black" />
              </div>
              <div v-for="(value,key) in answerDetail" class="allContent"
                   v-if="showHide === item.id && !answerLoading">
                <div class="mainTop topNone" :class="{'padTop3': key!=0}">
                  <div class="mainTopA">
                    <div>
                      <div style="float: left;">
                        <img :src="value.staff.avatar" v-if="value.staff.avatar" style="border-radius: 50%;">
                        <img src="../../../assets/head.png" v-else>
                      </div>
                      <div style="margin-left: 50px;">
                        <div>{{value && value.staff && value.staff.name}}</div>
                        <div class="text_ellipsis">
                          <span v-if="value.staff.org.length>0" v-for="v in value.staff.org">{{v.name}}&nbsp;</span>-
                          <span v-if="value.staff.role.length>0"
                                v-for="v in value.staff.role">{{v.display_name}}&nbsp;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="topTime" style="padding-right: 0rem;">
                    {{value.create_time}}
                  </div>
                </div>
                <div class="boxShadow">
                  <div class="contents2">
                    <div class="show_desc" style="line-height: 28px;margin-top: 5px;">
                      {{value.content}}
                    </div>
                    <div class="interFooter2">
                      <div class="con" v-if="value.comments_count>0">
                        <span v-if="!showCommentIds[value.id]" @click="commentNum(value.id)">显示评论 ({{value.comments_count}})</span>
                        <span v-if="showCommentIds[value.id]" @click="commentDetail=[];showCommentIds[value.id]=false;commentLoading=false;">收起评论 ({{value.comments_count}})</span>
                      </div>
                      <div class="con" v-if="value.comments_count<1">
                        <span>显示评论 ({{value.comments_count}})</span>
                      </div>
                      <div class="con" @click="writeComment(item.id, value.id)"
                           style="padding-right: 0;margin-right: 0;text-align: right;">
                        <i class="iconfont icon-pinglun"></i><span> 发表评论</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="boxShadow man3">
                  <div style="text-align: center;position: relative;margin-left: 45%;padding: 10px 0;" v-if="comments === value.id && commentLoading">
                    <van-loading type="spinner" color="black" />
                  </div>
                  <div v-for="(comment,comindex) in commentDetail" v-if="comments === value.id" style="margin-bottom: 6px;">
                    <div  class="contents3" >
                      <div class="mainTop"  :class="{'padTop3': comindex==0}" style=" padding: .2rem .2rem 0;;">
                        <div class="mainTopA" >
                          <div>
                            <div style="float: left;">
                              <img :src="comment.staff.avatar" v-if="comment && comment.staff && comment.staff.avatar"
                                   style="border-radius: 50%;">
                              <img src="../../../assets/head.png" v-else>
                            </div>
                            <div style="margin-left: 50px;">
                              <div>{{comment && comment.staff && comment.staff.name}}</div>
                              <div class="text_ellipsis" style="width: 4.2rem;">
                              <span v-if="comment.staff.org.length>0"
                                    v-for="v in comment.staff.org">{{v.name}}&nbsp;</span>-
                                <span v-if="comment.staff.role.length>0" v-for="v in comment.staff.role">{{v.display_name}}&nbsp;</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="topTime" style="padding-right: 0rem;">
                          {{comment.create_time}}
                        </div>
                      </div>
                      <div class="article show_desc" style="line-height: 28px;margin-top: 5px;">
                        {{comment.content}}
                      </div>
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
        loading: false,
        searchValue: '',
        interModule: false,
        showHide: '',
        comments: '',
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
        showCommentIds: {},  //显示评论 和收起评论的显示
        scrollTop: 0,
        first: true,
        showDescIds: {},
        answerLoading: false,
        commentLoading: false,
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
      this.getListData();
      this.noPower = false;
      this.noData = false;
      $("#interMain").height(500);
      if (this.$route.query.question_id) {
        this.showAll(this.$route.query.question_id);
        setTimeout(() => {
          if (this.$route.query.answer_id) {
            this.commentNum(this.$route.query.answer_id);
            setTimeout(() => {
              if (this.$route.query.scrollTop) {
                $("#interMain").scrollTop(this.$route.query.scrollTop);
              }
            }, 1000);
          }
          if (this.$route.query.scrollTop) {
            $("#interMain").scrollTop(this.$route.query.scrollTop);
          }
        }, 1000);

      }

    },

    watch: {
      loading(val) {
        if (val) {
          this.noPower = false;
          this.noData = false;
        }
      },
    },
    methods: {
      showDesc(id, val) {
        if (val === 'show') {
          this.showDescIds[id] = false;
          $('#desc-'+id).addClass('show_desc').removeClass('second_line_camp');
        } else if (val === 'hide') {
          this.showDescIds[id] = true;
          $('#desc-'+id).removeClass('show_desc').addClass('second_line_camp');
        }
      },
      writeComment(ques_id, answer_id) {
        this.$router.push({
          path: '/writeComment',
          query: {ques_id: ques_id, answer_id: answer_id, scrollTop: $("#interMain").scrollTop()}
        });
      },
      writeAnswer(id) {
        this.$router.push({path: '/writeAnswer', query: {id: id, scrollTop: $("#interMain").scrollTop()}});
      },
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

                let create_time = Date.parse(new Date(item.create_time.split('-').join('/')));
                let now_time = Date.parse(new Date());
                let difference = (now_time - create_time) / 1000;
                if (difference * 1000 >= 0 && difference < 60) {
                  item.create_time = Math.floor(difference) + ' 秒前';
                } else if (difference >= 60 && difference < 3600) {
                  item.create_time = Math.floor(difference / 60) + ' 分钟前';
                } else if (difference >= 3600 && difference < 3600 * 24) {
                  item.create_time = Math.floor(difference / 3600) + ' 小时前';
                } else if (difference >= 3600 * 24 && difference < 3600 * 24 * 30) {
                  item.create_time = Math.floor(difference / 3600 / 24) + ' 天前';
                } else if (difference >= 3600 * 24 * 30 && difference < 3600 * 24 * 30 * 12) {
                  item.create_time = Math.floor(difference / 3600 / 24 / 30) + ' 个月前';
                } else if (difference >= 3600 * 24 * 30 * 12) {
                  item.create_time = Math.floor(difference / 3600 / 24 / 30 / 12) + ' 年前';
                }
                if (item.description) {
                  let arr = item.description.match(/[^\x00-\xff]/ig);
                  let length = item.description.length + (arr == null ? 0 : arr.length);
                  let count = (window.innerWidth-33)*2/7.5;
                  if (length >= count) {
                    if (this.showDescIds[item.id] == null || this.showDescIds[item.id] == undefined) {
                      this.$set(this.showDescIds, item.id, true);
                    }
                  }
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
        for (var v in this.showCommentIds) {
          this.showCommentIds[v] = false;
        }
        this.comments = '';
        this.disabledIds[id] = true;
        for (var v in this.disabledIds) {
          if (v != id) {
            this.disabledIds[v] = false;
          }
        }
        this.answerDetail = [];
        this.showHide = id;
        this.answerLoading = true;
        this.$http.get(globalConfig.server + 'qa/front/answer?question_id=' + id).then((res) => {
          this.answerLoading = false;
          if (res.data.code === '70310') {
            this.answerDetail = res.data.data;
            if (res.data.data.length > 0) {
              res.data.data.forEach((item) => {
                if (this.showCommentIds[item.id] == null || this.showCommentIds[item.id] == undefined) {
                  this.$set(this.showCommentIds, item.id, false);
                }
                let create_time = Date.parse(new Date(item.create_time.split('-').join('/')));
                let now_time = Date.parse(new Date());
                let difference = (now_time - create_time) / 1000;
                if (difference >= 0 && difference < 60) {
                  item.create_time = difference + ' 秒前';
                } else if (difference >= 60 && difference < 3600) {
                  item.create_time = Math.floor(difference / 60) + ' 分钟前';
                } else if (difference >= 3600 && difference < 3600 * 24) {
                  item.create_time = Math.floor(difference / 3600) + ' 小时前';
                } else if (difference >= 3600 * 24 && difference < 3600 * 24 * 30) {
                  item.create_time = Math.floor(difference / 3600 / 24) + ' 天前';
                } else if (difference >= 3600 * 24 * 30 && difference < 3600 * 24 * 30 * 12) {
                  item.create_time = Math.floor(difference / 3600 / 24 / 30) + ' 个月前';
                } else if (difference >= 3600 * 24 * 30 * 12) {
                  item.create_time = Math.floor(difference / 3600 / 24 / 30 / 12) + ' 年前';
                }
              });
            }
          } else {
            this.answerDetail = [];
            Toast.fail(res.data.msg);
          }
        });
      },
      commentNum(id) {
        this.showCommentIds[id] = true;
        for (var v in this.showCommentIds) {
          if (v != id) {
            this.showCommentIds[v] = false;
          }
        }
        this.commentDetail = [];
        this.comments = id;
        this.commentLoading = true;
        this.$http.get(globalConfig.server + 'qa/front/comment?answer_id=' + id).then((res) => {
          this.commentLoading = false;
          if (res.data.code === '70410') {
            this.commentDetail = res.data.data;
            if (res.data.data.length > 0) {
              res.data.data.forEach((item) => {
                let create_time = Date.parse(new Date(item.create_time.split('-').join('/')));
                let now_time = Date.parse(new Date());
                let difference = (now_time - create_time) / 1000;
                if (difference >= 0 && difference < 60) {
                  item.create_time = difference + ' 秒前';
                } else if (difference >= 60 && difference < 3600) {
                  item.create_time = Math.floor(difference / 60) + ' 分钟前';
                } else if (difference >= 3600 && difference < 3600 * 24) {
                  item.create_time = Math.floor(difference / 3600) + ' 小时前';
                } else if (difference >= 3600 * 24 && difference < 3600 * 24 * 30) {
                  item.create_time = Math.floor(difference / 3600 / 24) + ' 天前';
                } else if (difference >= 3600 * 24 * 30 && difference < 3600 * 24 * 30 * 12) {
                  item.create_time = Math.floor(difference / 3600 / 24 / 30) + ' 个月前';
                } else if (difference >= 3600 * 24 * 30 * 12) {
                  item.create_time = Math.floor(difference / 3600 / 24 / 30 / 12) + ' 年前';
                }
              });
            }
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

  .boxShadow2 {
    box-shadow: 0 -4px 16px 0 rgba(61, 90, 254, 0.10);
  }
  .second_line_camp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .show_desc{
    display: inline-block;
    height: initial;
    overflow: initial;
    text-overflow: initial;
    word-break: break-all;
  }
  #interLocution {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    $colorTitle: #212121;
    $colorLeft: #58D788;
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
    .padTop3{
      padding-top: 0.3rem!important;
    }
    .interMain {
      height: 500px;
      overflow-y: scroll;
      overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;
      .main1 {
        padding: .2rem 0 .2rem .4rem;
        background: #FFFFFF;
        box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.15);
        margin-bottom: .2rem;
      }
      #mainContent {
        margin-bottom: 100px;
      }
      .mainContent {
        margin-bottom: .2rem;
        .contents1 {
          border-top: $bottom;
          margin-bottom: 7px;
          padding-right: 0.25rem;
          p {
            color: $colorTitle;
            font-size: .30rem;
          }
          div {
            color: $colorP;
            line-height: .30rem;
          }
        }
        .contents2 {
          border-bottom: 1px solid #E0E0E0;
          margin-left: 70px;
          padding-right: 0.38rem;
          div {
            color: $colorTitle;
            line-height: .36rem;
          }

          .interFooter2 {
            @include flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: .1rem;
            padding-top: .2rem;
            margin-right: 0;
            padding-right: 0;
            height: 35px;
            .con {
              margin: .16rem 0 .15rem;
              width: 1.8rem;
              padding-bottom: .2rem;
              cursor: pointer;
              span {
                font-size: 15px;
                vertical-align: top;
              }
            }
            div:first-of-type {
              color: $colorLeft;
            }
            div:last-of-type {
              color: #FF4081;
            }

          }
        }
        .contents3 {
          .article {
            width: 84%;
            margin-left: 59px;
            padding-right: 0%;
            padding-bottom: .2rem;
            border-bottom: $bottom;
          }

        }
        .interFooter {
          @include flex;
          justify-content: space-between;
          align-items: center;
          border-top: $bottom;
          padding-right: .4rem;
          margin-top: .3rem;
          padding-top: .2rem;
          height: 35px;
          div {
            cursor: pointer;
            span {
              font-size: 15px;
              line-height: 24px;
            }
          }
          div:first-of-type {
            color: $colorLeft;
          }
          div:last-of-type {
            background: #536DFE;
            box-shadow: 0 4px 10px 0 rgba(83, 109, 254, 0.30);
            color: #FFFFFF;
            padding: 8px 8px 6px;
            border-radius: 50%;
            margin-top: -45px;
          }

        }
        .padNone {
          padding: 0;
        }
      }
      .main2 {
        .allContent {
          /*<!--box-shadow: 0 -4px 16px 0 rgba(61,90,254,0.15);-->*/
          .mainTop {
            padding: .2rem .4rem 0;
          }
          .man3 {
            margin: 0 .3rem;
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
      padding-top: .1rem;
      .mainTopA {
        div {
          //@include flex;
          /*justify-content: center;*/
          /*align-items: center;*/
          img {
            width: 40px;
            height: 40px;
          }
          .text_ellipsis {
            width: 4.5rem;
            height: 26px;
            margin-top: 3px;
            height: 26px;
            line-height: 26px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            span {
              font-size: 13px;
            }
          }
        }
      }
      .topTime {
        display: inline-block;
        padding-right: .3rem;
        width: 2rem;
        text-align: right;
        font-size: 13px;
        color: #aaaaaa;
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
  }
</style>
