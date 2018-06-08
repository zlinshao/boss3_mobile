<template>
  <div id="androidStaff">
    <div class="moduleStaff" v-if="searchStatus"></div>
    <div class="breadCrumb">
      <div class="staffSearch">
        <div class="searchCon">
          <div>
            <i class="van-icon van-icon-search"></i>
            <input type="text" v-model="searchValue" @focus="searchSta(1)" @keyup.enter="search" placeholder="请输入搜索内容">
            <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
          </div>
        </div>
        <p v-if="searchValue.length > 0 && searchStatus" @click="search" style="color: #666666;">搜索</p>
        <p v-if="searchValue.length < 1 && searchStatus" @click="onCancel" style="color: #06bf04;">取消</p>
      </div>
      <div class="breadA">
        <div class="breadAuto">
          <div>
            <span @click="breadcrumbSearch(1, '')">{{highestDepart}}</span>
          </div>
          <div v-for="(item,index) in breadcrumbList" @click="breadcrumbSearch(item,index)">
            <span>&nbsp;/&nbsp;{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="staffList">
      <!--<div class="checkedClass" v-if="staffList.length > 0">-->
      <!--<van-checkbox v-model="checked">全选</van-checkbox>-->
      <!--</div>-->
      <ul
        v-waterfall-lower="loadMore"
        waterfall-disabled="disabled"
        waterfall-offset="300">
        <li class="organizeList" v-for="(item,index) in organizeList">
          <div class="depart_detail">
            <div>{{item.name}}&nbsp;<span style="color: #757575;">({{item.users}}人)</span></div>
            <div class="iconPng" @click="getNextLevel(item)">
              <!--<img src="../../assets/nextdisabled.png">-->
              <img src="../../assets/nextleve.png">
            </div>
          </div>
        </li>
        <li v-for="(item,index) in staffList">
          <div class="checks">
            <van-checkbox-group v-model="selectId">
              <van-checkbox :key="index" :name="item">
                {{item.name}}
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </li>
        <li class="noData" v-if="staffList.length === 0 && organizeList.length === 0">
          暂无数据
        </li>
      </ul>
    </div>
    <div class="staffFoot">
      <div class="selectPeople">
        已选{{selectId.length}}人
      </div>
      <div class="footerBtn">
        <div @click="close_('id')">清空</div>
        <div @click="sureIds">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Waterfall} from 'vant';

  export default {
    name: "android-staff",
    directives: {
      WaterfallLower: Waterfall('lower'),
      WaterfallUpper: Waterfall('upper'),
    },
    data() {
      return {
        disabled: true,
        checked: false,         //全选
        highestDepart: '',      //最高级岗位
        breadcrumbList: [],     //面包屑列表
        organizeList: [],       //组织架构部门列表
        staffList: [],          //人员列表
        selectId: [],           //人员ID

        searchValue: '',
        searchStatus: false,
        staffData: [],
        params: {
          is_dimission: 0,
          org_id: '',
          pages: 1,
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('');
        vm.ddRent('');
      })
    },
    mounted() {
      this.getDepartment(1, 1);
      // 获取顶级部门名称
      this.$http.get(globalConfig.server_user + 'organizations/1').then((res) => {
        if (res.data.status === 'success') {
          this.highestDepart = res.data.data.name;
        }
      });
    },
    methods: {
      loadMore() {
        if (!this.disabled) {
          this.getDepartment(this.params.org_id, this.params.pages);
          this.params.pages++;
        }
      },
      searchSta(val) {
        if (val === 1) {
          this.searchStatus = true;
        }
      },
      search() {
        this.$http.get(globalConfig.server_user + 'users?q=' + this.searchValue).then((res) => {
          if (res.data.status === 'success' && res.data.data.length > 0) {
            this.staffData = res.data.data;
          } else {
            this.staffData = [];
          }
        })
      },
      onCancel() {
        this.searchStatus = false;
      },
      getDepartment(id, page) {
        this.$http.get(globalConfig.server_user + 'organizations?parent_id=' + id + '&per_page_number=50').then((res) => {
          if (res.data.status === 'success') {
            this.organizeList = res.data.data;
            // this.lastPage_depart = res.data.meta.last_page;
          }
        });
        this.getStaffs(id, page);
      },
      getStaffs(id, page) {
        this.params.org_id = id;
        this.params.pages = page;
        this.$http.get(globalConfig.server_user + 'users', {
          params: this.params,
        }).then((res) => {
          if (res.data.status === 'success' && res.data.data.length > 0) {
            let data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              this.staffList.push(data[i]);
            }
            // this.lastPage_user = res.data.meta.last_page;
          } else {
            this.close_();
          }
        })
      },
      //面包屑搜索
      breadcrumbSearch(item, index) {
        this.close_();
        this.params.org_id = item.id;
        if (item === 1) {
          this.getDepartment(1, 1);
          this.breadcrumbList = [];
        } else {
          this.getDepartment(item.id, 1);
          this.breadcrumbList.splice(index + 1, this.breadcrumbList.length);
        }
      },
      //搜索下级部门
      getNextLevel(item) {
        this.close_();
        this.params.org_id = item.id;
        this.getDepartment(item.id, 1);
        let isExist = false;
        this.breadcrumbList.forEach((x) => {
          if (item.id === x.id) {
            isExist = true;
          }
        });
        if (!isExist) {
          this.breadcrumbList.push(item);
        }
      },
      close_(val) {
        if (val === 'id') {
          this.selectId = [];
        } else {
          this.staffList = [];
          this.params.pages = 1;
        }
      },
      sureIds() {
        android.staffIds(JSON.stringify(this.selectId));
        this.selectId = [];
        this.getDepartment(1, 1);
        this.params.pages = 1;
      },
    },
  }
</script>

<style lang="scss">
  #androidStaff {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    @mixin boxShadow {
      -webkit-box-shadow: 0 0 6px rgba(61, 90, 254, 0.4);
      -moz-box-shadow: 0 0 6px rgba(61, 90, 254, 0.4);
      box-shadow: 0 0 6px rgba(61, 90, 254, 0.4);
    }
    @mixin border_radius($n) {
      -webkit-border-radius: $n;
      -moz-border-radius: $n;
      border-radius: $n;
    }
    .moduleStaff {
      position: fixed;
      top: 2.02rem;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1001;
    }
    .breadCrumb {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: .3rem .3rem .2rem;
      background-color: #FFFFFF;
      margin-bottom: .1rem;
      @include boxShadow;
      .breadA {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-top: .2rem;
        line-height: .6rem;
        .breadAuto {
          width: 500px;
          @include flex;
          flex-wrap: wrap;
        }
        span {
          color: #409EFF;
        }
      }
      .staffSearch {
        @include flex;
        align-items: center;
        .searchCon {
          width: 100%;
          div {
            @include border_radius(6px);
            padding: .06rem .2rem;
            @include flex;
            align-items: center;
            background-color: #F8F9FF;
            .van-icon.van-icon-search {
              font-size: .36rem;
            }
            input {
              width: 100%;
              background-color: #F8F9FF;
              border: 0;
            }
          }
        }
      }
      p {
        min-width: 1rem;
        text-align: center;
      }
    }
    .staffList {
      margin-top: 2.2rem;
      background-color: #FFFFFF;
      .checkedClass {
        height: 1rem;
        line-height: 1rem;
        padding: 0 .3rem;
        background-color: rgba(83, 109, 254, 0.2);
        .van-checkbox__input {
          @include border_radius(50%);
          background-color: #FFFFFF;
        }
      }
      ul {
        max-height: 7.82rem;
        padding: 0 .3rem;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        li {
          border-bottom: 1px solid #E0E0E0;
          .depart_detail {
            @include flex;
            justify-content: space-between;
            div {
              color: #212121;
            }
            .iconPng {
              margin-top: .2rem;
              height: .6rem;
              img {
                height: 100%;
              }
            }
          }
        }
        li:last-of-type {
          border-bottom: 0;
        }
        .organizeList {
          height: 1rem;
          line-height: 1rem;
        }
        .noData {
          text-align: center;
          padding: .42rem 0;
          color: #E0E0E0;
        }
      }
    }
    .staffFoot {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1.6rem;
      @include boxShadow;
      background-color: #FFFFFF;
      padding: 0 6%;
      .selectPeople {
        color: #FF4081;
        padding: .15rem 0;
      }
      .footerBtn {
        @include flex;
        justify-content: space-between;
        align-items: center;
        div {
          color: #FFFFFF;
          @include border_radius(3px);
          width: 46%;
          height: .8rem;
          line-height: .8rem;
          text-align: center;
          background: #536DFE;
        }
        div:first-of-type {
          background-color: #E2E2E3;
          color: #7D7D7D;
        }
      }
    }
  }
</style>
