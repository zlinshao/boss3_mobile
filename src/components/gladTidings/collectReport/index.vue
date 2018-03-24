<template>
  <div id="collectReport" v-wechat-title="$route.meta.title">
    <div v-show="!searchShow" class="main">
      <van-cell-group>
        <van-switch-cell v-model="joint" title="是否合租"/>
        <van-field
          v-if="joint"
          v-model="form.rooms_sum"
          label="房间数量"
          type="number"
          placeholder="请填写房间数量"
          required>
        </van-field>
        <van-field
          v-model="city_name"
          label="城市"
          @click="selectShow(2,'')"
          type="text"
          readonly
          placeholder="请选择城市"
          required>
        </van-field>
        <van-field
          v-model="form.community_name"
          label="小区"
          @click="searchSelect(1)"
          type="text"
          readonly
          placeholder="请选择小区地址"
          required>
        </van-field>
        <div class="fourth">
          <van-field
            label="门牌号"
            required>
          </van-field>
          <van-field
            style="width: 22%;"
            v-model="form.building"
            type="text"
            placeholder="栋">
          </van-field>
          <span class="cut">-</span>
          <van-field
            style="width: 22%;"
            v-model="form.unit"
            type="text"
            placeholder="单元">
          </van-field>
          <span class="cut">-</span>
          <van-field
            class="twoBorder"
            v-model="form.doorplate"
            type="text"
            placeholder="门牌">
          </van-field>
        </div>
        <van-field
          @click="selectShow(1,'')"
          v-model="house_type_name"
          readonly
          type="text"
          label="户型"
          placeholder="请选择户型"
          required>
        </van-field>
        <van-field
          v-model="form.month"
          type="number"
          label="收房月数"
          placeholder="请填写收房月数"
          icon="clear"
          @click-icon="form.month = ''"
          required>
        </van-field>
        <van-field
          v-model="form.begin_date"
          type="text"
          label="空置期开始"
          placeholder="请选择空置期开始日期"
          readonly
          @click="timeChoose(1)"
          required>
        </van-field>
        <div class="first_date">
          <van-field
            class="title"
            label="打房租日期"
            required>
          </van-field>
          <van-field
            v-model="form.pay_first_date"
            readonly
            type="text"
            @click="timeChoose(2)"
            placeholder="第一次打款日期">
          </van-field>
          <span class="cut">-</span>
          <van-field
            v-model="form.pay_second_date"
            readonly
            type="text"
            @click="timeChoose(3)"
            placeholder="第二次打款日期">
          </van-field>
        </div>
      </van-cell-group>
      <div class="changes" v-for="(key,index) in amountPrice">
        <div class="paddingTitle">
          <span>月单价<span v-if="amountPrice > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountPrice > 1" @click="deleteAmount(index,1)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="datePrice[index]"
            type="text"
            label="开始时间"
            placeholder="获取周期开始日期"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_price_arr[index]"
            type="number"
            label="付款周期"
            @keyup="periodDate(1)"
            placeholder="请填写月单价周期"
            required>
          </van-field>
          <van-field
            v-model="form.price_arr[index]"
            type="number"
            label="价格"
            placeholder="请填写金额"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(1)" class="addInput">
        +增加月单价
      </div>

      <div class="changes" v-for="(key,index) in amountPay">
        <div class="paddingTitle">
          <span>付款方式<span v-if="amountPay > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amountPay > 1" @click="deleteAmount(index,2)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="datePay[index]"
            type="text"
            label="开始时间"
            placeholder="获取周期开始日期"
            disabled
            required>
          </van-field>
          <van-field
            v-model="form.period_pay_arr[index]"
            type="number"
            label="付款周期"
            @keyup="periodDate(2)"
            placeholder="请填写付款方式周期"
            required>
          </van-field>
          <van-field
            @click="selectShow(4,index)"
            v-model="payTypeNum[index]"
            label="付款方式"
            type="text"
            readonly
            placeholder="请选择付款方式"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="priceAmount(2)" class="addInput bottom">
        +增加付款方式
      </div>

      <van-cell-group>
        <van-field
          v-model="form.deposit"
          label="押金"
          type="number"
          placeholder="请填写押金"
          icon="clear"
          @click-icon="form.deposit = ''"
          required>
        </van-field>
        <van-field
          v-model="form.receipt"
          label="收据编号"
          type="text"
          placeholder="请填写收据编号"
          required>
        </van-field>
        <van-field
          v-model="form.vacancy"
          label="空置期"
          type="number"
          placeholder="请填写空置期"
          icon="clear"
          @click-icon="form.vacancy = ''"
          required>
        </van-field>
        <div class="first_date">
          <van-field
            class="title"
            label="保修期"
            required>
          </van-field>
          <van-field
            style="width: 30%;"
            v-model="form.warranty"
            type="number"
            placeholder="保修期(月)">
          </van-field>
          <span class="cut" style="padding-right: 27px;">-</span>
          <van-field
            class="twoBorder"
            v-model="form.warranty_day"
            type="number"
            placeholder="保修期(天)">
          </van-field>
        </div>
        <van-field
          v-model="fromName"
          label="来源"
          type="text"
          readonly
          placeholder="请选择客户来源"
          @click="selectShow(5,'')"
          required>
        </van-field>
        <van-field
          v-model="form.property"
          label="物业费"
          type="number"
          placeholder="请填写物业费"
          icon="clear"
          @click-icon="form.property = ''"
          required>
        </van-field>
        <van-field
          v-model="property_name"
          label="物业费付款人"
          type="text"
          placeholder="请选择物业费付款人"
          @click="selectShow(6,'')"
          readonly
          required>
        </van-field>
        <van-field
          v-model="form.sign_date"
          label="签约日期"
          readonly
          type="text"
          @click="timeChoose(4)"
          placeholder="请选择签约日期"
          required>
        </van-field>
        <van-field
          v-model="form.name"
          label="房东姓名"
          type="text"
          placeholder="请填写房东姓名"
          icon="clear"
          @click-icon="form.name = ''"
          required>
        </van-field>
        <van-field
          v-model="form.phone"
          label="联系方式"
          type="number"
          placeholder="请填写联系方式"
          icon="clear"
          @click-icon="form.phone = ''"
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
        <van-field
          v-model="form.relationship"
          label="关系"
          type="text"
          placeholder="请填写收款人与房东关系"
          icon="clear"
          @click-icon="form.relationship = ''"
          required>
        </van-field>
        <van-field
          v-model="form.penalty"
          label="违约金"
          type="number"
          placeholder="请填写违约金"
          icon="clear"
          @click-icon="form.penalty = ''"
          required>
        </van-field>
        <van-field
          v-model="form.contract_number"
          label="合同编号"
          type="text"
          placeholder="请填写收房合同编号"
          icon="clear"
          @click-icon="form.contract_number = ''"
          required>
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">特殊情况截图</div>
        <UpLoad :ID="'screenshot'" @getImg="getImgData"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>合同照片</div>
        <UpLoad :ID="'photo'" @getImg="getImgData"></UpLoad>
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
          @click="searchSelect(2)"
          label="开单人"
          type="text"
          readonly
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="leader_name"
          @click="searchSelect(3)"
          label="负责人"
          type="text"
          readonly
          placeholder="请选择负责人"
          required>
        </van-field>
        <van-field
          v-model="department_name"
          @click="searchSelect(4)"
          label="部门"
          type="text"
          readonly
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <div v-show="!searchShow" class="footer">
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

    <div :class="{'searchClass':searchShow}" v-if="searchShow">
      <van-search
        v-model="searchValue"
        placeholder="请输入商品名称"
        show-action
        @keyup="onSearch"
        @cancel="onCancel"/>
      <div class="notData" v-if="lists.length === 0">暂无数据</div>
      <div class="searchContent">
        <div class="searchList" v-for="key in lists" @click="village(key.village_name, key.id)">
          <div>{{key.village_name}}</div>
          <div>
            <p>{{key.province_name}}-{{key.city_name}}</p>
            <!--<span>上官海棠</span>-->
          </div>
        </div>
      </div>
    </div>

    <!--select 选择-->
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

    <Organization :type="organizeType" :module="staffModule" @close="onCancel" @organization="staff_"></Organization>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import Organization from '../organize.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast, Organization},
    data() {
      return {
        urls: globalConfig.server,
        address: globalConfig.server_user,
        staffModule: false,       //开单人
        organizeType: '',

        searchShow: false,        //搜索
        searchValue: '',          //搜索
        allCity: [],              //城市
        cities: [],               //城市
        city_name: '',            //城市
        city_id: '',              //城市
        lists: [],
        tabs: '',
        columns: [],              //select值
        selectHide: false,        //房型
        joint: false,             //是否合租
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        amountPrice: 1,
        datePrice: [],
        first_date: [],

        amountPay: 1,
        datePay: [],
        payType: [''],              //付款方式ID
        payTypeNum: [''],           //付款方式
        payIndex: '',               //付款方式index
        house_type_name: '1室 1厅 1卫',
        form: {
          type: 1,
          draft: 0,
          share: '',                    //合租整租标记 0整租1合租
          community_name: '',           //小区名字
          community_id: '',             //小区id
          building: '',                 //栋
          unit: '',                     //单元
          doorplate: '',                //门牌
          house_type: [0, 1, 1],
          rooms_sum: '',                //合租时房间数量
          month: '',                    //收房月数
          begin_date: '',               //合同开始日期
          price_arr: [''],              //月单价
          period_price_arr: [''],       //月单价周期
          pay_way_arr: [''],            //付款方式
          period_pay_arr: [''],         //付款方式周期
          vacancy: '',                  //空置期
          warranty: '',                 //保修期月
          warranty_day: '',             //保修期天
          from: '1',                    //客户来源 1个人2中介
          deposit: '',                  //押金
          receipt: '',                  //收据编号
          property: '',                 //物业费
          property_payer: '',           //物业费付款人
          pay_first_date: '',           //第一次付款时间
          pay_second_date: '',          //第二次付款时间
          sign_date: '',                //签约日期
          name: '',                     //房东姓名
          phone: '',                    //电话号码
          bank: '',                     //银行名称
          subbranch: '',                //支行名称
          account_name: '',             //帐户名称
          account: '',                  //帐号
          relationship: '',             //房东与收款人关系
          penalty: '',                  //违约金
          contract_number: '',          //合同编号
          screenshot_leader: [],        //领导截图 数组
          photo: [],                    //合同照片 数组
          remark: '',                   //备注
          staff_id: '',                //开单人id
          leader_id: '',               //负责人id
          department_id: '3',           //部门id

        },
        property_name: '',            //物业费付款人
        staff_name: '',               //开单人name
        leader_name: '',              //负责人name
        department_name: '',          //部门name
        fromName: '个人',             //客户来源
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.$http.get(this.urls + 'setting/dictionary/306').then((res) => {
        this.allCity = res.data.data;
        this.cities = [];
        for (let i = 0; i < res.data.data.length; i++) {
          this.cities.push(res.data.data[i].dictionary_name);
        }
      })
    },
    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            this.searchShow = true;
            break;
          case 2:
            this.staffModule = true;
            this.organizeType = 'staff';
            break;
          case 3:
            this.staffModule = true;
            this.organizeType = 'leader';
            break;
        }
      },
      onSearch() {
        if (this.searchValue.length > 1) {
          this.$http.get(this.urls + 'setting/community/', {
            params: {
              num: 30,
              city: this.city_id,
              keywords: this.searchValue,
            }
          }).then((res) => {
            this.lists = res.data.data.list;
          })
        }
      },

      // select关闭
      onCancel() {
        this.searchShow = false;
        this.selectHide = false;
        this.timeShow = false;
        this.staffModule = false;
        this.lists = [];
      },
      // 开单人
      staff_(val, type) {
        if (type === 'staff') {
          this.form.staff_id = val.id;
          this.staff_name = val.name;
        } else {
          this.form.leader_id = val.id;
          this.leader_name = val.name;
        }
        this.onCancel();
      },

      // 小区
      village(name, id) {
        this.form.community_name = name;
        this.form.community_id = id;
        this.onCancel();
      },
      // 图片
      getImgData(val) {
        if (val[0] === 'screenshot') {
          this.form.screenshot_leader = val[1];
        } else {
          this.form.photo = val[1];
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
      // 日期选择
      timeChoose(val) {
        this.timeShow = true;
        this.timeIndex = val;
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate(val) {
        console.log(val);
        this.timeShow = false;
        switch (this.timeIndex) {
          case 1:
            this.form.begin_date = this.timeValue;
            break;
          case 2:
            this.form.pay_first_date = this.timeValue;
            this.first_date = [];
            this.datePrice = [];
            this.datePay = [];
            this.first_date.push(this.timeValue);
            this.datePrice.push(this.timeValue);
            this.datePay.push(this.timeValue);
            break;
          case 3:
            this.form.pay_second_date = this.timeValue;
            break;
          case 4:
            this.form.sign_date = this.timeValue;
            break;
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.payIndex = index;
        this.selectHide = true;
        switch (val) {
          case 1:
            this.columns = [
              {
                values: ['1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室'],
                className: 'column1',
                defaultIndex: 0
              },
              {
                values: ['无', '1厅', '2厅', '3厅', '4卫', '5卫'],
                className: 'column2',
                defaultIndex: 1
              },
              {
                values: ['无', '1卫', '2卫', '3卫', '4卫', '5卫'],
                className: 'column3',
                defaultIndex: 1
              }
            ];
            break;
          case 2:
            this.columns = this.cities;
            break;
          case 4:
            this.columns = ['月付', '双月付', '季付', '半年付', '年付'];
            break;
          case 5:
            this.columns = ['个人', '中介'];
            break;
          case 6:
            this.columns = ['房东', '租客', '公司'];
            break;
        }
      },
      // select选择
      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            if (value[1] === '无') {
              value[1] = '0厅';
            }
            if (value[2] === '无') {
              value[2] = '0卫';
            }
            this.house_type_name = value.join(' ');
            this.form.house_type = index;
            break;
          case 2:
            for (let i = 0; i < this.allCity.length; i++) {
              if (this.allCity[i].dictionary_name === value) {
                this.city_id = this.allCity[i].variable.city_id;
              }
            }
            this.city_name = value;
            break;
          case 4:
            this.payTypeNum[this.payIndex] = value;
            this.form.pay_way_arr[this.payIndex] = index + 1;
            break;
          case 5:
            this.fromName = value;
            this.form.from = index + 1;
            break;
          case 6:
            this.form.property_payer = index + 1;
            this.property_name = value;
            break;
        }
        this.selectHide = false;
      },

      // 月单价增加
      priceAmount(val) {
        if (val === 1) {
          this.amountPrice++;
          this.form.period_price_arr.push('');
          this.form.price_arr.push('');
        } else {
          this.amountPay++;
          this.form.period_pay_arr.push('');
          this.form.pay_way_arr.push('');
          this.payTypeNum.push('');
        }
      },
      // 删除月单价
      deleteAmount(index, val) {
        if (val === 1) {
          if (this.amountPrice > 1) {
            this.amountPrice--;
            this.form.period_price_arr.splice(index, 1);
            this.form.price_arr.splice(index, 1);
            this.datePrice.splice(index, 1);
            this.periodDate(1);
          }
        } else {
          this.amountPay--;
          this.form.period_pay_arr.splice(index, 1);
          this.form.pay_way_arr.splice(index, 1);
          this.payTypeNum.splice(index, 1);
          this.datePay.splice(index, 1);
          this.periodDate(2);
        }
      },
      // 日期计算
      periodDate(val) {
        let per;
        if (val === 1) {
          per = this.form.period_price_arr;
        } else {
          per = this.form.period_pay_arr;
        }
        this.$http.get(this.urls + '/bulletin/helper/date', {
          params: {
            begin_date: this.form.pay_first_date,
            period: per,
          }
        }).then((res) => {
          if (res.data.code === '51110') {
            if (val === 1) {
              this.datePrice = this.first_date.concat(res.data.data);
            } else {
              this.datePay = this.first_date.concat(res.data.data);
            }
          } else {
            Toast(res.data.msg);
          }
        })
      },

      saveCollect(val) {
        this.form.share = this.joint ? '1' : '0';
        this.form.draft = val;
        this.$http.post(this.urls + 'bulletin/collect', this.form).then((res) => {
          if (res.data.code === '50110') {
            Toast.success(res.data.msg);
            this.$router.push({path: '/publishDetail', query: {ids: res.data.data.data.id}});
          } else {
            Toast(res.data.msg);
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  #collectReport {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    $color: #409EFF;
    .van-switch.van-switch--on {
      background: $color;
    }
    .van-icon.van-icon-checked {
      color: $color;
    }
    .van-cell.van-hairline.van-field {
      .van-cell__title {
        width: 110px;
        span {
          font-size: 16px;
        }
      }
      .van-cell__value {
        padding-left: 110px;
      }
    }
    .fourth {
      .van-cell.van-hairline.van-field {
        width: 25%;
        .van-cell__value {
          padding-left: 20px;
        }
      }
    }
    .first_date {
      .van-cell.van-hairline.van-field {
        width: 33%;
        .van-cell__value {
          padding-left: 0;
        }
      }
      .title.van-cell.van-hairline.van-field {
        width: 31%;
      }
    }
    .fourth, .first_date {
      span.cut {
        padding-right: 10px;
        line-height: 39px;
        color: #969696;
        border-bottom: 1px solid #F4F4F4;
      }
      @include flex;
      .twoBorder {
        border-bottom: 1px solid #F4F4F4;
        padding-bottom: 9px;
      }
    }
    .aloneModel {
      background: #fff;
      width: 100%;
      margin: .2rem 0;
      padding-bottom: .26rem;
      .title {
        padding: .26rem .3rem 0;
      }
    }
    .aloneModel.required {
      .title {
        padding-left: .2rem;
        span {
          color: #f44;
        }
      }
    }
    .paddingTitle {
      @include flex;
      justify-content: space-between;
      padding: .26rem .3rem;
      color: #aaaaaa;
      .colors {
        color: $color;
      }
    }
    .addInput {
      height: .88rem;
      line-height: .88rem;
      text-align: center;
      color: $color;
      background: #ffffff;
    }
    .addInput.bottom {
      margin-bottom: .2rem;
    }
    .notData {
      text-align: center;
      padding: 24px 0;
      font-size: .33rem;
      color: #b3afaf;
    }
    .searchClass {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      z-index: 999;
      .searchContent {
        overflow: auto;
        height: 77%;
        .searchList {
          @include flex;
          justify-content: space-between;
          padding: .3rem;
          &:hover {
            background: #DDDDDD;
          }
          div:first-child {
            width: 48%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          div:last-of-type {
            text-align: right;
            p {
              /*margin-bottom: .16rem;*/
            }
            span {
              color: #aaaaaa;
            }
          }
        }
      }
    }
    .top, .footer {
      position: fixed;
      left: 0;
      right: 0;
      height: .9rem;
      z-index: 666;
      background: #ffffff;
    }

    .main {
      margin: .2rem 0 1.2rem;
    }
    .top {
      top: 0;
      box-shadow: 0 3px 10px 0 #dddddd;
      .van-hairline--top-bottom::after {
        border-bottom: 0;
      }
    }
    .footer {
      bottom: 0;
      height: 1rem;
      padding: 10px;
      @include flex;
      align-items: center;
      border-top: 1px solid #ebebeb;
      div + div {
        border-left: 1px solid #ebebeb;
      }
      div {
        height: .6rem;
        line-height: .6rem;
        width: 50%;
        text-align: center;
        color: $color;
      }
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #dddddd;
    }

    input::-moz-placeholder, textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #dddddd;
    }

    input:-moz-placeholder, textarea:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #dddddd;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #dddddd;
    }
  }
</style>
