<template>
  <div id="searchCity">
    <div class="searchClass">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue">
          <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p v-if="searchValue.length < 2" @click="onCancel">取消</p>
        <p v-if="searchValue.length > 1" @click="search" style="color: #666666;">搜索</p>
      </div>

      <div class="notData" v-if="lists.length === 0 && this.searchValue.length === 0 && showDetail">请输入搜索内容(至少2位)</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length !== 0 && showDetail">暂无相关信息</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length !== 0 &&!showDetail">
        <van-loading type="spinner" color="black"/>
      </div>
      <div class="searchContent">
        <ul
          v-waterfall-lower="loadMore"
          waterfall-disabled="disabled"
          waterfall-offset="300">
          <li>
            <div class="searchList city" v-for="key in lists" @click="village(key)">
              <div>{{key.village_name}}</div>
              <div>
                <p>{{key.province.province_name}}-{{key.city.city_name}}</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="bottom">
          <div class="abc" v-if="disabled && this.lists.length > 8">没有更多了</div>
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
    name: "city-search",
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper'),
    },
    data() {
      return {
        urls: globalConfig.server,
        searchValue: '',          //搜索
        city_id: '',
        lists: [],
        path: '',
        page: 1,
        disabled: true,
        showDetail: true,
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
        this.lists = [];
        let value = val.replace(/\s+/g, '');
        this.searchValue = value;
        if (value !== '') {
          this.disabled = false;
          this.page = 1;
          // this.onSearch(value, this.page);
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
      },
      loadMore() {
        if (!this.disabled) {
          this.onSearch(this.searchValue, this.page);
          this.page++;
        }
      },
      onSearch(val, page) {
        if (val.length > 1) {
          this.showDetail = false;
          this.$http.get(this.urls + 'setting/community/', {
            params: {
              num: 30,
              city: this.city_id,
              keywords: val,
              pages: page,
            }
          }).then((res) => {
            if (this.searchValue !== '') {
              if (res.data.code === '10000' && res.data.data.list.length !== 0) {
                let data = res.data.data.list;
                data.forEach((data) => {
                  this.lists.push(data);
                  this.show();
                });
                // this.lists = res.data.data.list;
              } else {
                this.disabled = true;
                this.show();
              }
            } else {
              this.disabled = true;
              this.close_();
            }
          });
        }
      },
      show() {
        this.showDetail = true;
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
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    .bottom {
      @include flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      padding: .4rem 0 0;
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
