<template>
  <div>
    <div class="searchClass">
      <div class="breadcrumb_box">
        <div class="breadcrumb">
          <div>
            <span @click="breadcrumbSearch(ids, 0)">{{highestDepart}}</span>
          </div>
          <div v-for="(item,index) in breadcrumbList" @click="breadcrumbSearch(item,index)">
            <span>&nbsp;&gt;&nbsp;{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="departList">
        <ul v-if="organizeList.length !== 0">
          <li v-for="item in organizeList">
            <div class="radio">
              <van-radio :name="item.id" v-model="selectId" @click="selectItem(item)"></van-radio>
            </div>
            <div class="depart_detail" @click="getNextLevel(item)">
              <div>{{item.name}}</div>
              <div>{{item.users.length}}</div>
            </div>
          </li>
        </ul>
        <div class="noDepart" v-else-if="noDepart">暂无相关部门</div>
        <div class="noDepart" v-else><van-loading type="spinner" color="black"/></div>
      </div>
      <div class="footerIndex">
        <div @click="clearData">清空</div>
        <div @click="confirmAdd" :class="{'isGray':!selectId}">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';

  export default {
    name: "organize",
    components: {Toast},
    data() {
      return {
        searchValue: '',
        organizeList: [],    //组织架构部门列表
        breadcrumbList: [],  //面包屑列表
        highestDepart: '',   //最高级岗位
        selectId: '',
        selectDepart: {},
        path: '',
        ids: 1,
        noDepart: false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.routerIndex(from.path, 'depart');
        vm.ddRent(from.path, 'depart');
      })
    },
    activated() {
      let id = JSON.parse(sessionStorage.personal).isCompany;
      if (id) {
        Object.values(id).forEach((item) => {
          if (item > 1) {
            this.ids = item;
          }
        })
      }
      this.getDepartment(this.ids);
    },
    methods: {
      getDepartment(id = 1) {
        this.noDepart = false;
        this.$http.get(globalConfig.server + 'organization/other/org-tree?id=' + id + '&infinite=20').then((res) => {
          if (res.data.code === '70050') {
            this.organizeList = res.data.data.children;
            if (id === this.ids || id === 1) {
              this.highestDepart = res.data.data.name;
            }
          }
          this.noDepart = true;
        });
      },
      //搜索下级部门
      getNextLevel(item) {
        this.getDepartment(item.id);
        let isExist = false;
        this.breadcrumbList.forEach((x) => {
          if (item.id === x.id) {
            isExist = true
          }
        });
        if (!isExist) {
          this.breadcrumbList.push(item)
        }
      },
      //面包屑搜索
      breadcrumbSearch(item, index) {
        if (item === this.ids) {
          this.getDepartment(item);
          this.breadcrumbList = [];
        } else {
          this.getDepartment(item.id);
          this.breadcrumbList.splice(index + 1, this.breadcrumbList.length);
        }
      },
      // 开单人
      organizeSure(name, id) {
        this.form.id = id;
        this.form.name = name;
        this.$emit('organization', this.form, this.type);
        this.onClose();
      },

      selectItem(item) {
        this.selectDepart.id = item.id;
        this.selectDepart.name = item.name;
      },

      confirmAdd() {
        if (this.selectId) {
          if (navigator.userAgent === 'app/ApartMent') {
            let data = [], value = {};
            value.org_id = this.selectDepart.id;
            value.org_name = this.selectDepart.name;
            data.push(value);
            android.staffIds(JSON.stringify(data));
            return;
          }
          this.$router.replace({path: this.path, query: {depart: JSON.stringify(this.selectDepart)}});
        } else {
          Toast.fail('请选择部门');
        }
      },
      clearData() {
        this.selectId = '';
        this.selectDepart = {};
        this.$router.replace({path: this.path, query: {depart: ''}});
      },
      ddRent(urls, val) {
        let that = this;
        dd.biz.navigation.setLeft({
          control: val,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '',//控制显示文本，空字符串表示显示默认文本
          onSuccess: function (result) {
            that.$router.replace({path: urls, query: {tops: ''}});
            that.ddRent(false);
          },
        });
      }
    },
  }
</script>

<style scoped lang="scss">
  @mixin flex {
    display: flex;
    display: -webkit-flex;
  }

  .isGray {
    color: #aaa !important;
  }

  .searchClass {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    z-index: 999;
    .breadcrumb_box {
      width: 100%;
      margin: .15rem 0;
      background: #F8F8F8;
      padding: .25rem;
      .breadcrumb {
        width: 100%;
        @include flex;
        flex-wrap: wrap;
        div {
          margin: .1rem 0;
          color: #409EFF;
          &:last-child {
            color: inherit;
          }
        }
      }
    }
    .noDepart {
      color: #aaa;
      border: none;
      text-align: center;
      padding: .3rem;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
    }
    .departList {
      height: 77%;
      overflow: auto;
      li {
        height: .9rem;
        padding: 0 .3rem;
        @include flex;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
        &:hover {
          background: #F8F8F8;
        }
        .radio {
          height: .9rem;
          padding-right: .2rem;
          @include flex;
          align-items: center;
        }
        .depart_detail {
          flex-grow: 1;
          height: .9rem;
          @include flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .footerIndex {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1rem;
      border-top: 1px solid #ebebeb;
      @include flex;
      background: #FFFFFF;
      justify-content: space-around;
      z-index: 999999;
      div + div {
        border-left: 1px solid #EEEEEE;
      }
      div {
        width: 50%;
        text-align: center;
        line-height: 1rem;
      }
    }
  }
</style>
