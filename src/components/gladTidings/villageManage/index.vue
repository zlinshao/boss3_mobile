<template>
  <div id="searchCity">
    <div class="searchClass">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue" @keyup.enter="search">
          <i v-if="searchValue" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <button @click="search" :disabled="!searchValue" class="button" style="background-color: transparent;">搜索</button>
      </div>
      <div class="notData" v-if="lists.length<1 && noData">暂无相关信息</div>

      <div class="searchContent" id="searchContent">
        <div id="searchList">
          <div class="searchList city" v-for="key in lists">
            <div>{{key.village_name}}</div>
            <div>
              <p>{{key.province.province_name}}-{{key.city.city_name}}</p>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="abc" v-if="disabled && this.lists.length > 8">没有更多了</div>
          <div class="abc" v-if="showLoading">
            <van-loading type="spinner" color="black"/>
          </div>
        </div>
      </div>

      <!--底部-->

      <div class="footer">
        <div class="" @click="addVillage"> + 新增小区</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';
  import {Toast} from 'vant';
  export default {
    name: "city-search",
    components: {Toast},
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
        noData : false,
        showLoading : false,

        scrollHeight : '',
        isLastPage: false,
        isGetMore : false,
      }
    },
    mounted(){
      this.search();
      let _this = this;
      $('#searchContent').scroll(function () {
        _this.scroll_bar_move();
      })
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('');
        vm.ddRent('');
      })
    },
    activated() {
      this.isGetMore = false;
      this.isLastPage = false;
      this.noData = false;
      this.scrollHeight = '';
      this.search();
    },
    watch: {
      searchValue(val) {
        if(!val){
          this.search();
        }
      }
    },
    methods: {

      scroll_bar_move(){
        let searchContent = $('#searchContent');

        let body_height = searchContent.height();
        let body_scrollTop = searchContent.scrollTop();
        let scroll_height = $('#searchList').height() + 20;

        if (this.scrollHeight < scroll_height) {
          this.isGetMore = true;
        }

        this.scrollHeight = scroll_height;
        if (scroll_height - body_scrollTop - body_height < 200) {
          this.getMore();
          this.isGetMore = false;
        }
      },
      //加载更多
      getMore() {
        if (this.isGetMore && !this.isLastPage) {
          this.page++;
          this.onSearch();
        }
      },
      search() {
        this.page = 1;
        this.lists = [];
        this.onSearch();
      },

      onSearch() {
        this.showLoading = true;
        this.noData = false;
        this.$http.get(this.urls + 'setting/community/', {
          params: {
            num: 20,
            city: this.city_id,
            keywords: this.searchValue,
            pages: this.page,
            a : 'list',
          }
        }).then((res) => {
          this.showLoading = false;
          if (res.data.code === '10000') {
            let data = res.data.data.list;
            this.isLastPage = this.page === res.data.pages;
            data.forEach((data) => {
              this.lists.push(data);
            });
            if(res.data.data.list.length<1){
              this.noData = true;
            }
          } else {
            this.noData = true;
          }
        }).catch((res) => {
          this.noData = true;
        })
      },

      addVillage(){
        this.$router.push({path: '/addVillage'});
      }
    },
  }
</script>

<style lang="scss">
  #searchCity {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    .button{
      color: #409EFF;
      border: none;
      width: 1.4rem;
    }
    .searchClass .searchContent {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      height: 85%;
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
        background-color: #FFFFFF !important;
        padding: .2rem 0;
        width: 100%;
      }
    }
    .searchList{
      border-bottom: 1px solid #eee;
    }
  }
</style>
