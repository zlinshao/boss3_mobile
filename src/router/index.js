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

//开发中
import Development from '@/components/common/development.vue'

//我的考试
import Exam from '@/components/examine/exam/index.vue'
import BeforeExam from '@/components/examine/exam/components/beforeExam.vue'
import MyExam from '@/components/examine/exam/components/myExam.vue'
import LookExam from '@/components/examine/exam/components/lookExam.vue'
// 问卷调查
import Questionnaire from '@/components/examine/questionnaire/index.vue'
import BeforeNaire from '@/components/examine/questionnaire/components/beforeNaire.vue'
import MyNaire from '@/components/examine/questionnaire/components/myNaire.vue'
import NaireStatistic from '@/components/examine/questionnaire/components/naireStatistic.vue'
import AnswerAll from '@/components/examine/questionnaire/components/answerAll.vue'
//员工广场
import StaffSquare from '@/components/staffSquare/index.vue'

import CollectReport from '../components/gladTidings/collectReport/index.vue'
import Quality from '../components/gladTidings/quality/index.vue'
import RentReport from '../components/gladTidings/rentReport/index.vue'
import TransferReport from '../components/gladTidings/transferReport/index.vue'
import ContinueCollect from '../components/gladTidings/continueCollect/index.vue'

// 数据统计
import DataStatic from '../components/examine/dataStatic/index.vue'
import DataCount from '../components/examine/dataCount/index.vue'
// import Statistics from '../components/examine/statistics/index.vue'

import UncollectBeforeRent from '../components/gladTidings/uncollectBeforeRent/index.vue'           //未收先祖
import UncollectBeforeRentSure from '../components/gladTidings/uncollectBeforeRentSure/index.vue'   //未收先祖确定

import ContinueRent from '../components/gladTidings/continueRent/index.vue'   //续租
import ChangeRent from '../components/gladTidings/changeRent/index.vue'       //转租
import Drawback from '../components/gladTidings/drawbackReport/index.vue'
import FriedBill from '../components/gladTidings/friedBill/index.vue'         //zhadan
import ClearRetreat from '../components/gladTidings/clearRetreat/index.vue'   //清退
import Checkout from '../components/gladTidings/checkout/index.vue'           //清退
import AgencyRent from '../components/gladTidings/agencyReport/index.vue'     //渠道
import PolishingCollect from '../components/gladTidings/polishing/collect.vue'   //收房补齐
import PolishingRenter from '../components/gladTidings/polishing/renter.vue'    //租房补齐
import EContract from '../components/gladTidings/polishing/eContract.vue'    //电子合同
import NewCollectContract from '../components/gladTidings/polishing/newCollectContract.vue'    //新建收房电子合同
import NewRentContract from '../components/gladTidings/polishing/newRentContract.vue'    //新建租房电子合同
import ContractModels from '../components/gladTidings/polishing/contractModels.vue'
import Special from '../components/gladTidings/specialReport/index.vue'
// import Confiscate from '../components/gladTidings/confiscate/index.vue'
import FinalPayment from '../components/gladTidings/finalPayment/index.vue'
import PublishDetail from '../components/gladTidings/publishDetail/index.vue'
import Comment from '../components/gladTidings/publishDetail/comment.vue'

import CitySearch from '../components/gladTidings/citySearch.vue'           //小区搜索

import SearchList from '../components/gladTidings/searchList.vue'           //房屋搜索
import CollectHouse from '../components/gladTidings/collectHouse.vue'       //房屋搜索
import Organize from '../components/gladTidings/organize.vue'               //开单人搜索
import Depart from '../components/common/selectDepartment.vue'              //部门搜索

import AndroidStaff from '../components/common/androidStaff.vue'              //安卓搜索

//管控中心
import ProductControlCenter from '../components/gladTidings/productControlCenter/index.vue'
import ProductDetail from '../components/gladTidings/productControlCenter/components/productDetail.vue'
import ImgDetail from '../components/gladTidings/productControlCenter/components/imgDetail.vue'
import ContractDetail from '../components/gladTidings/productControlCenter/components/contractDetail.vue'
import CollectDetail from '../components/gladTidings/productControlCenter/components/collectDetail'
import RentDetail from '../components/gladTidings/productControlCenter/components/rentDetail'

import VillageCenter from '../components/gladTidings/villageManage/index.vue'
import AddVillage from '../components/gladTidings/villageManage/components/addVillage.vue'
import MapSearch from '../components/gladTidings/villageManage/components/mapSearch.vue'
import AddNewAddress from '../components/gladTidings/villageManage/components/addNewAddress.vue'

// 问答中心
import Interlocution from '../components/examine/interlocution/index.vue';  //问题列表
import ProposeQuestion from '../components/examine/interlocution/components/proposeQuestion.vue';  //提问问题
import WriteAnswer from '../components/examine/interlocution/components/writeAnswer.vue';  //写回答
import WriteComment from '../components/examine/interlocution/components/writeComment.vue';  //写评论
import PersonalSalary from '../components/examine/personalSalary/index.vue';  //个人工资
import AllDetail from '../components/examine/personalSalary/allDetail.vue';  //个人工资

//计算器
import SearchHouse from '../components/common/searchHouse.vue';//计算器房屋搜索

// 乐伽大学
import LejiaUniversity from '../components/lejiaUniversity/LejiaUniversity.vue'
import LejiaAlub from '../components/lejiaUniversity/LejiaAlub.vue'
import VideoPlay from '../components/lejiaUniversity/videoPlay.vue'

// 考勤记录
import Attendance from '../components/attendance/index.vue'

// 拓展新盘
import Expand from '../components/gladTidings/expand/index.vue'


Vue.use(Router);

export default new Router({
  mode: 'history',
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
      path: '/androidStaff',
      name: '组织架构',
      hidden: false,
      meta: {title: '组织架构'},
      component: AndroidStaff
    },

    {
      path: '/collectHouse',
      name: '房屋搜索',
      hidden: false,
      meta: {title: '房屋搜索'},
      component: CollectHouse
    },

    {
      path: '/searchList',
      name: '搜索',
      hidden: false,
      meta: {title: '搜索'},
      component: SearchList
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
      path: '/eContract',
      hidden: '',
      back: '#F19851',
      icon: 'iconfont icon-hetong',
      name: '电子合同',
      meta: {title: '电子合同'},
      component: EContract
    },
    // {
    //   path: '/collectReport',               //收房报备
    //   name: '收房报备',
    //   hidden: 'glad',
    //   back: '#E3705B',
    //   icon: 'iconfont icon-gaoceng',
    //   meta: {title: '收房报备'},
    //   component: CollectReport
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
      name: '未收先租',
      hidden: 'glad',
      icon: 'iconfont icon-weishouxianzubaobei',
      meta: {title: '未收先租'},
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
      name: '渠道费报备',
      hidden: 'glad',
      back: '#F19851',
      icon: 'iconfont icon-fukuanguanli',
      meta: {title: '渠道费报备'},
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
    {
      path: '/expand',               //拓展新盘
      name: '拓展新盘',
      hidden: 'glad',
      back: '#E3705B',
      icon: 'iconfont icon-chanpinguankong',
      meta: {title: '拓展新盘'},
      component: Expand
    },
    {
      path: '/productControlCenter',
      name: '产品管控中心',
      hidden: 'product',
      icon: 'iconfont icon-chanpinguankong',
      meta: {title: '产品管控中心'},
      component: ProductControlCenter
    },
    {
      path: '/villageCenter',
      name: '小区管理中心',
      hidden: 'product',
      icon: 'iconfont icon-chanpinguankong',
      meta: {title: '小区管理中心'},
      component: VillageCenter
    },

    // {
    //   path: '/expense',
    //   hidden: 'examine',
    //   name: '研发部报销申请',
    //   meta: {title: '研发部报销申请'},
    //   component: Expense
    // },

    {
      path: '/polishingCollect',
      hidden: 'polish',
      back: '#F19851',
      icon: 'iconfont icon-shoufang',
      name: '收房补齐资料',
      meta: {title: '收房补齐资料'},
      component: PolishingCollect
    },
    {
      path: '/polishingRenter',
      hidden: 'polish',
      back: '#F19851',
      icon: 'iconfont icon-zufang-',
      name: '租房补齐资料',
      meta: {title: '租房补齐资料'},
      component: PolishingRenter
    },

    {
      path: '/newCollectContract',
      name: '收房电子合同',
      meta: {title: '收房电子合同'},
      component: NewCollectContract
    },
    {
      path: '/newRentContract',
      name: '租房电子合同',
      meta: {title: '租房电子合同'},
      component: NewRentContract
    },
    {
      path: '/productDetail',
      hidden: false,
      name: '房屋详情',
      meta: {title: '房屋详情'},
      component: ProductDetail
    },
    {
      path: '/imgDetail',
      hidden: false,
      name: '照片详情',
      meta: {title: '照片详情'},
      component: ImgDetail
    },
    {
      path: '/contractDetail',
      hidden: false,
      name: '合同详情',
      meta: {title: '合同详情'},
      component: ContractDetail
    },
    {
      path: '/collectDetail',
      hidden: false,
      name: '收房合同详情',
      meta: {title: '收房合同详情'},
      component: CollectDetail
    },
    {
      path: '/rentDetail',
      hidden: false,
      name: '租房合同详情',
      meta: {title: '租房合同详情'},
      component: RentDetail
    },
    {
      path: '/addVillage',
      hidden: false,
      name: '新增小区',
      meta: {title: '新增小区'},
      component: AddVillage
    },

    {
      path: '/addNewAddress',
      hidden: false,
      name: '选取坐标',
      meta: {title: '选取坐标'},
      component: AddNewAddress
    },

    {
      path: '/mapSearch',
      hidden: false,
      name: '搜索地址',
      meta: {title: '搜索地址'},
      component: MapSearch
    },
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
    {
      path: '/exam',
      name: '在线考试',
      meta: {title: '在线考试'},
      icon: 'iconfont icon-xinjianshijuan',
      hidden: 'exam',
      component: Exam
    },
    {
      path: '/myExam',
      name: '考试列表',
      meta: {title: '考试列表'},
      hidden: false,
      component: MyExam
    },
    {
      path: '/lookExam',
      name: '考试结果',
      meta: {title: '考试结果'},
      hidden: false,
      component: LookExam
    },
    {
      path: '/beforeExam',
      name: '我的考试',
      meta: {title: '我的考试'},
      hidden: false,
      component: BeforeExam
    },
    {
      path: '/questionnaire',
      name: '问卷调查',
      icon: 'iconfont icon-jinrukaoshi',
      meta: {title: '问卷调查'},
      hidden: 'exam',
      component: Questionnaire
    },
    {
      path: '/beforeNaire',
      name: '我的问卷',
      meta: {title: '我的问卷'},
      hidden: false,
      component: BeforeNaire
    },
    {
      path: '/myNaire',
      name: '问卷列表',
      meta: {title: '问卷列表'},
      hidden: false,
      component: MyNaire
    },
    {
      path: '/naireStatistic',
      name: '问卷统计',
      meta: {title: '问卷统计'},
      hidden: false,
      component: NaireStatistic
    },
    {
      path: '/answerAll',
      name: '所有回答',
      meta: {title: '所有回答'},
      hidden: false,
      component: AnswerAll
    },
    {
      path: '/development',
      name: '开发中',
      meta: {title: '开发中'},
      hidden: false,
      component: Development
    },
    {
      path: '/personalSalary',
      name: '个人工资',
      icon: 'iconfont icon-jinbi',
      back: '#E3705B',
      meta: {title: '个人工资'},
      hidden: 'other',
      component: PersonalSalary
    },
    {
      path: '/allDetail',
      name: '我的工资',
      meta: {title: '我的工资'},
      hidden: false,
      component: AllDetail
    },
    {
      path: '/interlocution',
      name: '问答中心',
      icon: 'iconfont icon-answercenter',
      meta: {title: '问答中心'},
      hidden: 'other',
      component: Interlocution
    },
    {
      path: '/proposeQuestion',
      name: '我要提问',
      meta: {title: '我要提问'},
      hidden: false,
      component: ProposeQuestion
    },
    {
      path: '/writeAnswer',
      name: '我要回答',
      meta: {title: '我要回答'},
      hidden: false,
      component: WriteAnswer
    },
    {
      path: '/writeComment',
      name: '我要评论',
      meta: {title: '我要评论'},
      hidden: false,
      component: WriteComment
    },

    {
      path: '/staffSquare',
      name: '员工广场',
      icon: 'iconfont icon-yuangongzhongxin',
      hidden: 'other',
      back: '#F19851',
      meta: {title: '员工广场'},
      component: StaffSquare
    },
    // {
    //   path: '/dataStatic',
    //   name: '业绩报表',
    //   icon: 'iconfont icon-shujutu',
    //   hidden: 'dataStatic',
    //   back: '#F19851',
    //   meta: {title: '业绩报表'},
    //   component: DataStatic
    // },
    {
      path: '/LejiaAlub',
      name: '教学视频',
      icon: 'iconfont icon-daxue',
      hidden: 'other',
      back: '#F19851',
      meta: {
        title: '教学视频',
        // keepAlive: true
      },
      component: LejiaAlub
    },
    {
      path: '/LejiaUniversity',
      name: '教学列表',
      hidden: false,
      meta: {
        title: '教学列表',
        // keepAlive: true
      },
      component: LejiaUniversity
    },
    {
      path: '/VideoPlay',
      name: '播放视频',
      hidden: false,
      meta: {
        title: '播放视频'
      },
      component: VideoPlay
    },
    // {
    //   path: '/dataCount',
    //   name: '业绩计算器',
    //   icon: 'iconfont icon-xushouxibao',
    //   hidden: 'dataStatic',
    //   back: '#E3705B',
    //   meta: {title: '业绩计算'},
    //   component: DataCount
    // },
    {
      path: '/searchHouse',
      name: '计算器房屋搜索',
      component: SearchHouse
    },
    // {
    //   path: '/statistics',
    //   name: '业绩统计',
    //   icon: 'iconfont icon-shujutu',
    //   hidden: 'dataStatic',
    //   back: '#E3705B',
    //   meta: {title: '业绩统计'},
    //   component: Statistics
    // },
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
    {
      path: '/Attendance',
      name: '考勤记录',
      icon: 'iconfont icon-buqia',
      hidden: 'other',
      back: '#F19851',
      meta: {
        title: '考勤记录',
        // keepAlive: true
      },
      component: Attendance
    },
    {
      path: '/contractModels',
      name: '合同模板',
      meta: {title: '合同模板'},
      component: ContractModels
    },
  ]
})
