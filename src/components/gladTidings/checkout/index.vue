<template>
  <div id="checkout">
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio-group :disabled="counts === '2' || counts === '21'" v-model="form.collect_or_rent"
                           @change="rentChange">
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
          @click="selectShow(1)"
          readonly
          placeholder="请选择退房性质"
          required>
        </van-field>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          @click="searchSelect(form.collect_or_rent, 1)"
          readonly
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          class="disabling"
          :class="{'payWay': payStatus && form.payWay.length > 1}"
          @click="payWayClick(1)"
          v-model="form.payWay[0]"
          label="付款方式"
          type="text"
          readonly
          icon="arrow"
          placeholder="付款方式已禁用">
        </van-field>
        <div class="accordion" v-if="payStatus && form.payWay.length > 1">
          <div v-for="(key,index) in form.payWay" v-show="index !== 0">{{key}}</div>
        </div>
        <van-field
          class="disabling"
          :class="{'payWay': priceStatus && form.price_arr.length > 1}"
          v-model="form.price_arr[0]"
          @click="payWayClick(2)"
          label="月单价"
          type="text"
          readonly
          icon="arrow"
          placeholder="月单价已禁用">
        </van-field>
        <div class="accordion" v-if="priceStatus && form.price_arr.length > 1">
          <div v-for="(key,index) in form.price_arr" v-show="index !== 0">{{key}}</div>
        </div>
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
          v-if="form.collect_or_rent === '1'"
          v-model="form.handover_staff.name"
          @click="searchSelect('', 2)"
          label="交接人"
          type="text"
          readonly
          placeholder="请选择交接人"
          required>
        </van-field>
        <van-field
          v-if="form.collect_or_rent === '1'"
          v-model="form.handover_department.name"
          @click="searchSelect('', 3)"
          label="交接部门"
          type="text"
          readonly
          placeholder="请选择部门"
          required>
        </van-field>
        <van-field
          v-if="form.collect_or_rent === '1'"
          v-model="form.number_key"
          label="钥匙数量"
          type="text"
          placeholder="请输入钥匙数量"
          icon="clear"
          @click-icon="form.phone = ''"
          required>
        </van-field>
        <van-field
          v-if="form.collect_or_rent === '1'"
          @click="selectShow(2)"
          v-model="cleanup"
          label="是否需要保洁"
          type="text"
          placeholder="请选择"
          readonly
          required>
        </van-field>
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
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写备注">
        </van-field>
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
        picStatus: 'success',
        selectHide: false,
        columns: [],

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        payStatus: false,
        priceStatus: false,

        check_name: [],
        checkAll: [],

        tabs: '',
        cleanup: '',

        form: {
          address: '',
          id: '',
          processable_id: '',
          draft: 0,
          collect_or_rent: '',
          check_type: {
            id: '',
            name: '',
          },
          payWay: [''],                   //付款方式
          price_arr: [''],                //月单价
          house_id: '',

          handover_staff: {             //交接人
            id: '',
            name: '',
          },
          handover_department: {          //交接部门
            id: '',
            name: '',
          },
          number_key: '',               //钥匙数量
          is_cleanup: '',               //是否需要保洁

          contract_id: '',              //合同id
          photo: [],                    //领导截图 数组
          checkout_photo: [],           //领导截图 数组
          checkout_date: '',            //退租时间
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',                 //开单人name
          department_name: '',            //部门name
        },
        photos: {},
        checkouts: {},
        numbers: '',

        isValue1: true,
        counts: '',

        retry: 0,
      }
    },
    mounted() {
      this.dict();
      this.getNowFormatDate();
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.checkDetail('');
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
        this.checkDetail('');
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
        this.checkDetail(newID);
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      this.houseInfo();
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
      searchSelect(val, num) {
        switch (num) {
          case 1:
            if (val === '0') {
              this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
            } else if (val === '1') {
              this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
            } else {
              Toast('请选择收租标记');
            }
            break;
          case 2:
            this.$router.push({path: '/organize'});
            break;
          case 3:
            this.$router.push({path: '/depart'});
            break;
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
      selectShow(val) {
        this.tabs = val;
        this.selectHide = true;
        if (val === 1) {
          this.columns = this.check_name;
        } else {
          this.columns = ['不需要', '需要'];
        }
      },
      // select选择
      onConfirm(value, index) {
        if (this.tabs === 1) {
          this.form.check_type.name = value;
          for (let i = 0; i < this.checkAll.length; i++) {
            if (this.checkAll[i].dictionary_name === value) {
              this.form.check_type.id = this.checkAll[i].id;
            }
          }
        } else {
          this.cleanup = value;
          this.form.is_cleanup = index;
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
        this.picStatus = val[2];
        if (val[0] === 'photos') {
          this.form.photo = val[1];
        } else {
          this.form.checkout_photo = val[1];
        }
      },
      rentChange(val) {
        if (this.numbers !== val) {
          this.form.address = '';
          this.form.house_id = '';
          this.form.contract_id = '';
          this.form.payWay = [''];
          this.form.price_arr = [''];
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
          this.$http.post(this.urls + 'bulletin/checkout', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '51210' || res.data.code === '51230') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.id);
            } else if (res.data.code === '51220') {
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
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.helperBulletin(val.id);
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = JSON.parse(t.staff);
          this.form.handover_staff.id = val.staff_id;
          this.form.handover_staff.name = val.staff_name;
          this.form.handover_department.id = val.depart_id;
          this.form.handover_department.name = val.depart_name;
          this.isValue1 = val.activeRevise;
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.form.handover_department.id = val.id;
          this.form.handover_department.name = val.name;
          this.isValue1 = val.activeRevise;
        }
      },
      helperBulletin(id) {
        this.$http.get(this.urls + 'bulletin/helper/contract/' + id + '?collect_or_rent=' + this.form.collect_or_rent).then((res) => {
          if (res.data.code === '51110') {
            let pay = res.data.data;
            this.form.payWay = [];
            this.form.price_arr = [];
            for (let i = 0; i < pay.pay_way.length; i++) {
              this.form.payWay.push(pay.pay_way[i].begin_date + '~' + pay.pay_way[i].end_date + ' : ' + pay.pay_way[i].pay_way_str);
            }
            for (let i = 0; i < pay.price.length; i++) {
              this.form.price_arr.push(pay.price[i].begin_date + '~' + pay.price[i].end_date + ' : ' + pay.price[i].price_str);
            }
          }
        })
      },
      checkDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/checkout/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          }
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
            this.helperBulletin(draft.contract_id);
            this.form.check_type = draft.check_type;
            this.form.house_id = draft.house_id;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;
            this.form.address = draft.address;
            this.form.photo = draft.photo;
            this.photos = data.photo;
            this.form.checkout_photo = draft.checkout_photo;
            this.checkouts = data.checkout_photo;
            this.form.checkout_date = draft.checkout_date;
            this.form.payWay = draft.payWay;
            this.form.price_arr = draft.price_arr;

            this.form.handover_staff = draft.handover_staff;
            this.form.handover_department = draft.handover_department;
            this.form.number_key = draft.number_key;
            this.form.is_cleanup = draft.is_cleanup;
            this.cleanup = draft.is_cleanup === 0 ? '不需要' : '需要';

            this.form.remark = draft.remark;
            this.form.staff_name = draft.staff_name;
            this.form.department_name = draft.department_name;
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
        this.form.handover_staff.id = '';
        this.form.handover_staff.name = '';
        this.form.handover_department.id = '';
        this.form.handover_department.name = '';
        this.form.number_key = '';
        this.cleanup = '';
        this.form.is_cleanup = '';
        this.picStatus = 'success';
        this.form.house_id = '';
        this.form.processable_id = '';
        this.form.collect_or_rent = '';
        this.form.check_type.id = '';
        this.form.check_type.name = '';
        this.form.payWay = [''];
        this.form.price_arr = [''];
        this.form.id = '';
        this.form.checkout_photo = [];
        this.checkouts = {};
        this.form.photo = [];
        this.photos = {};
        this.form.remark = '';
        this.form.checkout_date = '';
        this.form.address = '';
        this.form.staff_name = '';
        this.form.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
      },
    }
  }
</script>

<style lang="scss">
  #checkout {
    overflow: hidden;
  }
</style>
