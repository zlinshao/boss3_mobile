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

    </van-cell-group>


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
    methods:{
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
            // this.form.period_price_arr[0] = this.form.month;
            // this.form.period_pay_arr[0] = this.form.month;
            // this.first_date = [];
            // this.datePrice = [];
            // this.datePay = [];
            // this.first_date.push(val.dateVal);
            // this.datePrice.push(val.dateVal);
            // this.datePay.push(val.dateVal);
            // this.countDate(1, this.form.period_price_arr);
            // this.countDate(2, this.form.period_pay_arr);
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
    },
    data() {
      return {
        selectShow:false,//是否显示选择弹框
        dateShow:false,//是否显示时间弹框
        isShowChooseRemark:false,//是否显示备注弹框
        dateFormData: {
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          dateType: '',
        },
        columns:[],//选择弹框文字数据
        curDatas:[],//选择弹框元数据
        rentUses:[new CommonIdNameEntity('1','自住'),new CommonIdNameEntity('2','办公使用'),new CommonIdNameEntity('3','其他用途')],
        rentUseTxt:'',//租赁用途文字
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
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
