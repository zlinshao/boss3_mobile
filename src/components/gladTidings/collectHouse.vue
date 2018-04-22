<template>
  <div>
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @cancel="onCancel"/>

      <div class="searchContent">
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length === 0">请输入搜索内容(至少2位)</div>
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length !== 0">暂无相关信息</div>
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
              <span>{{contractStatus[key.status]}}</span>
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
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "collect-house",
    data() {
      return {
        address: globalConfig.server_user,
        searchValue: '',          //搜索
        lists: [],
        params: {},
        types: '',
        path: '',
        showInfo: [],
        contractStatus: {0: '未确定', 1: '未签约', 2: '已签约', 3: '快到期(60天内)', 4: '已结束', 5: '已过期'},
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
        if (value.length !== 0) {
          this.onSearch(this.types, value);
        } else {
          this.close_();
        }
      }
    },
    methods: {
      // 搜索
      onSearch(type, val) {
        let urls;
        switch (type) {
          case 'is_nrcy':
            urls = 'houses?is_nrcy=1&&per_page_number=50&&q=';
            break;
          default:
            urls = 'houses?per_page_number=50&&q=';
        }
        if (val.length > 1) {
          this.myData(type, val, urls);
        }
      },
      myData(type, val, urls) {
        this.$http.get(this.address + urls + val).then((res) => {
          if (this.searchValue !== '') {
            let data = res.data.data;
            if (data.length !== 0 && res.data.status === 'success') {
              this.lists = [];
              this.showInfo = [];
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
                  this.lists.push(list);
                }
              }
            } else {
              this.lists = [];
            }
          } else {
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
        list.status = value.status !== null ? value.status : 0;
        list.duration_days = value.duration_days;
        list.customers = value.customers[0].name;
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
        this.lists = [];
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
  @mixin flex {
    display: flex;
    display: -webkit-flex;
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
</style>
