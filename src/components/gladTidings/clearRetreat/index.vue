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

        payWay: '1',                   //付款方式
        price_arr: '1',                //月单价
        payStatus: false,
        priceStatus: false,

        form: {
          address: '',
          id: '',
          type: '0',
          draft: 0,
          contract_id: '',              //合同id
          screenshot_leader: [],        //领导截图 数组
          remark: '',                   //备注
        },
        screenshots: {},
        staff_name: '',                 //开单人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.friedDetail();
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
          this.payWay = val.pay_way;
          this.price_arr = val.month_price;
          this.staff_name = val.staff_name;
          this.department_name = val.department_name;
        }
      },

      friedDetail() {
        this.$http.get(this.urls + 'bulletin/banish').then((res) => {
          if (res.data.code === '50410') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;
            this.form.id = data.id;
            this.form.address = data.address;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.type = draft.type;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots = data.screenshot_leader;
            this.form.remark = draft.remark;
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
        this.payWay = '';
        this.price_arr = '';
        this.form.id = '';
        this.form.type = '0';
        this.form.screenshot_leader = [];
        this.screenshots = {};
        this.form.remark = '';
        this.form.address = '';
        this.staff_name = '';
        this.department_name = '';
      },
    },
  }
</script>

<style lang="scss">
  #clearRetreat {
    overflow: hidden;
  }
</style>
