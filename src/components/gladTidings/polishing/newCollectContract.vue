<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="form.contract_number"
        label="合同编号"
        type="text"
        readonly
        @click=""
        placeholder="请选择合同编号"
        required></van-field>
      <van-field
        v-model="form.house.name"
        label="房屋地址"
        type="text"
        readonly
        @click="chooseHouse()"
        placeholder="请选择房屋地址"
        required>
      </van-field>
      <van-field
        v-model="form.property_address"
        label="产权地址"
        type="text"
        placeholder="请填写产权地址"
        icon=""
        @click-icon="form.property_address = ''"
        required>
      </van-field>
      <van-field
        v-model="houseCertificateTypeTxt"
        label="持有证件"
        readonly
        type="text"
        @click="showSelect(houseCertificateTypes)"
        placeholder="请选择持有证件"
        required>
      </van-field>
      <van-field
        v-model="form.property_number"
        label="产权证号"
        type="text"
        placeholder="请填写产权证号"
        icon=""
        @click-icon="form.property_number = ''"
        required>
      </van-field>
      <van-field
        v-model="form.QiuQuan_number"
        label="丘权号"
        type="text"
        placeholder="请填写丘权号"
        icon=""
        @click-icon="form.QiuQuan_number = ''">
      </van-field>

      <div class="changes" v-for="(item,index) in form.houseOwners">
        <div class="paddingTitle">
          <span>房东<span v-if="form.houseOwners.length > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="form.houseOwners.length > 1" @click="form.houseOwners.splice(index)">删除</span>
        </div>
        <van-field
          v-model="form.houseOwners[index].name"
          label="房东姓名"
          type="text"
          placeholder="请填写房东姓名"
          icon="clear"
          @click-icon="form.houseOwners[index].name=''"
          required>
        </van-field>
        <van-field
          v-model="form.houseOwners[index].idcard"
          label="房东身份证号"
          type="text"
          placeholder="请填写房东身份证号"
          icon="clear"
          @click-icon="form.houseOwners[index].idcard= ''"
          required>
        </van-field>
        <van-field
          v-model="form.houseOwners[index].phone"
          label="联系方式"
          type="text"
          class="number"
          placeholder="请填写联系方式"
          icon="clear"
          @click-icon="form.houseOwners[index].phone= ''"
          required>
        </van-field>
      </div>
      <div @click="addNewHouseOwner" class="addInput bottom">
        +添加附属房东
      </div>
      <van-field
        v-model="signPeople"
        label="签约人"
        type="text"
        placeholder="请选择签约人"
        @click="showSignPeoples()"
        readonly
        required>
      </van-field>
      <div v-if="showProxyInfo">
        <van-field
          v-model="form.sign_people_name"
          label="代理人姓名"
          type="text"
          placeholder="请填写代理人姓名"
          icon=""
          @click-icon="form.sign_people_name = ''"
          required>
        </van-field>
        <van-field
          v-model="form.sign_people_phone"
          label="代理人手机号"
          type="text"
          placeholder="请填写代理人手机号"
          icon=""
          @click-icon="form.sign_people_phone = ''"
          required>
        </van-field>
        <van-field
          v-model="form.sign_people_card_number"
          label="代理人身份证号"
          type="text"
          placeholder="请填写代理人身份证号"
          icon=""
          @click-icon="form.sign_people_card_number = ''"
          required>
        </van-field>
      </div>
      <van-field
        v-model="form.sign_date"
        label="签约日期"
        readonly
        type="text"
        @click="dateChoose('sign_date', form.sign_date)"
        placeholder="请选择签约日期日期"
        required>
      </van-field>
      <div class="first_date month">
        <div class="titles required">签约时长</div>
        <van-field
          v-model="form.month"
          type="text"
          class="number"
          @keyup="endDate(form.end_date_vacant, form.month, form.day, 2)"
          placeholder="请填写月数">
        </van-field>
        <van-field
          v-model="form.day"
          type="text"
          class="number"
          @keyup="endDate(form.end_date_vacant, form.month, form.day, 2)"
          placeholder="请填写天数">
        </van-field>
      </div>
      <div class="titleRed">不包含空置期</div>
      <van-field
        v-model="form.begin_date"
        type="text"
        label="空置期开始"
        placeholder="请选择空置期开始日期"
        readonly
        @click="dateChoose('begin_date', form.begin_date)"
        required>
      </van-field>
      <van-field
        v-model="form.vacany_other"
        label="空置期(天)"
        type="text"
        class="number"
        @keyup="endDate(form.begin_date, '', form.vacany_other, 1)"
        placeholder="请填写空置期"
        icon="clear"
        @click-icon="form.vacany_other = ''"
        required>
      </van-field>
      <van-field
        v-model="form.end_date_vacant"
        type="text"
        label="空置期结束"
        placeholder="请选择空置期结束日期"
        readonly
        @click="dateChoose('end_date_vacant', form.end_date_vacant)"
        required>
      </van-field>
      <van-field
        v-model="form.end_date"
        label="合同结束日期"
        readonly
        type="text"
        @click="dateChoose('end_date', form.end_date)"
        placeholder="请选择合同结束日期"
        required>
      </van-field>
      <div class="first_date noBorder">
        <div class="titles required">打房租日期</div>
        <van-field
          v-model="form.pay_first_date"
          readonly
          type="text"
          @click="dateChoose('pay_first_date', form.pay_first_date)"
          placeholder="第一次打款日期">
        </van-field>
        <span class="cut" style="padding-right: 20px;">-</span>
        <van-field
          v-model="form.pay_second_date"
          readonly
          type="text"
          @click="dateChoose('pay_second_date', form.pay_second_date)"
          placeholder="第二次打款日期">
        </van-field>
      </div>
    </van-cell-group>

    <div class="changes" v-for="(item,index) in monthPriceAndPayMethods">
      <div class="paddingTitle">
        <span>月单价<span v-if="monthPriceAndPayMethods.length > 1">({{index + 1}})</span></span>
        <span class="colors" v-if="monthPriceAndPayMethods.length > 1"
              @click="monthPriceAndPayMethods.splice(index)">删除</span>
      </div>
      <van-cell-group>
        <van-field
          v-model="monthPriceAndPayMethods[index].date"
          type="text"
          label="开始时间"
          placeholder="获取周期开始日期"
          disabled
          required>
        </van-field>
        <van-field
          v-model="monthPriceAndPayMethods[index].cycle"
          type="text"
          class="number"
          label="付款周期"
          :disabled=" monthPriceAndPayMethods.length === 1 && monthPriceAndPayMethods[index].cycle === form.month"
          @keyup="periodDate(1)"
          placeholder="请填写月单价周期"
          required>
        </van-field>
        <van-field
          v-model="monthPriceAndPayMethods[index].price"
          type="text"
          class="number"
          label="价格"
          placeholder="请填写金额"
          required>
        </van-field>
        <van-field
          @click="choosePayMethods(payMethods,index)"
          v-model="monthPriceAndPayMethods[index].methodEntity.name"
          label="付款方式"
          type="text"
          readonly
          placeholder="请选择付款方式"
          required>
        </van-field>
      </van-cell-group>
    </div>
    <div @click="addMonthPay()" class="addInput">
      +月单价变化
    </div>
    <van-field
      v-model="form.deposit"
      label="押金"
      type="text"
      class="number"
      placeholder="请填写押金"
      icon="clear"
      @click-icon="form.deposit = ''"
      required>
    </van-field>

    <div class="month">
      <van-field
        v-model="form.account"
        label="卡号"
        @blur="accountBank(form.account)"
        type="text"
        class="number"
        placeholder="请填写卡号"
        icon="clear"
        @click-icon="form.account = ''"
        required>
      </van-field>
    </div>
    <div class="titleRed">请尽量提供一类卡卡号</div>
    <van-field
      v-model="form.bank"
      label="银行"
      type="text"
      placeholder="请填写银行名称"
      icon="clear"
      @click-icon="form.bank = ''"
      required>
    </van-field>
    <van-field
      v-model="form.subbranch"
      label="支行"
      type="text"
      placeholder="请填写支行"
      icon="clear"
      @click-icon="form.subbranch = ''">
    </van-field>
    <van-field
      v-model="form.account_name"
      label="开户名"
      type="text"
      placeholder="请填写开户名"
      icon="clear"
      @click-icon="form.account_name = ''"
      required>
    </van-field>

    <div class="month">
      <van-field
        v-model="form.penalty"
        label="违约金"
        type="text"
        class="number"
        placeholder="[n+1]*月单价,(n+1)≥4"
        icon="clear"
        @click-icon="form.penalty = ''"
        required>
      </van-field>
    </div>
    <div class="titleRed">n为年限，且金额不足一万按一万算</div>
    <van-field
      v-model="noOwnerFeeTxt"
      label="非房东费用"
      readonly
      type="text"
      @click="showChooseNoOwnerFee()"
      placeholder="请选择非房东费用(可多选)"
      required>
    </van-field>
    <van-field
      v-model="form.other_fee_text"
      label="其他费用"
      type="text"
      placeholder="请填写其他费用"
      icon="clear"
      @click-icon="form.other_fee_text=''"
      required>
    </van-field>
    <van-field
      v-model="canDecorationsTxt"
      label="可否装修"
      readonly
      type="text"
      @click="showSelect(canDecorations)"
      placeholder="请选择可否装修"
      required>
    </van-field>
    <van-field
      v-model="canAddThingTxt"
      label="可否添加物品"
      readonly
      type="text"
      @click="showSelect(canAddThings)"
      placeholder="请选择可否添加物品"
      required>
    </van-field>
    <van-field
      v-model="remarksTxt"
      label="备注条款"
      readonly
      type="text"
      @click="showChooseRemark()"
      placeholder="请选择备注条款(可多选)"
      required>
    </van-field>

    <van-field
      v-model="form.staff_name"
      @click="chooseKdr()"
      label="开单人"
      type="text"
      readonly
      placeholder="请选择开单人"
      required>
    </van-field>
    <van-field
      v-model="form.department_name"
      @click="chooseKdrbm()"
      label="部门"
      type="text"
      readonly
      placeholder="请选择部门"
      required>
    </van-field>

    <div @click="showpdf()" class="addInput bottom">
      预览电子合同
    </div>

    <!--select 选择-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectShow" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onSelectCancel"
        @confirm="onSelectConfirm"></van-picker>
    </van-popup>
    <!--选择时间-->
    <ChooseTime :module="dateShow" :formatData="dateFormData" @close="onDateCancel" @onDate="onDateChoose"></ChooseTime>
    <!--选择备注条款列表-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="isShowChooseRemark" position="bottom"
               :overlay="true">
      <van-checkbox-group v-model="choosedRemarks" style="margin:1em;" @change="changeContracts">
        <van-checkbox v-for="(item,index) in remarks" :name="item" :key="index">{{item.name}}</van-checkbox>
      </van-checkbox-group>
    </van-popup>
    <!--选择非房东费用列表-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="isShowChooseNoProperty" position="bottom"
               :overlay="true">
      <van-checkbox-group v-model="choosedNoOwnerFees" @change="changeNoPropertyFee">
        <van-checkbox v-for="(item,index) in noOwnerFees" :name="item" :key="index">{{item.name}}</van-checkbox>
      </van-checkbox-group>
    </van-popup>
    <pdf-dialog style="width: 100%;height: 100%;position: fixed;top:0;z-index: 1000" ref="pdf"></pdf-dialog>
  </div>
</template>

<script>
  //id name 实体类
   export  class CommonIdNameEntity {
    constructor(id, name) {
      this.id = id || '';
      this.name = name || '';
    }
  }

  //房东实体类
  export class HouseOwner {
    constructor(name, idcard, phone, userid) {
      this.name = name || '';
      this.idcard = idcard || '';
      this.phone = phone || '';
      this.fadada_user_id = userid || ''
    }
  }

  //月单价和付款方式
  export class MonthPayAndPayMedthod {
    constructor(date, cycle, price, methodEntity) {
      this.date = date || '';
      this.cycle = cycle || '';
      this.price = price || '';
      this.methodEntity = methodEntity || new CommonIdNameEntity();
    }
  }

  import ChooseTime from '../../common/chooseTime.vue'
  import PdfDialog from '@/components/common/pdf/PdfDialog'
  import * as contractApi from './contractCreater'
  import {Toast} from 'vant';

  export default {
    name: "newCollectContract",
    components: {ChooseTime, PdfDialog},
    activated() {
      //获取开单人信息
      let per = JSON.parse(sessionStorage.personal);
      this.form.staff_id = per.id;
      this.form.staff_name = per.name;
      this.form.department_id = per.department_id;
      this.form.department_name = per.department_name;
      this.form.staff_phone = per.phone;
      if (sessionStorage.getItem('number') === null) {
        contractApi.getNumber(number => {
          this.form.contract_number = number;
          sessionStorage.setItem('number',number);
        }, error => {
          Toast(error)
        });
      }else{
        this.form.contract_number = sessionStorage.getItem('number');
      }
      //获取房屋信息
      let item = JSON.parse(sessionStorage.getItem('item'));
      //console.log(item)
      let house_res = item.house_res;
      let house_res_com = house_res.community;

      this.form.house.id = house_res.id;
      this.form.house.name = house_res.address;
      this.form.province = house_res_com.province.province_name;//省
      this.form.city = house_res_com.city.city_name;//市
      this.form.district = house_res_com.area.area_name;
      this.form.property_address = house_res_com.address;//街道
      this.form.village_name = house_res_com.village_name;//校区地址
      let house_types = item.house_type.replace("室", "-").replace("厅", "-").replace("卫", "").split("-");
      this.form.room = house_types[0];//室
      this.form.hall = house_types[1];//厅
      this.form.toilet = house_types[2];//卫
      this.form.area = house_res.area;//面积

    },
    methods: {
      showpdf() {

        this.form.month_price = this.monthPriceAndPayMethods[0].price;
        this.form.payway = this.monthPriceAndPayMethods[0].methodEntity.id;
        contractApi.cancelContract(this.form.contract_number,success=>{
          contractApi.createCollectContract(this.$refs.pdf, this.form,error=>{
            Toast(error)
          })
        },error=>{
          Toast(error)
        });
      },
      //选择房屋
      chooseHouse() {
        this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
      },
      getIdsFromList(entitys) {
        let ids = [];
        for (let i = 0; i < entitys.length; i++) {
          let entity = entitys[i];
          ids.push(entity.id);
        }
        return ids;
      },
      getNameFromList(entitys) {
        let names = [];
        for (let i = 0; i < entitys.length; i++) {
          let entity = entitys[i];
          names.push(entity.name);
        }
        return names;
      },
      //添加附属房东信息
      addNewHouseOwner() {
        this.form.houseOwners.push(new HouseOwner())
      },
      //显示选择项
      showSelect(entitys) {
        this.columns = this.getNameFromList(entitys);//设置当前弹框展示的数据
        this.curDatas = entitys;//设置当前元数据
        this.selectShow = true;//显示弹框

      },
      onSelectCancel() {
        this.selectShow = false;//关闭弹框

      },
      onSelectConfirm(value, index) {
        this.selectShow = false;//关闭弹框
        switch (this.curDatas) {
          case this.houseCertificateTypes://选择持有证件的类型
            this.form.house_certificate = this.houseCertificateTypes[index].id;
            this.houseCertificateTypeTxt = this.houseCertificateTypes[index].name;
            break;
          case this.payMethods://选择付款方式
            this.monthPriceAndPayMethods[this.payMethodsIndex].methodEntity = this.payMethods[index];
            break;
          case this.canDecorations://是否可以装修
            this.canDecorationsTxt = value;
            this.form.allowed_decoration_to = this.canDecorations[index].id;
            break;
          case this.canAddThings://是否添加新物
            this.canAddThingTxt = value;
            this.form.allowed_add_to = this.canAddThings[index].id;
            break;
          case this.signPeoples://签约人列表
            this.signPeople = value;
            if (index === this.signPeoples.length - 1) {
              this.showProxyInfo = true;
              this.form.signer_type = 2;
            } else {
              this.form.signer_type = 1;
              this.showProxyInfo = false;
            }
            break;
        }
      },
      // 显示日期
      dateChoose(val, time) {
        setTimeout(() => {
          this.dateShow = true;
        }, 200);
        this.dateFormData.dateVal = time;
        this.dateFormData.dataKey = val;
        this.dateFormData.dateType = 'date';
      },
      //取消时间
      onDateCancel() {
        this.dateShow = false;
      },
      //选定时间
      onDateChoose(val) {
        this.dateShow = false;
        this.form[val.dataKey] = val.dateVal;
        switch (val.dataKey) {
          case 'begin_date':
            this.endDate(val.dateVal, '', this.form.vacany_other, 1);
            break;
          case 'end_date_vacant':
            this.endDate(val.dateVal, this.form.month, this.form.day, 2);
            break;
          case 'pay_first_date':
            this.form.pay_first_date = val.dateVal;
            //this.form.period_price_arr[0] = this.form.month;
            //this.form.period_pay_arr[0] = this.form.month;
            // this.first_date = [];
            // this.datePrice = [];
            // this.datePay = [];
            //this.first_date.push(val.dateVal);
            // this.datePrice.push(val.dateVal);
            // this.datePay.push(val.dateVal);
            // this.countDate(1, this.form.period_price_arr);
            // this.countDate(2, this.form.period_pay_arr);
            this.monthPriceAndPayMethods[0].date = val.dateVal;
            this.monthPriceAndPayMethods[0].cycle = this.form.month;//周期
            break;
        }
      },
      // 结束日期
      endDate(time, month, day, val) {
        let params = {};
        if (val === 1) {
          params.begin_date = time;
          params.vacancy = day;
          params.type = val;
          if (time && day) {
            this.computedDate(params).then((date) => {
              this.form.end_date_vacant = date;
              this.endDate(date, this.form.month, this.form.day, 2);
            })
          } else {
            this.form.end_date_vacant = '';
            this.endDate('', this.form.month, this.form.day, 2);
          }
        } else {
          params.begin_date = time;
          params.month = month;
          params.day = day;
          params.type = val;
          if (time && (month || day)) {
            this.computedDate(params).then((date) => {
              this.form.end_date = date;
            })
          } else {
            this.form.end_date = '';
          }
        }
      },
      //添加月单价和付款方式
      addMonthPay() {
        this.monthPriceAndPayMethods.push(new MonthPayAndPayMedthod())
      },
      //选择付款方式
      choosePayMethods(entitys, index) {
        this.showSelect(entitys);
        this.payMethodsIndex = index;
      },
      //当非房东费用改变时，处理数据
      changeNoPropertyFee() {
        this.noOwnerFeeTxt = '';
        let json = {};
        for (let i = 0; i < this.choosedNoOwnerFees.length; i++) {
          let name = this.choosedNoOwnerFees[i].name;
          this.noOwnerFeeTxt = this.noOwnerFeeTxt + (i + 1) + '、' + name;
          json[i] = this.choosedNoOwnerFees[i].id;
        }
        this.form.not_owner_fee = json;
      },
      //显示非房东费用弹框
      showChooseNoOwnerFee() {
        this.isShowChooseNoProperty = true;
      },
      //显示选择备注弹框
      showChooseRemark() {
        this.isShowChooseRemark = true;
      },
      //当备注条款改变时
      changeContracts() {
        this.remarksTxt = '';
        let json = [];
        for (let i = 0; i < this.choosedRemarks.length; i++) {
          this.remarksTxt = this.remarksTxt + (i + 1) + '、' + this.choosedRemarks[i].name;
          json[i] = this.choosedRemarks[i].id;
        }
        this.form.other_rule = json;
      },
      //显示签约人列表
      showSignPeoples() {
        this.signPeoples = [];
        for (let i = 0; i < this.form.houseOwners.length; i++) {
          let houseOwner = this.form.houseOwners[i];
          this.signPeoples.push(houseOwner.name);
        }
        this.signPeoples.push('其他');
        this.columns = this.signPeoples;
        this.curDatas = this.signPeoples;//设置当前元数据
        this.selectShow = true;//显示弹框
      },
      //选择开单人
      chooseKdr() {
        this.$router.push({path: '/organize'});
      },
      //选择开单人部门
      chooseKdrbm() {
        this.$router.push({path: '/depart'});
      }

    },
    data() {
      return {
        selectShow: false,//选择弹框是否显示
        dateShow: false,//选择时间弹框是否显示
        isShowChooseNoProperty: false,//是否显示选择非房东费用
        isShowChooseRemark: false,//是否显示备注弹框
        columns: [],//选择弹框的数据源
        dateFormData: {
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          dateType: '',
        },
        curEntitys: [],//当前显示的选择弹框的数据
        curDatas: [],//当前显示的选择弹框的元数据，就是CommonIdNameEntity的集合
        houseCertificateTypes: [new CommonIdNameEntity('1', '房屋所有权证'), new CommonIdNameEntity('2', '房屋买卖合同'), new CommonIdNameEntity('3', '其他房屋来源')],
        houseCertificateTypeTxt: '',//房屋证明类别文字
        monthPriceAndPayMethods: [new MonthPayAndPayMedthod()],
        payMethodsIndex: 0,//付款方式index
        payMethods: [new CommonIdNameEntity('1', '月付'), new CommonIdNameEntity('2', '双月付'), new CommonIdNameEntity('3', '季付'), new CommonIdNameEntity('4', '半年付'), new CommonIdNameEntity('5', '年付')],
        noOwnerFees: [new CommonIdNameEntity('1', '水费'), new CommonIdNameEntity('2', '电费'),
          new CommonIdNameEntity('3', '燃气费'),
          new CommonIdNameEntity('4', '网费'), new CommonIdNameEntity('5', '物业管理费')],
        choosedNoOwnerFees: [],//已选择的非房东费用列表
        noOwnerFeeTxt: '',//展示非房东费用的字段
        canDecorations: [new CommonIdNameEntity('1', '允许'), new CommonIdNameEntity('2', '不允许')],//是否允许装修
        canDecorationsTxt: '',//是否允许装修txt
        canAddThings: [new CommonIdNameEntity('1', '允许'), new CommonIdNameEntity('2', '不允许')],//是否允许添加新物
        canAddThingTxt: '',//是否允许添加新物txt
        //合同备注条款数据
        remarks: [new CommonIdNameEntity('1', '不能群租'), new CommonIdNameEntity('1', '不得扰民'), new CommonIdNameEntity('2', '不能随意搬动屋内家具家电'), new CommonIdNameEntity('3', '不能故意拆卸家具家电'), new CommonIdNameEntity('4', '不得养宠物'), new CommonIdNameEntity('5', '不得租住新疆人或外国人'), new CommonIdNameEntity('6', '乙方不得将房屋用于承办丧事、喜事等商业用途'), new CommonIdNameEntity('7', '租期内，乙方所产生的民事法律责任，乙方独自承担, 保修期外的家具家电人为损坏，乙方照价赔偿'), new CommonIdNameEntity('8', '乙方居住10日内尽快办理居住证')],
        choosedRemarks: [],//已选择的备注条款
        remarksTxt: '',//备注条款展示文字
        signPeoples: [], //签约人列表，包括已选的房东和其他，其他时显示代理人
        signPeople: '',//某房东姓名或者其他
        showProxyInfo: false,//显示代理信息

        form: {
          house: {
            id: '',
            name: ''
          },
          contract_number: "",
          name: '',
          identity: "1",
          province: "",
          city: "",
          district: "",
          property_address: "",
          village_name: "",
          room: "",
          hall: "",
          toilet: "",
          area: "",
          house_certificate: "",
          property_number: "",
          QiuQuan_number: "",
          owner: "",
          begin_date: "",
          end_date: "",
          month: "",
          day: "0",
          end_date_vacant: "",
          vacancy: 3,
          vacancy_other: "",
          deposit: '',
          partA_agents: '',//代理人信息
          month_price: "",
          bank: "",
          subbranch: "",
          account_name: "",
          account: "",
          sub_owner: '',//附属房东
          signer_type: '1',//签约类型1产权 2代理
          payway: "",//1月付 2双月付
          pay_first_date: "",
          pay_second_date: "",
          not_owner_fee: {},
          other_fee_text: "",
          allowed_decoration_to: "",
          allowed_add_to: "",
          penalty: "",
          phone: "",
          staff_phone: "",
          sign_date: "",
          pdf_scene: 1,
          customerIds: '3328',
          other_rule: {},
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
          houseOwners: [new HouseOwner()],//房屋所有人HouseOwner类的列表

        }
      }
    }
  }
</script>

<style scoped lang="scss">

  .van-checkbox-group {
    padding-left: 2em;

    .van-checkbox {
      display: flex;
      margin-top: 1em;
      margin-bottom: 1em;

      .van-checkbox__label {

      }
    }
  }
</style>
