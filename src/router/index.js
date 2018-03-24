import Vue from 'vue'
import Router from 'vue-router'

import Ding from '../components/ding.vue'
import Index from '../components/index.vue'

import Expense from '@/components/examine/Expense/index.vue'
import Warning from '@/components/examine/warning/index.vue'
import CardDetail from '@/components/examine/cardDetail/index.vue'
import CreditCard from '@/components/examine/creditCard/index.vue'

import CollectReport from '../components/gladTidings/collectReport/index.vue'
import RentReport from '../components/gladTidings/rentReport/index.vue'
import TransferReport from '../components/gladTidings/transferReport/index.vue'
import ContinueCollect from '../components/gladTidings/continueCollect/index.vue'


import UncollectBeforeRent from '../components/gladTidings/uncollectBeforeRent/index.vue'   //未收先祖
import ContinueRent from '../components/gladTidings/continueRent/index.vue'   //续租
import ChangeRent from '../components/gladTidings/changeRent/index.vue'       //转租
import Drawback from '../components/gladTidings/drawbackReport/index.vue'
import FriedBill from '../components/gladTidings/friedBill/index.vue'         //zhadan
import ClearRetreat from '../components/gladTidings/clearRetreat/index.vue'   //清退
import AgencyRent from '../components/gladTidings/agencyReport/index.vue'     //中介给
import Special from '../components/gladTidings/specialReport/index.vue'
import Confiscate from '../components/gladTidings/confiscate/index.vue'
import FinalPayment from '../components/gladTidings/finalPayment/index.vue'
import PublishDetail from '../components/gladTidings/publishDetail/index.vue'
import Comment from '../components/gladTidings/publishDetail/comment.vue'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ding',
      hidden: false,
      meta: {title: '首页'},

      component: Ding
    },
    {
      path: '/index',
      name: 'index',
      hidden: false,
      meta: {title: '首页'},
      component: Index
    },
    {
      path: '/publishDetail',
      name: 'publishDetail',
      hidden: false,
      meta: {title: '报备详情'},
      component: PublishDetail
    },
    {
      path: '/comment',
      name: 'comment',
      hidden: false,
      meta: {title: '评论'},
      component: Comment
    },
    {
      path: '/collectReport',               //收房报备
      name: '收房报备',
      hidden: 'glad',
      back: '#E3705B',
      icon: 'iconfont icon-shoufang',
      meta: {title: '收房报备'},
      component: CollectReport
    },
    {
      path: '/rentReport',                 //租房报备
      name: '租房报备',
      hidden: 'glad',
      back: '#F19851',
      icon: 'iconfont icon-zufang-',
      meta: {title: '租房报备'},
      component: RentReport
    },
    {
      path: '/changeRent',                 //转租报备
      name: '转租报备',
      hidden: 'glad',
      back: '#E3705B',
      icon: 'iconfont icon-zhuanzubaobei',
      meta: {title: '租房报备'},
      component: ChangeRent
    },
    {
      path: '/transferReport',              //调房报备
      name: '调房报备',
      hidden: 'glad',
      icon: 'iconfont icon-tiaofang',
      meta: {title: '调房报备'},
      component: TransferReport
    },
    {
      path: '/continueCollect',              //续收报备
      name: '续收报备',
      hidden: 'glad',
      back: '#E3705B',
      icon: 'iconfont icon-xushouxibao',
      meta: {title: '续收报备'},
      component: ContinueCollect
    },
    {
      path: '/unCollectBeforeRent',
      name: '未收先租',
      hidden: 'glad',
      icon: 'iconfont icon-weishouxianzu',
      meta: {title: '未收先租'},
      component: UncollectBeforeRent
    },
    {
      path: '/continueRent',
      name: '续租报备',
      hidden: 'glad',
      icon: 'iconfont icon-xuzubaobei',
      meta: {title: '续租报备'},
      component: ContinueRent
    },
    {
      path: '/drawback',
      name: '退款报备',
      hidden: 'glad',
      icon: 'iconfont icon-fanhui',
      meta: {title: '退款报备'},
      component: Drawback
    },
    {
      path: '/friedBill',
      name: '炸单报备',
      hidden: 'glad',
      icon: 'iconfont icon-zhadan',
      meta: {title: '炸单报备'},
      component: FriedBill
    },
    {
      path: '/clearRetreat',
      name: '清退报备',
      hidden: 'glad',
      icon: 'iconfont icon-fanhui',
      meta: {title: '清退报备'},
      component: ClearRetreat
    },
    {
      path: '/agencyRent',
      name: '中介费报备',
      hidden: 'glad',
      back: '#F19851',
      icon: 'iconfont icon-fanhui',
      meta: {title: '中介费报备'},
      component: AgencyRent
    },
    {
      path: '/special',
      hidden: 'glad',
      back: '#F19851',
      icon: 'iconfont icon-teshuqingkuang',
      name: '特殊事项报备',
      meta: {title: '特殊事项报备'},
      component: Special
    },
    {
      path: '/confiscate',
      name: '充公报备',
      hidden: 'glad',
      icon: 'iconfont icon-chonggong',
      meta: {title: '充公报备'},
      component: Confiscate
    },
    {
      path: '/finalPayment',
      name: '尾款房租报备',
      hidden: 'glad',
      icon: 'iconfont icon-fangzu1',
      meta: {title: '尾款房租报备'},
      component: FinalPayment
    },


    {
      path: '/expense',
      hidden: 'examine',
      name: '研发部报销申请',
      meta: {title: '研发部报销申请'},
      component: Expense
    },
    {
      path: '/warning',
      name: '警告',
      meta: {title: '警告'},
      hidden: 'examine',
      component: Warning
    },
    {
      path: '/cardDetail',
      name: '研发补卡申请详情',
      hidden: 'examine',
      meta: {title: '研发补卡申请详情'},
      component: CardDetail
    },
    {
      path: '/creditCard',
      name: '研发补卡申请',
      hidden: 'examine',
      meta: {title: '研发补卡申请'},
      component: CreditCard
    },
  ]
})
