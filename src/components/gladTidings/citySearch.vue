<template>
  <div id="searchCity">
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @cancel="onCancel"/>
      <div class="notData" v-if="lists.length === 0">请输入搜索内容</div>
      <div class="searchContent">
        <div class="searchList" v-for="key in lists" @click="village(key)">
          <div>{{key.village_name}}</div>
          <div>
            <p>{{key.province_name}}-{{key.city_name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "city-search",
    data() {
      return {
        urls: globalConfig.server,
        searchValue: '',          //搜索
        city_id: '',
        lists: [],
        path: '',
      }
    },
    mounted() {
      this.city_id = this.$route.query.city;
    },
    activated() {
      this.routerIndex(this.path);
      this.lists = [];
      this.searchValue = '';
      this.city_id = this.$route.query.city;
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
          this.onSearch(value);
        } else {
          this.close_();
        }
      }
    },
    methods: {
      onSearch(val) {
        if (this.searchValue.length > 1) {
          this.$http.get(this.urls + 'setting/community/', {
            params: {
              num: 30,
              city: this.city_id,
              keywords: val,
            }
          }).then((res) => {
            if (this.searchValue !== '') {
              this.lists = res.data.data.list;
            } else {
              this.close_();
            }
          })
        }
      },
      village(data) {
        this.$router.replace({path: this.path, query: {city: JSON.stringify(data)}});
      },
      onCancel() {
        this.$router.replace({path: this.path});
      },
      close_() {
        this.searchValue = '';
        this.lists = [];
      },
    },
  }
</script>

<style lang="scss">

</style>
