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
                <p style="margin: 10px 0 8px;line-height: 28px;font-size: 18px;">{{item.title}}</p>
                <div style="line-height: 26px;font-size: 15px;">
                  {{item.description}}
                </div>
              </div>
              <div class="interFooter">
                <div>
                  <span v-if="item.answers_count>0 && !disabledIds[item.id]" @click="showAll(item.id)">显示回答 ({{item.answers_count}})</span>
                  <span v-if="item.answers_count>0 && disabledIds[item.id]"
                        @click="answerDetail=[];disabledIds[item.id]=false">收起回答 ({{item.answers_count}})</span>
                </div>
                <div @click="writeAnswer(item.id)">
                  <van-icon name="chat" style="font-size: 18px;"/>
                </div>
              </div>
            </div>
            <div class="main2" >
              <!--:class="{'boxShadow2': comStatus}"-->
              <div v-for="(value,key) in answerDetail" class="allContent boxShadow2" v-if="showHide === item.id && showStatus">
                <div class="mainTop topNone" >
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
                            <span v-if="value.staff.role.length>0" v-for="v in value.staff.role">{{v.display_name}}&nbsp;</span>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div class="topTime">
                    {{value.create_time}}
                  </div>
                </div>
                <div class="boxShadow">
                  <div class="contents2">
                    <div style="line-height: 28px;margin-top: 5px;">
                      {{value.content}}
                    </div>
                    <div class="interFooter2">
                      <div class="con" @click="commentNum(value.id)" v-if="value.comments_count>0">
                        <span>显示评论 ({{value.comments_count}})</span>
                      </div>
                      <div class="con" v-if="value.comments_count<1">
                        <span>显示评论 ({{value.comments_count}})</span>
                      </div>
                      <div class="con" @click="writeComment(item.id, value.id)">
                        <i class="iconfont icon-pinglun"></i><span> 发表评论</span>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="boxShadow man3">
                  <div class="contents3" v-for="comment in commentDetail" v-if="comments === value.id && comStatus">
                    <div class="mainTop padNone">
                      <div class="mainTopA">
                        <div>
                          <div style="float: left;">
                            <img :src="comment.staff.avatar" v-if="comment && comment.staff && comment.staff.avatar"
                                 style="border-radius: 50%;">
                            <img src="../../../assets/head.png" v-else>
                          </div>
                          <div style="margin-left: 50px;">
                            <div>{{comment && comment.staff && comment.staff.name}}</div>
                            <div class="text_ellipsis">
                              <span v-if="comment.staff.org.length>0" v-for="v in comment.staff.org">{{v.name}}&nbsp;</span>-
                              <span v-if="comment.staff.role.length>0" v-for="v in comment.staff.role">{{v.display_name}}&nbsp;</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="topTime">
                        {{comment.create_time}}
                      </div>
                    </div>
                    <div class="article" style="line-height: 28px;margin-top: 5px;">
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
      writeComment(ques_id, answer_id) {
        this.$router.push({path: '/writeComment', query: {ques_id: ques_id, answer_id: answer_id}});
      },
      writeAnswer(id) {
        this.$router.push({path: '/writeAnswer', query: {id: id}});
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
            if (res.data.data.length > 0) {
              res.data.data.forEach((item) => {
                // if (this.disabledIds[item.id] == null || this.disabledIds[item.id] == undefined) {
                //   this.$set(this.disabledIds, item.id, false);
                // }
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
        if (this.comments === id) {
          this.comStatus = !this.comStatus;
        } else {
          this.comStatus = true;
          this.comments = id;
        }
        this.$http.get(globalConfig.server + 'qa/front/comment?answer_id=' + id).then((res) => {
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

  .boxShadow2{
    box-shadow: 0 -4px 16px 0 rgba(61,90,254,0.15);
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
            line-height: .36rem;
          }
        }
        .contents2 {
          border-bottom: 1px solid #E0E0E0;
          margin-left: 1.1rem;
          padding-right: 0.36rem;
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
              margin: .16rem 0 0;
              width: 1.6rem;
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
            margin: 0 .2rem 0 1.1rem;
            padding-bottom: .2rem;
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
        padding: 0rem 0 0;
        .allContent {
          /*<!--box-shadow: 0 -4px 16px 0 rgba(61,90,254,0.15);-->*/
          .mainTop {
            padding: .2rem .2rem 0;
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
            margin-top: 3px;
            width: 3rem;
            height: 26px;
            line-height: 26px;
            white-space: nowrap;
            span{
              font-size: 13px;
            }
          }
        }
      }
      .topTime {
        display: inline-block;
        padding-right: .3rem;
        width: 1.5rem;
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
