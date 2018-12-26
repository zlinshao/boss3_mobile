<template>
  <div id="agencyReport">

    <div class="main" id="main">
      <van-cell-group>
        <div class="checks noBorder">
          <div class="titles">收租标记</div>
          <van-radio-group :disabled="counts === '2' || counts === '21'" v-model="form.collect_or_rent"
                           @change="rentChange">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <div class="crop_name noBorder">
          <van-field
            v-model="form.address"
            label="房屋地址"
            type="text"
            @click="searchSelect(form.collect_or_rent)"
            readonly
            placeholder="选择房屋地址"
            required>
          </van-field>
          <div class="titleRed" v-if="form.corp_name">{{form.corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
        <van-field
          v-model="form.customer_name"
          label="客户姓名"
          type="text"
          placeholder="客户姓名已禁用"
          disabled>
        </van-field>
        <van-field
          style="font-size: .18rem"
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

        <!--<div class="first_date" v-if="agencyStatus">-->
        <!--<van-field-->
        <!--style="width: 110px;"-->
        <!--class="title"-->
        <!--label="中介费"-->
        <!--required>-->
        <!--</van-field>-->
        <!--<van-field-->
        <!--v-model="form.agency_before_price"-->
        <!--type="text"          class="number"-->
        <!--disabled-->
        <!--placeholder="中介费已禁用">-->
        <!--</van-field>-->
        <!--<van-field-->
        <!--v-model="form.agency_price"-->
        <!--type="text"          class="number"-->
        <!--class="twoBorder"-->
        <!--placeholder="请填写修改写金额"-->
        <!--icon="clear"-->
        <!--@click-icon="form.agency_price = ''">-->
        <!--</van-field>-->
        <!--</div>-->
        <div class="changes" v-for="(key,index) in amountDitch ">
          <div class="paddingTitle">
            <span>渠道信息<span v-if="amountDitch > 1">({{key}})</span></span>
            <span class="colors" v-if="amountDitch > 1" @click="deleteAmount(index)">删除</span>
          </div>
          <van-field
            v-model="form.agency_infos[index].agency_price"
            type="text"
            class="number"
            label="中介费"
            placeholder="请填写金额"
            required>
          </van-field>
          <van-field
            v-model="form.agency_infos[index].agency_username"
            type="text"
            label="中介人"
            placeholder="请填写中介人"
            required>
          </van-field>
          <van-field
            v-model="form.agency_infos[index].agency_name"
            type="text"
            label="中介名称"
            placeholder="请填写中介名称"
            required>
          </van-field>
          <van-field
            v-model="form.agency_infos[index].agency_phone"
            type="text"
            class="number"
            label="中介联系方式"
            placeholder="请填写中介联系方式"
            required>
          </van-field>
          <van-field
            v-model="form.agency_infos[index].account"
            label="卡号"
            type="text"
            class="number"
            @blur="accountBank(form.agency_infos[index].account, index)"
            placeholder="请填写卡号"
            required>
          </van-field>
          <van-field
            v-model="form.agency_infos[index].bank"
            label="银行"
            type="text"
            placeholder="请填写银行名称"
            required>
          </van-field>
          <van-field
            v-model="form.agency_infos[index].subbranch"
            label="支行"
            type="text"
            placeholder="请填写支行">
          </van-field>
          <van-field
            v-model="form.agency_infos[index].account_name"
            label="开户名"
            type="text"
            placeholder="请填写开户名"
            required>
          </van-field>
        </div>
        <div @click="addAmount()" class="addInput bottom">
          +增加渠道信息
        </div>
        <van-switch-cell v-if="form.collect_or_rent === '1'" v-model="settleStatus" title="是否结清"/>
      </van-cell-group>

      <div class="aloneModel required" v-if="form.collect_or_rent === '1' && settleStatus">
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
          v-model="form.staff_name"
          disabled
          label="开单人"
          type="text"
          placeholder="开单人已禁用">
        </van-field>
        <van-field
          v-model="form.department_name"
          disabled
          label="部门"
          type="text"
          placeholder="部门已禁用">
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
        picStatus: 'success',
        haveInHand: true,

        settleStatus: true,      //是否结清
        amountDitch: 1,           //渠道

        payStatus: false,
        priceStatus: false,

        form: {
          address: '',
          corp_name: '',
          id: '',
          processable_id: '',
          draft: 0,
          payWay: [''],                 //付款方式
          price_arr: [''],              //月单价
          collect_or_rent: '',
          contract_id: '',              //房屋地址id
          house_id: '',                 //房屋地址id
          customer_name: '',            //客户姓名
          purchase_way: 509,            //支付方式
          agency_infos: [
            {
              agency_price: '',         //修改中介费
              agency_username: '',      //中介人
              agency_name: '',          //中介名称
              agency_phone: '',         //中介电话
              bank: '',                 //银行名称
              account: '',              //帐号
              subbranch: '',            //支行名称
              account_name: '',         //帐户名称
            }
          ],
          settle: 1,                    //是否结清
          screenshot: [],               //结清截图
          screenshot_leader: [],        //特殊情况
          remark: '',                   //备注
          staff_id: '',
          department_id: '',
          staff_name: '',                 //开单人name
          department_name: '',            //部门name
        },
        screenshots: {},
        screenshots_leader: {},
        numbers: '',

        counts: '',
        retry: 0,
      }
    },
    mounted() {
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.agencyDetail('');
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
        this.agencyDetail('');
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
        this.agencyDetail(newID);
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      this.houseInfo();
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
      accountBank(val, index) {
        this.$http.get(this.urls + 'bulletin/helper/bankname?card=' + val).then((res) => {
          if (res.data.code === '51110') {
            this.form.agency_infos[index].bank = res.data.data;
          }
        })
      },
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord1'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'renter1'}});
        } else {
          Toast('请选择收租标记');
        }
      },
      screen(val) {
        this.picStatus = val[2];
        if (val[0] === 'settle') {
          this.form.screenshot = val[1];
        } else {
          this.form.screenshot_leader = val[1];
        }
      },

      addAmount() {
        let data = {
          agency_price: '',             //修改中介费
          agency_username: '',          //中介人
          agency_name: '',              //中介名称
          agency_phone: '',             //中介电话
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
        };
        this.amountDitch++;
        this.form.agency_infos.push(data);
      },

      deleteAmount(index) {
        this.amountDitch--;
        this.form.agency_infos.splice(index, 1);
      },
      rentChange(val) {
        if (this.numbers !== val) {
          this.form.address = '';
          this.form.house_id = '';
          this.form.contract_id = '';
          this.form.payWay = [''];
          this.form.price_arr = [''];
          if (val === '0') {
            this.form.screenshot = [];
            this.screenshots = {};
            this.settleStatus = false;
            this.form.collect_or_rent = val;
          } else {
            this.settleStatus = true;
          }
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
          if (this.settleStatus) {
            this.form.settle = 1;
          } else {
            this.form.settle = 0;
          }
          this.form.draft = val;
          this.$http.post(this.urls + 'bulletin/agency', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === '50310' || res.data.code === '50330') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              if (res.data.data.id) {
                this.routerDetail(res.data.data.id)
              } else {
                this.routerDetail(res.data.data.data.id)
              }
            } else if (res.data.code === '50320') {
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
          console.log(val);
          this.form.customer_name = val.customers;
          if (val.agency_info && val.agency_info.agency_name) {
            this.form.agency_infos[0].agency_price = val.agency_info.agency_price || '';
            this.form.agency_infos[0].agency_username = val.agency_info.agency_user_name || '';
            this.form.agency_infos[0].agency_name = val.agency_info.agency_name || '';
            this.form.agency_infos[0].agency_phone = val.agency_info.agency_phone || '';
          } else {
            if (val.agency_info && val.agency_info.price) {
              this.form.agency_infos[0].agency_price = val.agency_info.price;
            } else {
              this.form.agency_infos[0].agency_price = '';
            }
          }
          this.form.address = val.house_name;
          this.form.corp_name = val.corp_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.helperBulletin(val.id);
        }
      },
      helperBulletin(id) {
        this.$http.get(this.urls + 'bulletin/helper/contract/' + id + '?collect_or_rent=' + this.form.collect_or_rent).then((res) => {
          if (res.data.code === '51110') {
            let pay = res.data.data;
            this.form.payWay = [];
            this.form.price_arr = [];
            for (let i = 0; i < pay.pay_way.length; i++) {
              this.form.payWay.push(pay.pay_way[i].begin_date + '~' + pay.pay_way[i].end_date + ':' + pay.pay_way[i].pay_way_str);
            }
            for (let i = 0; i < pay.price.length; i++) {
              this.form.price_arr.push(pay.price[i].begin_date + '~' + pay.price[i].end_date + ':' + pay.price[i].price_str);
            }
          }
        })
      },
      agencyDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/agency/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          }
        } else {
          type = 'bulletin/agency';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '50320') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;
            this.form.purchase_way = 509;
            this.form.address = draft.address;
            this.form.corp_name = draft.corp_name;
            this.form.id = data.id;
            this.form.contract_id = draft.contract_id;
            this.helperBulletin(draft.contract_id);
            this.form.house_id = draft.house_id;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;
            this.form.customer_name = draft.customer_name;
            if (draft.agency_infos) {
              this.amountDitch = draft.agency_infos.length;
              this.form.agency_infos = draft.agency_infos;
            } else {
              this.form.agency_infos[0].agency_price = draft.agency_price;
              this.form.agency_infos[0].agency_username = draft.agency_username;
              this.form.agency_infos[0].agency_name = draft.agency_name;
              this.form.agency_infos[0].agency_phone = draft.agency_phone;
              this.form.agency_infos[0].bank = draft.bank;
              this.form.agency_infos[0].subbranch = draft.subbranch;
              this.form.agency_infos[0].account_name = draft.account_name;
              this.form.agency_infos[0].account = draft.account;
            }
            this.form.settle = draft.settle;
            this.form.payWay = draft.payWay;
            this.form.price_arr = draft.price_arr;
            this.settleStatus = draft.settle === 1;
            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots_leader = data.screenshot_leader;
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
        this.form.purchase_way = 509;
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.payWay = [''];
        this.form.price_arr = [''];
        this.form.address = '';
        this.form.corp_name = '';
        this.form.processable_id = '';
        this.form.contract_id = '';
        this.form.house_id = '';
        this.form.collect_or_rent = '';
        this.agency_infos = [
          {
            agency_price: '',             //修改中介费
            agency_username: '',          //中介人
            agency_name: '',              //中介名称
            agency_phone: '',             //中介电话
            bank: '',                     //银行名称
            subbranch: '',                //支行名称
            account_name: '',             //帐户名称
            account: '',                  //帐号
          }
        ];
        this.form.customer_name = '';
        this.form.settle = 0;
        this.settleStatus = true;
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.screenshots_leader = {};
        this.form.remark = '';
        this.form.staff_name = '';
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
    .paddingTitle {
      background: #F8F8F8;
    }
    .addInput {
      border-top: 1px solid #f8f8f8;
    }
  }
</style>
