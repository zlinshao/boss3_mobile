<template>
  <div id="writings">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../../assets/loding1.gif">
    </div>

    <div v-if="!loading">
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
          <p @click="routerLink(before_content.id)">上一篇：<span>{{before_content.title}}</span></p>
          <p v-if="next_content !== null" @click="routerLink(next_content.id)">下一篇：<span>{{next_content.title}}</span>
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
                    <img :src="key.staffs.avatar" v-if="key.staffs.avatar !== null && key.staffs.avatar !== ''">
                    <img src="../../../assets/head.png" v-else>
                  </p>
                  <span>{{key.staffs.name}}</span>
                  <span v-for="role in key.staffs.role">&nbsp;-&nbsp;{{role.display_name}}</span>
                </div>
                <p class="times">
                  {{key.create_time.substring(0,10)}}
                </p>
              </div>
              <div class="contents">
                {{key.content}}
              </div>
              <div class="pics">
                <div v-for="item in key.album.image_pic">
                  <img v-for="(p,index) in item" :src="p.uri" @click="pics(key.album.image_pic, index)">
                </div>
                <div v-for="item in key.album.image_pic">
                  <span v-for="(p,index) in item">{{p}}<br>{{p.uri}}<br>{{index}}</span>
                </div>
              </div>
            </div>
            <div v-if="commentList.length === 0" style="text-align: center;padding: .3rem 0;">
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
        disabled: true,
        paging: 0,
        myData: {},
        cover_pic: {},
        create_time: '',
        before_content: {},
        next_content: {},
        params: {},
        commentList: [],
        page: 1,
        path: '',
        loading: false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        if (from.path === '/') {
          vm.loading = true;
          vm.corp();
        } else {
          vm.search();
          vm.loading = false;
          vm.disabled = false;
        }
      })
    },
    activated() {
      this.pitch = this.$route.query.id;
      this.page = 1;
      this.close_();
    },
    methods: {
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
        this.loading = false;
        this.$http.get(this.urls + 'oa/portal/' + val).then((res) => {
          this.myData = res.data.data;
          this.create_time = res.data.data.create_time;
          this.before_content = res.data.data.before_content;
          this.next_content = res.data.data.next_content;
          this.cover_pic = res.data.data.album.cover_pic;
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
              this.commentList.push(data[i]);
            }
            this.paging = res.data.data.count;
          } else {
            this.disabled = true;
          }
        })
      },
      pics(val, index) {
        let photo = [];
        for (let key in val) {
          for (let i = 0; i < val[key].length; i++) {
            photo.push(val[key][i].uri);
          }
        }
        alert(index);
        ImagePreview(photo, index);
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

      corp() {
        let that = this;
        this.$http.get(this.urls + 'special/special/dingConfig').then((res) => {
          let _config = res.data;
          DingTalkPC.runtime.permission.requestAuthCode({
            corpId: _config.corpId,
            onSuccess: function (info) {
              that.$http.get(that.urls + 'special/special/userInfo', {
                params: {
                  'code': info.code,
                }
              }).then((res) => {
                if (res.data !== false) {
                  let data = {};
                  data.name = res.data.name;
                  data.avatar = res.data.avatar;
                  data.phone = res.data.phone;
                  // data.depart = res.data.org[0].name;
                  // data.display_name = res.data.role[0].display_name;
                  sessionStorage.setItem('personal', JSON.stringify(data));
                  globalConfig.personal = data;

                  that.$http.post(that.address + 'oauth/token', {
                    client_secret: globalConfig.client_secret,
                    client_id: globalConfig.client_id,
                    grant_type: 'password',
                    username: res.data.phone,
                    password: res.data.code,
                  }).then((res) => {
                    sessionStorage.setItem('myData', JSON.stringify(res.data.data));
                    let head = res.data.data;
                    globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
                    that.contentDetail(that.pitch);
                    that.disabled = false;
                  });
                }
              })
            },
            onFail: function (err) {
              DingTalkPC.device.notification.alert({
                message: "'" + JSON.stringify(err) + "'",
                title: "'" + JSON.stringify(err) + "'",
                buttonName: "'" + JSON.stringify(err) + "'",
                onSuccess: function () {
                },
                onFail: function (err) {
                }
              });
            }
          });

          dd.ready(function () {
            dd.runtime.permission.requestAuthCode({
              corpId: _config.corpId,
              onSuccess: function (info) {
                that.$http.get(that.urls + 'special/special/userInfo', {
                  params: {
                    'code': info.code,
                  }
                }).then((res) => {
                  if (res.data !== false) {
                    let data = {};
                    data.name = res.data.name;
                    data.avatar = res.data.avatar;
                    data.phone = res.data.phone;
                    // data.depart = res.data.org[0].name;
                    // data.display_name = res.data.role[0].display_name;
                    sessionStorage.setItem('personal', JSON.stringify(data));
                    globalConfig.personal = data;
                    that.$http.post(that.address + 'oauth/token', {
                      client_secret: globalConfig.client_secret,
                      client_id: globalConfig.client_id,
                      grant_type: 'password',
                      username: res.data.phone,
                      password: res.data.code,
                    }).then((res) => {
                      sessionStorage.setItem('myData', JSON.stringify(res.data.data));
                      let head = res.data.data;
                      globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
                      that.contentDetail(that.pitch);
                      that.disabled = false;
                    });
                  } else {
                    setTimeout(() => {
                      alert('请求超时请稍后再试');
                      dd.biz.navigation.close({
                        onSuccess: function (result) {
                        },
                        onFail: function (err) {
                        }
                      });
                    }, 3000);
                  }
                })
              },
              onFail: function (err) {
                alert('fail: ' + JSON.stringify(err));
              }
            });
            // 钉钉头部右侧
            dd.biz.navigation.setRight({
              show: false,
              onSuccess: function (result) {
              },
              onFail: function (err) {
              }
            });
          });
          dd.error(function (err) {
            alert('dd error: ' + JSON.stringify(err));
          });
        })
      }
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
    img {
      width: 100%;
      height: 100%;
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

    .module, .loading {
      position: fixed;
    }

    .module {
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: #f1f1f1;
    }

    .loading {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
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
        @include flow;
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
