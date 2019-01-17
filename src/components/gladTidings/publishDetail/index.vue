<template>
  <div id="cardDetail">
    <div class="detail">
      <div class="detailLeft">
        <div @click="approvePersonal(2)">
          <img :src="personal.avatar" v-if="personal.avatar">
          <img src="../../../assets/head.png" v-else>
        </div>
      </div>
      <div class="topRight">
        <div class="personal">
          <p>{{personal.name}}</p>
          <p><span v-for="(key,index) in personal.org" v-if="index === 0">{{key.name}}</span></p>
        </div>

        <div class="placeFinish"
             :class="{'statusSuccess': place.status === 'published', 'statusFail':place.status === 'rejected', 'cancelled':place.status === 'cancelled'}">
          <span class="placeSpan" v-if="placeFalse" @click="approvePersonal(1)">
            <i class="iconfont icon-shenpi1"></i>
            <span>{{place.display_name}}</span>
          </span>
          <span class="placeSpan deal" v-if="placeFalse">
            <i class="iconfont icon-yanqi--"></i>
            <span>{{deal}}</span>
          </span>
        </div>
      </div>
      <div v-if="placeFalse && marking === 1" class="priceRange">本小区价格区间：{{priceRegion}}</div>
    </div>

    <div class="detailRight">
      <!--收房报备-->
      <div class="topTitle">
        <div class="load" v-if="vLoading">
          <van-loading type="spinner" color="black"/>
        </div>
        <p style="text-align: center;color: #9c9c9c;" v-if="!vLoading && message">{{message}}</p>
        <div v-for="(key,index) in formList"
             v-if="printscreen.indexOf(index) === -1">
          <p v-if="index !== 'receiptUri'">{{index}}</p>
          <h1 v-if="index.includes('渠道信息')">
            <span style="display: block;" v-for="arr in Object.keys(key)">
              <span>{{arr}}&nbsp;:&nbsp;{{key[arr]}}</span>
            </span>
          </h1>
          <h1 v-else>
            <span v-if="Array.isArray(key)" v-for="(item,idx) in key.length">
              <span style="display: block;">{{key[idx].msg}}</span>
              <span style="display: block;">{{key[idx].period}}</span>
            </span>
            <span v-if="index === '已收金额和汇款账户' || index === '实际收款时间' || index === '补交定金和收款方式'"
                  v-for="(item,idx) in key.length">
              <span style="display: block;">{{key[idx]}}</span>
            </span>
            <span v-if="!Array.isArray(key) && index !== '房屋类型'">
              {{key}}
            </span>
            <span v-if="!Array.isArray(key) && index === '房屋类型'">
              <span style="display: block;" v-if="key.name">{{key.name}}</span>
            </span>
          </h1>
        </div>
        <div class="photo" v-else>
          <p>{{index}}</p>
          <h1>
            <span v-for="(pic,num) in key">
              <img v-if="pic.is_video" @click="checkTv(pic.uri)" src="../../../assets/video.jpg">
              <img v-else @click="pics(key, num, pic.is_video)" :src="pic.uri">
            </span>
          </h1>
        </div>
        <div v-if='showElectronicReceipt'>
          <p>电子收据</p>
        </div>
      </div>
      <van-list
        :finished="finished"
        @load="onLoad">
        <div class="started">
          <!--评论-->
          <div class="commentArea">
            <div class="headline">评论<span>{{paging}}</span></div>
            <div class="commentAreaMain" v-for="key in commentList">
              <div class="commentTitle">
                <div class="staff">
                  <p>
                    <img :src="key.user.avatar" v-if="key.user.avatar">
                    <img src="../../../assets/head.png" v-else>
                  </p>
                  <div>
                    {{key.user.name}}
                    <span class="a" v-for="(item,index) in key.user.org" v-if="index === 0">
                      -{{item.name}}
                    </span>
                  </div>
                </div>
                <div class="times">
                  {{key.create_time.substring(0,10)}}
                </div>
              </div>
              <div class="contents">
                {{key.content}}
              </div>
              <div class="pics" v-if="key.album">
                <div v-for="(pic,num) in key.album.image_pic">
                  <img v-if="pic.info.ext.indexOf('video') > -1" @click="checkTv(pic.uri)"
                       src="../../../assets/video.jpg">
                  <img v-else @click="commentPic(key.album, num, pic.info.ext)" :src="pic.uri">
                </div>
              </div>
            </div>
            <div v-if="commentList.length === 0 && loading" style="text-align: center;padding: .3rem 0 0;">
              暂无评论
            </div>
          </div>
        </div>
      </van-list>
      <div class="bottom">
        <span v-show="loading && commentList.length > 6">我是有底线的</span>
        <van-loading v-show="!loading" type="spinner" color="black"/>
      </div>
    </div>
    <div class="footer">
      <div @click="newly()"
           v-if="personalId.id === personal.id && (placeStatus.indexOf(place.status) > -1)">
        重新提交
      </div>
      <div v-for="(key,index) in operation" @click="commentOn(index, marking)">{{key}}</div>
      <div @click="confirmBulletinType(contentGet,process,ids)" v-if="showElectronicReceipt">
        预览电子收据
      </div>
      <div @click="confirmBulletinType(contentGet,process,ids, 'sign')"
           v-if="previewStatus === 'signature' && showElectronicReceipt">
        生成电子收据
      </div>
      <div @click="confirmSend()" v-if="previewStatus === 'send' && showElectronicReceipt">
        发送电子收据
      </div>
    </div>

    <van-dialog
      v-model="phoneShow"
      show-cancel-button
      :before-close="beforeClose">
      <van-field
        v-model="phone"
        label="手机号"
        placeholder="请输入手机号"/>
    </van-dialog>

    <div id="videoId" v-show="videoSrc !== ''">
      <video id="video" :src="videoSrc" muted controls autoplay width="90%" height="88%"></video>
      <p class="close" @click="checkTv('')"><i class="iconfont icon-cuowutishi"></i></p>
    </div>

    <div class="bigPhotos" v-if="bigPicShow">
      <div>
        <p v-if="photo.length > 1" class="nextPic" @click="next(photo)"><i class="iconfont icon-xiayibu"></i></p>
        <p v-if="photo.length > 1" class="prePic" @click="pre(photo)"><i class="iconfont icon-xiayibu"></i></p>
        <p class="close" @click="closePic"><i class="iconfont icon-guanbi"></i></p>
      </div>
      <img :src="bigPic">
    </div>

    <van-popup v-model="showContent" style="border-radius: 3px;">
      <div class="showContentTitle">审核人</div>
      <div class="showContent">
        <div v-for="key in role_name" class="showRoleName">
          <div class="showImg">
            <img :src="key.avatar" v-if="key.avatar">
            <img src="../../../assets/head.png" v-else>
          </div>
          <div>
            <p>姓名：{{key.name}}</p>
            <p>手机号：<a :href="'tel:' + key.phone">{{key.phone}}</a></p>
          </div>
        </div>
      </div>
      <div class="showContentFooter" @click="showContent = false">
        关闭
      </div>
    </van-popup>

    <van-popup v-model="answerFor" style="border-radius: 3px;">
      <div class="showContent">
        <div class="showRoleName">
          <div class="showImg">
            <img :src="personal.avatar" v-if="personal.avatar">
            <img src="../../../assets/head.png" v-else>
          </div>
          <div>
            <p>报备人：{{personal.name}}</p>
            <p>手机号：<a :href="'tel:' + personal.phone">{{personal.phone}}</a></p>
          </div>
        </div>
        <div class="showRoleName" v-if="JSON.stringify(bull_name) !== '{}'">
          <div class="showImg">
            <img :src="bull_name.avatar" v-if="bull_name.avatar ">
            <img src="../../../assets/head.png" v-else>
          </div>
          <div>
            <p>负责人：{{bull_name.name}}</p>
            <p>手机号：<a :href="'tel:' + bull_name.phone">{{bull_name.phone}}</a></p>
          </div>
        </div>
      </div>
      <div class="showContentFooter" @click="answerFor = false">
        关闭
      </div>
    </van-popup>

    <SwitchCraft v-if="approvedStatus && routerLinks.indexOf(this.process.processable_type) > -1"
                 :process="process"></SwitchCraft>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';
  import SwitchCraft from '../../common/switchCraft.vue';
  import {Dialog} from 'vant';

  export default {
    name: "index",
    components: {ImagePreview, Toast, SwitchCraft, Dialog},
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper'),
    },
    data() {
      return {
        urls: globalConfig.server,
        personalId: {},
        vLoading: true,
        loading: true,
        finished: true,
        printscreen: ['新凭证截图', '证件照片', '房产证照片', '旧凭证截图', '新押金收条', '旧押金收条', '押金收条', '款项结清截图', '特殊情况领导截图', '特殊情况截图', '特殊情况同意截图', '领导报备截图', '凭证截图', '合同照片', '截图', '领导同意截图', '组长同意截图', '房屋影像', '房屋照片', '退租交接单'],
        placeStatus: ['published', 'rejected', 'cancelled'],

        routerLinks: ['bulletin_quality', 'bulletin_collect_basic', 'bulletin_collect_continued', 'bulletin_rent_basic', 'bulletin_rent_continued', 'bulletin_rent_trans', 'bulletin_rent_RWC', 'bulletin_RWC_confirm', 'bulletin_change', 'bulletin_retainage'],
        // 电子收据
        rentReport: ['bulletin_rent_basic', 'bulletin_rent_trans', 'bulletin_rent_continued', 'bulletin_rent_RWC', 'bulletin_RWC_confirm', 'bulletin_change', 'bulletin_retainage'],
        message: '',
        ids: '',

        personal: {},
        place: {},
        formList: {},
        operation: {},
        process: {},
        contentGet: {},
        commentList: [],

        page: 1,
        paging: 0,
        path: '',

        deal: '',

        onIndex: '',
        bigPic: '',
        photo: [],
        bigPicShow: false,

        placeFalse: false,
        videoSrc: '',

        bull_name: {},
        role_name: [],
        showContent: false,
        answerFor: false,

        approvedStatus: false,
        marking: '',
        priceRegion: '',
        bank: {},                       //银行数据

        showElectronicReceipt: true,    //展示电子收据
        previewStatus: 'signature',       //展示电子收据
        phoneShow: false,               //展示电子收据
        phone: '',                      //展示电子收据
        pdfLoading: '',                 //加载pdf
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        if (from.path === '/') {
          sessionStorage.setItem('path', vm.path);
        }
        if (sessionStorage.path !== '/') {
          vm.routerIndex('');
          vm.ddRent('');
        } else {
          vm.ddRent('', 'close');
        }
      })
    },
    activated() {
      sessionStorage.setItem('count', '2');
      if (sessionStorage.personal) {
        this.personalId = JSON.parse(sessionStorage.personal);
      }
      if (this.ids !== this.$route.query.ids) {
        this.previewStatus = 'signature';
      }
      this.ids = this.$route.query.ids;
      this.page = 1;
      this.close_();
      this.finished = false;
      this.search();
    },
    watch: {
      showContent(val) {
        if (val) {
          document.getElementsByTagName('body')[0].className = 'showContainer';
        } else {
          document.getElementsByTagName('body')[0].className = '';
        }
      }
    },
    methods: {
      // 审批人信息
      approvePersonal(val) {
        if (val === 1) {
          if (this.place.auditors) {
            this.role_name = this.place.auditors;
            this.showContent = true;
          }
        } else {
          this.answerFor = true;
        }
      },

      IsPC() {
        let userAgentInfo = navigator.userAgent;
        let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "app/ApartMent"];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
        return flag;
      },
      checkTv(val) {
        this.videoSrc = val;
      },
      close_() {
        this.showElectronicReceipt = false;
        this.showContent = false;
        this.answerFor = false;
        this.placeFalse = false;
        this.approvedStatus = false;
        this.vLoading = true;
        this.deal = '';
        this.phone = '';
        this.videoSrc = '';
        this.formList = {};
        this.operation = {};
        this.personal = {};
        this.place = {};
        this.commentList = [];
      },
      // 更多评论
      onLoad() {
        // 异步更新数据
        setTimeout(() => {
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (!this.finished) {
            this.comments(this.ids, this.page);
            this.page++;
          }
        }, 500);
      },
      search() {
        this.formDetail(this.ids);
      },
      formDetail(val) {
        this.$http.get(this.urls + 'workflow/process/' + val).then((res) => {
          this.message = '';
          if (res.data.code === '20020' && res.data.data.length !== 0) {
            let content = res.data.data.process.content;
            let main = res.data.data.process;
            this.operation = res.data.data.operation;
            this.deal = res.data.data.deal;
            if (content.address) {
              this.address = content.address;
            } else if (content.rent_without_collect_address) {
              this.address = content.rent_without_collect_address;
            } else {
              this.address = content.house.name;
            }
            this.process = main;
            if (this.rentReport.indexOf(main.processable_type) > -1) {
              this.$http.get(this.urls + 'workflow/process/get/' + val).then(item => {
                this.contentGet = item.data.data.content;
                let content1 = item.data.data.content;
                this.formList = JSON.parse(content1.show_content_compress);
                if (main.place.status === 'published' && this.personalId.status) {
                  let bulletinArr = ['bulletin_agency', 'bulletin_rent_basic', 'bulletin_rent_continued', 'bulletin_rent_trans', 'bulletin_change', 'bulletin_rent_RWC', 'bulletin_RWC_confirm', 'bulletin_retainage'];
                  if (bulletinArr.includes(main.processable_type) && (content1.is_receipt && content1.is_receipt.id == 1)) {
                    this.showElectronicReceipt = true;
                  }
                }
              })
            } else {
              this.formList = JSON.parse(content.show_content_compress);
            }
            this.personal = main.user;
            this.place = main.place;

            this.placeFalse = this.placeStatus.indexOf(main.place.status) === -1;
            //收房报备验证收款银行卡或收款人是否为公司员工
            if (main.place.status === 'review' && main.processable_type === 'bulletin_collect_basic') {
              if (main.place.name === 'verify-manager_review') {
                this.$http.post(this.urls + '/bulletin/collect/validateBankCard', main).then(res => {
                  if (res.data.code === '50122') {
                    Dialog.alert({
                      message: res.data.msg,
                    }).then(() => {
                      this.contractStatus(main);
                    });
                  } else {
                    this.contractStatus(main);
                  }
                })
              } else {
                this.contractStatus(main);
              }
            }
            if (main.leader) {
              this.bull_name = main.leader;
            }
            if (content.quality_up && main.place.name === 'appraiser-officer_review') {
              this.marking = 1;
            } else {
              this.marking = 2;
            }
            if (this.placeFalse && this.marking === 1) {
              let price = {};
              price.community = content.community.id;
              price.decorate = content.decorate.id;
              price.room = content.house_type[0];
              this.priceArea(price);
            }
          } else {
            this.personal.avatar = '';
            this.personal.name = 'XXXX';
            this.message = res.data.message;
          }
          this.vLoading = false;
          for (let key in this.operation) {
            if (key.indexOf('approved') > -1) {
              this.approvedStatus = true;
              return;
            }
          }
        });
      },
      // 合同是否存在
      contractStatus(main) {
        this.$http.get(this.urls + 'coreproject/lord/has_lord/' + main.house_id).then(res => {
          if (res.data !== true) {
            Dialog.alert({
              title: '提示',
              message: '合同已存在！'
            }).then(() => {
              // on close
            });
          }
        })
      },
      // 价格区间
      priceArea(price) {
        this.$http.get(this.urls + 'bulletin/quality/range', {
          params: price,
        }).then((res) => {
          this.priceRegion = res.data.priceMin + '~' + res.data.priceMax + '元';
        });
      },
      comments(val, page) {
        this.finished = true;
        this.$http.get(this.urls + 'workflow/process/comment/' + val, {
          params: {
            page: page,
          }
        }).then((res) => {
          if (res.data.code === '20000') {
            let data = res.data.data.data;
            this.paging = res.data.data.count;
            for (let i = 0; i < data.length; i++) {
              this.commentList.push(data[i]);
            }
            this.finished = false;
          } else {
            this.loading = true;
          }
        })
      },
      commentPic(value, index, video) {
        let val = value.image_pic;
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].uri);
        }
        if (this.IsPC()) {
          this.photo = arr;
          this.onIndex = index;
          this.bigPic = arr[index];
          this.bigPicShow = true;
          document.getElementsByTagName('body')[0].className = 'showContainer';
        } else {
          ImagePreview(arr, index);
        }
      },
      pics(val, index) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].uri);
        }
        if (this.IsPC()) {
          this.photo = arr;
          this.onIndex = index;
          this.bigPic = arr[index];
          this.bigPicShow = true;
          document.getElementsByTagName('body')[0].className = 'showContainer';
        } else {
          ImagePreview(arr, index);
        }
      },
      next(val) {
        this.onIndex++;
        if (this.onIndex === val.length) {
          this.onIndex = 0;
        }
        this.bigPic = val[this.onIndex];
      },
      pre(val) {
        this.onIndex--;
        if (this.onIndex < 0) {
          this.onIndex = val.length - 1;
        }
        this.bigPic = val[this.onIndex];
      },
      closePic() {
        this.bigPicShow = false;
        document.getElementsByTagName('body')[0].className = '';
      },
      // 评论
      commentOn(val, index) {
        this.close_();
        let num;
        num = val.indexOf('approved') > -1 ? index : 2;
        this.$router.push({
          path: '/comment',
          query: {detail: val, process: this.process.id, able: this.process.processable_id, ids: this.ids, marking: num}
        });
      },
      //确认订单类型是否需要生成电子收据
      confirmBulletinType(data, type, ids, val) {
        let res = {};
        res.process_id = ids;
        res.house_id = data.house_id;
        res.department_id = data.department_id;
        res.address = data.address;
        res.duration = data.show_content["现签约时长"] || data.show_content["签约时长"];
        if (type.processable_type === 'bulletin_retainage') {
          res.payer = data.customer_name;
          res.sign_at = data.retainage_date;
          res.price = data.price_arr.map(item => {
            return item.split(':')[1];
          }).join(",");
          res.pay_way = data.show_content['付款方式'].map(item => {
            return `${item.period}:${item.msg}`;
          }).join(",");
        } else {
          res.payer = data.name;
          res.sign_at = data.sign_date;
          res.price = data.price_arr.map(item => {
            return item + "元"
          }).join(',');
          res.pay_way = data.pay_way_str.map((item) => {
            return item.msg + " " + item.period;
          }).join(',');
        }
        if (data.show_content['款项名称']) {
          res.payment = data.show_content['款项名称'];
        } else {
          res.payment = '定金';
        }
        res.amount = data.money_sum;
        res.sum = data.money_sum;
        res.account_id = data.account_id;
        res.memo = data.memo || '';
        data.money_way.forEach((item, index) => {
          res['bank' + (index + 1)] = item;
        });
        this.previewJoggle(res, val).then(status => {
          if (status) {
            this.previewStatus = 'send';
          }
        });
      },
      // 发送电子收据
      confirmSend() {
        this.phone = this.contentGet.phone;
        this.phoneShow = true;
      },
      beforeClose(action, done) {
        if (action === 'confirm') {
          this.prompt('正在生成电子收据！', 'send');
          this.$http.post(this.urls + 'financial/receipt/send/' + sessionStorage.getItem('receiptId'), {
            phone: this.phone,
          }).then(res => {
            this.prompt('', 'close');
            if (res.data.code === '20000') {
              this.prompt(res.data.msg);
              this.previewStatus = 'send';
              this.phone = '';
            } else {
              this.phone = '';
              this.prompt(res.data.msg);
            }
          }).catch(_ => {
            this.phone = '';
            this.prompt('', 'close');
            this.prompt('发送失败！');
          });
          setTimeout(done, 1000);
        } else {
          done();
        }
      },
      // 重新提交
      newly() {
        let proID = this.process.processable_id;
        let list = {newID: proID, ids: '', type: 1};
        switch (this.process.processable_type) {
          case 'bulletin_quality'://质量
          case 'bulletin_quality_follow'://跟进质量
            this.$router.push({path: '/quality', query: list});
            break;
          case 'bulletin_collect_basic'://收
            this.$router.push({path: '/collectReport', query: list});
            break;
          case 'bulletin_collect_continued'://续收报备
            this.$router.push({path: '/continueCollect', query: list});
            break;
          case 'bulletin_rent_basic'://租
            this.$router.push({path: '/rentReport', query: list});
            break;
          case 'bulletin_rent_trans'://转租
            this.$router.push({path: '/changeRent', query: list});
            break;
          case 'bulletin_rent_continued'://续租
            this.$router.push({path: '/continueRent', query: list});
            break;
          case 'bulletin_rent_RWC'://未收先祖
            this.$router.push({path: '/unCollectBeforeRent', query: list});
            break;
          case 'bulletin_RWC_confirm'://未收先祖确定
            this.$router.push({path: '/unCollectBeforeRentSure', query: list});
            break;
          case 'bulletin_agency'://渠道费报备
            this.$router.push({path: '/agencyRent', query: list});
            break;
          case 'bulletin_banish'://清退
            this.$router.push({path: '/clearRetreat', query: list});
            break;
          case 'bulletin_change'://调房
            this.$router.push({path: '/transferReport', query: list});
            break;
          case 'bulletin_lose'://炸单
            this.$router.push({path: '/friedBill', query: list});
            break;
          case 'bulletin_refund_collect'://特殊
          case 'bulletin_refund_rent'://特殊
          case 'bulletin_refund'://特殊
            this.$router.push({path: '/drawback', query: list});
            break;
          case 'bulletin_retainage'://尾款
            this.$router.push({path: '/finalPayment', query: list});
            break;
          case 'bulletin_special_collect'://特殊
          case 'bulletin_special_rent'://特殊
          case 'bulletin_special'://特殊
            this.$router.push({path: '/special', query: list});
            break;
          case 'bulletin_checkout'://退租
            this.$router.push({path: '/checkout', query: list});
            break;
        }
      },
    },
  }
</script>

<style lang="scss">
  #cardDetail {
    overflow: hidden;
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    @mixin border_radius($p) {
      -webkit-border-radius: $p;
      -moz-border-radius: $p;
      border-radius: $p;
    }

    @mixin scale($p) {
      -moz-transform: scale($p, $p);
      -webkit-transform: scale($p, $p);
      -o-transform: scale($p, $p);
      transform: scale($p, $p);
    }

    $onColor: #39b1ff;
    $borColor: #9c9c9c;

    @keyframes manger {
      from {
        @include scale(6);
      }
      to {
        @include scale(1);
      }
    }

    @-moz-keyframes manger {
      from {
        @include scale(6);
      }
      to {
        @include scale(1);
      }
    }

    @-webkit-keyframes manger {
      from {
        @include scale(6);
      }
      to {
        @include scale(1);
      }
    }

    @-o-keyframes manger {
      from {
        @include scale(6);
      }
      to {
        @include scale(1);
      }
    }

    .showContentTitle,
    .showContentFooter {
      text-align: center;
      padding: 0.3rem 0;
      font-size: 0.36rem;
    }
    .showContentTitle {
      border-bottom: 1px solid #f4f4f4;
    }
    .showContentFooter {
      border-top: 1px solid #f4f4f4;
      color: #409eff;
    }
    .showContent {
      width: 6.6rem;
      max-height: 8rem;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      p {
        color: #6a6a6a;
        margin: 0.12rem 0;
        a {
          color: $onColor;
        }
      }
      .showRoleName + .showRoleName {
        border-top: 1px solid #f4f4f4;
      }
      .showRoleName {
        @include flex;
        align-items: center;
        padding: 0.2rem;
        .showImg {
          min-width: 0.9rem;
          max-width: 0.9rem;
          height: 0.9rem;
          margin-right: 0.2rem;
          img {
            width: 100%;
            height: 100%;
            @include border_radius(50%);
          }
        }
      }
    }

    .placeFinish {
      @include flex;
      justify-content: center;
      flex-direction: column;
      height: 1.4rem;

      .placeSpan {
        color: #409eff;
        @include flex;
        align-items: center;
        i {
          margin-right: 0.1rem;
        }
      }
      .deal {
        margin-top: 0.18rem;
        color: $borColor;
      }
    }

    #videoId {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      @include flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 1);
      z-index: 10000;
      #video {
        position: absolute;
        top: 7.5%;
        left: 5%;
      }
      .close {
        position: absolute;
        width: 0.8rem;
        height: 0.8rem;
        text-align: center;
        line-height: 0.8rem;
        @include border_radius(50%);
        /*background-color: rgba(0, 0, 0, .8);*/
        bottom: 1rem;
        /*border: 1px solid rgba(255, 255, 255, .8);*/
        right: 2%;
        top: 2%;
        transform: translate(-50%);
        i {
          color: #ffffff;
          font-size: 0.6rem;
        }
      }
    }

    .bigPhotos {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1000;
      text-align: center;
      @include flex;
      align-items: center;
      justify-content: center;
      div {
        p {
          position: absolute;
          bottom: 0;
          width: 50%;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          font-weight: bold;
          color: #ffffff;
          margin: 0 0.2rem;
          border-radius: 50%;
          i {
            display: inline-block;
            font-size: 1rem;
          }
        }
        .nextPic,
        .prePic {
          height: 100%;
          @include flex;
          align-items: center;
        }
        .nextPic {
          left: 0;
          text-align: left;
          justify-content: flex-start;
          i {
            transform: rotate(180deg);
          }
        }
        .prePic {
          right: 0;
          text-align: right;
          justify-content: flex-end;
        }
        .close {
          width: 1rem;
          bottom: 0.6rem;
          left: 50%;
          transform: translate(-50%);
          i {
            font-size: 0.6rem;
          }
        }
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .photo {
      p {
        padding-top: 0.2rem;
      }
      h1 {
        @include flex;
        flex-wrap: wrap;
        span {
          width: 1rem;
          height: 1rem;
          margin-top: 0.2rem;
          margin-right: 0.2rem;
        }
      }
    }

    .detail {
      img {
        width: 100%;
        height: 100%;
      }
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      @include flex;
      align-items: center;
      background: #ffffff;
      padding: 0.3rem;
      .detailLeft {
        min-width: 0.9rem;
        max-width: 0.9rem;
        margin-right: 0.3rem;
        div {
          width: 100%;
          height: 0.9rem;
          overflow: hidden;
          img {
            @include border_radius(50%);
            width: 100%;
            height: 100%;
          }
        }
      }
      .priceRange {
        position: absolute;
        right: 0.4rem;
        bottom: 0.1rem;
        color: orange;
      }
      .topRight {
        @include flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .personal {
          min-width: 2.8rem;
          max-width: 2.8rem;
          p {
            min-width: 2.8rem;
            max-width: 2.8rem;
            line-height: 0.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #9c9c9c;
          }
          p:first-of-type {
            color: #101010;
          }
        }
        .statusSuccess {
          background: url("../../../assets/tongguo.png") no-repeat;
        }
        .statusFail {
          background: url("../../../assets/shibai.png") no-repeat;
        }
        .cancelled {
          background: url("../../../assets/chexiao.png") no-repeat;
        }
        .statusSuccess,
        .statusFail,
        .cancelled {
          width: 1.4rem;
          height: 1.4rem;
          background-size: 100% 100%;
          @include scale(1);
          -webkit-animation: manger 0.6s ease-in-out;
          -o-animation: manger 0.6s ease-in-out;
          animation: manger 0.6s ease-in-out;
        }
      }
    }
    .detailRight {
      img {
        width: 100%;
        height: 100%;
      }
      width: 100%;
      .topTitle {
        padding: 0.3rem;
        margin-top: 2rem;
        background: #ffffff;
        div {
          margin: 0.2rem 0;
          @include flex;
          word-break: break-all;
          p {
            min-width: 1.8rem;
            max-width: 1.8rem;
            margin-right: 0.4rem;
            line-height: 0.4rem;
            color: #9c9c9c;
            text-align: left;
          }
          h1 {
            color: #101010;
            line-height: 0.4rem;
          }
          .electronicReceipt {
            color: green
          }
        }
        .load {
          display: flex;
          justify-content: center;
          margin: 3rem auto 0;
        }
      }

      .commentArea {
        margin-top: 0.3rem;
        padding-bottom: 0.36rem;
        background: #ffffff;
        color: #101010;

        div,
        p,
        span {
          color: #9c9c9c;
        }
        .headline {
          color: #444444;
          font-size: 0.33rem;
          padding: 0.3rem 0 0.2rem 0.3rem;
          font-weight: bold;
          border-bottom: 1px solid #dddddd;
          span {
            font-size: 0.33rem;
            font-weight: bold;
            color: #444444;
            padding-left: 0.1rem;
          }
        }
        .commentAreaMain {
          margin-top: 0.36rem;
          padding: 0 0.4rem;
          .commentTitle {
            @include flex;
            align-items: center;
            justify-content: space-between;
            .staff {
              @include flex;
              align-items: center;
              p {
                min-width: 0.8rem;
                max-width: 0.8rem;
                height: 0.8rem;
                margin-right: 0.12rem;
                img {
                  @include border_radius(50%);
                }
              }
              div {
                width: 100%;
                overflow: hidden;
                line-height: 0.9rem;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .times {
              min-width: 2rem;
              max-width: 2rem;
              text-align: right;
            }
          }
          .contents {
            margin-left: 0.9rem;
            color: #101010;
            line-height: 0.6rem;
          }
          .pics {
            @include flex;
            flex-wrap: wrap;
            margin-left: 0.9rem;
            div {
              width: 1rem;
              height: 1rem;
              margin: 0.2rem 0.3rem 0 0;
            }
          }
        }
      }
    }
    .bottom {
      @include flex;
      justify-content: center;
      align-items: center;
      padding: 0.4rem 0 1.3rem;
      color: #dddddd;
    }
  }
</style>
