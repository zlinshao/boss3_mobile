<template>
  <div>
    <div class="searchClass">
      <div class="breadcrumb_box">
        <div class="breadcrumb">
          <div>
            <span @click="breadcrumbSearch()">{{highestDepart}}</span>
          </div>
          <div v-for="(item,index) in breadcrumbList" @click="breadcrumbSearch(item,index)">
            <span>&nbsp;&gt;&nbsp;{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="departList">
        <ul>
          <li v-for="item in organizeList">
            <div class="radio">
              <van-radio :name="item.id" v-model="selectId" @click="selectItem(item)"></van-radio>
            </div>
            <div class="depart_detail" @click="getNextLevel(item)">
              <div>{{item.name}}</div>
              <div>{{item.users}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="footer">
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
      }
    },
    activated() {
      this.getDepartment();
    },
    methods: {
      getDepartment(id = 1) {
        this.$http.get(globalConfig.server + 'organization/other/org-tree?id=' + id).then((res) => {
          if (res.data.code === '70050') {
            this.organizeList = res.data.data.children;
            if (id === 1) {
              this.highestDepart = res.data.data.name;
            }
          }
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
      breadcrumbSearch(item = 1, index = '') {
        if (item === 1) {
          this.getDepartment();
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
         console.log(this.selectDepart)
        } else {
          Toast.fail('请选择部门');
        }
      },
      ddRent(urls, val) {
        let that = this;
        dd.biz.navigation.setLeft({
          control: val,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '',//控制显示文本，空字符串表示显示默认文本
          onSuccess : function(result) {
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
    .footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1rem;
      text-align: center;
      z-index: 666;
      background: #ffffff;
      border-top: 1px solid #efefef;
      div {
        height: 1rem;
        line-height: 1rem;
        width: 100% !important;
        text-align: center;
        color: #409EFF;
      }
    }
  }
</style>
