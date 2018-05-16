<template>
  <div id="questionnaire">
    <div class="questionnaireTitle">
      <div>发货的客服都十来得舒服咯得舒服咯发货的客服都十分看好德萨克来得舒服咯</div>
      <img src="../../../assets/backgroundPic.png" alt="">
    </div>
    <div class="exercise">
      <div class="subject">
        <p>1. <span class="onClass">多选{{result}}不定项选择</span></p>
        <div class="subjectTitle">
          <div class="subjectA">符合当时咖啡的撒很快发到空间十分好看的萨芬和可是大后方开始反馈收到啦</div>
          <div class="subjectB">
            <van-checkbox-group v-model="result">
              <van-checkbox
                v-for="(item, index) in list"
                :key="item.id"
                :name="item.id">
                <span :class="{'onClass': result.indexOf(item.id) > -1}">{{item.id}}{{item.A}}</span>
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </div>
      <div class="subject">
        <p>1. <span class="onClass">单选{{radio}}判断</span></p>
        <div class="subjectTitle">
          <div class="subjectA">符合当时咖啡的撒很快发到空间十分好看的萨芬和可是大后方开始反馈收到啦</div>
          <div class="subjectB">
            <van-radio-group
              v-model="radio"
              :key="item.id"
              v-for="(item, index) in list">
              <van-radio :name="item.id">
                <span :class="{'onClass': result.indexOf(item.id) > -1}">{{item.id}}{{item.A}}</span>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
      <div class="subject">
        <p>1. <span class="onClass">简答</span></p>
        <div class="subjectTitle">
          <div class="subjectA">符合当时咖啡的撒很快发到空间十分好看的萨芬和可是大后方开始反馈收到啦</div>
          <div class="contents">
            <van-cell-group>
              <van-field
                v-model="form.contents"
                type="textarea"
                placeholder="请简答"
                icon="clear"
                @click-icon="form.contents = ''"
                required>
              </van-field>
            </van-cell-group>
          </div>
        </div>
      </div>
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
        result: ['A'],
        radio: 'A',
      }
    },
    mounted() {
      this.dictionary(152, 1).then((res) => {
        console.log(res.data);
      });
      this.$http.get(this.urls + 'questionnaire/3').then((res) => {

      })
    },
    watch: {},
    methods: {},
  }
</script>

<style lang="scss">
  #questionnaire {
    img {
      width: 100%;
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
    .exercise {
      background-color: #FFFFFF;
      margin-top: 3.2rem;
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
