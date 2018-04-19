<template>
  <div id="writings">
    <div class="disappear" v-if="undercarriage">
      <div class="a1">
        <img src="../../../assets/disappear.png">
      </div>
      <div class="a2">{{contents}}</div>
    </div>

    <div v-if="dercarriage">
      <div class="writings">
        <div class="titles">
          <p>{{myData.title}}</p>
          <span>{{create_time.substring(0,10)}}</span>
        </div>
        <div v-for="key in cover_pic">
          <img v-for="p in key" :src="p.uri">
        </div>
        <div v-html="myData.content">

        </div>
        <h6></h6>
        <div class="icons">
          <i class="iconfont icon-pinglun" style="padding: 0 .1rem;"></i><span>{{myData.comments_count}}</span>
          <i class="iconfont icon-zan" :class="{'zan': assistId}" @click="assist(pitch)"></i><span
          :class="{'zan': assistId}">{{myData.favor_num}}</span>
          <i class="iconfont icon-yanjing" style="padding: 0 .1rem;"></i><span>{{myData.read_num}}</span>
        </div>
        <div class="nextPrev">
          <p v-if="before_content.id !== '' && before_content.name !== ''" @click="routerLink(before_content.id)">
            上一篇：<span>{{before_content.title}}</span></p>
          <p v-if="next_content.id !== '' && next_content.name !== ''" @click="routerLink(next_content.id)">下一篇：<span>{{next_content.title}}</span>
          </p>
        </div>
      </div>

      <ul
        v-waterfall-lower="loadMore"
        waterfall-disabled="disabled"
        waterfall-offset="300">
        <li class="started">
          <div class="commentArea">
            <div class="headline">评论<span>{{paging}}</span></div>
            <div class="commentAreaMain" v-for="key in commentList">
              <div class="staff">
                <div>
                  <p>
                    <img :src="key.avatar" v-if="key.avatar !== null && key.avatar !== ''">
                    <img src="../../../assets/head.png" v-else>
                  </p>
                  <span>{{key.name}}</span>
                  <span v-if="key.role.length !== 0"
                        v-for="role in key.role">&nbsp;-&nbsp;{{role.display_name}}</span>
                </div>
                <p class="times">
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
            <div v-if="commentList.length === 0 && disabled" style="text-align: center;padding: .3rem 0;">
              暂无评论
            </div>
          </div>
        </li>
      </ul>

      <div class="bottom">
        <span v-show="disabled && commentList.length > 10">我是有底线的</span>
        <van-loading v-show="!disabled" type="spinner" color="black"/>
      </div>

      <div class="footer">
        <router-link :to="{path: '/comments', query: {data: this.pitch}}">评论</router-link>
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
  import {Waterfall} from 'vant';
  import {Toast} from 'vant';

  export default {
    components: {ImagePreview, Toast},
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper')
    },
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        address: globalConfig.attestation,
        assistId: false,
        disabled: false,
        paging: 0,
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
        params: {},
        commentList: [],
        page: 1,
        path: '',
        undercarriage: false,
        dercarriage: false,
        contents: '',

        photo: [],
        active: '',
        bigPic: '',
        bigPicShow: false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.search();
      })
    },
    activated() {
      this.pitch = this.$route.query.id;
      this.close_();
      this.page = 1;
      this.disabled = false;
    },
    methods: {
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
      loadMore() {
        if (!this.disabled) {
          this.comment(this.pitch, this.page);
          this.page++;
        }
      },
      search() {
        this.contentDetail(this.pitch);
      },
      close_() {
        this.commentList = [];
      },
      contentDetail(val) {
        this.$http.get(this.urls + 'oa/portal/' + val).then((res) => {
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
            this.create_time = res.data.data.create_time;
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
            this.contentDetail(id);
            this.assistId = true;
            if (this.assistId) {
              this.myData.favor_num++;
            }
          }
        })
      },
      comment(val, page) {
        this.params.pages = page;
        this.$http.get(this.urls + 'oa/portal/comment/' + val, {
          params: this.params,
        }).then((res) => {
          if (res.data.code === '80090') {
            let data = res.data.data.data;
            for (let i = 0; i < data.length; i++) {
              let com = {};
              com.avatar = data[i].staffs.avatar;
              com.name = data[i].staffs.name;
              com.role = data[i].staffs.role;
              com.create_time = data[i].create_time;
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
            this.paging = res.data.data.count;
          } else {
            this.disabled = true;
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
        this.$router.push({path: '/writings', query: {id: val}});
        this.pitch = val;
        this.paging = 0;
        this.commentList = [];
        this.disabled = false;
        this.page = 1;
        this.contentDetail(val);
        this.comment(val, 1);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      },

    },
  }
</script>

<style lang="scss">
  #writings {
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
        width: 100%;
        height: 100%;
      }
    }
    p {
      line-height: .5rem;
      color: #575757;
    }
    h6 {
      border: 1px solid #409EFF;
      width: .6rem;
      margin-top: .3rem;
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
      justify-content: flex-end;
      padding: .3rem 0;
      border-bottom: 1px solid #f1f1f1;
      i {
        vertical-align: middle;
      }
      .zan {
        animation: color-me-in 1s;
        color: #fb4699;
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

    .writings {
      line-height: .5rem;
      margin-top: .3rem;
      padding: .3rem;
      background: #FFFFFF;
    }

    .titles {
      @include flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: .55rem;
      p {
        @include minMaxWidth(4.6rem);
        font-size: .36rem;
        color: #101010;
      }
      span {
        text-align: right;
        @include minMaxWidth(2rem);
        color: #DDDDDD;
      }
    }

    .commentArea {
      margin-top: .3rem;
      line-height: .4rem;
      background: #FFFFFF;
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
        padding: .3rem;
        .staff {
          @include flex;
          align-items: center;
          justify-content: space-between;
          div {
            @include minMaxWidth(4.6rem);
            @include flow;
            @include flex;
            align-items: center;
            p, img {
              margin-right: .16rem;
              @include minMaxWidth(.9rem);
              @include minMaxHeight(.9rem);
              @include border_radius(50%);
              overflow: hidden;
            }
          }
          .times {
            @include minMaxWidth(2rem);
            @include flow;
            text-align: right;
          }
        }
        .contents {
          margin-left: 1.1rem;
        }
        .pics {
          @include flex;
          flex-wrap: wrap;
          margin-left: 1.1rem;
          div {
            width: 1rem;
            height: 1rem;
            margin: .1rem .1rem 0 0;
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
      padding: .4rem 0 0;
      color: #DDDDDD;
    }
    .footer {
      color: #409EFF;
      border-top: 1px solid #ebebeb;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      background: #FFFFFF;
      z-index: 999;
    }
  }
</style>
