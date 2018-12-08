<template>
  <div>
    <div v-if="salaryModule" class="salaryModule">
      <div class="moneyDetail">
        <div class="detailTop" :class="'detail' + detail.id">
          <img :src="detail.iconDetail" alt="">
          <span>{{detail.title}}</span>
        </div>
        <div>
          <div class="money" :style="{'color': detail.color}">￥{{detail.money}}</div>
          <div class="detailList" :class="{'lengths': Object.keys(detailList).length > 8}">
            <div v-for="item in Object.keys(detailList)">
              <span>{{detailList[item]}}</span>
              <span>￥{{detail.data[item] ? detail.data[item] : '/'}}</span>
            </div>
          </div>
        </div>
        <div class="closeBtn" @click="salaryModule = false">
          <i class="iconfont icon-guanbi"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "detail",
    props: ['module', 'detail'],
    data() {
      return {
        salaryModule: false,
        detailList: {},
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.salaryModule = val;
      },
      salaryModule(val) {
        if (!val) {
          this.$emit('close');
        } else {
          this.lists();
        }
      }
    },
    computed: {},
    methods: {
      lists() {
        switch (this.detail.id) {
          case 1:
            this.detailList = {
              'old_lord_award': '原收房奖励',
              'old_rent_award': '原租房奖励',
              'new_basic_achv': '新绩效工资奖励',
              'new_secondrent_award': '新绩效续租奖励',
              'lord_overflow_award': '收益价奖励',
              'lord_award': '收房奖励',
              'rent_award': '租房奖励',
            };
            break;
          case 2:
            this.detailList = {
              'old_basic_achv': '老绩效工资',
              'new_basic_achv': '新绩效工资',
            };
            break;
          case 4:
            this.detailList = {
              'late_cut': '迟到扣款',
              'personal_leave_cut': '事假扣款',
              'sick_leave_cut': '病假扣款',
              'missing_date_money': '缺勤扣款',
              'missing_cut_money': '缺卡扣款',
              'social_security_cut': '社保扣款',
              'absenteeism_cut': '旷工扣款',
              'dormitory_cut': '宿舍扣款',
              'ele_driver_cut': '电动车扣款',
              'accident_security_cut': '意外险扣款',
              'contract_cut': '合同扣款',
              'finance_cut': '财务扣款',
              'administration_cut': '行政扣款',
              'other_cut': '其他扣款',
              'customer_server_cut': '客服扣款',
              'personal_income_tax': '个税',
            };
            break;
          case 5:
            this.detailList = {
              'bonus': '其他补贴',
            };
            break;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../../../static/common.scss";

  .salaryModule {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .3);
    @include flex('center');
    .moneyDetail {
      background: #fff;
      @include radius(.06rem);
      width: 100%;
      margin: 0 .6rem;
      position: relative;
      padding-bottom: .5rem;
      .detailTop {
        height: 1.01rem;
        @include flex('center');
        img {
          width: .36rem;
          height: .36rem;
          margin-right: .3rem;
        }
      }
      .money {
        font-size: .4rem;
        text-align: center;
        padding: .4rem;
      }
      .detailList {
        color: #212121;
        div {
          text-align: center;
          margin-bottom: .4rem;
          @include flex('center');
          span {
            padding: 0 .2rem;
            width: 50%;
          }
          span:first-of-type {
            font-size: .24rem;
            text-align: right;

          }
          span:last-of-type {
            font-size: .3rem;
            text-align: left;

          }
        }
      }
      .lengths {
        @include flex('centerSpace');
        flex-wrap: wrap;
        div {
          width: 50%;
          span {
            padding: 0 .08rem;
          }
          span:first-of-type {
            width: 60%;
          }
          span:last-of-type {
            width: 40%;
          }
        }
      }
      .closeBtn {
        position: absolute;
        width: .65rem;
        height: .65rem;
        line-height: .65rem;
        text-align: center;
        background: #E5004F;
        @include radius(50%);
        bottom: -.325rem;
        left: 48%;
      }
    }
    .detail1 {
      @include backgroundImage('../../../assets/salary/jiangli@3x.png');
    }
    .detail2 {
      @include backgroundImage('../../../assets/salary/jixiao@3x.png');
    }
    .detail4 {
      @include backgroundImage('../../../assets/salary/koukuan@3x.png');
    }
    .detail5 {
      @include backgroundImage('../../../assets/salary/qitakuanxiang@3x.png');
    }
  }
</style>
