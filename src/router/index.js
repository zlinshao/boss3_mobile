import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Expense from '@/components/Expense/index.vue'
import Warning from '@/components/warning/index.vue'
import CardDetail from '@/components/cardDetail/index.vue'
import CreditCard from '@/components/creditCard/index.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
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
  ]
})
