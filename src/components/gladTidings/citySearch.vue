<template>
  <div id="searchCity">
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @keyup="onSearch"
        @cancel="onCancel"/>
      <div class="notData" v-if="lists.length === 0">请输入搜索内容</div>
      <div class="searchContent">
        <div class="searchList" v-for="key in lists" @click="village(key.village_name, key.id)">
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
    methods: {
      onSearch() {
        if (this.searchValue.length > 1) {
          this.$http.get(this.urls + 'setting/community/', {
            params: {
              num: 30,
              city: this.city_id,
              keywords: this.searchValue,
            }
          }).then((res) => {
            this.lists = res.data.data.list;
          })
        }
      },
      village(name, id) {
        let data = {};
        data.name = name;
        data.id = id;
        this.$router.replace({path: this.path, query: {city: JSON.stringify(data)}});
      },
      onCancel() {
        this.$router.replace({path: this.path});
      },
    },
  }
</script>

<style lang="scss">

</style>
