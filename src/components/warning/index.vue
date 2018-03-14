<template>
  <div>
    <div class="navTop">
      <div class="top0">
        <div class="top1">关于杜帅警告通知</div>
        <div class="top2">
          <span>0000-00-00</span>
          <span>南京乐伽商业管理有限公司</span>
        </div>
      </div>
      <div class="top3">
        <b>
          <i class="iconfont icon-yanjing"></i>
          <span>200人</span>
        </b>
        <b>
          <i class="iconfont icon-yanjingclose"></i>
          <span>197人</span>
        </b>
      </div>
    </div>
    <div class="main">
      <div class="mainTop">公司各部门：</div>
      <div class="mainTitle">
        <p>发挥空间的福利卡飞回家看电视了风华绝代开始了符合快点进来撒法的环境开发和肯德基萨芬空间的萨芬看见了十大克里斯蒂安和看见了十大发的空间斯拉夫和等级考试啦发货看见了十大发好的尽快撒</p>
      </div>
      <div class="mainFooter">
        <div>
          <p>南京乐伽商业管理有限公司</p>
          <p>0000-00-00</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    },
    mounted() {
    },
    watch: {},
    methods: {},
  }
</script>

<style scoped lang="scss">
  @mixin flex {
    display: flex;
    display: -webkit-flex;
  }

  .navTop {
    padding: .4rem;
    margin-top: .4rem;
    height: 3.54rem;
    background: url("../../assets/shenp1.jpg") no-repeat;
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

  .main {
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
</style>
