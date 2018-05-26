<template>
  <div id="questionnaire">
    <div class="questionnaireTitle">
      <div style="position: absolute;top: 80px;">{{paperData.name}}<span style="margin-left: 20px;">{{paperData.question_count}}</span>题
      </div>
      <img src="../../../../assets/backgroundPic.png" alt="">
    </div>
    <div class="exercise" v-if="!message">
      <div v-for="(key,index) in question_set">
        <div class="subject" v-for="(key1,index1) in key" :class="{'borderTop':key1.number==1}">
          <!--<p>{{key1.number}}. <span class="onClass">{{questionType[index]}}</span></p>-->
          <van-row>
            <van-col span="2" style="float: left">
              <p style="display: inline-block;width: 30px;">{{key1.number}}.</p>
            </van-col>
            <van-col span="18" style="float: initial;display: inline-block;">
              <p v-html="key1.stem"></p>
            </van-col>
            <van-col span="3" style="float: right;">
              <p style="width: 45px;font-size: 12px;color: #aaaaaa;line-height: 20px;">{{questionType[index]}}</p>
            </van-col>
          </van-row>
          <div class="subjectTitle">
            <!--<div class="subjectA" v-html="key1.stem"></div>-->
            <div class="subjectB" v-if="index != 157 && index !=158">
              <p v-for="(key2,index2) in key1.choice" :key="index2" :name="index2" style="margin-left: 7px;">
                <span  style="line-height: 25px;font-size: 16px;">{{index2}}&nbsp;&nbsp;{{key2}}</span>
                <van-row :key="kk" v-for="(vv,kk) in (statisticData[key1.id] && statisticData[key1.id].answer)"
                         v-if="kk==index2">
                  <div style="text-align: center;color: #9c9c9c;">回复量：<span style="color: #6c6c6c;">{{vv}}</span></div>
                  <Progress style="width: 90%;margin:10px 0;" color="#39b1ff" :percentage="Math.round(vv*100/statisticData[key1.id].count)" :pivot-text="`${Math.round(vv*100/statisticData[key1.id].count)}%`"/>
                </van-row>

                <van-row style="color: #fb4699;padding: 8px 0;font-size: 14px;"
                         v-if="!(statisticData[key1.id] && statisticData[key1.id].answer)">
                  暂无统计数据...
                </van-row>
              </p>
            </div>
            <div class="subjectB" v-if="index == 158">
              <p style="margin-left: 7px;">
                <span  style="line-height: 25px;font-size: 16px;color: #39b1ff;" @click="openAll(key1.id)">查看全部回答</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="exercise msg" v-if="message">
      {{message}}
    </div>
  </div>
</template>

<script>
  import {Progress} from 'vant';

  export default {
    name: "index",
    components: {Progress},
    data() {
      return {
        urls: globalConfig.server,
        radio: '',
        paperData: {},
        questionType: {},       //题型
        question_set: {},       //试题
        answer: {},             //答案
        message: '',
        exam_id: this.$route.query.id,
        confirmType: '',
        statisticData: {},
      }
    },
    mounted() {
      this.dictionary(152, 1).then((res) => {
        let sub = {};
        for (let i = 0; i < res.data.length; i++) {
          sub[res.data[i].id] = res.data[i].dictionary_name;
        }
        this.questionType = sub;
      });
      this.$http.get(this.urls + 'questionnaire/' + this.exam_id).then((res) => {
        if (res.data.code === '30000') {
          this.question_set = res.data.data.question_set;
          this.paperData = res.data.data;

          if (this.question_set[154] && this.question_set[154].length > 0) {
            this.question_set[154].forEach((item) => {
              this.$set(this.answer, item.id, []);
            });
          }
          if (this.question_set[155] && this.question_set[155].length > 0) {
            this.question_set[155].forEach((item) => {
              this.$set(this.answer, item.id, []);
            });
          }
        } else {
          this.message = res.data.msg;
        }
      })
    },
    activated() {
      // this.confirmType = this.$route.query.type;
      this.getStatisticData();
    },
    watch: {},
    methods: {
      openAll(id){
        this.$router.push({path: '/answerAll', query: {id: this.questionnaire_id, ques_id: id}});
      },
      getStatisticData() {
        this.$http.get(globalConfig.server + 'questionnaire/statistic/' + this.questionnaire_id).then((res) => {
          if (res.data.code === '30000') {
            this.statisticData = res.data.data;
          } else {
            this.statisticData = [];
            this.message = res.data.msg;
          }
        });
      },
    },
  }
</script>

<style lang="scss">
  #questionnaire {
    img {
      width: 100%;
    }
    .borderTop {
      border-top: none !important;
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
        top: 25%;
        margin-left: 15%;
        border-radius: 8px;
        p {
          font-size: 18px;
          line-height: 30px;
        }
        .words {
          position: absolute;
          text-align: center;
          font-size: 18px;
          color: #101010;
          top: 70%;
          left: 23%;
        }
      }
    }
    .van-radio, .van-checkbox.van-checkbox--round {
      display: flex;
      display: -webkit-flex;
      .van-checkbox__input, .van-radio__input {
        min-width: 20px;
      }
    }

    $onColor: #409EFF;
    .onClass {
      color: #409EFF;
    }
    .questionnaireTitle {
      height: 3rem;
      overflow: hidden;
      div {
        padding: .3rem;
        line-height: .4rem;
        color: #FFFFFF;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    .msg {
      text-align: center;
      color: #949494;
    }
    .exercise {
      /*width: 96%;*/
      /*margin: 10px auto;*/
      /*box-shadow: 0 0 5px 0 #aaaaaa;*/
      /*border-radius: 8px;*/
      background-color: #FFFFFF;
      padding: .2rem;
      padding-bottom: 50px;
      .subject {
        border-top: 1px solid #dfe6fb;
        padding-top: 15px;
        padding-bottom: 5px;
        .subjectTitle {
          margin-left: .5rem;
          .subjectA {
            line-height: .4rem;
            margin: .2rem 0;
          }
        }
      }
      .contents {
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
            background: #F3F9FF;
            .van-field__control {
              margin-left: .2rem;
              background: #F3F9FF;
              min-height: 100px;
            }
          }
        }
      }
    }
  }
</style>
