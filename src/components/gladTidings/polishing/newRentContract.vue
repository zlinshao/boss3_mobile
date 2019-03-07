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
        required>
      </van-field>
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
          @click-icon="form.water_fee = ''"
        >
        </van-field>
        <van-field
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
      <!--下面时付款方式-->
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


      <!--上面时付款方式-->

      <van-field
        v-model="form.deposit"
        label="押金"
        type="number"
        placeholder="请输入押金"
        required>
      </van-field>

      <van-field
        @click="showSelect(payAccountList)"
        v-model="form.money_way[index]"
        label="汇款帐户"
        type="text"
        readonly
        placeholder="请选择汇款帐户"
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
    </van-cell-group>


    <!--select 选择-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectShow" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onSelectCancel"
        @confirm="onSelectConfirm"></van-picker>
    </van-popup>

    <pdf-dialog  style="width: 100%;height: 100%;position: fixed;top:0;z-index: 1000"
                 ref="pdf"></pdf-dialog>
    <!--选择时间-->
    <ChooseTime :module="dateShow" :formatData="dateFormData" @close="onDateCancel" @onDate="onDateChoose"></ChooseTime>
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
  import {CommonIdNameEntity} from  './newCollectContract'
  import ChooseTime from '../../common/chooseTime.vue'
  import PdfDialog from '@/components/common/pdf/PdfDialog'
  import * as contractApi from './contractCreater'
  import {Toast} from 'vant';
  export default {
    name: "newRentContract",
    components: {ChooseTime, PdfDialog},
    activated(){
      this.getPayAccount();
    },
    methods:{
      getPayAccount(){
        let per = JSON.parse(sessionStorage.personal);
        this.$http.get(this.urls + 'financial/account_alloc/map?org_id=' + per.department_id).then(res => {
          if (res.data.code === '20000') {
            this.payAccountList = [];
            res.data.data.forEach(item => {
              this.payAccountList.push(new CommonIdNameEntity('',item.bank_info));
            });
          }
        });
      },
      //选择房屋
      chooseHouse() {
        this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
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
      //取消时间
      onDateCancel() {
        this.dateShow = false;
      },
      //选定时间
      onDateChoose(val) {
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
        this.onDateCancel();
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
        this.selectShow = true;//显示弹框
      },
      onSelectCancel() {
        this.selectShow = false;//关闭弹框
      },
      onSelectConfirm(value, index) {
        this.selectShow = false;//关闭弹框
        switch (this.curDatas) {
          case this.rentUses://选择租赁用途
            this.rentUseTxt=value;
            this.showOtherUse=index===this.rentUses.length-1;
            this.form.use_type=this.rentUses[index].id;
            break;
          case this.rentTypes:
            this.showWholeFee=index===this.rentTypes.length-1;
            this.form.rent_type=this.rentTypes[index].id;
            this.rentTypeTxt=value;
            break;
          case this.payAccountList:
            this
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
      // 日期计算
      countDate(val, per) {
        this.$http.get(this.urls + '/bulletin/helper/date', {
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
    },
    data() {
      return {
        selectShow:false,//是否显示选择弹框
        dateShow:false,//是否显示时间弹框
        isShowChooseRemark:false,//是否显示备注弹框
        urls: globalConfig.server,
        dateFormData: {
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          dateType: '',
        },
        columns:[],//选择弹框文字数据
        curDatas:[],//选择弹框元数据
        rentUses:[new CommonIdNameEntity('1','自住'),new CommonIdNameEntity('2','办公使用'),new CommonIdNameEntity('3','其他用途')],
        rentUseTxt:'',//租赁用途文字
        //合同备注条款数据
        remarks: [new CommonIdNameEntity('1', '需经过乙方同意后，上门查房，不能打扰租客生活'), new CommonIdNameEntity('2', '房屋内家具家电自然老化，由甲方负责更换，人为损坏乙方负责'), new CommonIdNameEntity('3', '甲方需配合乙方办理居住证等相关证件'), new CommonIdNameEntity('4', '乙方将能够通过合法途径获取的租客信息告知甲方'), new CommonIdNameEntity('5', '非甲方及房屋原因导致的安全责任事故与甲方无关'), new CommonIdNameEntity('6', '同等条件下，房东享有签约权(从乙方处承租）')],
        choosedRemarks: [],//已选择的备注条款
        remarksTxt: '',//备注条款展示文字
        showOtherUse:false,//显示其他用途输入框
        showWholeFee:false,//整租时，显示水费等费用
        rentTypes:[new CommonIdNameEntity('1','整租'),new CommonIdNameEntity('2','合租')],
        rentTypeTxt:'',//租赁用途文字
        payAccountList:[],//收款账户列表元数据
        /*下面是付款方式*/
        amountPrice: 1,
        amountPay: 1,
        datePrice :[],
         datePay: [],
        /*上面是付款方式*/

        form: {
          house:{
            id:'',
            name:''
          },
          "contract_number": "LJZFE020000002",
          "province": "江苏",
          "city": "南京",
          "district": "建邺",
          "village_name": "艺树家工厂",
          "room": "3",
          "hall": "2",
          "toilet": "1",
          "area": "120",
          "begin_date": "2019-02-12",
          "end_date": "2020-02-22",
          "month": "12",
          "use_type": "3",
          "other_use": "烧鸡",
          "people": "2",
          "rent_money": "2100",
          "payway": "5",
          "payway_other_text": "4月付",
          "bank": "中国建设银行",
          "deposit": "2300",
          "account_name": "马国民",
          "account": "6228481220151014613",
          "rent_type": "1",
          "peak": "2000",
          "vallery": "2100",
          "gas": "310",
          "manage_fee": "3500",
          "manage_share": "2500",
          "water_fee": "1500",
          "water_meter": "1500",
          "net_fee": "1",
          "public_fee": "1200",
          "staff_name": "王晨",
          "staff_phone": "18796005530",
          "sign_date": "2019-03-05",
          "staff_id": "2234",
          "pdf_scene": 2,
          "emergency_phone": "18796005530",
          "customerIds": {
            "0": "AD4D9D5FFA9C4B0500DE29F99DE1CF5D",
            "1": "B8EBB9DA925BA67D9860FC575697ADDA",
            "2": "EC983C8F76C7F49A1A3B0D8593162E5C"
          },
          "other_rule": {
            "0": 1,
            "1": 2,
            "2": 3,
            "3": 4,
            "4": 5,
            "5": 6,
            "6": 7,
            "7": 8,
            "8": 9,
            "9": 10
          },
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          period_pay_arr: [''],         //付款方式周期
          pay_way_arr: [''],            //付款方式 付
          real_pay_at: [''],            //实际收款时间
          money_way: [''],              //汇款帐户
          account_id: [],               //汇款帐户ID
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
