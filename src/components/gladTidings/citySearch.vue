<template>
  <div id="searchCity">
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

      <div class="notData" style="line-height: .46rem" v-if="lists.length === 0 && showDetail === 0">输入搜索内容结束后<br>请点击「回车」或搜索按钮
      </div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 2">暂无相关信息</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 1">
        <van-loading type="spinner" color="black"/>
      </div>
      <div class="searchContent">
        <van-list
          :finished="finished"
          @load="onLoad">
          <div class="searchList city" v-for="key in lists" @click="village(key)">
            <div>{{key.village_name}}</div>
            <div>
              <p>{{key.province.province_name}}-{{key.city.city_name}}</p>
            </div>
          </div>
        </van-list>
        <div class="bottom">
          <div class="abc" v-if="loading && this.lists.length > 8">没有更多了</div>
          <div class="abc" v-if="!loading && this.lists.length !== 0">
            <van-loading type="spinner" color="black"/>
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
        loading: true,
        finished: true,
        urls: globalConfig.server,
        searchValue: '',          //搜索
        city_id: '',
        province_id: '',
        lists: [],
        path: '',
        page: 1,
        showDetail: 0,
        params: {},
        type: '',
      }
    },
    activated() {
      this.type = this.$route.query.type;
      this.city_id = this.$route.query.city;
      this.area = this.$route.query.area || '';
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
          // this.disabled = false;
          // this.page = 1;
          // this.onSearch(value, this.page);
        } else {
          this.close_();
        }
      }
    },
    methods: {
      onLoad() {
        // 异步更新数据
        setTimeout(() => {
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (!this.finished) {
            this.onSearch(this.searchValue, this.page);
            this.page++;
          }
        }, 500);
      },
      search() {
        this.finished = false;
        this.page = 1;
        this.lists = [];
        this.onLoad();
      },
      onSearch(val, page) {
        this.finished = true;
        this.params = {};
        this.params.num = 20;
        this.params.keywords = val;
        this.params.pages = page;
        this.params.area = page;
        if (this.type === 1) {
          this.params.city = this.city_id;
        } else {
          this.params.province = this.city_id;
        }
        if (this.area) {
          this.params.area = this.area;
          this.params.province = '';
        }
        if (val !== '') {
          this.showDetail = 1;
          this.$http.get(this.urls + 'setting/community/', {
            params: this.params,
          }).then((res) => {
            if (this.searchValue !== '') {
              if (res.data.code === '10000' && res.data.data.list.length !== 0) {
                let data = res.data.data.list;
                data.forEach((data) => {
                  this.lists.push(data);
                });
                this.finished = false;
              } else {
                this.loading = true;
                this.showDetail = 2;
              }
            } else {
              this.loading = true;
              this.close_();
            }
          });
        }
      },

      village(data) {
        this.$router.replace({path: this.path, query: {city: JSON.stringify(data)}});
      },
      onCancel() {
        this.$router.replace({path: this.path});
      },
      close_() {
        this.loading = true;
        this.finished = true;
        this.page = 1;
        this.showDetail = 0;
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
