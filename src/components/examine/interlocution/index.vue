<template>
  <div id="interLocution">
    <div class="searchClass bgColor">

      <div class="searchCustom" :class="{'inter': interModule}">
        <div class="bgColor">
          <i class="van-icon van-icon-search"></i>
          <input class="bgColor" type="text" @focus="interModule = true" v-model="searchValue" @keyup.enter="search">
          <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p v-if="searchValue.length > 0 && interModule" @click="search" style="color: #666666;">搜索</p>
        <p v-if="searchValue.length < 1 && interModule" @click="onCancel">取消</p>
      </div>

      <div class="interMain" :class="{'mainOver': interModule}">
        <div class="mainContent" v-for="(key,index) in 10">
          <div class="main1 boxShadow">
            <div class="mainTop">
              <div class="mainTopA">
                <p>
                  <img src="../../../assets/head.png">
                  <span>
                  陈静<span>-研发中心符合当时咖啡海枯石烂大量</span>
                </span>
                </p>
              </div>
              <div class="topTime">
                0000-00-00 00:00:00
              </div>
            </div>
            <div class="contents1">
              <p>第十六届三中全会都讲了什么？</p>
              <div>
                中共中央政治局将向中央委员会报告工作，全会将审议中共中央关于完善
                社会主义市场经济体制若干问题的决定和关于修改宪法部分内容的建议两个文件。
              </div>
            </div>
            <div class="interFooter">
              <div @click="showAll(1,index)">6条回答</div>
              <div @click="showAll(2,index)">显示全部</div>
            </div>
          </div>
          <div class="main2" v-if="showHide === index && showStatus">
            <div v-for="(key,num) in 3" class="allContent">
              <div class="mainTop padNone topNone">
                <div class="mainTopA">
                  <p>
                    <img src="../../../assets/head.png">
                    <span>
                  陈静<span>-研发中心符合当时咖啡海枯石烂大量</span>
                </span>
                  </p>
                </div>
                <div class="topTime">
                  0000-00-00 00:00:00
                </div>
              </div>

              <div class="boxShadow" style="border-bottom: 1px solid #E0E0E0;">
                <div class="contents2">
                  <div>
                    中共中央政治局将向中央委员会报告工作，全会将审议中共中央关于完善
                    社会主义市场经济体制若干问题的决定和关于修改宪法部分内容的建议两个文件。
                  </div>
                  <div class="con" @click="commentNum(num)">
                    <i class="iconfont icon-pinglun"></i><span>评论(100)</span>
                  </div>
                </div>
              </div>
              <div class="boxShadow man3" :class="{'marginBot': comments === num && comStatus}">
                <div class="contents3" v-for="key in 10" v-if="comments === num && comStatus">
                  <div class="mainTop padNone">
                    <div class="mainTopA">
                      <p>
                        <img src="../../../assets/head.png">
                        <span>
                        陈静<span>-研发中心符合当时咖啡海枯石烂大量</span>
                      </span>
                      </p>
                    </div>
                    <div class="topTime">
                      0000-00-00 00:00:00
                    </div>
                  </div>
                  <div class="article">
                    中共中央政治局将向中央委员会报告工作，全会将审议中共中央关于完善
                    社会主义市场经济体制若干问题的决定和关于修改宪法部分内容的建议两个文件。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--遮罩-->
      <div v-if="interModule" class="interModule"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        searchValue: '',
        interModule: false,
        showHide: '',
        showStatus: false,
        comments: '',
        comStatus: false,
      }
    },
    mounted() {
    },
    methods: {
      search() {

      },
      onCancel() {
        this.interModule = false;
      },
      showAll(val, index) {
        if (val === 2) {
          if (this.showHide === index) {
            this.showStatus = !this.showStatus;
          } else {
            this.showStatus = true;
            this.showHide = index;
          }

        }
      },
      commentNum(index) {
        if (this.comments === index) {
          this.comStatus = !this.comStatus;
        } else {
          this.comStatus = true;
          this.comments = index;
        }

      },
      commentOn() {

      }
    },
  }
</script>

<style lang="scss">
  #interLocution {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    $colorTitle: #212121;
    $colorLeft: #FF4081;
    $colorRight: #536DFE;
    $colorP: #757575;
    $bottom: 1px solid #E0E0E0;
    $bgColor: #F8F9FF;

    @mixin boxShadow {
      -webkit-box-shadow: 0 6px 10px rgba(61, 90, 254, .1);
      -moz-box-shadow: 0 6px 10px rgba(61, 90, 254, .1);
      box-shadow: 0 6px 10px rgba(61, 90, 254, .1);
    }
    .bgColor {
      background-color: $bgColor;
    }
    .boxShadow {
      @include boxShadow;
    }
    .interMain {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      height: 88%;
      .main1 {
        padding: .2rem;
        background: #FFFFFF;
      }

      .mainContent {
        margin-bottom: .2rem;
        .contents1 {
          border-top: $bottom;
          p {
            color: $colorTitle;
            padding: .2rem 0;
            font-size: .30rem;
          }
          div {
            color: $colorP;
            line-height: .36rem;
          }
        }
        .contents2 {
          margin: 0 .36rem 0 1.1rem;
          div {
            color: $colorTitle;
            line-height: .36rem;
          }
          .con {
            color: #BDBDBD;;
            margin: .16rem 0 0;
            width: 1.8rem;
            padding-bottom: .2rem;
            span {
              font-size: .2rem;
              vertical-align: top;
            }
          }
        }
        .contents3 {
          .article {
            margin: 0 .2rem 0 1.1rem;
            padding-bottom: .3rem;
            line-height: .36rem;
            border-bottom: $bottom;
          }
        }
        .contents3:last-of-type {
          .article {
            border-bottom: 0;
          }
        }
        .interFooter {
          @include flex;
          justify-content: space-between;
          align-items: center;
          border-top: $bottom;
          margin-top: .2rem;
          padding-top: .2rem;
          div:first-of-type {
            color: $colorLeft;
          }
          div:last-of-type {
            color: $colorRight;
          }
        }
        .padNone {
          padding: 0;
        }
      }
      .main2 {
        padding: .2rem 0 0;
        .allContent {
          .mainTop {
            padding: .1rem .2rem 0;
          }
          .man3 {
            margin: 0 .2rem;
          }
          .marginBot {
            margin-bottom: .12rem;
          }
        }
      }
    }
    .mainTop {
      @include flex;
      justify-content: space-between;
      align-items: center;
      color: $colorP;
      padding-bottom: .2rem;
      .mainTopA {
        p {
          @include flex;
          justify-content: center;
          align-items: center;
          img {
            width: .7rem;
            height: .7rem;
            margin-right: .2rem;
          }
          span {
            width: 2.6rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .topTime {
        min-width: 3rem;
        text-align: right;
      }
    }
    .topNone {
      background-color: $bgColor;
    }

    .interModule {
      position: fixed;
      background-color: rgba(0, 0, 0, .4);
      top: 1.4rem;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .searchCustom {
      height: 1.41rem;
      padding: .24rem .3rem;
      border-top: .16rem solid $bgColor;
      border-bottom: $bottom;
      background-color: #FFFFFF;
    }

    .inter {
      padding: .24rem 0 .24rem .3rem;
    }

    .mainOver {
      overflow-y: hidden;
    }
  }
</style>
