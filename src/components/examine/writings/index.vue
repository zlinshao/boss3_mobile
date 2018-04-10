<template>
  <div>fffffffffffffffffdsfsdfsdafsadfsdafffffffff</div>
</template>

<script>


  export default {
    name: "index",
    data() {
      return {

      }
    },

    methods: {
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
          alert(JSON.stringify(this.myData));
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
          console.log(val[key]);
          for (let i = 0; i < val[key].length; i++) {
            photo.push(val[key][i].uri);
          }
        }
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
