<template>
  <div id="clearRetreat">

    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">报备性质</div>
          <van-radio-group v-model="form.type">
            <van-radio name="0">清退报备</van-radio>
            <van-radio name="1">取消报备</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          @click="searchSelect()"
          readonly
          placeholder="选择房屋地址"
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
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'headman'" @getImg="headmanAgree" :isClear="isClear" :editImage="screenshots"></UpLoad>
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
      <Qiniu></Qiniu>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import Qiniu from '../../common/qiniu.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast,Qiniu},
    data() {
      return {
        haveInHand: true,
        urls: globalConfig.server,
        isClear: false,           //删除图片
        picStatus: true,

        payStatus: false,
        priceStatus: false,

        form: {
          address: '',
          id: '',
          type: '0',
          draft: 0,
          payWay: [''],                   //付款方式
          price_arr: [''],                //月单价
          contract_id: '',              //合同id
          screenshot_leader: [],        //领导截图 数组
          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',                 //开单人name
          department_name: '',            //部门name
        },
        screenshots: {},
      }
    },
    mounted() {
      this.friedDetail('');
    },
    activated() {
      let newID = this.$route.query;
      if (newID.newID !== undefined) {
        this.friedDetail(newID.newID);
      }
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
      searchSelect() {
        this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
      },

      // 截图
      headmanAgree(val) {
        this.picStatus = !val[2];
        this.form.screenshot_leader = val[1];
      },

      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.$http.post(this.urls + 'bulletin/banish', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50410') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50420') {
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
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.$http.get(this.urls + 'bulletin/helper/contract/' + val.id + '?collect_or_rent=1').then((res) => {
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
        }
      },

      friedDetail(val) {
        let type;
        if (val !== '') {
          type = 'bulletin/banish/' + val;
        } else {
          type = 'bulletin/banish';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50420') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;
            this.form.id = data.id;
            this.form.address = draft.address;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.type = draft.type;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;
            this.form.remark = draft.remark;
            this.form.payWay = draft.payWay;
            this.form.price_arr = draft.price_arr;
            this.form.staff_name = draft.staff_name;
            this.form.department_name = draft.depart_name;
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
        this.form.payWay = [''];
        this.form.price_arr = [''];
        this.form.id = '';
        this.form.type = '0';
        this.form.screenshot_leader = [];
        this.screenshots = {};
        this.form.remark = '';
        this.form.address = '';
        this.form.staff_name = '';
        this.form.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
      },
    },
  }
</script>

<style lang="scss">
  #clearRetreat {
    overflow: hidden;
  }
</style>
