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
        <UpLoad :ID="'photo'" @getImg="getImgData" :isClear="isClear"></UpLoad>
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
        isClear: false,
        urls: globalConfig.server,
        form: {
          remark: '',
          photo: [],
        },
        pitch: '',
        path: '',
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
      })
    },
    mounted() {
      this.close_();
      this.pitch = this.$route.query.data;
    },
    activated() {
      this.close_();
      this.pitch = this.$route.query.data;
    },
    methods: {
      // 确认评论
      manager() {
        if (this.form.remark !== '' || this.form.photo.length !== 0) {
          this.sure();
        } else {
          Toast('请填写评论内容');
        }
      },

      sure() {
        this.$http.post(this.urls + 'oa/portal/comment', {
          content: this.form.remark,
          obj_id: this.pitch,
          parent_id: 0,
          image_pic: this.form.photo,
          video_file: [],
        }).then((res) => {
          if (res.data.code === '80060') {
            Toast.success(res.data.msg);
            this.$router.replace({path: this.path, query: {id: this.pitch}});
          } else {
            Toast(res.data.msg);
          }
        })
      },

      getImgData(val) {
        this.form.photo = val[1];
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.form.remark = '';
        this.form.photo = [];
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
