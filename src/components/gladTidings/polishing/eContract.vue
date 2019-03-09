<template>
  <div>
    <van-search
      v-model="searchInfo"
      placeholder="地址/房东/租客"
      show-action
      shape="round"
      @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <van-tabs @click="changeTab">
      <van-tab title="收房"></van-tab>
      <van-tab title="租房"></van-tab>
    </van-tabs>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onSearch">
      <div v-for="(item,index) in list" class="list" :key="index" @click="toDetail(item)">
        <div class="infoParent">
          <div class="title">{{item.param_map.address}}</div>
          <div class="owner">房东</div>
        </div>
        <div class="btnParent">
          <van-button class="btn send" size="small" @click="send(item)">发送</van-button>
          <van-button class="btn sign" size="small" @click="sign(item)">签署</van-button>
        </div>
      </div>

    </van-list>
    <van-button round type="danger" class="new" @click="showChooseDialog()">新增合同</van-button>
    <van-popup v-model="show" class="popup">
      <div>
        <div class="choose" @click="collect">收房</div>
        <div class="line"></div>
        <div class="choose" @click="rent">租房</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export  class ContractInfo{
    constructor(type,number){
      this.type=type;
      this.number=number;
    }
  }
  export default {
    name: "eContract",
    data() {
      return {
        list: [],
        searchInfo: '',//搜索内容
        finished: false,
        loading: false,
        type:1,//1收2租
        show: false,//是否显示收租房弹框
        eurls: globalConfig.e_server,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        if (this.page > this.totalPages) return;
        this.loading = true;
        let per = JSON.parse(sessionStorage.personal);
        let staff_id = per.id;
        let app = this;
        this.$http.get(this.eurls + 'fdd/contract/index?staff_id=' + staff_id + '&page=' + this.page + '&limit=' + this.limit+"&type="+this.type).then(res => {
          app.loading = false;
          if(res.data.code==='40001'){
            app.finished = true;
            return
          }
          let totalPages = 0;
          let count = res.data.data.count;
          if (count % app.limit === 0) {
            totalPages = count / app.limit;
          } else {
            totalPages = parseInt(count / app.limit) + 1;
          }
          this.totalPages = totalPages;
          if (app.page === totalPages) {
            app.finished = true;
          }
          if (this.page === 1) {
            app.list = res.data.data.data;
          } else {
            app.list=app.list.concat(res.data.data.data);
          }
        })
      },
      send(item) {

      },
      sign(item) {

      },
      toDetail(item){

      },
      onSearch() {
        this.page++;
        this.getData();
      },
      //更改tab
      changeTab(index, title) {
        this.type=index+1;
        this.page=1;
        this.getData();
      },
      //显示选择收租房弹框
      showChooseDialog() {
        this.show = true;
      },
      //添加收房合同
      collect() {
        this.$router.push({path: '/newCollectContract', query: {c_info:new ContractInfo(0)}});//type 0为新签 1为作废重签 2为读草稿
      },
      //添加租房合同
      rent() {
        this.$router.push({path: '/newRentContract', query: {c_info:new ContractInfo(0)}});//type 0为新签 1为作废重签 2为读草稿
      }
    }
  }
</script>

<style scoped lang="scss">
  .new {
    position: fixed;
    bottom: 4em;
    right: 4em;
  }

  .choose {
    width: 100%;
    height: 2.5em;
    line-height: 2.5em;
    text-align: center;
  }

  .line {
    width: 100%;
    background-color: #666666;
    height: 1px;
  }

  .popup {
    border-radius: 5px;
    width: 50%;
  }

  .list {
    margin-top: 10px;
    width: 100%;
    height: 5em;
    display: flex;
    align-items: center;
    background-color: white;

    .infoParent {
      text-align: center;
      margin-left: 1em;
    }

    .title {
      font-size: 1.2em;
    }

    .owner {
      margin-top: .5em;
      font-size: .8em;
    }

    .btnParent {
      position: absolute;
      right: 1em;

      .btn {

      }

      .sign {

      }

      .send {

      }
    }
  }
</style>
