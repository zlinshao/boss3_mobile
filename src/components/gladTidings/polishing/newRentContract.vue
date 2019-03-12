<template>
  <div id="rentReport">
    <div class="main" id="main">
      <van-cell-group>
        <div class="rent_types">
          <div class="label">租房类型</div>
          <van-radio-group v-model="form.type">
            <van-radio name="1">新租</van-radio>
            <van-radio name="3">续租</van-radio>
            <van-radio name="2">转租</van-radio>
            <van-radio name="5">调租</van-radio>
            <van-radio name="0">未收先租确定</van-radio>
          </van-radio-group>
        </div>
        <div class="rent_types" v-if="form.type==='2'">
          <div class="label">转租类型</div>
          <van-radio-group v-model="form.trans_type">
            <van-radio name="0">公司</van-radio>
            <van-radio name="1">个人</van-radio>
          </van-radio-group>
        </div>
        <!--<van-field-->
        <!--v-if="form.regenerate===1"-->
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
        <!--placeholder=""-->
        <!--readonly-->
        <!--@click-icon="form.contract_number = ''">-->
        <!--</van-field>-->


        <!--下面是未收先租确定信息-->
        <div class="crop_name noBorder" v-if="form.type==='0'">
          <van-field
            v-model="form.oldHouseName"
            label="原喜报地址"
            type="text"
            readonly
            @click="searchSelect(1)"
            placeholder="请选择原喜报地址"
            required>
          </van-field>
          <div class="titleRed" v-if="form.old_corp_name">{{form.corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
        <!--上面是未收先租确定信息-->

        <!--下面是调房信息-->
        <van-cell-group style="margin-bottom: 12px;" v-if="form.type==='5'">
          <div class="crop_name noBorder">
            <van-field
              v-model="form.old_house_name"
              label="原房屋地址"
              type="text"
              readonly
              @click="searchSelect(1)"
              placeholder="请选择原房屋地址"
              required>
            </van-field>
            <div class="titleRed" v-if="form.old_corp_name">{{form.old_corp_name}}</div>
            <div class="showBorder" v-else></div>
          </div>
          <van-field
            v-model="form.old_staff_name"
            label="原开单人"
            type="text"
            disabled
            placeholder="原房屋原开单人已禁用">
          </van-field>
          <van-field
            class="disabling"
            :class="{'payWay': payStatus && form.old_pay_way_arr.length > 1}"
            @click="payWayClick(1)"
            v-model="form.old_pay_way_arr[0]"
            label="原付款方式"
            type="text"
            readonly
            icon="arrow"
            placeholder="原房屋付款方式已禁用">
          </van-field>
          <div class="accordion" v-if="payStatus && form.old_pay_way_arr.length > 1">
            <div class="accordion" v-if="priceStatus && form.old_pay_way_arr.length > 1">
              <div v-for="(key,index) in form.old_pay_way_arr" v-show="index !== 0">{{key}}</div>
            </div>
          </div>
          <van-field
            class="disabling"
            :class="{'payWay': priceStatus && form.old_price.length > 1}"
            v-model="form.old_price[0]"
            @click="payWayClick(2)"
            label="月单价"
            type="text"
            readonly
            icon="arrow"
            placeholder="月单价已禁用">
          </van-field>
          <div class="accordion" v-if="priceStatus && form.old_price.length > 1">
            <div v-for="(key,index) in form.old_price" v-show="index !== 0">{{key}}</div>
          </div>
          <van-field
            v-model="form.old_front_money"
            label="定金"
            type="text"
            disabled
            placeholder="原房屋定金已禁用">
          </van-field>
        </van-cell-group>
        <!--上面是调租的原房屋-->

        <div class="crop_name noBorder">
          <van-field
            v-model="form.address"
            label="房屋地址"
            type="text"
            readonly
            @click="searchSelect(2)"
            placeholder="请选择房屋地址"
            required>
          </van-field>
          <div class="titleRed" v-if="form.corp_name">{{form.corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
        <van-field
          v-model="rentUseTxt"
          label="租赁用途"
          readonly
          type="text"
          @click="showSelect(rentUses)"
          placeholder="请选择租赁用途"
          required>
        </van-field>
        <van-field
          v-if="showOtherUse"
          v-model="form.other_use"
          label="其他用途"
          type="text"
          @click=""
          placeholder="请输入其他用途"
          required>
        </van-field>
        <van-field
          v-model="form.people"
          label="居住人数"
          type="text"
          placeholder="请输入居住人数"
          required>
        </van-field>

        <van-field
          v-model="rentTypeTxt"
          label="居住类型"
          readonly
          type="text"
          @click="showSelect(rentTypes)"
          placeholder="请选择居住类型"
          required>
        </van-field>
        <div v-if="showWholeFee">
          <van-field
            v-model="form.water_fee"
            label="水费"
            type="text"
            placeholder="元/月"
            icon=""
            readonly
            @click-icon="form.water_fee = ''"
          >
          </van-field>
          <van-field
            v-if="false"
            v-model="form.e_price"
            label="电费"
            type="text"
            placeholder="元/月"
            icon=""
            @click-icon="form.e_price = ''"
          >
          </van-field>
          <van-field
            v-model="form.manage_fee"
            label="管理费"
            type="text"
            placeholder="元/月"
            icon=""
            @click-icon="form.manage_fee = ''"
          >
          </van-field>
          <van-field
            v-model="form.public_fee"
            label="代收物业公摊费"
            type="text"
            placeholder="元/月"
            icon=""
            @click-icon="form.public_fee = ''"
          >
          </van-field>
        </div>

        <van-field
          v-model="form.sign_date"
          label="签约日期"
          readonly
          type="text"
          @click="timeChoose('sign_date', form.sign_date)"
          placeholder="请选择签约日期"
          required>
        </van-field>
        <div class="first_date noBorder">
          <div class="titles required">签约时长</div>
          <van-field
            v-model="form.month"
            type="text"
            class="number"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写月数">
          </van-field>
          <van-field
            class="twoBorder number"
            v-model="form.day"
            type="text"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写天数">
          </van-field>
        </div>
        <van-field
          v-model="form.begin_date"
          label="合同开始日期"
          readonly
          type="text"
          @click="timeChoose('begin_date', form.begin_date)"
          placeholder="请选择合同开始日期"
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
            type="text"
            class="number"
            label="周期"
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

      <van-cell-group>
        <van-field
          v-model="form.pay_way_bet"
          type="text"
          class="number"
          label="押"
          placeholder="请填写付款方式-押"
          @click="selectShow(3)"
          readonly
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountPay">
        <div class="paddingTitle">
          <span>付<span v-if="amountPay > 1">({{index + 1}})</span></span>
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
            type="text"
            class="number"
            label="周期"
            :disabled="amountPay === 1 && form.period_pay_arr[index] === form.month"
            @keyup="periodDate(2)"
            placeholder="other_fee_name"
            required>
          </van-field>
          <van-field
            v-model="form.pay_way_arr[index]"
            label="付(月数)"
            type="text"
            class="number"
            placeholder="如:半年付请输入6"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(2)" class="addInput">
        +付款方式变化
      </div>

      <div class="changes">
        <div class="paddingTitle">
          <span>本次已收金额</span>
        </div>
      </div>

      <van-cell-group>
        <div class="checks">
          <div class="titles required">本次金额为</div>
          <van-radio-group v-model="receivedPrice">
            <van-radio name="front_money">定金</van-radio>
            <van-radio name="deposit_payed">租金+押金</van-radio>
          </van-radio-group>
        </div>
        <van-field
          v-model="form.money_sum"
          type="text"
          class="number"
          label="总金额"
          placeholder="请填写总金额"
          @click-icon="form.money_sum = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>已收金额支付方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index,3)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.money_sep[index]"
            type="text"
            class="number"
            label="金额"
            placeholder="请填写金额"
            required>
          </van-field>
          <van-field
            v-model="form.real_pay_at[index]"
            type="text"
            readonly
            class="number"
            @click="timeChoose('real_pay_at', form.real_pay_at[index], index)"
            label="实际收款时间"
            placeholder="付款凭证截图上的时间"
            required>
          </van-field>
          <van-field
            @click="selectShow(2,index)"
            v-model="form.money_way[index]"
            label="汇款帐户"
            type="text"
            readonly
            placeholder="请选择汇款帐户"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(3)" class="addInput">
        +支付方式变化
      </div>

      <van-cell-group>
        <div class="changes" v-for="(item,index) in form.customer_info">
          <div class="paddingTitle">
            <span>租客<span v-if="form.customer_info.length > 1">({{index + 1}})</span></span>
            <span class="colors" v-if="form.customer_info.length > 1"
                  @click="form.customer_info.splice(index)">删除</span>
          </div>
          <van-field
            v-model="form.customer_info[index].name"
            label="客户姓名"
            type="text"
            placeholder="请填写客户姓名"
            icon="clear"
            @keyup="onChangeInfo(form.customer_info[index])"
            @click-icon="form.customer_info[index].name = ''"
            required>
          </van-field>
          <van-field
            v-model="form.customer_info[index].phone"
            label="联系方式"
            type="text"
            class="number"
            placeholder="请填写联系方式"
            icon="clear"
            @keyup="onChangeInfo(form.customer_info[index])"
            @click-icon="form.customer_info[index].phone= ''"
            required>
          </van-field>
          <van-field
            v-model="form.customer_info[index].idcard"
            label="租客身份证号"
            type="text"
            @keyup="onChangeInfo(form.customer_info[index])"
            placeholder="请填写租客身份证号"
            icon="clear"
            @click-icon="form.customer_info[index].idcard= ''"
            required>
          </van-field>
          <van-field
            :value="getTrueNameInfo(form.customer_info[index])"
            label="实名认证"
            type="text"
            class="number"
            readonly
            placeholder="点击进行实名认证"
            @click="trueName(form.customer_info[index])"
            required>
          </van-field>
        </div>
        <div @click="addNewRentPeople" class="addInput bottom">
          +添加租客
        </div>
        <van-field
          v-model="form.emergency_phone"
          label="紧急联系人手机号"
          type="text"
          placeholder="请输入紧急联系人手机号"
          icon=""
          required
          @click-icon="form.emergency_phone = ''"
        >
        </van-field>
        <van-field
          v-model="form.memo"
          label="收款备注"
          type="textarea"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.memo = ''">
        </van-field>
        <div class="addInput" @click="previewReceipt(form, receivedPrice)">预览电子收据</div>
        <van-switch-cell v-model="other_fee_status" @change="fee_status" title="是否有其他金额"/>
        <van-field
          v-model="form.penalty"
          type="text"
          class="number"
          label="违约金"
          placeholder="收租价格差大于500元的"
          required>
        </van-field>
        <van-field
          v-if="other_fee_status"
          v-model="form.other_fee_name"
          label="费用名称"
          type="text"
          placeholder="请填写名称"
          icon="clear"
          @click-icon="form.other_fee_name = ''"
          required>
        </van-field>
        <van-field
          v-if="other_fee_status"
          v-model="form.other_fee"
          label="费用金额"
          type="text"
          class="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.other_fee = ''"
          required>
        </van-field>
        <van-field
          v-model="form.discount"
          label="让总价金额"
          type="text"
          class="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.discount = 0"
          required>
        </van-field>
        <van-field
          v-model="cusFrom"
          @click="selectShow(5)"
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
        <van-field
          v-model="property_name"
          label="物业费付款人"
          type="text"
          placeholder="请选择物业费付款人"
          @click="selectShow(1)"
          readonly
          required>
        </van-field>
        <van-field
          v-model="remarksTxt"
          label="备注条款"
          readonly
          type="text"
          @click="showChooseRemark()"
          placeholder="请选择备注条款(可多选)"
        >
        </van-field>
        <van-switch-cell v-model="corp" title="是否公司单"/>
        <van-switch-cell v-model="is_receipt" title="电子收据"/>
        <div class="is_receipt_css" v-if="!is_receipt">{{isReceiptMsg.content1}}</div>
      </van-cell-group>
      <div class="changes" v-for="(key,index) in amountReceipt" v-if="!is_receipt">
        <div class="paddingTitle">
          <span>收据编号<span v-if="amountReceipt > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountReceipt > 1" @click="deleteAmount(index,4)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.receipt[index]"
            type="text"
            label="收据编号"
            placeholder="请填写收据编号">
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(4)" class="addInput" v-if="!is_receipt">
        +增加收据编号
      </div>
      <van-cell-group>
        <van-field
          v-model="form.retainage_date"
          label="尾款补齐日期"
          readonly
          type="text"
          @click="timeChoose('retainage_date', form.retainage_date)"
          placeholder="请选择尾款补齐日期"
          required>
        </van-field>
        <div @click="previewPdf" class="addInput bottom">
          +预览电子合同
        </div>

      </van-cell-group>

      <div class="aloneModel">
        <div class="title">领导同意截图</div>
        <UpLoad :ID="'leader'" @getImg="getImgData" :isClear="isClear" :editImage="leaders"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>凭证截图</div>
        <UpLoad :ID="'screenshot'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">
          押金收条
          <div v-if="is_receipt">{{isReceiptMsg.content2}}</div>
        </div>
        <UpLoad :ID="'receipt'" @getImg="getImgData" :isClear="isClear" :editImage="receipts"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">合同照片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData" :isClear="isClear" :editImage="photos"></UpLoad>
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
          @click="searchSelect(3)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="form.department_name"
          @click="searchSelect(4)"
          readonly
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer" v-if="counts === '2' || counts === '21'">
      <div @click="saveCollect(0)">修改</div>
    </div>

    <div class="footer">
      <div @click="close_()">重置</div>
      <div @click="sendOrSave(1)">草稿</div>
      <div @click="sendOrSave(0)">发布</div>
    </div>

    <pdf-dialog style="width: 100%;height: 100%;position: fixed;top:0;z-index: 1000"
                ref="pdf"></pdf-dialog>

    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel"
                @onDate="onConTime"></ChooseTime>

    <!--select 选择-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="eshow" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onSelectCancel"
        @confirm="onSelectConfirm"></van-picker>
    </van-popup>

    <!--选择备注条款列表-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="isShowChooseRemark" position="bottom"
               :overlay="true">
      <van-checkbox-group v-model="choosedRemarks" style="margin:1em;" @change="changeContracts">
        <van-checkbox v-for="(item,index) in remarks" :name="item" :key="index">{{item.name}}</van-checkbox>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import ChooseTime from '../../common/chooseTime.vue'
  import {Toast, Dialog} from 'vant';
  import * as contractApi from './contractCreater'
  import PdfDialog from '@/components/common/pdf/PdfDialog'
  import {CommonIdNameEntity, HouseOwner} from './newCollectContract'
  import {ContractType} from './eContract'

  export default {
    name: "index",
    components: {UpLoad, Toast, ChooseTime, PdfDialog},
    data() {
      return {
        /*电子合同新加*/
        eshow: false,//是否显示选择弹框
        isShowChooseRemark: false,//是否显示备注弹框
        curContractInfo: '',
        curDatas: [],//选择弹框元数据
        rentUses: [new CommonIdNameEntity('1', '自住'), new CommonIdNameEntity('2', '办公使用'), new CommonIdNameEntity('3', '其他用途')],
        rentUseTxt: '',//租赁用途文字
        //合同备注条款数据
        remarks: [new CommonIdNameEntity('1', '不能群租'),
          new CommonIdNameEntity('2', '不得扰民'),
          new CommonIdNameEntity('3', '不能随意搬动屋内家具家电'),
          new CommonIdNameEntity('4', '不能故意拆卸家具家电'),
          new CommonIdNameEntity('5', '不得养宠物'),
          new CommonIdNameEntity('6', '乙方不得将房屋用于承办丧事、喜事等商业用途'),
          new CommonIdNameEntity('7', '租期内，乙方所产生的民事法律责任，乙方独自承担, 保修期外的家具家电人为损坏，乙方照价赔偿'),
          new CommonIdNameEntity('8', '保修期外的家具家电人为损坏，乙方照价赔偿'),
          new CommonIdNameEntity('9', '乙方居住10日内尽快办理居住证')],
        choosedRemarks: [],//已选择的备注条款
        remarksTxt: '',//备注条款展示文字
        showOtherUse: false,//显示其他用途输入框
        showWholeFee: false,//整租时，显示水费等费用
        rentTypes: [new CommonIdNameEntity('1', '整租'), new CommonIdNameEntity('2', '合租')],
        rentTypeTxt: '',//租赁用途文字
        payAccountList: [],//收款账户列表元数据

        /*电子合同新加*/
        timeModule: false,              //日期
        formatData: {
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          dateType: '',                 //日期类型
          idx: '',                      //下标
        },
        haveInHand: true,
        urls: globalConfig.server,
        eurls: globalConfig.e_server,
        isClear: false,                 //删除图片
        picStatus: 'success',

        amountReceipt: 1,               //收据编号
        receiptDate: '',

        tabs: '',
        columns: [],                    //select值
        selectHide: false,              //select选择
        timeShow: false,                //日期状态
        first_date: '',                 //日期value
        receivedPrice: 'front_money',   //本次金额为

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payIndex: '',                   //付款方式index

        amountMoney: 1,

        cusFrom: '',                    //是否渠道
        corp: true,                     //公司单
        other_fee_status: false,
        is_receipt: false,              //电子收据
        isReceiptMsg: {},               //电子收据
        /*下面是调房独有*/

        payStatus: false,
        priceStatus: false,
        /*上面是调房独有*/


        form: {
          /*下面是转租独有*/
          trans_type: '0',//转租类型、默认公司 ,1是个人

          /*上面是转租独有*/

          /*下面是调房独有*/
          old_staff_name: '',
          old_pay_way_arr: [''],
          old_price: [''],
          old_front_money: '',
          old_house_name: '',
          old_corp_name: '',

          /*上面是调房独有*/

          /*下面是未收先租确定独有*/
          oldHouseName: '',
          /*上面是未收先租确定独有*/


          address: '',
          corp_name: '',
          id: '',
          processable_id: '',
          type: '1',
          draft: 0,
          contract_id: '',              //合同id
          house_id: '',                 //房屋地址id
          discount: 0,                  //让价总金额

          month: '',                    //租房月数
          day: '0',                      //租房天数
          sign_date: '',                //签约开始日期
          end_date: '',                 //签约结束日期
          begin_date: '',               //合同开始日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          period_pay_arr: [''],         //付款方式周期
          pay_way_arr: [''],            //付款方式 付

          front_money: '',              //定金
          deposit: '',                  //押金
          rent_money: '',               //租金
          deposit_payed: '',            //已收押金
          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          real_pay_at: [''],            //实际收款时间
          money_way: [''],              //汇款帐户
          account_id: [],               //汇款帐户ID
          memo: '',                     //收款备注

          is_other_fee: 0,
          other_fee: '111',
          other_fee_name: '',
          penalty: '',                     //违约金

          is_agency: '',                //客户来源    0个人1渠道
          agency_name: '',              //渠道名
          agency_price: '',             //渠道费
          agency_user_name: '',         //渠道人
          agency_phone: '',             //渠道手机号

          is_corp: 1,                   //是否公司单  0个人1公司
          contract_number: '',      //合同编号

          is_receipt: 1,                //1是 2不是
          receipt: [''],                //收据编号
          property_payer: '',           //物业费
          retainage_date: '',           //尾款补齐时间
          name: '',                     //客户姓名
          phone: '',                    //电话号码
          screenshot_leader: [],        //领导截图 数组
          screenshot: [],               //凭证截图 数组
          deposit_photo: [],            //押金收条 数组
          photo: [],                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
          /*以下是电子合同独特字段*/
          /*作废重签*/
          old_contract_number: '',
          regenerate: 0,
          /*作废重签*/
          bank: '',
          account_name: '',
          account: '',
          province: "",
          city: "",
          district: "",
          village_name: "",
          room: "",
          hall: "",
          toilet: "",
          area: "",
          use_type: "",
          other_use: "",
          people: "",
          rent_type: "1",
          manage_fee: "",
          manage_share: "",
          water_fee: "30",
          net_fee: "1",
          public_fee: "",
          staff_phone: "",
          pdf_scene: 2,
          emergency_phone: "",
          customer_info: [new HouseOwner()],//房屋所有人HouseOwner类的列表
          other_rule: {},
          cookie: '',
          /*以上是电子合同独特字段*/
        },
        screenshots: {},
        photos: {},
        leaders: {},
        receipts: {},
        property_name: '',              //物业费

        dictValue6: [],                 //房东租客
        value6: [],
        dictValue8: [],                 //支付方式
        value8: [],

        counts: '',

        retry: 0,
      }
    },
    watch: {
      receivedPrice() {
        this.form.money_sum = '';
        this.form.front_money = '';
        this.form.deposit_payed = '';
      },
      cusFrom() {
        if (this.form.is_agency === 0) {
          this.form.agency_name = '';
          this.form.agency_price = '';
          this.form.agency_user_name = '';
          this.form.agency_phone = '';
        }
      },
      is_receipt(val) {
        if (val) {
          Dialog.alert({
            title: this.isReceiptMsg.title,
            message: this.isReceiptMsg.msg,
          }).then(() => {
          });
        }
        if (this.form.is_receipt === 1) {
          this.amountReceipt = 1;
          this.form.receipt = [];
          this.form.receipt[0] = this.receiptDate;
        }
      }
    },
    created() {
    },
    mounted() {
      this.isReceiptMsg = isReceiptMessage;
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
      }
    },
    activated() {
      this.routerIndex('eContract');
      this.ddRent('eContract');
      this.userInfo();
      this.houseInfo();
      let item = sessionStorage.getItem('contract_house_item');
      console.log(item);
      if (sessionStorage.getItem('contract_house_item') === 'noload') {
        sessionStorage.setItem('contract_house_item', null);
        return;
      }
      if (item === null || item === 'null') {
        console.log('读取合同编号');
        Toast.loading({
          mask: true,
          duration:0,
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
        if (item === 'test') return;
        item = JSON.parse(item);
        let house_res = item.house_res;
        let house_res_com = house_res.community;
        this.form.house = {id: '', name: ''};
        this.form.house.id = item.house_id;
        this.form.house.name = item.house_name;
        this.form.province = house_res_com.province.province_name;//省
        this.form.city = house_res_com.city.city_name;//市
        this.form.district = house_res_com.area.area_name;
        this.form.property_address = house_res_com.address;//街道
        this.form.village_name = this.form.house.name;//物业地址
        let house_types = item.house_type.replace("室", "-").replace("厅", "-").replace("卫", "").split("-");
        this.form.room = house_types[0];//室
        this.form.hall = house_types[1];//厅
        this.form.toilet = house_types[2];//卫
        this.form.area = house_res.area;//面积
        /*获取电子合同相关字段*/
      }
    },
    methods: {
      onChangeInfo(item){
        item.fadada_user_id='';
      },
      getTrueNameInfo(item){
        return item.fadada_user_id===''?'':'已认证'
      },
      payWayClick(val) {
        if (val === 1) {
          this.payStatus = !this.payStatus;
          this.priceStatus = false;
        } else {
          this.priceStatus = !this.priceStatus;
          this.payStatus = false;
        }
      },
      /*以下是电子合同新加*/
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
      trueName(item) {
        let json = {content: this.form, type: '2'};
        Toast.loading({
          mask: true,
          duration:0,
          message: '加载中...'
        });
        this.$http.post(this.eurls + 'fdd/contract/stash', json).then(res => {
          if(res.data.code==='40000'){
            contractApi.trueName(item, success => {
              location.href = success
            },error=>{
              Toast(error)
            });
          }else{
            Toast.clear();
            Toast(res.data.msg);
          }
        }).catch(e=>{
          Toast.clear();
        });
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
      getCity(success) {
        this.userInfo();
        this.$http.get(this.urls + 'organization/org/org_to_city/' + this.form.department_id).then(res => {
          //获取合同编号
          contractApi.getNumber(2, res.data.city_id, number => {
            this.setContractNumber(number);
            if (success !== undefined) {
              success();
            }
          }, error => {
            Toast(error)
          });
        });
      },
      getSessionInfo() {
        this.form.old_contract_number = sessionStorage.getItem('contract_number');
        this.form.regenerate = sessionStorage.getItem('contract_type');
        this.setContractNumber(sessionStorage.getItem('contract_number'))
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
      getContractDetail() {
        this.getSessionInfo();
        if (this.form.regenerate === '1') {
          this.form.processable_id = '';
          this.userInfo(true);
          this.$http.get(this.eurls + 'fdd/contract/read/' + this.form.old_contract_number).then((res) => {
            Toast.clear();
            if (res.data.code === '40000') {
              this.isClear = false;
              let draft = res.data.data.param_map;
              this.changeContractDetail(draft);
            } else {
              this.receiptNum();
              this.form.id = '';
            }
          }).catch(e => {
            Toast.clear();
          })
        } else {
          this.getCity();
          //读小飞草稿
          this.$http.get(this.eurls + 'fdd/contract/stash?staff_id=' + this.form.staff_id + '&type=' + 2).then(res => {
            Toast.clear();
            if (res.data.code === '40000') {
              this.changeContractDetail(res.data.data)
            }
          }).catch(e => {
            Toast.clear();
          })
        }
      },
      previewPdf() {
        if (this.form.money_way.length !== 0) {
          let bankInfo = this.form.money_way[0];
          let banks = bankInfo.split(' ');
          this.form.bank = banks[2];
          this.form.account_name = banks[1];
          this.form.account = banks[0];
        }
        Toast.loading({
          mask: true,
          duration:0,
          message: '加载中...'
        });
        this.getCity(resp => {
          this.previewTrue();
        });
      },
      previewTrue() {
        contractApi.createContract(this.$refs.pdf, this.form, success => {

        }, error => {
          Toast(error)
        })
      },
      //添加附属租客信息
      addNewRentPeople() {
        this.form.customer_info.push(new HouseOwner())
      },
      getNameFromList(entitys) {
        let names = [];
        for (let i = 0; i < entitys.length; i++) {
          let entity = entitys[i];
          names.push(entity.name);
        }
        return names;
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
          case this.rentUses://选择租赁用途
            this.rentUseTxt = value;
            this.showOtherUse = index === this.rentUses.length - 1;
            this.form.use_type = this.rentUses[index].id;
            break;
          case this.rentTypes:
            this.showWholeFee = index === this.rentTypes.length - 1;
            this.form.rent_type = this.rentTypes[index].id;
            this.rentTypeTxt = value;
            break;
        }
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
      setContractNumber(number) {
        number = number || '';
        if (number === 'LJZF') {
          number = '';
        }
        if (number === '') {
          return;
        }
        this.form.contract_number = number;
      },
      /*以上是电子合同新加*/
      polishing() {
        let id = JSON.parse(sessionStorage.personal).id;
        this.polishingHint(id);
      },
      userInfo() {
        let per = JSON.parse(sessionStorage.personal);
        this.form.staff_id = per.id;
        this.form.staff_name = per.name;
        this.form.staff_phone = per.phone;
        this.form.department_id = per.department_id;
        this.form.department_name = per.department_name;
        this.form.cookie = per.session_id;
      },
      dicts(success, error) {
        // 收款帐户
        let per = JSON.parse(sessionStorage.personal);
        this.$http.get(this.urls + 'financial/account_alloc/map?org_id=' + per.department_id).then(res => {
          if (res.data.code === '20000') {
            this.value8 = [];
            this.dictValue8 = res.data.data;
            res.data.data.forEach(item => {
              this.value8.push(item.bank_info);
            });
            //房东租客
            this.dictionary(449, 1).then((res) => {
              this.value6 = [];
              this.dictValue6 = res.data;
              for (let i = 0; i < res.data.length; i++) {
                this.value6.push(res.data[i].dictionary_name);
              }
              success();
            }).catch(e => {
              error()
            });
          } else {
            error()
          }
        }).catch(e => {
          error()
        });
        this.receiptNum();
      },
      // 电子收据
      receiptNum() {
        // 收据编号默认城市
        this.form.receipt = [];
        this.$http.get(this.urls + 'setting/others/ip_address').then((res) => {
          if (res.data.code === '1000120') {
            // 收据编号默认日期
            if (res.data.data.py) {
              this.receiptDate = res.data.data.data.py + res.data.data.data.year;
              let receipt = res.data.data.data.py + res.data.data.data.year;
              this.form.receipt.push(receipt);
            } else {
              this.receiptDate = 'NJ' + res.data.data.data.year;
              let receipt = 'NJ' + res.data.data.data.year;
              this.form.receipt.push(receipt);
            }
          }
        });
      },
      searchSelect(val) {
        switch (val) {
          case 1://选择原房屋
            switch (this.form.type) {
              case "5"://调
                this.$router.push({path: '/collectHouse', query: {type: 'report'}});
                break;
              case "0"://未收先租
                this.$router.push({path: '/collectHouse', query: {type: 'is_nrcy'}});
                break;
            }
            break;
          case 2://选择现房屋
            switch (this.form.type) {
              case "1"://新
                this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
                break;
              case "3"://续
                this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
                break;
              case "2"://转
                this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
                break;
              case "5"://调
                this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
                break;
              case "0"://未收先租
                this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
                break;
            }
            break;
          case 3:
            this.$router.push({path: '/organize'});
            break;
          case 4:
            this.$router.push({path: '/depart'});
            break;
        }
      },

      // 截图
      getImgData(val) {
        this.picStatus = val[2];
        if (val[0] === 'screenshot') {
          this.form.screenshot = val[1];
        } else if (val[0] === 'leader') {
          this.form.screenshot_leader = val[1];
        } else if (val[0] === 'receipt') {
          this.form.deposit_photo = val[1];
        } else {
          this.form.photo = val[1];
        }
      },
      fee_status(val) {
        if (!val) {
          this.form.other_fee_name = '';
          this.form.other_fee = '';
        }
      },
      // 显示日期
      timeChoose(val, time, index = '') {
        setTimeout(() => {
          this.timeModule = true;
        }, 200);
        this.formatData.dateVal = time;
        this.formatData.dataKey = val;
        if (val === 'real_pay_at') {
          this.formatData.dateType = 'datetime';
          this.formatData.idx = index;
        } else {
          this.formatData.dateType = 'date';
        }
      },
      // 确定日期
      onConTime(val) {
        switch (val.dataKey) {
          case 'begin_date':
            this.form[val.dataKey] = val.dateVal;
            this.endDate(val.dateVal, this.form.month, this.form.day, 2);
            this.form.period_price_arr[0] = this.form.month;
            this.form.period_pay_arr[0] = this.form.month;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(val.dateVal);
            this.datePrice.push(val.dateVal);
            this.datePay.push(val.dateVal);
            this.countDate(1, this.form.period_price_arr);
            this.countDate(2, this.form.period_pay_arr);
            break;
          case 'real_pay_at':
            this.form[val.dataKey][this.formatData.idx] = val.dateVal;
            break;
          default:
            this.form[val.dataKey] = val.dateVal;
            break;
        }
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeModule = false;
      },
      // select 显示
      selectShow(val, index = '') {
        this.tabs = val;
        this.payIndex = index;
        setTimeout(() => {
          this.selectHide = true;
        }, 200);
        switch (val) {
          case 1:
            this.columns = this.value6;
            break;
          case 2:
            this.columns = this.value8;
            break;
          case 3:
            this.columns = dicts.value9;
            break;
          case 4:
            this.columns = this.cities;
            break;
          case 5:
            this.columns = dicts.value8;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.property_name = value;
            for (let i = 0; i < this.dictValue6.length; i++) {
              if (this.dictValue6[i].dictionary_name === value) {
                this.form.property_payer = this.dictValue6[i].id;
              }
            }
            break;
          case 2:
            this.form.money_way[this.payIndex] = value;
            this.dictValue8.forEach(res => {
              if (res.bank_info === value) {
                this.form.account_id[this.payIndex] = res.id;
              }
            });
            break;
          case 3:
            this.form.pay_way_bet = value;
            break;
          case 4:
            this.form.receipt[this.payIndex].city = value;
            break;
          case 5:
            this.form.is_agency = index;
            this.cusFrom = value;
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
        } else if (val === 2) {
          this.amountPay++;
          this.form.period_pay_arr.push('');
          this.form.pay_way_arr.push('');
        } else if (val === 3) {
          this.amountMoney++;
          this.form.money_sep.push('');
          this.form.money_way.push('');
          this.form.real_pay_at.push('');
          this.form.account_id.push('');
        } else {
          this.amountReceipt++;
          this.form.receipt.push(this.receiptDate);
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
        } else if (val === 2) {
          this.amountPay--;
          this.form.period_pay_arr.splice(index, 1);
          this.form.pay_way_arr.splice(index, 1);
          this.datePay.splice(index, 1);
          this.periodDate(val);
        } else if (val === 3) {
          this.amountMoney--;
          this.form.money_sep.splice(index, 1);
          this.form.money_way.splice(index, 1);
          this.form.real_pay_at.splice(index, 1);
          this.form.account_id.splice(index, 1);
        } else {
          this.amountReceipt--;
          this.form.receipt.splice(index, 1);
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
        this.$http.get(this.urls + 'bulletin/helper/date', {
          params: {
            begin_date: this.form.begin_date,
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
      endDate(time, month, day, val) {
        let params = {};
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
      },

      sendOrSave(val, success) {

        if (this.picStatus === 'err') {
          Toast(this.alertMsg('errPic'));
          return;
        } else if (this.picStatus === 'lose') {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          this.haveInHand = false;
          let receipt = [];
          for (let i = 0; i < this.form.receipt.length; i++) {
            if (this.form.receipt[i] !== this.receiptDate) {
              receipt.push(this.form.receipt[i]);
            }
          }
          this.form[this.receivedPrice] = this.form.money_sum;
          this.amountReceipt = receipt.length === 0 ? 1 : receipt.length;
          this.form.receipt = receipt;
          this.form.draft = val;
          this.form.is_corp = this.corp ? 1 : 0;
          this.form.is_receipt = this.is_receipt ? 1 : 0;
          this.form.is_other_fee = this.other_fee_status ? 1 : 0;
          this.form.day = this.form.day === '' ? '0' : this.form.day;
          for (let key in this.form) {
            if (Array.isArray(this.form[key])) {
              this.form[key] = this.filter_array(this.form[key])
            }
          }
          if (this.form.money_way.length !== 0) {
            let bankInfo = this.form.money_way[0];
            let banks = bankInfo.split(' ');
            this.form.bank = banks[2];
            this.form.account_name = banks[1];
            this.form.account = banks[0];
          }
          this.form.name = this.form.customer_info[0].name;
          this.form.phone = this.form.customer_info[0].phone;
          Toast.loading({
            mask: true,
            duration:0,
            message: '加载中...'
          });
          if (val === 1) {//草稿
            let json = {content: {
                staff_id: this.form.staff_id
              }, type: '2'};
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
        this.$http.post(this.eurls + url, this.form).then((res) => {

          Toast.clear();
          this.haveInHand = true;
          this.retry = 0;
          Toast(res.data.msg);
          if (res.data.code === '40000') {
            Toast.success(res.data.msg);
            this.close_();
            $('.imgItem').remove();
            this.routerDetail(res.data.data.data.id);
          } else if (res.data.code === '40040') {
            if (res.data.data.is_bulletin) {
              this.routerDetail(res.data.data.data.id)
            } else {
              this.$router.go(-1);
            }
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
      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          if (t.type === 'report') {
            this.form.old_house_name = val.house_name;
            this.form.old_corp_name = val.corp_name;
            this.form.contract_id_rent = val.id;
            this.form.house_id_rent = val.house_id;
            this.form.sign_date = val.start_at;
            this.form.name = val.customers;
            this.form.old_front_money = val.front_money;
            this.form.phone = val.cusPhone;

            this.$http.get(this.urls + 'bulletin/helper/contract/' + val.id + '?collect_or_rent=1').then((res) => {
              if (res.data.code === '51110') {
                let pay = res.data.data;
                this.form.old_staff_name = pay.staff ? pay.staff.name : '---';
                this.form.old_pay_way_arr = [];
                this.form.old_price = [];
                for (let i = 0; i < pay.pay_way.length; i++) {
                  this.form.old_pay_way_arr.push(pay.pay_way[i].begin_date + '~' + pay.pay_way[i].end_date + ':' + pay.pay_way[i].pay_way_str);
                }
                for (let i = 0; i < pay.price.length; i++) {
                  this.form.old_price.push(pay.price[i].begin_date + '~' + pay.price[i].end_date + ':' + pay.price[i].price_str);
                }
              }
            })
          } else if (t.type === 'is_nrcy') {
            this.form.oldHouseName = val.house_name;
            this.form.old_corp_name = val.old_corp_name;
            this.form.contract_id_rent = val.id;
            this.form.house_id_rent = val.house_id;

            let rent = val.renters;
            let rentDate = rent.start_at.substring(0, 10);
            this.form.begin_date = rentDate;
            this.first_date = [];
            this.first_date.push(rentDate);
            this.form.sign_date = rent.sign_at.substring(0, 10);
            this.form.period_price_arr = [];
            this.form.price_arr = [];
            for (let i = 0; i < rent.month_price.length; i++) {
              this.amountPrice = i + 1;
              this.form.period_price_arr.push(rent.month_price[i].period);
              this.form.price_arr.push(rent.month_price[i].price);
            }
            this.countDate(1, this.form.period_price_arr);

            this.form.is_agency = rent.is_agency;                       //是否渠道
            this.cusFrom = dicts.value8[rent.is_agency];                //是否渠道
            this.$nextTick(function () {
              this.form.agency_name = rent.agency_info.agency_name;
              this.form.agency_price = rent.agency_info.agency_price;
              this.form.agency_user_name = rent.agency_info.agency_user_name;
              this.form.agency_phone = rent.agency_info.agency_phone;
            });
            this.form.pay_way_bet = rent.pay_way[0].pay_way_bet;
            this.form.period_pay_arr = [];
            this.form.pay_way_arr = [];
            for (let i = 0; i < rent.pay_way.length; i++) {
              this.amountPay = i + 1;
              this.form.period_pay_arr.push(rent.pay_way[i].period);
              this.form.pay_way_arr.push(rent.pay_way[i].pay_way);
            }
            this.countDate(2, this.form.period_pay_arr);

            this.form.property_payer = rent.property_payer;
            for (let j = 0; j < this.dictValue6.length; j++) {
              if (this.dictValue6[j].id === rent.property_payer) {
                this.property_name = this.dictValue6[j].dictionary_name;
              }
            }
            this.form.front_money = rent.front_money;
            this.form.deposit = rent.deposit || 0;
            this.form.deposit_payed = rent.deposit_payed ? rent.deposit_payed : '';
            if (this.form.deposit_payed) {
              this.receivedPrice = 'deposit_payed';
            } else if (this.form.front_money) {
              this.receivedPrice = 'front_money';
            } else {
              this.receivedPrice = 'rent_money';
            }
            this.$nextTick(function () {
              this.form.money_sum = rent.money_sum;
            });
            this.form.memo = rent.memo ? rent.memo : '';
            this.form.money_sep = [];
            this.form.money_way = [];
            for (let i = 0; i < rent.money_table.length; i++) {
              this.amountMoney = i + 1;
              this.form.money_sep.push(rent.money_table[i].money_sep);
              this.form.money_way.push(rent.money_table[i].money_way);
              if (rent.real_pay_at) {
                this.form.real_pay_at.push(rent.money_table[i].real_pay_at);
              } else {
                this.form.real_pay_at.push('');
              }
              for (let j = 0; j < this.dictValue8.length; j++) {
                if (this.dictValue8[j].bank_info === rent.money_table[i].money_way) {
                  this.form.account_id[i] = this.dictValue8[j].id;
                }
              }
            }

            if (rent.is_receipt) {
              this.is_receipt = true;
              this.form.is_receipt = 1;
              if (!this.is_receipt) {
                this.getReceipt(rent);
              }
            } else {
              this.is_receipt = false;
              this.form.is_receipt = 0;
              this.getReceipt(rent);
            }
            this.form.idtype = rent.idtype;
            this.form.idcard = rent.idcard;
            // for (let j = 0; j < this.prove_all.length; j++) {
            //   if (this.prove_all[j].id === rent.idtype) {
            //     this.cardName = this.prove_all[j].dictionary_name;
            //   }
            // }
            this.other_fee_status = rent.is_other_fee === 1 ? true : false;
            this.form.other_fee_name = rent.other_fee_name;
            this.form.other_fee = rent.other_fee;

            this.form.retainage_date = rent.final_payment_at;
            if (rent.customers && rent.customers.length > 0) {
              this.form.name = rent.customers[0].name;
              this.form.phone = rent.customers[0].phone;
            }
            this.form.remark = rent.remark;

            this.form.staff_id = rent.sign_user.id;
            this.form.staff_name = rent.sign_user.name;
            this.form.department_id = rent.sign_org.id;
            this.form.department_name = rent.sign_org.name;
          } else {
            this.form.address = val.house_name;
            this.form.corp_name = val.corp_name;
            this.form.contract_id = val.id;
            this.form.house_id = val.house_id;
          }
        }
        this.userInfo();
      },
      changeContractDetail(draft) {
        this.form.contract_id = draft.contract_id;
        this.form.house_id = draft.house_id;
        this.form.address = draft.address;
        this.form.corp_name = draft.corp_name;
        this.form.month = draft.month;
        this.form.day = draft.day === '0' ? '' : draft.day;
        this.form.contract_number = this.setContractNumber(draft.contract_number);
        this.form.sign_date = draft.sign_date;
        this.form.begin_date = draft.begin_date;
        this.form.end_date = draft.end_date;
        this.first_date = [];
        this.first_date.push(draft.begin_date);
        this.datePrice[0] = draft.begin_date;
        this.datePay[0] = draft.begin_date;
        for (let i = 0; i < draft.price_arr.length; i++) {
          this.amountPrice = i + 1;
          this.form.period_price_arr.push('');
          this.form.price_arr.push('');
        }
        this.form.period_price_arr = draft.period_price_arr;
        this.countDate(1, draft.period_price_arr);
        this.form.price_arr = draft.price_arr;

        this.form.pay_way_bet = draft.pay_way_bet;
        for (let i = 0; i < draft.pay_way_arr.length; i++) {
          this.amountPay = i + 1;
          this.form.period_pay_arr.push('');
          this.form.pay_way_arr.push('');
        }

        this.form.period_pay_arr = draft.period_pay_arr;
        this.countDate(2, draft.period_pay_arr);
        this.form.pay_way_arr = draft.pay_way_arr;

        this.form.deposit = draft.deposit;
        this.form.rent_money = draft.rent_money;
        this.form.front_money = draft.front_money;
        this.form.deposit_payed = draft.deposit_payed ? draft.deposit_payed : '';
        if (this.form.deposit_payed) {
          this.receivedPrice = 'deposit_payed';
        } else if (this.form.front_money) {
          this.receivedPrice = 'front_money';
        } else {
          this.receivedPrice = 'rent_money';
        }
        this.$nextTick(function () {
          this.form.money_sum = draft.money_sum;
        });
        this.form.memo = draft.memo ? draft.memo : '';
        this.form.money_sep = draft.money_sep;
        this.form.money_way = draft.money_way;
        for (let i = 0; i < draft.money_way.length; i++) {
          if (draft.real_pay_at) {
            this.form.real_pay_at[i] = draft.real_pay_at[i];
          } else {
            this.form.real_pay_at.push('');
          }
          this.amountMoney = i + 1;
          for (let j = 0; j < this.dictValue8.length; j++) {
            if (this.dictValue8[j].bank_info === draft.money_way[i]) {
              this.form.account_id[i] = this.dictValue8[j].id;
            }
          }
        }

        this.form.discount = draft.discount;
        this.form.penalty = draft.penalty;
        this.other_fee_status = draft.is_other_fee === 1;
        this.form.other_fee_name = draft.other_fee_name;
        this.form.other_fee = draft.other_fee;

        this.form.is_agency = draft.is_agency;                     //是否渠道
        this.cusFrom = dicts.value8[draft.is_agency];              //是否渠道
        this.form.agency_name = draft.agency_name;
        this.form.agency_price = draft.agency_price;
        this.form.agency_user_name = draft.agency_user_name;
        this.form.agency_phone = draft.agency_phone;

        this.is_corp = draft.is_corp;
        this.corp = draft.is_corp === 1;
        if (draft.is_receipt) {
          this.is_receipt = true;
          this.form.is_receipt = 1;
          if (!this.is_receipt) {
            this.getReceipt(draft);
          }
        } else {
          this.is_receipt = false;
          this.form.is_receipt = 0;
          this.getReceipt(draft);
        }
        this.form.property = draft.property;
        this.form.property_payer = draft.property_payer;
        for (let j = 0; j < this.dictValue6.length; j++) {
          if (this.dictValue6[j].id === draft.property_payer) {
            this.property_name = this.dictValue6[j].dictionary_name;
          }
        }
        this.form.retainage_date = draft.retainage_date;
        this.form.name = draft.name;
        this.form.phone = draft.phone;
        this.form.screenshot = draft.screenshot;
        this.form.photo = draft.photo;
        this.form.screenshot_leader = draft.screenshot_leader;
        this.form.deposit_photo = draft.deposit_photo;
        this.getPic(draft.screenshot, success => {
          this.screenshots = success;
        });
        this.getPic(draft.photo, success => {
          this.photos = success;
        });
        this.getPic(draft.screenshot_leader, success => {
          this.leaders = success;
        });
        this.getPic(draft.deposit_photo, success => {
          this.receipts = success;
        });
        this.form.remark = draft.remark;

        this.form.use_type = draft.use_type;
        this.rentUseTxt = this.getNameForIndex(this.rentUses, draft.use_type);

        this.form.people = draft.people;

        this.form.rent_type = draft.rent_type;
        this.rentTypeTxt = this.getNameForIndex(this.rentTypes, draft.rent_type);

        this.form.emergency_phone = draft.emergency_phone;

        this.form.account_name = draft.account_name;
        this.form.account = draft.account;
        this.form.province = draft.province;
        this.form.city = draft.city;
        this.form.district = draft.district;
        this.form.village_name = draft.village_name;
        this.form.room = draft.room;
        this.form.hall = draft.hall;
        this.form.toilet = draft.toilet;
        this.form.area = draft.area;
        this.form.other_use = draft.other_use;
        this.form.manage_fee = draft.manage_fee;
        this.form.manage_share = draft.manage_share;
        this.form.water_fee = draft.water_fee;
        this.form.public_fee = draft.public_fee;
        this.form.net_fee = draft.net_fee;
        this.form.customer_info = draft.customer_info;
        for (let i = 0; i < this.form.customer_info; i++) {
          contractApi.trueName(this.form.customer_info[i], success => {
          }, error => {
          });
        }
        this.choosedRemarks = this.getListFromList(this.remarks, draft.other_rule);
        this.changeContracts();
      },
      getReceipt(draft) {
        if (typeof draft.receipt !== "string") {
          if (draft.receipt.length !== 0) {
            this.amountReceipt = draft.receipt.length;
            this.form.receipt = [];
            for (let i = 0; i < draft.receipt.length; i++) {
              this.form.receipt.push(draft.receipt[i]);
            }
          } else {
            this.amountReceipt = 1;
            this.form.receipt = [];
            this.form.receipt[0] = this.receiptDate;
          }
        } else {
          this.amountReceipt = 1;
          this.form.receipt = [];
          this.form.receipt[0] = draft.receipt;
        }
      },
      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.userInfo(true);
        $('.imgItem').remove();
        this.picStatus = 'success';
        this.form.processable_id = '';
        this.form.contract_id = '';
        this.form.house_id = '';

        this.form.address = '';
        this.form.corp_name = '';
        this.form.month = '';
        this.form.day = '';
        this.form.discount = 0;
        this.form.sign_date = '';
        this.form.end_date = '';
        this.form.begin_date = '';
        this.datePrice = [];
        this.datePay = [];
        this.amountPrice = 1;
        this.form.period_price_arr = [''];
        this.form.price_arr = [''];

        this.form.pay_way_bet = '';
        this.amountPay = 1;
        this.form.period_pay_arr = [''];
        this.form.pay_way_arr = [''];
        this.receivedPrice = 'front_money';
        this.form.front_money = '';
        this.form.deposit = '';
        this.form.deposit_payed = '';
        this.form.money_sum = '';
        this.form.memo = '';
        this.amountMoney = 1;
        this.form.money_sep = [''];
        this.form.real_pay_at = [''];
        this.form.money_way = [''];
        this.form.account_id = [];
        this.is_corp = 1;
        this.corp = true;
        this.is_agency = '';
        this.cusFrom = '';
        this.form.agency_name = '';
        this.form.agency_price = '';
        this.form.agency_user_name = '';
        this.form.agency_phone = '';

        this.is_receipt = false;
        this.form.is_receipt = 1;
        this.amountReceipt = 1;
        this.form.receipt = [];
        this.form.receipt[0] = this.receiptDate;

        this.form.other_fee_name = '';
        this.form.other_fee = '';
        this.form.is_other_fee = 0;
        this.other_fee_status = false;

        this.form.property_payer = '';
        this.property_name = '';
        this.form.retainage_date = '';
        this.form.name = '';
        this.form.phone = '';
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.leaders = {};
        this.form.deposit_photo = [];
        this.receipts = {};
        this.form.photo = [];
        this.photos = {};
        this.form.remark = '';
        this.form.penalty = '';


        this.form.use_type = '';
        this.rentUseTxt = '';

        this.form.people = '';

        this.form.rent_type = '';
        this.rentTypeTxt = '';

        this.form.emergency_phone = '';

        this.form.account_name = '';
        this.form.account = '';
        this.form.province = '';
        this.form.city = '';
        this.form.district = '';
        this.form.village_name = '';
        this.form.room = '';
        this.form.hall = '';
        this.form.toilet = '';
        this.form.area = '';
        this.form.other_use = '';
        this.form.manage_fee = '';
        this.form.manage_share = '';
        this.form.water_fee = '';
        this.form.public_fee = '';
        this.form.net_fee = '';
        this.form.customer_info = [new HouseOwner()];

        this.choosedRemarks = [];
        this.changeContracts();
      }
    },
  }
</script>

<style lang="scss">
  #rentReport {
    overflow: hidden;

    .rent_types {
      padding-top: 1em;
      border-bottom: .5px solid #f8f8f8;
      align-items: center;
      padding-bottom: 1em;
      display: flex;

      .label {
        min-width: 4.5em;
        margin-left: 1em
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

    .van-radio-group {
      display: flex;
      padding-right: 1em;
      flex-wrap: wrap;
      width: 100%;

      .van-radio {
        margin-left: 1em;
        margin-top: .2em;
        text-align: center;
      }
    }
  }

</style>
