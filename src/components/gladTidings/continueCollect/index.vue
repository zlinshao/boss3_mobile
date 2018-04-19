<template>
  <div id="collectReport">
    <div class="main" id="main">
      <van-cell-group>
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
          v-model="house_type"
          type="text"
          label="户型"
          placeholder="户型已禁用"
          disabled>
        </van-field>
        <div class="first_date">
          <van-field
            style="width: 110px;"
            class="title"
            label="签约时长"
            required>
          </van-field>
          <van-field
            v-model="form.month"
            type="number"
            placeholder="请填写月数">
          </van-field>
          <van-field
            class="twoBorder"
            v-model="form.day"
            type="number"
            placeholder="请填写天数">
          </van-field>
        </div>
        <van-field
          v-model="form.begin_date"
          type="text"
          label="合同开始时间"
          placeholder="请选择合同开始时间"
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
          <span class="cut">-</span>
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
            :disabled="amountPrice === 1 && form.period_price_arr[index] === form.month"
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
        +月单价变化
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
          v-model="form.deposit"
          label="押金"
          type="number"
          placeholder="请填写押金"
          icon="clear"
          @click-icon="form.deposit = ''"
          required>
        </van-field>
        <div class="first_date">
          <van-field
            style="width: 110px;"
            class="title"
            label="保修期"
            required>
          </van-field>
          <van-field
            v-model="form.warranty"
            type="number"
            placeholder="保修期(月)">
          </van-field>
          <van-field
            class="twoBorder"
            v-model="form.warranty_day"
            type="number"
            placeholder="保修期(天)">
          </van-field>
        </div>
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
        <van-field
          v-model="form.penalty"
          label="违约金"
          type="number"
          placeholder="请填写违约金"
          icon="clear"
          @click-icon="form.penalty = ''"
          required>
        </van-field>
        <van-switch-cell v-model="corp" title="是否公司单"/>
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
          @click-icon="form.remark = ''">
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
        haveInHand: true,
        personal: JSON.parse(sessionStorage.personal),
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

        house_type: '',

        corp: true,                    //公司单

        form: {
          id: '',
          type: 2,
          draft: 0,
          contract_id: '',    //合同
          house: {
            id: '',
            name: '',
          },
          month: '',                    //收房月数
          day: '',                      //收房天数
          begin_date: '',               //合同开始日期
          period_price_arr: [''],       //月单价周期
          price_arr: [''],              //月单价

          period_pay_arr: [''],         //付款方式周期
          pay_way_arr: [''],            //付款方式

          warranty: '',                 //保修期(月)
          warranty_day: '',             //保修期(天)
          deposit: '',                  //押金
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
          is_corp: 1,                   //是否公司单  0个人1公司
          contract_number: 'ljsf',          //合同编号
          screenshot_leader: '',        //领导截图 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
        },
        property_name: '',              //物业费付款人
        photos: {},                     //照片
        screenshots: {},                //照片
        staff_name: '',                 //开单人name
        department_name: '',            //部门name

        dictValue4: [],         //付款方式
        value4: [],
        dictValue6: [],         //房东租客
        value6: [],
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.dicts();
      this.userInfo();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      userInfo() {
        this.form.staff_id = this.personal.id;
        this.staff_name = this.personal.name;
        this.form.department_id = this.personal.department_id;
        this.department_name = this.personal.department_name;
      },
      dicts() {
        //付款方式
        this.dictionary(443, 1).then((res) => {
          this.value4 = [];
          this.dictValue4 = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.value4.push(res.data[i].dictionary_name);
          }

          //房东租客
          this.dictionary(449, 1).then((res) => {
            this.value6 = [];
            this.dictValue6 = res.data;
            for (let i = 0; i < res.data.length; i++) {
              this.value6.push(res.data[i].dictionary_name);
            }
            this.manuscript();
          });

        });
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
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
            break;
          case 2:
            this.form.pay_first_date = this.timeValue;
            this.form.period_price_arr[0] = this.form.month;
            this.form.period_pay_arr[0] = this.form.month;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(this.timeValue);
            this.datePrice.push(this.timeValue);
            this.datePay.push(this.timeValue);
            this.countDate(1, this.form.period_price_arr);
            this.countDate(2, this.form.period_pay_arr);
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
            this.columns = this.value4;
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
            for (let i = 0; i < this.dictValue4.length; i++) {
              if (this.dictValue4[i].dictionary_name === value) {
                this.form.pay_way_arr[this.payIndex] = this.dictValue4[i].id;
              }
            }
            break;
          case 6:
            this.property_name = value;
            for (let i = 0; i < this.dictValue6.length; i++) {
              if (this.dictValue6[i].dictionary_name === value) {
                this.form.property_payer = this.dictValue6[i].id;
              }
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
          this.form.period_pay_arr.splice(val, 1);
          this.form.pay_way_arr.splice(index, 1);
          this.payTypeNum.splice(index, 1);
          this.datePay.splice(index, 1);
          this.periodDate(val);
        }
      },
      // 银行卡
      gainBank(val) {
        this.$http.get(this.urls + '').then((res) => {

        })
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

      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.form.is_corp = this.corp ? 1 : 0;
            this.form.day = this.form.day === '' ? '0' : this.form.day;
            this.form.warranty_day = this.form.warranty_day === '' ? '0' : this.form.warranty_day;
            this.$http.post(this.urls + 'bulletin/collect', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50110') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50120') {
                this.form.id = res.data.data.id;
                Toast.success(res.data.msg);
              } else {
                Toast(res.data.msg);
              }
            })
          } else {
            Toast('正在提交...');
          }
        } else {
          Toast('图片上传中...');
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.form.contract_id = val.id;
          this.form.house.id = val.house_id;
          this.form.house.name = val.house_name;
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = JSON.parse(t.staff);
          this.form.staff_id = val.staff_id;
          this.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.department_name = val.depart_name;
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.department_name = val.name;
          this.form.department_id = val.id;
          this.stick();
        }
        if (t.tops === '') {
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
            this.form.day = draft.day === '0' ? '' : draft.day;
            this.form.contract_id = draft.contract_id;
            this.form.house = draft.house;
            this.form.begin_date = draft.begin_date;
            this.form.pay_first_date = draft.pay_first_date;
            this.first_date = [];
            this.first_date.push(draft.pay_first_date);
            this.datePrice[0] = draft.pay_first_date;
            this.datePay[0] = draft.pay_first_date;
            this.form.pay_second_date = draft.pay_second_date;

            this.house_type = data.house_type;

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

            this.is_corp = draft.is_corp;
            this.corp = draft.is_corp === 1 ? true : false;
            this.form.deposit = draft.deposit;
            this.form.warranty = draft.warranty;
            this.form.warranty_day = draft.warranty_day === '0' ? '' : draft.warranty_day;

            this.form.property_payer = draft.property_payer;
            for (let j = 0; j < this.dictValue6.length; j++) {
              if (this.dictValue6[j].id === draft.property_payer) {
                this.property_name = this.dictValue6[j].dictionary_name;
              }
            }

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
        this.userInfo();
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.id = '';
        this.form.contract_id = '';
        this.form.house.id = '';
        this.form.house.name = '';
        this.form.month = '';
        this.form.day = '';
        this.form.begin_date = '';
        this.form.pay_first_date = '';
        this.form.pay_second_date = '';

        this.house_type = '1室1厅1卫';

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

        this.is_corp = 1;
        this.corp = true;
        this.form.deposit = '';
        this.form.warranty = '';
        this.form.warranty_day = '';
        this.form.property_payer = '';
        this.property_name = '';
        this.form.sign_date = '';
        this.form.name = '';
        this.form.phone = '';
        this.form.bank = '';
        this.form.subbranch = '';
        this.form.account_name = '';
        this.form.account = '';
        this.form.relationship = '';
        this.form.penalty = '';
        this.form.contract_number = 'ljsf';

        this.form.photo = [];
        this.photos = {};
        this.form.screenshot_leader = [];
        this.screenshots = {};

        this.form.remark = '';
      }
    },
  }
</script>

<style lang="scss">
  #collectReport {
    overflow: hidden;
  }
</style>
