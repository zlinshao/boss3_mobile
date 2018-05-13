<template>
  <div id="collectDetail">
    <div class="mainContent">

      <div v-if="contractInfo.customers" v-for="item in contractInfo.customers">
        <div class="content">
          <div class="title">
            <span>房东姓名</span>
          </div>
          <div class="value">
            <span>{{item.name}}</span>
          </div>
        </div>
        <div class="content">
          <div class="title">
            <span>尊称</span>
          </div>
          <div class="value">
            <span v-if="item.sex==1">先生</span>
            <span v-else="">女士</span>
          </div>
        </div>
        <div class="content">
          <div class="title">
            <span>联系电话</span>
          </div>
          <div class="value">
            <a :href="'tel:'+item.phone" style="color: #409EFF">{{item.phone}}</a>
          </div>
        </div>
        <div class="content">
          <div class="title">
            <span>证件类型</span>
          </div>
          <div class="value">
            <span>{{matchDictionary(item.idtype)}}</span>
          </div>
        </div>
        <div class="content">
          <div class="title">
            <span>证件号码</span>
          </div>
          <div class="value">
            <span>{{item.idcard}}</span>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <span>订单性质</span>
        </div>
        <div class="value">
          <span v-if="contractInfo.contract_type == 1">公司单</span>
          <span v-if="contractInfo.contract_type !== undefined && contractInfo.contract_type == 0">非公司单</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>合同编号</span>
        </div>
        <div class="value">
          <span>{{contractInfo.contract_number}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>签约时长(月)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.month}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>合同签约时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.sign_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>合同开始时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.begin_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>合同结束时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.end_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>合同上传时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.contract_create_time}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>空置期时长(天)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.vacancy}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>空置期开始时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.begin_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>空置期结束时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.vacancy_end_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>空置期安置方式</span>
        </div>
        <div class="value">
          <span>{{matchDictionary(contractInfo.vacancy_way)}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>保修期(月)</span>
        </div>
        <div class="value">
          <span v-if="contractInfo.warranty_month">{{contractInfo.warranty_month}}月</span>
          <span v-if="contractInfo.warranty_day">{{contractInfo.warranty_day}}天</span>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <span>是否中介</span>
        </div>
        <div class="value">
          <span v-if="contractInfo.is_agency">中介</span>
          <span v-if="contractInfo.is_agency !== undefined && contractInfo.is_agency == 0">个人</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>押金(元)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.deposit}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>月单价(元)</span>
        </div>
        <div class="value">
          <span v-for="(item,index) in contractInfo.price">
            {{item.price}}元，{{item.period}}个月 <span v-show="index<contractInfo.price-1">;</span>
          </span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>付款方式</span>
        </div>
        <div class="value">
          <span v-for="(item,index) in contractInfo.pay_way">
            {{matchDictionary(item.pay_way)}}，{{item.period}}个月 <span v-show="index<contractInfo.pay_way-1">;</span>
          </span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>第一次打房租时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.pay_first_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>第二次打房租时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.pay_second_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>收款人姓名</span>
        </div>
        <div class="value">
          <span>{{contractInfo.account_name}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>收款人与房东关系</span>
        </div>
        <div class="value">
          <span>{{contractInfo.relationship}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>支付方式</span>
        </div>
        <div class="value">
          <span>{{matchDictionary(contractInfo.purchase_way)}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>账号</span>
        </div>
        <div class="value">
          <span>{{contractInfo.account}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>开户行</span>
        </div>
        <div class="value">
          <span>{{contractInfo.bank}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>支行</span>
        </div>
        <div class="value">
          <span>{{contractInfo.subbranch}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>资料补齐时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.data_date}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>中介费(元)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.agency}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>违约金(元)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.penalty}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>物业费付款方</span>
        </div>
        <div class="value">
          <span>{{contractInfo.property_payer}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>水表底数(度)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.water}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>电表底数(度)</span>
        </div>
        <div class="value">
          <span>峰：{{contractInfo.electricity_peak}}</span>
          <span>谷：{{contractInfo.electricity_valley}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>气表底数(度)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.gas}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>物业及公摊费用(元)</span>
        </div>
        <div class="value">
          <span>{{contractInfo.public_fee}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>开单人</span>
        </div>
        <div class="value">
          <span>{{contractInfo.staff_name}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>所属部门</span>
        </div>
        <div class="value">
          <span>{{contractInfo.department_name}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>合同上传时间</span>
        </div>
        <div class="value">
          <span>{{contractInfo.contract_create_time}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>备注条款</span>
        </div>
        <div class="value">
          <span>{{contractInfo.remark_terms}}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>备注</span>
        </div>
        <div class="value">
          <span>{{contractInfo.remark}}</span>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <span>合同照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.photo" :src="value"
                 @click="showLargePic(contractInfo.photo,0)">
          </div>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <span>证件照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.identity_photo" :src="value"
            @click="showLargePic(contractInfo.identity_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>银行卡照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.bank_photo" :src="value"
            @click="showLargePic(contractInfo.bank_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>水表照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.water_photo" :src="value"
            @click="showLargePic(contractInfo.water_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>电表照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.electricity_photo" :src="value"
            @click="showLargePic(contractInfo.electricity_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>燃气表照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.gas_photo" :src="value"
            @click="showLargePic(contractInfo.gas_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>房产证照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.property_photo" :src="value"
            @click="showLargePic(contractInfo.property_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>水卡照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.water_card_photo" :src="value"
            @click="showLargePic(contractInfo.water_card_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>电卡照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.electricity_card_photo" :src="value"
            @click="showLargePic(contractInfo.electricity_card_photo,0)">
          </div>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <span>燃气卡照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.gas_card_photo" :src="value"
            @click="showLargePic(contractInfo.gas_card_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>交接单</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.checkin_photo" :src="value"
            @click="showLargePic(contractInfo.checkin_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>委托书</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.auth_photo" :src="value"
            @click="showLargePic(contractInfo.auth_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>押金收条</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.deposit_photo" :src="value"
            @click="showLargePic(contractInfo.deposit_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>承诺书照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.promise" :src="value"
            @click="showLargePic(contractInfo.promise,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>补充照片</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.other_photo" :src="value"
            @click="showLargePic(contractInfo.other_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>退租交接单</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.checkout_photo" :src="value"
            @click="showLargePic(contractInfo.checkout_photo,0)">
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>退租结算单</span>
        </div>
        <div class="value">
          <div class="stack stack-spread active">
            <img class="image" v-for="(value,key) in contractInfo.checkout_settle_photo" :src="value"
            @click="showLargePic(contractInfo.checkout_settle_photo,0)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';

  export default {
    name: "collectDetail",
    components: {ImagePreview, Toast},
    data() {
      return {
        all_dic : [],
        contractInfo:{},
      }
    },
    mounted(){
      this.getDictionary();
      this.getData();
    },
    beforeRouteLeave(to, from, next) {
      Toast.clear();
      next();
    },
    beforeRouteEnter(to, from, next) {
      to.meta.keepAlive = true;
      next();
    },
    methods:{
      //字典匹配
      getDictionary() {
        this.$http.get(globalConfig.server + 'setting/dictionary/all').then((res) => {
          this.all_dic = res.data.data;
        })
      },

      matchDictionary(id) {
        let dictionary_name = null;
        this.all_dic.map((item) => {
          if (item.id == id) {
            dictionary_name = item.dictionary_name;
          }
        });
        return dictionary_name;
      },
      //获取合同详情
      getData(){
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.$http.get(globalConfig.server + 'lease/collect/'  + this.$route.query.id).then((res) => {
          Toast.clear();
          if (res.data.code === '61010') {
            this.contractInfo = res.data.data;
          }else {
            this.contractInfo = {};
          }
        })
      },
      showLargePic(images,index){
        let imgArray = [];
        for(let key in images){
          imgArray.unshift(images[key]);
        }
        ImagePreview(imgArray,index);
      }
    }
  }
</script>

<style scoped lang="scss">
  #collectDetail {
    box-sizing: border-box;
    .mainContent{
      .content {
        width: 100%;
        padding: .15rem .3rem;
        box-sizing: border-box;
        line-height: 24px;
        background-color: #fff;
        color: #333;
        border-bottom: 1px solid #eee;
        display: flex;
        .title{
          width: 120px;
          span{
            font-weight: bold;
            font-size: .26rem;
          }
        }
        .value{
          flex-grow: 1;
          span{
            font-size: .26rem;
          }
        }
        .image{
          width: 3rem;
          height: 2rem;
          border-radius: 4px;
          margin: 0 .1rem .1rem 0;
        }


        .stack {
          padding: 0;
          position: relative;
          max-width: 100%;
        }

        .stack img {
          position: absolute;
          top: 0;
          left: 0;
          -webkit-transition: all 0.3s;
          transition: all 0.3s;
          outline: 1px solid transparent;
        }

        .stack img:last-child {
          position: relative;
        }
        .stack-spread.active img:nth-child(15) {
          -webkit-transform: translate(-5px,5px);
          transform: translate(-5px,5px);
        }

        .stack-spread.active img:first-child {
          -webkit-transform: translate(5px,-5px);
          transform: translate(5px,-5px);
        }
      }
    }
  }
</style>
