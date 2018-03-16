<template>
  <div id="collectReport">
    <div v-show="!searchShow">
      <van-cell-group>
        <van-field
          v-model="form.house_id"
          label="房屋地址"
          type="text"
          readonly
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
            label="款项开始时间"
            placeholder="款项开始时间"
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
          icon="clear"
          @click-icon="form.pay_way_bet = ''"
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
          v-model="form.sign_date"
          label="签约日期"
          readonly
          type="text"
          @click="timeChoose(4)"
          placeholder="请选择签约日期"
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
          @click="timeChoose(4)"
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
          icon="clear"
          @click-icon="form.phone = ''"
          required>
        </van-field>
        <div class="aloneModel">
          <div class="title">截图</div>
          <UpLoad :ID="'screenshot'" @getImg="screenshot"></UpLoad>
        </div>
        <div class="aloneModel">
          <div class="title">合同照片</div>
          <UpLoad :ID="'photo'" @getImg="contractPhoto"></UpLoad>
        </div>
        <van-field
          v-model="form.remark"
          label="备注"
          type="text"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.remark = ''"
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
        <van-button size="small" type="primary" @click="saveCollect(1)">草稿</van-button>
        <van-button size="small" type="primary" @click="saveCollect(0)">发布</van-button>
      </div>
    </div>


    <div :class="{'searchClass':searchShow}" v-if="searchShow">
      <van-search
        v-model="searchValue"
        show-action
        @search="onSearch">
        <div slot="action" @click="onCancel" style="padding: 0 10px;color: #06bf04;">取消</div>
      </van-search>
      <div class="searchContent">
        <div class="searchList" v-for="key in 30">
          <div>{{key}}</div>
          <div>{{key}}回复</div>
        </div>
      </div>
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
  import UpLoad from '../../common/UPLOAD.vue'

  export default {
    name: "index",
    components: {UpLoad},
    data() {
      return {
        urls: globalConfig.server,
        searchShow: false,        //搜索
        searchValue: '',          //搜索
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
        payType: [''],              //付款方式ID
        payTypeNum: [''],           //付款方式
        payIndex: '',               //付款方式index

        form: {
          type: 1,
          draft: 0,
          contract_id: '',              //房屋地址id
          month: '',                    //租房月数
          begin_date: '',               //合同开始日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期

          pay_way_bet: '',              //付款方式 押

          pay_way_arr: [''],            //付款方式 付
          period_pay_arr: [''],         //付款方式周期
          property: '',                 //物业费
          sign_date: '',                //签约日期
          retainage_date: '',           //尾款补齐时间
          name: '',                     //客户姓名
          phone_type: '1',              //电话类型 1手机2固话3小灵通
          phone: '',                    //电话号码
          screenshot: '',               //领导截图 数组
          photo: '',                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          leader_id: '',                //负责人id
          department_id: '',            //部门id
        },
        phoneTypeName: '手机',           //电话类型
        staff_name: '',                  //开单人name
        leader_name: '',                 //负责人name
        department_name: '',             //部门name
        lists: [],
      }
    },
    mounted() {
      this.getNowFormatDate();
    },
    watch: {},
    methods: {
      // 搜索
      onSearch() {
        this.$http.get(this.urls + 'credit/manage/other?search=' + this.searchValue).then((res) => {
          this.lists = res.data.data;
        })
      },
      // 截图
      screenshot(val) {
        this.form.screenshot_leader = val[1];
        console.log(val);
      },
      // 合同照片
      contractPhoto(val) {
        this.form.photo = val[1];
        console.log(val);
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
            this.columns = ['1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室'];
            break;
          case 2:
            this.columns = ['0厅', '1厅', '2厅', '3厅'];
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
            this.payType[this.payIndex] = index + 1;
            break;
          case 5:
            this.fromName = value;
            this.form.from = index + 1;
            break;
          case 6:
            this.phoneTypeName = value;
            this.form.phone_type = index + 1;
            break;
        }
        this.selectHide = false;
      },
      // select关闭
      onCancel() {
        this.searchShow = false;
        this.selectHide = false;
        this.timeShow = false;
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
              period: this.form.period_price_arr,
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
              period: this.form.period_pay_arr,
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
            this.form.period_price_arr.splice(val, 1);
            this.price_arr.splice(val, 1);
          }
        } else {
          this.amountPay--;
          this.form.period_pay_arr.splice(val, 1);
          this.payType.splice(val, 1);
          this.payTypeNum.splice(val, 1);
        }
      },

      saveCollect(val) {
        let money = [];
        let pay = [];
        this.form.draft = val;
        this.form.pay_way_arr = this.payType;
        this.$http.post(this.urls + 'bulletin/collect', this.form).then((res) => {

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
    .searchClass {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      z-index: 99999;
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
    $color: #409EFF;
    .aloneModel {
      background: #fff;
      width: 100%;
      margin: 5px 0;
      padding-bottom: 10px;
      .title {
        padding: 10px 15px;
      }
    }
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
