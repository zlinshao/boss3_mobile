<template>
  <div id="collectReport">
    <van-cell-group>
      <van-switch-cell v-model="checked" title="是否整租"/>
      <van-switch-cell v-model="checked" title="是否未收先租已知"/>
      <van-field
        v-if="!checked"
        v-model="form.type"
        label="小区"
        type="text"
        placeholder="请填写小区地址"
        required>
      </van-field>
      <van-field
        v-if="checked"
        v-model="form.type"
        label="小区"
        type="text"
        placeholder="请选择小区地址"
        required>
      </van-field>
      <van-field
        v-model="form.building"
        type="text"
        label="栋"
        placeholder="请填写栋"
        required>
      </van-field>
      <van-field
        v-model="form.unit"
        type="text"
        label="单元"
        placeholder="请填写单元"
        required>
      </van-field>
      <van-field
        v-model="form.doorplate"
        type="text"
        label="门牌"
        placeholder="请填写门牌"
        required>
      </van-field>
      <van-field
        @click="selectShow(1,'')"
        v-model="roomName"
        readonly
        type="text"
        label="室"
        placeholder="请选择室"
        required>
      </van-field>
      <van-field
        @click="selectShow(2,'')"
        v-model="hallName"
        readonly
        type="text"
        label="厅"
        placeholder="请选择厅"
        required>
      </van-field>
      <van-field
        @click="selectShow(3,'')"
        v-model="toiletName"
        readonly
        type="text"
        label="卫"
        placeholder="请选择卫"
        required>
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
    </van-cell-group>

    <div class="changes" v-for="(key,index) in amountPrice">
      <div class="paddingTitle">
        <span>月单价<span v-if="amountPrice > 1">({{index + 1}})</span></span>
        <span class="colors" v-if="amountPrice > 1" @click="deleteAmount(index,1)">删除</span>
      </div>
      <van-cell-group>
        <van-field
          v-model="periodPrice[index]"
          type="number"
          label="周期"
          @blur="periodDate(1)"
          placeholder="请填写月单价周期"
          required>
        </van-field>
        <van-field
          v-model="datePrice[index]"
          type="text"
          label="款项开始时间"
          placeholder="款项开始时间"
          disabled
          required>
        </van-field>
        <van-field
          v-model="unitPrice[index]"
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
          v-model="periodPay[index]"
          type="number"
          label="周期"
          @blur="periodDate(2)"
          placeholder="请填写付款方式周期"
          required>
        </van-field>
        <van-field
          v-model="datePay[index]"
          type="text"
          label="款项开始时间"
          placeholder="款项开始时间"
          disabled
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
    <div @click="priceAmount(2)" class="addInput">
      +增加付款方式
    </div>

    <van-cell-group>
      <van-field
        v-model="form.vacancy"
        label="空置期"
        type="text"
        placeholder="请填写空置期"
        required>
      </van-field>
      <van-field
        v-model="form.warranty"
        label="保修期"
        type="text"
        placeholder="请填写保修期"
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
        required>
      </van-field>
      <van-field
        v-model="form.property_payer"
        label="物业费付款人"
        type="text"
        placeholder="请填写物业费付款人"
        required>
      </van-field>
      <van-field
        v-model="form.pay_first_date"
        label="打房租日期"
        type="text"
        @click="timeChoose(2)"
        placeholder="第一次打房租日期"
        required>
      </van-field>
      <van-field
        v-model="form.pay_second_date"
        label="打房租日期"
        type="text"
        @click="timeChoose(3)"
        placeholder="第二次打房租日期"
        required>
      </van-field>
      <van-field
        v-model="form.sign_date"
        label="签约日期"
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
        required>
      </van-field>
      <van-field
        v-model="phoneTypeName"
        label="电话类型"
        type="text"
        readonly
        placeholder="请选择电话类型"
        @click="selectShow(6,'')"
        required>
      </van-field>
      <van-field
        v-model="form.phone"
        label="客户手机"
        type="number"
        placeholder="请填写客户手机号"
        required>
      </van-field>
      <van-field
        v-model="form.bank"
        label="银行"
        type="text"
        placeholder="请填写银行或填写卡号获取"
        required>
      </van-field>
      <van-field
        v-model="form.account"
        label="卡号"
        type="number"
        @keyup="subAccount(form.account)"
        placeholder="请填写卡号"
        required>
      </van-field>
      <van-field
        v-model="form.subbranch"
        label="支行"
        type="text"
        placeholder="请填写支行"
        required>
      </van-field>
      <van-field
        v-model="form.account_name"
        label="开户名"
        type="text"
        placeholder="请填写开户名"
        required>
      </van-field>
      <van-field
        v-model="form.relationship"
        label="关系"
        type="text"
        placeholder="请填写收款人与房东"
        required>
      </van-field>
      <van-field
        v-model="form.penalty"
        label="违约金"
        type="text"
        placeholder="请填写违约金"
        required>
      </van-field>
      <van-field
        v-model="form.type"
        label="匹配租房信息"
        type="text"
        placeholder="请选择租房信息"
        required>
      </van-field>
      <van-field
        v-model="form.contract_id"
        label="合同编号"
        type="text"
        placeholder="请填写收房合同编号"
        required>
      </van-field>
      <van-field
        v-model="form.screenshot_leader"
        label="截图"
        type="text"
        placeholder="请选择银行"
        required>
      </van-field>
      <van-field
        v-model="form.photo"
        label="合同照片"
        type="text"
        placeholder="请选择银行"
        required>
      </van-field>
      <van-field
        v-model="form.remark"
        label="备注"
        type="text"
        placeholder="请选择银行"
        required>
      </van-field>
      <van-field
        v-model="form.staff_id"
        label="开单人"
        type="text"
        placeholder="请选择开单人"
        required>
      </van-field>
      <van-field
        v-model="form.leader_id"
        label="负责人"
        type="text"
        placeholder="请选择负责人"
        required>
      </van-field>
      <van-field
        v-model="form.department_id"
        label="部门"
        type="text"
        placeholder="请选择部门"
        required>
      </van-field>
    </van-cell-group>

    <div class="footer">
      <van-button size="small" type="primary">草稿</van-button>
      <van-button size="small" type="primary" @click="saveCollect">保存</van-button>
    </div>

    <!--户型-->
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
  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        tabs: '',
        columns: [],              //select值
        selectHide: false,        //房型
        checked: false,           //开关
        minDate: new Date(),
        maxDate: new Date(2200, 12, 31),
        currentDate: new Date(2018, 0, 1),
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        address: '',              //地址
        houseType: '',            //户型
        houseTypeNum: '',         //户型ID
        months: '',               //月数

        amountPrice: 1,
        datePrice: [],
        periodPrice: [''],          //周期
        unitPrice: [''],            //月单价

        amountPay: 1,
        datePay: [],
        periodPay: [''],              //周期
        payType: [''],              //付款方式
        payTypeNum: [''],           //付款方式ID
        payIndex: '',               //付款方式index

        form: {
          share: '0',                   //合租整租标记 0整租1合租
          community_id: '',             //小区id
          building: '',                 //栋
          unit: '',                     //单元
          doorplate: '',                //门牌
          room: '',                     //室
          hall: '',                     //厅
          toilet: '',                   //卫
          rooms_sum: '',                //合租时房间数量
          month: '',                    //收房月数
          begin_date: '',               //合同开始日期
          price: [],                    //月单价
          pay_way: [],                  //付款方式
          vacancy: '',                  //空置期
          warranty: '',                 //保修期
          from: '',                     //客户来源 1个人2中介
          property: '',                 //物业费
          property_payer: '',           //物业费付款人
          pay_first_date: '',           //第一次付款时间
          pay_second_date: '',          //第二次付款时间
          sign_date: '',                //签约日期
          name: '',                     //房东姓名
          phone_type: '',               //电话类型 1手机2固话3小灵通
          phone: '',                    //电话号码
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          relationship: '',             //房东与收款人关系
          penalty: '',                  //违约金
          contract_id: '',              //合同id
          screenshot_leader: '',        //领导截图 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '',                //负责人id
          department_id: '',            //部门id
        },
        roomName: '',                 //室
        hallName: '',                 //厅
        toiletName: '',               //卫
        community_name: '',           //小区name
        fromName: '',                 //客户来源
        phoneTypeName: '',            //电话类型
        staff_name: '',               //开单人name
        leader_name: '',              //负责人name
        department_name: '',          //部门name
      }
    },
    mounted() {
    },
    watch: {},
    methods: {
      // 获取银行
      subAccount(val) {
        this.$http.get(this.urls + 'bulletin/helper/bankname?card=' + val).then((res) => {
          if (res.data !== false) {
            this.form.bank = res.data;
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
      onDate() {
        this.timeShow = false;
        switch (this.timeIndex) {
          case 1:
            this.form.begin_date = this.timeValue;
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
          case 1:
            this.columns = ['0室', '1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室'];
            break;
          case 2:
            this.columns = ['1厅', '2厅', '3厅'];
            break;
          case 3:
            this.columns = ['0卫', '1卫', '2卫', '3卫'];
            break;
          case 4:
            this.columns = ['月付', '双月付', '季付', '半年付', '年付'];
            break;
          case 5:
            this.columns = ['个人', '中介'];
            break;
          case 6:
            this.columns = ['手机', '固话', '小灵通'];
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            this.roomName = value;
            this.form.room = index;
            break;
          case 2:
            this.hallName = value;
            this.form.hall = index;
            break;
          case 3:
            this.toiletName = value;
            this.form.toilet = index;
            break;
          case 4:
            this.payTypeNum[this.payIndex] = value;
            this.payType[this.payIndex] = index;
            break;
          case 5:
            this.fromName = value;
            this.form.from = index;
            break;
          case 6:
            this.phoneTypeName = value;
            this.form.phone_type = index;
            break;
        }
        this.selectHide = false;
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
      },
      // 月单价增加
      priceAmount(val) {
        if (val === 1) {
          this.amountPrice++;
          this.periodPrice.push('');
          this.unitPrice.push('');
        } else {
          this.amountPay++;
          this.periodPay.push('');
          this.payType.push('');
          this.payTypeNum.push('');
        }
      },
      // 日期计算
      periodDate(val) {
        if (val === 1) {
          this.$http.get(this.urls + '/bulletin/helper/date', {
            params: {
              begin_date: this.form.begin_date,
              period: this.periodPrice,
            }
          }).then((res) => {
            if (typeof res.data === 'object') {
              this.datePrice = res.data;
            }
          })
        } else {
          this.$http.get(this.urls + '/bulletin/helper/date', {
            params: {
              begin_date: this.form.begin_date,
              period: this.periodPay,
            }
          }).then((res) => {
            if (typeof res.data === 'object') {
              this.datePay = res.data;
            }
          })
        }
      },
      // 删除月单价
      deleteAmount(index, val) {
        if (val === 1) {
          if (this.amountPrice > 1) {
            this.amountPrice--;
            this.periodPrice.splice(val, 1);
            this.unitPrice.splice(val, 1);
          }
        } else {
          this.amountPay--;
          this.periodPay.splice(val, 1);
          this.payType.splice(val, 1);
          this.payTypeNum.splice(val, 1);
        }
      },

      saveCollect() {
        let money = [];
        let pay = [];
        for (let i = 0; i < this.amountPrice; i++) {
          money['period'] = this.periodPrice[i];
          money['price'] = this.unitPrice[i];
          this.form.price.push(money);
        }
        for (let i = 0; i < this.amountPay; i++) {
          pay['period'] = this.periodPay[i];
          pay['pay_way'] = this.payTypeNum[i];
          this.form.pay_way.push(pay);
        }
        this.$http.post(this.urls + 'bulletin/collect', {
          params: this.form,
        }).then((res) => {

        })
      },
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
    .van-cell.van-hairline.van-field.van-cell--required {
      .van-cell__title {
        width: 110px;
      }
      .van-cell__value {
        padding-left: 110px;
      }
    }
    .paddingTitle {
      @include flex;
      justify-content: space-between;
      padding: 10px 15px;
      color: #aaaaaa;
      .colors {
        color: $color;
      }
    }
    .addInput {
      height: 44px;
      line-height: 24px;
      padding: 10px 0;
      text-align: center;
      color: $color;
      background: #ffffff;
      margin-bottom: 15px;
    }
    .footer {
      margin-top: 20px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-around;
      padding: 10px;
      background: #ffffff;
      button {
        background: $color;
        border: 0;
      }
      span {
        color: #FFFFFF;
      }
    }
  }
</style>
