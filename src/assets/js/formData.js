dicties = {
  'is_agency': {'0': '个人', '1': '中介'},                    //是否中介
  'lord_pay_way': {'1': '月付', '2': '双月付', '3': '季付'},   //业绩计算 收房付款方式
};
// 收房报备
collectFormData = {
  id: '',                       //草稿ID
  type: 1,
  processable_id: '',
  draft: 0,                     //0发布 1草稿
  house: {
    id: '',
    name: '',
  },
  sign_date: '',                //签约日期
  month: '',                    //收房月数
  day: '',                      //收房天数
  is_agency: '',                //是否中介 0不是 1是
  agency_name: '',              //中介名
  agency_price: '',             //中介费
  agency_user_name: '',         //中介人
  agency_phone: '',             //中介手机号
  begin_date: '',               //空置期开始日期
  vacancy: '',                  //空置期
  end_date_vacant: '',          //空置期结束日期
  vacancy_way: '',              //空置期规则
  vacancy_other: '',            //空置期规则 其它
  end_date: '',                 //合同结束日期
  pay_first_date: '',           //第一次付款时间
  pay_second_date: '',          //第二次付款时间
  price_arr: [''],              //月单价
  period_price_arr: [''],       //月单价周期
  pay_way_arr: [''],            //付款方式
  period_pay_arr: [''],         //付款方式周期

  warranty: '',                 //保修期月
  warranty_day: '',             //保修期天
  is_corp: '1',                 //是否公司单  0个人1公司
  deposit: '',                  //押金
  property_payer: '',           //物业费付款人
  name: '',                     //房东姓名
  phone: '',                    //电话号码
  purchase_way: 509,            //支付方式
  bank: '',                     //银行名称
  subbranch: '',                //支行名称
  account_name: '',             //帐户名称
  account: '',                  //帐号
  relationship: '',             //房东与收款人关系
  penalty: '',                  //违约金
  contract_number: 'LJSF',      //合同编号
  screenshot_leader: [],        //领导截图 数组
  photo: [],                    //合同照片 数组
  property_photo: [],           //房产证照片
  identity_photo: [],           //证件照片
  remark: '',                   //备注
  staff_id: '',                 //开单人id
  department_id: '',            //部门id
  staff_name: '',               //开单人name
  department_name: '',          //部门name
};

// 业绩计算器
// 计算结果列表
rentTitle_calculate = {
  basic_achievement: '基本业绩',
  // pay_way_rent: '租房付款方式',
  // real_return_money: '实际回款',
  // spread: '价差',
  // expend: '消耗空置期',
  // pay_way_lord: '收房付款方式',
  // vacancy: '收房空置期',
  // duration: '收房年限',
  // affect_sum: '影响合计',
  overflow: '溢出业绩',
  // push_rate: '提成比例',
  push_money: '提成金额',
  agency_count_lord: '收房中介费',
  agency_count_rent: '租房中介费',
  real_money: '实际到手',
  // client_money: '客户维护费',
  // extra_award: '额外奖励',
};

// 绩效
salaryPerformance = {
  'old_basic_achv': '老绩效工资',
  'new_basic_achv': '新绩效工资',
};

// 奖励
salaryReward = {
  'old_lord_award': '原收房奖励',
  'old_rent_award': '原租房奖励',
  'lord_overflow_award': '收溢价奖励',
  'rent_overflow_award': '租溢价奖励',
  'lord_award': '收房奖励',
  'rent_award': '租房奖励',
};

// 扣款
salaryDeductions = {
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

// 其他款项
salaryOther = {
  'bonus': '各项补贴',
};
