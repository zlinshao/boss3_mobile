<template>
  <div>
    <div id="houseSearch">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue" @keyup.enter="onSearch()">
          <i v-if="searchValue !== ''" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p class="searchP" v-if="searchValue !== ''" @click="onSearch()">搜索</p>
        <p class="cancelP" v-if="searchValue === ''" @click="onCancel">取消</p>
      </div>
      <div class="mainContent">
        <div class="mainList">
          <div v-for="key in houseList" @click="sureRouter(path, key)">
            <div class="contract" v-if="showInfo.indexOf(key.house_id) > -1">
              <div class="contractA">
                <span>房屋地址：</span>
                <span>{{key.house_name}}</span>
              </div>
            </div>
            <div class="contract" v-else>
              <div class="contractA">
                <span>房屋地址：</span>
                <span>{{key.house_name}}</span>
              </div>
              <div class="contractA">
                <span>合同状态：</span>
                <span :style="{'color': contractColor[key.status]}">
                  {{contractStatus[key.status]}}
                </span>
              </div>
              <div class="contractB">
                <p>
                  <span>报备时间：</span>
                  <span>{{key.created_at}}</span>
                </p>
                <p>
                  <span>签约时长：</span>
                  <span>{{key.duration_days}}</span>
                </p>
              </div>
              <div class="contractB">
                <p>
                  <span>开单人：</span>
                  <span>{{key.staff_name}}</span>
                </p>
                <p>
                  <span>客户姓名：</span>
                  <span>{{key.customers}}</span>
                </p>
              </div>
              <div class="contractB" :class="{'departB': types.indexOf('lord') > -1}">
                <p>
                  <span>所属部门：</span>
                  <span>{{key.depart_name}}</span>
                </p>
                <p v-if="key.end_at !== ''">
                  <span>结束时间：</span>
                  <span>{{key.end_at}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="notData" v-if="state === 0">输入搜索内容结束后<br>请点击「回车」或搜索按钮</div>
        <div class="notData" v-if="state === 2 && houseList.length < 1">暂无相关信息</div>
        <div class="notData bgColor" v-if="isLastPage && !isGetMore">我是有底线的</div>
        <div class="notData" v-if="state === 1 && params.page < 2">
          <van-loading type="spinner" color="black"/>
        </div>
      </div>
      <footer>
        <div class="notData" v-if="state === 1 && params.page > 1">
          <van-loading type="spinner" color="black"/>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    name: "search-house",
    data() {
      return {
        urls: globalConfig.server,
        params: {},               //搜索条件
        types: '',
        searchValue: '',
        path: '',
        state: 0,                 //搜索结果状态
        showInfo: [],             //质量报备
        houseList: [],            //房屋列表
        isGetMore: true,          //是否触发滑动加载
        scrollHeight: 0,          //滚动到最底部
        isLastPage: false,        //是否最后一页
        last_page: 1,             //最后一页
        contractStatus: {0: '未确定', 1: '未签约', 2: '已签约', 3: '快到期(60天内)', 4: '已结束', 5: '已过期'},
        contractColor: {0: '#87AA97', 1: '#F067E0', 2: '#30CF5C', 3: '#FF6700', 4: '#409EFF', 5: '#F00000'},
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.goBack(from.path);
      })
    },
    mounted() {
    },
    activated() {
      this.checkScroll();
      this.resetting();
      this.searchValue = '';
      this.types = this.$route.query.type;
      this.params.q = '';
      if (this.types === 'rentUn') {
        this.params.is_nrcy = 1;
      } else {
        if (this.types !== 'report') {
          this.params.is_nrcy = 0;
        }
      }
    },
    watch: {
      searchValue(val) {
        this.params.q = val.replace(/\s+/g, '');
      },
    },
    computed: {

    },
    methods: {
      // 滚动条
      checkScroll() {
        let mainHeight = window.screen.height - 100;
        let mainContent = $('.mainContent');
        mainContent.scrollTop(0);
        mainContent.css('height', mainHeight + 'px');
        let that = this;
        mainContent.scroll(function () {
          that.scroll_bar();
        })
      },
      scroll_bar() {
        let mainContent = $('.mainContent');
        let body_height = mainContent.height();
        let body_scrollTop = mainContent.scrollTop();
        let mainList = $('.mainList').height();
        if (this.scrollHeight < mainList) {
          this.isGetMore = true;
        }
        this.scrollHeight = mainList;
        if (mainList - body_scrollTop - body_height < 200) {
          this.getMore();
          this.isGetMore = false;
        }
      },
      // 加载更多
      getMore() {
        if (this.isGetMore && !this.isLastPage) {
          this.params.page++;
          this.getData(this.params, this.types);
        }
      },
      // 搜索
      onSearch() {
        if (this.params.q !== '') {
          this.resetting();
          this.getData(this.params, this.types);
        }
      },
      // 取消
      onCancel() {
        this.routLink(this.path);
      },
      // 确定
      sureRouter(path, key) {
        key.type = this.types;
        this.routLink(path);
        this.$store.dispatch('getSearchDetail', key);
      },
      finish(val) {
        this.state = val;
      },
      getData(params, type) {
        this.finish(1);
        let url = 'coreproject/houses';
        this.$http.get(this.urls + url, {
          params: params,
        }).then(res => {
          if (res.data.status === 'success') {
            let data = res.data.data;
            this.last_page = res.data.meta.last_page;
            this.isLastPage = this.params.page === res.data.meta.last_page;
            if (data.length > 0) {
              for (let item of data) {
                if (item.lords.length > 0 || item.renters.length > 0) {
                  if ((type.indexOf('lord') > -1 && item.lords) || ((type.indexOf('rent') > -1 || type === 'report') && item.renters)) {
                    if (type === 'lordAgency' || type === 'rentAgency') {
                      this.agencyContract(item, type);
                    } else {
                      this.contract(item, type);
                    }
                  }
                } else {
                  if (type === 'quality') {
                    let list = {};
                    this.showInfo.push(item.id);
                    list.house_id = item.id;
                    list.house_name = item.name;
                    if (item.house_res) {
                      list.is_agency = item.house_res.is_agency;
                    } else {
                      list.is_agency = 0;
                    }
                    this.houseList.push(list);
                    this.finish(4);
                  }
                }
              }
            } else {
              this.finish(2);
            }
          } else {
            this.finish(2);
          }
        })
      },
      // 中介费
      agencyContract(data, type) {
        this.finish(2);
        if (type.indexOf('lord') > -1) {
          for (let item of data.lords) {
            if (!item.end_type) {
              if (item.is_agency === 1) {
                this.contracts(data, item, type);
              }
            }
          }
        } else {
          for (let item of data.renters) {
            if (!item.end_type) {
              if (item.is_agency === 1) {
                this.contracts(data, item, type);
              }
            }
          }
        }
      },
      // 收/租 合同
      contract(data, type) {
        this.finish(2);
        if (type.indexOf('lord') > -1) {
          for (let item of data.lords) {
            if (!item.end_type) {
              this.contracts(data, item, type);
            }
          }
        } else {
          for (let item of data.renters) {
            if (!item.end_type) {
              this.contracts(data, item, type);
            }
          }
        }
      },
      // 重组
      contracts(data, res, type) {
        let list = {};
        if (type === 'rentUn') {
          list.renters = res;
        } else {
          list.renters = {};
        }
        list.archievementdata = data.archievementdata;
        list.house_id = data.id;
        list.house_name = data.name;
        list.house_type = data.room + '室' + data.hall + '厅' + data.toilet + '卫';
        list.created_at = data.created_at.substring(0, 10);
        list.house_res = data.house_res ? data.house_res : {};
        list.end_at = type.indexOf('lord') > -1 ? res.end_at : '';
        list.id = res.id;
        list.agency_info = res.agency_info;
        list.is_agency = res.is_agency;
        list.month = res.sign_month ? res.sign_month : '';
        list.mortgage_price = res.mortgage_price;
        list.property_price = res.property_price ? res.property_price : '';
        list.start_at = res.start_at;
        list.album = res.album;
        list.status = res.status ? res.status : 0;
        list.duration_days = res.duration_days;
        if (res.customers.length > 0) {
          list.customers = res.customers[0].name;
          list.cusPhone = res.customers[0].phone;
        } else {
          if (res.customer_info.length > 0) {
            list.customers = res.customer_info[0].name;
            list.cusPhone = res.customer_info[0].phone;
          } else {
            list.customers = '---';
            list.cusPhone = '';
          }
        }
        if (res.sign_user) {
          list.staff_id = res.sign_user.id;
          list.staff_name = res.sign_user.name;
        } else {
          list.staff_id = '';
          list.staff_name = '---';
        }
        if (res.sign_org) {
          list.depart_id = res.sign_org.id;
          list.depart_name = res.sign_org.name;
        } else {
          list.depart_id = '';
          list.depart_name = '---';
        }
        this.houseList.push(list);
        this.finish(4);
      },
      resetting() {
        let mainContent = $('.mainContent');
        mainContent.scrollTop(0);
        this.state = 0;
        this.scrollHeight = 0;
        this.params.page = 1;
        this.params.mobile = 1;
        this.params.invalid_status = 3;
        this.params.per_page_number = 20;
        this.showInfo = [];
        this.houseList = [];
        this.isGetMore = true;
        this.isLastPage = false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/common.scss';

</style>
