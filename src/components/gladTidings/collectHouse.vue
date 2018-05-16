<template>
  <div id="searchClass">
    <div class="searchClass">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue" @keyup.enter="search">
          <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p v-if="searchValue.length > 0" @click="search" style="color: #666666;">搜索</p>
        <p v-else @click="onCancel">取消</p>
      </div>
      <div class="searchContent">
        <ul
          v-waterfall-lower="loadMore"
          waterfall-disabled="disabled"
          waterfall-offset="300">
          <li>
            <div class="searchHouse" v-for="key in lists" @click="houseAddress(key)">
              <div class="contract" v-if="showInfo.indexOf(key.house_id) > -1">
                <div>
                  <span>房屋地址：</span>
                  <span>{{key.house_name}}</span>
                </div>
              </div>
              <div class="contract" v-else>
                <div>
                  <span>房屋地址：</span>
                  <span>{{key.house_name}}</span>
                </div>
                <div>
                  <span>合同状态：</span>
                  <span :style="{'color': contractColor[key.status]}">
                {{contractStatus[key.status]}}
              </span>
                </div>
                <div class="two">
                  <p><span>报备时间：</span><span>{{key.created_at}}</span></p>
                  <p><span>签约时长：</span><span>{{key.duration_days}}</span></p>
                </div>
                <div class="two">
                  <p><span>开单人：</span><span>{{key.staff_name}}</span></p>
                  <p><span>客户姓名：</span><span>{{key.customers}}</span></p>
                </div>
                <div class="two" style="line-height: .4rem">
                  <p><span>所属部门：</span><span>{{key.department_name}}</span></p>
                  <p v-if="key.end_at !== ''"><span>结束时间：</span><span>{{key.end_at}}</span></p>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="notData" style="line-height: .46rem" v-if="lists.length === 0 && showDetail === 0">输入搜索内容结束后<br>请点击「回车」或搜索按钮</div>
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 2">暂无相关信息</div>
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 1">
          <van-loading type="spinner" color="black"/>
        </div>

        <div class="bottom">
          <div class="abc" v-if="disabled && this.lists.length > 5">没有更多了</div>

          <div class="abc" v-if="!disabled && this.lists.length !== 0">
            <van-loading type="spinner" color="black"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';

  export default {
    name: "collect-house",
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper'),
    },
    data() {
      return {
        showDetail: 0,
        disabled: true,
        page: 1,
        address: globalConfig.server_user,
        searchValue: '',          //搜索
        lists: [],
        params: {},
        types: '',
        path: '',
        showInfo: [],
        contractStatus: {0: '未确定', 1: '未签约', 2: '已签约', 3: '快到期(60天内)', 4: '已结束', 5: '已过期'},
        contractColor: {0: '#87AA97', 1: '#F067E0', 2: '#30CF5C', 3: '#FF6700', 4: '#409EFF', 5: '#F00000'},
      }
    },
    activated() {
      this.close_();
      this.types = this.$route.query.type;
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.routerIndex(from.path, 'house');
        vm.ddRent(from.path, 'house');
      })
    },
    watch: {
      searchValue(val) {
        let value = val.replace(/\s+/g, '');
        this.searchValue = value;
        if (value !== '') {
          // this.disabled = false;
          // this.page = 1;
          // this.lists = [];
          // this.onSearch(this.types, value);
        } else {
          this.close_();
        }
      }
    },
    methods: {
      search() {
        this.disabled = false;
        this.page = 1;
        this.lists = [];
        this.showInfo = [];
      },
      loadMore() {
        if (!this.disabled) {
          this.onSearch(this.types, this.searchValue, this.page);
          this.page++;
        }
      },
      // 搜索
      onSearch(type, val, page) {
        let urls;
        this.params = {};
        switch (type) {
          case 'is_nrcy':
            this.params.page = page;
            this.params.per_page_number = 20;
            this.params.is_nrcy = 1;
            this.params.q = val;
            urls = 'houses';
            break;
          default:
            this.params.page = page;
            this.params.per_page_number = 20;
            this.params.q = val;
            urls = 'houses';
        }
        if (val !== '') {
          this.showDetail = 1;
          this.myData(type, val, urls);
        }
      },
      myData(type, val, urls) {
        this.$http.get(this.address + urls, {
          params: this.params,
        }).then((res) => {
          if (this.searchValue !== '') {
            let data = res.data.data;
            if (data.length !== 0 && res.data.status === 'success') {
              for (let i = 0; i < data.length; i++) {
                if ((type === 'lord' || type === '') && data[i].lords.length !== 0) {
                  this.lord(data[i], type);
                }
                if ((type === 'renter' || type === 'is_nrcy') && data[i].renters.length !== 0) {
                  this.renter(data[i], type);
                }
                if (type === 'lord1' && data[i].lords.length !== 0) {
                  this.lord1(data[i], type);
                }
                if (type === 'renter1' && data[i].renters.length !== 0) {
                  this.renter1(data[i], type);
                }
                if (type === '' && data[i].lords.length === 0 && data[i].renters.length === 0) {
                  let list = {};
                  this.showInfo.push(data[i].id);
                  list.house_id = data[i].id;
                  list.house_name = data[i].name;
                  list.is_agency = data[i].house_res.is_agency;
                  this.lists.push(list);
                }
                if ((type === 'renter' || type === 'lord' || type === 'renter1' || type === 'lord1') && data[i].lords.length === 0 && data[i].renters.length === 0) {
                  this.showDetail = 2;
                }
              }
            } else {
              this.disabled = true;
            }
            if (data.length === 0 && this.params.page === 1 && res.data.status === 'success') {
              this.showDetail = 2;
            }
            if (res.data.status === 'fail') {
              this.showDetail = 2;
            }
          } else {
            this.disabled = true;
            this.close_();
          }
        })
      },
      // 中介费收
      lord1(val, type) {
        for (let j = 0; j < val.lords.length; j++) {
          if (val.lords[j].is_agency === 1) {
            this.contracts(val, type, val.lords[j]);
          }
        }
      },
      // 中介费租
      renter1(val, type) {
        for (let j = 0; j < val.renters.length; j++) {
          if (val.renters[j].is_agency === 1) {
            this.contracts(val, type, val.renters[j]);
          }
        }
      },
      // 收房合同
      lord(val, type) {
        for (let j = 0; j < val.lords.length; j++) {
          this.contracts(val, type, val.lords[j]);
        }
      },

      // 租房合同
      renter(val, type) {
        for (let j = 0; j < val.renters.length; j++) {
          this.contracts(val, type, val.renters[j]);
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
        list.house_type = (Number(val.room) + 1) + '室' + val.hall + '厅' + val.toilet + '卫';
        list.created_at = val.created_at.substring(0, 10);
        if (type === 'lord' || type === 'lord1') {
          list.end_at = value.end_at;
        } else {
          list.end_at = '';
        }
        list.id = value.id;
        list.agency_info = value.agency_info;
        list.is_agency = value.is_agency;
        list.status = value.status !== null ? value.status : 0;
        list.duration_days = value.duration_days;
        if (value.customers.length !== 0) {
          list.customers = value.customers[0].name;
        } else {
          list.customers = '';
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
        this.lists.push(list);
        this.showDetail = 2;
      },

      // 房屋地址
      houseAddress(data) {
        this.close_();
        this.$router.replace({
          path: this.path,
          query: {house: JSON.stringify(data), type: this.types}
        });
      },
      close_() {
        this.showDetail = 0;
        this.lists = [];
        this.page = 1;
        this.searchValue = '';
      },
      // select关闭
      onCancel() {
        this.close_();
        this.$router.replace({path: this.path, query: {house: '', type: this.types}});
      },
    },
  }
</script>

<style lang="scss">
  #searchClass {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    .iconfont.icon-cuowu-guanbi {

    }
    .searchHouse {
      padding: .15rem .3rem;
      border-bottom: .02rem solid #DDDDDD;
      span {
        color: #555555;
      }
      .contract {
        width: 100%;
        div {
          margin: .12rem 0;
        }
        div:first-of-type {
          font-size: .33rem;
          span {
            color: #101010;
          }
        }
        .two {
          @include flex;
          p {
            width: 50%;
          }
          p:not(:first-of-type) {
            padding-left: .2rem;
          }
        }
      }
    }
    .bottom {
      @include flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      color: #DDDDDD;
      .abc {
        @include flex;
        justify-content: center;
        line-height: .4rem;
        color: #aaaaaa;
        text-align: center;
        background-color: #f4f4f4;
        padding: .2rem 0;
        width: 100%;
      }
    }
  }
</style>
