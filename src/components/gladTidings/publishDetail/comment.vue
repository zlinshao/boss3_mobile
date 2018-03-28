<template>
  <div>
    <div id="commentOn">
      <div class="contents">
        <van-cell-group>
          <van-field
            v-model="form.remark"
            type="textarea"
            placeholder="说点什么吧！">
          </van-field>
        </van-cell-group>
      </div>
      <div class="pic">
        <div class="title">图片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData"></UpLoad>
      </div>
      <div class="footerComment">
        <div @click="manager()">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import {Toast} from 'vant';

  export default {
    name: "comment",
    components: {Toast, UpLoad},
    data() {
      return {
        urls: globalConfig.server_user,
        form: {
          remark: '',
          photo: [],
        },
        pitch: '',
        detail: '',
      }
    },
    mounted() {
      this.pitch = this.$route.query.ids;
      this.detail = this.$route.query.detail;
    },
    methods: {
      // 确认评论
      manager() {
        if (this.detail !== 'to_comment') {
          this.sure();
        } else {
          if (this.form.remark !== '' || this.form.photo.length !== 0) {
            this.sure();
          } else {
            Toast('请填写评论内容');
          }
        }
      },

      sure() {
        this.$http.put(this.urls + 'process/' + this.pitch, {
          operation: this.detail,
          comment: this.form.remark,
          album: this.form.photo
        }).then((res) => {
          if (res.data.status === 'success') {
            Toast.success(res.data.message);
            this.$router.push({path: '/publishDetail', query: {ids: this.pitch}});
          } else {
            Toast(res.data.message);
          }
        })
      },

      getImgData(val) {
        this.form.photo = val[1];
      },
    },
  }
</script>

<style lang="scss">
  #commentOn {

    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    @mixin border_radius($p) {
      -webkit-border-radius: $p;
      -moz-border-radius: $p;
      border-radius: $p;
    }

    $onColor: #39b1ff;
    $borColor: #9c9c9c;

    background: #f8f8f8;
    .contents, .pic {
      background: #ffffff;
    }
    .contents {
      margin-bottom: .2rem;
      .van-cell-group {
        .van-field--has-textarea {
          .van-field__control {
            min-height: 150px;
          }
        }
      }
    }
    .pic {
      padding: .1rem .2rem .3rem;
      background: #fff;
      width: 100%;
      .title {
        font-size: .36rem;
        padding: .26rem .4rem;
      }
    }
    .footerComment {
      border-top: 1px solid #ebebeb;
      position: fixed;
      background: #ffffff;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rem;
      z-index: 666;
      @include flex;
      justify-content: space-around;
      align-items: center;
      div {
        color: $onColor;
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        text-align: center;
      }
    }
  }
</style>
