<template>
  <div id="writings">
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
        <i class="iconfont icon-pinglun" style="padding: 0 .1rem;"></i>10
        <i class="iconfont icon-zan"></i>10
        <i class="iconfont icon-yanjing" style="padding: 0 .1rem;"></i>10
      </div>
      <div class="nextPrev">
        <p @click="routerLink(before_content.id)">上一篇：<span>{{before_content.title}}</span></p>
        <p @click="routerLink(next_content.id)">下一篇：<span>{{next_content.title}}</span></p>
      </div>
    </div>

    <div class="commentArea">
      <div class="headline">评论<span>{{commentList.length}}</span></div>
      <div class="commentAreaMain" v-for="key in commentList">
        <div class="staff">
          <div>
            <p>
              <img :src="key.staffs.avatar" alt="">
            </p>
            <span>{{key.staffs.name}}</span>
            <span v-for="role in key.staffs.role">{{role.display_name}}</span>
          </div>
          <p>
            {{key.create_time.substring(0,10)}}
          </p>
        </div>
        <!--{{key.staffs.name}}-->
        <!--{{key.staffs.avatar}}-->
        <!--<span v-for="role in key.staffs.role">-->
        <!--{{role.display_name}}-->
        <!--</span>-->
        <!--<div>{{key.content}}</div>-->
        <!--<div class="commentTitle">-->
        <!--<div class="staff">-->
        <!--<p>-->
        <!--<img :src="key.user.avatar" v-if="key.user.avatar !== ''">-->
        <!--<img src="../../../assets/head.png" v-else>-->
        <!--</p>-->
        <!--<span class="a" v-for="(item,index) in key.user.org" v-if="index === 0">-->
        <!--{{item.name}}&nbsp;-&nbsp;<span v-for="(i,index) in key.user.role" v-if="index === 0">{{i.display_name}}-->
        <!--</span>-->
        <!--</span>-->
        <!--</div>-->
        <!--<div class="times">-->
        <!--{{key.created_at}}-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="contents">-->
        <!--{{key.body}}-->
        <!--</div>-->
        <!--<div class="pics">-->
        <!--<div v-for="(p,index) in key.album">-->
        <!--<img :src="p.uri" @click="pics(key.album,index,2)">-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <div v-if="commentList.length === 0" style="text-align: center;padding: .3rem 0;">
        暂无评论
      </div>

      <div class="footer">
        评论
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        myData: {},
        cover_pic: {},
        create_time: '',
        before_content: {},
        next_content: {},
        params: {},
        commentList: [],
      }
    },
    mounted() {
      let data = this.$route.query.id;
      this.contentDetail(data);
    },
    watch: {},
    methods: {
      contentDetail(val) {
        this.$http.get(this.urls + 'oa/portal/' + val).then((res) => {
          this.myData = res.data.data;
          this.create_time = res.data.data.create_time;
          this.before_content = res.data.data.before_content;
          this.next_content = res.data.data.next_content;
          this.cover_pic = res.data.data.album.cover_pic;
          this.comment(val, 1);

        })
      },
      comment(val, page) {
        this.params.page = page;
        this.$http.get(this.urls + 'oa/portal/comment/' + val, {
          params: this.params,
        }).then((res) => {
          this.commentList = res.data.data.data;
        })
      },
      routerLink(val) {
        this.$router.push({path: '/writings', query: {id: val}});
        this.contentDetail(val);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
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
      text-align: right;
      padding: .3rem 0;
      border-bottom: 1px solid #f1f1f1;
      i {
        vertical-align: middle;
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
      p {
        @include minMaxWidth(5rem);
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
        .staff {
          @include flex;
          align-items: center;
          @include border_radius(50%);
          p {
            @include minMaxWidth(.9rem);
            @include minMaxHeight(.9rem);
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
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
    .footer {
      border-top: 1px solid #ebebeb;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rem;
      background: #FFFFFF;
      z-index: 999;
      @include flex;
      justify-content: space-around;
      align-items: center;
      div {
        color: #409EFF;
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        text-align: center;
      }
      div + div {
        border-left: 1px solid #ebebeb;
      }
    }
  }
</style>
