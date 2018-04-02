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
      <div class="footer">
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
        picStatus: true,
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
        vm.routerIndex(from.path);
        vm.ddRent(from.path);
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
        alert(this.form.photo.length);
        alert(this.form.remark);
        if (this.form.remark !== '' || this.form.photo.length !== 0) {
          this.sure();
        } else {
          Toast('请填写评论内容');
        }
      },

      sure() {
        if (this.picStatus) {
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
              this.close_();
              $('.imgItem').remove();
            } else {
              Toast(res.data.msg);
            }
          })
        } else {
          Toast('图片上传中...');
        }
      },

      getImgData(val) {
        this.picStatus = !val[2];
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

    .contents, .pic {
      background: #ffffff;
    }
    .van-cell.van-hairline.van-field {
      .van-cell__value {
        padding-left: 0;
      }
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
  }
</style>
