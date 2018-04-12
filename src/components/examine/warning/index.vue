<template>
  <div id="warning">
    <div class="disappear" v-if="recall">
      <div class="a1">
        <img src="../../../assets/disappear.png">
      </div>
      <div class="a2">{{titles}}</div>
    </div>
    <div class="navTop" v-if="recall1">
      <div class="top0">
        <div class="top1">
          {{myData.title}}
        </div>
        <div class="top2">
          <span>{{myData.date}}</span>
          <span>南京乐伽商业管理有限公司</span>
        </div>
      </div>
      <div class="top3">
        <b>
          <i class="iconfont icon-yanjing"></i>
          <span>{{myData.read_count}}人</span>
        </b>
        <b>
          <i class="iconfont icon-yanjingclose"></i>
          <span>{{myData.unread_count}}人</span>
        </b>
      </div>
    </div>
    <div class="mainWarning" v-if="recall1">
      <div class="mainTop">公司各部门：</div>
      <div class="mainTitle">
        <p v-html="myData.content"></p>
      </div>
      <div class="mainFooter">
        <div>
          <p>南京乐伽商业管理有限公司</p>
          <p>{{myData.date}}</p>
        </div>
      </div>
    </div>
    <div class="appendix" v-if="recall1 && attachment.length !== 0">
      <div class="appendixMain">
        <div class="appendixTitle">附件：</div>
        <a class="upload" v-for="key in attachment" :href="key.uri">
          <p v-if="key.uri.indexOf('.docx') > -1 || key.uri.indexOf('.doc') > -1" class="a1"></p>
          <p v-if="key.uri.indexOf('.xls') > -1" class="a2"></p>
          <p v-if="key.uri.indexOf('.txt') > -1" class="a3"></p>
          <p v-if="key.uri.indexOf('.pdf') > -1" class="a4"></p>
          <p v-if="key.uri.indexOf('.jpg') > -1" class="a5"></p>
          <p v-if="key.uri.indexOf('.png') > -1" class="a5"></p>
          <p v-if="key.uri.indexOf('.pptx') > -1" class="a5"></p>
          <span>{{key.data.display_name}}</span>
        </a>
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
        address: globalConfig.attestation,
        myData: {},
        attachment: {},
        ids: '',
        recall: false,
        recall1: false,
        titles: '',
      }
    },
    mounted() {
      this.ids = this.$route.query.id;
      this.ddRent('', 'close');
      this.recall = false;
      this.recall1 = false;
      this.warningList(this.ids);
    },
    watch: {},
    methods: {
      warningList(val) {
        this.$http.get(this.urls + 'announcement/' + val).then((res) => {
          if (res.data.code === "80010") {
            this.myData = res.data.data;
            this.attachment = res.data.data.attachment;
            this.recall = false;
            this.recall1 = true;
          } else if (res.data.code === "80044") {
            this.recall = true;
            this.recall1 = false;
            this.titles = '此消息已被撤回';
          } else if (res.data === 'pass') {
            this.warningList(val);
          } else {
            this.recall = true;
            this.recall1 = false;
            this.titles = '此消息消失不见了';
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  #warning {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    @mixin bgPic($n) {
      background: url($n) no-repeat;
      background-size: 100% 100%;
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

    .navTop {
      padding: .4rem;
      /*margin-top: .4rem;*/
      height: 3.54rem;
      background: url("../../../assets/shenp1.jpg") no-repeat;
      background-size: 100% 100%;
      @include flex;
      flex-wrap: wrap;
      align-content: space-between;
      .top0 {
        width: 100%;
        .top1 {
          color: #ff943e;
          font-weight: bold;
          font-size: .4rem;
          margin-bottom: .3rem;
        }
        .top2 {
          width: 100%;
          @include flex;
          justify-content: space-between;
        }
      }
      .top3 {
        width: 100%;
        @include flex;
        justify-content: flex-end;
        b {
          @include flex;
          margin-left: .36rem;
          i {
            color: #e0e0e0;
            padding-right: .1rem;
            font-size: .36rem;
          }
        }
      }
    }

    .mainWarning {
      padding: .4rem;
      @include flex;
      flex-wrap: wrap;
      align-content: space-around;
      .mainTop, .mainTitle, .mainFooter {
        width: 100%;
      }
      .mainTitle {
        line-height: .5rem;
        margin: .36rem 0 .6rem;
      }
      .mainFooter {
        @include flex;
        justify-content: flex-end;
        div {
          p {
            margin: .12rem 0;
            text-align: center;
          }
        }
      }
    }
    .appendix {
      .appendixMain {
        padding: .3rem;
        border-top: .03rem solid #DDDDDD;
        .appendixTitle {

        }
        .upload {
          @include flex;
          align-items: center;
          margin-top: .3rem;
          p {
            min-width: .8rem;
            min-height: .8rem;
            margin-right: .2rem;
          }
          .a1 {
            @include bgPic("../../../assets/doc.png");
          }
          .a2 {
            @include bgPic("../../../assets/xls.png");
          }
          .a3 {
            @include bgPic("../../../assets/txt.png");
          }
          .a4 {
            @include bgPic("../../../assets/pdf.png");
          }
          .a5 {
            @include bgPic("../../../assets/file.png");
          }
        }
      }

    }
  }
</style>
