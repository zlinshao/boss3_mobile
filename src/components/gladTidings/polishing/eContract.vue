<template>
  <div id="eContract">
    <van-search
      v-if="false"
      v-model="searchInfo"
      placeholder="地址/房东/租客"
      show-action
      shape="round"
      @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <van-tabs @click="changeTab" style="position: fixed;top: 0;z-index: 1000;width: 100%;">
      <van-tab title="收房"></van-tab>
      <van-tab title="租房"></van-tab>
    </van-tabs>
    <van-pull-refresh v-model="isRefresh" @refresh="refresh" style="margin-bottom: 4em;margin-top: 3em;">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onSearch">
        <van-cell v-for="(item,index) in list" class="list" :key="index" @click="toDetail(item)">
          <div class="infoParent">
            <span class="owner" style="font-size:.8em;color: #e4393c;position: absolute;right: 1.2em;top: .5em">{{getStatusStr(item)}}</span>
            <div class="title">
              提交时间:
              {{item.create_time}}
            </div>
            <div class="title">
              合同编号:
              {{item.contract_number}}
            </div>
            <span class="title">
            房屋地址:
            {{type===1?item.param_map.house!==undefined?item.param_map.house.name:'':item.param_map.address}}
          </span>
            <div class="owner">{{'客户：'+getName(item,index)}} <span class="owner" style="color: #e4393c;">({{getContractType(item)}})</span>
            </div>
          </div>
          <div class="btnParent">
            <van-button v-if="item.contract_status===0" class="btn sign signBtn" size="small"
                        @click="sign(item)" @click.stop>签署
            </van-button>
            <van-button v-if="item.contract_status===0" class="btn send signBtn" size="small"
                        @click="send(item)" @click.stop>发送
            </van-button>
            <van-button v-if="item.contract_status===1" class="btn sign signBtn" size="small"
                        @click="toDetail(item)" @click.stop>修改
            </van-button>
            <van-button v-if="item.contract_status===2" class="btn send signBtn" size="small"
                        @click="sendAgain(item)" @click.stop>再次发送
            </van-button>
          </div>
        </van-cell>

      </van-list>
    </van-pull-refresh>
    <div class="bottomButton">
      <div class="new" @click="showChooseDialog()">新增合同</div>
      <div class="lookModel" @click="lookContractModels()">查看模板</div>
    </div>
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

  import {Toast, Dialog} from 'vant';

  export default {
    name: "eContract",
    components: {Toast},
    activated() {
      this.routerIndex('');
      this.ddRent('');
      Toast.loading({
        mask: true,
        duration: 0,
        message: '加载中...'
      });
      if (sessionStorage.getItem('isRefreshList') === 'true') {
        sessionStorage.setItem('isRefreshList', 'no');
        this.page = 1;
        this.totalPages = 1;
      }
      this.getData();
    },
    data() {
      return {
        isRefresh: false,
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
        isSendMsg: 0,//2不发短信 1发短信
      }
    },
    mounted() {
      Dialog.alert({
        title: '警告',
        className: 'messageRed',
        message: '特别提示：乙方不得将租金、服务费、押金、水电燃气等与房屋租赁相关的费用以现金形式直接交给经办人员个人或转至经办人个人账户，否则视为未支付，需自行承担可能的钱财损失。'
      }).then(() => {
        // on close
      });

    },
    methods: {
      lookContractModels() {
        this.$router.push('/contractModels');
      },
      //已签署的合同再次发送
      sendAgain(item) {
        if (this.type === 1) {
          this.sign(item.id, item.param_map.signer.fadada_user_id)
        } else {
          for (let i = 0; i < item.param_map.customer_info.length; i++) {
            this.sign(item.id, item.param_map.customer_info[i].fadada_user_id)
          }
        }
      },
      sign(contractId, fadada_user_id) {
        this.$http.get(this.eurls + 'fdd/contract/send/' + contractId + '?fdd_user_id=' + fadada_user_id).then(res => {
          Toast(res.data.msg);
        }).catch(e => {
          Toast('发送失败');
        });
      },
      getName(item, index) {
        if (this.type === 1) {//收
          return item.param_map.signer === undefined ? '' : item.param_map.signer.name;
        } else {
          let customers = item.param_map.customer_info;
          let names = '';
          if (customers === undefined) return '';
          for (let i = 0; i < customers.length; i++) {
            names = names + ' ' + customers[i].name === undefined ? '' : customers[i].name;
          }
          return names;
        }
      },
      onCancel() {
        this.selectHide = false;
      },
      onConfirm(value, index) {
        switch (this.type) {
          case 1://收房选择合同或者收条
            this.signCollect(this.curItem.contract_number, this.curItem.title, this.signTypeColumns[index].fdd_user_id, this.isSendMsg, this.signTypeColumns[index].index);
            break;
          case 2://租房选择租客
            this.signRent(this.curItem.contract_number, this.curItem.title, this.signTypeColumns[index].fdd_user_id, this.isSendMsg, this.signTypeColumns[index].index);
            break
        }
        this.selectHide = false;
      },
      getContractType(item) {
        if (this.type === 1) {
          return item.param_map.type === '1' ? '新收' : '续收';
        } else {
          let str = '';
          switch (item.param_map.type) {
            case '0':
              str = '未收先租确定';
              break;
            case '1':
              str = '新租';
              break;
            case '2':
              str = '转租';
              break;
            case '3':
              str = '续租';
              break;
            case '5':
              str = '调租';
              break;
          }
          return str;
        }
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
      send(item) {//发送短信给房东租客签约
        this.isSendMsg = 1;
        this.signNow(item);
      },
      sign(item) {//在本机签约
        this.isSendMsg = 2;
        this.signNow(item)
      },
      signNow(item) {
        let list = [];
        this.signTypeColumns = [];
        this.curItem = item;
        let users = item.electron_contract_customers;

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
          console.log(users)
          for (let i = 0; i < users.length; i++) {
            this.signTypeColumns.push(users[i]);
            if (users[i].customer.name !== null) {
              list.push(users[i].customer.name);
            } else {
              list.push('租客' + (i + 1));
            }
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
        this.$http.post(this.eurls + 'fdd/contract/sign_collect', {
          contract_id: contract_number,
          title: title,
          customer_id: id,
          type: type,//1发短信 0不发
          index: index
        }).then(res => {
          if (res.data.code === '40000') {
            if (type === 1) {
              Toast('发送成功!');
            } else {
              location.href = res.data.data.data;
            }
          } else {
            Toast(res.data.msg);
          }
        })
      }
      ,
      signRent(contract_number, title, id, type, index) {
        this.$http.post(this.eurls + 'fdd/contract/sign_rent', {
          contract_id: contract_number,
          title: title,
          index: index,
          customer_id: id,
          type: type,//1发短信 0不发
        }).then(res => {
          if (res.data.code === '40000') {
            if (type === 1) {
              Toast('发送成功!');
            } else {
              location.href = res.data.data.data;
            }
          } else {
            Toast(res.data.msg);
          }
        })
      }
      ,
      toDetail(item) {
        if (item.contract_status !== 1) {
          return
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
      refresh() {
        this.page = 1;
        this.totalPages = 1;
        this.finished = false;
        this.getData();
      },
      //添加收房合同
      collect(type, number) {
        sessionStorage.setItem('contract_type', type || 0);
        sessionStorage.setItem('contract_number', number || '');
        this.$router.push('/newCollectContract');//type 0为新签 1为作废重签
      }
      ,
      //添加租房合同
      rent(type, number) {
        sessionStorage.setItem('contract_type', type || 0);
        sessionStorage.setItem('contract_number', number || '');
        this.$router.push('/newRentContract');//type 0为新签 1为作废重签
      }
      ,
      getData() {
        if (this.page > this.totalPages) return;
        this.loading = true;
        let per = JSON.parse(sessionStorage.personal);
        let staff_id = per.id;
        let app = this;
        let curPage = this.page;
        this.$http.get(this.eurls + 'fdd/contract/index?staff_id=' + staff_id + '&page=' + this.page + '&limit=' + this.limit + "&type=" + this.type).then(res => {
          app.loading = false;
          app.isRefresh = false;
          Toast.clear();
          this.page = curPage;
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
          if (this.page === totalPages) {
            app.finished = true;
          } else {
            app.finished = false;
          }
          if (this.page === 1) {
            app.list = res.data.data.data;
          } else {
            app.list = app.list.concat(res.data.data.data);
          }
        }).catch(e => {
          this.page = curPage;
          app.loading = false;
          app.isRefresh = false;
          Toast.clear();
        })
      }

    }
  }
</script>

<style lang="scss">
  /*.messageRed {*/
  /*.van-dialog__message--has-title {*/
  /*color: red;*/
  /*.van-dialog__header{*/
  /**/
  /*}*/
  /*}*/
  /*}*/

  #eContract {
    .bottomButton {
      display: flex;
      position: fixed;
      bottom: 0em;
      width: 100%;
      align-items: center;
      .new {
        flex: 1;
        height: 3em;
        line-height: 3em;
        background-color: #1989FA;
        text-align: center;
        color: white;
      }
      .lookModel {
        flex: 1;
        height: 3em;
        line-height: 3em;
        background-color: #ff6666;
        text-align: center;
        color: white;
      }
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
      position: relative;
      margin-top: 10px;
      width: 100%;
      padding-top: 1em;
      padding-bottom: 1em;
      display: flex;
      align-items: center;
      background-color: white;

      .infoParent {
        width: 100%;
        margin-left: 1em;
      }

      .title {
        font-size: .8em;
        margin-top: .5em;
        margin-bottom: .5em;
      }

      .owner {
        margin-top: .8em;
        font-size: .8em;
      }

      .btnParent {
        position: absolute;
        right: 1em;
        bottom: 1em;

        .signBtn {
          border-radius: 5px;
        }

        .btn {

        }

        .sign {

        }

        .send {

        }
      }
    }
  }
</style>
