<template>
  <div id="checkout">

    <div class="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio-group v-model="form.collect_or_rent">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          @click="searchSelect(form.collect_or_rent)"
          readonly
          placeholder="选择房屋地址"
          required>
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
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">房屋照片</div>
        <UpLoad :ID="'photos'" @getImg="headmanAgree" :isClear="isClear" :editImage="photos"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">退租交接单照片</div>
        <UpLoad :ID="'checkouts'" @getImg="headmanAgree" :isClear="isClear" :editImage="checkouts"></UpLoad>

      </div>
      <van-cell-group>
        <van-field
          v-model="form.checkout_date"
          type="text"
          label="开始时间"
          @click="timeChoose()"
          placeholder="获取周期开始日期"
          readonly
          required>
        </van-field>
        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写备注">
        </van-field>
        <van-field
          v-model="staff_name"
          label="开单人"
          type="text"
          placeholder="开单人已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          placeholder="部门已禁用"
          disabled>
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

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
        timeIndex: '',
        timeValue: '',            //日期value

        payWay: '1',                   //付款方式
        price_arr: '1',                //月单价
        payStatus: false,
        priceStatus: false,

        form: {
          id: '',
          draft: 0,
          collect_or_rent: '',
          house_id: '',
          contract_id: '',              //合同id
          photo: [],                    //领导截图 数组
          checkout_photo: [],           //领导截图 数组
          checkout_date: '',            //退租时间
          remark: '',                   //备注
        },
        houseName: '',
        photos: {},
        checkouts: {},
        staff_name: '',                 //开单人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.checkDetail();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      payWayClick(val) {
        if (val === 1) {
          this.payStatus = !this.payStatus;
          this.priceStatus = false;
        } else {
          this.priceStatus = !this.priceStatus;
          this.payStatus = false;
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
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
        } else {
          Toast('请选择收租标记');
        }
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
        this.form.checkout_date = this.timeValue;
        this.onCancel();
      },

      // select关闭
      onCancel() {
        this.timeShow = false;
      },

      // 截图
      headmanAgree(val) {
        this.picStatus = !val[2];
        if (val[0] === 'photos') {
          this.form.photo = val[1];
        } else {
          this.form.checkout_photo = val[1];
        }
      },

      saveCollect(val) {
        this.form.draft = val;
        if (this.picStatus) {
          this.$http.post(this.urls + 'bulletin/checkout', this.form).then((res) => {
            if (res.data.code === '51210') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '51220') {
              this.form.id = res.data.data.id;
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
          this.payWay = val.pay_way;
          this.price_arr = val.month_price;
          this.staff_name = val.staff_name;
          this.department_name = val.department_name;
        }
      },

      checkDetail() {
        this.$http.get(this.urls + 'bulletin/checkout').then((res) => {
          if (res.data.code === '51210') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.houseName = data.address;
            this.form.photo = draft.photo;
            this.photos = data.photo;
            this.form.checkout_photo = draft.checkout_photo;
            this.checkouts = data.checkout_photo;
            this.form.checkout_date = draft.checkout_date;
            this.form.remark = draft.remark;
            this.staff_name = data.staff_name;
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
        this.picStatus = true;
        this.form.house_id = '';
        this.payWay = '';
        this.price_arr = '';
        this.form.id = '';
        this.form.checkout_photo = [];
        this.checkouts = {};
        this.form.photo = [];
        this.photos = {};
        this.form.remark = '';
        this.form.checkout_date = '';
        this.houseName = '';
        this.staff_name = '';
        this.department_name = '';
      },
    },
  }
</script>

<style lang="scss">
  #checkout{
    overflow: hidden;
  }
</style>
