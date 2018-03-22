<template>
  <div id="rentReport" v-wechat-title="$route.meta.title">
    <div v-show="!houseShow || !staffModule" class="main">
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
          v-model="form.month"
          type="number"
          label="租房月数"
          placeholder="请填写租房月数"
          icon="clear"
          @click-icon="form.month = ''"
          required>
        </van-field>
        <van-field
          v-model="form.sign_date"
          label="签约日期"
          readonly
          type="text"
          @click="timeChoose(1)"
          placeholder="请选择签约日期"
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
            v-model="form.period_price_arr[index]"
            type="number"
            label="周期"
            @keyup="periodDate(1)"
            placeholder="请填写月单价周期"
            required>
          </van-field>
          <van-field
            v-model="datePrice[index]"
            type="text"
            label="开始时间"
            placeholder="获取周期开始日期"
            disabled
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

      <van-cell-group>
        <van-field
          v-model="form.pay_way_bet"
          type="number"
          label="付款方式-押"
          placeholder="请填写付款方式-押"
          @click="selectShow(3, '')"
          readonly
          required>
        </van-field>
        <van-field
          v-model="form.deposit"
          label="押金"
          type="number"
          placeholder="请填写押金"
          icon="clear"
          @click-icon="form.deposit = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountPay">
        <div class="paddingTitle">
          <span>付款方式-付<span v-if="amountPay > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountPay > 1" @click="deleteAmount(index,2)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.period_pay_arr[index]"
            type="number"
            label="周期"
            @keyup="periodDate(2)"
            placeholder="请填写付款方式周期"
            required>
          </van-field>
          <van-field
            v-model="datePay[index]"
            type="text"
            label="开始时间"
            placeholder="获取周期开始日期"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.pay_way_arr[index]"
            label="付款方式"
            type="number"
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
          v-model="form.money_sum"
          type="number"
          label="已收金额"
          placeholder="请填写已收金额"
          icon="clear"
          @click-icon="form.money_sum = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>已收金额付款方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index,3)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.money_sep[index]"
            type="text"
            label="金额"
            placeholder="请填写金额"
            required>
          </van-field>
          <van-field
            @click="selectShow(2,index)"
            v-model="moneyNum[index]"
            label="付款方式"
            type="text"
            readonly
            placeholder="请选择付款方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(3)" class="addInput">
        +增加付款方式
      </div>
      <van-cell-group>
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
          v-model="fromName"
          label="来源"
          type="text"
          readonly
          placeholder="请选择客户来源"
          @click="selectShow(4,'')"
          required>
        </van-field>
        <van-field
          v-model="form.property_payer"
          label="物业费付款人"
          type="text"
          placeholder="请填写物业费付款人"
          icon="clear"
          @click-icon="form.property_payer = ''"
          required>
        </van-field>
        <van-field
          v-model="form.retainage_date"
          label="尾款补齐日期"
          readonly
          type="text"
          @click="timeChoose(2)"
          placeholder="请选择尾款补齐日期"
          required>
        </van-field>
        <van-field
          v-model="form.name"
          label="客户姓名"
          type="text"
          placeholder="请填写客户姓名"
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
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">截图</div>
        <UpLoad :ID="'screenshot'" @getImg="getImgData"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">合同照片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData"></UpLoad>
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

    <div v-show="!houseShow || !staffModule" class="footer">
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

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

    <CollectHouse :module="houseShow" @close="onCancel" :type="organizeType" @house="house_"></CollectHouse>

    <Organization :type="organizeType" :module="staffModule" @close="onCancel" @organization="staff_"></Organization>

  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import CollectHouse from '../collectHouse.vue'
  import Organization from '../organize.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast, CollectHouse, Organization},
    data() {
      return {
        urls: globalConfig.server,
        houseShow: false,         //搜索
        staffModule: false,       //搜索
        organizeType: '',         //搜索

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        amountPrice: 1,
        datePrice: [],

        amountPay: 1,
        datePay: [],
        payIndex: '',                 //付款方式index

        amountMoney: 1,
        moneyNum: [''],               //分金额 付款方式

        form: {
          type: 0,
          draft: 0,
          contract_id: '',              //合同id
          house_id: '',                 //房屋地址id
          month: '',                    //租房月数
          sign_date: '',                //签约日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式

          deposit: '',                  //押金
          from: '1',                    //客户来源 1个人2中介
          property: '',                 //物业费
          retainage_date: '',           //尾款补齐时间
          name: '',                     //客户姓名
          phone: '',                    //电话号码
          screenshot: [],               //领导截图 数组
          photo: [],                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '',                //负责人id
          department_id: '4',            //部门id
        },
        fromName: '',
        houseName: '',                   //房屋地址name
        staff_name: '',                  //开单人name
        leader_name: '',                 //负责人name
        department_name: '',             //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
    },

    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            this.houseShow = true;
            break;
          case 2:
            this.staffModule = true;
            this.organizeType = 'staff';
            break;
          case 3:
            this.staffModule = true;
            this.organizeType = 'leader';
            break;
        }
      },

      // 房屋地址
      house_(val) {
        this.houseName = val.houseName;
        this.form.contract_id = val.contract_id;
        this.form.house_id = val.house_id;
        this.onCancel();
      },

      // 开单人
      staff_(val, type) {
        if (type === 'staff') {
          this.form.staff_id = val.id;
          this.staff_name = val.name;
        } else {
          this.form.leader_id = val.id;
          this.leader_name = val.name;
        }
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
        this.houseShow = false;
        this.staffModule = false;
      },
      // 截图
      getImgData(val) {
        if (val[0] === 'screenshot') {
          this.form.screenshot = val[1];
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
        this.timeShow = false;
        switch (this.timeIndex) {
          case 1:
            this.form.sign_date = this.timeValue;
            break;
          case 2:
            this.form.retainage_date = this.timeValue;
            break;
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        this.selectHide = true;
        switch (val) {
          case 2:
            this.columns = ['支付宝', '微信', '银行卡', 'pos机', '现金'];
            break;
          case 3:
            this.columns = ['0', '1', '2', '3'];
            break;
          case 4:
            this.columns = ['个人', '中介'];
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 2:
            this.moneyNum[this.payIndex] = value;
            this.form.money_way[this.payIndex] = index + 1;
            break;
          case 3:
            this.form.pay_way_bet = value;
            break;
          case 4:
            this.fromName = value;
            this.form.from = index + 1;
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
        } else {
          this.amountMoney++;
          this.form.money_sep.push('');
          this.form.money_way.push('');
          this.moneyNum.push('');
        }
      },
      // 删除月单价
      deleteAmount(index, val) {
        if (this.amountPrice > 1) {
          if (val === 1) {
            this.amountPrice--;
            this.form.period_price_arr.splice(index, 1);
            this.form.price_arr.splice(index, 1);
          } else if (val === 2) {
            this.amountPay--;
            this.form.period_pay_arr.splice(index, 1);
            this.form.pay_way_arr.splice(index, 1);
          } else {
            this.amountMoney--;
            this.form.money_sep.splice(index, 1);
            this.form.money_way.splice(index, 1);
            this.moneyNum.splice(index, 1);
          }
        }
      },
      // 日期计算
      periodDate(val) {
        let period;
        if (val === 1) {
          period = this.form.period_price_arr;
        } else {
          period = this.form.period_pay_arr;
        }
        this.$http.get(this.urls + '/bulletin/helper/date', {
          params: {
            begin_date: this.form.sign_date,
            period: period
          }
        }).then((res) => {
          if (res.data.code === '51110') {
            if (val === 1) {
              this.datePrice = res.data.data;
            } else {
              this.datePay = res.data.data;
            }
          } else {
            Toast(res.data.msg);
          }
        })
      },

      saveCollect(val) {
        this.form.draft = val;
        this.$http.post(this.urls + 'bulletin/rent', this.form).then((res) => {
          if (res.data.code === '50210') {
            Toast.success(res.data.msg);
            this.$router.push({path: '/publishDetail', query: {ids: res.data.data.data.id}});
          } else {
            Toast(res.data.msg);
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  #rentReport {
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
    .aloneModel {
      background: #fff;
      width: 100%;
      margin: .2rem 0;
      padding-bottom: .26rem;
      .title {
        padding: .26rem .3rem 0;
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
      height: .9rem;
      line-height: .9rem;
      text-align: center;
      color: $color;
      background: #ffffff;
      margin-bottom: .2rem;
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
