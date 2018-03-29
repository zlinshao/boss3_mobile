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
      })
    },
    mounted() {
      this.ddReturn(true);
      this.ddBack();
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
        this.$router.replace({path: this.path, query: {staff: name}});
        this.ddReturn(false);
      },
      // select关闭
      onClose() {
        this.$router.replace({path: this.path, query: {staff: ''}});
        this.ddReturn(false);
      },
      ddReturn(val) {
        let that = this;
        // 钉钉头部左侧
        dd.biz.navigation.setLeft({
          control: val,
          text: '返回',
          onSuccess: function (result) {
            that.$router.replace({path: that.path, query: {staff: ''}});
            that.ddReturn(false);
          },
          onFail: function (err) {
          }
        });
        // 钉钉头部右侧
        dd.biz.navigation.setRight({
          show: false,
          onSuccess: function (result) {
          },
          onFail: function (err) {
          }
        });
      },
      ddBack() {
        let that = this;
        document.addEventListener('backbutton', function (e) {
          e.preventDefault();
          that.$router.replace({path: that.path, query: {staff: ''}});
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

  .notData {
    text-align: center;
    padding: 24px 0;
    font-size: .33rem;
    color: #b3afaf;
  }

  .searchClass {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    z-index: 999;
    .searchContent {
      overflow: auto;
      height: 77%;
      .searchList {
        @include flex;
        justify-content: space-between;
        padding: .3rem;
        &:hover {
          background: #DDDDDD;
        }
        div:first-child {
          width: 48%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        div:last-of-type {
          text-align: right;
        }
      }
    }
  }
</style>
