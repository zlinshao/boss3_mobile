import Vue from 'vue'
import Router from 'vue-router'

import Index from '../components/index.vue'

import HelloWorld from '@/components/HelloWorld'
import Expense from '@/components/examine/Expense/index.vue'
import Warning from '@/components/examine/warning/index.vue'
import CardDetail from '@/components/examine/cardDetail/index.vue'
import CreditCard from '@/components/examine/creditCard/index.vue'

import GladTidings from '../components/gladTidings/index.vue'

import CollectReport from '../components/gladTidings/collectReport/index.vue'
import RentReport from '../components/gladTidings/rentReport/index.vue'
import TransferReport from '../components/gladTidings/transferReport/index.vue'
import ContinueCollect from '../components/gladTidings/continueCollect/index.vue'


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
      path: '/collectReport',               //收房报备
      name: 'collectReport',
      component: CollectReport
    },
    {
      path: '/rentReport',                 //租房报备
      name: 'rentReport',
      component: RentReport
    },
    {
      path: '/transferReport',              //调房报备
      name: 'transferReport',
      component: TransferReport
    },
    {
      path: '/continueCollect',              //续收报备
      name: 'continueCollect',
      component: ContinueCollect
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
  ]
})
