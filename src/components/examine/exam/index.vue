<template>
  <div id="questionnaire">
    <div class="questionnaireTitle">
      <div style="color: #393939;position: absolute;top: 60px;font-size: 18px;">{{paper_name}}</div>
      <img src="../../../assets/shenp2.jpg" alt="">
    </div>
    <div class="exercise" v-if="!message">
      <div v-for="(key,index) in question_set">
        <div class="subject" v-for="(key1,index1) in key">
          <!--<p>{{key1.number}}. <span class="onClass">{{questionType[index]}}</span></p>-->
          <van-row>
            <val-col span="2" style="float: left">
              <p style="display: inline-block;width: 30px;">{{key1.number}}.</p>
            </val-col>
            <van-col span="18" style="float: initial;display: inline-block;">
              <p v-html="key1.stem"></p>
            </van-col>
            <van-col span="3" style="float: right;">
              <p style="width: 45px;font-size: 12px;color: #aaaaaa;line-height: 20px;">{{questionType[index]}}</p>
            </van-col>
          </van-row>
          <div class="subjectTitle">
            <!--<div class="subjectA" v-html="key1.stem"></div>-->
            <div class="subjectB" v-if="index === '153' || index === '156'">
              <van-radio-group v-model="answer[key1.id]">
                <van-radio v-for="(key2,index2) in key1.choice" :key="index2" :name="index2">
                  <span :class="{'onClass': answer[key1.id] === index2}">{{index2}}&nbsp;&nbsp;{{key2}}</span>
                </van-radio>
              </van-radio-group>
            </div>
            <div class="subjectB" v-if="index === '154' || index === '155'">
              <van-checkbox-group v-model="result" @change="onResult(key1.id)">
                <van-checkbox
                  v-for="(key2,index2) in key1.choice" :key="index2" :name="index2">
                  <span :class="{'onClass': result === index2}">{{index2}}&nbsp;&nbsp;{{key2}}</span>
                </van-checkbox>
              </van-checkbox-group>
            </div>
            <div class="contents" v-if="index ==='157'">
              <van-cell-group>
                <div v-for="(item,kk) in key1.answer_count" style="">
                  <van-field
                    v-model="answer[key1.id][kk]"
                    :placeholder="`请填写第 ${kk+1} 处答案`"
                    icon="clear"
                    @click-icon="clearBlankAnswer(key1.id, kk)"
                    autosize
                    required>
                  </van-field>
                </div>
              </van-cell-group>
            </div>
            <div class="contents" v-if="index === '158'">
              <van-cell-group>
                <van-field
                  v-model="answer[key1.id]"
                  type="textarea"
                  placeholder="请简答"
                  icon="clear"
                  @click-icon="answer[key1.id]='' "
                  required>
                </van-field>
              </van-cell-group>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 15px;">
        <van-button type="primary" size="normal" style="padding: 0px 20px;" @click="onSubmit">提交</van-button>
      </div>
    </div>
    <div class="exercise msg" v-if="message">
      {{message}}
    </div>
    <div class="mask" v-show="confirmType==='success'">
      <div class="box">
        <img src="../../../assets/confirm_success.png" alt="">
        <div class="words">您已成功提交考试</div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='failed'">
      <div class="box">
        <img src="../../../assets/confirm_fail.png" alt="">
        <div class="words">提交考试失败 请<span style="color: #ff259a;font-size: 18px;" @click="onSubmit">重试</span></div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='repeat'">
      <div class="box" style="text-align: center;height: 200px;">
        <div style="margin-top: 80px;">
          <p >您已完成本次考试</p>
          <p style="color: #ff259a;">请勿重复提交</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Dialog} from 'vant';

  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        radio: '',
        result: [],
        paper_name: '',         //问卷标题
        questionType: {},       //题型
        question_set: {},       //试题
        answer: {},             //答案
        message: '',
        exam_id: '29',
        confirmType: '',
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
      this.$http.get(this.urls + 'exam/' + this.exam_id).then((res) => {
        if (res.data.code === '30000') {
          this.question_set = res.data.data.question_set;
          this.paper_name = res.data.data.name;
          if (this.question_set[157] && this.question_set[157].length > 0) {
            this.question_set[157].forEach((item) => {
              this.$set(this.answer, item.id, []);
            });
          }
        } else {
          this.message = res.data.msg;
        }
      });

    },
    watch: {},
    methods: {
      clearBlankAnswer(id, k) {
        this.answer[id][k] = '';
        this.$set(this.answer[id], k, '');
      },
      onResult(id) {
        this.answer[id] = this.result;
      },
      onSubmit() {
        Dialog.confirm({
          title: '提交考试',
          message: '确认提交考试吗'
        }).then(() => {
          this.$http.post(globalConfig.server + 'exam/result', {
            exam_id: this.exam_id,
            answer: this.answer,
          }).then((res) => {
            if (res.data.code === '36010') {
              this.confirmType = 'success';
            } else if (res.data.code === '36012') {
              this.confirmType = 'repeat';
            } else {
              this.confirmType = 'failed';
            }
          });
        }).catch(() => {

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
        p{
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
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 66;
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
      margin-top: 3.2rem;
      background-color: #FFFFFF;
      padding: .2rem;
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
          .van-cell__value input {
            background: #F3F9FF;
            padding: 10px;
          }
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
