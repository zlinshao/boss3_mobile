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
import UncollectBeforeRent from '../components/gladTidings/uncollectBeforeRent/index.vue'

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
      hidden: true,
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/expense',
      hidden: true,
      name: '研发部报销申请',
      component: Expense
    },
    {
      path: '/warning',
      hidden: true,
      name: '警告',
      component: Warning
    },
    {
      path: '/cardDetail',
      hidden: true,
      name: '研发补卡申请详情',
      component: CardDetail
    },
    {
      path: '/creditCard',
      hidden: true,
      name: '研发补卡申请',
      component: CreditCard
    },
    {
      path: '/unCollectBeforeRent',
      hidden: true,
      name: '未收先租',
      component: UncollectBeforeRent
    },
  ]
})
