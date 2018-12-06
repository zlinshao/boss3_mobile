<template>
  <div id='personalSalary' :style="{'height': allHeight + 'px'}">
    <div class="dateParams">
      <div @click="timeChoose('date', params.date)">
        <i class="colorE192 iconfont icon-richengguanli"></i>
        <span>{{params.date}}</span>
        <i class="selectDate iconfont icon-xiayibu"></i>
      </div>
    </div>
    <div class="dataMain">
      <div class="scrollMain">
        <div class="mainTop" :class="'mainTop' + index" v-for="(item,index) in modules">
          <div class="moneyIcon"></div>
          <div class="moneyTitle">
            {{item.title}}
          </div>
          <div class="money">
            ￥{{item.money}}
          </div>
        </div>
      </div>
    </div>
    <div class="ranking">
      <div class="rankTop"></div>
      <div class="rankMoney">
        <div class="tableTop">
          <div class="diagonal">
            <div>分类</div>
            <div class="diagonalLine"></div>
            <div>排名</div>
          </div>
          <div>片区排名</div>
          <div>大区排名</div>
        </div>
        <div v-for="item in moneyType">
          <div>{{item.title}}</div>
          <div class="rankNum">
            <div class="rankNumLine">
              <div class="colorC400">{{item.areaRanking}}</div>
              <div class="diagonalLine"></div>
            </div>
            <div class="numberCss">{{item.allArea}}</div>
          </div>
          <div class="rankNum">
            <div class="rankNumLine">
              <div class="colorC4ff">{{item.largeAreaRank}}</div>
              <div class="diagonalLine"></div>
            </div>
            <div class="numberCss">{{item.allLargeArea}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--日期-->
    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></ChooseTime>
  </div>
</template>

<script>
  import ChooseTime from '../../common/chooseTime.vue'

  export default {
    name: "index",
    components: {ChooseTime},
    data() {
      return {
        allHeight: '',
        timeModule: false,          //日期状态
        formatData: {
          dateVal: '',              //格式化日期
          dataKey: '',              //字段区分
          dateType: '',
        },
        params: {
          date: '2018-12-06',
        },
        modules: [
          {
            title: '奖励',
            money: '1000',
          },
          {
            title: '绩效',
            money: '2000',
          },
          {
            title: '本月工资',
            money: '20000',
          },
          {
            title: '扣款',
            money: '300',
          },
          {
            title: '其他款项',
            money: '3000',
          },
        ],
        moneyType: [
          {
            title: '工资',
            areaRanking: 6,
            allArea: 20,
            allLargeArea: 125,
            largeAreaRank: 100,
          },
          {
            title: '绩效',
            areaRanking: 3,
            allArea: 20,
            allLargeArea: 125,
            largeAreaRank: 80,
          },
          {
            title: '奖励',
            areaRanking: 18,
            allArea: 20,
            allLargeArea: 125,
            largeAreaRank: 12,
          },
          {
            title: '扣款',
            areaRanking: 1,
            allArea: 20,
            allLargeArea: 125,
            largeAreaRank: 12,
          },
        ]
      }
    },
    mounted() {
    },
    activated() {
      this.allHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let dataMain = $('.dataMain');
      let scrollMain = $('.scrollMain');
      dataMain.scrollLeft((Number(scrollMain.css('width').split('px')[0]) / 2.8));
    },
    watch: {},
    computed: {},
    methods: {
      routerLink() {
        this.$router.push({path: '/personalDetail'});
      },
      // 显示日期
      timeChoose(val, time) {
        setTimeout(() => {
          this.timeModule = true;
        }, 200);
        this.formatData.dateVal = time;
        this.formatData.dataKey = val;
        this.formatData.dateType = 'date';
      },
      // 确定日期
      onConTime(val) {
        this.params[val.dataKey] = val.dateVal;
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.timeModule = false;
      },
    },
  }
</script>

<style lang="scss">
  @import "../../../../static/common.scss";

  #personalSalary {
    color: #fff;
    @include backgroundImage('../../../assets/salary/backgroundimage@3x.png');
    .dateParams {
      @include flex('center');
      padding: 0.4rem 0;
      div {
        @include flex('center');
        padding: .2rem .3rem;
        @include radius(.6rem);
        background: rgba(255, 255, 255, .1);
        span {
          margin: 0 .2rem;
        }
        i {
          font-size: .28rem;
        }
        .selectDate {
          transform: rotate(90deg);
        }
      }
    }
    .dataMain {
      div {
        font-size: .26rem;
      }
      width: 100%;
      overflow: auto;
      .scrollMain {
        @include flex('itemCenter');
        width: 26rem;
        padding: 0 .2rem;
        .mainTop + .mainTop {
          margin-left: .3rem;
        }
        .mainTop {
          @include flex('center');
          @include radius(.1rem);
          flex-direction: column;
          width: 5rem;
          height: 3rem;
          .moneyIcon {
            width: .65rem;
            height: .65rem;
            @include radius(50%);
          }
          .moneyTitle {
            margin: .3rem 0;
          }
          .money {
            font-size: .6rem;
          }
        }
        .mainTop0 {
          @include backgroundImage('../../../assets/salary/jiangli@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/jiangli.png');
          }
        }
        .mainTop1 {
          @include backgroundImage('../../../assets/salary/jixiao@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/jixiao.png');
          }
        }
        .mainTop2 {
          @include backgroundImage('../../../assets/salary/benyuegongzi@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/benyuegongzi.png');
          }
        }
        .mainTop3 {
          @include backgroundImage('../../../assets/salary/koukuan@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/koukuan.png');
          }
        }
        .mainTop4 {
          @include backgroundImage('../../../assets/salary/qitakuanxiang@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/qitakuanxiang.png');
          }
        }
      }
    }
    .ranking {
      margin: 0.6rem .3rem;
      @include radius(.05rem);
      border: .01rem solid #BD4D8B;
      border-top: none;
      .rankTop {
        height: 1.50rem;
        @include backgroundImage('../../../assets/salary/wodepaiming-ill@3x.png');
      }
      .rankMoney {
        padding-bottom: .36rem;
        > div {
          width: 100%;
          margin-top: .4rem;
          @include flex('itemBet');
          > div {
            @include flex('itemBet');
            width: 33.33%;
            justify-content: center;
          }
        }
        .tableTop {
          padding: .2rem 0;
        }
        .diagonal {
          @include flex('');
          div:first-of-type {
            margin-top: .6rem;
          }
          div:last-of-type {
            margin-bottom: .6rem;
          }
          .diagonalLine {
            height: 1rem;
            border-left: .02rem solid #fff;
            transform: rotate(-55deg);
          }
        }
        .rankNum {
          @include flex('');
          .rankNumLine {
            @include flex('');
          }
          .colorC400, .colorC4ff {
            font-size: .4rem;
          }
          .numberCss {
            font-size: .2rem;
            margin-top: .3rem;
            color: rgba(255, 255, 255, .6);
          }
          .diagonalLine {
            height: .6rem;
            margin-left: .1rem;
            border-left: .02rem solid rgba(255, 255, 255, .2);
            transform: rotate(36deg);
          }
        }
      }
    }
    .colorE192 {
      color: #FFE192;
    }
    .colorC400 {
      color: #FFC400;
    }
    .colorC4ff {
      color: #40C4FF;
    }
  }
</style>
