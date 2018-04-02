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
        urls: globalConfig.server_user,
        form: {
          remark: '',
          photo: [],
        },
        pitch: {},
        detail: '',
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
      this.pitch = JSON.parse(this.$route.query.data);
      this.detail = this.$route.query.detail;
    },
    activated() {
      this.pitch = JSON.parse(this.$route.query.data);
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
        if (this.picStatus) {
          this.$http.put(this.urls + 'process/' + this.pitch.ids, {
            operation: this.detail,
            comment: this.form.remark,
            album: this.form.photo
          }).then((res) => {
            if (res.data.status === 'success') {
              Toast.success(res.data.message);
              this.$router.replace({path: this.path, query: {data: JSON.stringify(this.pitch)}});
              this.close_();
              $('.imgItem').remove();
            } else {
              Toast(res.data.message);
            }
          })
        } else {
          Toast('图片上传中...');
        }
      },

      getImgData(val) {
        alert(!val[2]);
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
      text-align: center;
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
