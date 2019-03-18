<template>
  <div id="collectReport">
    <div class="main" id="main">
      <van-cell-group>
        <van-radio-group v-model="form.type">
          <van-radio name="1">新收</van-radio>
          <van-radio name="2">续收</van-radio>
        </van-radio-group>
        <!--<van-field-->
        <!--v-if="form.regenerate===1||form.regenerate==='1'"-->
        <!--v-model="form.old_contract_number"-->
        <!--label="原合同编号"-->
        <!--type="text"-->
        <!--placeholder=""-->
        <!--readonly-->
        <!--required>-->
        <!--</van-field>-->
        <!--<van-field-->
        <!--v-model="form.contract_number"-->
        <!--label="合同编号"-->
        <!--type="text"-->
        <!--placeholder="请填写收房合同编号"-->
        <!--readonly-->
        <!--required>-->
        <!--</van-field>-->
        <van-field
          v-model="form.house.name"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.property_address"
          label="产权地址"
          type="text"
          required
          placeholder="请填写产权地址"
          icon=""
          @click-icon="form.property_address = ''">
        </van-field>
        <van-field
          v-model="form.village_name"
          label="物业地址"
          type="text"
          placeholder="请填写物业地址"
          icon=""
          required
          @click-icon="form.village_name = ''">
        </van-field>
        <van-field
          v-model="showForm.houseCertificateTypeTxt"
          label="持有证件"
          readonly
          @click="showSelect(houseCertificateTypes)"
          type="text"
          placeholder="请选择持有证件"
          required>
        </van-field>
        <van-field
          v-if="showForm.houseCertificateTypeTxt==='其他房屋来源'"
          v-model="form.other_house_cert"
          label="其他房屋证明"
          type="text"
          placeholder="请填写其他房屋证明"
          icon=""
          @click-icon="form.other_house_cert = ''"
          required>
        </van-field>
        <van-field
          v-model="form.property_number"
          label="产权证号"
          type="text"
          placeholder="请填写产权证号"
          icon=""
          @click-icon="form.property_number = ''"
        >
        </van-field>
        <van-field
          v-model="form.QiuQuan_number"
          label="丘权号"
          type="text"
          placeholder="请填写丘权号"
          icon=""
          @click-icon="form.QiuQuan_number = ''">
        </van-field>
        <div class="changes" v-for="(item,index) in form.owner">
          <div class="paddingTitle">
            <span>房东<span v-if="form.owner.length > 1">({{index + 1}})</span></span>
            <span class="colors" v-if="form.owner.length > 1" @click="form.owner.splice(index)">删除</span>
          </div>
          <van-field
            v-model="form.owner[index].name"
            label="房东姓名"
            type="text"
            @keyup="onSignerChanged(form.owner[index])"
            placeholder="请填写房东姓名"
            icon="clear"
            @click-icon="form.owner[index].name=''"
            required>
          </van-field>
          <van-field
            @keyup="onSignerChanged(form.owner[index])"
            v-model="form.owner[index].idcard"
            label="房东身份证号"
            type="text"
            placeholder="请填写房东身份证号"
            icon="clear"
            @click-icon="form.owner[index].idcard= ''"
            required>
          </van-field>
          <van-field
            @keyup="onSignerChanged(form.owner[index])"
            v-model="form.owner[index].phone"
            label="联系方式"
            type="number"
            class="number"
            placeholder="请填写联系方式"
            icon="clear"
            @click-icon="form.owner[index].phone= ''"
            required>
          </van-field>
        </div>
        <div @click="addNewHouseOwner" class="addInput bottom">
          +添加附属房东
        </div>
        <van-field
          v-model="showForm.signPeople"
          label="签约人"
          type="text"
          placeholder="请选择签约人"
          @click="showSignPeoples()"
          readonly
          required>
          <van-button slot="button" size="small" type="primary" @click="trueName(form.signer)">
            {{(form.signer!==null&&form.signer.fadada_user_id!==''&&form.signer.fadada_user_id!==undefined)?'已认证':'实名认证'}}
          </van-button>
        </van-field>
        <div v-if="showForm.showProxyInfo">
          <van-field
            @keyup="onSignerChanged(form.signer)"
            v-model="form.signer.name"
            label="代理人姓名"
            type="text"
            placeholder="请填写代理人姓名"
            icon=""
            @click-icon="form.signer.name = ''"
            required>
          </van-field>
          <van-field
            @keyup="onSignerChanged(form.signer)"
            v-model="form.signer.phone"
            label="代理人手机号"
            type="text"
            placeholder="请填写代理人手机号"
            icon=""
            @click-icon="form.signer.phone = ''"
            required>
          </van-field>
          <van-field
            @keyup="onSignerChanged(form.signer)"
            v-model="form.signer.idcard"
            label="代理人身份证号"
            type="text"
            placeholder="请填写代理人身份证号"
            icon=""
            @click-icon="form.signer.idcard = ''"
            required>
          </van-field>
        </div>
        <van-field
          v-model="showForm.noOwnerFeeTxt"
          label="非房东费用"
          readonly
          type="text"
          @click="showChooseNoOwnerFee()"
          placeholder="请选择非房东费用(可多选)"
        >
        </van-field>
        <van-field
          v-model="curWuyePayers.name"
          label="物业费付款人"
          type="text"
          placeholder="请选择物业费付款人"
          @click="selectShow(6,'')"
          readonly
          required>
        </van-field>
        <van-field
          v-model="form.other_fee_text"
          v-if="getIsShowOtherFee()"
          label="其他费用"
          type="text"
          placeholder="请填写其他费用"
          icon="clear"
          @click-icon="form.other_fee_text=''"
          required>
        </van-field>
        <van-field
          v-model="showForm.canDecorationsTxt"
          label="可否装修"
          readonly
          type="text"
          @click="showSelect(canDecorations)"
          placeholder="请选择可否装修"
          required>
        </van-field>
        <van-field
          v-model="showForm.canAddThingTxt"
          label="可否添加物品"
          readonly
          type="text"
          @click="showSelect(canAddThings)"
          placeholder="请选择可否添加物品"
          required>
        </van-field>
        <van-field
          v-model="showForm.remarksTxt"
          label="备注条款"
          readonly
          type="text"
          @click="showChooseRemark()"
          placeholder="请选择备注条款(可多选)"
        >
        </van-field>

        <van-field
          v-model="form.sign_date"
          label="签约日期"
          readonly
          type="text"
          @click="timeChoose('sign_date', form.sign_date)"
          placeholder="请选择签约日期日期"
          required>
        </van-field>
        <div class="first_date month">
          <div class="titles required">签约时长</div>
          <van-field
            v-model="form.month"
            type="number"
            class="number"
            @keyup="endDate(form.end_date_vacant, form.month, form.day, 2)"
            placeholder="请填写月数">
          </van-field>
          <van-field
            v-model="form.day"
            type="number"
            class="number"
            @keyup="endDate(form.end_date_vacant, form.month, form.day, 2)"
            placeholder="请填写天数">
          </van-field>
        </div>
        <div v-if="form.type==='1'">
          <div class="titleRed">不包含空置期</div>
          <van-field
            v-model="form.begin_date"
            type="text"
            label="空置期开始"
            placeholder="请选择空置期开始日期"
            readonly
            @click="timeChoose('begin_date', form.begin_date)"
            required>
          </van-field>
          <van-field
            v-model="form.vacancy"
            label="空置期(天)"
            type="number"
            class="number"
            @keyup="endDate(form.begin_date, '', form.vacancy, 1)"
            placeholder="请填写空置期"
            icon="clear"
            @click-icon="form.vacancy = ''"
            required>
          </van-field>
          <van-field
            v-model="form.end_date_vacant"
            type="text"
            label="空置期结束"
            placeholder="请选择空置期结束日期"
            readonly
            @click="timeChoose('end_date_vacant', form.end_date_vacant)"
            required>
          </van-field>
          <van-field
            v-model="vacancy_way_name"
            @click="selectShow(7,'')"
            label="空置期规则"
            type="text"
            readonly
            placeholder="空置期规则"
            required>
          </van-field>
          <van-field
            v-model="form.vacancy_other"
            label="空置期规则"
            type="text"
            v-if="vacancy_way_name === '其他'"
            placeholder="空置期规则"
            required>
          </van-field>
        </div>
        <van-field
          v-if="form.type==='2'"
          v-model="form.begin_date"
          type="text"
          label="合同开始时间"
          placeholder="请选择合同开始时间"
          readonly
          @click="timeChoose('begin_date', form.begin_date)"
          required>
        </van-field>
        <van-field
          v-model="form.end_date"
          label="合同结束日期"
          readonly
          type="text"
          @click="timeChoose('end_date', form.end_date)"
          placeholder="请选择合同结束日期"
          required>
        </van-field>
        <div class="first_date noBorder">
          <div class="titles required">打房租日期</div>
          <van-field
            v-model="form.pay_first_date"
            readonly
            type="text"
            @click="timeChoose('pay_first_date', form.pay_first_date)"
            placeholder="第一次打款日期">
          </van-field>
          <span class="cut" style="padding-right: 20px;">-</span>
          <van-field
            v-model="form.pay_second_date"
            readonly
            type="text"
            @click="timeChoose('pay_second_date', form.pay_second_date)"
            placeholder="第二次打款日期">
          </van-field>
        </div>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountPrice">
        <div class="paddingTitle">
          <span>月单价<span v-if="amountPrice > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountPrice > 1" @click="deleteAmount(index,1)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="datePrice[index]"
            type="text"
            label="开始时间"
            placeholder="获取周期开始日期"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_price_arr[index]"
            type="number"
            class="number"
            label="付款周期"
            :disabled="amountPrice === 1 && form.period_price_arr[index] === form.month"
            @keyup="periodDate(1)"
            placeholder="请填写月单价周期"
            required>
          </van-field>
          <van-field
            v-model="form.price_arr[index]"
            type="text"
            class="number"
            label="价格"
            placeholder="请填写金额"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(1)" class="addInput">
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
      <div class="changes" v-for="(key,index) in amountPay">
        <div class="paddingTitle">
          <span>付款方式<span v-if="amountPay > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountPay > 1" @click="deleteAmount(index,2)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="datePay[index]"
            type="text"
            label="开始时间"
            placeholder="获取周期开始日期"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_pay_arr[index]"
            type="number"
            class="number"
            label="付款周期"
            :disabled="amountPay === 1 && form.period_pay_arr[index] === form.month"
            @keyup="periodDate(2)"
            placeholder="请填写付款方式周期"
            required>
          </van-field>
          <van-field
            @click="selectShow(4,index)"
            v-model="payTypeNum[index]"
            label="付款方式"
            type="text"
            readonly
            placeholder="请选择付款方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(2)" class="addInput bottom">
        +付款方式变化
      </div>

      <van-cell-group>
        <van-field
          v-if="form.type==='1'"
          v-model="cusFrom"
          @click="selectShow(1,'')"
          label="是否渠道"
          type="text"
          readonly
          placeholder="是否渠道"
          required>
        </van-field>
        <div style="border-bottom: 1px solid #f4f4f4;" v-if="form.is_agency === 1">
          <van-field
            v-model="form.agency_name"
            label="渠道名称"
            type="text"
            placeholder="请填写渠道名称"
            icon="clear"
            @click-icon="form.agency_name = ''"
            required>
          </van-field>
          <van-field
            v-model="form.agency_price"
            label="渠道费"
            type="text"
            class="number"
            placeholder="请填写渠道费"
            icon="clear"
            @click-icon="form.agency_price = ''"
            required>
          </van-field>
          <van-field
            v-model="form.agency_user_name"
            label="渠道人"
            type="text"
            placeholder="请填写渠道人"
            icon="clear"
            @click-icon="form.agency_user_name = ''"
            required>
          </van-field>
          <van-field
            v-model="form.agency_phone"
            label="渠道联系方式"
            type="text"
            class="number"
            placeholder="请填写渠道联系方式"
            icon="clear"
            @click-icon="form.agency_phone = ''"
            required>
          </van-field>
        </div>


        <div class="first_date noBorder">
          <div class="titles required">保修期</div>
          <van-field
            v-model="form.warranty"
            type="number"
            class="number"
            placeholder="保修期(月)">
          </van-field>
          <van-field
            class="twoBorder number"
            v-model="form.warranty_day"
            type="number"
            placeholder="保修期(天)">
          </van-field>
        </div>


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
        <van-field
          v-model="form.relationship"
          label="关系"
          type="text"
          placeholder="请填写收款人与房东关系"
          icon="clear"
          @click-icon="form.relationship = ''"
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
        <van-switch-cell v-model="corp" title="是否公司单"/>
        <div @click="previewPdf" class="addInput bottom">
          +预览电子合同
        </div>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'screenshot'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <div class="aloneModel required" v-if="false">
        <div class="title"><span>*</span>合同照片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData" :isClear="isClear" :editImage="photos"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>房产证照片</div>
        <UpLoad :ID="'property_photo'" @getImg="getImgData" :isClear="isClear" :editImage="property_photos"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>证件照片</div>
        <UpLoad :ID="'identity_photo'" @getImg="getImgData" :isClear="isClear" :editImage="identity_photos"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.staff_name"
          @click="searchSelect(2)"
          label="开单人"
          type="text"
          readonly
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="form.department_name"
          @click="searchSelect(4)"
          label="部门"
          type="text"
          readonly
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <!--<div class="footer" v-if="counts === '2' || counts === '21'">-->
    <!--<div @click="saveCollect(0)">修改</div>-->
    <!--</div>-->

    <div class="footer">
      <div @click="close_()">重置</div>
      <div @click="sendOrSave(1)">草稿</div>
      <div @click="sendOrSave(0)">发布</div>
    </div>

    <pdf-dialog style="width: 100%;height: 100%;position: fixed;top:0;z-index: 1000" ref="pdf"></pdf-dialog>


    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

    <!--日期-->
    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></ChooseTime>

    select 选择电子合同新加
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="eshow" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onSelectCancel"
        @confirm="onSelectConfirm"></van-picker>
    </van-popup>

    <!--选择非房东费用列表电子合同新加!-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="isShowChooseNoProperty" position="bottom"
               :overlay="true">
      <van-checkbox-group v-model="showForm.choosedNoOwnerFees" @change="changeNoPropertyFee">
        <van-checkbox v-for="(item,index) in noOwnerFees" :name="item" :key="index">{{item.name}}</van-checkbox>
      </van-checkbox-group>
    </van-popup>

    <!--选择备注条款列表-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="isShowChooseRemark" position="bottom"
               :overlay="true">
      <van-checkbox-group v-model="showForm.choosedRemarks" style="margin:1em;" @change="changeContracts">
        <van-checkbox v-for="(item,index) in remarks" :name="item" :key="index">{{item.name}}</van-checkbox>
      </van-checkbox-group>
    </van-popup>
    <!--选择备注条款列表-->
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import ChooseTime from '../../common/chooseTime.vue'
  import {Toast} from 'vant';
  import * as contractApi from './contractCreater'
  import PdfDialog from '@/components/common/pdf/PdfDialog'

  //id name 实体类
  export class CommonIdNameEntity {
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
      this.fadada_user_id = userid || '';
    }
  }

  export default {
    name: "index",
    components: {UpLoad, Toast, ChooseTime, PdfDialog},
    data() {
      return {
        /*以下是电子合同新加字段*/
        eshow: false,
        showOtherFee: false,
        isShowChooseNoProperty: false,//是否显示选择非房东费用
        isShowChooseRemark: false,//是否显示备注弹框
        houseCertificateTypes: [new CommonIdNameEntity('1', '房屋所有权证'), new CommonIdNameEntity('2', '房屋买卖合同'), new CommonIdNameEntity('3', '其他房屋来源')],
        curDatas: [],//当前显示的选择弹框的元数据，就是CommonIdNameEntity的集合
        noOwnerFees: [new CommonIdNameEntity('1', '水费'), new CommonIdNameEntity('2', '电费'),
          new CommonIdNameEntity('3', '燃气费'),
          new CommonIdNameEntity('5', '网费'), new CommonIdNameEntity('4', '物业管理费'), new CommonIdNameEntity('6', '其他费用')],
        canDecorations: [new CommonIdNameEntity('1', '允许'), new CommonIdNameEntity('0', '不允许')],//是否允许装修
        canAddThings: [new CommonIdNameEntity('1', '允许'), new CommonIdNameEntity('0', '不允许')],//是否允许添加新物
        curWuyePayers: {},//已选物业费付款人信息
        wuyePayers: [new CommonIdNameEntity('450', '无物业费'),
          new CommonIdNameEntity('451', '房东承担'),
          new CommonIdNameEntity('452', '租客承担'),
          new CommonIdNameEntity('453', '公司承担')],
        //合同备注条款数据
        remarks: [new CommonIdNameEntity('1', '需经过乙方同意后，上门查房，不能打扰租客生活'),
          new CommonIdNameEntity('2', '房屋内家具家电自然老化，由甲方负责更换，人为损坏乙方负责'),
          new CommonIdNameEntity('3', '乙方将能够通过合法途径获取的租客信息告知甲方'),
          new CommonIdNameEntity('4', '非甲方及房屋原因导致的安全责任事故与甲方无关'),
          new CommonIdNameEntity('5', '同等条件下，房东享有签约权(从乙方处承租）')],
        curContractInfo: '',//ContractInfo类
        /*以上是电子合同新增*/
        haveInHand: true,
        urls: globalConfig.server,
        eurls: globalConfig.e_server,
        picStatus: 'success',
        isClear: false,

        tabs: '',
        columns: [],              //select值
        selectHide: false,
        first_date: [],
        timeModule: false,          //日期状态
        formatData: {
          dateVal: '',            //格式化日期
          dataKey: '',            //字段区分
          dateType: '',
        },

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payType: [''],              //付款方式ID
        payTypeNum: [''],           //付款方式
        payIndex: '',               //付款方式index

        corp: true,                 //公司单
        cusFrom: '',                //是否渠道

        //显示在页面的字段
        showForm: {
          houseCertificateTypeTxt: '',//房屋证明类别文字
          canDecorationsTxt: '',//是否允许装修txt
          choosedNoOwnerFees: [],//已选择的非房东费用列表
          noOwnerFeeTxt: '',//展示非房东费用的字段
          canAddThingTxt: '',//是否允许添加新物txt
          choosedRemarks: [],//已选择的备注条款
          remarksTxt: '',//备注条款展示文字
          signPeoples: [], //签约人列表，包括已选的房东和其他，其他时显示代理人
          signPeople: '',//某房东姓名或者其他
          showProxyInfo: false,//显示代理信息
          trueNames: [],
        },
        pay_way_arr: [''],
        pay_way_arr_name: [''],
        vacancy_way_id: '',
        vacancy_way: '',
        form: {
          type: '1',
          draft: 0,
          contract_id: '',              //合同 续收才有
          house: {
            id: '',
            name: '',
          },
          sign_date: '',                //签约日期
          month: '',                    //收房月数
          day: '',                      //收房天数
          is_agency: '0',                //是否渠道 0不是 1是
          agency_name: '',              //渠道名
          agency_price: '',             //渠道费
          agency_user_name: '',         //渠道人
          agency_phone: '',             //渠道手机号
          begin_date: '',               //空置期开始日期
          end_date: '',                 //合同结束日期
          vacancy: '',                  //空置期
          house_type: '',
          end_date_vacant: '',          //空置期结束日期
          pay_first_date: '',           //第一次付款时间
          pay_second_date: '',          //第二次付款时间
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期
          pay_way_arr: [''],            //付款方式
          period_pay_arr: [''],         //付款方式周期

          vacancy_way: '',              //空置期安排方式
          vacancy_other: '',            //空置期安排方式 随便填
          warranty: '',                 //保修期月
          warranty_day: '',             //保修期天
          is_corp: 1,                   //是否公司单  0个人1公司
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
          contract_number: '',      //合同编号
          screenshot_leader: [],        //领导截图 数组
          photo: [],                    //合同照片 数组
          property_photo: [],               //房产证照片
          identity_photo: [],           //证件照片
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          from_bulletin: 0,
          staff_name: '',               //开单人name
          department_name: '',          //部门name
          /*以下是电子合同特有字段*/
          /*作废重签*/
          old_contract_number: '',
          regenerate: '0',
          /*作废重签*/
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
          not_owner_fee: [],
          other_house_cert: '',//其他房屋证件
          other_fee_text: "",
          allowed_decoration_to: "",
          allowed_add_to: "",
          staff_phone: "",
          pdf_scene: 1,
          other_rule: [],
          signer_type: '',//签约类型1产权 2代理
          signer: {},
          owner: [new HouseOwner()],//房屋所有人HouseOwner类的列表
          cookie: '',
          /*以上是电子合同特有字段*/
        },
        vacancy_way_name: '',           //空置期安置方式
        property_name: '',              //物业费付款人
        photos: [],                     //合同照片
        screenshots: [],                //领导截图
        property_photos: [],                //房产证照片
        identity_photos: [],            //证件照片

        dictValue4: [],                 //付款方式
        value4: [],
        dictValue6: [],                 //房东租客
        value6: [],
        dictValue7: [],                 //安置方式
        value7: [],

        isValue1: true,
        counts: '',

        retry: 0,
      }
    },
    watch: {
      cusFrom() {
        if (this.form.is_agency === 0) {
          this.form.agency_name = '';
          this.form.agency_price = '';
          this.form.agency_user_name = '';
          this.form.agency_phone = '';
        }
      },
      firstMonthPrice(n) {
        this.form.deposit = n;
      }
    },
    activated() {
      //如果房屋信息为空 则请求读草稿
      this.routerIndex('eContract');
      this.ddRent('eContract');

      this.userInfo();
      if (sessionStorage.getItem('contract_house_item') === 'noload') {
        sessionStorage.setItem('contract_house_item', null);
        return
      }
      let item = JSON.parse(sessionStorage.getItem('contract_house_item'));
      if (item === null) {
        console.log('读取合同编号');
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.dicts(success => {
          this.getContractDetail();
        }, error => {
          Toast('加载数据失败！')
        });
      } else {
        console.log('读取房屋信息');
        sessionStorage.setItem('contract_house_item', null);
        let house_res = item.house_res;
        let house_res_com = house_res.community;
        this.form.house = {id: '', name: ''};
        this.form.house.id = item.house_id;
        this.form.house.name = item.house_name;
        this.form.province = house_res_com.province.province_name;//省
        this.form.city = house_res_com.city.city_name;//市
        this.form.district = house_res_com.area.area_name;
        //this.form.property_address = house_res_com.address;//街道
        let house_types = item.house_type.replace("室", "-").replace("厅", "-").replace("卫", "").split("-");
        this.form.room = house_types[0];//室
        this.form.hall = house_types[1];//厅
        this.form.toilet = house_types[2];//卫
        this.form.area = house_res.area;//面积
        if (this.form.type === '2') {//续收
          this.$http.get(this.eurls + 'fdd/contract/read/' + item.contractVal.contract_number).then((res) => {
            if (res.data.code === '40000') {
              let draft = res.data.data.param_map;
              this.form.house_certificate = draft.house_certificate;
              this.showForm.houseCertificateTypeTxt = this.getNameForIndex(this.houseCertificateTypes, this.form.house_certificate);
              this.form.property_address = draft.property_address;
              this.form.village_name = draft.village_name;
              this.form.QiuQuan_number = draft.QiuQuan_number;
              this.form.property_number = draft.property_number;
            }
          })
        } else {
          this.form.village_name = item.house_name;//物业地址
        }
        /*获取电子合同相关字段*/
      }
      let t = this.$route.query;
      if (t.house !== undefined && t.house !== '') {
        let val = JSON.parse(t.house);
        this.form.contract_id = val.id;
        this.form.house_type = val.house_type;
      }
      if (t.staff !== undefined && t.staff !== '') {
        let val = JSON.parse(t.staff);
        this.form.staff_id = val.staff_id;
        this.form.staff_name = val.staff_name;
        this.form.department_id = val.depart_id;
        this.form.department_name = val.depart_name;
        this.isValue1 = val.activeRevise;
        this.stick();
      }
      if (t.depart !== undefined && t.depart !== '') {
        let val = JSON.parse(t.depart);
        this.form.department_name = val.name;
        this.form.department_id = val.id;
        this.isValue1 = val.activeRevise;
        this.stick();
      }
    },
    computed: {
      house() {
        return this.form.house;
      },
      firstMonthPrice() {
        return this.form.price_arr[0];
      }
    },
    methods: {
      onSignerChanged(item) {
        if (this.form.signer === null) {
          return
        }
        this.form.signer.fadada_user_id = ''
      },
      getPic(ids, success) {
        let update = {show: []};
        let list = [];
        let data = {};
        update.show = ids;
        this.$http.post(globalConfig.server + 'api/v1/batch', {'batch': JSON.stringify(update)}).then((res) => {
          if (res.data.code === '110100') {
            res.data.data.forEach((item, index) => {
              data.bucket = item.info.bucket;
              data.created_at = item.created_at;
              data.currentPlace = item.currentPlace;
              data.deleted_at = item.deleted_at;
              data.display_name = item.display_name;
              data.ext = item.info.ext;
              data.host = item.info.host;
              data.id = item.id;
              data.is_video = item.info.mime.indexOf('image') === -1;
              data.mime = item.info.mime;
              data.name = item.name;
              data.raw_name = item.raw_name;
              data.size = item.info.size;
              data.update_at = item.update_at;
              data.uri = item.uri;
              data.user_id = item.user_id;
              list.push(data);
            });
            success(list)
          }
        })
      },
      /*以下是电子合同新加*/
      getSessionInfo() {
        this.form.old_contract_number = sessionStorage.getItem('contract_number');
        this.form.regenerate = sessionStorage.getItem('contract_type');
        this.setContractNumber(sessionStorage.getItem('contract_number'))
      },
      trueName(item) {
        if (item === null) {
          Toast('请先选择签约人');
          return
        }
        let json = {content: this.form, type: '1'};
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.$http.post(this.eurls + 'fdd/contract/stash', json).then(res => {
          if (res.data.code === '40000') {
            contractApi.trueName(item, success => {
              location.href = success
            }, error => {
              Toast(error)
            });
          } else {
            Toast.clear();
            Toast(res.data.msg);
          }
        }).catch(e => {
          Toast.clear();
        });
      },
      getCity(success) {
        this.$http.get(this.urls + 'organization/org/org_to_city/' + this.form.department_id).then(res => {
          //获取合同编号
          contractApi.getNumber(1, res.data.city_id, number => {
            this.setContractNumber(number);
            if (success !== undefined) {
              success();
            }
          }, error => {
            Toast(error)
          });
        });
      },
      previewPdf() {
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.getCity(resp => {
          this.previewTrue();
        });
      },
      previewTrue() {
        if (this.form.type === '2') {
          this.form.end_date_vacant = this.form.begin_date;
        }
        this.form.property_payer = this.curWuyePayers.id;
        contractApi.createContract(this.$refs.pdf, this.form, success => {
        }, error => {
          Toast(error)
        })
      },
      //当非房东费用改变时，处理数据
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
        this.showForm.remarksTxt = '';
        let json = [];

        for (let i = 0; i < this.showForm.choosedRemarks.length; i++) {
          this.showForm.remarksTxt = this.showForm.remarksTxt + (i + 1) + '、' + this.showForm.choosedRemarks[i].name;
          json.push(this.showForm.choosedRemarks[i].id);

        }
        this.form.other_rule = json;
      },
      //显示签约人列表
      showSignPeoples() {
        this.showForm.signPeoples = [];
        for (let i = 0; i < this.form.owner.length; i++) {
          let houseOwner = this.form.owner[i];
          this.showForm.signPeoples.push(houseOwner.name);
        }
        this.showForm.signPeoples.push('其他');
        this.columns = this.showForm.signPeoples;
        this.curDatas = this.showForm.signPeoples;//设置当前元数据
        this.eshow = true;//显示弹框
      },
      getIsShowOtherFee() {
        let isShow = false;
        for (let i = 0; i < this.showForm.choosedNoOwnerFees.length; i++) {
          if (this.showForm.choosedNoOwnerFees[i].id === '6') {
            isShow = true;
          }
        }
        return isShow;
      },
      changeNoPropertyFee() {
        this.showForm.noOwnerFeeTxt = '';
        let list = [];
        // this.curWuyePayers.id = '451';
        // this.curWuyePayers.name = '房东承担';
        for (let i = 0; i < this.showForm.choosedNoOwnerFees.length; i++) {
          let name = this.showForm.choosedNoOwnerFees[i].name;
          this.showForm.noOwnerFeeTxt = this.showForm.noOwnerFeeTxt + (i + 1) + '、' + name;
          list.push(this.showForm.choosedNoOwnerFees[i].id);
          if (this.showForm.choosedNoOwnerFees[i].id === '4') {
            // this.curWuyePayers.id = '453';
            // this.curWuyePayers.name = '公司承担';
          }
        }
        this.form.not_owner_fee = list;
      },
      //添加附属房东信息
      addNewHouseOwner() {
        this.form.owner.push(new HouseOwner())
      },
      getNameForIndex(entitys, id) {
        for (let i = 0; i < entitys.length; i++) {
          let entity = entitys[i];
          if (id === entity.id) {
            return entity.name;
          }
        }
        return '';
      },
      getEntityForIndex(entitys, id) {
        for (let i = 0; i < entitys.length; i++) {
          let entity = entitys[i];
          if (id === entity.id) {
            return entity;
          }
        }
        return null;
      },
      getListFromList(entitys, ids) {
        let list = [];
        for (let i = 0; i < entitys.length; i++) {
          let entity = entitys[i];
          for (let j = 0; j < ids.length; j++) {
            if (entity.id === ids[j]) {
              list.push(entity)
            }
          }
        }
        return list;
      },
      getNameFromList(entitys) {
        let names = [];
        for (let i = 0; i < entitys.length; i++) {
          let entity = entitys[i];
          names.push(entity.name);
        }
        return names;
      },
      setContractNumber(number) {
        number = number || '';
        if (number === 'LJSF') {
          number = '';
        }
        if (number === '') {
          return;
        }
        this.form.contract_number = number;
      },
      //显示选择项
      showSelect(entitys) {
        this.columns = this.getNameFromList(entitys);//设置当前弹框展示的数据
        this.curDatas = entitys;//设置当前元数据
        this.eshow = true;//显示弹框
      },
      onSelectCancel() {
        this.eshow = false;//关闭弹框
      },
      onSelectConfirm(value, index) {
        this.eshow = false;//关闭弹框
        switch (this.curDatas) {
          case this.houseCertificateTypes://选择持有证件的类型
            this.form.house_certificate = this.houseCertificateTypes[index].id;
            this.showForm.houseCertificateTypeTxt = this.houseCertificateTypes[index].name;
            break;
          case this.canDecorations://是否可以装修
            this.showForm.canDecorationsTxt = value;
            this.form.allowed_decoration_to = this.canDecorations[index].id;
            break;
          case this.canAddThings://是否添加新物
            this.showForm.canAddThingTxt = value;
            this.form.allowed_add_to = this.canAddThings[index].id;
            break;
          case this.showForm.signPeoples://签约人列表
            this.showForm.signPeople = value;
            if (index === this.showForm.signPeoples.length - 1) {
              this.showForm.showProxyInfo = true;
              this.form.signer_type = 2;
              this.form.signer = new HouseOwner();
            } else {
              this.form.signer_type = 1;
              this.showForm.showProxyInfo = false;
              this.form.signer = this.form.owner[index]
            }
            break;
        }
      },
      userInfo() {
        let per = JSON.parse(sessionStorage.personal);
        this.form.staff_id = per.id;
        this.form.staff_name = per.name;
        this.form.department_id = per.department_id;
        this.form.department_name = per.department_name;
        this.form.staff_phone = per.phone;
        this.form.cookie = per.session_id;
      },
      accountBank(val) {
        this.$http.get(this.urls + 'bulletin/helper/bankname?card=' + val).then((res) => {
          if (res.data.code === '51110') {
            this.form.bank = res.data.data;
          }
        })
      },
      dicts(success, error) {
        //房东租客
        this.dictionary(449, 1).then((res) => {
          this.value6 = [];
          this.dictValue6 = res.data;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].dictionary_name !== '租客承担') {
              this.value6.push(res.data[i].dictionary_name);
            }
          }
          //付款方式
          this.dictionary(443, 1, 'collect').then((res) => {
            this.value4 = [];
            this.dictValue4 = res.data;
            for (let i = 0; i < res.data.length; i++) {
              this.value4.push(res.data[i].dictionary_name);
            }
            this.pay_way_arr[0] = res.data[0].id;
            this.form.pay_way_arr = this.pay_way_arr;
            this.pay_way_arr_name[0] = res.data[0].dictionary_name;
            this.payTypeNum = this.pay_way_arr_name;
            //安置方式
            this.dictionary(437, 1).then((res) => {
              this.value7 = [];
              this.dictValue7 = res.data;
              for (let i = 0; i < res.data.length; i++) {
                this.value7.push(res.data[i].dictionary_name);
              }
              this.vacancy_way_id = res.data[0].id;
              this.form.vacancy_way = this.vacancy_way_id;
              this.vacancy_way = res.data[0].dictionary_name;
              this.vacancy_way_name = this.vacancy_way;
              success();
            }).catch(e => {
              error();
            });
          }).catch(e => {
            error();
          });
        }).catch(e => {
          error();
        });
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            if (this.form.type === '2') {
              this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
            } else {
              this.$router.push({path: '/collectHouse', query: {type: ''}});
            }
            break;
          case 2:
            this.$router.push({path: '/organize'});
            break;
          case 4:
            this.$router.push({path: '/depart'});
            break;
        }
      },

      // 图片
      getImgData(val) {
        this.picStatus = val[2];
        switch (val[0]) {
          case 'screenshot':
            this.form.screenshot_leader = val[1];
            break;
          case 'photo':
            this.form.photo = val[1];
            break;
          case 'property_photo':
            this.form.property_photo = val[1];
            break;
          case 'identity_photo':
            this.form.identity_photo = val[1];
            break;
        }

      },
      // 显示日期
      timeChoose(val, time) {
        setTimeout(() => {
          this.timeModule = true;
        }, 200);
        this.formatData.dateVal = time;
        this.formatData.dataKey = val;
        this.formatData.dateType = 'date';
      },
      // 确定日期
      onConTime(val) {
        this.form[val.dataKey] = val.dateVal;
        switch (val.dataKey) {
          case 'begin_date':
            let num = (this.form.vacancy ? Number(this.form.vacancy) : 0) + 1;
            if (this.form.type === '1') {
              this.endDate(val.dateVal, '', this.form.vacancy, 1);
            } else {
              this.endDate(this.form.begin_date, this.form.month, this.form.day, 2)
            }
            break;
          case 'end_date_vacant':
            this.endDate(val.dateVal, this.form.month, this.form.day, 2);
            break;
          case 'pay_first_date':
            this.get_first_date(val.dateVal);
            break;
        }
        this.onCancel();
      },
      get_first_date(val) {
        this.form.pay_first_date = val;
        this.form.period_price_arr[0] = this.form.month;
        this.form.period_pay_arr[0] = this.form.month;
        this.first_date = [];
        this.datePrice = [];
        this.datePay = [];
        this.first_date.push(val);
        this.datePrice.push(val);
        this.datePay.push(val);
        this.countDate(1, this.form.period_price_arr);
        this.countDate(2, this.form.period_pay_arr);
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeModule = false;
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        setTimeout(() => {
          this.selectHide = true;
        }, 200);
        switch (val) {
          case 1:
            this.columns = dicts.value8;
            break;
          case 4:
            this.columns = this.value4;
            break;
          case 6:
            this.columns = this.value6;
            break;
          case 7:
            this.columns = this.value7;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.form.is_agency = index;
            this.cusFrom = value;
            break;
          case 4:
            this.payTypeNum[this.payIndex] = value;
            for (let i = 0; i < this.dictValue4.length; i++) {
              if (this.dictValue4[i].dictionary_name === value) {
                this.form.pay_way_arr[this.payIndex] = this.dictValue4[i].id;
              }
            }
            break;
          case 6:
            this.curWuyePayers.name = value;
            for (let i = 0; i < this.dictValue6.length; i++) {
              if (this.dictValue6[i].dictionary_name === value) {
                this.form.property_payer = this.dictValue6[i].id;
                this.curWuyePayers.id = this.dictValue6[i].id;
              }
            }
            break;
          case 7:
            this.vacancy_way_name = value;
            for (let i = 0; i < this.dictValue7.length; i++) {
              if (this.dictValue7[i].dictionary_name === value) {
                this.form.vacancy_way = this.dictValue7[i].id;
              }
            }
            if (value === '其他') {
              this.form.vacancy_other = '';
            }
            break;
        }
        this.selectHide = false;
      },

      // 月单价增加
      priceAmount(val) {
        if (val === 1) {
          this.amountPrice++;
          this.form.period_price_arr.push('');
          this.form.price_arr.push('');
        } else {
          this.amountPay++;
          this.form.period_pay_arr.push('');
          this.form.pay_way_arr.push('');
          this.payTypeNum.push('');
        }
      },
      // 删除月单价
      deleteAmount(index, val) {
        if (val === 1) {
          this.amountPrice--;
          this.form.period_price_arr.splice(index, 1);
          this.form.price_arr.splice(index, 1);
          this.datePrice.splice(index, 1);
          this.periodDate(val);
        } else {
          this.amountPay--;
          this.form.period_pay_arr.splice(index, 1);
          this.form.pay_way_arr.splice(index, 1);
          this.payTypeNum.splice(index, 1);
          this.datePay.splice(index, 1);
          this.periodDate(val);
        }
      },
      // 日期计算
      periodDate(val) {
        let per;
        if (val === 1) {
          per = this.form.period_price_arr;
        } else {
          per = this.form.period_pay_arr;
        }
        this.countDate(val, per);
      },

      // 日期计算
      countDate(val, per) {
        this.$http.get(this.urls + '/bulletin/helper/date', {
          params: {
            begin_date: this.form.pay_first_date,
            period: per,
          }
        }).then((res) => {
          if (res.data.code === '51110') {
            if (val === 1) {
              this.datePrice = this.first_date.concat(res.data.data);
            } else {
              this.datePay = this.first_date.concat(res.data.data);
            }
          }
        })
      },

      // 结束日期
      endDate(time, month, day = 0, val) {
        let params = {};
        if (val === 1) {
          params.begin_date = time;
          params.vacancy = day;
          params.type = val;
          if (time && day) {
            this.computedDate(params).then((date) => {
              this.form.end_date_vacant = date;
              this.endDate(date, this.form.month, this.form.day, 2);
              this.get_first_date(this.myUtils.countDay(date, 1));
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

      sendOrSave(type, success) {//0发布1草稿
        if (this.picStatus === 'err') {
          Toast(this.alertMsg('errPic'));
          return;
        } else if (this.picStatus === 'lose') {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          this.haveInHand = false;
          this.form.is_corp = this.corp ? 1 : 0;
          this.form.day = this.form.day === '' ? '0' : this.form.day;
          this.form.warranty_day = this.form.warranty_day === '' ? '0' : this.form.warranty_day;
          Toast.loading({
            mask: true,
            duration: 0,
            message: '加载中...'
          });
          if (type === 1) {//草稿
            let json = {content: this.form, type: '1'};
            this.$http.post(this.eurls + 'fdd/contract/stash', json).then(res => {
              this.haveInHand = true;
              Toast.clear();
              if (success === undefined) {
                Toast(res.data.msg)
              } else {
                success()
              }
            }).catch(e => {
              Toast.clear();
              this.haveInHand = true;
            });
            return
          }
          this.getSessionInfo();
          if (this.form.province === '') {
            Toast('请先选择房屋地址');
            this.haveInHand = true;
            return
          }
          this.getCity(resp => {
            this.post();
          })
        } else {
          Toast(this.alertMsg('sub'));
        }
      },
      post() {
        let url = this.form.regenerate === 0 || this.form.regenerate === '0' ? 'fdd/contract/saveAndSend' : 'fdd/contract/reset';
        if (this.form.type === '2') {
          this.form.end_date_vacant = this.form.begin_date;
          if (this.form.contract_id === '') {
            Toast('请重新选择房屋地址');
            return
          }
        }
        if (this.form.is_agency === '') {
          this.form.is_agency = '0'
        }
        this.form.property_payer = this.curWuyePayers.id;
        this.$http.post(this.eurls + url, this.form).then((res) => {
          Toast.clear();
          //清除草稿
          this.haveInHand = true;
          this.retry = 0;
          Toast(res.data.msg);
          if (res.data.code === '40000') {
            this.routerDetail(res.data.data.data.id);
            $('.imgItem').remove();
          } else if (res.data.code === '40040') {
            if (res.data.data.is_bulletin) {
              this.routerDetail(res.data.data.data.id)
            } else {
              sessionStorage.setItem('isRefreshList', 'true');
              this.$router.push({path: '/eContract'});
            }
          } else {
            return
          }
          if (this.form.regenerate === 0 || this.form.regenerate === '0') {
            let json = {
              content: {
                staff_id: this.form.staff_id
              }, type: '1'
            };
            this.$http.post(this.eurls + 'fdd/contract/stash', json).then(res => {
            });
          }
        }).catch((error) => {
          Toast.clear();
          this.haveInHand = true;
          if (error.response === undefined) {
            this.alertMsg('net');
          } else {
            if (error.response.status === 401) {
              this.personalGet().then((data) => {
                if (data && this.retry === 0) {
                  this.retry++;

                  this.sendOrSave(this.form.draft);
                }
              });
            }
          }
        })
      },
      // 获取合同详情
      getContractDetail() {
        this.getSessionInfo();

        if (this.form.regenerate === '1') {
          this.$http.get(this.eurls + 'fdd/contract/read/' + this.form.old_contract_number).then((res) => {
            Toast.clear();
            if (res.data.code === '40000') {
              this.isClear = false;
              let draft = res.data.data.param_map;
              this.changeContractData(draft);
            } else {
              this.close_();
              this.userInfo();
            }
          }).catch(e => {
            this.close_();
            this.userInfo();
            Toast.clear();
          })
        } else {
          this.getCity();
          //读小飞草稿
          this.$http.get(this.eurls + 'fdd/contract/stash?staff_id=' + this.form.staff_id + '&type=' + 1).then(res => {
            Toast.clear();
            if (res.data.code === '40000') {
              this.changeContractData(res.data.data)
            } else {
              this.close_();
              this.userInfo();
            }
          }).catch(e => {
            this.close_();
            this.userInfo();
            Toast.clear();
          })
        }
      },
      changeContractData(draft) {
        this.form.contract_id = draft.contract_id;
        this.form.purchase_way = 509;
        this.form.house = {id: '', name: ''};
        this.form.house.id = draft.house.id;


        this.form.house.name = draft.house.name;
        this.form.type = draft.type;
        this.form.province = draft.province;//省
        this.form.city = draft.city;//市
        this.form.district = draft.district;
        this.form.room = draft.room;//室
        this.form.hall = draft.hall;//厅
        this.form.toilet = draft.toilet;//卫
        this.form.area = draft.area;//面积

        this.form.sign_date = draft.sign_date;
        this.form.month = draft.month;
        this.form.day = draft.day === '0' ? '' : draft.day;
        this.form.begin_date = draft.begin_date;
        this.form.end_date = draft.end_date;
        this.form.vacancy = draft.vacancy;
        this.form.end_date_vacant = draft.end_date_vacant;
        this.form.pay_first_date = draft.pay_first_date;
        this.first_date = [];
        this.first_date.push(draft.pay_first_date);
        this.datePrice[0] = draft.pay_first_date;
        this.datePay[0] = draft.pay_first_date;
        this.form.pay_second_date = draft.pay_second_date;
        this.form.is_agency = draft.is_agency;                           //是否渠道
        this.cusFrom = dicts.value8[draft.is_agency];                //是否渠道
        this.form.agency_name = draft.agency_name;
        this.form.agency_price = draft.agency_price;
        this.form.agency_user_name = draft.agency_user_name;
        this.form.agency_phone = draft.agency_phone;
        this.form.property_address = draft.property_address;
        this.form.village_name = draft.village_name;

        for (let i = 0; i < draft.price_arr.length; i++) {
          this.amountPrice = i + 1;
          this.form.period_price_arr.push('');
          this.form.price_arr.push('');
        }
        this.form.period_price_arr = draft.period_price_arr;
        this.countDate(1, draft.period_price_arr);
        this.form.price_arr = draft.price_arr;
        for (let i = 0; i < draft.pay_way_arr.length; i++) {
          this.amountPay = i + 1;
          this.form.pay_way_arr.push('');
          for (let j = 0; j < this.dictValue4.length; j++) {
            if (this.dictValue4[j].id === draft.pay_way_arr[i]) {
              this.payTypeNum[i] = this.dictValue4[j].dictionary_name;
            }
          }
        }
        this.form.period_pay_arr = draft.period_pay_arr;
        this.countDate(2, draft.period_pay_arr);
        this.form.pay_way_arr = draft.pay_way_arr;

        this.form.deposit = draft.deposit;
        this.form.vacancy_way = draft.vacancy_way;

        for (let j = 0; j < this.dictValue7.length; j++) {
          if (this.dictValue7[j].id === draft.vacancy_way) {
            this.vacancy_way_name = this.dictValue7[j].dictionary_name;
          }
        }
        this.form.vacancy_other = draft.vacancy_other;

        this.form.warranty = draft.warranty;
        this.form.warranty_day = draft.warranty_day === '0' ? '' : draft.warranty_day;
        this.form.property_payer = draft.property_payer;
        this.curWuyePayers.id = draft.property_payer;
        for (let j = 0; j < this.dictValue6.length; j++) {
          if (this.dictValue6[j].id === draft.property_payer) {
            this.property_name = this.dictValue6[j].dictionary_name;
            this.curWuyePayers.name = this.dictValue6[j].dictionary_name;
          }
        }
        //this.is_corp = draft.is_corp;
        this.corp = draft.is_corp === 1;

        this.form.name = draft.name;
        this.form.phone = draft.phone;
        this.form.bank = draft.bank;
        this.form.subbranch = draft.subbranch;
        this.form.account_name = draft.account_name;
        this.form.account = draft.account;
        this.form.relationship = draft.relationship;
        this.form.penalty = draft.penalty;
        this.form.photo = draft.photo;
        this.form.screenshot_leader = draft.screenshot_leader;
        this.form.property_photo = draft.property_photo;
        this.form.identity_photo = draft.identity_photo;
        this.form.remark = draft.remark;

        this.getPic(draft.photo, success => {
          this.photos = success;
        });
        this.getPic(draft.screenshot_leader, success => {
          this.screenshots = success;
        });
        this.getPic(draft.property_photo, success => {
          console.log(this.property_photos)
          this.property_photos = success;
        });
        this.getPic(draft.identity_photo, success => {
          this.identity_photos = success;
        });
        this.form.house_certificate = draft.house_certificate;
        this.showForm.houseCertificateTypeTxt = this.getNameForIndex(this.houseCertificateTypes, this.form.house_certificate);
        this.form.QiuQuan_number = draft.QiuQuan_number;
        this.form.property_number = draft.property_number;
        this.form.owner = draft.owner;
        this.form.signer_type = draft.signer_type;
        this.form.signer = draft.signer;

        if (this.form.signer_type === 2) {//代理
          this.showForm.showProxyInfo = true;
          this.showForm.signPeople = '其他';
        } else {//房东
          this.showForm.showProxyInfo = false;
          this.showForm.signPeople = draft.signer.name;
          for (let i = 0; i < this.form.owner.length; i++) {
            let people = this.form.owner[i];
            if (people.name === this.form.signer.name && people.idcard === this.form.signer.idcard && people.phone === this.form.signer.phone) {
              this.form.signer = this.form.owner[i];
            }
          }
        }
        this.form.other_house_cert = draft.other_house_cert;
        //验证身份
        contractApi.trueName(this.form.signer, success => {
        }, error => {
        });
        this.form.not_owner_fee = draft.not_owner_fee;
        let not_owner_fee_choosed_ids = [];
        for (let key in this.form.not_owner_fee) {
          not_owner_fee_choosed_ids.push(this.form.not_owner_fee[key])
        }
        this.form.other_fee_text = draft.other_fee_text;
        this.showForm.choosedNoOwnerFees = this.getListFromList(this.noOwnerFees, not_owner_fee_choosed_ids);
        this.changeNoPropertyFee();
        this.form.allowed_decoration_to = draft.allowed_decoration_to;
        this.showForm.canDecorationsTxt = this.getNameForIndex(this.canDecorations, this.form.allowed_decoration_to);
        this.form.allowed_add_to = draft.allowed_add_to;
        this.showForm.canAddThingTxt = this.getNameForIndex(this.canAddThings, this.form.allowed_add_to);
        this.showForm.choosedRemarks = this.getListFromList(this.remarks, draft.other_rule);
        this.changeContracts();

      },
      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        $('.imgItem').remove();
        this.userInfo(true);
        this.clearObj(this.form);
        this.clearObj(this.showForm);
        this.form.purchase_way = 509;
        this.form.pay_way_arr = this.pay_way_arr;
        this.payTypeNum = this.pay_way_arr_name;
        this.form.vacancy_way = this.vacancy_way_id;
        this.vacancy_way_name = this.vacancy_way;
        this.form.warranty_day = '';
        this.picStatus = 'success';
        this.cusFrom = '';
        this.amountPrice = 1;
        this.datePay = [];
        this.datePrice = [];
        this.amountPay = 1;
        this.payTypeNum = [''];
        this.vacancy_way_name = '';
        this.property_name = '';
        this.corp = true;
        this.photos = {};
        this.screenshots = {};
        this.property_photos = {};
        this.identity_photos = {};
        this.form.type = '1';
        this.form.owner = [new HouseOwner]
      },
      clearObj(obj) {
        Object.keys(obj).forEach(function (key) {
          let o = obj[key];
          if (key === 'contract_number' || key === 'regenerate') {
          } else if (o instanceof Array) {
            obj[key] = [];
          } else if (o instanceof Object) {
            obj[key] = {}
          } else if (typeof (o) === 'string') {
            obj[key] = ''
          } else if (o instanceof Boolean) {
            obj[key] = false;
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  #collectReport {
    overflow: hidden;

    .van-radio-group {
      display: flex;
      padding-top: 1em;
      width: 100%;

      .van-radio {
        flex: 1;
        text-align: center;
      }
    }
  }

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
