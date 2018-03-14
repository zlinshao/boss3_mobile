import Vue from 'vue'
import Router from 'vue-router'

import Index from  '../components/index.vue'

import HelloWorld from '@/components/HelloWorld'
import Expense from '@/components/examine/Expense/index.vue'
import Warning from '@/components/examine/warning/index.vue'
import CardDetail from '@/components/examine/cardDetail/index.vue'
import CreditCard from '@/components/examine/creditCard/index.vue'

import GladTidings from '../components/gladTidings/index.vue'
import Examine from '../components/examine/index.vue'
import UncollectBeforeRent from '../components/gladTidings/uncollectBeforeRent/index.vue'   //未收先祖
import ContinueRent from '../components/gladTidings/continueRent/index.vue'   //续租
import Drawback from '../components/gladTidings/drawbackReport/index.vue'
import FriedBill from '../components/gladTidings/friedBill/index.vue' //zhadan
import AgencyRent from '../components/gladTidings/agencyReport/index.vue'   //中介给
import Special from '../components/gladTidings/specialReport/index.vue'
import Confiscate from '../components/gladTidings/confiscate/index.vue'
import FinalPayment from '../components/gladTidings/finalPayment/index.vue'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/gladTidings',
      name: 'gladTidings',
      component: GladTidings
    },
    {
      path: '/examine',
      name: 'Examine',
      component: Examine
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/expense',
      name: '研发部报销申请',
      component: Expense
    },
    {
      path: '/warning',
      name: '警告',
      component: Warning
    },
    {
      path: '/cardDetail',
      name: '研发补卡申请详情',
      component: CardDetail
    },
    {
      path: '/creditCard',
      name: '研发补卡申请',
      component: CreditCard
    },
    {
      path: '/unCollectBeforeRent',
      hidden: true,
      name: '未收先租',
      component: UncollectBeforeRent
    },
    {
      path: '/continueRent',
      hidden: true,
      name: '续租报备',
      component: ContinueRent
    },
    {
      path: '/drawback',
      hidden: true,
      name: '退款报备',
      component: Drawback
    },
    {
      path: '/friedBill',
      hidden: true,
      name: '炸单报备',
      component: FriedBill
    },
    {
      path: '/agencyRent',
      hidden: true,
      name: '中介费报备',
      component: AgencyRent
    },
    {
      path: '/special',
      hidden: true,
      name: '特殊事项报备',
      component: Special
    },
    {
      path: '/confiscate',
      hidden: true,
      name: '充公报备',
      component: Confiscate
    },
    {
      path: '/finalPayment',
      hidden: true,
      name: '尾款房租报备',
      component: FinalPayment
    },
  ]
})
