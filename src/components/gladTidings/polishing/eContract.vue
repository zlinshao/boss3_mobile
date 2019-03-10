<template>
  <div>
    <van-search
      v-if="false"
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
          <div class="title">
            {{type===1?item.param_map.house!==undefined?item.param_map.house.name:'':item.param_map.address}}
          </div>
          <span class="owner">{{item.param_map.name}}</span>
          <span class="owner" style="color: #e4393c;">{{getStatusStr(item)}}</span>
        </div>
        <div class="btnParent">
          <van-button v-if="item.contract_status===0" class="btn send" size="small"
                      @click="send(item)" @click.stop>发送
          </van-button>
          <van-button v-if="item.contract_status===0" class="btn sign" size="small"
                      @click="sign(item)" @click.stop>签署
          </van-button>
        </div>
      </div>

    </van-list>
    <van-button round type="danger" class="new" @click="showChooseDialog()">新增合同</van-button>
    <van-popup v-model="show" class="popup">
      <div>
        <div class="choose" @click="collect(0,'')">收房</div>
        <div class="line"></div>
        <div class="choose" @click="rent(0,'')">租房</div>
      </div>
    </van-popup>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>

<script>
  export class ContractInfo {
    constructor(type, number) {
      this.type = type;
      this.number = number;
    }
  }

  import {Toast} from 'vant';

  export default {
    name: "eContract",
    components: {Toast},
    data() {
      return {
        list: [],
        searchInfo: '',//搜索内容
        finished: false,
        loading: false,
        type: 1,//1收2租
        show: false,//是否显示收租房弹框
        eurls: globalConfig.e_server,
        page: 1,
        limit: 10,
        totalPages: 1,
        selectHide: false,
        curCustomerList: [],
        curContractNumber: '',
        curContractTitle: '',
        curItem: {},
        columns: [],
        signTypeColumns: [],//签约类型list，如合同、收条
        val: 1  //1收房选择签约类别 如合同、收条 2租房选择签约人
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      onCancel() {
        this.selectHide = false;
      },
      onConfirm(value, index) {
        switch (this.val) {
          case 1://收房选择合同或者收条
            this.signCollect(this.curItem.contract_number, this.curItem.title, this.signTypeColumns[0].fdd_user_id, 1,this.signTypeColumns[0].index);
            break;
          case 2://租房选择租客
            break
        }
        this.selectHide = false;
      },
      getStatusStr(item) {
        let str = '';
        switch (item.contract_status) {
          case 0:
            str = '等待签署';
            break;
          case 1:
            str = '等待重签';
            break;
          case 2:
            str = '已签署';
            break;
          case 3:
            str = '已作废';
            break;
          case 4:
            str = '已归档';
            break;
        }
        return str;
      },
      sign(item) {
        let param = item.param_map;

        let list = [];
        this.signTypeColumns = [];
        this.curItem = item;
        let users = item.electronContractCustomers;

        if (this.type === 1) {//收房
          for (let i = 0; i < users.length; i++) {
            if (users[i].is_signed === '0') {
              this.signTypeColumns.push(users[i]);
              list.push(users[i].index === 1 ? '合同签署' : '收条签署')
            }
          }
          if (this.signTypeColumns.length === 0) {
            return
          }
          this.val = 1;
          this.selectHide = true;
          this.columns = list;

        } else {
          for (let i = 0; i < users.length; i++) {
            this.signTypeColumns.push(users[i]);
            list.push('租客' + i);
          }
          if (this.signTypeColumns.length === 0) {
            return
          }
          this.val = 1;
          this.selectHide = true;
          this.columns = list;
        }
      },
      signCollect(contract_number, title, id, type, index) {
        console.log(index)
        this.$http.post(this.eurls + 'fdd/contract/sign_collect', {
          contract_id: contract_number,
          title: title,
          customer_id: id,
          type: 1,//1发短信 0不发
          index: index
        }, success => {
          if (type === 1) {
            Toast('发送成功!');
          }
        })
      }
      ,
      signRent(contract_number, title, id, type) {
        this.$http.post(this.eurls + 'fdd/contract/sign_rent', {
          contract_id: contract_number,
          title: title,
          customer_id: id,
          type: 1,//1发短信 0不发
        }, success => {
          if (type === 1) {
            Toast('发送成功!');
          }
        })
      }
      ,
      toDetail(item) {
        if (item.contract_status !== 1) {
          return;
        }
        if (this.type === 1) {
          this.collect(1, item.contract_number);
        } else {
          this.rent(1, item.contract_number);
        }
      }
      ,
      onSearch() {
        this.page++;
        this.getData();
      }
      ,
      //更改tab
      changeTab(index, title) {
        this.type = index + 1;
        this.page = 1;
        this.list = [];
        this.finished = false;
        this.getData();
      }
      ,
      //显示选择收租房弹框
      showChooseDialog() {
        this.show = true;
      }
      ,
      //添加收房合同
      collect(type, number) {
        sessionStorage.setItem('contract_type', type || 0);
        sessionStorage.setItem('contract_number', number || '');
        this.$router.push('/newCollectContract');//type 0为新签 1为作废重签 2为读草稿
      }
      ,
      //添加租房合同
      rent(type, number) {
        sessionStorage.setItem('contract_type', type || 0);
        sessionStorage.setItem('contract_number', number || '');
        this.$router.push('/newRentContract');//type 0为新签 1为作废重签 2为读草稿
      }
      ,
      getData() {
        if (this.page > this.totalPages) return;
        this.loading = true;
        let per = JSON.parse(sessionStorage.personal);
        let staff_id = per.id;
        let app = this;
        this.$http.get(this.eurls + 'fdd/contract/index?staff_id=' + staff_id + '&page=' + this.page + '&limit=' + this.limit + "&type=" + this.type).then(res => {
          app.loading = false;
          if (res.data.code === '40001') {
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
            app.list = app.list.concat(res.data.data.data);
          }
        })
      }
      ,
      send(item) {

      }
    }
  }
</script>

<style scoped lang="scss">
  .new {
    position: fixed;
    bottom: 4em;
    left: 40%;
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
      margin-left: 1em;
    }

    .title {
      font-size: 1em;
      margin-bottom: .5em;
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
