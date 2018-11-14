<template>
  <div id="organzie">
    <div class="searchClass">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue" @keyup.enter="search">
          <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p v-if="searchValue.length < 2" @click="onClose">取消</p>
        <p v-if="searchValue.length > 1" @click="search" style="color: #666666;">搜索</p>
      </div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length < 2">请输入搜索内容(至少2位)</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 1 && showDetail">暂无相关信息</div>
      <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 1 && !showDetail">
        <van-loading type="spinner" color="black"/>
      </div>
      <div class="searchContent">
        <div class="searchList" v-for="key in lists" @click="organizeSure(key)">
          <div>{{key.staff_name}}</div>
          <div>
            <p>{{key.depart_name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "organize",
    data() {
      return {
        urls: globalConfig.server,
        searchValue: '',
        lists: [],
        path: '',
        showDetail: true,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.routerIndex(from.path);
        vm.ddRent(from.path, 'staff');
      })
    },
    activated() {
      this.close_();
    },
    watch: {

      searchValue(val) {
        let value = val.replace(/\s+/g, '');
        this.searchValue = value;
        if (value !== '') {
          if (value.length > 1) {
            this.organize(value);
          }
        } else {
          this.close_();
        }
      }
    },
    methods: {
      search() {
        this.organize(this.searchValue);
      },
      organize(val) {
        this.showDetail = false;
        this.$http.get(this.urls + 'organization/other/staff-list', {
          params: {
            keywords: val,
            page: 1,
            limit: 15,
            org_id: 1,
          }
        }).then((res) => {
          if (this.searchValue !== '') {
            if (res.data.code === '70010') {
              let data = res.data.data.data;
              this.lists = [];
              for (let key of data) {
                let list = {};
                list.staff_id = key.id;
                list.staff_name = key.name;
                if (key.org.length !== 0) {
                  list.depart_id = key.org[0].id;
                  list.depart_name = key.org[0].name;
                } else {
                  list.depart_name = '---';
                  list.depart_id = '';
                }
                this.lists.push(list);
              }
              this.showDetail = true;
            } else {
              this.close_();
            }
          } else {
            this.close_();
          }
        })
      },
      close_() {
        this.searchValue = '';
        this.lists = [];
      },
      // 开单人
      organizeSure(name) {
        name.activeRevise = false;
        this.$router.replace({path: this.path, query: {staff: JSON.stringify(name)}});
      },
      // select关闭
      onClose() {
        this.$router.replace({path: this.path, query: {tops: ''}});
      },
    },
  }
</script>

<style lang="scss">

</style>
