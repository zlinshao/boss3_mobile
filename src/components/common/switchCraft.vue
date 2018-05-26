<template>
  <div>
    <div id="switchCraft">
      <button @click="showMenu" class="btnBox" :class="{'btnI': show}"><i :class="text"></i></button>
      <transition name="move">
        <div class="menu" v-show="show">
          <div class="inner inner-1" @click="newly"><i class="iconfont icon-xiugai--"></i></div>
          <div class="inner inner-2"><i class="iconfont icon-jinyong--"></i></div>
          <div class="inner inner-3"><i class="iconfont icon-jinyong--"></i></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "switch-craft",
    props: ['process'],
    data() {
      return {
        show: false,
      }
    },
    mounted() {
    },
    watch: {},
    computed: {
      text() {
        return this.show ? 'iconfont icon-wupinlingyong' : 'iconfont icon-wupinguanli';
      }
    },
    methods: {
      showMenu() {
        this.show = !this.show;
      },
      // 重新提交
      newly() {
        let proID = this.process.processable_id;    //预填ID
        let id = this.process.id;                   //报备ID
        let list = {newID: proID, ids: id, type: 2};
        switch (this.process.processable_type) {
          case 'bulletin_quality'://质量
            this.$router.push({path: '/quality', query: list});
            break;
          case 'bulletin_collect_basic'://收
            this.$router.push({path: '/collectReport', query: list});
            break;
          case 'bulletin_collect_continued'://续收报备
            this.$router.push({path: '/continueCollect', query: list});
            break;
          case 'bulletin_rent_basic'://租
            this.$router.push({path: '/rentReport', query: list});
            break;
          case 'bulletin_rent_trans'://转租
            this.$router.push({path: '/changeRent', query: list});
            break;
          case 'bulletin_rent_continued'://续租
            this.$router.push({path: '/continueRent', query: list});
            break;
          case 'bulletin_rent_RWC'://未收先祖
            this.$router.push({path: '/unCollectBeforeRent', query: list});
            break;
          case 'bulletin_RWC_confirm'://未收先祖确定
            this.$router.push({path: '/unCollectBeforeRentSure', query: list});
            break;
          case 'bulletin_agency'://中介费报备
            this.$router.push({path: '/agencyRent', query: list});
            break;
          case 'bulletin_banish'://清退
            this.$router.push({path: '/clearRetreat', query: list});
            break;
          case 'bulletin_change'://调房
            this.$router.push({path: '/transferReport', query: list});
            break;
          case 'bulletin_lose'://炸单
            this.$router.push({path: '/friedBill', query: list});
            break;
          case 'bulletin_refund'://退款
            this.$router.push({path: '/drawback', query: list});
            break;
          case 'bulletin_retainage'://尾款
            this.$router.push({path: '/finalPayment', query: list});
            break;
          case 'bulletin_special'://特殊
            this.$router.push({path: '/special', query: list});
            break;
          case 'bulletin_checkout'://退租
            this.$router.push({path: '/checkout', query: list});
            break;
        }
      },
    },
  }
</script>

<style lang="scss">
  #switchCraft {
    .btnBox {
      position: fixed;
      bottom: 1.5rem;
      right: 16px;
      z-index: 10;
      width: 50px;
      height: 50px;
      line-height: 48px;
      border-radius: 50%;
      border: none;
      outline: none;
      color: #fff;
      background: #409EFF;
      i {
        display: inline-block;
        margin-left: 2px;
        font-size: 30px;
      }
    }
    .btnI {
      line-height: 45px;
      i {
        margin-left: 1px;
        font-size: 26px;
      }
    }
    .menu {
      position: fixed;
      bottom: 1.5rem;
      right: 16px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      transition: all .7s ease-in;
      &.move-enter-active {
        .inner {
          transform: translate3d(0, 0, 0);
          transition-timing-function: cubic-bezier(0, .57, .44, 1.97);
        }
        .inner-1 {
          transition-delay: .1s;
        }
        .inner-2 {
          transition-delay: .2s;
        }
        .inner-3 {
          transition-delay: .3s;
        }
      }
      &.move-enter, &.move-leave-active {
        .inner {
          transition-timing-function: ease-in-out;
        }
        .inner-1 {
          transform: translate3d(0, 60px, 0);
          transition-delay: .3s;
        }
        .inner-2 {
          transform: translate3d(40px, 40px, 0);
          transition-delay: .2s;
        }
        .inner-3 {
          transform: translate3d(60px, 0, 0);
          transition-delay: .1s;
        }
      }
      .inner {
        display: inline-block;
        position: absolute;
        width: 34px;
        height: 34px;
        line-height: 34px;
        border-radius: 50%;
        background: #F19851;
        text-align: center;
        color: #fff;
        transition: all .4s;
      }
      .inner-1 {
        top: -50px;
        left: 10px;
      }
      .inner-2 {
        left: -30px;
        top: -30px;
        background: #DDDDDD;
      }
      .inner-3 {
        left: -50px;
        top: 10px;
        background: #DDDDDD;
      }
    }
  }
</style>
