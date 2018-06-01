<template>
  <div id="questionnaire">
    <div class="questionnaireTitle">
      <div style="position: absolute;top: 80px;">{{paperData.name}}<span style="margin-left: 20px;">{{paperData.question_count}}</span>题</div>
      <img src="../../../assets/backgroundPic.png" alt="">
    </div>
    <div class="exercise" v-if="!message">
      <div v-for="(key,index) in question_set">
        <div class="subject" v-if="index != 157" v-for="(key1,index1) in key" :class="{'borderTop':key1.number==1}">
          <!--<p>{{key1.number}}. <span class="onClass">{{questionType[index]}}</span></p>-->
          <van-row>
            <van-col span="2" style="float: left">
              <p style="display: inline-block;width: 30px;">{{key1.number}}.</p>
            </van-col>
            <van-col span="18" style="float: initial;display: inline-block;">
              <p v-html="key1.stem"></p>
            </van-col>
            <van-col span="3" style="float: right;margin-top: -5px;">
              <p style="width: 45px;font-size: 12px;color: #aaaaaa;line-height: 20px;">{{questionType[index]}}</p>
            </van-col>
          </van-row>
          <div class="subjectTitle">
            <div class="subjectB" v-if="index === '153' || index === '156'">
              <van-radio-group v-model="answer[key1.id]">
                <van-radio v-for="(key2,index2) in key1.choice" :key="index2" :name="index2">
                  <span :class="{'onClass': answer[key1.id] === index2}">{{index2}} :&nbsp;&nbsp;{{key2}}</span>
                </van-radio>
              </van-radio-group>
            </div>
            <div class="subjectB" v-if="index === '154' || index === '155'">
              <van-checkbox-group v-model="answer[key1.id]">
                <van-checkbox
                  v-for="(key3,index3) in key1.choice" :key="index3" :name="index3">
                  <span :class="{'onClass': answer[key1.id].indexOf(index3)>-1}">{{index3}} :&nbsp;&nbsp;{{key3}}</span>
                </van-checkbox>
              </van-checkbox-group>
            </div>
            <div class="contents" v-if="index === '158'"
                 style="margin-top: 10px;border-radius: 8px;width: 96%;border: none;">
              <van-cell-group>
                <van-field
                  v-model="answer[key1.id]"
                  type="textarea"
                  placeholder="请简答"
                  icon="clear"
                  @click-icon="answer[key1.id]='' ">
                </van-field>
              </van-cell-group>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 15px;">
        <van-button size="normal"  style="width: 90%;margin-left:3%;background: #39baff;margin-bottom: 20px;color: #fff;" @click="onSubmit">提交问卷</van-button>
      </div>
    </div>
    <div class="exercise msg" v-if="message">
      <div>
        <img src="../../../assets/no_data.png" style="width: 40%;">
        <div style="margin-top: 10px;">暂无数据</div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='success'">
      <div class="box" >
        <img src="../../../assets/confirm_success.png" alt="">
        <div class="naire_words">您已成功提交问卷</div>
        <div style="position: absolute;text-align: center;width: 100%;top: 75%;">
          <div @click="goIndex" class="btn">确定</div>
        </div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='failed'">
      <div class="box">
        <img src="../../../assets/confirm_fail.png" alt="">
        <div class="naire_words">提交问卷失败 请<span style="color: #ff259a;" @click="onSubmit"> 重试</span></div>
        <div style="position: absolute;text-align: center;width: 100%;top: 75%;">
          <div @click="goIndex" class="btn">确定</div>
        </div>
      </div>
    </div>
    <div class="mask" v-show="confirmType==='repeat'">
      <div class="box" style="text-align: center;height: 230px;">
        <div style="margin-top: 80px;">
          <p>您已完成本次问卷</p>
          <p style="color: #ff259a;">请勿重复提交</p>
          <div style="position: absolute;text-align: center;width: 100%;top: 75%;">
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
        urls: globalConfig.server,
        radio: '',
        paperData: {},
        questionType: {},       //题型
        question_set: {},       //试题
        answer: {},             //答案
        message: '',
        questionnaire_id: '',
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

    },
    activated() {
      this.answer = {};
      this.confirmType = '';
      this.questionnaire_id = this.$route.query.id;
      this.getPaperData();
    },
    watch: {},
    methods: {
      goIndex() {
        this.confirmType = '';
        this.questionnaire_id = '';
        this.$router.push({path: '/index', query:{refresh: 'refresh'}});
        if (navigator.userAgent == 'app/ApartMent') {
          android.goHome();
        }
      },
      getPaperData(){
        this.$http.get(this.urls + 'questionnaire/' + this.questionnaire_id).then((res) => {
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
        });
      },
      onSubmit() {
        Dialog.confirm({
          title: '提交问卷',
          message: '确认提交问卷吗'
        }).then(() => {
          this.$http.post(globalConfig.server + 'exam/result', {
            exam_id: this.questionnaire_id,
            answer: this.answer,
            is_questionnaire: true
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
          top: 65%;
        }
        .btn{
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
      margin-top: 10px;
    }
    .exercise {
      /*width: 96%;*/
      /*margin: 10px auto;*/
      /*box-shadow: 0 0 5px 0 #aaaaaa;*/
      /*border-radius: 8px;*/
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
            margin-top: 20px;
            .van-radio {
              .van-radio__input {
                margin-top: 3px;
              }
              .van-radio__label {
                line-height: 28px;
              }
            }
            .van-checkbox{
              .van-checkbox__input {
                margin-top: 4px;
              }
              .van-checkbox__label {
                line-height: 28px;
              }
            }
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
            color: #6c6c6c;
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
