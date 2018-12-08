<template>
  <div id='personalSalary' :style="{'height': allHeight + 'px'}">
    <div class="dateParams">
      <div @click="timeChoose('date', date)">
        <i class="colorE192 iconfont icon-richengguanli"></i>
        <span>{{params.date}}</span>
        <i class="selectDate iconfont icon-xiayibu"></i>
      </div>
    </div>
    <div class="dataMain">
      <div class="scrollMain">
        <div class="mainTop" :class="'mainTop' + item.id" v-for="item in modules" @click="clickModule(item)">
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

    <SalaryModule :module="salaryDetail" :detail="details" @close="onCancel"></SalaryModule>
  </div>
</template>

<script>
  import ChooseTime from '../../common/chooseTime.vue'
  import SalaryModule from './detail.vue'

  export default {
    name: "index",
    components: {ChooseTime, SalaryModule},
    data() {
      return {
        urls: globalConfig.server,
        allHeight: '',
        salaryDetail: false,        //工资详情
        timeModule: false,          //日期状态
        formatData: {
          dateVal: '',              //格式化日期
          dataKey: '',              //字段区分
          dateType: '',
        },
        params: {
          date: '',
        },
        date: '',
        details: {},
        modules: [
          {
            id: 1,
            title: '总奖励',
            money: '/',
            color: '#23C1BE',
            iconDetail: require('../../../assets/salary/zongjiangli@3x.png'),
            data: {},
          },
          {
            id: 2,
            title: '总绩效',
            money: '/',
            color: '#7668CE',
            iconDetail: require('../../../assets/salary/jixiao-bai@3x.png'),

          },
          {
            id: 3,
            title: '本月工资',
            money: '/',
            color: '',
            iconDetail: '',
            data: {},
          },
          {
            id: 4,
            title: '扣款合计',
            money: '/',
            color: '#E56BB2',
            iconDetail: require('../../../assets/salary/koukuan-bai@3x.png'),
            data: {},
          },
          {
            id: 5,
            title: '其他款项合计',
            money: '/',
            color: '#EF6566',
            iconDetail: require('../../../assets/salary/qitakuanxiang-bai@3x.png'),
            data: {},
          },
        ],
        moneyType: [
          {
            title: '工资',
            areaRanking: '/',
            allArea: '/',
            allLargeArea: '/',
            largeAreaRank: '/',
          },
          {
            title: '绩效',
            areaRanking: '',
            allArea: '',
            allLargeArea: '',
            largeAreaRank: '',
          },
          {
            title: '奖励',
            areaRanking: '',
            allArea: '',
            allLargeArea: '',
            largeAreaRank: '',
          },
          {
            title: '扣款',
            areaRanking: '',
            allArea: '',
            allLargeArea: '',
            largeAreaRank: '',
          },
        ]
      }
    },
    mounted() {
      this.date = this.formatDate(new Date(), 'date', 'pre');
      this.params.date = this.date.substring(0, 7);
      this.getList();
    },
    activated() {
      this.routerIndex('');
      this.ddRent('');
      this.$nextTick(function () {
        this.allHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollTo(0, 0);
      });
      let dataMain = $('.dataMain');
      let scrollMain = $('.scrollMain');
      dataMain.scrollLeft((Number(scrollMain.css('width').split('px')[0]) / 2.8));
    },
    watch: {},
    computed: {},
    methods: {
      getList() {
        this.$http.get(this.urls + 'salary/sala/getSalarySummary', {
          params: this.params,
        }).then(res => {
          if (res.data.code === '88800') {
            let data = res.data.data;
            sessionStorage.setItem('salary', JSON.stringify(data));
            this.summary(data.summary);
            this.ranking(data.Ranking);
            this.moduleDetail(data.salary_detail);
          } else {
            sessionStorage.setItem('salary', '');
            this.modules.forEach((arr, index) => {
              this.modules[index].money = '/';
              this.modules[index].data = {};
            });
            this.moneyType.forEach((arr, index) => {
              this.moneyType[index].allArea = '';
              this.moneyType[index].areaRanking = '';
              this.moneyType[index].allLargeArea = '';
              this.moneyType[index].largeAreaRank = '';
            })
          }
        })
      },
      // 总工资
      summary(sum) {
        this.modules[0].money = sum.award;
        this.modules[1].money = sum.achievement;
        this.modules[2].money = sum.salary;
        this.modules[3].money = sum.cut;
        this.modules[4].money = sum.other;
      },
      // 排名
      ranking(ran) {
        this.moneyType[0].allArea = ran.group_ranking.a;//片区
        this.moneyType[0].areaRanking = ran.group_ranking.p;//片区
        this.moneyType[0].allLargeArea = ran.area_ranking.a;//区域
        this.moneyType[0].largeAreaRank = ran.area_ranking.p;//区域
      },
      // 详情
      moduleDetail(data) {
        this.modules.forEach((res, index) => {
          this.modules[index].data = data;
        })
      },
      clickModule(val) {
        this.details = val;
        if (val.id === 3) {
          this.$router.push('/allDetail');
          return;
        }
        this.salaryDetail = true;
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
        this.params[val.dataKey] = val.dateVal.substring(0, 7);
        this.date = val.dateVal;
        this.getList();
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.salaryDetail = false;
        this.timeModule = false;
        this.routerIndex('');
        this.ddRent('');
      },
    },
  }
</script>

<style lang="scss">
  @import "../../../../static/common.scss";

  #personalSalary {
    color: #fff;
    padding-bottom: .5rem;
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
      -webkit-overflow-scrolling: touch;
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
        .mainTop1 {
          @include backgroundImage('../../../assets/salary/jiangli@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/jiangli.png');
          }
        }
        .mainTop2 {
          @include backgroundImage('../../../assets/salary/jixiao@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/jixiao.png');
          }
        }
        .mainTop3 {
          @include backgroundImage('../../../assets/salary/benyuegongzi@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/benyuegongzi.png');
          }
        }
        .mainTop4 {
          @include backgroundImage('../../../assets/salary/koukuan@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/koukuan.png');
          }
        }
        .mainTop5 {
          @include backgroundImage('../../../assets/salary/qitakuanxiang@3x.png');
          .moneyIcon {
            @include backgroundImage('../../../assets/salary/qitakuanxiang.png');
          }
        }
      }
    }
    .ranking {
      margin: 0.5rem .3rem 0;
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
