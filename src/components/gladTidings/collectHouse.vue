<template>
  <div id="houseSearch">
    <div class="searchCustom">
      <div>
        <i class="van-icon van-icon-search"></i>
        <input type="text" v-model="searchValue" @keyup.enter="onSearch()">
        <i v-if="searchValue.length > 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
      </div>
      <p class="searchP" v-if="searchValue.length > 0" @click="onSearch()">搜索</p>
      <p class="cancelP" v-if="searchValue.length === 0" @click="onCancel">取消</p>
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
            <div class="contractB" :class="{'departB': types ===  'lord' || types ===  'lord1'}">
              <p>
                <span>所属部门：</span>
                <span>{{key.department_name}}</span>
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
</template>

<script>
  export default {
    name: "house-search",
    data() {
      return {
        urls: globalConfig.server,
        types: '',
        path: '',
        state: 0,
        isGetMore: true,          //滑动触发加载
        isLastPage: false,        //是否最后一页
        scrollHeight: 0,          //滚动到最底部
        last_page: 1,
        params: {},
        searchValue: '',
        end_type: '',

        showInfo: [],
        houseList: [],

        contractStatus: {0: '未确定', 1: '未签约', 2: '已签约', 3: '快到期(60天内)', 4: '已结束', 5: '已过期'},
        contractColor: {0: '#87AA97', 1: '#F067E0', 2: '#30CF5C', 3: '#FF6700', 4: '#409EFF', 5: '#F00000'},
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.routerIndex(from.path, 'house');
        vm.ddRent(from.path, 'house');
      })
    },
    activated() {
      this.types = this.$route.query.type;
      this.end_type = this.$route.query.end_type;
      this.resetting();
      this.state = 0;
      this.params = {};
      this.searchValue = '';
      this.params.q = '';
      this.params.mobile = 1;
      this.params.invalid_status = 3;
      if (this.types === 'is_nrcy') {
        this.params.is_nrcy = 1;
      } else {
        if (this.types !== 'report') {
          this.params.is_nrcy = 0;
        }
      }
      this.checkScroll();
    },
    watch: {
      searchValue(val) {
        let value = val.replace(/\s+/g, '');
        this.params.q = value;
        if (value === '') {

        }
      },
    },
    methods: {
      // 滚动条
      checkScroll() {
        let mainHeight = $('body').height() - 100;
        let mainContent = $('.mainContent');
        mainContent.scrollTop(0);
        mainContent.css('height', mainHeight + 'px');
        let _this = this;
        mainContent.scroll(function () {
          _this.scroll_bar();
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
      sureRouter(path, key) {
        key.type = this.types;
        key.house = JSON.stringify(key);
        this.routLink(path, key);
      },
      onSearch() {
        if (this.searchValue !== '') {
          this.resetting();
          this.getData(this.params, this.types);
        }
      },
      getData(val, type) {
        let url = 'coreproject/houses';
        this.finish(1);
        this.$http.get(this.urls + url, {
          params: val,
        }).then((res) => {
          if (res.data.status === 'success') {
            let data = res.data.data;
            this.last_page = res.data.meta.last_page;
            this.isLastPage = this.params.page === res.data.meta.last_page;
            if (data.length !== 0) {
              for (let i = 0; i < data.length; i++) {
                if (type === 'allHouse') {
                  if (data[i].lords.length === 0 && data[i].renters.length === 0) {
                    let list = {};
                    this.showInfo.push(data[i].id);
                    list.house_id = data[i].id;
                    list.house_name = data[i].name;
                    if (data[i].house_res) {
                      list.house_res = data[i].house_res;
                    } else {
                      list.house_res = {};
                    }
                    this.houseList.push(list);
                    this.finish(4);
                  }
                  if (data[i].lords.length !== 0) {
                    this.lord(data[i], type);
                  } else {
                    this.finish(2);
                  }
                  if (data[i].renters.length !== 0) {
                    this.renter(data[i], type);
                  } else {
                    this.finish(2);
                  }
                }
                if (type === 'quality' && data[i].house_res) {
                  let list = {};
                  this.showInfo.push(data[i].id);
                  list.house_id = data[i].id;
                  list.house_name = data[i].name;
                  list.house_res = data[i].house_res;
                  this.houseList.push(list);
                  this.finish(4);
                }
                if ((type === 'lord' || type === '') && data[i].lords.length !== 0) {
                  this.lord(data[i], type);
                } else {
                  this.finish(2);
                }
                if ((type === 'renter' || type === 'is_nrcy' || type === 'report') && data[i].renters.length !== 0) {
                  this.renter(data[i], type);
                } else {
                  this.finish(2);
                }
                if (type === 'lord1' && data[i].lords.length !== 0) {
                  this.agencyLord(data[i], type);
                } else {
                  this.finish(2);
                }
                if (type === 'renter1' && data[i].renters.length !== 0) {
                  this.agencyRent(data[i], type);
                } else {
                  this.finish(2);
                }
                if (type === '' && data[i].lords.length === 0 && data[i].renters.length === 0) {
                  let list = {};
                  this.showInfo.push(data[i].id);
                  list.house_id = data[i].id;
                  list.house_name = data[i].name;
                  if (data[i].house_res) {
                    list.is_agency = data[i].house_res.is_agency;
                  } else {
                    list.is_agency = 0;
                  }
                  this.houseList.push(list);
                  this.finish(4);
                }
                if (type !== 'quality' && data[i].lords.length === 0 && data[i].renters.length === 0) {
                  this.finish(2);
                }
              }
            } else {
              this.finish(2);
            }
          } else {
            this.finish(2);
          }
        });
      },
      // 中介费收
      agencyLord(val, type) {
        for (let j = 0; j < val.lords.length; j++) {
          if (!val.lords[j].end_type || this.end_type === 'none') {
            if (val.lords[j].is_agency === 1) {
              this.contracts(val, type, val.lords[j]);
            } else {
              this.finish(2);
            }
          }
        }
      },
      // 中介费租
      agencyRent(val, type) {
        for (let j = 0; j < val.renters.length; j++) {
          if (!val.renters[j].end_type || this.end_type === 'none') {
            if (val.renters[j].is_agency === 1) {
              this.contracts(val, type, val.renters[j]);
            } else {
              this.finish(2);
            }
          }
        }
      },
      // 收房合同
      lord(val, type) {
        for (let j = 0; j < val.lords.length; j++) {
          if (!val.lords[j].end_type || this.end_type === 'none') {
            this.contracts(val, type, val.lords[j]);
          }
        }
      },

      // 租房合同
      renter(val, type) {
        for (let j = 0; j < val.renters.length; j++) {
          if (!val.renters[j].end_type || this.end_type === 'none') {
            this.contracts(val, type, val.renters[j]);
          }
        }
      },
      contracts(val, type, value) {
        let list = {};
        if (type === 'is_nrcy') {
          list.renters = value;
        } else {
          list.renters = {};
        }
        list.house_id = val.id;
        list.house_name = val.name;
        list.house_type = val.room + '室' + val.hall + '厅' + val.toilet + '卫';
        list.created_at = val.created_at.substring(0, 10);
        if (type === 'lord' || type === 'lord1') {
          list.end_at = value.end_at;
        } else {
          list.end_at = '';
        }
        list.id = value.id;
        list.agency_info = value.agency_info;
        list.is_agency = value.is_agency;
        if (value.sign_month !== null && value.sign_month !== undefined) {
          list.month = value.sign_month;
        } else {
          list.month = '';
        }
        if (type === 'report') {
          list.mortgage_price = value.mortgage_price;
        }
        if (value.property_price) {
          list.property_price = value.property_price;
        } else {
          list.property_price = '';
        }
        list.start_at = value.start_at;
        list.album = value.album;
        list.status = value.status !== null ? value.status : 0;
        list.front_money = value.front_money ? value.front_money : '';
        list.duration_days = value.duration_days;
        if (value.customers.length !== 0) {
          list.customers = value.customers[0].name;
          list.cusPhone = value.customers[0].phone;
        } else {
          if (value.customer_info !== null && value.customer_info.length !== 0) {
            list.customers = value.customer_info[0].name;
            list.cusPhone = value.customer_info[0].phone;
          } else {
            list.customers = '---';
            list.cusPhone = '';
          }
        }
        if (value.sign_user !== null) {
          list.staff_id = value.sign_user.id;
          list.staff_name = value.sign_user.name;
        } else {
          list.staff_id = '';
          list.staff_name = '---';
        }
        if (value.sign_org !== null) {
          list.department_id = value.sign_org.id;
          list.department_name = value.sign_org.name;
        } else {
          list.department_id = '';
          list.department_name = '---';
        }
        console.log(val);
        console.log(type);
        if (val.house_res) {
          sessionStorage.setItem('house_res', JSON.stringify(val.house_res));
        } else {
          list.house_res = {};
        }
        this.houseList.push(list);
        this.finish(4);
      },
      // 取消
      onCancel() {
        this.routLink('back');
      },
      finish(val) {
        this.state = val;
      },
      resetting() {
        let mainContent = $('.mainContent');
        mainContent.scrollTop(0);
        this.scrollHeight = 0;
        this.params.page = 1;
        this.params.per_page_number = 20;
        this.showInfo = [];
        this.houseList = [];
        this.isGetMore = true;
        this.isLastPage = false;
      },
      distinct(arr) {
        let result = [], i, j, len = arr.length;
        for (i = 0; i < len; i++) {
          for (j = i + 1; j < len; j++) {
            if (arr[i] === arr[j]) {
              j = ++i;
            }
          }
          result.push(arr[i]);
        }
        return result;
      }
    },
  }
</script>

<style lang="scss">
  #houseSearch {
    $bodyBg: #F8F8F8;
    $colorF: #FFFFFF;
    $colorEA: #eaeaea;
    $color9c: #9c9c9c;
    @mixin flex($n) {
      display: flex;
      display: -webkit-flex;

      @if $n == 'centerSpace' {
        align-items: center;
        -webkit-align-items: center;
        justify-content: space-between;
        -webkit-justify-content: space-between;
      }
      @if $n == 'center' {
        align-items: center;
        -webkit-align-items: center;
        justify-content: center;
        -webkit-justify-content: center;
      }
      @if $n == 'itemCenter' {
        align-items: center;
        -webkit-align-items: center;
      }
      @if $n == 'spaceCenter' {
        justify-content: center;
        -webkit-justify-content: center;
      }
      @if $n == 'space' {
        justify-content: space-between;
        -webkit-justify-content: space-between;
      }
    }
    @mixin radius($n) {
      -webkit-border-radius: $n;
      -moz-border-radius: $n;
      border-radius: $n;
    }
    input {
      border: none;
    }
    .contract {
      padding: .1rem 0 .2rem;
      border-bottom: 1px solid $colorEA;
      @include flex('itemCenter');
      flex-wrap: wrap;
      div {
        @include flex('');
        width: 100%;
        span:first-of-type {
          color: $color9c;
        }
      }
      .contractB {
        p {
          width: 100%;
        }
      }
      .departB {
        p {
          width: 50%;
        }
      }
    }
    .searchCustom {
      background-color: $bodyBg;
      padding: .2rem .3rem;
      @include flex('centerSpace');
      i {
        padding-right: .18rem;
      }
      div {
        background-color: $colorF;
        @include flex('centerSpace');
        @include radius(6px);
        padding: .06rem .2rem;
        width: 100%;
        input {
          width: 100%;
        }
      }
      p {
        text-align: right;
        min-width: .88rem;
      }
      .searchP {
        color: #666666;
      }
      .cancelP {
        color: #06bf04;
      }
    }

    .mainContent {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      background-color: $colorF;
      .mainList {
        padding: .2rem 0 0 .32rem;
        .contract {
          color: #555555;
          div {
            padding-top: .1rem;
          }
        }
        .staffDepart {
          padding: .18rem .3rem .18rem 0;
          @include flex('space');
        }
      }
    }

    .notData {
      text-align: center;
      padding: .2rem;
      color: #b3afaf;
      font-size: .33rem;
      @include flex('center');
    }
    .bgColor {
      padding: .33rem;
      background-color: #F8F8F8;
    }
  }

</style>
