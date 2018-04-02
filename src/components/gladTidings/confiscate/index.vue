<template>
  <div id="confiscate">

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
          readonly
          @click="searchSelect(form.collect_or_rent)"
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
          v-model="leader_name"
          label="负责人"
          type="text"
          placeholder="负责人已禁用"
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
  import CollectHouse from '../collectHouse.vue'
  import {Toast} from 'vant';
  import SelectDepart from '../../common/selectDepartment.vue'

  export default {
    name: "index",
    components: {UpLoad, Toast, SelectDepart, CollectHouse},
    data() {
      return {
        urls: globalConfig.server,
        refundSta: false,

        payWay: '1',                   //付款方式
        price_arr: '1',                //月单价
        payStatus: false,
        priceStatus: false,

        form: {
          id: '',
          type: 0,
          draft: 0,
          collect_or_rent: '',
          contract_id: '',            //合同id
          house_id: '',
          remark: '',                   //备注
        },
        houseName: '',
        staff_name: '',                 //开单人name
        leader_name: '',                //负责人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.confiscate();
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
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord1'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'rent1'}});
        } else {
          Toast('请选择收租标记');
        }
      },

      saveCollect(val) {
        this.form.draft = val;
        this.$http.post(this.urls + 'bulletin/confiscate', this.form).then((res) => {
          if (res.data.code === '50610') {
            Toast.success(res.data.msg);
            this.close_();
            this.routerDetail(res.data.data.data.id);
          } else if (res.data.code === '50620') {
            Toast.success(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        })
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.houseName = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
        }
      },

      confiscate() {
        this.$http.get(this.urls + 'bulletin/confiscate').then((res) => {
          if (res.data.code === '50610') {
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.house_id = draft.house_id;
            this.form.contract_id = draft.contract_id;
            this.houseName = data.address;
            this.form.payWay = data.payWay;
            this.form.price_arr = data.price_arr;
            this.form.type = draft.type;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.form.remark = draft.remark;
            this.staff_name = data.staff_name;
            this.leader_name = data.leader_name;
            this.department_name = data.department_name;
          } else {
            this.form.id = '';
          }
        })
      },
      close_() {
        this.form.id = '';
        this.form.payWay = '';
        this.form.price_arr = '';
        this.form.house_id = '';
        this.form.contract_id = '';
        this.form.remark = '';
        this.form.type = 0;
        this.form.collect_or_rent = '';
        this.collect_or_rent = '';
        this.staff_name = '';
        this.leader_name = '';
        this.department_name = '';
      }
    },
  }
</script>

<style lang="scss">
  #confiscate {
    overflow: hidden;
  }
</style>
