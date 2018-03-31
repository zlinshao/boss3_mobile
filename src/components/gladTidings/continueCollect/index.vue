<template>
  <div id="collectReport">
    <div class="main">
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="house_type"
          type="number"
          label="户型"
          placeholder="户型已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="form.month"
          type="number"
          label="收房月数"
          placeholder="请填写收房月数"
          icon="clear"
          @click-icon="form.month = ''"
          required>
        </van-field>
        <van-field
          v-model="form.begin_date"
          type="text"
          label="开始时间"
          placeholder="请选择合同时间"
          readonly
          @click="timeChoose(1)"
          required>
        </van-field>
        <div class="first_date">
          <van-field
            class="title"
            label="打房租日期"
            required>
          </van-field>
          <van-field
            v-model="form.pay_first_date"
            readonly
            type="text"
            @click="timeChoose(2)"
            placeholder="第一次打款日期">
          </van-field>
          <span class="cut">/</span>
          <van-field
            class="twoBorder"
            v-model="form.pay_second_date"
            readonly
            type="text"
            @click="timeChoose(3)"
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
            placeholder="周期开始日期"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_price_arr[index]"
            type="number"
            label="周期"
            @keyup="periodDate(1)"
            placeholder="请填写月单价周期"
            required>
          </van-field>
          <van-field
            v-model="form.price_arr[index]"
            type="number"
            label="价格"
            placeholder="请填写金额"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(1)" class="addInput">
        +增加月单价
      </div>

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
            placeholder="周期开始日期"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_pay_arr[index]"
            type="number"
            label="周期"
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
        +增加付款方式
      </div>

      <van-cell-group>
        <van-field
          v-model="form.deposit"
          label="押金"
          type="text"
          placeholder="请填写押金"
          icon="clear"
          @click-icon="form.deposit = ''"
          required>
        </van-field>
        <van-field
          v-model="form.vacancy"
          label="空置期"
          type="text"
          placeholder="请填写空置期"
          icon="clear"
          @click-icon="form.vacancy = ''"
          required>
        </van-field>
        <van-field
          v-model="form.warranty"
          label="保修期(月数)"
          type="text"
          placeholder="请填写保修期(月数)"
          required>
        </van-field>
        <van-field
          v-model="form.warranty_day"
          label="保修期(天数)"
          type="text"
          placeholder="请填写保修期(天数)"
          required>
        </van-field>
        <van-field
          v-model="fromName"
          label="来源"
          type="text"
          readonly
          placeholder="请选择客户来源"
          @click="selectShow(5,'')"
          required>
        </van-field>
        <van-field
          v-model="form.property"
          label="物业费"
          type="text"
          placeholder="请填写物业费"
          icon="clear"
          @click-icon="form.property = ''"
          required>
        </van-field>
        <van-field
          v-model="property_name"
          label="物业费付款人"
          type="text"
          placeholder="请选择物业费付款人"
          @click="selectShow(6,'')"
          readonly
          required>
        </van-field>
        <van-field
          v-model="form.sign_date"
          label="签约日期"
          readonly
          type="text"
          @click="timeChoose(4)"
          placeholder="请选择签约日期"
          required>
        </van-field>
        <van-field
          v-model="form.name"
          label="房东姓名"
          type="text"
          placeholder="请填写房东姓名"
          icon="clear"
          @click-icon="form.name = ''"
          required>
        </van-field>
        <van-field
          v-model="form.phone"
          label="客户手机"
          type="number"
          placeholder="请填写客户手机号"
          icon="clear"
          @click-icon="form.phone = ''"
          required>
        </van-field>
        <van-field
          v-model="form.account"
          label="卡号"
          type="number"
          @keyup="subAccount(form.account)"
          placeholder="请填写卡号"
          icon="clear"
          @click-icon="form.account = ''"
          required>
        </van-field>
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
          @click-icon="form.subbranch = ''"
          required>
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
        <van-field
          v-model="form.penalty"
          label="违约金"
          type="text"
          placeholder="请填写违约金"
          icon="clear"
          @click-icon="form.penalty = ''"
          required>
        </van-field>
        <van-field
          v-model="form.contract_number"
          label="合同编号"
          type="text"
          placeholder="请填写收房合同编号"
          icon="clear"
          @click-icon="form.contract_number = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'screenshot'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>合同照片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData" :isClear="isClear" :editImage="photos"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.remark = ''"
          required>
        </van-field>
        <van-field
          v-model="staff_name"
          @click="searchSelect(2)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="leader_name"
          @click="searchSelect(3)"
          readonly
          label="负责人"
          type="text"
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          @click="searchSelect(4)"
          readonly
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>
    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

    <!--select 选择-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

    <!--日期-->
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @change="monthDate"
        @cancel="onCancel"
        @confirm="onDate"/>
    </van-popup>

  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast},
    data() {
      return {
        urls: globalConfig.server,
        isClear: false,           //删除图片
        picStatus: true,

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //房型

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,                //日期状态
        timeIndex: '',
        timeValue: '',                  //日期value

        first_date: [],

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payTypeNum: [''],               //付款方式
        payIndex: '',                   //付款方式index

        house_type: '321321',

        value1: ['月付', '双月付', '季付', '半年付', '年付'],
        value2: ['个人', '中介'],
        value6: ['无', '房东', '租客', '公司'],
        form: {
          id: '',
          type: 2,
          draft: 0,
          contract_id_continued: '',    //合同
          house_id: '',                 //合同
          month: '',                    //收房月数
          begin_date: '',               //合同开始日期
          period_price_arr: [''],       //月单价周期
          price_arr: [''],              //月单价

          period_pay_arr: [''],         //付款方式周期
          pay_way_arr: [''],            //付款方式

          vacancy: '',                  //空置期
          warranty: '',                 //保修期(月)
          warranty_day: '',             //保修期(天)
          from: 1,                      //客户来源 1个人2中介
          deposit: '',                  //押金
          property: '',                 //物业费
          property_payer: '',           //物业费付款人
          pay_first_date: '',           //第一次付款时间
          pay_second_date: '',          //第二次付款时间
          sign_date: '',                //签约日期
          name: '',                     //房东姓名
          phone: '',                    //电话号码
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          relationship: '',             //房东与收款人关系
          penalty: '',                  //违约金
          contract_number: '',          //合同编号
          screenshot_leader: '',        //领导截图 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '92',               //负责人id
          department_id: '',            //部门id
        },
        houseName: '',                //房屋地址name
        fromName: '个人',             //客户来源
        property_name: '',              //物业费付款人
        photos: {},                     //照片
        screenshots: {},                //照片
        staff_name: '',               //开单人name
        leader_name: '湮灭',           //负责人name
        department_name: '',          //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.manuscript();
    },
    activated() {
      this.houseInfo();
    },
    methods: {
      searchSelect(val) {
        switch (val) {
          case 1:
            this.$router.push({path: '/collectHouse', query: {type: 'rent1'}});
            break;
          case 2:
            this.$router.push({path: '/organize'});
            break;
          case 4:
            this.$router.push({path: '/depart'});
            break;
        }
      },

      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
      },
      getImgData(val) {
        this.picStatus = !val[2];
        if (val[0] === 'screenshot') {
          this.form.screenshot_leader = val[1];
        } else {
          this.form.photo = val[1];
        }
      },

      // 获取当前时间
      getNowFormatDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let strDate = date.getDate();
        this.currentDate = new Date(year, month, strDate);
      },
      // 获取银行
      subAccount(val) {
        this.$http.get(this.urls + 'bulletin/helper/bankname?card=' + val).then((res) => {
          if (res.data.code === '51110') {
            this.form.bank = res.data.data;
          } else {
            this.form.bank = '';
          }
        })
      },
      // 日期选择
      timeChoose(val) {
        this.timeShow = true;
        this.timeIndex = val;
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate(val) {
        console.log(val);
        this.timeShow = false;
        switch (this.timeIndex) {
          case 1:
            this.form.begin_date = this.timeValue;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(this.timeValue);
            this.datePrice.push(this.timeValue);
            this.datePay.push(this.timeValue);
            break;
          case 2:
            this.form.pay_first_date = this.timeValue;
            break;
          case 3:
            this.form.pay_second_date = this.timeValue;
            break;
          case 4:
            this.form.sign_date = this.timeValue;
            break;
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        this.selectHide = true;
        switch (val) {
          case 4:
            this.columns = this.value1;
            break;
          case 5:
            this.columns = this.value2;
            break;
          case 6:
            this.columns = this.value6;
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 4:
            this.payTypeNum[this.payIndex] = value;
            this.form.pay_way_arr[this.payIndex] = index + 1;
            break;
          case 5:
            this.fromName = value;
            this.form.from = index + 1;
            break;
          case 6:
            this.form.property_payer = index + 1;
            this.property_name = value;
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
          if (this.amountPrice > 1) {
            this.amountPrice--;
            this.form.period_price_arr.splice(index, 1);
            this.form.price_arr.splice(index, 1);
            this.datePrice.splice(index, 1);
            this.periodDate(val);
          }
        } else {
          this.amountPay--;
          this.form.period_pay_arr.splice(val, 1);
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

      saveCollect(val) {
        this.form.draft = val;
        if (this.picStatus) {
          this.$http.post(this.urls + 'bulletin/collect', this.form).then((res) => {
            if (res.data.code === '50110') {
              Toast.success(res.data.msg);
              this.close_();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '50120') {
              Toast.success(res.data.msg);
            } else {
              Toast(res.data.msg);
            }
          })
        } else {
          Toast('图片上传中...');
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = t.house;
          this.houseName = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = t.staff;
          this.form.staff_id = val.staff_id;
          this.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.department_name = val.depart_name;
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = t.depart;
          this.department_name = val.name;
          this.form.department_id = val.id;
          this.stick();
        }
        if (t.staff === '' || t.depart === '') {
          this.stick();
        }
      },

      manuscript() {
        this.$http.get(this.urls + 'bulletin/collect?type=2').then((res) => {
          if (res.data.code === '50110') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.month = draft.month;
            this.form.contract_id_continued = draft.contract_id_continued;
            this.form.house_id = draft.house_id;
            this.houseName = data.address;
            this.form.begin_date = draft.begin_date;
            this.form.pay_first_date = draft.pay_first_date;
            this.first_date = [];
            this.first_date.push(draft.pay_first_date);
            this.form.pay_second_date = draft.pay_second_date;

            this.house_type = draft.house_type;

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
              this.form.period_pay_arr.push('');
              this.form.pay_way_arr.push('');
              this.payTypeNum[i] = this.value1[draft.pay_way_arr[i] - 1]
            }
            this.form.period_pay_arr = draft.period_pay_arr;
            this.countDate(2, draft.period_pay_arr);
            this.form.pay_way_arr = draft.pay_way_arr;

            this.form.deposit = draft.deposit;
            this.form.vacancy = draft.vacancy;
            this.form.vacancy_way = draft.vacancy_way;
            this.form.vacancy_other = draft.vacancy_other;
            this.form.warranty = draft.warranty;
            this.form.warranty_day = draft.warranty_day;
            this.form.property = draft.property;
            this.form.property_payer = draft.property_payer;
            this.property_name = this.value6[draft.property_payer - 1];
            this.form.from = draft.from;
            this.fromName = draft.from === 1 ? '个人' : '中介';
            this.form.sign_date = draft.sign_date;
            this.form.name = draft.name;
            this.form.phone = draft.phone;
            this.form.bank = draft.bank;
            this.form.subbranch = draft.subbranch;
            this.form.account_name = draft.account_name;
            this.form.account = draft.account;
            this.form.relationship = draft.relationship;
            this.form.penalty = draft.penalty;
            this.form.contract_number = draft.contract_number;

            this.form.photo = draft.photo;
            this.photos = data.photo;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;

            this.form.remark = draft.remark;
            this.form.staff_id = draft.staff_id;
            this.staff_name = data.staff_name;
            this.form.leader_id = draft.leader_id;
            this.leader_name = data.leader_name;
            this.form.department_id = draft.department_id;
            this.department_name = data.department_name;
          } else {
            this.form.id = '';
          }
        })
      },
      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.form.id = '';
        this.form.contract_id_continued = '';
        this.form.house_id = '';
        this.houseName = '';
        this.form.month = '';
        this.form.begin_date = '';
        this.form.pay_first_date = '';
        this.form.pay_second_date = '';

        this.house_type_name = '1室 1厅 1卫';
        this.house_type = [0, 1, 1];

        this.amountPrice = 1;
        this.form.period_price_arr = [''];
        this.form.price_arr = [''];

        this.form.period_price_arr = [''];
        this.form.price_arr = [''];

        this.amountPay = 1;
        this.form.period_pay_arr = [''];
        this.form.pay_way_arr = [''];
        this.payTypeNum = [''];

        this.form.period_pay_arr = [''];
        this.form.pay_way_arr = [''];

        this.form.deposit = '';
        this.form.vacancy = '';
        this.form.vacancy_way = '';
        this.vacancy_way_name = '';
        this.form.vacancy_other = '';
        this.form.warranty = '';
        this.form.warranty_day = '';
        this.form.property = '';
        this.form.property_payer = '';
        this.property_name = '';
        this.form.sign_date = '';
        this.form.name = '';
        this.form.from = 1;
        this.fromName = '';
        this.form.phone = '';
        this.form.bank = '';
        this.form.subbranch = '';
        this.form.account_name = '';
        this.form.account = '';
        this.form.relationship = '';
        this.form.penalty = '';
        this.form.contract_number = '';

        this.form.photo = [];
        this.photos = {};
        this.form.screenshot_leader = [];
        this.screenshots = {};

        this.form.remark = '';

        this.form.staff_id = '';
        this.staff_name = '';
        this.form.leader_id = '92';
        this.leader_name = '';
        this.form.department_id = '';
        this.department_name = '';
      }
    },
  }
</script>

<style lang="scss">
  #collectReport {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    $color: #409EFF;
    .van-switch.van-switch--on {
      background: $color;
    }
    .van-icon.van-icon-checked {
      color: $color;
    }
    .van-cell.van-hairline.van-field {
      .van-cell__title {
        width: 110px;
        span {
          font-size: 16px;
        }
      }
      .van-cell__value {
        padding-left: 110px;
      }
    }
    .first_date {
      @include flex;
      .van-cell.van-hairline.van-field {
        width: 33%;
        .van-cell__value {
          padding-left: 0;
        }
      }
      .title.van-cell.van-hairline.van-field {
        width: 31%;
      }
    }
    .first_date {
      span.cut {
        padding-right: 10px;
        line-height: 39px;
        color: #969696;
        border-bottom: 1px solid #F4F4F4;
      }
      .twoBorder {
        border-bottom: 1px solid #F4F4F4;
        padding-bottom: 9px;
      }
    }
    .aloneModel {
      background: #fff;
      width: 100%;
      margin: .2rem 0;
      padding-bottom: .26rem;
      .title {
        padding: .26rem .3rem 0;
      }
    }

    .aloneModel.required {
      .title {
        padding-left: .2rem;
        span {
          color: #f44;
        }
      }
    }
    .paddingTitle {
      @include flex;
      justify-content: space-between;
      padding: .26rem .3rem;
      color: #aaaaaa;
      .colors {
        color: $color;
      }
    }
    .addInput {
      height: .88rem;
      line-height: .88rem;
      text-align: center;
      color: $color;
      background: #ffffff;
    }
    .addInput.bottom {
      margin-bottom: .2rem;
    }
    .searchClass {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      z-index: 999;
      .searchContent {
        overflow: auto;
        height: 77%;
        .searchList {
          @include flex;
          justify-content: space-between;
          padding: 15px 20px;
          &:hover {
            background: #DDDDDD;
          }
        }
      }
    }
    .top, .footer {
      position: fixed;
      left: 0;
      right: 0;
      height: .9rem;
      z-index: 666;
      background: #ffffff;
    }

    .main {
      margin: .2rem 0 1.2rem;
    }
    .top {
      top: 0;
      box-shadow: 0 3px 10px 0 #dddddd;
      .van-hairline--top-bottom::after {
        border-bottom: 0;
      }
    }
    .footer {
      bottom: 0;
      height: 1rem;
      padding: 10px;
      @include flex;
      align-items: center;
      border-top: 1px solid #ebebeb;
      div + div {
        border-left: 1px solid #ebebeb;
      }
      div {
        height: .6rem;
        line-height: .6rem;
        width: 50%;
        text-align: center;
        color: $color;
      }
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #dddddd;
    }

    input::-moz-placeholder, textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #dddddd;
    }

    input:-moz-placeholder, textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #dddddd;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #dddddd;
    }
  }
</style>
