<template>
  <div id="checkout">
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio-group v-model="form.collect_or_rent" @change="rentChange">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.check_type.name"
          label="退房性质"
          type="text"
          @click="selectShow()"
          readonly
          placeholder="请选择退房性质"
          required>
        </van-field>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          @click="searchSelect(form.collect_or_rent)"
          readonly
          placeholder="请选择房屋地址"
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

      <div class="aloneModel required">
        <div class="title"><span>*</span>退租交接单照片</div>
        <UpLoad :ID="'checkouts'" @getImg="headmanAgree" :isClear="isClear" :editImage="checkouts"></UpLoad>

      </div>
      <van-cell-group>
        <van-field
          v-model="form.checkout_date"
          type="text"
          label="退租日期"
          @click="timeChoose()"
          placeholder="请选择退租日期"
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
        urls: globalConfig.server,
        isClear: false,           //删除图片
        picStatus: true,
        selectHide: false,
        columns: [],

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

        check_name: [],
        checkAll: [],

        form: {
          address: '',
          id: '',
          draft: 0,
          collect_or_rent: '',
          check_type: {
            id: '',
            name: '',
          },
          house_id: '',
          contract_id: '',              //合同id
          photo: [],                    //领导截图 数组
          checkout_photo: [],           //领导截图 数组
          checkout_date: '',            //退租时间
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
        },
        photos: {},
        checkouts: {},
        staff_name: '',                 //开单人name
        department_name: '',            //部门name
        numbers: '',
      }
    },
    mounted() {
      this.dict();
      this.getNowFormatDate();
      this.checkDetail('');
    },
    activated() {
      let newID = this.$route.query;
      if (newID.newID !== undefined) {
        this.checkDetail(newID.newID);
      }
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      dict() {
        // 退租性质
        this.dictionary(328, 1).then((res) => {
          this.check_name = [];
          this.checkAll = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.check_name.push(res.data[i].dictionary_name);
          }
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

      // select 显示
      selectShow() {
        this.selectHide = true;
        this.columns = this.check_name;
      },
      // select选择
      onConfirm(value) {
        this.form.check_type.name = value;
        for (let i = 0; i < this.checkAll.length; i++) {
          if (this.checkAll[i].dictionary_name === value) {
            this.form.check_type.id = this.checkAll[i].id;
          }
        }
        this.selectHide = false;
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
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
      rentChange(val) {
        if(this.numbers !== val){
          this.form.address = '';
          this.form.house_id = '';
          this.form.contract_id = '';
          this.numbers = val;
        }
      },
      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.$http.post(this.urls + 'bulletin/checkout', this.form).then((res) => {
              this.haveInHand = true;
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
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.staff_name = val.staff_name;
          this.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
        }
      },

      checkDetail(val) {
        let type;
        if (val !== '') {
          type = 'bulletin/checkout/' + val;
        } else {
          type = 'bulletin/checkout';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '51220') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.contract_id = draft.contract_id;
            this.form.check_type = draft.check_type;
            this.form.house_id = draft.house_id;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;
            this.form.address = data.address;
            this.form.photo = draft.photo;
            this.photos = data.photo;
            this.form.checkout_photo = draft.checkout_photo;
            this.checkouts = data.checkout_photo;
            this.form.checkout_date = draft.checkout_date;
            this.form.remark = draft.remark;
            this.staff_name = data.staff_name;
            this.department_name = data.department_name;
            this.form.staff_id = draft.staff_id;
            this.form.department_id = draft.department_id;
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
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.house_id = '';
        this.form.collect_or_rent = '';
        this.form.check_type.id = '';
        this.form.check_type.name = '';
        this.payWay = '';
        this.price_arr = '';
        this.form.id = '';
        this.form.checkout_photo = [];
        this.checkouts = {};
        this.form.photo = [];
        this.photos = {};
        this.form.remark = '';
        this.form.checkout_date = '';
        this.form.address = '';
        this.staff_name = '';
        this.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
      },
    }
    ,
  }
</script>

<style lang="scss">
  #checkout {
    overflow: hidden;
  }
</style>
