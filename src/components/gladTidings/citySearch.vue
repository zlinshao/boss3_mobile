<template>
  <div id="searchCity">
    <div class="searchClass">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue">
        </div>
        <p @click="onCancel">取消</p>
      </div>

      <div class="notData" v-if="lists.length === 0 && this.searchValue.length === 0">请输入搜索内容(至少2位)</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length !== 0">暂无相关信息</div>
      <!--<ul-->
      <!--v-waterfall-lower="loadMore"-->
      <!--waterfall-disabled="disabled"-->
      <!--waterfall-offset="300">-->
      <!--<li>-->

      <!--</li>-->
      <!--</ul>-->

      <div class="searchContent">
        <div class="searchList city" v-for="key in lists" @click="village(key)">
          <div>{{key.village_name}}</div>
          <div>
            <p>{{key.province.province_name}}-{{key.city.city_name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import {Waterfall} from 'vant';

  export default {
    name: "city-search",
    // directives: {
    //   WaterfallLower: Waterfall('lower'),
    //   WaterfallUpper: Waterfall('upper'),
    // },
    data() {
      return {
        urls: globalConfig.server,
        searchValue: '',          //搜索
        city_id: '',
        lists: [],
        path: '',
        page: 1,
        disabled: true,
      }
    },

    activated() {
      this.city_id = this.$route.query.city;
      this.routerIndex(this.path);
      this.close_();
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
          this.onSearch(value, this.page);
        } else {
          this.close_();
        }
      }
    },
    methods: {
      // loadMore() {
      //   if (!this.disabled) {
      //     this.comments(this.searchValue, this.page);
      //     this.page++;
      //   }
      // },
      onSearch(val, page) {
        if (val.length > 1) {
          this.$http.get(this.urls + 'setting/community/', {
            params: {
              num: 30,
              city: this.city_id,
              keywords: val,
              pages: page,
            }
          }).then((res) => {
            if (this.searchValue !== '') {
              if (res.data.code === '10000') {
                this.lists = res.data.data.list;
              }
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
  #searchCity {

  }
</style>
