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
    },5
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
  ]
})
