import Vue from 'vue'
import Router from 'vue-router'

import Ding from '../components/ding.vue'
import Index from '../components/index.vue'

// import Expense from '@/components/examine/Expense/index.vue'
import Warning from '@/components/examine/warning/index.vue'
import Writings from '@/components/examine/writings/index.vue'
import Comments from '@/components/examine/writings/comments.vue'
// import CardDetail from '@/components/examine/cardDetail/index.vue'
// import CreditCard from '@/components/examine/creditCard/index.vue'

import CollectReport from '../components/gladTidings/collectReport/index.vue'
import Quality from '../components/gladTidings/quality/index.vue'
import RentReport from '../components/gladTidings/rentReport/index.vue'
import TransferReport from '../components/gladTidings/transferReport/index.vue'
import ContinueCollect from '../components/gladTidings/continueCollect/index.vue'


import UncollectBeforeRent from '../components/gladTidings/uncollectBeforeRent/index.vue'           //未收先祖
import UncollectBeforeRentSure from '../components/gladTidings/uncollectBeforeRentSure/index.vue'   //未收先祖确定

import ContinueRent from '../components/gladTidings/continueRent/index.vue'   //续租
import ChangeRent from '../components/gladTidings/changeRent/index.vue'       //转租
import Drawback from '../components/gladTidings/drawbackReport/index.vue'
import FriedBill from '../components/gladTidings/friedBill/index.vue'         //zhadan
import ClearRetreat from '../components/gladTidings/clearRetreat/index.vue'   //清退
import Checkout from '../components/gladTidings/checkout/index.vue'           //清退
import AgencyRent from '../components/gladTidings/agencyReport/index.vue'     //中介
// import PolishingCollect from '../components/gladTidings/polishing/collect.vue'   //收房补齐
// import PolishingRenter from '../components/gladTidings/polishing/renter.vue'    //租房补齐
import Special from '../components/gladTidings/specialReport/index.vue'
import Confiscate from '../components/gladTidings/confiscate/index.vue'
import FinalPayment from '../components/gladTidings/finalPayment/index.vue'
import PublishDetail from '../components/gladTidings/publishDetail/index.vue'
import Comment from '../components/gladTidings/publishDetail/comment.vue'

import CitySearch from '../components/gladTidings/citySearch.vue'           //小区搜索

import CollectHouse from '../components/gladTidings/collectHouse.vue'       //房屋搜索
import Organize from '../components/gladTidings/organize.vue'               //开单人搜索
import Depart from '../components/common/selectDepartment.vue'              //部门搜索


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ding',
      hidden: false,
      meta: {title: '验证中'},
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
      path: '/citySearch',
      name: '小区搜索',
      hidden: false,
      meta: {title: '小区搜索'},
      component: CitySearch
    },
    {
      path: '/organize',
      name: '开单人',
      hidden: false,
      meta: {title: '开单人'},
      component: Organize
    },
    {
      path: '/depart',
      name: '部门',
      hidden: false,
      meta: {title: '部门'},
      component: Depart
    },

    {
      path: '/collectHouse',
      name: '房屋搜索',
      hidden: false,
      meta: {title: '房屋搜索'},
      component: CollectHouse
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
      path: '/quality',               //房屋质量报备
      name: '房屋质量报备',
      hidden: 'glad',
      back: '#E3705B',
      icon: 'iconfont icon-fangwuzhiliangbaobei',
      meta: {title: '房屋质量报备'},
      component: Quality
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
    // {
    //   path: '/polishingCollect',
    //   hidden: 'glad',
    //   back: '#F19851',
    //   icon: 'iconfont icon-shoufang',
    //   name: '收房补齐资料',
    //   meta: {title: '收房补齐资料'},
    //   component: PolishingCollect
    // },
    {
      path: '/rentReport',                 //租房报备
      name: '租房报备',
      hidden: 'glad',
      back: '#E3705B',
      icon: 'iconfont icon-zufang-',
      meta: {title: '租房报备'},
      component: RentReport
    },
    // {
    //   path: '/polishingRenter',
    //   hidden: 'glad',
    //   back: '#F19851',
    //   icon: 'iconfont icon-zufang-',
    //   name: '租房补齐资料',
    //   meta: {title: '租房补齐资料'},
    //   component: PolishingRenter
    // },
    {
      path: '/changeRent',                 //转租报备
      name: '转租报备',
      hidden: 'glad',
      back: '#E3705B',
      icon: 'iconfont icon-zhuanzubaobei',
      meta: {title: '转租报备'},
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
      name: '未收先租未知',
      hidden: 'glad',
      icon: 'iconfont icon-weishouxianzubaobei',
      meta: {title: '未收先租未知'},
      component: UncollectBeforeRent
    },
    {
      path: '/unCollectBeforeRentSure',
      name: '未收先租确定',
      hidden: 'glad',
      icon: 'iconfont icon-weishouxianzuquedingbaobei',
      meta: {title: '未收先租确定'},
      component: UncollectBeforeRentSure
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
      icon: 'iconfont icon-tuizubaobei',
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
      icon: 'iconfont icon-qingtuibaobei',
      meta: {title: '清退报备'},
      component: ClearRetreat
    },
    {
      path: '/checkout',
      name: '退租报备',
      hidden: 'glad',
      icon: 'iconfont icon-qingtui-',
      meta: {title: '退租报备'},
      component: Checkout
    },
    {
      path: '/agencyRent',
      name: '中介费报备',
      hidden: 'glad',
      back: '#F19851',
      icon: 'iconfont icon-fukuanguanli',
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
    // {
    //   path: '/confiscate',
    //   name: '充公报备',
    //   hidden: 'glad',
    //   icon: 'iconfont icon-chonggong',
    //   meta: {title: '充公报备'},
    //   component: Confiscate
    // },
    {
      path: '/finalPayment',
      name: '尾款房租报备',
      hidden: 'glad',
      icon: 'iconfont icon-fangzu1',
      meta: {title: '尾款房租报备'},
      component: FinalPayment
    },


    // {
    //   path: '/expense',
    //   hidden: 'examine',
    //   name: '研发部报销申请',
    //   meta: {title: '研发部报销申请'},
    //   component: Expense
    // },
    {
      path: '/writings',
      hidden: false,
      name: '文章',
      meta: {title: '文章'},
      component: Writings
    },
    {
      path: '/comments',
      hidden: false,
      name: '评论',
      meta: {title: '评论'},
      component: Comments
    },
    {
      path: '/warning',
      name: '公告',
      meta: {title: '公告'},
      hidden: false,
      component: Warning
    },
    // {
    //   path: '/cardDetail',
    //   name: '研发补卡申请详情',
    //   hidden: 'examine',
    //   meta: {title: '研发补卡申请详情'},
    //   component: CardDetail
    // },
    // {
    //   path: '/creditCard',
    //   name: '研发补卡申请',
    //   hidden: 'examine',
    //   meta: {title: '研发补卡申请'},
    //   component: CreditCard
    // },
  ]
})
