<template>
  <div id="propseQuestion">
    <div class="content">
      <div class="content_box">
        <van-cell-group>
          <van-field
            @click="selectShow"
            v-model="form.type_name"
            label="问题类型"
            icon="clear"
            placeholder="请选择类型"
            required
            readonly
            @click-icon="form.type_name=form.type='';"
          />
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="form.title"
            label="问题标题"
            type="textarea"
            icon="clear"
            placeholder="请输入标题"
            @click-icon="form.title=''"
            required
          />
          <span
            style="font-family: PingFangHK-Light;font-size: 13px;color: #58D788;margin-left: 113px">描述精确的问题更容易得到答案</span>
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="form.description"
            label="问题描述"
            type="textarea"
            icon="clear"
            placeholder="请输入描述"
            rows="3"
            @click-icon="form.description=''"
            required
          />

        </van-cell-group>
        <van-cell-group>
          <div class="checks">
            <div style="min-width: 110px;margin-left: -7px">匿名提交</div>
            <van-radio-group v-model="is_anonymous" @change="anonymousChange">
              <van-radio name="1">是</van-radio>
              <van-radio name="0">否</van-radio>
            </van-radio-group>
          </div>
        </van-cell-group>
      </div>
      <div class="question_btn" @click="onSubmit">
        <span>提交问题</span>
      </div>
    </div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>
    <div class="mask" v-show="confirmType==='success'">
      <div class="box">
        <img src="../../../../assets/confirm_success.png" alt="" style="width: 100%;">
        <div class="naire_words">您已成功提交问题</div>
        <div style="position: absolute;text-align: center;width: 100%;top: 75%;">
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
        urls: globalConfig.server,
        radio: '',
        paperData: {},
        questionType: {},       //题型
        question_set: {},       //试题
        answer: {},             //答案
        message: '',
        questionnaire_id: '',
        confirmType: '',
        is_anonymous: '0',
        form: {
          title: '',
          description: '',
          is_anonymous: false,
          type: '',
          limit: 4,
          page: 1,
          type_name: '',
        },
        selectHide: false,
        columns: [],                        //select值
        typeCategory: [],
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('/interlocution', 'house');
        vm.ddRent('/interlocution', 'house');
      })
    },
    activated() {
      this.confirmType = '';
      this.$http.get(globalConfig.server + 'qa/question_type?do_not_paginate=true').then((res) => {
        if (res.data.code === '70410') {
          this.typeCategory = res.data.data;
        }
      });
      this.form.title = '';
      this.form.description = '';
      this.is_anonymous = '0';
      this.form.is_anonymous = false;
      this.form.type = '';
      this.form.type_name = '';
    },
    watch: {},
    methods: {
      goInterlocution() {
        this.$router.push({path: '/interlocution'});

      },
      anonymousChange(val) {
        this.form.is_anonymous = val === '0' ? false : true;
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
      },
      onConfirm(value, index) {
        this.form.type_name = value;
        this.form.type = this.typeCategory[index].id;
        this.selectHide = false;
      },
      selectShow() {
        this.columns = [];
        this.typeCategory.forEach((item) => {
          this.columns.push(item.name);
        });
        if (this.columns.length < 1) {
          Toast.fail('当前没有问题类型');
        } else {
          this.selectHide = true;
        }

      },
      onSubmit() {
        Dialog.confirm({
          title: '提交问题',
          message: '确认提交问题吗'
        }).then(() => {
          this.$http.post(globalConfig.server + 'qa/front/question', this.form).then((res) => {
            if (res.data.code === '70210') {
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

<style lang="scss" scoped>
  .question_btn {
    position: fixed;
    bottom: 0;
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

  .van-cell-group {
    border-bottom: 1px solid #e0e0e0;
    padding: 10px;
  }

  #propseQuestion {
    .content {
      background: #FFFFFF;
      box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.15);
      margin-top: 10px;
      .content_box {
        padding: 10px 20px;
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
          top: 65%;
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
