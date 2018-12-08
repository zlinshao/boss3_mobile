<template>
  <div id="allDetail" :style="{'height': allHeight + 'px'}">
    <div class="banner">
      <div>最终实发金额</div>
      <div>{{allDetail.amount_due ? allDetail.amount_due : '/'}}</div>
    </div>
    <div class="detailModule">
      <div>
        <div v-for="item in lists">
          <div class="detailTops">
            <img :src="item.iconDetail" alt="">
            <span :style="{'color': item.color}">{{item.title}}</span>
            <span :style="{'color': item.color}">{{item.smallTitle}}</span>
          </div>
          <div class="detailList">
            <div v-for="key in Object.keys(item.data)">
              <span>{{item.data[key]}}</span>
              <span>￥{{allDetail[key] ? allDetail[key] : '/'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "all-detail",
    data() {
      return {
        allHeight: '',
        allDetail: {},
        lists: [
          {
            // 绩效
            title: '绩效',
            smallTitle: 'Performance',
            color: '#7668CE',
            iconDetail: require('../../../assets/salary/jixiaoicon@3x.png'),
            data: Object.assign({}, JSON.parse(JSON.stringify(salaryPerformance)), {'push_money': '提成工资'}),
          },
          {
            // 奖励
            title: '奖励',
            smallTitle: 'Reward',
            color: '#23C1BE',
            iconDetail: require('../../../assets/salary/jiangliicon@3x.png'),
            data: salaryReward,
          },
          {
            // 扣款
            title: '扣款',
            smallTitle: 'Deductions',
            color: '#E56BB2',
            iconDetail: require('../../../assets/salary/koukuanicon@3x.png'),
            data: Object.assign({}, JSON.parse(JSON.stringify(salaryDeductions)), {
              'final_money_complete': '尾款不齐',
              'doc_complete': '资料不齐',
              'cut_sum': '应扣合计'
            }),
          },
          {
            // 其他款项
            title: '其他款项',
            smallTitle: 'Other payments',
            color: '#EF6566',
            iconDetail: require('../../../assets/salary/qitakuanxiangicon@3x.png'),
            data: salaryOther,
          },
        ],
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.routerIndex(from.path);
        vm.ddRent(from.path);
      })
    },
    mounted() {
    },
    activated() {
      this.$nextTick(function () {
        this.allHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollTo(0, 0);
      });
      if (sessionStorage.salary) {
        this.allDetail = JSON.parse(sessionStorage.salary).salary_detail;
      } else {
        this.allDetail = {};
      }
      console.log(this.allDetail)
    },
    watch: {},
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  @import "../../../../static/common.scss";

  #allDetail {
    background: #1C1A36;
    .detailModule {
      height: 10rem;
      position: relative;
      > div {
        position: absolute;
        top: -.3rem;
        left: .3rem;
        right: .3rem;
        bottom: .3rem;
        > div {
          margin-bottom: .2rem;
          background: #fff;
          border-radius: .05rem;
          padding: .3rem .6rem .6rem;
          .detailTops {
            @include flex('');
            align-items: flex-end;
            padding: 0 0 .3rem .3rem;
            border-bottom: .01rem solid #F2F2F2;
            img {
              width: .38rem;
              height: .38rem;
              margin-right: .24rem;
            }
            span:last-of-type {
              font-size: .16rem;
              padding-left: .3rem;
            }
          }
        }
      }
    }
    .detailList {
      @include flex('centerSpace');
      flex-wrap: wrap;
      color: #212121;
      div {
        text-align: center;
        margin-top: .5rem;
        width: 50%;
        @include flex('center');
        span {
          padding: 0 .08rem;
        }
        span:first-of-type {
          font-size: .24rem;
          text-align: right;
          width: 55%;
        }
        span:last-of-type {
          font-size: .3rem;
          text-align: left;
          width: 45%;
        }
      }
    }
    .banner {
      height: 3rem;
      @include backgroundImage('../../../assets/salary/banner@3x.png');
      div {
        width: 38%;
        text-align: right;
        color: #fff;
        padding-top: .6rem;
      }
      div:last-of-type {
        font-size: .6rem;
      }
    }
  }
</style>
