<template>
  <div id="writeAnswer">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../../../assets/loding1.gif">
    </div>
    <div class="content" v-if="!loading">
      <div id="interMain" class="interMain">
        <div class="mainContent">
          <div class="main1 boxShadow">
            <div class="mainTop">
              <div class="mainTopA">
                <div v-if="!questionData.is_anonymous">
                  <div style="float: left;">
                    <img :src="questionData.asker.avatar"
                         v-if="questionData && questionData.asker && questionData.asker.avatar && !questionData.is_anonymous"
                         style="border-radius: 50%;">
                    <img src="../../../../assets/head.png" v-else>
                  </div>
                  <div style="margin-left: 50px;">
                    <div v-if="!questionData.is_anonymous">
                      <div>
                        <span>{{questionData && questionData.asker && questionData.asker.name}}</span>
                      </div>
                      <div class="text_ellipsis">
                          <span v-if="questionData && questionData.asker && questionData.asker.org.length>0"
                                v-for="v in questionData.asker.org" style="font-size: 13px;">{{v.name}}&nbsp;</span>-
                        <span v-if="questionData && questionData.asker && questionData.asker.role.length>0"
                              v-for="v in questionData.asker.role"
                              style="font-size: 13px;">{{v.display_name}}&nbsp;</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="questionData.is_anonymous"
                     style="display: flex;justify-content: center;align-items: center;">
                  <img src="../../../../assets/head.png">
                  <span style="width: 2.6rem;margin-left: 10px;">匿名</span>
                </div>
              </div>
              <div class="topTime">
                {{questionData.create_time}}
              </div>
            </div>
            <div class="contents1 ">
              <p style="margin: 10px 0 8px;line-height: 28px;font-size: 18px;">
                {{questionData.title}}</p>
              <div style="line-height: 26px;font-size: 15px;">
                {{questionData.description}}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style="height: 20px;width: 100%;"></div>
          <div class="textarea">
            <van-cell-group style="padding: 0 23px;">
              <van-field
                v-model="content"
                type="textarea"
                placeholder="请填写回答"
                icon="clear"
                @click-icon="content=''"
              >
              </van-field>
            </van-cell-group>
          </div>
          <div class="question_btn" @click="onSubmit">
            <span>提交回答</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='success'">
      <div class="box">
        <img src="../../../../assets/confirm_success.png" alt="" style="width: 100%;">
        <div class="naire_words">您已成功提交回答</div>
        <div style="position: absolute;text-align: center;width: 100%;top: 78%;">
          <div @click="goInterlocution" class="btn">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Dialog} from 'vant';
  import {Popup} from 'vant';
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {Dialog, Popup, Toast},
    data() {
      return {
        confirmType: '',
        questionData: {},  //问题详情
        content: '',
        loading: true,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('/interlocution', 'house');
        vm.ddRent('/interlocution', 'house');
      });
    },
    activated() {
      this.confirmType = '';
      this.content = '';
      this.loading = true;
      this.getData();
    },
    watch: {},
    methods: {
      goInterlocution() {
        this.$router.push({path: '/interlocution', query: {question_id: this.$route.query.id, scrollTop: this.$route.query.scrollTop }});
      },
      getData() {
        this.$http.get(globalConfig.server + 'qa/front/question/' + this.$route.query.id).then((res) => {
          this.loading = false;
          if (res.data.code === '70210') {
            this.questionData = res.data.data;
            let create_time = Date.parse(new Date(this.questionData.create_time.split('-').join('/')));
            let now_time = Date.parse(new Date());
            let difference = (now_time - create_time) / 1000;
            if (difference >= 0 && difference < 60) {
              this.questionData.create_time = difference + ' 秒前';
            } else if (difference >= 60 && difference < 3600) {
              this.questionData.create_time = Math.floor(difference / 60) + ' 分钟前';
            } else if (difference >= 3600 && difference < 3600 * 24) {
              this.questionData.create_time = Math.floor(difference / 3600) + ' 小时前';
            } else if (difference >= 3600 * 24 && difference < 3600 * 24 * 30) {
              this.questionData.create_time = Math.floor(difference / 3600 / 24) + ' 天前';
            } else if (difference >= 3600 * 24 * 30 && difference < 3600 * 24 * 30 * 12) {
              this.questionData.create_time = Math.floor(difference / 3600 / 24 / 30) + ' 个月前';
            } else if (difference >= 3600 * 24 * 30 * 12) {
              this.questionData.create_time = Math.floor(difference / 3600 / 24 / 30 / 12) + ' 年前';
            }
          } else {
            this.questionData = {};
          }
        });
      },
      onSubmit() {
        Dialog.confirm({
          title: '提交回答',
          message: '确认提交回答吗'
        }).then(() => {
          this.$http.post(globalConfig.server + 'qa/front/answer', {
            content: this.content,
            question_id: this.$route.query.id
          }).then((res) => {
            if (res.data.code === '70310') {
              this.confirmType = 'success';
            } else {
              Toast.fail(res.data.msg);
            }
          });
        }).catch(() => {

        });
      },
    },
  }
</script>

<style lang="scss">
  .question_btn {
    position: relative;
    width: 100%;
    background: #FFFFFF;
    text-align: center;
    font-size: 20px;
    span {
      margin-top: 30px;
      color: #FFFFFF;
      display: inline-block;
      background: #536DFE;
      width: 90%;
      height: 50px;
      line-height: 50px;
      box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.40);
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
  }

  .van-hairline--bottom::after, .van-hairline--left::after,
  .van-hairline--right::after,
  .van-hairline--surround::after,
  .van-hairline--top-bottom::after,
  .van-hairline--top::after,
  .van-hairline::after {
    border: none;
  }

  .textarea {
    border-radius: 4px;
    text-align: center;
    margin-bottom: .2rem;
    background: #ffffff;
    .van-cell.van-hairline.van-field {
      .van-cell__value {
        padding-left: 0;
      }
    }
    .van-cell-group {
      padding-left: 0;
      .van-field--has-textarea {
        background: #F8F9FF;
        color: #6c6c6c;
        .van-field__control {
          margin-left: .2rem;
          background: #F8F9FF;
          min-height: 120px;
          font-size: 16px;
        }
      }
    }
  }

  #writeAnswer {
    height: 100%;
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
    .content {
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.15);
      margin-top: 10px;
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
        height: 100%;
        .main1 {
          padding: .2rem 0 0.2rem .4rem;
          background: #FFFFFF;

        }
        .mainContent {
          margin-bottom: 0rem;
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
            /*<!--@include flex;-->*/
            /*<!--justify-content: center;-->*/
            /*<!--align-items: center;-->*/
            img {
              width: 40px;
              height: 40px;
              /*margin-right: .2rem;*/
            }
            .text_ellipsis {
              margin-top: 3px;
              width: 3rem;
              height: 26px;
              line-height: 26px;
              white-space: nowrap;
              /*overflow: hidden;*/
              /*text-overflow: ellipsis;*/
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
    }
    .mask {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 99;

      .box {
        position: fixed;
        width: 70%;
        background: #fff;
        top: 20%;
        height: 50%;
        margin-left: 15%;
        border-radius: 8px;
        p {
          font-size: 18px;
          line-height: 30px;
        }
        .naire_words {
          position: absolute;
          width: 100%;
          text-align: center;
          font-size: 18px;
          color: #101010;
          top: 68%;
        }
        .btn {
          border: 1px solid #dddddd;
          display: inline-block;
          padding: 10px 20px;
          border-radius: 8px;
        }
      }
    }

  }
</style>
