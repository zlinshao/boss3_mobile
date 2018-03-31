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
        searchValue: '',          //搜索
        city_id: '',
        lists: [],
        path: '',
      }
    },
    mounted() {
      this.city_id = this.$route.query.city;
    },
    activated() {
      this.lists = [];
      this.searchValue = '';
      this.city_id = this.$route.query.city;
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
          padding: .46rem .3rem 0;
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
