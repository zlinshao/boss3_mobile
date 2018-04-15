<template>
  <div id="agencyReport">

    <div class="main">
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
        <van-field
          v-model="form.amount"
          type="number"
          label="中介费"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.amount = ''"
          required>
        </van-field>
        <van-field
          v-model="form.name"
          type="text"
          label="中介名称"
          placeholder="请填写中介名称"
          icon="clear"
          @click-icon="form.name = ''"
          required>
        </van-field>
        <van-field
          v-model="form.account"
          label="卡号"
          type="number"
          @keyup="subAccount(form.account)"
          placeholder="请填写卡号"
          icon="clear"
          @click-icon="form.account = ''"
          required>
        </van-field>
        <van-field
          v-model="form.bank"
          label="银行"
          type="text"
          placeholder="请填写银行名称"
          icon="clear"
          @click-icon="form.bank = ''"
          required>
        </van-field>
        <van-field
          v-model="form.subbranch"
          label="支行"
          type="text"
          placeholder="请填写支行"
          icon="clear"
          @click-icon="form.subbranch = ''"
          required>
        </van-field>
        <van-field
          v-model="form.account_name"
          label="开户名"
          type="text"
          placeholder="请填写开户名"
          icon="clear"
          @click-icon="form.account_name = ''"
          required>
        </van-field>
        <van-switch-cell v-if="form.collect_or_rent === '1'" v-model="settleStatus" title="是否结清"/>
      </van-cell-group>

      <div class="aloneModel required" v-if="form.collect_or_rent === '1'">
        <div class="title"><span>*</span>结清截图</div>
        <UpLoad :ID="'settle'" @getImg="screen" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'screenshot'" @getImg="screen" :editImage="screenshots_leader"></UpLoad>
      </div>
      <van-cell-group>
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
          @click="search(1)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          @click="search(2)"
          readonly
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
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
        urls: globalConfig.server,
        isClear: '',              //删除图片
        picStatus: true,

        settleStatus: false,      //是否结清

        payWay: '1',                   //付款方式
        price_arr: '1',                //月单价
        payStatus: false,
        priceStatus: false,

        form: {
          id: '',
          draft: 0,
          collect_or_rent: '',
          contract_id: '',              //房屋地址id
          house_id: '',                 //房屋地址id
          amount: '',                   //中介费
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          name: '',                     //中介名称
          settle: 0,                    //是否结清
          screenshot: [],               //结清截图
          screenshot_leader: [],        //特殊情况
          remark: '',                   //备注
          staff_id: '',
          department_id: '',
        },
        screenshots: {},
        screenshots_leader: {},
        houseName: '',                  //房屋name
        staff_name: '',                 //开单人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.agencyDetail();
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
      search(val) {
        switch (val) {
          case 1:
            this.$router.push({path: '/organize'});
            break;
          case 2:
            this.$router.push({path: '/depart'});
            break;
        }
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
      screen(val) {
        this.picStatus = !val[2];
        if (val[0] === 'settle') {
          this.form.screenshot = val[1];
        } else {
          this.form.screenshot_leader = val[1];
        }
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
      rentChange(val) {
        this.houseName = '';
        this.form.house_id = '';
        this.form.contract_id = '';
        if (val === '1') {
          this.form.screenshot = [];
          this.screenshots = {};
          this.settleStatus = false;
        }
      },
      saveCollect(val) {
        if (this.settleStatus) {
          this.form.settle = 1;
        } else {
          this.form.settle = 0;
        }
        this.form.draft = val;
        if (this.haveInHand) {
          this.haveInHand = false;
          if (this.picStatus) {
            this.$http.post(this.urls + 'bulletin/agency', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50310') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50320') {
                Toast.success(res.data.msg);
              } else {
                Toast(res.data.msg);
              }
            })
          } else {
            Toast('图片上传中...');
          }
        } else {
          Toast('正在提交...');
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
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = JSON.parse(t.staff);
          this.form.staff_id = val.staff_id;
          this.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.department_name = val.depart_name;
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.department_name = val.name;
          this.form.department_id = val.id;
          this.stick();
        }
        if (t.tops === '') {
          this.stick();
        }
      },

      agencyDetail() {
        this.$http.get(this.urls + 'bulletin/agency').then((res) => {
          if (res.data.code === '50310') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.houseName = data.address;
            this.form.id = data.id;
            this.form.contract_id = draft.contract_id;
            this.form.house_id = draft.house_id;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.form.amount = draft.amount;
            this.form.bank = draft.bank;
            this.form.subbranch = draft.subbranch;
            this.form.account_name = draft.account_name;
            this.form.account = draft.account;
            this.form.name = draft.name;
            this.form.settle = draft.settle;
            this.settleStatus = draft.settle === 1 ? true : false;
            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots_leader = data.screenshot_leader;
            this.form.remark = draft.remark;
            this.form.staff_id = draft.staff_id;
            this.staff_name = data.staff_name;
            this.form.department_id = draft.depart_id;
            this.department_name = data.depart_name;
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
        this.houseName = '';
        this.form.id = '';
        this.form.contract_id = '';
        this.form.house_id = '';
        this.form.collect_or_rent = '';
        this.form.amount = '';
        this.form.bank = '';
        this.form.subbranch = '';
        this.form.account_name = '';
        this.form.account = '';
        this.form.name = '';
        this.form.settle = 0;
        this.settleStatus = false;
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.screenshots_leader = {};
        this.form.remark = '';
        this.staff_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
        this.department_name = '';
      }
    },
  }
</script>

<style lang="scss">
  #agencyReport {
    overflow: hidden;
  }
</style>
