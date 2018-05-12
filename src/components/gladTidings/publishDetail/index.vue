<template>
  <div id="cardDetail">
    <div class="detail">
      <div class="detailLeft">
        <div>
          <img :src="personal.avatar" v-if="personal.avatar !== '' && personal.avatar !== null">
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

          <span class="placeSpan" v-if="placeFalse" @click="approvePersonal">
            <i class="iconfont icon-yanqi--"></i>
            <span>{{place.display_name}}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="detailRight">
      <!--收房报备-->
      <div class="topTitle">
        <div class="load" v-if="vLoading">
          <van-loading type="spinner" color="black"/>
        </div>
        <p style="text-align: center;color: #9c9c9c;" v-if="!vLoading && message !== ''">{{message}}</p>
        <div v-for="(key,index) in formList"
             v-if="printscreen.indexOf(index) === -1">
          <p>{{index}}</p>
          <h1>
            <span v-if="Array.isArray(key)" v-for="item in key">
              <span style="display: block;">{{item.msg}}</span>
              <span style="display: block;">{{item.period}}</span>
            </span>
            <span v-if="index === '定金和收款方式' || index === '补交定金和收款方式'" v-for="item in key">
              <span style="display: block;">{{item}}</span>
            </span>
            <span v-if="!Array.isArray(key) && index !== '房屋类型'">{{key}}</span>
            <span v-if="!Array.isArray(key) && index === '房屋类型'">
              <span style="display: block;">{{key.name}}</span>
            </span>
          </h1>
        </div>
        <div class="photo" v-else>
          <p>{{index}}</p>
          <h1>
            <span v-for="(pic,num) in key">
              <img v-if="pic.is_video" @click="checkTv(pic.uri)" src="../../../assets/video.jpg">
              <img v-else @click="pics(key, num, 2)" :src="pic.uri">
            </span>
          </h1>
        </div>
      </div>

      <ul
        v-waterfall-lower="loadMore"
        waterfall-disabled="disabled1"
        waterfall-offset="300">
        <li class="started">
          <!--评论-->
          <div class="commentArea">
            <div class="headline">评论<span>{{paging}}</span></div>
            <div class="commentAreaMain" v-for="key in commentList">
              <div class="commentTitle">
                <div class="staff">
                  <p>
                    <img :src="key.user.avatar" v-if="key.user.avatar !== '' && key.user.avatar !== null">
                    <img src="../../../assets/head.png" v-else>
                  </p>
                  <div>
                    {{key.user.name}}<span class="a" v-for="(item,index) in key.user.org" v-if="index === 0">-{{item.name}}</span>
                  </div>
                </div>
                <div class="times">
                  {{key.created_at}}
                </div>
              </div>
              <div class="contents">
                {{key.body}}
              </div>
              <div class="pics">
                <div v-for="(p,index) in key.album">
                  <img :src="p.uri" @click="pics(key.album, index, 2)">
                </div>
              </div>
            </div>
            <div v-if="commentList.length === 0 && disabled1" style="text-align: center;padding: .3rem 0 0;">
              暂无评论
            </div>
          </div>
        </li>
      </ul>
      <div class="bottom">
        <span v-show="disabled1 && commentList.length > 6">我是有底线的</span>
        <van-loading v-show="!disabled1" type="spinner" color="black"/>
      </div>

    </div>
    <div class="footer">
      <div @click="newly()"
           v-if="personalId.id === personal.id && (place.status === 'published' || place.status === 'rejected' || place.status === 'cancelled')">
        重新提交
      </div>
      <div v-for="(key,index) in operation" @click="commentOn(index)">{{key}}</div>
    </div>

    <div id="videoId" v-if="videoSrc !== ''">
      <video style="position: absolute; top: 6%;left: 5%;" :src="videoSrc" muted controls autoplay width="90%"
      height="100%"></video>
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
            <img :src="key.avatar" v-if="key.avatar !== '' && key.avatar !== null">
            <img src="../../../assets/head.png" v-else>
          </div>
          <div>
            <p>姓名：{{key.name}}</p>
            <p>手机号：<a :href="'tel:' + key.phone">{{key.phone}}</a></p>
            <!--<p>岗位：<span v-for="item in key.role">{{item.display_name}}</span></p>-->
          </div>
        </div>
      </div>
      <div class="showContentFooter" @click="showContent = false">
        关闭
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {ImagePreview, Toast},
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper'),
    },
    data() {
      return {
        urls: globalConfig.server_user,
        personalId: {},
        vLoading: true,
        disabled1: false,
        printscreen: ['款项结清截图', '特殊情况领导截图', '特殊情况截图', '特殊情况同意截图', '领导报备截图', '凭证截图', '合同照片', '截图', '领导同意截图', '房屋影像', '房屋照片', '退租交接单'],
        placeStatus: ['published', 'rejected', 'cancelled'],
        address: '',
        message: '',
        ids: '',
        active: false,
        personal: {},
        place: {},
        formList: {},
        operation: {},
        process: {},
        commentList: [],

        page: 1,
        paging: 0,
        path: '',

        onIndex: '',
        bigPic: '',
        photo: [],
        bigPicShow: false,

        placeFalse: false,
        videoSrc: '',

        role_name: [],
        showContent: false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let per = JSON.parse(sessionStorage.personal);
        vm.personalId = per;
        vm.path = from.path;
        if (from.path === '/') {
          sessionStorage.setItem('path', vm.path);
        }
        vm.path = sessionStorage.path;
        if (sessionStorage.path !== '/') {
          vm.routerIndex('');
          vm.ddRent('');
        } else {
          vm.ddRent('', 'close');
        }
        vm.search();
      })
    },
    activated() {
      this.ids = this.$route.query.ids;
      this.page = 1;
      this.close_();
      this.disabled1 = false;
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
      approvePersonal() {
        if (this.place.auditors) {
          this.role_name = this.place.auditors;
          this.showContent = true;
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
        this.videoSrc = '';
        this.formList = {};
        this.operation = {};
        this.personal = {};
        this.place = {};
        this.commentList = [];
      },
      loadMore() {
        if (!this.disabled1) {
          this.comments(this.ids, this.page);
          this.page++;
        }
      },
      search() {
        this.formDetail(this.ids);
      },
      formDetail(val) {
        this.$http.get(this.urls + 'process/' + val).then((res) => {
          this.message = '';
          if (res.data.status === 'success' && res.data.data.length !== 0) {
            this.formList = JSON.parse(res.data.data.process.content.show_content_compress);
            let houseName = res.data.data.process.content;
            if (houseName.address) {
              this.address = houseName.address;
            } else if (houseName.rent_without_collect_address) {
              this.address = houseName.rent_without_collect_address;
            } else {
              this.address = houseName.house.name;
            }
            this.operation = res.data.data.operation;

            let pro = res.data.data.process;
            this.personal = pro.user;
            this.place = pro.place;
            if (this.placeStatus.indexOf(pro.place.status) === -1) {
              this.placeFalse = true;
            } else {
              this.placeFalse = false;
            }
            this.process = pro;

            this.vLoading = false;
          } else {
            this.personal.avatar = '';
            this.personal.name = 'XXXX';
            this.message = res.data.message;
            this.vLoading = false;
          }
        });
      },
      comments(val, page) {
        this.$http.get(this.urls + 'comments?id=' + val, {
          params: {
            page: page,
          }
        }).then((res) => {
          let data = res.data.data;
          this.paging = res.data.meta.total;
          if (res.data.status === 'success' && data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              this.commentList.push(data[i]);
            }
          } else {
            this.disabled1 = true;
          }
        })
      },

      pics(val, index, num) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].uri)
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
      commentOn(val) {
        this.$router.push({path: '/comment', query: {detail: val, data: this.ids, address: this.address, marking: 2}});
      },
      // 重新提交
      newly() {
        let proId = this.process.processable_id;
        switch (this.process.processable_type) {
          case 'bulletin_quality'://质量
            this.$router.push({path: '/quality', query: {newID: proId}});
            break;
          case 'bulletin_collect_basic'://收
            this.$router.push({path: '/collectReport', query: {newID: proId}});
            break;
          case 'bulletin_collect_continued'://续收报备
            this.$router.push({path: '/continueCollect', query: {newID: proId}});
            break;
          case 'bulletin_rent_basic'://租
            this.$router.push({path: '/rentReport', query: {newID: proId}});
            break;
          case 'bulletin_rent_trans'://转租
            this.$router.push({path: '/changeRent', query: {newID: proId}});
            break;
          case 'bulletin_rent_continued'://续租
            this.$router.push({path: '/continueRent', query: {newID: proId}});
            break;
          case 'bulletin_rent_RWC'://未收先祖
            this.$router.push({path: '/unCollectBeforeRent', query: {newID: proId}});
            break;
          case 'bulletin_RWC_confirm'://未收先祖确定
            this.$router.push({path: '/unCollectBeforeRentSure', query: {newID: proId}});
            break;
          case 'bulletin_agency'://中介费报备
            this.$router.push({path: '/agencyRent', query: {newID: proId}});
            break;
          case 'bulletin_banish'://清退
            this.$router.push({path: '/clearRetreat', query: {newID: proId}});
            break;
          case 'bulletin_change'://调房
            this.$router.push({path: '/transferReport', query: {newID: proId}});
            break;
          case 'bulletin_lose'://炸单
            this.$router.push({path: '/friedBill', query: {newID: proId}});
            break;
          case 'bulletin_refund'://退款
            this.$router.push({path: '/drawback', query: {newID: proId}});
            break;
          case 'bulletin_retainage'://尾款
            this.$router.push({path: '/finalPayment', query: {newID: proId}});
            break;
          case 'bulletin_special'://特殊
            this.$router.push({path: '/special', query: {newID: proId}});
            break;
          case 'bulletin_checkout'://退租
            this.$router.push({path: '/checkout', query: {newID: proId}});
            break;
        }
      },
    },
  }
</script>

<style lang="scss">
  #cardDetail {
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

    .showContentTitle, .showContentFooter {
      text-align: center;
      padding: .3rem 0;
      font-size: .36rem
    }
    .showContentTitle {
      border-bottom: 1px solid #f4f4f4;
    }
    .showContentFooter {
      border-top: 1px solid #f4f4f4;
      color: #409EFF;
    }
    .showContent {
      width: 6.6rem;
      max-height: 8rem;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      p {
        color: #6a6a6a;
        margin: .12rem 0;
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
        padding: .2rem;
        .showImg {
          min-width: .9rem;
          max-width: .9rem;
          height: .9rem;
          margin-right: .2rem;
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
      align-items: center;
      height: 1.4rem;
      color: #409EFF;
      .placeSpan {
        @include flex;
        align-items: center;
        i {
          margin-right: .1rem
        }
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
      .close {
        position: absolute;
        width: .8rem;
        height: .8rem;
        text-align: center;
        line-height: .8rem;
        @include border_radius(50%);
        /*background-color: rgba(0, 0, 0, .8);*/
        bottom: 1rem;
        /*border: 1px solid rgba(255, 255, 255, .8);*/
        right: 2%;
        top: 2%;
        transform: translate(-50%);
        i {
          color: #FFFFFF;
          font-size: .6rem;
        }
      }
    }

    .bigPhotos {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .4);
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
          color: #FFFFFF;
          margin: 0 .2rem;
          border-radius: 50%;
          i {
            display: inline-block;
            font-size: 1rem;
          }
        }
        .nextPic, .prePic {
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
          bottom: .6rem;
          left: 50%;
          transform: translate(-50%);
          i {
            font-size: .6rem;
          }
        }
      }
      img {
        max-width: 100%;
        max-height: 100%
      }
    }

    .photo {
      p {
        padding-top: .2rem;
      }
      h1 {
        @include flex;
        flex-wrap: wrap;
        span {
          width: 1rem;
          height: 1rem;
          margin-top: .2rem;
          margin-right: .2rem;
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
      padding: .3rem;
      .detailLeft {
        min-width: .9rem;
        max-width: .9rem;
        margin-right: .3rem;
        div {
          width: 100%;
          height: .9rem;
          overflow: hidden;
          img {
            @include border_radius(50%);
            width: 100%;
            height: 100%;
          }
        }
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
            line-height: .5rem;
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
          background: url('../../../assets/tongguo.png') no-repeat;
        }
        .statusFail {
          background: url('../../../assets/shibai.png') no-repeat;
        }
        .cancelled {
          background: url('../../../assets/chexiao.png') no-repeat;
        }
        .statusSuccess, .statusFail, .cancelled {
          width: 1.4rem;
          height: 1.4rem;
          background-size: 100% 100%;
          @include scale(1);
          -webkit-animation: manger .6s ease-in-out;
          -o-animation: manger .6s ease-in-out;
          animation: manger .6s ease-in-out;
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
        padding: .3rem;
        margin-top: 2rem;
        background: #ffffff;
        div {
          margin: .2rem 0;
          @include flex;
          word-break: break-all;
          p {
            min-width: 1.8rem;
            max-width: 1.8rem;
            margin-right: .4rem;
            line-height: .4rem;
            color: #9c9c9c;
            text-align: left;
          }
          h1 {
            color: #101010;
            line-height: .4rem;
          }
        }
        .load {
          display: flex;
          justify-content: center;
          margin: 3rem auto 0;
        }
      }

      .commentArea {
        margin-top: .3rem;
        padding-bottom: .36rem;
        background: #ffffff;
        color: #101010;

        div, p, span {
          color: #9c9c9c;
        }
        .headline {
          color: #444444;
          font-size: .33rem;
          padding: .3rem 0 .2rem .3rem;
          font-weight: bold;
          border-bottom: 1px solid #dddddd;
          span {
            font-size: .33rem;
            font-weight: bold;
            color: #444444;;
            padding-left: .1rem;
          }
        }
        .commentAreaMain {
          margin-top: .36rem;
          padding: 0 .4rem;
          .commentTitle {
            @include flex;
            align-items: center;
            justify-content: space-between;
            .staff {
              @include flex;
              align-items: center;
              p {
                min-width: .8rem;
                max-width: .8rem;
                height: .8rem;
                margin-right: .12rem;
                img {
                  @include border_radius(50%);
                }
              }
              div {
                width: 4rem;
                overflow: hidden;
                line-height: .9rem;
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
            margin-left: .9rem;
            color: #101010;
            line-height: .6rem;
          }
          .pics {
            @include flex;
            flex-wrap: wrap;
            margin-left: .9rem;
            div {
              width: 1rem;
              height: 1rem;
              margin: .2rem .3rem 0 0;
            }
          }
        }
      }
    }
    .bottom {
      @include flex;
      justify-content: center;
      align-items: center;
      padding: .4rem 0 1.3rem;
      color: #DDDDDD;
    }

  }
</style>
