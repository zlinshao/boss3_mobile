<template>
  <div>
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @keyup="onSearch(types)"
        @cancel="onCancel"/>

      <div class="searchContent">
        <div class="notData" v-if="lists.length === 0">请输入搜索内容</div>
        <div class="searchList" v-for="key in lists" @touchstart="houseAddress(key)">
          <div>{{key.house_name}}</div>
          <div>
            <p>{{key.department_name}}</p>
            <span>{{key.staff_name}}</span>
            <!--<span v-if="key.customer !== ''">-{{key.customer}}</span>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "collect-house",
    props: ['module', 'type'],
    data() {
      return {
        address: globalConfig.server_user,
        searchValue: '',          //搜索
        lists: [],
        form: {},
        formDetail: {},
        types: '',
        path: '',
      }
    },
    mounted(){
      this.types = this.$route.query.type;
      this.ddReturn(true);
      this.ddBack();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
      })
    },
    methods: {
      // 搜索
      onSearch(val) {
        let value = this.searchValue.replace(/\s+/g, '');
        if (value !== '') {
          let type;
          switch (val) {
            case 'rent':
              type = 'renter?status=1&q=';
              this.myData(type, value);
              break;
            default:
              type = 'lord?status=1&q=';
              this.myData(type, value);
          }
        }
      },
      myData(urls, val) {
        this.$http.get(this.address + urls + val).then((res) => {
          let data = res.data.data;
          this.lists = [];
          for (let i = 0; i < data.length; i++) {
            this.formDetail = data[i];
            let list = {};
            list.id = data[i].id;
            list.house_name = data[i].house.name;
            list.house_id = data[i].house.id;
            list.staff_name = data[i].sign_user.name;
            list.department_name = data[i].sign_user.org[0].name;
            this.lists.push(list);
          }
        })
      },
      // 房屋地址
      houseAddress(data) {
        this.$router.replace({path: this.path, query: {house: data}});
        this.ddReturn(false);
      },
      // select关闭
      onCancel() {
        this.$router.replace({path: this.path, query: {house: ''}});
        this.ddReturn(false);
      },
      ddReturn(val) {
        let that = this;
        // 钉钉头部左侧
        dd.biz.navigation.setLeft({
          control: val,
          onSuccess: function (result) {
            that.$router.replace({path: that.path, query: {house: ''}});
            that.ddReturn(false);
          },
          onFail: function (err) {}
        });
        // 钉钉头部右侧
        dd.biz.navigation.setRight({
          show: false,
          onSuccess: function (result) {},
          onFail: function (err) {}
        });
      },
      ddBack() {
        let that = this;
        document.addEventListener('backbutton', function (e) {
          e.preventDefault();
          that.$router.replace({path: that.path, query: {city: ''}});
        });
      }
    },
  }
</script>

<style lang="scss">
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
          p {
            margin-bottom: .1rem;
          }
          span {
            font-size: .16rem;
            color: #aaaaaa;
          }
        }
      }
    }
  }
</style>
