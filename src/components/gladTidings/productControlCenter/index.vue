<template>
  <div id="house">
    <div class="houseStatus" :class="isShow?'isShow':'isHide'">
      <ul style="line-height: 50px;padding: 0 15px">
        <li :class="activeIndex==index?'active':''" v-for="(item,index) in columns"
            @click="selectHouseStatus(item,index)">{{item}}
        </li>
      </ul>
    </div>
    <div class="header">
      <div @touchstart="changeShow">
        <van-search
          show-action
          v-model="params.q"
          @search="onSearch">
          <div slot="action" @click="onSearch" style="padding: 0 .2rem">搜索</div>
        </van-search>
      </div>
      <div class="filter">
        <div class="filter_item" @click.stop="openSelectModal()">
          {{houseStatusName}}<i class="iconfont icon-xiayibu rotate"/>
        </div>
        <div class="filter_item" @click="selectDepart()" @touchstart="changeShow">
          {{department_name}}
        </div>


        <!--<div class="filter_item" @click="openSelectModal('second')">-->
        <!--房型<i class="iconfont icon-xiayibu rotate"/>-->
        <!--</div>-->
        <!--<div class="filter_item" @click="openSelectModal('third')">-->
        <!--筛选<i class="iconfont icon-xiayibu rotate"/>-->
        <!--</div>-->
      </div>
    </div>
    <div v-if="isShow" @click.stop="changeShow" @touchstart.stop="changeShow"
         style="background: rgba(0,0,0,.3);width: 100%;height: 1000px;
                position: fixed;z-index: 1022;overflow: hidden"></div>

    <div class="mainContent" id="mainContent">
      <div id="houseItem">
        <div class="houseItem" v-for="(item,index) in tableData" @click="searchDetail(item)">
          <div class="image">
            <img v-if="item.album&&item.album.length>0&&imgArray[item.id]" :src="imgArray[item.id]" alt="">
            <img src="../../../assets/noPic.png" alt="" v-else>
          </div>
          <div class="houseItemDescribe">
            <div style="font-weight: bold">{{item.name}}</div>
            <div>
              <i class="iconfont icon-favoritesfilling" style="font-size: 0.2rem;color: #FFD000;"
                 v-for="item in item.house_grade">
              </i>
              <i class="iconfont icon-favoritesfilling"
                 style="font-size: 0.2rem;color: #DDDDDD;" v-for="item in 5-Number(item.house_grade)">
              </i>
              <span style="font-size: 0.2rem;margin-left: .2rem" v-if="item.decoration && item.house_identity">
              {{matchDictionary(item.decoration)}}/{{matchDictionary(item.house_identity)}}
            </span>
              <span style="color: #ff3f77;font-weight: bold;float: right">
              <span style="color: #1ecb4e" v-if="item.status==1">已出租</span>
              <span v-else-if="item.status == 2">待收房</span>
              <span style="color: #ef4292" v-else="">未出租</span>
            </span>
            </div>
            <div class="houseParams">
            <span>
              <span v-if="item.area">{{item.area}}m²</span>
              <span v-else="">/</span>
            </span>
              <span style="font-size: 0.2rem;margin: 0 .1rem">丨</span>
              <span>
              <span v-if="item.area">{{item.floor}}/{{item.floors}}层</span>
              <span v-else="">/</span>
            </span>
              <span style="font-size: 0.2rem;margin: 0 .1rem">丨</span>
              <span>
              <span>{{dicts.room[item.room]}}</span>
              <span>{{dicts.hall[item.hall]}}</span>
              <span>{{dicts.toilet[item.toilet]}}</span>
            </span>
            </div>
            <div class="otherInfo">
              <span v-if="item.total_ready_days&&!isNaN(item.total_ready_days)">余{{item.total_ready_days}}天</span>
              <span v-if="item.total_ready_days&&isNaN(item.total_ready_days)">{{item.total_ready_days}}</span>

              <span
                v-if="item.current_ready_days&&!isNaN(item.current_ready_days)">已空置{{item.current_ready_days}}天</span>
              <span v-if="item.current_ready_days&&isNaN(item.current_ready_days)">{{item.current_ready_days}}</span>

              <span v-if="item.is_again_rent>0">二次出租</span>
              <span v-else="">首次出租</span>

              <span v-if="item.house_res&&item.house_res.direction">{{item.house_res.direction.name}}</span>

              <span v-if="item.house_feature">{{matchDictionary(item.house_feature)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLastPage && !isEmptyData" class="bottom">
        <span>我是有底线的</span>
      </div>
      <div v-if="isEmptyData" style="background: #fff;padding:10px 0;text-align: center">
        搜索暂无结果，查看下其他内容吧~
      </div>
    </div>

    <div v-if="Loading"
         style="padding: 15px;background: #f3f3f3;position: fixed;bottom: 0;width: 100%;text-align: center">
      <span>拼命加载中...</span>
    </div>


    <!--<van-popup :overlay-style="{'background':'rgba(0,0,0,0)'}" v-model="selectHide" position="top" :overlay="true">-->
    <!--<div v-if="filterType == 'first'">-->
    <!--<ul style="line-height: 40px;padding: 0 10px">-->
    <!--<li :class="activeIndex==index?'active':''" v-for="(item,index) in columns"-->
    <!--@click="selectHouseStatus(item,index)">{{item}}-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->
    <!--<div class="filterModal" v-if="filterType == 'second'">-->
    <!--<div class="title">房型</div>-->
    <!--<div class="label_box">-->
    <!--<span class="label">不限</span>-->
    <!--<span class="label">1室</span>-->
    <!--<span class="label">2室</span>-->
    <!--<span class="label">2室+</span>-->
    <!--</div>-->
    <!--<div class="title">装修</div>-->
    <!--<div class="label_box">-->
    <!--<span class="label">不限</span>-->
    <!--<span class="label">毛坯</span>-->
    <!--<span class="label">简装</span>-->
    <!--<span class="label">精装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--</div>-->

    <!--<div class="title">房屋评分</div>-->
    <!--<div class="label_box">-->
    <!--<span class="label">不限</span>-->
    <!--<span class="label">毛坯</span>-->
    <!--<span class="label">简装</span>-->
    <!--<span class="label">精装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--</div>-->
    <!--<div class="title">朝向</div>-->
    <!--<div class="label_box">-->
    <!--<span class="label">不限</span>-->
    <!--<span class="label">毛坯</span>-->
    <!--<span class="label">简装</span>-->
    <!--<span class="label">精装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--</div>-->

    <!--<div class="footer">-->
    <!--<div class="">重置</div>-->
    <!--<div class="">确定</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="filterModal" v-if="filterType == 'third'">-->
    <!--<div class="title">房屋剩余时长</div>-->
    <!--<div class="label_box">-->
    <!--<span class="label">不限</span>-->
    <!--<span class="label">1室</span>-->
    <!--<span class="label">2室</span>-->
    <!--<span class="label">2室+</span>-->
    <!--</div>-->
    <!--<div class="title">预警状态</div>-->
    <!--<div class="label_box">-->
    <!--<span class="label">不限</span>-->
    <!--<span class="label">毛坯</span>-->
    <!--<span class="label">简装</span>-->
    <!--<span class="label">精装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--</div>-->

    <!--<div class="title">当前空置时长</div>-->
    <!--<div class="label_box">-->
    <!--<span class="label">不限</span>-->
    <!--<span class="label">毛坯</span>-->
    <!--<span class="label">简装</span>-->
    <!--<span class="label">精装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--<span class="label">豪装</span>-->
    <!--</div>-->

    <!--<div class="footer">-->
    <!--<div class="">重置</div>-->
    <!--<div class="">确定</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</van-popup>-->

  </div>
</template>

<script>
  import {Toast} from 'vant';

  export default {
    name: 'house',
    components: {Toast},
    data() {
      return {
        selectHide: false,
        columns: ['房屋状态', '未出租', '已出租', '待收房'],
        activeIndex: '',
        houseStatusName: '房屋状态',
        filterType: '',

        params: {
          q: '',
          per_page_number: 12,
          page: 1,
          status: '',
          org_id: '',
          is_nrcy: 0,
          is_lord: 1,
        },
        tableData: [],
        all_dic: [],
        dicts: {
          room: ['', '1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室'],
          hall: ['无', '1厅', '2厅', '3厅', '4厅', '5厅'],
          toilet: ['无', '1卫', '2卫', '3卫', '4卫', '5卫'],
          direction: ['东', '南', '西', '北', '东南', '东北', '西南', '西北', '南北'],
        },
        isLastPage: false,
        isGetMore: true,
        scrollHeight: '',

        isEmptyData: false,
        department_name: '所属部门',
        Loading: false,

        albumArray: [],
        imgArray: {},
        scrollTop: 0,
        isShow: false,
        isDetail: true,
      }
    },
    mounted() {
      let mainHeight = $('body').height() - 83;
      $('.mainContent').css('height', mainHeight + 'px');
      this.getData();
      this.getDictionary();
      let _this = this;
      $('#mainContent').scroll(function () {
        _this.scroll_bar_move();
      })
    },
    activated() {
      let _this = this;
      _this.getDepart();
      let mainContent = $('#mainContent');
      mainContent.scrollTop(this.scrollTop);
      mainContent.scroll(function () {
        _this.scroll_bar_move();
      })
    },
    //详情页不做缓存
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('');
        vm.ddRent('');
      })
    },
    beforeRouteLeave(to, from, next) {
      Toast.clear();
      next();
    },
    watch: {
      selectHide(val) {
        if (val) {
          document.getElementsByTagName('body')[0].className = 'showContainer';
        } else {
          document.getElementsByTagName('body')[0].className = '';
        }
      }
    },
    methods: {
      //滚动条
      scroll_bar_move() {
        let mainContent = $('#mainContent');
        let body_height = mainContent.height();
        let body_scrollTop = mainContent.scrollTop();
        this.scrollTop = mainContent.scrollTop();
        let scroll_height = $('#houseItem').height();

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
          this.params.page++;
          this.getData();
        }
      },
      //获取房屋列表
      getData() {
        let urls;
         urls = 'houses';
//        urls = 'coreproject/houses';
        this.Loading = true;
        this.isEmptyData = false;
        this.$http.get(globalConfig.server + urls, {params: this.params}).then((res) => {
          this.Loading = false;
          if (res.data.status === 'success') {
            let arr = [];
            arr = res.data.data;
            this.isLastPage = this.params.page === res.data.meta.last_page;
            arr.forEach((x) => {
              this.tableData.push(x);
              if (x.album && x.album.length > 0) {
                x.album.forEach((item) => {
                  if (this.albumArray.indexOf(item) < 0) {
                    this.albumArray.push(item);
                  }
                })
              }
            });
            this.getPic();
            if (res.data.data.length < 1) {
              this.isEmptyData = true;
            }
          } else {
            this.isEmptyData = true;
          }
        })
      },
      getPic() {
        let update = {show: []};
        update.show = this.albumArray;
        this.$http.post(globalConfig.server_user + 'files/batch', {'batch': JSON.stringify(update)}).then((res) => {
          if (res.data.status === 'success') {
            let imgArray = {};
            res.data.data.forEach((item) => {
              if (item.status === 'success') {
                if (item.data.info.mime.indexOf('image') > -1) {
                  this.tableData.forEach((list) => {
                    if (!imgArray[list.id]) {
                      if (list.album && list.album.indexOf(item.data.id) > -1) {
                        imgArray[list.id] = item.data.uri;
                      }
                    }
                  })
                }
              }
            });
            this.imgArray = imgArray;
          }
        })
      },
      //字典匹配
      getDictionary() {
        this.$http.get(globalConfig.server + 'setting/dictionary/all').then((res) => {
          this.all_dic = res.data.data;
        })
      },

      matchDictionary(id) {
        let dictionary_name = null;
        this.all_dic.map((item) => {
          if (item.id == id) {
            dictionary_name = item.dictionary_name;
          }
        });
        return dictionary_name;
      },

      //搜索项搜索
      onSearch() {
        this.isLastPage = false;
        this.params.page = 1;
        this.getData();
        this.tableData = [];
      },
      openSelectModal() {
        this.isShow = !this.isShow;
      },

      //选取部门
      selectDepart() {
        this.$router.push({path: '/depart'});
      },
      getDepart() {
        let t = this.$route.query;
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.department_name = val.name;
          this.params.org_id = val.id;
          this.onSearch();
        } else {
          this.department_name = '所属部门';
          this.params.org_id = '';
        }
      },
      selectHouseStatus(item, index) {
        this.activeIndex = index;
        this.houseStatusName = item;
        if (index > 0) {
          this.params.status = index - 1;
        } else {
          this.params.status = '';
        }
        this.onSearch();
        this.isShow = false;
      },
      changeShow() {
        this.isDetail = false;
        setTimeout(() => {
          this.isShow = false;
        }, 100);
        setTimeout(() => {
          this.isDetail = true;
        }, 500);
      },
      searchDetail(item) {
        if (this.isDetail) {
          this.$router.push({path: '/productDetail', query: {id: item.id}});
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .flex {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  .rotate {
    margin-left: 2px;
    transform: rotate(90deg);
  }

  .van-popup--top {
    top: 83px !important;
  }

  .active {
    color: #409EFF;
  }

  .selected_tr {
    background: #409EFF;
  }

  .houseStatus {
    background: #fff;
    position: fixed;
    top: 83px;
    width: 100%;;
    z-index: 2999;
    overflow: hidden;
  }

  .isShow {
    float: left;
    height: 200px;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  .isHide {
    height: 0;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }

  #house {
    background: #FFFFFF;
    height: 100%;
    .header, .mainContent {
      display: block;
    }
    .header {
      background: #FFFFFF;
      .filter {
        width: 100%;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        @extend .flex;
        .filter_item {
          font-size: .25rem;
          width: 50%;
          overflow: hidden;
          height: 30px;
          border-right: 1px solid #eee;
          @extend .flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .mainContent {
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch;
      .houseItem {
        padding: .3rem;
        border-bottom: 1px solid #eee;
        @extend .flex;
        &:hover {
          background: #f3f3f3;
        }
        img {
          width: 1.6rem;
          height: 1.2rem;
          margin-right: .2rem;
        }
        .houseItemDescribe {
          flex-grow: 1;
          > div {
            margin-bottom: 6px;
            span {
              color: #999;
            }
          }
          .houseParams {
            span {
              font-size: .2rem;
            }
          }
          .otherInfo {
            margin: .2rem 0 0 0;
            span {
              border: 1px solid #409EFF;
              color: #409EFF;
              border-radius: 3px;
              padding: 2px;
              margin-right: .1rem;
              font-size: .2rem;
              display: inline-block;
            }
          }
        }
      }
    }

    .filterModal {
      padding: 0 .3rem .3rem .3rem;
      margin-bottom: 1.2rem;
      color: #777;
      .title {
        text-align: center;
        margin-top: .3rem;
      }
      .label_box {
        @extend .flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .label {
          margin-top: .3rem;
          display: inline-block;
          min-width: 1.5rem;
          font-size: .2rem;
          padding: .15rem 0;
          text-align: center;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      }
    }

    .bottom {
      @extend .flex;
      justify-content: center;
      align-items: center;
      padding: .5rem 0;
      color: #DDDDDD;
    }
  }
</style>
