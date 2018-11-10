<template>
  <div>
    <div id="commentOn">
      <div>
        <div class="contents">
          <!-- <div v-if="isShow" class="pdf-container">
              <iframe  width="100%" height="280px" :src="pdfUrl" type="application/pdf"></iframe >
              <pdf :src="pdfUrl"></pdf >
              <div class="pdf-loading" v-if="pdf_loading">
                <van-loading type="spinner"/>
                <div class="loading-tips">电子收据加载中</div>
              </div>
          </div> -->
          <van-cell-group>
            <van-field
              v-model="form.content"
              type="textarea"
              placeholder="说点什么吧！">
            </van-field>
          </van-cell-group>
        </div>
        <div class="pic">
          <div class="title">图片</div>
          <UpLoad :ID="'image_file'" @getImg="getImgData" :isClear="isClear"></UpLoad>
        </div>
        <div v-if="queries.marking === 1">
          <van-cell-group>
            <van-switch-cell v-model="is_electric_status" title="家电是否齐全"/>
            <van-switch-cell v-model="is_clean_status" title="卫生是否干净"/>
          </van-cell-group>
        </div>
        <div class="footer">
          <div @click="manager(queries.marking)">确认</div>
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
  // import pdfshower  from 'vue-pdf-shower';

  export default {
    name: "comment",
    components: {Toast, UpLoad},
    data() {
      return {
        urls: globalConfig.server,
        haveInHand: true,
        isClear: false,
        picStatus: 'success',

        show: false,
        text: '',
        // tabs: '',
        // columns: [],              //select值
        // selectHide: false,

        // decorateAll: [],
        // decorate_name: [],
        // decorationOn: '',

        // propertyAll: [],
        // property_name: [],
        // propertyOn: '',

        is_electric_status: true,         //家电是否齐全
        is_clean_status: true,            //卫生是否干净

        form: {
          parent_id: 0,
          obj_id: '',
          content: '',
          video_file: [],
          image_file: [],
        },
        forms: {
          is_electric_appliance: 1,     //家电是否齐全
          is_clean: 1,                  //是否干净
          // house_grade: 1,              //评分
          // suggest_price: '',           //价格
          // decoration: '',              //装修
          // house_feature: '',           //特色
        },
        // status: ['很差', '一般', '满意', '很满意', '非常满意'],
        path: '',
        queries: {},
        showContent: false,

        retry: 0,
        // electronicReceiptParam:null,          //电子收据参数对象
        // bank:null,                            //参数
        // pdfloading : true,
        // electronicReceiptId :'',              //电子收据id
        // pdfUrl : '',                          //pdf
        // isShow: false,                        //是否需要生成电子收据
        // pdf_loading:true,                     //正在加载电子收据pdf

      }
    },
    watch: {
      $route(to, from) {
        if (from.name === "publishDetail" && to.name === 'index') {
          if (sessionStorage.getItem('showElectronicReceipt')) {
            sessionStorage.removeItem('showElectronicReceipt');
          }
        }
        if (from.name === 'comment') {
          this.isShow = false;
          // this.pdfUrl = '';
          // this.pdf_loading = true;
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.ddBack(1, from.path);
        vm.ddBack(2, from.path);
        if (vm.$route.query.detail === 'to_market-marketing-manager_approved') {
          if (sessionStorage.getItem('showElectronicReceipt')) {
            // vm.isShow = true;
            // vm.electronicReceiptParam = JSON.parse(sessionStorage.getItem('electronicReceiptParam'));
            // vm.bank = JSON.parse(sessionStorage.getItem('bank'));
            // vm.createElectronicReceipt(vm);
          }
        } else {
          // vm.isShow = false;
        }
      })
    },
    mounted() {
      // this.dict();
    },
    activated() {
      this.haveInHand = true;
      this.queries = this.$route.query;

      this.forms.is_electric_appliance = 1;
      this.forms.is_clean = 1;
      this.is_electric_status = true;
      this.is_clean_status = true;
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
        if (this.queries.detail !== 'to_comment') {
          this.sure(val);
        } else {
          if (this.form.content !== '' || this.form.image_pic.length !== 0) {
            this.comment(val);
          } else {
            Toast('请填写评论内容');
          }
        }
        // if(this.isShow){
        //   this.signatureBtn();
        // }
      },
      // 评分
      mark() {
        this.forms.is_electric_appliance = this.is_electric_status ? 1 : 0;
        this.forms.is_clean = this.is_clean_status ? 1 : 0;
        this.$http.put(this.urls + 'bulletin/helper/score/' + this.queries.able, this.forms).then((res) => {
          if (res.data.code === '51110') {
            this.$router.replace({path: this.path, query: {ids: this.queries.ids}});
            this.close_();
            $('.imgItem').remove();
          } else {
            Toast(res.data.msg);
          }
        });
      },

      sure(val) {
        if (this.picStatus === 'err') {
          Toast(this.alertMsg('errPic'));
          return;
        } else if (this.picStatus === 'lose') {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          this.haveInHand = false;
          this.passThrough(val);
        } else {
          Toast(this.alertMsg('sub'));
        }
      },
      passThrough(val) {
        this.$http.post(this.urls + 'workflow/process/trans/' + this.queries.ids, {
          operation: this.queries.detail,
        }).then((res) => {
          this.haveInHand = true;
          this.flowPath(val);
          this.retry = 0;
          if (res.data.code === '20000') {
            if (val === 1) {
              this.mark();
            } else {
              this.$router.replace({path: this.path, query: {ids: this.queries.ids}});
              this.close_();
              $('.imgItem').remove();
            }
            Toast.success(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        }).catch((error) => {
          this.haveInHand = true;
          this.flowPath(val);
          if (error.response === undefined) {
            this.alertMsg('net');
          } else {
            if (error.response.status === 401) {
              this.personalGet().then((data) => {
                if (data && this.retry === 0) {
                  this.retry++;

                  this.passThrough();
                }
              });
            }
          }
        })
      },
      flowPath(val) {
        if (this.form.content !== '' || this.form.image_pic.length !== 0) {
          this.comment(val);
        }
      },
      comment() {
        if (this.picStatus === 'err') {
          Toast(this.alertMsg('errPic'));
          return;
        } else if (this.picStatus === 'lose') {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          this.haveInHand = false;
          this.$http.post(this.urls + 'workflow/process/comment', {
            content: this.form.content,
            obj_id: this.queries.ids,
            process_id: this.queries.process,
            processable_id: this.queries.able,
            parent_id: this.form.parent_id,
            video_file: this.form.video_file,
            image_pic: this.form.image_file,
          }).then((res) => {
            this.retry = 0;
            if (res.data.code === '20000') {
              if (this.queries.detail === 'to_comment') {
                this.$router.replace({path: this.path, query: {ids: this.queries.ids}});
                Toast.success(res.data.msg);
              }
              this.close_();
              $('.imgItem').remove();
              this.haveInHand = true;
            } else {
              Toast(res.data.msg);
              this.haveInHand = true;
            }
          }).catch((error) => {
            this.haveInHand = true;
            if (error.response === undefined) {
              this.alertMsg('net');

            } else {
              if (error.response.status === 401) {
                this.personalGet().then((data) => {
                  if (data && this.retry === 0) {
                    this.retry++;

                    this.comment();
                  }
                });
              }
            }
          })
        } else {
          Toast(this.alertMsg('sub'));
        }
      },
      getImgData(val) {
        this.picStatus = val[2];
        this.form.image_file = val[1];
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.form.content = '';
        this.form.image_file = [];
      },

      ddBack(val, urls) {
        let that = this;
        if (val === 1) {
          dd.biz.navigation.setLeft({
            control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
            onSuccess: function (result) {
              that.$router.push({path: urls, query: {ids: that.queries.ids}});
            },
            onFail: function (err) {
            }
          });
        } else {
          document.addEventListener('backbutton', function (e) {
            e.preventDefault();
            that.$router.push({path: urls, query: {ids: that.queries.ids}});
          });
        }
      },
      //生成电子收据
      createElectronicReceipt(vm) {
        // this.electronicReceiptVisible = true;
        this.$http.post(globalConfig.server + 'financial/receipt/generate', {...vm.electronicReceiptParam, ...vm.bank}).then((res) => {
          // this.pdfloading = false;
          if (res.data.code === "20000") {
            this.electronicReceiptId = res.data.data.id;
            // this.pdfUrl = res.data.data.shorten_uri;
            // this.pdf_loading = false;
            // this.signature = true
            sessionStorage.removeItem('showElectronicReceipt');
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
            // this.electronicReceiptVisible = false
          }
        })
      },
      //电子收据签章
      signatureBtn() {
        // this.pdfloading = true;
        this.$http.post(globalConfig.server + '/financial/receipt/sign/' + this.electronicReceiptId).then((res) => {
          if (res.data.code === "20000") {
            // this.pdfloading = false;
            // this.pdfUrl = res.data.data.shorten_uri;
            // this.signature = false
            // this.isShow = false;
            // localStorage.setItem('pdfUrl',this.pdfUrl)
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            });
          }
        })
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

      .pdf-container {
        height: 530px;
        position: relative;
        .pdf-loading {
          height: 1.2rem;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          .van-loading--spinner {
            margin: 0 auto;
          }
          .loading-tips {
            color: red;
            margin-top: .2rem;
          }
          canvas {
            height: 280px
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
