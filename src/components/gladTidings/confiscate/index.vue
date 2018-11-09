<!--<template>-->
  <!--<div id="confiscate">-->

    <!--<div class="main" id="main">-->
      <!--<van-cell-group>-->
        <!--<div class="checks">-->
          <!--<div style="min-width: 110px;">充公性质</div>-->
          <!--<van-radio-group v-model="form.type">-->
            <!--<van-radio name="0">充公报备</van-radio>-->
            <!--<van-radio name="1">取消充公</van-radio>-->
          <!--</van-radio-group>-->
        <!--</div>-->
      <!--</van-cell-group>-->
      <!--<van-cell-group>-->
        <!--<van-field-->
          <!--v-model="form.address"-->
          <!--label="房屋地址"-->
          <!--type="text"-->
          <!--readonly-->
          <!--@click="searchSelect()"-->
          <!--placeholder="选择房屋地址"-->
          <!--required>-->
        <!--</van-field>-->
        <!--<van-field-->
          <!--:class="{'payWay': payStatus}"-->
          <!--@click="payWayClick(1)"-->
          <!--v-model="payWay"-->
          <!--label="付款方式"-->
          <!--type="text"-->
          <!--readonly-->
          <!--icon="arrow"-->
          <!--placeholder="付款方式已禁用">-->
        <!--</van-field>-->
        <!--<div class="accordion" v-if="payStatus">-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
        <!--</div>-->
        <!--<van-field-->
          <!--:class="{'payWay': priceStatus}"-->
          <!--v-model="price_arr"-->
          <!--@click="payWayClick(2)"-->
          <!--label="月单价"-->
          <!--type="text"-->
          <!--readonly-->
          <!--icon="arrow"-->
          <!--placeholder="月单价已禁用">-->
        <!--</van-field>-->
        <!--<div class="accordion" v-if="priceStatus">-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
          <!--<div>凤凰大厦克里夫的撒开了都是发范德萨范德萨</div>-->
        <!--</div>-->
        <!--<van-field-->
          <!--v-model="form.remark"-->
          <!--label="备注"-->
          <!--type="textarea"-->
          <!--placeholder="请填写备注">-->
        <!--</van-field>-->
        <!--<van-field-->
          <!--v-model="staff_name"-->
          <!--label="开单人"-->
          <!--type="text"-->
          <!--placeholder="开单人已禁用"-->
          <!--disabled>-->
        <!--</van-field>-->
        <!--<van-field-->
          <!--v-model="department_name"-->
          <!--label="部门"-->
          <!--type="text"-->
          <!--placeholder="部门已禁用"-->
          <!--disabled>-->
        <!--</van-field>-->
      <!--</van-cell-group>-->
    <!--</div>-->

    <!--<div class="footer">-->
      <!--<div class="" @click="close_()">重置</div>-->
      <!--<div class="" @click="saveCollect(1)">草稿</div>-->
      <!--<div class="" @click="saveCollect(0)">发布</div>-->
    <!--</div>-->

  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import UpLoad from '../../common/UPLOAD.vue'-->
  <!--import CollectHouse from '../collectHouse.vue'-->
  <!--import {Toast} from 'vant';-->
  <!--import SelectDepart from '../../common/selectDepartment.vue'-->

  <!--export default {-->
    <!--name: "index",-->
    <!--components: {UpLoad, Toast, SelectDepart, CollectHouse},-->
    <!--data() {-->
      <!--return {-->
        <!--haveInHand: true,-->
        <!--urls: globalConfig.server,-->
        <!--refundSta: false,-->

        <!--payWay: '1',                   //付款方式-->
        <!--price_arr: '1',                //月单价-->
        <!--payStatus: false,-->
        <!--priceStatus: false,-->

        <!--form: {-->
          <!--address: '',-->
          <!--id: '',-->
          <!--collect_or_rent: '0',-->
          <!--type: '0',-->
          <!--draft: 0,-->
          <!--contract_id: '',            //合同id-->
          <!--house_id: '',-->
          <!--remark: '',                   //备注-->
        <!--},-->
        <!--staff_name: '',                 //开单人name-->
        <!--department_name: '',            //部门name-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--this.confiscate();-->
    <!--},-->
    <!--activated() {-->
      <!--this.houseInfo();-->
      <!--this.routerIndex('');-->
      <!--this.ddRent('');-->
    <!--},-->
    <!--methods: {-->
      <!--payWayClick(val) {-->
        <!--if (val === 1) {-->
          <!--this.payStatus = !this.payStatus;-->
          <!--this.priceStatus = false;-->
        <!--} else {-->
          <!--this.priceStatus = !this.priceStatus;-->
          <!--this.payStatus = false;-->
        <!--}-->
      <!--},-->
      <!--searchSelect() {-->
        <!--this.$router.push({path: '/collectHouse', query: {type: 'lord'}});-->
      <!--},-->

      <!--saveCollect(val) {-->
        <!--if (this.haveInHand) {-->
          <!--this.haveInHand = false;-->
          <!--this.form.draft = val;-->
          <!--this.$http.post(this.urls + 'bulletin/confiscate', this.form).then((res) => {-->
            <!--this.haveInHand = true;-->
            <!--if (res.data.code === '50610') {-->
              <!--Toast.success(res.data.msg);-->
              <!--this.close_();-->
              <!--this.routerDetail(res.data.data.id);-->
            <!--} else if (res.data.code === '50620') {-->
              <!--this.form.id = res.data.data.id;-->
              <!--Toast.success(res.data.msg);-->
            <!--} else {-->
              <!--Toast(res.data.msg);-->
            <!--}-->
          <!--})-->
        <!--} else {-->
          <!--Toast('正在提交，请耐心等待...');-->
        <!--}-->
      <!--},-->

      <!--houseInfo() {-->
        <!--let t = this.$route.query;-->
        <!--if (t.house !== undefined && t.house !== '') {-->
          <!--let val = JSON.parse(t.house);-->
          <!--this.form.address = val.house_name;-->
          <!--this.form.contract_id = val.id;-->
          <!--this.form.house_id = val.house_id;-->
          <!--this.payWay = val.pay_way;-->
          <!--this.price_arr = val.month_price;-->
          <!--this.staff_name = val.staff_name;-->
          <!--this.department_name = val.department_name;-->
        <!--}-->
      <!--},-->

      <!--confiscate() {-->
        <!--this.$http.get(this.urls + 'bulletin/confiscate').then((res) => {-->
          <!--if (res.data.code === '50610') {-->
            <!--let data = res.data.data;-->
            <!--let draft = res.data.data.draft_content;-->

            <!--this.form.id = data.id;-->
            <!--this.form.type = draft.type;-->
            <!--this.form.collect_or_rent = draft.collect_or_rent;-->
            <!--this.form.house_id = draft.house_id;-->
            <!--this.form.contract_id = draft.contract_id;-->
            <!--this.form.address = data.address;-->
            <!--this.form.payWay = data.payWay;-->
            <!--this.form.price_arr = data.price_arr;-->
            <!--this.form.remark = draft.remark;-->
            <!--this.staff_name = data.staff_name;-->
            <!--this.department_name = data.department_name;-->
          <!--} else {-->
            <!--this.form.id = '';-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--close_() {-->
        <!--this.picStatus = true;-->
        <!--this.form.address = '';-->
        <!--this.form.id = '';-->
        <!--this.payWay = '';-->
        <!--this.price_arr = '';-->
        <!--this.form.collect_or_rent = '0';-->
        <!--this.form.house_id = '';-->
        <!--this.form.type = '0';-->
        <!--this.form.contract_id = '';-->
        <!--this.form.remark = '';-->
        <!--this.staff_name = '';-->
        <!--this.department_name = '';-->
      <!--}-->
    <!--},-->
  <!--}-->
<!--</script>-->

<!--<style lang="scss">-->
  <!--#confiscate {-->
    <!--overflow: hidden;-->
  <!--}-->
<!--</style>-->
