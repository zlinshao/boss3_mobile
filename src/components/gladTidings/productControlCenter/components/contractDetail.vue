<template>
  <div id="contract">
    <van-tabs>
      <van-tab title="收房合同">
        <div class="contractInfo" v-if="lords.length>0" v-for="item in lords" @click="searchCollectDetail(item.id)">
          <van-row class="contractItem">
            <van-col class="itemWord" span="5">合同编号 : </van-col>
            <van-col class="itemWord" span="19">{{item.contract_number}}</van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col class="itemWord" span="5">合同状态 : </van-col>
            <van-col class="itemWord" span="19">
              <span v-if="item.status == 1">未签约</span>
              <span v-else-if="item.status == 2">已签约</span>
              <span v-else-if="item.status == 3">快到期(60天内)</span>
              <span v-else-if="item.status == 4">已结束</span>
              <span v-else-if="item.status == 5">已过期</span>
              <span v-else="">/</span>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">报备时间 : </van-col>
                <van-col class="itemWord" span="14">{{item.created_at.split(' ')[0]}}</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">签约时长 : </van-col>
                <van-col class="itemWord" span="14">{{item.duration_days}}天</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">开单人 : </van-col>
                <van-col class="itemWord" span="14">{{item.sign_user.name}}</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">客户姓名 : </van-col>
                <van-col class="itemWord" span="14">{{item.customers.name}}</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">所属部门 : </van-col>
                <van-col class="itemWord" span="14">{{item.sign_org.name}}</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">结束时间 : </van-col>
                <van-col class="itemWord" span="14">{{item.end_at}}</van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>
        <div class="contractInfo" v-else="" style="text-align: center;font-size: .5rem;color: #777;height: 3rem;line-height: 3rem">
          暂无生效收房合同
        </div>
      </van-tab>
      <van-tab title="租房合同">
        <div class="contractInfo" v-if="renters.length>0" v-for="item in renters" @click="searchRentDetail(item.id)">
          <van-row class="contractItem">
            <van-col class="itemWord" span="5">合同编号 : </van-col>
            <van-col class="itemWord" span="19">{{item.contract_number}}</van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col class="itemWord" span="5">合同状态 : </van-col>
            <van-col class="itemWord" span="19">
              <span v-if="item.status == 1">未签约</span>
              <span v-else-if="item.status == 2">已签约</span>
              <span v-else-if="item.status == 3">快到期(60天内)</span>
              <span v-else-if="item.status == 4">已结束</span>
              <span v-else-if="item.status == 5">已过期</span>
              <span v-else="">/</span>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">报备时间 : </van-col>
                <van-col class="itemWord" span="14">{{item.created_at.split(' ')[0]}}</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">签约时长 : </van-col>
                <van-col class="itemWord" span="14">{{item.duration_days}}天</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">开单人 : </van-col>
                <van-col class="itemWord" span="14">{{item.sign_user.name}}</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">客户姓名 : </van-col>
                <van-col class="itemWord" span="14">{{item.customers.name}}</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">所属部门 : </van-col>
                <van-col class="itemWord" span="14">{{item.sign_org.name}}</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">结束时间 : </van-col>
                <van-col class="itemWord" span="14">{{item.end_at}}</van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>
        <div class="contractInfo" v-else="" style="text-align: center;font-size: .5rem;color: #777;height: 3rem;line-height: 3rem">
          暂无生效租房合同
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  export default {
    name: 'hello',
    components: {Toast},
    data () {
      return {
        lords:[],
        renters:[],
      }
    },
    mounted(){
      this.getData();
    },
    activated(){
      if(this.$route.query.id){
        this.getData();
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('productDetail', 'house');
        vm.ddRent('productDetail', 'house');
      })
    },
    beforeRouteLeave(to, from, next){
      Toast.clear();
      next();
    },
    methods:{
      getData(){
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.$http.get(globalConfig.server+'house/album/'+this.$route.query.id).then((res) => {
          Toast.clear();
          if(res.data.code === '30070'){
            this.lords = res.data.data.detail.lords;
            this.renters = res.data.data.detail.renters;
          }else {

          }
        })
      },
      searchCollectDetail(id){
        this.$router.push({path: '/collectDetail', query: {id: id}});
      },
      searchRentDetail(id){
        this.$router.push({path: '/rentDetail', query: {id: id}});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #contract{
    background: #FFFFFF;
    .flex {
      display: -webkit-flex; /* Safari */
      display: flex;
    }
    .contractInfo{
      border-bottom: 1px solid #DDDDDD;
      &:last-child{
        border: none;
      }
      padding: .3rem;
      .contractItem{
        padding: .05rem 0;
        .itemWord{
          font-size: .28rem;
          line-height: 130%;
        }
      }
    }
  }
</style>
