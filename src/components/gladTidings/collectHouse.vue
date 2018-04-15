<template>
  <div>
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @keyup="onSearch(types)"
        @cancel="onCancel"/>

      <div class="searchContent">
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length === 0">请输入搜索内容</div>
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length !== 0">暂无相关信息</div>
        <div class="searchHouse" v-for="key in lists" @click="houseAddress(key)">
          <div class="contract">
            <div>
              <span>房屋地址：</span>
              <span>{{key.house_name}}</span>
            </div>
            <div class="two">
              <p><span>报备时间：</span><span>{{key.created_at}}</span></p>
              <p><span>签约时长：</span><span>{{key.duration_days}}</span></p>
            </div>
            <div class="two">
              <p><span>开单人：</span><span>{{key.staff_name}}</span></p>
              <p><span>客户姓名：</span><span>{{key.customers}}</span></p>
            </div>
            <div><span>所属部门：</span><span>{{key.department_name}}</span></div>
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
      }
    },
    mounted() {
      this.lists = [];
      this.types = this.$route.query.type;

    },
    activated() {
      this.lists = [];
      this.searchValue = '';
      this.types = this.$route.query.type;
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.routerIndex(from.path, 'house');
        vm.ddRent(from.path, 'house');
      })
    },
    methods: {
      // 搜索
      onSearch(type) {
        let value = this.searchValue.replace(/\s+/g, '');
        this.myData(type, value);
        // if (value.length !== 0) {
        //   this.params = {};
        //   switch (val) {
        //     case 'lord':
        //       this.params.report = this.bulletin;
        //       this.params.q = value;
        //       this.myData(val, this.params);
        //       break;
        //     case 'renter':
        //       this.params.report = this.bulletin;
        //       this.params.q = value;
        //       this.myData(val, this.params);
        //       break;
        //     case 'able_type1':
        //       this.params.report = this.bulletin;
        //       this.params.q = value;
        //       this.params.able_type = 1;
        //       this.myData('lord', this.params);
        //       break;
        //     case 'able_type2':
        //       this.params.report = this.bulletin;
        //       this.params.q = value;
        //       this.params.able_type = 1;
        //       this.myData('renter', this.params);
        //       break;
        //   }
        // } else {
        //   this.lists = [];
        // }
      },
      myData(type, val) {
        this.$http.get(this.address + 'houses?q=' + val).then((res) => {
          let data = res.data.data;
          if (data.length !== 0 && res.data.status === 'success') {
            this.lists = [];
            for (let i = 0; i < data.length; i++) {
              if (type === 'lord' && data[i].lords.length !== 0) {
                for (let j = 0; j < data[i].lords.length; j++) {
                  let list = {};
                  list.house_id = data[i].id;
                  list.house_name = data[i].name;
                  list.rooms = data[i].rooms;
                  list.created_at = data[i].created_at.substring(0, 10);
                  list.id = data[i].lords[j].id;
                  list.duration_days = data[i].lords[j].duration_days;
                  list.customers = data[i].lords[j].customers[0].name;
                  if (data[i].lords[j].sign_user !== null) {
                    list.staff_name = data[i].lords[j].sign_user.name;
                  } else {
                    list.staff_name = '---';
                  }
                  if (data[i].lords[j].sign_user !== null) {
                    list.department_name = data[i].lords[j].sign_org.name;
                  } else {
                    list.department_name = '---';
                  }
                  // list.sign_user = data[i].lords[j].sign_user.name;
                  // list.sign_org = data[i].lords[j].sign_org.name;
                  this.lists.push(list);
                }
              } else if (type === 'renter' && data[i].renters.length !== 0) {
                for (let j = 0; j < data[i].renters.length; j++) {
                  let list = {};
                  list.house_id = data[i].id;
                  list.house_name = data[i].name;
                  list.rooms = data[i].rooms;
                  list.created_at = data[i].created_at.substring(0, 10);
                  list.id = data[i].renters[j].id;
                  list.duration_days = data[i].renters[j].duration_days;
                  list.customers = data[i].renters[j].customers[0].name;
                  if (data[i].renters[j].sign_user !== null) {
                    list.staff_name = data[i].renters[j].sign_user.name;
                  } else {
                    list.staff_name = '---';
                  }
                  if (data[i].renters[j].sign_org !== null) {
                    list.department_name = data[i].renters[j].sign_org.name;
                  } else {
                    list.department_name = '---';
                  }
                  // list.sign_user = data[i].renters[j].sign_user.name;
                  // list.sign_org = data[i].renters[j].sign_org.name;
                  this.lists.push(list);
                }
              } else {
                let list = {};
                list.house_id = data[i].id;
                list.house_name = data[i].name;
                this.lists.push(list);
              }
            }
          } else {
            this.lists = [];
          }
        })
      },
      // 房屋地址
      houseAddress(data) {
        this.$router.replace({
          path: this.path,
          query: {house: JSON.stringify(data), type: this.types}
        });
      },
      // select关闭
      onCancel() {
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
        p:last-of-type {
          padding-left: .2rem;
        }
      }
    }
  }
</style>
