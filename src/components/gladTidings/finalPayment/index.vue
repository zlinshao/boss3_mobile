<template>
  <div id="rentReport">
    <div class="main">
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect()"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="month"
          type="text"
          label="租房月数"
          placeholder="租房月数已禁用"
          disabled>
        </van-field>
        <van-field
          :class="{'payWay': payStatus}"
          @click="payWayClick(1)"
          v-model="payWay"
          label="付款方式"
          type="text"
          readonly
          icon="arrow"
          placeholder="付款方式已禁用">
        </van-field>
        <div class="accordion" v-if="payStatus">
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
        </div>
        <van-field
          :class="{'payWay': priceStatus}"
          v-model="price_arr"
          @click="payWayClick(2)"
          label="月单价"
          type="text"
          readonly
          icon="arrow"
          placeholder="月单价已禁用">
        </van-field>
        <div class="accordion" v-if="priceStatus">
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
          <div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>
        </div>
        <van-field
          v-model="periods"
          label="房租期数"
          type="text"
          placeholder="房租期数已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="form.money_sum"
          label="总金额"
          type="text"
          placeholder="请填写总金额"
          required>
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amountMoney">
        <div class="paddingTitle">
          <span>已收金额支付方式<span v-if="amountMoney > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountMoney > 1" @click="deleteAmount(index)">删除</span>
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
            @click="selectShow(index)"
            v-model="moneyNum[index]"
            label="支付方式"
            type="text"
            readonly
            placeholder="请选择支付方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount" class="addInput">
        +增加支付方式
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>截图</div>
        <UpLoad :ID="'screenshot'" @getImg="screenshot" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="form.retainage_date"
          label="尾款补齐日期"
          readonly
          type="text"
          @click="timeChoose(1)"
          placeholder="请选择尾款补齐日期"
          required>
        </van-field>
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
          label="开单人"
          type="text"
          disabled
          placeholder="开单人已禁用">
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          readonly
          placeholder="部门已禁用">>
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
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

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeValue: '',            //日期value

        tabs: '',
        columns: [],              //select值
        selectHide: false,        //select选择


        payWay: '1',                   //付款方式
        price_arr: '1',                //月单价
        payStatus: false,
        priceStatus: false,

        month: '',
        periods: '',

        amountMoney: 1,
        moneyNum: [''],               //分金额 付款方式
        payIndex: '',                 //分金额方式index

        form: {
          id: '',
          draft: 0,
          contract_id: '',            //房屋地址id
          house_id: '',               //房屋地址id

          money_sum: '',                //总金额
          money_sep: [''],              //分金额
          money_way: [''],              //分金额 方式
          retainage_date: '',
          screenshot: [],               //领导截图 数组
          remark: '',                   //备注
        },
        houseName: '',                  //房屋名称
        screenshots: {},                 //房屋名称
        staff_name: '',                  //开单人name
        department_name: '',             //部门name

        dictValue8: [],         //支付方式
        value8: [],
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.dicts();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      dicts() {
        //支付方式
        this.dictionary(508, 1).then((res) => {
          this.value8 = [];
          this.dictValue8 = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.value8.push(res.data[i].dictionary_name);
          }
          this.finalDetail();
        });
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
      // 截图
      screenshot(val) {
        this.picStatus = !val[2];
        this.form.screenshot = val[1];
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
      timeChoose() {
        this.timeShow = true;
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate() {
        this.timeShow = false;
        this.form.retainage_date = this.timeValue;
      },

      // select 显示
      selectShow(index) {
        this.payIndex = index;
        this.selectHide = true;
        this.columns = this.value8;

      },
      // select选择
      onConfirm(value, index) {
        this.moneyNum[this.payIndex] = value;
        for (let i = 0; i < this.dictValue8.length; i++) {
          if (this.dictValue8[i].dictionary_name === value) {
            this.form.money_way[this.payIndex] = this.dictValue8[i].id;
          }
        }
        this.selectHide = false;
      },
      searchSelect() {
        this.$router.push({path: '/collectHouse', query: {type: 'renter', bulletin: 'bulletin_retainage'}});
      },

      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
      },
      // 增加 定金
      priceAmount() {
        this.amountMoney++;
        this.form.money_sep.push('');
        this.form.money_way.push('');
        this.moneyNum.push('');

      },
      // 删除 定金
      deleteAmount(val) {
        this.amountMoney--;
        this.form.money_sep.splice(val, 1);
        this.form.money_way.splice(val, 1);
        this.moneyNum.splice(val, 1);
      },

      saveCollect(val) {
        this.form.draft = val;
        if (this.picStatus) {
          this.$http.post(globalConfig.server + 'bulletin/retainage', this.form).then((res) => {
            if (res.data.code === '50910') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '50920') {
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
          let val = JSON.parse(t.house);
          this.houseName = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.staff_name = val.staff_name;
          this.department_name = val.department_name;
        }
      },

      finalDetail() {
        this.$http.get(globalConfig.server + 'bulletin/retainage').then((res) => {
          if (res.data.code === '50910') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.houseName = data.address;
            this.month = data.month;
            this.price_arr = data.price_arr;
            this.payWay = data.payWay;
            this.periods = data.periods;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.money_sum = draft.money_sum;
            for (let i = 0; i < draft.money_sep.length; i++) {
              this.amountMoney = i + 1;
              this.form.money_way.push('');
              for (let j = 0; j < this.dictValue8.length; j++) {
                if (this.dictValue8[j].id === draft.money_way[i]) {
                  this.moneyNum[i] = this.dictValue8[j].dictionary_name;
                }
              }
            }
            this.form.money_sep = draft.money_sep;
            this.form.money_way = draft.money_way;

            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.remark = draft.remark;
            this.staff_name = data.staff_name;
            this.department_name = data.department_name;
          } else {
            this.form.id = ''
          }
        })
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.form.id = '';
        this.houseName = '';
        this.month = '';
        this.price_arr = '';
        this.payWay = '';
        this.periods = '';
        this.form.contract_id = '';
        this.form.house_id = '';
        this.form.money_sum = '';
        this.amountMoney = 1;
        this.moneyNum = [''];
        this.form.money_sep = [''];
        this.form.money_way = [''];
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.remark = '';
        this.staff_name = '';
        this.department_name = '';
      }
    },
  }
</script>

<style lang="scss">

</style>
