<template>
  <div>
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @keyup="organize"
        @cancel="onClose"/>
      <div class="notData" v-if="lists.length === 0">请输入搜索内容</div>
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
        address: globalConfig.server_user,
        searchValue: '',
        lists: [],
        path: '',
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
      this.searchValue = '';
    },
    methods: {
      organize() {
        this.$http.get(this.address + 'users', {
          params: {
            q: this.searchValue,
            page: 1,
            per_page_number: 30,
            org_id: 1,
            is_recursion: 1,
          }
        }).then((res) => {
          let data = res.data.data;
          this.lists = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].name !== null) {
              let list = {};
              list.staff_id = data[i].id;
              list.staff_name = data[i].name;
              if (data[i].org.length !== 0) {
                list.depart_id = data[i].org[0].id;
                list.depart_name = data[i].org[0].name;
              } else {
                list.depart_name = '---';
              }
              this.lists.push(list);
            }
          }
        })
      },
      // 开单人
      organizeSure(name) {
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
