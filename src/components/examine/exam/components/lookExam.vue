<template>
  <div id="exam">
    <div class="examTitle" v-if="!message">
      <div class="key" style="height: 50px;border-bottom: 1px solid #ebebeb;">场次名称<span
        class="value">{{examData.name}}</span></div>
      <div style="position: absolute;top: 80px;width: 90%;margin-left: 5%;margin-right: 5%;">
        <van-row gutter="15">
          <van-col span="8">
            <div class="import_questions" style="border: 1px solid #39b1ff;">
              <div class="import_left"><span style="float:left; font-size:12px;">总时长</span><i
                style="float:right; color:#58d788;font-size:16px;" class="iconfont icon-shijian1"></i></div>
              <div style="font-size: 12px;"><span style="font-size:30px; color:#58d788;">{{ examData.duration }}</span>分钟
              </div>
            </div>
          </van-col>
          <van-col span="8">
            <div class="import_questions" style="border: 1px solid #fdca41;">
              <div class="import_left"><span style="float:left; font-size:12px;">总题数</span><i
                style="float:right; color:#fdca41;font-size:16px;" class="iconfont icon-shujutu"></i></div>
              <div style="font-size: 12px;"><span
                style="font-size:30px; color:#fdca41">{{examData.question_count}}</span>题
              </div>
            </div>
          </van-col>
          <van-col span="8">
            <div class="import_questions" style="border: 1px solid #fb4699;">
              <div class="import_left"><span style="float:left; font-size:12px;">考生成绩</span><i
                style="float:right; color:#fb4699;font-size:16px;" class="iconfont icon-chengjiguanli"></i></div>
              <div><span style="font-size:30px; color:#fb4699">{{resultData.score}}</span>分</div>
              <div style="position: absolute;top: 70px;right: 5px;font-size: 10px;color: #6c6c6c;">总分：{{examData.score}}分</div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="exercise" v-if="!message">
      <div v-for="(key,index) in questionData">
        <div class="subject" v-for="(key1,index1) in key" :class="{'borderTop':key1.number==1}">
          <van-row>
            <van-col span="2" style="float: left">
              <p style="display: inline-block;width: 30px;margin-top: 5px;">{{key1.number}}.</p>
            </van-col>
            <van-col span="18" style="float: initial;display: inline-block;">
              <p v-html="key1.stem" style="line-height: 28px;"></p>
            </van-col>
            <van-col span="3" style="float: right;">
              <p style="width: 42px;font-size: 12px;color: #aaaaaa;line-height: 20px;">{{questionType[index]}}
                <span style="display: block;font-size: 12px;text-align: center;width: 42px;">{{key1.score}}分</span>
              </p>
            </van-col>
          </van-row>
          <div class="subjectTitle" v-if="(index==153 || index==156) && questionData[index].length>0">
            <div v-if="answerData && answerData[key1.id] && resultData">
              <div style="line-height: 22px;font-size: 13px;">
                <span style="color:#fc83b6;margin-right: 10px;">正确答案： {{answerData[key1.id]}}</span> |
                <span style="color:#409EFF;margin-left: 10px;">本题得分： <span v-if="resultData.objective_detail">{{resultData.objective_detail[key1.id]}}</span><span
                  v-else>暂无</span></span>
              </div>
              <van-row gutter="20" style="margin-top: 10px;">
                <div v-for="(val,ind) in key1.choice">
                  <van-col span="18" style="line-height:24px;">
                    <div v-if="ind == (resultData.answer && resultData.answer[key1.id])" style="color: #409EFF;">
                      {{ind}}：{{val}}
                    </div>
                    <div v-else>{{ind}}：{{val}}</div>
                  </van-col>
                  <van-col span="4">
                    <div style="color:rgb(88, 215, 136);"
                         v-if="(resultData.answer && resultData.answer[key1.id]) == answerData[key1.id] && (resultData.answer && resultData.answer[key1.id])==ind">
                      正确
                    </div>
                    <div style="color:#fc83b6;"
                         v-if="(resultData.answer && resultData.answer[key1.id]) != answerData[key1.id] && (resultData.answer && resultData.answer[key1.id])==ind">
                      错误
                    </div>
                  </van-col>
                </div>
              </van-row>
            </div>
          </div>
          <div class="subjectTitle" v-if="(index==154 || index==155) && questionData[index].length>0">
            <div v-if="answerData && answerData[key1.id] && resultData">
              <div style="line-height: 22px;font-size: 13px;">
                <span style="color:#fc83b6;margin-right: 10px;">正确答案： {{answerData[key1.id]}}</span> |
                <span style="color:#409EFF;margin-left: 10px;">本题得分： <span v-if="resultData.objective_detail">{{resultData.objective_detail[key1.id]}}</span><span
                  v-else>暂无</span></span>
              </div>
              <van-row gutter="20" style="margin-top: 10px;">
                <div v-for="(val,ind) in key1.choice">
                  <van-col span="18" style="line-height:24px;">
                    <div
                      v-if="resultData.answer && resultData.answer[key1.id] && resultData.answer[key1.id].indexOf(ind)>-1"
                      style="color: #409EFF;">{{ind}}：{{val}}
                    </div>
                    <div v-else>{{ind}}：{{val}}</div>
                  </van-col>
                  <van-col span="4">
                    <div style="color:rgb(88, 215, 136);"
                         v-for="ans in (resultData.answer && resultData.answer[key1.id])"
                         v-if="answerData[key1.id].indexOf(ans)>-1 && ans==ind ">正确
                    </div>
                    <div style="color:#fc83b6;" v-for="ans in (resultData.answer && resultData.answer[key1.id])"
                         v-if="answerData[key1.id].indexOf(ans)<0 && ans==ind ">错误
                    </div>
                  </van-col>
                </div>
              </van-row>
            </div>
          </div>
          <div class="subjectTitle" v-if="index==157 && questionData[index].length>0">
            <div v-if="answerData && answerData[key1.id] && resultData">
              <div style="line-height: 22px;font-size: 13px;">
                <span style="color:#fc83b6;margin-right: 10px;">正确答案： {{answerData[key1.id]}}</span> |
                <span style="color:#409EFF;margin-left: 10px;">本题得分： <span v-if="resultData.objective_detail">{{resultData.objective_detail[key1.id]}}</span><span
                  v-else>暂无</span></span>
              </div>
              <van-row gutter="20" style="margin-top: 10px;">
                <div>
                  <van-col span="18" style="line-height:24px;">
                    <div v-if="resultData.answer && resultData.answer[key1.id]"
                         v-for="(value,ak) in (resultData.answer && resultData.answer[key1.id])"
                         style="color: #9c9c9c;">
                      第{{ak+1}}处答案：<span style="color: #409EFF;">{{value}}</span>
                    </div>
                  </van-col>
                  <van-col span="4">
                    <div style="color:rgb(88, 215, 136);"
                         v-for="(vv, kk) in (resultData.answer && resultData.answer[key1.id])"
                         v-if="answerData[key1.id].indexOf(vv)>-1 && kk==ak ">正确
                    </div>
                    <div style="color:#fc83b6;" v-for="(vv, kk) in (resultData.answer && resultData.answer[key1.id])"
                         v-if="answerData[key1.id].indexOf(vv)<0 && kk==ak">错误
                    </div>
                  </van-col>
                </div>
              </van-row>
            </div>
          </div>
          <div class="subjectTitle" v-if="index==158 && questionData[index].length>0">
            <div v-if="resultData">
              <div style="line-height: 22px;font-size: 13px;">
                <span style="color:#409EFF;">本题得分： <span v-if="resultData.objective_detail && resultData.objective_detail[key1.id] != null">{{resultData.objective_detail[key1.id]}}</span><span
                  v-else>暂无</span></span>
              </div>
              <van-row gutter="20" style="margin-top: 10px;">
                <van-col span="22" style="line-height:24px;color: #9c9c9c;">
                  我的答案：
                  <span style="color: #409EFF;">
                    {{resultData && resultData.answer && resultData.answer[key1.id]}}
                  </span>
                </van-col>
              </van-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="exercise msg" v-if="message">
      <div>
        <img src="../../../../assets/no_data.png" style="width: 40%;">
        <div style="margin-top: 10px;">暂无数据</div>
      </div>
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
        message: '',
        resultId: '',
        examId: '',
        examData: {},
        questionData: {},
        resultData: {},
        answerData: {},
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
    },
    activated() {
      this.resultId = this.$route.query.result_id;
      this.examId = this.$route.query.exam_id;
      this.myData(this.examId, this.resultId);
    },
    watch: {},
    methods: {
      myData(a, b) {
        this.$http.get(globalConfig.server + 'exam/' + a + '?see=answer').then((res) => {
          if (res.data.code === '30000') {
            this.message = '';
            this.examData = res.data.data;
            this.questionData = res.data.data.question_set;
            this.answerData = res.data.data.reference_set;
          } else {
            this.examData = {};
            this.questionData = {};
            this.message = res.data.msg;
          }
        });
        this.$http.get(globalConfig.server + 'exam/result/' + b).then((res) => {
          if (res.data.code === '36000') {
            this.resultData = res.data.data;
          } else {
            this.resultData = {};
          }
        });
      },
    },
  }
</script>

<style lang="scss">
  #exam {
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
    .examTitle {
      margin-top: 20px;
      background: #fff;
      height: 3rem;
      .key {
        padding: 15px 0px;
        margin-bottom: 10px;
        line-height: .4rem;
        position: absolute;
        left: 20px;
        color: #9c9c9c;
        font-size: 14px;
        width: 90%;
        .value {
          margin-left: 10px;
          color: #6c6c6c;
          font-size: 16px;
        }
      }
      .import_questions {
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 80px;
        border-radius: 5px;
        .import_left {
          width: 90%;
          height: 36px;
          line-height: 36px;
          margin: 0 auto;
        }
      }
    }
    .msg {
      text-align: center;
      color: #949494;
      margin-top: 10px;
    }
    .exercise {
      margin-top: 20px;
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
