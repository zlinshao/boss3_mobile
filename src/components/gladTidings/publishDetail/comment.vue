<template>
  <div>
    <div id="commentOn">
      <!--<header v-if="marking === 1">-->
      <!--<div class="address">-->
      <!--{{this.address}}-->
      <!--</div>-->
      <!--<div>-->
      <!--<p>{{status[forms.house_grade - 1]}}</p>-->
      <!--</div>-->
      <!--<div>-->
      <!--<p>卫生状况：</p>-->
      <!--<p v-for="key in 5" @click="forms.house_grade1 = onClick(key)">-->
      <!--<i v-if="key > forms.house_grade1" class="iconfont icon-favorite"></i>-->
      <!--<i v-if="key <= forms.house_grade1" class="iconfont icon-favoritesfilling"></i>-->
      <!--</p>-->
      <!--</div>-->
      <!--<van-cell-group>-->
      <!--<van-switch-cell v-model="houseStatus1" title="家电是否齐全"/>-->
      <!--<van-switch-cell v-model="houseStatus2" title="卫生是否干净"/>-->
      <!--</van-cell-group>-->
      <!--<div class="marking">-->
      <!--<div>-->
      <!--<p>{{status[forms.house_grade - 1]}}</p>-->
      <!--</div>-->
      <!--<div>-->
      <!--<p>卫生状况：</p>-->
      <!--<p v-for="key in 5" @click="forms.house_grade1 = onClick(key)">-->
      <!--<i v-if="key > forms.house_grade1" class="iconfont icon-favorite"></i>-->
      <!--<i v-if="key <= forms.house_grade1" class="iconfont icon-favoritesfilling"></i>-->
      <!--</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--<van-cell-group>-->
      <!--<van-field-->
      <!--@click="selectShow(1)"-->
      <!--v-model="decorationOn"-->
      <!--label="装修"-->
      <!--type="text"-->
      <!--readonly-->
      <!--placeholder="请选择装修">-->
      <!--</van-field>-->
      <!--<van-field-->
      <!--@click="selectShow(2)"-->
      <!--v-model="propertyOn"-->
      <!--type="text"-->
      <!--readonly-->
      <!--label="房屋特色"-->
      <!--placeholder="请选择房屋特色">-->
      <!--</van-field>-->
      <!--<van-field-->
      <!--v-model="forms.suggest_price"-->
      <!--label="价格"-->
      <!--type="number"-->
      <!--placeholder="请填写金额">-->
      <!--</van-field>-->
      <!--</van-cell-group>-->
      <!--<div class="footer">-->
      <!--<div @click="mark()">确认</div>-->
      <!--</div>-->
      <!--</header>-->

      <div>
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
        <div v-if="marking === 1">
          <van-cell-group>
            <van-switch-cell v-model="is_electric_status" title="家电是否齐全"/>
            <van-switch-cell v-model="is_clean_status" title="卫生是否干净"/>
          </van-cell-group>
        </div>
        <div class="footer">
          <div @click="manager(marking)">确认</div>
        </div>
      </div>
    </div>
    <!--<van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">-->
    <!--<van-picker-->
    <!--show-toolbar-->
    <!--:columns="columns"-->
    <!--@cancel="onCancel"-->
    <!--@confirm="onConfirm"/>-->
    <!--</van-popup>-->
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
        addr: globalConfig.server,
        haveInHand: true,
        isClear: false,
        picStatus: true,

        tabs: '',
        columns: [],              //select值
        selectHide: false,

        decorateAll: [],
        decorate_name: [],
        decorationOn: '',

        propertyAll: [],
        property_name: [],
        propertyOn: '',

        is_electric_status: true,         //家电是否齐全
        is_clean_status: true,            //卫生是否干净

        form: {
          remark: '',
          photo: [],
        },
        forms: {
          is_electric_appliance: 1,   //家电是否齐全
          is_clean: 1,                //是否干净
          house_id: '',
          // house_grade: 1,            //评分
          // suggest_price: '',         //价格
          // decoration: '',            //装修
          // house_feature: '',         //特色
        },
        // status: ['很差', '一般', '满意', '很满意', '非常满意'],
        path: '',
        pitch: '',
        detail: '',
        address: '',
        marking: '',

        showContent: false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.ddBack(1, from.path);
        vm.ddBack(2, from.path);
      })
    },
    mounted() {
      // this.dict();
    },
    activated() {
      this.haveInHand = true;
      this.pitch = this.$route.query.data;
      this.detail = this.$route.query.detail;
      this.address = this.$route.query.address;
      this.marking = this.$route.query.marking;
      this.forms.house_id = this.$route.query.house_id;
    },
    methods: {
      // onClick(key) {
      //   return key;
      // },
      // dict() {
      //   // 装修
      //   this.dictionary(404, 1).then((res) => {
      //     this.decorate_name = [];
      //     this.decorateAll = res.data;
      //     for (let i = 0; i < res.data.length; i++) {
      //       this.decorate_name.push(res.data[i].dictionary_name);
      //     }
      //     // 房屋特色
      //     this.dictionary(425, 1).then((res) => {
      //       this.property_name = [];
      //       this.propertyAll = res.data;
      //       for (let i = 0; i < res.data.length; i++) {
      //         this.property_name.push(res.data[i].dictionary_name);
      //       }
      //     });
      //
      //   });
      // },
      // selectShow(val) {
      //   this.tabs = val;
      //   this.selectHide = true;
      //   switch (val) {
      //     case 1:
      //       this.columns = this.decorate_name;
      //       break;
      //     case 2:
      //       this.columns = this.property_name;
      //       break;
      //   }
      // },
      //
      // onConfirm(value, index) {
      //   switch (this.tabs) {
      //     case 1: // 装修
      //       this.decorationOn = value;
      //       for (let i = 0; i < this.decorateAll.length; i++) {
      //         if (this.decorateAll[i].dictionary_name === value) {
      //           this.forms.decoration = this.decorateAll[i].id;
      //         }
      //       }
      //       break;
      //     case 2: // 特色
      //       this.propertyOn = value;
      //       for (let i = 0; i < this.propertyAll.length; i++) {
      //         if (this.propertyAll[i].dictionary_name === value) {
      //           this.forms.house_feature = this.propertyAll[i].id;
      //         }
      //       }
      //       break;
      //   }
      //   this.selectHide = false;
      // },
      // // select关闭
      // onCancel() {
      //   this.selectHide = false;
      // },

      // 确认评论
      manager(val) {
        if (this.detail !== 'to_comment') {
          this.sure(val);
        } else {
          if (this.form.remark !== '' || this.form.photo.length !== 0) {
            this.sure(val);
          } else {
            Toast('请填写评论内容');
          }
        }
      },
      // 评分
      mark() {
        this.form.is_electric_appliance = this.is_electric_status ? 1 : 0;
        this.form.is_clean = this.is_clean_status ? 1 : 0;
        this.$http.put(this.addr + 'bulletin/helper/score/' + this.pitch, this.forms).then((res) => {
          if (res.data.code === '51100') {
            this.$router.replace({path: this.path, query: {ids: this.pitch}});
            this.close_();
            $('.imgItem').remove();
          } else {
            Toast(res.data.msg);
          }
        });
      },
      sure(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.$http.put(this.urls + 'process/' + this.pitch, {
              operation: this.detail,
              comment: this.form.remark,
              album: this.form.photo,
            }).then((res) => {
              this.haveInHand = true;
              if (res.data.status === 'success') {
                if (val === 1) {
                  this.mark();
                } else {
                  Toast.success(res.data.message);
                  this.$router.replace({path: this.path, query: {ids: this.pitch}});
                  this.close_();
                  $('.imgItem').remove();
                }
              } else {
                Toast(res.data.message);
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
              that.$router.push({path: urls, query: {ids: that.pitch}});
            },
            onFail: function (err) {
            }
          });
        } else {
          document.addEventListener('backbutton', function (e) {
            e.preventDefault();
            that.$router.push({path: urls, query: {ids: that.pitch}});
          });
        }
      }
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

    .showPopupTitle, .showPopupFooter {
      text-align: center;
      padding: .3rem 0;
      font-size: .36rem
    }
    .showPopupTitle {
      border-bottom: 1px solid #f4f4f4;
    }
    .showPopupFooter {
      border-top: 1px solid #f4f4f4;
      color: #409EFF;
    }
    .showPopup {
      width: 6.6rem;
      padding-left: .3rem;
      max-height: 8rem;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }

    header {
      padding: .3rem;
      background: #FFFFFF;
      .address {
        font-size: .4rem;
        text-align: center;
      }
      .marking {
        margin: .3rem 0;
        div {
          @include flex;
          justify-content: center;
          align-items: center;
          p {
            margin: 0 .1rem;
            i {
              font-size: .5rem;
              color: #FFD000;
            }
          }
        }
        div:first-of-type {
          margin-bottom: .24rem;
        }
      }
    }

    .contents, .pic {
      background: #ffffff;
    }
    .contents {
      .van-cell.van-hairline.van-field {
        .van-cell__value {
          padding-left: 0;
        }
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
