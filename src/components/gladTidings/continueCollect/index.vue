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
          v-model="form.house_type"
          type="text"
          label="户型"
          placeholder="户型已禁用"
          disabled>
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
        <div class="first_date month">
          <div class="titles required">签约时长</div>
          <van-field
            v-model="form.month"
            type="text"
            class="number"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写月数">
          </van-field>
          <van-field
            v-model="form.day"
            type="text"
            class="number"
            @keyup="endDate(form.begin_date, form.month, form.day, 2)"
            placeholder="请填写天数">
          </van-field>
        </div>
        <div class="titleRed">不包含空置期</div>
        <van-field
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
        <div class="first_date">
          <div class="titles required">打房租日期</div>
          <van-field
            v-model="form.pay_first_date"
            readonly
            type="text"
            @click="timeChoose('pay_first_date', form.pay_first_date)"
            placeholder="第一次打款日期">
          </van-field>
          <span class="cut">-</span>
          <van-field
            class="twoBorder"
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
            placeholder="周期开始日期"
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
            type="text"
            class="number"
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
          type="text"
          class="number"
          placeholder="请填写押金"
          icon="clear"
          @click-icon="form.deposit = ''"
          required>
        </van-field>
        <div class="first_date noBorder">
          <div class="titles required">保修期</div>
          <van-field
            v-model="form.warranty"
            type="text"
            class="number"
            placeholder="保修期(月)">
          </van-field>
          <van-field
            class="twoBorder number"
            v-model="form.warranty_day"
            type="text"
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
          type="text"
          class="number"
          placeholder="请填写客户手机号"
          icon="clear"
          @click-icon="form.phone = ''"
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
        <div class="month">
          <van-field
            v-model="form.account"
            label="卡号"
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
          @click="accountBank(form.account)"
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

    <div class="footer" v-if="counts === '1' || counts === '11'">
      <div @click="close_()">重置</div>
      <div @click="saveCollect(1)">草稿</div>
      <div @click="saveCollect(0)">发布</div>
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
    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></ChooseTime>
    <float-btn ref="float"></float-btn>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import ChooseTime from '../../common/chooseTime.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast, ChooseTime},
    data() {
      return {
        haveInHand: true,
        urls: globalConfig.server,
        isClear: false,                 //删除图片
        picStatus: 'success',

        tabs: '',
        columns: [],                    //select值
        selectHide: false,              //房型

        timeModule: false,              //日期状态
        formatData: {
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          dateType: '',
        },
        first_date: [],

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payTypeNum: [''],               //付款方式
        payIndex: '',                   //付款方式index

        corp: true,                     //公司单

        form: {
          id: '',
          processable_id: '',
          type: 2,
          draft: 0,
          contract_id: '',              //合同
          house_type: '',
          house: {
            id: '',
            name: '',
          },
          month: '',                    //收房月数
          day: '',                      //收房天数
          begin_date: '',               //合同开始日期
          end_date: '',                 //合同结束日期
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
          is_agency: 0,
          purchase_way: 509,            //支付方式
          name: '',                     //房东姓名
          phone: '',                    //电话号码
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          relationship: '',             //房东与收款人关系
          penalty: '',                  //违约金
          is_corp: 1,                   //是否公司单  0个人1公司
          contract_number: 'LJSF',      //合同编号
          screenshot_leader: [],        //领导截图 数组
          photo: [],                    //合同照片 数组
          property_photo: [],               //房产证照片
          identity_photo: [],           //证件照片
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
          uniq_code: ''
        },
        property_name: '',              //物业费付款人
        photos: {},                     //照片
        screenshots: {},                //照片
        property_photos: {},                //房产证照片
        identity_photos: {},            //证件照片

        dictValue4: [],         //付款方式
        value4: [],
        dictValue6: [],         //房东租客
        value6: [],

        isValue1: true,
        counts: '',

        retry: 0,
      }
    },
    mounted() {
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.dicts('');
      }
    },
    activated() {
      let count = sessionStorage.count;
      this.counts = count;

      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
      }
      if (count === '1') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.dicts('');
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      if (count === '21') {
        this.isValue1 = false;
        let newID = JSON.parse(sessionStorage.process);
        if (newID.type === 2) {
          this.routerTo('/publishDetail', newID.ids);
        } else {
          this.counts = '1';
          this.routerIndex('');
          this.ddRent('');
        }
      }
      if (count === '2') {
        sessionStorage.setItem('process', JSON.stringify(this.$route.query));
        let newID = JSON.parse(sessionStorage.process);
        if (newID.type === 2) {
          this.close_();
          this.routerTo('/publishDetail', newID.ids);
        } else {
          this.counts = '1';
          this.close_();
          this.routerIndex('');
          this.ddRent('');
        }
        this.close_();
        this.dicts(newID);
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      this.houseInfo();
    },

    methods: {
      userInfo(val1) {
        if (val1) {
          let per = JSON.parse(sessionStorage.personal);
          this.form.staff_id = per.id;
          this.form.staff_name = per.name;
          this.form.department_id = per.department_id;
          this.form.department_name = per.department_name;
        }
      },
      accountBank(val) {
        this.$http.get(this.urls + 'bulletin/helper/get_bank_name?card=' + val + "&owner=" + this.form.account_name).then((res) => {
          if (res.data.code === '51110') {
            this.form.bank = res.data.data;
          } else {
            Toast(res.data.msg)
          }
        })
      },
      dicts(val) {
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
              if (res.data[i].dictionary_name !== '租客承担') {
                this.value6.push(res.data[i].dictionary_name);
              }
            }
            this.manuscript(val);
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
      // 显示日期
      timeChoose(val, time) {
        setTimeout(() => {
          this.timeModule = true;
        }, 200);
        this.formatData.dataKey = val;
        this.formatData.dateVal = time;
        this.formatData.dateType = 'date';
      },
      // 确定日期
      onConTime(val) {
        this.form[val.dataKey] = val.dateVal;
        switch (val.dataKey) {
          case 'begin_date':
            this.endDate(val.dateVal, this.form.month, this.form.day, 2);
            break;
          case 'pay_first_date':
            this.form.pay_first_date = val.dateVal;
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
        }
        this.onCancel();
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
        if (this.picStatus === 'err') {
          Toast(this.alertMsg('errPic'));
          return;
        } else if (this.picStatus === 'lose') {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          this.haveInHand = false;
          this.form.draft = val;
          this.form.is_corp = this.corp ? 1 : 0;
          this.form.day = this.form.day === '' ? '0' : this.form.day;
          this.form.warranty_day = this.form.warranty_day === '' ? '0' : this.form.warranty_day;
          this.form.contract_number = this.form.contract_number === 'LJZF' ? '' : this.form.contract_number;
          this.form.uniq_code = this.$refs.float.getCode();
          this.$http.post(this.urls + 'bulletin/collect', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '50110' || res.data.code === '50130') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              if (res.data.data.id) {
                this.routerDetail(res.data.data.id)
              } else {
                this.routerDetail(res.data.data.data.id)
              }
            } else if (res.data.code === '50120') {
              this.form.day = this.form.day === '0' ? '' : this.form.day;
              this.form.contract_number = this.form.contract_number === '' ? 'LJZF' : this.form.contract_number;
              this.form.id = res.data.data.id;
              Toast.success(res.data.msg);
            } else {
              Toast(res.data.msg);
            }
          }).catch((error) => {
            this.haveInHand = true;
            if (error.response === undefined) {
              this.alertMsg('net');

            } else {
              if (error.response.status === 401) {
                this.personalGet().then((data) => {
                  if (data && this.retry === 0) {
                    this.retry++;

                    this.saveCollect(this.form.draft);
                  }
                });
              }
            }
          })
        } else {
          Toast(this.alertMsg('sub'));
        }
      },

      houseInfo() {
        let detail = this.$store.state.app.searchDetail;
        if (Object.keys(detail).length > 0) {
          let val = detail.house;
          this.form.contract_id = val.id;
          this.form.house.id = val.house_id;
          this.form.house.name = val.house_name;
          this.form.house_type = val.house_type;
          this.$http.get(this.urls + 'bulletin/quality/allow_community?community_id=' + detail.communityId).then(res => {
            if (res.data.code === '51401') {
              Toast(res.data.msg)
            }
          });
        }
        let t = this.$route.query;
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
        if (t.tops === '') {
          this.stick();
        }
        this.userInfo(this.isValue1);
      },

      manuscript(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/collect/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          } else {
            this.userInfo(true);
          }
        } else {
          this.userInfo(true);
          type = 'bulletin/collect?type=2';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50120') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;
            this.form.purchase_way = 509;
            this.form.id = data.id;
            this.form.month = draft.month;
            this.form.day = draft.day === '0' ? '' : draft.day;
            this.form.contract_id = draft.contract_id;
            this.form.house = draft.house;
            this.form.begin_date = draft.begin_date;
            this.form.end_date = draft.end_date;
            this.form.pay_first_date = draft.pay_first_date;
            this.first_date = [];
            this.first_date.push(draft.pay_first_date);
            this.datePrice[0] = draft.pay_first_date;
            this.datePay[0] = draft.pay_first_date;
            this.form.pay_second_date = draft.pay_second_date;

            this.form.house_type = draft.house_type;

            for (let i = 0; i < draft.price_arr.length; i++) {
              this.amountPrice = i + 1;
              this.form.period_price_arr.push('');
              this.form.price_arr.push('');
            }
            this.form.period_price_arr = draft.period_price_arr;
            this.countDate(1, draft.period_price_arr);
            this.form.price_arr = draft.price_arr;
            this.form.is_agency = 0;
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
            this.form.contract_number = draft.contract_number === '' ? 'LJZF' : draft.contract_number;

            this.form.photo = draft.photo;
            this.photos = data.photo;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;

            this.form.property_photo = draft.property_photo;
            this.property_photos = data.property_photo;
            this.form.identity_photo = draft.identity_photo;
            this.identity_photos = data.identity_photo;

            this.form.remark = draft.remark;
            if (val !== '' && val.type === 2) {
              this.form.staff_id = draft.staff_id;
              this.form.staff_name = draft.staff_name;
              this.form.department_id = draft.department_id;
              this.form.department_name = draft.department_name;
            }

          } else {
            this.form.id = '';
          }
        })
      },
      close_() {
        this.form.purchase_way = 509;
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.userInfo(true);
        $('.imgItem').remove();
        this.picStatus = 'success';
        this.form.processable_id = '';
        this.form.contract_id = '';
        this.form.house.id = '';
        this.form.house.name = '';
        this.form.month = '';
        this.form.day = '';
        this.form.begin_date = '';
        this.form.end_date = '';
        this.form.pay_first_date = '';
        this.form.pay_second_date = '';

        this.form.house_type = '';

        this.amountPrice = 1;
        this.form.period_price_arr = [''];
        this.form.price_arr = [''];
        this.amountPay = 1;
        this.form.period_pay_arr = [''];
        this.form.pay_way_arr = [''];
        this.payTypeNum = [''];

        this.form.period_pay_arr = [''];
        this.form.pay_way_arr = [''];
        this.datePrice = [];
        this.datePay = [];

        this.form.is_corp = 1;
        this.corp = true;
        this.form.deposit = '';
        this.form.warranty = '';
        this.form.warranty_day = '';
        this.form.property_payer = '';
        this.property_name = '';
        this.form.sign_date = '';
        this.form.name = '';
        this.form.phone = '';
        this.form.is_agency = 0;
        this.form.bank = '';
        this.form.subbranch = '';
        this.form.account_name = '';
        this.form.account = '';
        this.form.relationship = '';
        this.form.penalty = '';
        this.form.contract_number = 'LJSF';

        this.form.photo = [];
        this.photos = {};
        this.form.screenshot_leader = [];
        this.screenshots = {};

        this.form.property_photo = [];
        this.property_photos = {};
        this.form.identity_photo = [];
        this.identity_photos = {};

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
