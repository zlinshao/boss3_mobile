<template>
  <div id="searchCity">
    <div class="searchClass">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue" @keyup.enter="onSearch">
          <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p v-if="searchValue.length > 0" @click="onSearch">搜索</p>
        <p v-else @click="onCancel" style="color: #666666;">取消</p>
      </div>

      <div class="notData" style="line-height: .46rem" v-if="lists.length === 0 && showDetail === 0">输入搜索内容结束后<br>请点击「回车」或搜索按钮</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 2">暂无相关信息</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 1">
        <van-loading type="spinner" color="black"/>
      </div>
      <div class="searchContent">
        <ul
          v-waterfall-lower="loadMore"
          waterfall-disabled="false"
          waterfall-offset="300">
          <li v-for="item in lists" @click="selectVillage(item)">
            <div class="searchList city" >
              <div>{{item.name}}</div>
              <div>
                <p>{{item.district}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';
  let addr = "//restapi.amap.com/v3/assistant/inputtips?key=2cafb0027aa13d1c6b13542462b3c94f&datatype=poi&types=120300";

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
        city_name: '',
        lists: [],
        path: '',
        page: 1,
        showDetail: 0,
      }
    },

    activated() {
      this.city_name = this.$route.query.city;
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

    },
    methods: {
      onSearch() {
        this.showDetail = 1;
        this.$http.defaults.withCredentials = false;
        this.$http.defaults.headers = {};
        this.$http.get(addr + '&keywords=' + this.searchValue + '&city='+this.city_name).then((res) => {
          if (res.data.tips.length > 0) {
            //过滤掉没有地址的数据
            this.lists = res.data.tips.filter((x) => {
              return typeof x.address === 'string'
            });
            this.showDetail = 2;
          }else {
            this.lists = [];
            this.showDetail = 2;
          }
        });
        this.$http.defaults.withCredentials = true;
        this.$http.defaults.headers = globalConfig.header;
        if (sessionStorage.myData !== undefined) {
          let head = JSON.parse(sessionStorage.myData);
          globalConfig.header.Authorization = head.token_type + ' ' + head.access_token;
        }
      },

      selectVillage(data) {
        this.$router.replace({path: '/addVillage', query: {village: JSON.stringify(data)}});
      },
      onCancel() {
        this.$router.replace({path: '/addVillage'});
      },
      close_() {
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
    .searchClass .searchContent {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      height: 90%;
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
