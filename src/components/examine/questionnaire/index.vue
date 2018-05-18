<template>
  <div id="questionnaire">
    <div class="questionnaireTitle">
      <div>{{paper_name}}</div>
      <img src="../../../assets/backgroundPic.png" alt="">
    </div>
    <div class="exercise" v-if="!message">
      <div v-for="(key,index) in question_set">
        <div class="subject" v-for="(key1,index1) in key">
          <p>{{key1.number}}. <span class="onClass">{{questionType[index]}}</span></p>
          <div class="subjectTitle">
            <div class="subjectA" v-html="key1.stem"></div>
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
            <div class="contents" v-if="index === '158'">
              <van-cell-group>
                <van-field
                  v-model="answer[key1.id]"
                  type="textarea"
                  placeholder="请简答"
                  icon="clear"
                  @click-icon="answer[key1.id]"
                  required>
                </van-field>
              </van-cell-group>
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
  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        form: {
          contents: '',
        },
        list: [
          {
            A: '发的很快就',
            id: 'A',
          }, {
            A: '范德萨发生',
            id: 'B',
          }, {
            A: '广泛大概的',
            id: 'C',
          }, {
            A: '和换个话题',
            id: 'D',
          }
        ],

        radio: '',
        result: [],
        paper_name: '',         //问卷标题
        questionType: {},       //题型
        question_set: {},       //试题
        answer: {},             //答案

        message: '',
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
      this.$http.get(this.urls + 'questionnaire/14').then((res) => {
        if (res.data.code === '30000') {
          this.question_set = res.data.data.question_set;
          this.paper_name = res.data.data.paper_name;
        } else {
          this.message = res.data.msg;
        }
      })
    },
    watch: {},
    methods: {
      onResult(id) {
        this.answer[id] = this.result;
      },
    },
  }
</script>

<style lang="scss">
  #questionnaire {
    img {
      width: 100%;
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
        .subjectTitle {
          margin-left: .33rem;
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
