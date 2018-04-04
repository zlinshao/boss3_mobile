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
        <div class="searchList" v-for="key in lists" @click="houseAddress(key)">
          <div>{{key.house_name}}</div>
          <div>
            <p>{{key.department_name}}</p>
            <span>{{key.staff_name}}</span>
            <!--<span v-if="key.customer !== ''">-{{key.customer}}</span>-->
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
        formDetail: {},
        types: '',
        path: '',
      }
    },
    mounted() {
      this.types = this.$route.query.type;
      this.bulletin = this.$route.query.bulletin;
    },
    activated() {
      this.lists = [];
      this.searchValue = '';
      this.formDetail = {};
      this.types = this.$route.query.type;
      this.bulletin = this.$route.query.bulletin;
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
      onSearch(val) {
        let value = this.searchValue.replace(/\s+/g, '');
        if (value.length !== 0) {
          this.params = {};
          switch (val) {
            case 'lord':
              this.params.report = this.bulletin;
              this.params.q = value;
              this.myData(val, this.params);
              break;
            case 'renter':
              this.params.report = this.bulletin;
              this.params.q = value;
              this.myData(val, this.params);
              break;
            case 'able_type1':
              this.params.report = this.bulletin;
              this.params.q = value;
              this.params.able_type = 1;
              this.myData('lord', this.params);
              break;
            case 'able_type2':
              this.params.report = this.bulletin;
              this.params.q = value;
              this.params.able_type = 1;
              this.myData('renter', this.params);
              break;
          }
        } else {
          this.lists = [];
        }
      },
      myData(urls, val) {
        this.$http.get(this.address + urls, {
          params: val,
        }).then((res) => {
          this.lists = [];
          let data = res.data.data;
          if (data.length !== 0 && res.data.status === 'success') {
            this.lists = [];
            for (let i = 0; i < data.length; i++) {
              let list = {};
              list.id = data[i].id;
              list.house = data[i].house;
              list.house_name = data[i].house.name;
              list.house_id = data[i].house.id;

              list.staff_name = data[i].sign_user.name;
              list.department_name = data[i].sign_org.name;

              list.mortgage_price = data[i].mortgage_price;
              list.month_price = data[i].month_price;
              // for(let j=0;j<data[i].month_price.length;i++){
              //
              // }
              list.pay_way = data[i].pay_way;
              // for(let j=0;j<data[i].pay_way.length;i++){
              //
              // }
              this.lists.push(list);
            }
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

</style>
