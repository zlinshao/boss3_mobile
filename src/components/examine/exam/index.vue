<template>
  <div id="exam">
    <div class="examTitle">
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
              <div class="import_left"><span style="float:left; font-size:12px;">倒计时</span><i
                style="float:right; color:#fb4699;font-size:16px;" class="iconfont icon-chengjiguanli"></i></div>
              <div><span style="font-size:25px; color:#fb4699">{{timeString}}</span></div>
              <div style="position: absolute;top: 58px;right: 5px;font-size: 10px;color: #6c6c6c;">
                总分：{{examData.score}}分
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="exercise" v-if="!message">
      <div v-for="(key,index) in question_set">
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
          <div class="subjectTitle">
            <div class="subjectB" v-if="index === '153' || index === '156'">
              <van-radio-group v-model="answer[key1.id]">
                <van-radio v-for="(key2,index2) in key1.choice" :key="index2" :name="index2">
                  <span :class="{'onClass': answer[key1.id] === index2}">{{index2}} : &nbsp;&nbsp;{{key2}}</span>
                </van-radio>
              </van-radio-group>
            </div>
            <div class="subjectB" v-if="index === '154' || index === '155'">
              <van-checkbox-group v-model="answer[key1.id]">
                <van-checkbox
                  v-for="(key3,index3) in key1.choice" :key="index3" :name="index3">
                  <span
                    :class="{'onClass': answer[key1.id].indexOf(index3)>-1}">{{index3}} : &nbsp;&nbsp;{{key3}}</span>
                </van-checkbox>
              </van-checkbox-group>
            </div>
            <div class="content" v-if="index ==='157'" style="margin-bottom: 0px;">
              <van-cell-group>
                <div v-for="(item,kk) in key1.answer_count">
                  <van-field
                    v-model="answer[key1.id][kk]"
                    :placeholder="`请填写第 ${kk+1} 处答案`"
                    icon="clear"
                    @click-icon="clearBlankAnswer(key1.id, kk)"
                  >
                  </van-field>
                </div>
              </van-cell-group>
            </div>
            <div class="content" v-if="index === '158'"
                 style="margin-top: 10px;border-radius: 8px;border: none;width: 96%;">
              <van-cell-group>
                <van-field
                  v-model="answer[key1.id]"
                  type="textarea"
                  placeholder="请简答"
                  icon="clear"
                  @click-icon="answer[key1.id]='' "
                >
                </van-field>
              </van-cell-group>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 15px;">
        <van-button size="normal" style="width: 90%;margin-left:3%;background: #39baff;margin-bottom: 20px;color: #fff;"
                    @click="onSubmit">提交试卷
        </van-button>
      </div>
    </div>
    <div class="exercise msg" v-if="message">
      <div>
        <img src="../../../assets/no_data.png" style="width: 40%;">
        <div style="margin-top: 10px;">暂无数据</div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='success'">
      <div class="box">
        <img src="../../../assets/confirm_success.png" alt="">
        <div class="exam_words">您已成功提交考试</div>
        <div style="position: absolute;text-align: center;width: 100%;top: 70%;">
          <div @click="goIndex" class="btn">确定</div>
        </div>
        <div class="force" v-show="showForceWords">考试时间已到，系统已为您自动提交考试</div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='failed'">
      <div class="box">
        <img src="../../../assets/confirm_fail.png" alt="">
        <div class="exam_words">提交考试失败 请<span style="color: #ff259a;font-size: 18px;" @click="onSubmit">重试</span></div>
        <div style="position: absolute;text-align: center;width: 100%;top: 70%;">
          <div @click="goIndex" class="btn">确定</div>
        </div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='repeat'">
      <div class="box" style="text-align: center;height: 200px;">
        <div style="margin-top: 65px;">
          <p>您已完成本次考试</p>
          <p style="color: #ff259a;">请勿重复提交</p>
          <div style="position: absolute;text-align: center;width: 100%;top: 70%;">
            <div @click="goIndex" class="btn">确定</div>
          </div>
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
        examData: {},
        questionType: {},       //题型
        question_set: {},       //试题
        answer: {},             //答案
        message: '',
        examId: '',
        countDown: '',
        confirmType: '',
        timeString: '',
        timeClear: '',
        timeOut: '',
        showForceWords: false,
      }
    },
    activated() {
      this.examId = this.$route.query.id;
      this.clockSubmit();
      let that = this;
      this.timeOut = setTimeout(() => {
        clearTimeout(that.timeClear);
        this.clockSubmit();
      }, 1000 * 60);
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let that = vm;
        clearTimeout(that.timeOut);
        clearTimeout(that.timeClear);
      })
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
    watch: {
      countDown(num) {
        let that = this;
        clearTimeout(that.timeClear);
        this.clock(num + 2);
      },
      examId(val) {
        if (val) {
          this.getExamData();
        }
      }
    },
    methods: {
      getExamData() {
        this.$http.get(globalConfig.server + 'exam/' + this.examId).then((res) => {
          if (res.data.code === '30000') {
            this.question_set = res.data.data.question_set;
            this.examData = res.data.data;
            this.combinaData();
          } else {
            this.message = res.data.msg;
          }
        });
      },
      goIndex() {
        this.$router.push({path: '/index', query: {refresh: 'refresh'}});
        if (navigator.userAgent == 'app/ApartMent') {
          android.goHome();
        }

      },
      combinaData() {
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
        if (this.question_set[157] && this.question_set[157].length > 0) {
          this.question_set[157].forEach((item) => {
            this.$set(this.answer, item.id, []);
          });
        }
      },
      clock(n) {
        let val = Number(n);
        if (val <= 0) {
          this.onForceSubmit('force');
          clearTimeout(this.timeOut);
          clearTimeout(this.timeClear);
          return;
        }
        let h = Number(Math.floor(val / 3600));
        let m = 0, s = 0;
        if ((val - h * 3600) >= 0) {
          m = Number(Math.floor((val - h * 3600) / 60));
          if ((val - h * 3600 - m * 60) >= 0) {
            s = Number(Math.floor(val - h * 3600 - m * 60));
          }
        }
        if (h < 10) {
          h = '0' + h;
        }
        if (m < 10) {
          m = '0' + m;
        }
        if (s < 10) {
          s = '0' + s;
        }
        this.timeString = h + ':' + m + ':' + s;
        val--;
        this.timeClear = setTimeout(() => {
          this.clock(val);
        }, 1000);
      },
      clearBlankAnswer(id, k) {
        this.answer[id][k] = '';
        this.$set(this.answer[id], k, '');
      },
      onSubmit() {
        Dialog.confirm({
          title: '提交考试',
          message: '确认提交考试吗'
        }).then(() => {
          this.onForceSubmit();
        }).catch(() => {

        });
      },
      onForceSubmit(val) {
        if (val === 'force') {
          this.showForceWords = true;
        }
        this.$http.post(globalConfig.server + 'exam/result', {
          exam_id: this.examId,
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
      },
      //计时器轮询check_in提交
      clockSubmit() {
        if (this.examId) {
          this.$http.get(globalConfig.server + 'exam/poll/' + this.examId).then((res) => {
            if (res.data.code === '30000') {
              this.onForceSubmit('force');
            } else {
              let time = res.data.msg.split(',');
              this.countDown = time[1] - time[0];
            }
          });
        }
      },
    },
  }
</script>

<style lang="scss">
  #exam {
    img {
      width: 100%;
    }
    .border_col {
      /*border: 1px solid #39b1ff;*/
      /*height: 100px;*/
    }

    .boxHeight {
      height: 200px !important;
    }
    .count_down {
      position: relative !important;
      width: initial !important;
      top: 100px;
      float: right;
      margin-right: 40px;
    }
    .force {
      position: absolute;
      text-align: center;
      font-size: 14px;
      top: 86%;
      left: 13%;
      color: #aaaaaa;
      width: 75%;
      line-height: 18px;
    }
    .van-cell:not(:last-child)::after {
      border: none;
    }
    .van-hairline--bottom::after, .van-hairline--left::after,
    .van-hairline--right::after,
    .van-hairline--surround::after,
    .van-hairline--top-bottom::after,
    .van-hairline--top::after,
    .van-hairline::after {
      border: none;
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
        .exam_words {
          position: absolute;
          text-align: center;
          font-size: 18px;
          color: #101010;
          width: 100%;
          top: 60%;
        }
        .btn {
          border: 1px solid #dddddd;
          display: inline-block;
          padding: 10px 20px;
          border-radius: 8px;
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
      /*width: 96%;*/
      /*margin: 10px auto;*/
      /*box-shadow: 0 0 5px 0 #aaaaaa;*/
      /*border-radius: 8px;*/
      margin-top: 20px;
      background-color: #FFFFFF;
      padding: .2rem;
      .subject {
        border-top: 1px solid #ebebeb;
        padding-top: 15px;
        padding-bottom: 5px;
        .subjectTitle {
          margin-left: .5rem;
          color: #6c6c6c;
          line-height: 25px;
          .subjectB {
            .van-radio {
              .van-radio__input {
                margin-top: 3px;
              }
              .van-radio__label {
                line-height: 25px;
              }
            }
            .van-checkbox {
              height: 25px !important;
              .van-checkbox__input {
                margin-top: 4px;
              }
              .van-checkbox__label {
                line-height: 25px;
              }
            }
          }
        }
      }
      .content {
        text-align: center;
        margin-bottom: .2rem;
        .van-cell.van-hairline.van-field {
          .van-cell__value {
            padding-left: 0;
          }
        }
        ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
          color: #dddee0;
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #dddee0;
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #dddee0;
        }
        :-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: #dddee0;
        }
        .van-cell-group {
          padding-left: 0;
          .van-cell__value {
            background: #F3F9FF;
            border-radius: 5px;
            input {
              background: #F3F9FF;
              padding: 10px 15px;
              color: #6c6c6c;
            }
            .van-field__icon {
              color: #999;
              margin-right: 15px !important;
            }
          }
          .van-field--has-textarea {
            background: #F3F9FF;
            border-radius: 5px;
            color: #6c6c6c;
            .van-field__control {
              margin-left: .2rem;
              background: #F3F9FF;
              min-height: 100px;
            }
            .van-field__icon {
              margin-right: 0 !important;
            }
          }
        }
      }
    }
  }
</style>
