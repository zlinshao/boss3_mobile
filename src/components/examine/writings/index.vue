<template>
  <div id="writings" :style="{minHeight: `${minHeight}px`}">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../../assets/loding1.gif">
    </div>
    <div class="disappear" v-if="undercarriage && !loading">
      <div class="a1">
        <img src="../../../assets/disappear.png">
      </div>
      <div class="a2">{{contents}}</div>
    </div>
    <div v-if="dercarriage && !loading">
      <div style="background: rgba(61,90,254,0.06);height: 10px;width: 100%;"></div>
      <div class="writings" :class="{'boxShadow': commentsShow}">
        <div class="titles">
          <p class="title">{{myData.title}}</p>
          <p class="mark">{{myData.dict_ids}}</p>
        </div>
        <div class="info clearfix">
          <p class="left">
            <img :src="myData.staffs[0].avatar" v-if="myData.staffs && myData.staffs[0] && myData.staffs[0].avatar">
            <img src="../../../assets/head.png" v-else>
          </p>
          <p class="depart">
            <span v-if="myData.staffs && myData.staffs[0] && myData.staffs[0].name">{{myData.staffs[0].name}}&nbsp;</span>
            <span v-for="item in myData.staffs[0].org">{{item.name}}&nbsp;</span>
          </p>
          <p class="right">{{myData.create_time}}</p>
        </div>
        <div v-for="key in cover_pic">
          <img v-for="p in key" :src="p.uri">
        </div>
        <div class="post_text ql-editor" id="content" v-html="myData.content"></div>
        <div class="icons">
          <i class="iconfont icon-yanjing"><span>&nbsp;{{myData.read_num}}&nbsp;&nbsp;&nbsp;</span></i>
          <i class="iconfont icon-zan" :class="{'zan': assistId}" @click="assist(pitch)"><span
            :class="{'zan': assistId}">{{myData.favor_num}}&nbsp;&nbsp;&nbsp;&nbsp;</span></i>
          <span v-if="myData.comments_count<1"><i class="iconfont icon-pinglun"><span>&nbsp;&nbsp;{{myData.comments_count}}</span></i></span>
          <span @click="loadComments" v-else><i class="iconfont icon-pinglun"><span>&nbsp;&nbsp;{{myData.comments_count}}</span></i></span>
        </div>
        <div class="nextPrev" v-if="myData.before_content!=null || myData.next_content!=null">
          <p v-if="before_content.id !== '' && before_content.name !== ''" @click="routerLink(before_content.id)">
            上一篇：<span>{{before_content.title}}</span></p>
          <p v-if="next_content.id !== '' && next_content.name !== ''" @click="routerLink(next_content.id)">下一篇：<span>{{next_content.title}}</span>
          </p>
        </div>
      </div>
      <div v-if="commentsShow" class="comment_list">
        <div class="bottom" v-if="commentLoading">
          <van-loading type="spinner" color="black"/>
        </div>
        <ul>
          <li class="started">
            <div class="commentArea">
              <div class="commentAreaMain" v-for="key in commentList">
                <div class="staff clearfix">
                  <p class="left">
                    <img :src="key.avatar" v-if="key.avatar !== null && key.avatar !== ''">
                    <img src="../../../assets/head.png" v-else>
                  </p>
                  <p class="depart">
                    <span>{{key.name}}&nbsp;</span>
                    <span v-if="key.org.length !== 0">
                      <span v-for="(org,index) in key.org" v-if="index === 0">{{org.name}}&nbsp;</span>
                    </span>
                  </p>
                  <p class="times right">
                    {{key.create_time.substring(0,10)}}
                  </p>
                </div>
                <div class="contents">
                  {{key.content}}
                </div>
                <div class="pics">
                  <div v-for="(p,index) in key.photos">
                    <img :src="p" @click="pics(key.photos, index)">
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--<div class="bottom">-->
      <!--<van-loading type="spinner" color="black"/>-->
      <!--</div>-->
      <div class="footer" @click="goComment">
        <span>评论</span>
      </div>
    </div>

    <div class="bigPhotos" v-if="bigPicShow">
      <div>
        <p v-if="photo.length > 1" class="nextPic" @click="next(photo)"><i class="iconfont icon-xiayibu"></i></p>
        <p v-if="photo.length > 1" class="prePic" @click="pre(photo)"><i class="iconfont icon-xiayibu"></i></p>
        <p class="close" @click="closePic"><i class="iconfont icon-cuowutishi"></i></p>
      </div>
      <img :src="bigPic">
    </div>
  </div>
</template>

<script>
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';

  export default {
    components: {ImagePreview, Toast},
    name: "index",
    data() {
      return {
        loading: false,
        urls: globalConfig.server,
        address: globalConfig.attestation,
        assistId: false,
        pitch: '',
        myData: {},
        cover_pic: {},
        create_time: '',
        before_content: {
          id: '',
          name: '',
        },
        next_content: {
          id: '',
          name: '',
        },
        params: {page: 1},
        commentList: [],
        path: '',
        undercarriage: false,
        dercarriage: false,
        contents: '',

        photo: [],
        active: '',
        bigPic: '',
        bigPicShow: false,
        commentsShow: false,
        minHeight: window.innerHeight,
        commentLoading: false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        // vm.routerIndex(from.path, 'house');
        // vm.ddRent(from.path, 'house');
      })
    },
    activated() {
      this.assistId = false;
      this.commentsShow = false;
      this.returnIndex();
      this.pitch = this.$route.query.id;
      this.contentDetail(this.pitch);
      this.commentList = [];
    },
    methods: {
      goComment() {
        this.$router.push({path: '/comments', query: {data: this.pitch}});
      },
      returnIndex() {
        let that = this;
        document.addEventListener('backbutton', function (e) {
          e.preventDefault();
          if (that.path !== '/') {
            that.loading = true;
            that.$router.push({path: '/staffSquare'});
          }
        });
        dd.biz.navigation.setLeft({
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          onSuccess: function (result) {
            if (that.path !== '/') {
              that.loading = true;
              that.$router.push({path: '/staffSquare'});
            } else {
              that.ddRent('', 'close');
            }
          },
          onFail: function (err) {
          }
        });
      },
      IsPC() {
        let userAgentInfo = navigator.userAgent;
        let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
        return flag;
      },
      loadComments() {
        this.commentsShow = !this.commentsShow;
        if (this.commentList.length < 1) {
          this.comment(this.pitch);
        }
      },
      contentDetail(val) {
        this.loading = true;
        this.$http.get(this.urls + 'oa/portal/' + val).then((res) => {
          this.loading = false;
          if (res.data.code === "80020") {
            this.myData = res.data.data;
            if (res.data.data.status === 150) {
              this.contents = '该文章已下架';
              this.undercarriage = true;
              this.dercarriage = false;
            } else {
              this.undercarriage = false;
              this.dercarriage = true;
            }
            res.data.data.create_time = this.formatDateTime(res.data.data.create_time);
            if (res.data.data.before_content !== null) {
              this.before_content = res.data.data.before_content;
            } else {
              this.before_content.id = '';
              this.before_content.title = '';
            }
            if (res.data.data.next_content) {
              this.next_content = res.data.data.next_content;
            } else {
              this.next_content.id = '';
              this.next_content.title = '';
            }

            this.cover_pic = res.data.data.album.cover_pic;
          } else {
            this.contents = '该文章已删除';
            this.undercarriage = true;
            this.dercarriage = false;
          }
        })
      },
      assist(id) {
        this.$http.get(this.urls + 'oa/portal/favor/' + id).then((res) => {
          if (res.data.code === '80070') {
            // this.contentDetail(id);
            this.assistId = true;
            if (this.assistId) {
              this.myData.favor_num++;
            }
          }
        })
      },
      comment(val) {
        this.commentLoading = true;
        this.$http.get(this.urls + 'oa/portal/comment/' + val, {params: this.params}).then((res) => {
          this.commentLoading = false;
          if (res.data.code === '80090') {
            let data = res.data.data.data;
            for (let i = 0; i < data.length; i++) {
              let com = {};
              com.avatar = data[i].staffs.avatar;
              com.name = data[i].staffs.name;
              com.role = data[i].staffs.role;
              com.org = data[i].staffs.org;
              com.create_time = this.formatDateTime(data[i].create_time);
              com.content = data[i].content;
              com.photos = [];
              if (data[i].album !== null) {
                let val = data[i].album.image_pic;
                if (typeof val === "object") {
                  for (let key in val) {
                    com.photos.push(val[key][0].uri);
                  }
                }
              }
              this.commentList.push(com);
            }
          } else {
            this.commentList = [];
          }
        })
      },
      pics(val, index) {
        if (this.IsPC()) {
          this.photo = val;
          this.active = index;
          this.bigPic = val[index];
          this.bigPicShow = true;
          document.getElementsByTagName('body')[0].className = 'showContainer';
        } else {
          ImagePreview(val, index);
        }
      },
      next(val) {
        this.active++;
        if (this.active === val.length) {
          this.active = 0;
        }
        this.bigPic = val[this.active];
      },
      pre(val) {
        this.active--;
        if (this.active < 0) {
          this.active = val.length - 1;
        }
        this.bigPic = val[this.active];
      },
      closePic() {
        this.bigPicShow = false;
        document.getElementsByTagName('body')[0].className = '';
      },
      routerLink(val) {
        this.pitch = val;
        this.commentList = [];
        this.$router.push({path: '/writings', query: {id: val}});
        this.contentDetail(val);
        this.comment(val);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      },
      formatDateTime(time) {
        let result;
        let create_time = Date.parse(new Date(time.split('-').join('/')));
        let now_time = Date.parse(new Date());
        let difference = (now_time - create_time) / 1000;
        if (difference * 1000 >= 0 && difference < 60) {
          result = Math.floor(difference) + ' 秒前';
        } else if (difference >= 60 && difference < 3600) {
          result = Math.floor(difference / 60) + ' 分钟前';
        } else if (difference >= 3600 && difference < 3600 * 24) {
          result = Math.floor(difference / 3600) + ' 小时前';
        } else if (difference >= 3600 * 24 && difference < 3600 * 24 * 30) {
          result = Math.floor(difference / 3600 / 24) + ' 天前';
        } else if (difference >= 3600 * 24 * 30 && difference < 3600 * 24 * 30 * 12) {
          result = Math.floor(difference / 3600 / 24 / 30) + ' 个月前';
        } else if (difference >= 3600 * 24 * 30 * 12) {
          result = Math.floor(difference / 3600 / 24 / 30 / 12) + ' 年前';
        }
        return result;
      },
    },
  }
</script>

<style lang="scss">
  #writings {
    background: #ffffff;
    padding-bottom: 60px;
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    @mixin minMaxWidth($n) {
      min-width: $n;
      max-width: $n;
    }
    @mixin minMaxHeight($n) {
      min-height: $n;
      max-height: $n;
    }
    @mixin flow {
      overflow: hidden;
      word-break: break-all;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    @mixin border_radius($p) {
      -webkit-border-radius: $p;
      -moz-border-radius: $p;
      border-radius: $p;
    }
    .writings, .disappear, .started {
      img {
        max-width: 100%;
      }
    }
    p {
      line-height: .5rem;
      color: #575757;
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

    .icons {
      @include flex;
      align-items: center;
      justify-content: left;
      color: #9e9e9e;
      padding: .3rem 0;
      padding-bottom: 20px;
      i {
        vertical-align: middle;
      }
      .zan {
        animation: color-me-in 1s;
        color: #fb4699;
      }
      @keyframes color-me-in {
        0% {
          -moz-transform: scale(1, 1);
          -webkit-transform: scale(1, 1);
          -o-transform: scale(1, 1);
        }
        50% {
          -moz-transform: scale(2, 2);
          -webkit-transform: scale(2, 2);
          -o-transform: scale(2, 2);
        }
        100% {
          -moz-transform: scale(1, 1);
          -webkit-transform: scale(1, 1);
          -o-transform: scale(1, 1);
        }
      }
    }
    .disappear {
      div {
        text-align: center;
      }
      .a1 {
        width: 3rem;
        height: 3rem;
        margin: 2rem auto 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .a2 {
        margin-top: .6rem;
        font-size: .4rem;
        color: #aaaaaa;
      }
    }
    .ql-editor {
      padding: 0;
    }
    .boxShadow {
      box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.15);
    }
    .writings {
      position: relative;
      z-index: 1;
      line-height: .5rem;
      padding: 15px;
      padding-bottom: 0;
      background: #FFFFFF;
      #content {
        margin-top: 10px;
        h1 {
          font-size: 32px;
          strong, em, s, u {
            font-size: 32px;
          }
        }
        h2 {
          font-size: 24px;
          strong, em, s, u {
            font-size: 24px;
          }
        }
        h3 {
          font-size: 18px;
          strong, em, s, u {
            font-size: 18px;
          }
        }
        h4 {
          font-size: 16px;
          strong, em, s, u {
            font-size: 16px;
          }
        }
        h5 {
          font-size: 13px;
          strong, em, s, u {
            font-size: 13px;
          }
        }
        h6 {
          font-size: 12px;
          strong, em, s, u {
            font-size: 12px;
          }
        }
      }
      b, strong, h1, h2, h3, h4, h5, h6 {
        font-weight: bold;
      }
    }
    .titles {
      @include flex;
      justify-content: space-between;
      align-items: center;
      /*padding: 0 15px;*/
      .title {
        font-size: 16px;
        @include minMaxWidth(5rem);
        color: #101010;
      }
      .mark {
        float: right;
        text-align: right;
        border: 1px solid #F50057;
        border-radius: 2px;
        color: #F50057;
        padding: 0 10px;
        font-size: 14px;
        /*min-width: 80px;*/
      }
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .info {
      margin-top: 10px;
      margin-bottom: 15px;
      .left {
        display: flex;
        align-items: center;
        float: left;
        color: #757575;
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
      }
      .depart {
        padding-left: 10px;
        display: inline-block;
        float: left;
        width: 65%;
        @include flow;
        line-height: 35px;
      }
      .right {
        float: right;
        display: inline-block;
        line-height: 35px;
        color: #757575;
      }
    }
    .comment_list {
      position: relative;
      z-index: 0;
      background: #fafafe;
      ul {
        margin: 0 15px 50px 15px;
        background: #F8F9FF;
        box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.15);
        position: relative;
        z-index: 0;
        padding-left: 15px;
        li {
          .commentArea {
            .commentAreaMain {
              font-family: PingFangHK-Light;
              padding-top: 12px;
              .staff {
                .left {
                  display: flex;
                  align-items: center;
                  float: left;
                  img {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                  }
                  color: #757575;
                }
                .depart {
                  padding-left: 10px;
                  display: inline-block;
                  float: left;
                  width: 65%;
                  @include flow;
                  line-height: 35px;
                }
                .right {
                  float: right;
                  display: inline-block;
                  line-height: 35px;
                  color: #757575;
                  font-size: 14px;
                  line-height: 35px;
                  text-align: right;
                  margin-right: 15px;
                }
              }
              .contents {
                word-break: break-all;
                margin-left: 45px;
                line-height: 22px;
                color: #212121;
                padding-right: 12px;
                margin-bottom: 8px;
              }
              .pics {
                @include flex;
                flex-wrap: wrap;
                margin-left: 45px;
                img {
                  width: 90%;
                  height: 80%;
                }
                div {
                  width: 1rem;
                  height: 1rem;
                  margin: 0rem .1rem 0 0;
                }
                padding-bottom: 5px;
                border-bottom: 1px solid #e0e0e0;
              }
            }
          }
        }
      }
    }

    .nextPrev {
      padding: .36rem 0;
      p {
        margin-top: .1rem;
        cursor: pointer;
        @include flow;
        color: #b1b1b1;
      }
    }
    .bottom {
      @include flex;
      margin-bottom: 1.3rem;
      justify-content: center;
      align-items: center;
      padding: .4rem 0;
      color: #DDDDDD;
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
