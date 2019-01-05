<template>
  <div id="special">
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div class="titles">收租标记</div>
          <van-radio-group :disabled="counts === '2' || counts === '21'" v-model="form.collect_or_rent"
                           @change="rentChange">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <div class="crop_name noBorder">
          <van-field
            v-model="form.address"
            label="房屋地址"
            type="text"
            @click="searchSelect(form.collect_or_rent)"
            readonly
            placeholder="选择房屋地址"
            required>
          </van-field>
          <div class="titleRed" v-if="form.corp_name">{{form.corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
        <van-field
          v-model="form.content"
          label="报备内容"
          type="textarea"
          placeholder="请填写报备内容"
          required>
        </van-field>
      </van-cell-group>
      <div class="revise" @click="reviseSta">修改合同信息</div>
      <div v-if="reviseStatus">
        <van-cell-group>
          <van-field
            v-model="contract.sign_date"
            label="签约日期"
            readonly
            type="text"
            @click="timeChoose('sign_date', contract.sign_date)"
            placeholder="请选择签约日期日期">
          </van-field>
          <div class="first_date month" v-if="form.collect_or_rent === '0'">
            <div class="titles">签约时长</div>
            <van-field
              v-model="contract.month"
              type="text"
              class="number"
              @keyup="endDate(contract.end_date_vacant, contract.month, contract.day, 2)"
              placeholder="请填写月数">
            </van-field>
            <van-field
              v-model="contract.day"
              type="text"
              class="number"
              @keyup="endDate(contract.end_date_vacant, contract.month, contract.day, 2)"
              placeholder="请填写天数">
            </van-field>
          </div>
          <div class="first_date month" v-if="form.collect_or_rent === '1'">
            <div class="titles">签约时长</div>
            <van-field
              v-model="contract.month"
              type="text"
              class="number"
              @keyup="endDate(contract.begin_date, contract.month, contract.day, 2)"
              placeholder="请填写月数">
            </van-field>
            <van-field
              v-model="contract.day"
              type="text"
              class="number"
              @keyup="endDate(contract.begin_date, contract.month, contract.day, 2)"
              placeholder="请填写天数">
            </van-field>
          </div>
          <div v-if="form.collect_or_rent === '0'" class="titleRed">不包含空置期</div>
          <van-field
            v-if="form.collect_or_rent === '0'"
            v-model="contract.begin_date"
            type="text"
            label="空置期开始"
            placeholder="请选择空置期开始日期"
            readonly
            @click="timeChoose('begin_date', contract.begin_date)">
          </van-field>
          <van-field
            v-if="form.collect_or_rent === '1'"
            v-model="contract.begin_date"
            type="text"
            label="合同开始日期"
            placeholder="请选择合同开始日期"
            readonly
            @click="timeChoose('begin_date', contract.begin_date)"
            required>
          </van-field>
          <van-field
            v-if="form.collect_or_rent === '0'"
            v-model="contract.vacancy"
            label="空置期(天)"
            type="text"
            class="number"
            @keyup="endDate(contract.begin_date, '', contract.vacancy, 1)"
            placeholder="请填写空置期"
            icon="clear"
            @click-icon="contract.vacancy = ''"
            required>
          </van-field>
          <van-field
            v-if="form.collect_or_rent === '0'"
            v-model="contract.end_date_vacant"
            type="text"
            label="空置期结束"
            placeholder="请选择空置期结束日期"
            readonly
            @click="timeChoose('end_date_vacant', contract.end_date_vacant)"
            required>
          </van-field>
          <van-field
            v-if="form.collect_or_rent === '0'"
            v-model="vacancy_way_name"
            @click="selectShow(7,'')"
            label="空置期规则"
            type="text"
            readonly
            placeholder="空置期规则"
            required>
          </van-field>
          <van-field
            v-model="contract.vacancy_other"
            label="空置期规则"
            type="text"
            v-if="vacancy_way_name === '其他'"
            placeholder="空置期规则"
            required>
          </van-field>
          <van-field
            v-model="contract.end_date"
            label="合同结束日期"
            readonly
            type="text"
            @click="timeChoose('end_date', contract.end_date)"
            placeholder="请选择合同结束日期"
            required>
          </van-field>
          <div v-if="form.collect_or_rent === '0'" class="first_date noBorder">
            <div class="titles required">打房租日期</div>
            <van-field
              v-model="contract.pay_first_date"
              readonly
              type="text"
              @click="timeChoose('pay_first_date', contract.pay_first_date)"
              placeholder="第一次打款日期">
            </van-field>
            <span class="cut" style="padding-right: 20px;">-</span>
            <van-field
              v-model="contract.pay_second_date"
              readonly
              type="text"
              @click="timeChoose('pay_second_date', contract.pay_second_date)"
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
              disabled>
            </van-field>
            <van-field
              v-model="contract.period_price_arr[index]"
              type="text"
              class="number"
              label="付款周期"
              :disabled="amountPrice === 1 && contract.period_price_arr[index] === contract.month"
              @keyup="periodDate(1)"
              placeholder="请填写月单价周期">
            </van-field>
            <van-field
              v-model="contract.price_arr[index]"
              type="text"
              class="number"
              label="价格"
              placeholder="请填写金额">
            </van-field>
          </van-cell-group>
        </div>
        <div @click="priceAmount(1)" class="addInput bottom">
          +月单价变化
        </div>
        <van-cell-group v-if="form.collect_or_rent === '1'">
          <van-field
            v-model="contract.pay_way_bet"
            type="text"
            class="number"
            label="押"
            placeholder="请填写付款方式-押"
            @click="selectShow(3)"
            readonly>
          </van-field>
        </van-cell-group>
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
              disabled>
            </van-field>
            <van-field
              v-model="contract.period_pay_arr[index]"
              type="text"
              class="number"
              label="付款周期"
              :disabled="amountPay === 1 && contract.period_pay_arr[index] === contract.month"
              @keyup="periodDate(2)"
              placeholder="请填写付款方式周期">
            </van-field>
            <van-field
              v-if="form.collect_or_rent === '0'"
              @click="selectShow(4, index)"
              v-model="payTypeNum[index]"
              label="付款方式"
              type="text"
              readonly
              placeholder="请选择付款方式">
            </van-field>
            <van-field
              v-if="form.collect_or_rent === '1'"
              v-model="contract.pay_way_arr[index]"
              label="付(月数)"
              type="text"
              class="number"
              placeholder="如:半年付请输入6">
            </van-field>
          </van-cell-group>
        </div>
        <div @click="priceAmount(2)" class="addInput bottom">
          +付款方式变化
        </div>
      </div>
      <div class="aloneModel">
        <div class="title">领导同意截图</div>
        <UpLoad :ID="'tongYi'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots_leader"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>特殊情况截图</div>
        <UpLoad :ID="'jieTu'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="form.staff_name"
          label="开单人"
          type="text"
          placeholder="开单人已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="form.department_name"
          label="部门"
          type="text"
          placeholder="部门已禁用"
          disabled>
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
    <!--日期-->
    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></ChooseTime>

    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import ChooseTime from '../../common/chooseTime.vue'
  import {Toast} from 'vant'

  export default {
    name: "index",
    components: {Toast, UpLoad, ChooseTime},
    data() {
      return {
        haveInHand: true,
        urls: globalConfig.server,
        refundSta: false,
        isClear: false,                 //删除图片
        picStatus: 'success',
        reviseStatus: false,            //修改合同信息
        tabs: '',
        columns: [],                    //select值
        selectHide: false,
        first_date: [],
        timeModule: false,              //日期状态
        formatData: {
          dateVal: '',                  //格式化日期
          dataKey: '',                  //字段区分
          dateType: '',
        },

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payType: [''],                  //付款方式ID
        payTypeNum: [''],               //付款方式
        payIndex: '',                   //付款方式index

        vacancy_way_name: '',           //空置期安置方式
        contract: {},
        revise: {
          id: '',
          sign_date: '',                //签约日期
          vacancy_way: '',              //空置期安置方式
          month: '',                    //收/租 房月数
          day: '',                      //收/租 房天数
          begin_date: '',               //空置期开始日期/合同开始日期
          end_date: '',                 //合同结束日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期
          pay_way_arr: [''],            //付款方式
          period_pay_arr: [''],         //付款方式周期
        },
        form: {
          address: '',
          corp_name: '',
          id: '',
          processable_id: '',
          draft: 0,
          collect_or_rent: '',
          house_id: '',
          contract_id: '',
          content: '',
          screenshot: [],
          screenshot_leader: [],
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        screenshots: {},
        screenshots_leader: {},
        numbers: '',
        counts: '',
        dictValue4: [],                 //付款方式
        value6: [],
        dictValue7: [],                 //安置方式
        value7: [],
        retry: 0,
      }
    },
    created() {
      this.contract = JSON.parse(JSON.stringify(this.revise));
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
      dicts(val) {
        //付款方式
        this.dictionary(443, 1).then((res) => {
          this.value4 = [];
          this.dictValue4 = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.value4.push(res.data[i].dictionary_name);
          }
          // 空置期安置方式
          this.dictionary(437, 1).then((res) => {
            this.value7 = [];
            this.dictValue7 = res.data;
            for (let i = 0; i < res.data.length; i++) {
              this.value7.push(res.data[i].dictionary_name);
            }
            this.specialDetail(val);
          });
        });
      },
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
        } else {
          Toast('请选择收租标记');
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
        this.contract[val.dataKey] = val.dateVal;
        switch (val.dataKey) {
          case 'begin_date':
            this.endDate(val.dateVal, '', this.contract.vacancy, 1);
            if (this.form.collect_or_rent === '1') {
              this.handleDate(val);
            }
            break;
          case 'end_date_vacant':
            this.endDate(val.dateVal, this.contract.month, this.contract.day, 2);
            break;
          case 'pay_first_date':
            this.handleDate(val);
            break;
        }
        this.onCancel();
      },
      handleDate(val) {
        this.contract.pay_first_date = val.dateVal;
        this.contract.period_price_arr[0] = this.contract.month;
        this.contract.period_pay_arr[0] = this.contract.month;
        this.first_date = [];
        this.datePrice = [];
        this.datePay = [];
        this.first_date.push(val.dateVal);
        this.datePrice.push(val.dateVal);
        this.datePay.push(val.dateVal);
        this.countDate(1, this.contract.period_price_arr);
        this.countDate(2, this.contract.period_pay_arr);
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
          case 3:
            this.columns = dicts.value9;
            break;
          case 4:
            this.columns = this.value4;
            break;
          case 7:
            this.columns = this.value7;
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
                this.contract.pay_way_arr[this.payIndex] = this.dictValue4[i].id;
              }
            }
            break;
          case 3:
            this.contract.pay_way_bet = value;
            break;
          case 7:
            this.vacancy_way_name = value;
            for (let i = 0; i < this.dictValue7.length; i++) {
              if (this.dictValue7[i].dictionary_name === value) {
                this.contract.vacancy_way = this.dictValue7[i].id;
              }
            }
            if (value === '其他') {
              this.contract.vacancy_other = '';
            }
            break;
        }
        this.selectHide = false;
      },
      // 月单价增加
      priceAmount(val) {
        if (val === 1) {
          this.amountPrice++;
          this.contract.period_price_arr.push('');
          this.contract.price_arr.push('');
        } else {
          this.amountPay++;
          this.contract.period_pay_arr.push('');
          this.contract.pay_way_arr.push('');
          this.payTypeNum.push('');
        }
      },
      // 删除月单价
      deleteAmount(index, val) {
        if (val === 1) {
          this.amountPrice--;
          this.contract.period_price_arr.splice(index, 1);
          this.contract.price_arr.splice(index, 1);
          this.datePrice.splice(index, 1);
          this.periodDate(val);
        } else {
          this.amountPay--;
          this.contract.period_pay_arr.splice(index, 1);
          this.contract.pay_way_arr.splice(index, 1);
          this.payTypeNum.splice(index, 1);
          this.datePay.splice(index, 1);
          this.periodDate(val);
        }
      },
      // 日期计算
      periodDate(val) {
        let per;
        if (val === 1) {
          per = this.contract.period_price_arr;
        } else {
          per = this.contract.period_pay_arr;
        }
        this.countDate(val, per);
      },

      // 日期计算
      countDate(val, per) {
        let begin = [];
        if (this.form.collect_or_rent === '0') {
          begin = this.contract.pay_first_date;
        } else {
          begin = this.contract.begin_date;
        }
        this.$http.get(this.urls + 'bulletin/helper/date', {
          params: {
            begin_date: begin,
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
        if (val === 1) {
          params.begin_date = time;
          params.vacancy = day;
          params.type = val;
          if (time && day) {
            this.computedDate(params).then((date) => {
              this.contract.end_date_vacant = date;
              this.endDate(date, this.contract.month, this.contract.day, 2);
            })
          } else {
            this.contract.end_date_vacant = '';
            this.endDate('', this.contract.month, this.contract.day, 2);
          }
        } else {
          params.begin_date = time;
          params.month = month;
          params.day = day;
          params.type = val;
          if (time && (month || day)) {
            this.computedDate(params).then((date) => {
              this.contract.end_date = date;
            })
          } else {
            this.contract.end_date = '';
          }
        }
      },

      //照片
      getImgData(val) {
        this.picStatus = val[2];
        if (val[0] === 'tongYi') {
          this.form.screenshot_leader = val[1]
        } else {
          this.form.screenshot = val[1]
        }
      },

      rentChange(val) {
        if (this.numbers !== val) {
          this.resetting();
          this.form.address = '';
          this.form.corp_name = '';
          this.form.house_id = '';
          this.form.contract_id = '';
          this.numbers = val;
        }
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
          for (let key of Object.keys(this.contract)) {
            if (Array.isArray(this.contract[key])) {
              this.contract[key] = this.filter_array(this.contract[key]);
            }
          }
          this.form.contract = this.contract;
          this.$http.post(this.urls + 'bulletin/special', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '51010' || res.data.code === '51030') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              if (res.data.data.id) {
                this.routerDetail(res.data.data.id)
              } else {
                this.routerDetail(res.data.data.data.id)
              }
            } else if (res.data.code === '51020') {
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
      reviseSta() {
        if (this.form.house_id) {
          this.reviseStatus = !this.reviseStatus;
        } else {
          this.prompt('请选择房屋地址!');
        }
      },
      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.form.address = val.house_name;
          this.form.corp_name = val.corp_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;

          let conVal = JSON.parse(sessionStorage.contractVal);
          console.log(conVal);
          this.revise = {
            id: conVal.id,
            sign_date: conVal.sign_at,                       //签约日期
            month: conVal.sign_month,                        //收房月数
            day: conVal.sign_remainder_day,                  //收房天数
            begin_date: conVal.start_at,                     //空置期开始日期
            end_date: conVal.end_at,                         //合同结束日期
            price_arr: [],                                //月单价
            period_price_arr: [],                         //月单价周期
            pay_way_arr: [],                              //付款方式
            period_pay_arr: [],                           //付款方式周期
          };
          this.contract = {};
          if (this.form.collect_or_rent === '0') {
            let arr = {
              end_date_vacant: '',          //空置期结束日期
              vacancy: '',                  //空置期
              vacancy_way: '',              //空置期安排方式
              vacancy_other: '',            //空置期安排方式 随便填
              pay_first_date: '',           //第一次付款时间
              pay_second_date: '',          //第二次付款时间
            };
            this.contract = Object.assign({}, arr, JSON.parse(JSON.stringify(this.revise)));
            this.contractCol(conVal);
          } else {
            let arr = {
              pay_way_bet: '',              //付款方式 押
            };
            this.contract = Object.assign({}, arr, JSON.parse(JSON.stringify(this.revise)));
            this.contractRent(conVal);
          }
        }
      },
      // 租
      contractRent(val) {
        this.contract.pay_way_bet = val.pay_bet; //付款方式 押
        this.first_date = [];
        this.first_date.push(val.start_at);
        this.datePrice[0] = val.start_at;
        this.datePay[0] = val.start_at;
        this.amountPrice = val.month_price.length;
        this.amountPay = val.pay_way.length;
        // 月单价周期
        val.month_price.forEach(arr => {
          this.contract.period_price_arr.push(arr.period);
          this.contract.price_arr.push(arr.price);
        });
        // 付款方式周期
        val.pay_way.forEach((arr, idx) => {
          this.contract.period_pay_arr.push(arr.period);
          this.contract.pay_way_arr.push(arr.pay_way);
          for (let j = 0; j < this.dictValue4.length; j++) {
            if (this.dictValue4[j].id === val.pay_way[idx].pay_way) {
              this.payTypeNum[idx] = this.dictValue4[j].dictionary_name;
            }
          }
        });
        this.countDate(1, this.contract.period_price_arr);
        this.countDate(2, this.contract.period_pay_arr);
      },
      // 收
      contractCol(val) {
        let con = {
          vacancy: val.ready_days,                      //空置期
          end_date_vacant: val.vacancy_end_date,        //空置期结束日期
          pay_first_date: val.first_pay_at,             //第一次付款时间
          pay_second_date: val.second_pay_at,           //第二次付款时间
          vacancy_way: val.vacancy_way,                 //空置期安排方式
          vacancy_other: val.vacancy_other,             //空置期安排方式 随便填
        };
        this.contract = Object.assign({}, this.contract, con);
        this.first_date = [];
        this.first_date.push(val.first_pay_at);
        this.datePrice[0] = val.first_pay_at;
        this.datePay[0] = val.first_pay_at;
        this.amountPrice = val.month_price.length;
        this.amountPay = val.pay_way.length;
        // 月单价周期
        val.month_price.forEach(arr => {
          this.contract.period_price_arr.push(arr.period);
          this.contract.price_arr.push(arr.price);
        });
        // 付款方式周期
        val.pay_way.forEach((arr, idx) => {
          this.contract.period_pay_arr.push(arr.period);
          this.contract.pay_way_arr.push(arr.pay_way);
          for (let j = 0; j < this.dictValue4.length; j++) {
            if (this.dictValue4[j].id === val.pay_way[idx].pay_way) {
              this.payTypeNum[idx] = this.dictValue4[j].dictionary_name;
            }
          }
        });
        this.countDate(1, this.contract.period_price_arr);
        this.countDate(2, this.contract.period_pay_arr);

        this.form.vacancy_way = val.vacancy_way;
        for (let j = 0; j < this.dictValue7.length; j++) {
          if (this.dictValue7[j].id === val.vacancy_way) {
            this.vacancy_way_name = this.dictValue7[j].dictionary_name;
          }
        }
      },
      specialDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/special/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          }
        } else {
          type = 'bulletin/special';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '51020') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.address = draft.address;
            this.form.corp_name = draft.corp_name;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;
            this.form.house_id = draft.house_id;
            this.form.contract_id = draft.contract_id;
            this.form.content = draft.content;
            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot || [];
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots_leader = data.screenshot_leader || [];
            this.form.staff_name = draft.staff_name;
            if (draft.department_name) {
              this.form.department_id = draft.department_id;
              this.form.department_name = draft.department_name;
            } else {
              this.form.department_id = data.department_id;
              this.form.department_name = data.department_name;
            }
            this.form.staff_id = draft.staff_id;

            // 合同
            let con = draft.contract;

            this.contract.sign_date = con.sign_date;
            this.contract.month = con.month;
            this.contract.day = con.day === '0' ? '' : con.day;

            this.contract.begin_date = con.begin_date;
            this.contract.end_date = con.end_date;

            this.amountPrice = con.price_arr.length;
            this.contract.period_price_arr = con.period_price_arr;
            this.contract.price_arr = con.price_arr;
            this.contract.period_pay_arr = con.period_pay_arr;

            if (draft.collect_or_rent === '0') {
              this.contract.vacancy = con.vacancy;
              this.contract.end_date_vacant = con.end_date_vacant;
              this.contract.pay_first_date = con.pay_first_date;
              this.first_date = [];
              this.first_date.push(con.pay_first_date);
              this.datePrice[0] = con.pay_first_date;
              this.datePay[0] = con.pay_first_date;
              this.contract.pay_second_date = con.pay_second_date;
              this.contract.vacancy_way = con.vacancy_way;
              this.form.vacancy_other = con.vacancy_other;
              for (let j = 0; j < this.dictValue7.length; j++) {
                if (this.dictValue7[j].id === con.vacancy_way) {
                  this.vacancy_way_name = this.dictValue7[j].dictionary_name;
                }
              }
              this.contract.pay_way_arr = con.pay_way_arr;
              for (let i = 0; i < con.pay_way_arr.length; i++) {
                this.amountPay = i + 1;
                for (let j = 0; j < this.dictValue4.length; j++) {
                  if (this.dictValue4[j].id == con.pay_way_arr[i]) {
                    this.payTypeNum[i] = this.dictValue4[j].dictionary_name;
                  }
                }
              }
            }
            if (con.collect_or_rent === '1') {
              this.contract.pay_way_bet = con.pay_way_bet;
            }
            this.countDate(1, this.contract.period_price_arr);
            this.countDate(2, this.contract.period_pay_arr);
          } else {
            this.form.id = '';
          }
        })
      },
      resetting() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        $('.imgItem').remove();
        this.reviseStatus = false;
        this.picStatus = 'success';
        this.form.processable_id = '';
        this.form.address = '';
        this.form.corp_name = '';

        this.form.house_id = '';
        this.form.contract_id = '';
        this.form.content = '';
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.screenshots_leader = {};
        this.form.staff_name = '';
        this.form.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';

        this.amountPrice = 1;
        this.datePrice = [];

        this.amountPay = 1;
        this.datePay = [];
        this.payType = [''];                  //付款方式ID
        this.payTypeNum = [''];               //付款方式
        this.payIndex = '';                   //付款方式index

        this.vacancy_way_name = '';           //空置期安置方式

        this.contract = {
          id: '',
          sign_date: '',                //签约日期
          month: '',                    //收房月数
          day: '',                      //收房天数
          begin_date: '',               //空置期开始日期
          end_date: '',                 //合同结束日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期
          pay_way_arr: [''],            //付款方式
          period_pay_arr: [''],         //付款方式周期
          pay_way_bet: '',
          vacancy: '',                  //空置期
          end_date_vacant: '',          //空置期结束日期
          pay_first_date: '',           //第一次付款时间
          pay_second_date: '',          //第二次付款时间
          vacancy_way: '',              //空置期安排方式
          vacancy_other: '',            //空置期安排方式 随便填
        };
      },
      close_() {
        this.form.collect_or_rent = '';
        this.resetting();
      }
    },
  }
</script>

<style lang="scss">
  #special {
    overflow: hidden;
    .revise {
      padding: .3rem;
      color: #409eff;
    }
  }
</style>
