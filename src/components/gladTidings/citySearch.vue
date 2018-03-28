<template>
  <div id="searchCity">
    <div class="searchClass">
      <van-search
        v-model="searchValue"
        show-action
        @keyup="onSearch"
        @cancel="onCancel"/>
      <div class="notData" v-if="lists.length === 0">暂无数据</div>
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
      this.city_id = this.$route.query.city;
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
      })
    },
    watch: {},
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
        this.$router.push({path: this.path, query: {city: JSON.stringify(data)}});
      },
      onCancel() {
        this.$router.push({path: this.path});
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
    }
  }
</style>
