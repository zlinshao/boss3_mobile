<template>
  <div id="cardDetail">
    <div>
      <div class="detail">
        <div class="detailLeft">
          <div>
            <img :src="personal.avatar" v-if="personal.avatar !== '' && personal.avatar !== undefined">
            <img src="../../../assets/head.png" v-else>
          </div>
        </div>
        <div class="topRight">
          <div class="personal">
            <p>{{personal.name}}</p>
            <p>
              <span v-for="(key,index) in personal.org">{{key.name}}</span>
              <span v-for="(key,index) in personal.role">&nbsp;-&nbsp;{{key.display_name}}</span>
            </p>
          </div>
          <div style="height: 1.4rem;"
               :class="{'statusSuccess': place === 'published', 'statusFail':place === 'rejected'}">

          </div>
        </div>
      </div>

      <div class="detailRight">
        <!--收房报备-->
        <div class="topTitle">
          <div class="load" v-if="vLoading">
            <van-loading type="spinner" color="black"/>
          </div>
          <div v-for="(key,index) in formList"
               v-if="index !== '领导报备截图' && index !== '款项结清截图' && index !== '特殊情况领导截图' && index !== '合同照片' && index !== '截图' && index !== '组长同意截图'">
            <p>{{index}}</p>
            <h1>
              <span v-if="Array.isArray(key)" v-for="item in key">
                <span style="display: block;">{{item.msg}}</span>
                <span style="display: block;">{{item.period}}</span>
              </span>
              <span v-if="index === '定金和收款方式'" v-for="item in key">
                <span style="display: block;">{{item}}</span>
              </span>
              <span v-if="!Array.isArray(key)">{{key}}</span>
            </h1>
          </div>
          <div class="photo" v-else>
            <p>{{index}}</p>
            <h1>
            <span v-for="(pic,index) in key">
              <img @click="pics(key,index,1)" :src="pic">
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
                      <img :src="key.user.avatar" v-if="key.user.avatar !== ''">
                      <img src="../../../assets/head.png" v-else>
                    </p>
                    <span class="a" v-for="(item,index) in key.user.org" v-if="index === 0">
                      {{item.name}}&nbsp;-&nbsp;
                      <span v-for="(i,index) in key.user.role" v-if="index === 0">{{i.display_name}}</span>
                    </span>
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
                    <img :src="p.uri" @click="pics(key.album,index,2)">
                  </div>
                </div>
              </div>
              <div v-if="commentList.length === 0" style="text-align: center;padding: .3rem 0 0;">
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
        <div v-for="(key,index) in operation" @click="commentOn(index)">{{key}}</div>
      </div>
    </div>
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
        vLoading: true,
        disabled1: false,

        ids: '',
        personal: {},
        place: {},
        active: false,
        urls: globalConfig.server_user,
        formList: {},

        operation: {},
        form: {},       //评论
        commentList: [],
        page: 1,
        paging: 0,
      }
    },
    activated() {
      this.routerIndex('');
      this.ddRent('');
      this.ids = JSON.parse(this.$route.query.ids);
      this.disabled1 = false;
      this.page = 1;
      this.commentList = [];
      this.formDetail(this.ids);
    },
    methods: {
      loadMore() {
        if (!this.disabled1) {
          this.comments(this.ids, this.page);
          this.page++;
        }
      },
      formDetail(val) {
        this.$http.get(this.urls + 'process/' + val).then((res) => {
          if (res.data.status === 'success') {
            this.formList = res.data.data.process.content.show_content;
            this.operation = res.data.data.operation;
            this.personal = res.data.data.process.user;
            this.place = res.data.data.process.place;
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
            for (let i = 0; i < res.data.data.length; i++) {
              this.commentList.push(res.data.data[i]);
            }
          } else {
            this.disabled1 = true;
          }
        })
      },
      pics(val, index, num) {
        let arr = [];
        if (num === 1) {
          arr = val;
        } else {
          for (let i = 0; i < val.length; i++) {
            arr.push(val[i].uri)
          }
        }
        ImagePreview(arr, index);
      },

      // 评论
      commentOn(val) {
        this.$router.push({path: '/comment', query: {detail: val, data: this.ids}});
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

    img {
      width: 100%;
      height: 100%;
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
        .personal {
          p {
            width: 3.6rem;
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
        .statusSuccess, .statusFail {
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
        padding-bottom: .6rem;
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
              .a {
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
      margin-bottom: 1.3rem;
      justify-content: center;
      align-items: center;
      padding: .4rem 0 0;
      color: #DDDDDD;
    }

  }
</style>
