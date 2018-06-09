<template>
  <div id="exam">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../../../assets/loding1.gif">
    </div>
    <div v-if="!loading">
      <div class="examTitle" v-if="!message">
        <div class="key" style="height: 50px;border-bottom: 1px solid #ebebeb;">场次名称<span
          class="value">{{examData.name}}</span></div>
        <div style="position: absolute;top: 85px;width: 90%;margin-left: 5%;margin-right: 5%;">
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
                <div style="position: absolute;top: 60px;right: 5px;font-size: 10px;color: #6c6c6c;">
                  总分：{{examData.score}}分
                </div>
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
              <div v-if="answerData && resultData">
                <div style="line-height: 22px;font-size: 14px;">
                  <span style="color:#fc83b6;margin-right: 10px;font-size: 14px;">正确答案：
                    <span v-if="answerData[key1.id]">{{answerData[key1.id]}}</span>
                    <span style="font-size: 14px;" v-else>暂无</span>
                  </span> |
                  <span style="color:#409EFF;margin-left: 10px;font-size: 14px;">本题得分：
                    <span v-if="resultData.objective_detail && resultData.objective_detail[key1.id]" style="font-size: 14px;">{{resultData.objective_detail[key1.id]}}</span>
                    <span v-else-if="resultData.subjective_detail && resultData.subjective_detail[key1.id]" style="font-size: 14px;">{{resultData.subjective_detail[key1.id]}}</span>
                    <span style="font-size: 14px;" v-else>暂无</span>
                  </span>
                </div>
                <van-row gutter="20" style="margin-top: 10px;margin-bottom: 10px;">
                  <div v-for="(val,ind) in key1.choice" style="margin: 10px 0;">
                    <van-col span="18">
                      <div v-if="ind == (resultData.answer && resultData.answer[key1.id])" style="color: #409EFF;line-height: 28px;margin: 5px 0;">
                        {{ind}}：{{val}}
                      </div>
                      <div style="color: #6c6c6c;line-height: 28px;margin: 5px 0;" v-else>{{ind}}：{{val}}</div>
                    </van-col>
                    <van-col span="4">
                      <div style="color:rgb(88, 215, 136);line-height: 28px;margin: 5px 0;"
                           v-if="(resultData.answer && resultData.answer[key1.id]) == answerData[key1.id] && (resultData.answer && resultData.answer[key1.id])==ind">
                        正确
                      </div>
                      <div style="color:#fc83b6;line-height: 28px;margin: 5px 0;"
                           v-if="(resultData.answer && resultData.answer[key1.id]) != answerData[key1.id] && answerData[key1.id] && (resultData.answer && resultData.answer[key1.id])==ind">
                        错误
                      </div>
                    </van-col>
                  </div>
                </van-row>
              </div>
            </div>
            <div class="subjectTitle" v-if="(index==154 || index==155) && questionData[index].length>0">
              <div v-if="answerData && resultData">
                <div style="line-height: 22px;font-size: 14px;">
                  <span style="color:#fc83b6;margin-right: 10px;font-size: 14px;">正确答案：
                    <span v-if="answerData[key1.id] && answerData[key1.id].length>0" v-for="aa in answerData[key1.id]">{{aa}} </span>
                    <span style="font-size: 14px;" v-if="!(answerData[key1.id] && answerData[key1.id].length>0)">暂无</span>
                  </span> |
                  <span style="color:#409EFF;margin-left: 10px;font-size: 14px;">本题得分：
                    <span v-if="resultData.objective_detail && resultData.objective_detail[key1.id]">{{resultData.objective_detail[key1.id]}}</span>
                    <span v-else-if="resultData.subjective_detail && resultData.subjective_detail[key1.id]">{{resultData.subjective_detail[key1.id]}}</span>
                    <span style="font-size: 14px;" v-else>暂无</span>
                  </span>
                </div>
                <van-row gutter="20" style="margin-top: 10px;margin-bottom: 10px;">
                  <div v-for="(val,ind) in key1.choice">
                    <van-col span="18" style="line-height:24px;">
                      <div
                        v-if="resultData.answer && resultData.answer[key1.id] && resultData.answer[key1.id].indexOf(ind)>-1"
                        style="color: #409EFF;line-height: 28px;margin: 5px 0;">{{ind}}：{{val}}
                      </div>
                      <div style="color: #6c6c6c;line-height: 28px;margin: 5px 0;" v-else>{{ind}}：{{val}}</div>
                    </van-col>
                    <van-col span="4">
                      <div style="color:rgb(88, 215, 136);line-height: 28px;margin: 5px 0;"
                           v-for="ans in (resultData.answer && resultData.answer[key1.id])"
                           v-if="answerData && answerData[key1.id] && answerData[key1.id].indexOf(ans)>-1 && ans==ind ">正确
                      </div>
                      <div style="color:#fc83b6;line-height: 28px;margin: 5px 0;" v-for="ans in (resultData.answer && resultData.answer[key1.id])"
                           v-if="answerData && answerData[key1.id] && answerData[key1.id].indexOf(ans)<0 && ans==ind ">错误
                      </div>
                    </van-col>
                  </div>
                </van-row>
              </div>
            </div>
            <div class="subjectTitle" v-if="index==157 && questionData[index].length>0">
              <div v-if="answerData && resultData">
                <div style="margin-top: 10px;">
                  <span style="color:#fc83b6;line-height:24px;font-size: 14px;">正确答案：
                    <span style="font-size: 14px;" v-if="answerData[key1.id] && answerData[key1.id].length>0" v-for="aa in answerData[key1.id]">{{aa}} &nbsp;&nbsp;&nbsp;</span>
                    <span style="font-size: 14px;" v-else>{{aa}} &nbsp;&nbsp;&nbsp;</span>
                  </span> |
                  <span style="color:#409EFF;margin-left: 10px;line-height:24px;font-size: 14px;">本题得分：
                    <span v-if="resultData.objective_detail && resultData.objective_detail[key1.id]">{{resultData.objective_detail[key1.id]}}</span>
                    <span v-else-if="resultData.subjective_detail && resultData.subjective_detail[key1.id]">{{resultData.subjective_detail[key1.id]}}</span>
                    <span style="font-size: 14px;" v-else>暂无</span>
                  </span>
                </div>
                <van-row gutter="20" style="margin-top: 10px;margin-bottom: 10px;">
                  <div>
                    <van-col span="18" style="line-height:26px;">
                      <div v-if="resultData.answer && resultData.answer[key1.id]"
                           v-for="(value,ak) in (resultData.answer && resultData.answer[key1.id])"
                           style="color: #9c9c9c;line-height:26px;">
                        第{{ak+1}}处答案：<span style="color: #409EFF;">{{value}}</span>
                      </div>
                    </van-col>
                    <van-col span="4">
                      <div style="color:rgb(88, 215, 136);"
                           v-for="(vv, kk) in (resultData.answer && resultData.answer[key1.id])"
                           v-if="answerData && answerData[key1.id] && answerData[key1.id].indexOf(vv)>-1 && kk==ak ">正确
                      </div>
                      <div style="color:#fc83b6;" v-for="(vv, kk) in (resultData.answer && resultData.answer[key1.id])"
                           v-if="answerData && answerData[key1.id] && answerData[key1.id].indexOf(vv)<0 && kk==ak">错误
                      </div>
                    </van-col>
                  </div>
                </van-row>
              </div>
            </div>
            <div class="subjectTitle" v-if="index==158 && questionData[index].length>0">
              <div v-if="resultData">
                <div style="line-height: 22px;font-size: 13px;">
                <span style="color:#409EFF;font-size: 14px;line-height: 25px;">本题得分：
                  <span v-if="resultData.objective_detail && resultData.objective_detail[key1.id]"> {{resultData.objective_detail[key1.id]}}</span>
                  <span v-else-if="resultData.subjective_detail && resultData.subjective_detail[key1.id]"> {{resultData.subjective_detail[key1.id]}}</span>
                  <span v-else > 暂无</span>
                </span>
                </div>
                <van-row gutter="20" style="margin-top: 10px;margin-bottom: 10px;">
                  <van-col span="22" style="line-height:24px;color: #9c9c9c;">
                    我的答案：
                    <span style="color: #409EFF;line-height: 25px;">
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
        <div class="no_data">
          <div class="content" style="text-align: center;background: #fff;">
            <div class="content_img"><img src="../../../../assets/no_data2.png" style="width: 40%;"></div>
            <div class="last_title">暂无数据 ...</div>
          </div>
        </div>
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
        loading: false,
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
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex(from.path, 'house');
        vm.ddRent(from.path, 'house');
      })
    },
    activated() {
      this.resultId = this.$route.query.result_id;
      this.examId = this.$route.query.exam_id;
      this.myData(this.examId, this.resultId);
    },
    watch: {},
    methods: {
      myData(a, b) {
        this.loading = true;
        this.$http.get(globalConfig.server + 'exam/' + a + '?see=answer').then((res) => {
          this.loading = false;
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
          this.loading = false;
          if (res.data.code === '36000') {
            this.resultData = res.data.data;
          } else {
            this.resultData = {};
            this.examData.score = 0;
          }
        });
      },
    },
  }
</script>

<style lang="scss">
  .no_data {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    top: 0;
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
    }
  }
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
        height: 75px;
        border-radius: 5px;
        color: #9c9c9c;
        .import_left {
          width: 90%;
          height: 25px;
          line-height: 25px;
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
