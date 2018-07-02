<template>
  <div>
    <div id="articleComment">
      <div style="background: #fafafe;height: 10px;width: 100%;"></div>
      <div class="contents">
        <van-cell-group >
          <van-field
            v-model="form.remark"
            type="textarea"
            placeholder="说点什么吧！">
          </van-field>
        </van-cell-group>
      </div>
      <div style="background: #fafafe;height: 10px;width: 100%;"></div>
      <div class="pic">
        <div class="title">图片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData" :isClear="isClear" style="margin-left: -13px;"></UpLoad>
      </div>
      <div class="footer">
        <div @click="manager()">发布评论</div>
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
        haveInHand: true,
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
        vm.ddBack(1, from.path);
        vm.ddBack(2, from.path);
      })
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
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.$http.post(this.urls + 'oa/portal/comment', {
              content: this.form.remark,
              obj_id: this.pitch,
              parent_id: 0,
              image_pic: this.form.photo,
              video_file: [],
            }).then((res) => {
              this.haveInHand = true;
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
            Toast('正在提交...');
          }
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

      ddBack(val, urls) {
        let that = this;
        if (val === 1) {
          dd.biz.navigation.setLeft({
            control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
            onSuccess: function (result) {
              that.$router.push({path: urls, query: {id: that.pitch}});
            },
            onFail: function (err) {
            }
          });
        } else {
          document.addEventListener('backbutton', function (e) {
            e.preventDefault();
            that.$router.push({path: urls, query: {id: that.pitch}});
          });
        }
      }
    },
  }
</script>

<style lang="scss">
  #articleComment {
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
      /*margin-bottom: .2rem;*/
      .van-cell-group {
        .van-field--has-textarea {
          .van-field__control {
            min-height: 150px;
            background: #fafafe;
            padding: 10px;
            border-radius: 4px;
          }
        }
      }
    }
    .pic {
      padding: .1rem 10px .3rem ;
      background: #fff;
      width: 100%;
      .title {
        font-size: 18px;
        padding: .3rem 0;
        padding-left: 8px;
        padding-bottom: 0;
        color: #9e9e9e;
      }
    }
    .footer {
      box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.25);
      color: #409EFF;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: #FFFFFF;
      z-index: 999;
    }
  }
</style>
