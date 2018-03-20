<template>
  <div id="cardDetail" v-wechat-title="$route.meta.title">
    <div class="detail">
      <div class="detailLeft">
        <div>
          <img src="../../../assets/head.png" alt="">
        </div>
      </div>
      <div class="topRight">
        <div class="personal">
          <p>李巧俊</p>
          <p>研发部-产品经理方式发士大夫撒旦撒</p>
        </div>
        <div style="height: 1.4rem;">

        </div>
      </div>
    </div>

    <div class="detailRight">
      <!--收房报备-->
      <div class="topTitle">
        <div v-for="(key,index) in formList" v-if="index !== '领导报备截图'">
          <p>{{index}}</p>
          <h1>{{key}}</h1>
        </div>
        <div class="photo" v-else>
          <p>{{index}}</p>
          <h1>
            <span v-for="(pic,index) in key">
              <img @click="pics(key,index)" :src="pic" alt="">
            </span>
          </h1>
        </div>
      </div>
    </div>

    <div class="footer">
      <div v-if="!comment" v-for="(key,index) in operation" @click="manager(index)">{{key}}</div>
      <div v-if="comment">评论</div>
    </div>
  </div>
</template>

<script>
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {ImagePreview, Toast},
    data() {
      return {
        pitch: '',
        active: false,
        comment: false,
        urls: globalConfig.server_user,
        formList: {

        },
        operation: {},
        screenshot: [],
        user: {},
        names: {},

        columns: [
          {
            values: ['1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室'],
            className: 'column1',
            defaultIndex: 0
          },
          {
            values: ['0厅', '1厅', '2厅', '3厅'],
            className: 'column2',
            defaultIndex: 0
          },
          {
            values: ['0卫', '1卫', '2卫', '3卫'],
            className: 'column3',
            defaultIndex: 0
          }
        ]
      }
    },
    mounted() {
      this.pitch = this.$route.query.ids;
      this.formDetail(this.$route.query.ids);
    },
    watch: {},
    methods: {
      onChange(picker, values) {
        console.log(picker);
        console.log(values);
      },

      formDetail(val) {
        this.$http.get(this.urls + 'api/v1/process/' + val).then((res) => {
          if (res.data.status === 'success') {
            this.formList = res.data.data.process.content;
            if (res.data.data.process.content.screenshot !== undefined) {
              this.screenshot = res.data.data.process.content.screenshot.pic_addresses;
            } else {
              this.screenshot = res.data.data.process.content.screenshot_leader.pic_addresses;
            }
            this.operation = res.data.data.operation;
            this.user = res.data.data.process.user;
            this.names = res.data.data.process.content.trans_type;
          }
        });
      },
      pics(val, index) {
        ImagePreview(val, index);
      },
      manager(val) {
        // this.active = true;
        this.$http.put(this.urls + 'api/v1/process/' + this.pitch, {
          operation: val,
        }).then((res) => {
          if (res.data.status === 'success') {
            Toast.success(res.data.message);
            this.comment = true;
          } else {
            Toast(res.data.message);
          }
        })
      }
    },
  }
</script>

<style scoped lang="scss">
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

  #cardDetail {
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
      background: #ffffff;
      padding: .3rem;
      .detailLeft {
        min-width: .9rem;
        max-width: .9rem;
        margin-right: .3rem;
        div {
          height: .9rem;
          margin-top: .34rem;
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
          background: url('../../../assets/shibai.jpg') no-repeat;
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
        margin-bottom: 1.5rem;
        background: #ffffff;
        div {
          margin: .2rem 0;
          @include flex;
          width: 100%;
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
      }
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
      color: $onColor;
      width: 100%;
      height: .6rem;
      line-height: .6rem;
      text-align: center;
    }
    div + div {
      border-left: 1px solid #ebebeb;
    }
  }
</style>
