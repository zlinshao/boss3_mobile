<template>
  <div id="searchCity">
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @keyup="onSearch"
        @cancel="onCancel"/>
      <div class="notData" v-if="lists.length === 0">请输入搜索内容</div>
      <div class="searchContent">
        <div class="searchList" v-for="key in lists" @click="village(key.village_name, key.id)">
          <div>{{key.village_name}}</div>
          <div>
            <p>{{key.province_name}}-{{key.city_name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "city-search",
    data() {
      return {
        urls: globalConfig.server,
        searchShow: false,        //搜索
        searchValue: '',          //搜索
        city_id: '',
        lists: [],
        path: '',
      }
    },
    mounted() {
      // $("input").trigger("click").focus();
      this.city_id = this.$route.query.city;
      this.ddReturn(true);
      this.ddBack();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
      })
    },
    methods: {
      onSearch() {
        if (this.searchValue.length > 1) {
          this.$http.get(this.urls + 'setting/community/', {
            params: {
              num: 30,
              city: this.city_id,
              keywords: this.searchValue,
            }
          }).then((res) => {
            this.lists = res.data.data.list;
          })
        }
      },
      village(name, id) {
        let data = {};
        data.name = name;
        data.id = id;
        this.$router.replace({path: this.path, query: {city: data}});
         this.ddReturn(false);
      },
      onCancel() {
        this.$router.replace({path: this.path, query: {city: ''}});
         this.ddReturn(false);
      },
      ddReturn(val) {
        let that = this;
        // 钉钉头部左侧
        dd.biz.navigation.setLeft({
          control: val,
          onSuccess: function (result) {
            that.$router.replace({path: that.path, query: {city: ''}});
            that.ddReturn(false);
          },
          onFail: function (err) {}
        });
      },
      ddBack() {
        let that = this;
        document.addEventListener('backbutton', function (e) {
          e.preventDefault();
          that.$router.push({path: that.path, query: {city: ''}});
        });
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
    .searchClass {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      z-index: 999;
      .notData {
        text-align: center;
        padding: 24px 0;
        font-size: .33rem;
        color: #b3afaf;
      }
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
              /*margin-bottom: .16rem;*/
            }
            span {
              color: #aaaaaa;
            }
          }
        }
      }
      .van-search__input-wrap {
        padding-top: 5px;
        .van-search__input {
          height: 22px;
          line-height: 22px;
        }
      }
    }
  }
</style>
