<template>
  <div id="searchCity">
    <!--//高德搜索-->
    <div class="searchClass" v-if="!isManual">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue" @keyup.enter="onSearch">
          <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p v-if="searchValue.length > 0" @click="onSearch">搜索</p>
        <p v-else @click="onCancel" style="color: #666666;">取消</p>
      </div>
      <div class="notData" style="line-height: .46rem" v-if="lists.length === 0 && showDetail === 0">输入搜索内容结束后<br>请点击「回车」或搜索按钮
      </div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 2">暂无相关信息</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 1">
        <van-loading type="spinner" color="black"/>
      </div>
      <div class="searchContent">
        <ul>
          <li v-for="item in lists" @click="selectVillage(item)">
            <div class="searchList city">
              <div>{{item.name}}</div>
              <div>
                <p>{{item.district}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--手动添加-->

    <div v-if="isManual">
      <van-cell-group>
        <van-field
          v-model="manualData.name"
          label="小区名称"
          type="text"
          placeholder="请输入小区名称"
          required>
        </van-field>
        <van-field
          v-model="manualData.district"
          label="小区地址"
          type="text"
          placeholder="请输入小区地址"
          required>
        </van-field>
        <van-field
          v-model="manualData.location"
          label="小区坐标"
          type="text"
          readonly
          @click="selectCoord"
          placeholder="请选择小区坐标"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <!--底部-->

    <div class="footer" v-if="!isManual">
      <div class="" @click="addNewAddress">切换到手动添加</div>
    </div>


    <div class="footer" v-if="isManual">
      <div class="" @click="addNewAddress">切换到高德搜索</div>
      <div class="" @click="manualAdd"> + 确定添加</div>
    </div>

  </div>
</template>

<script>
  import {Toast} from 'vant';

  let addr = "//restapi.amap.com/v3/assistant/inputtips?key=2cafb0027aa13d1c6b13542462b3c94f&datatype=poi&types=120300";

  export default {
    name: "city-search",
    components: {Toast},
    data() {
      return {
        urls: globalConfig.server,
        searchValue: '',          //搜索
        city_name: '',
        lists: [],
        path: '',
        page: 1,
        showDetail: 0,
        isManual: false,         //手动添加

        manualData: {
          name: '',
          district: '',
          location: '',
        }
      }
    },

    activated() {
      this.city_name = this.$route.query.city;
      this.close_();
      if (this.$route.query.coordinate) {
        this.getCoordinate();
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('/addVillage', 'house');
        vm.ddRent('/addVillage', 'house');
      })
    },
    watch: {},
    methods: {
      onSearch() {
        this.showDetail = 1;
        this.$http.defaults.withCredentials = false;
        this.$http.defaults.headers = {};
        this.$http.get(addr + '&keywords=' + this.searchValue + '&city=' + this.city_name).then((res) => {
          if (res.data.tips.length > 0) {
            //过滤掉没有地址的数据
            this.lists = res.data.tips.filter((x) => {
              return typeof x.address === 'string'
            });
            this.showDetail = 2;
          } else {
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
        this.$router.push({path: '/addVillage', query: {village: JSON.stringify(data)}});
      },
      onCancel() {
        this.$router.push({path: '/addVillage'});
      },
      close_() {
        this.showDetail = 0;
        this.searchValue = '';
        this.lists = [];
      },
      addNewAddress() {
        this.isManual = !this.isManual;
      },
      selectCoord() {
        this.$router.push({path: '/addNewAddress'});
      },
      getCoordinate() {
        this.manualData.location = this.$route.query.coordinate;
      },
      manualAdd() {
        if (!this.manualData.name) {
          Toast.fail('请输入小区名称！')
        } else if (!this.manualData.district) {
          Toast.fail('请输入小区地址！')
        } else if (!this.manualData.location) {
          Toast.fail('请选择小区坐标！')
        } else {
          this.$router.push({path: '/addVillage', query: {village: JSON.stringify(this.manualData)}});
          this.manualData = {
            name: '',
            district: '',
            location: '',
          }
        }
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

    .footerIndex {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #ebebeb;
      @include flex;
      background: #FFFFFF;
      justify-content: space-around;
      z-index: 999999;
      div + div {
        border-left: 1px solid #EEEEEE;
      }
      div {
        width: 100%;
        text-align: center;
        font-size: .28rem;
        color: #409EFF;
        padding: .3rem 0;
      }
    }

    .isManual {
      div {
        width: 50%;
      }
    }
  }
</style>
