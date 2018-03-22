<template>
  <div>
    <div :class="{'searchClass':searchShow}" v-if="searchShow">
      <van-search
        v-model="searchValue"
        show-action
        @keyup="onSearch"
        @cancel="onCancel"/>
      <div class="searchContent">
        <div class="notData" v-if="lists.length === 0">暂无数据</div>
        <div class="searchList" v-for="key in lists" @click="houseAddress(key.house_name, key.id, key.house_id)">
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
        searchShow: false,        //搜索
        searchValue: '',          //搜索
        lists: [],
        form: {},
      }
    },
    mounted() {
    },
    watch: {
      module(val) {
        this.searchShow = val;
      },
      searchShow(val) {
        if (!val) {
          this.$emit('close', val);
          this.onCancel();
        }
      }
    },
    methods: {
      // 搜索
      onSearch() {
        this.$http.get(this.address + 'api/v1/houses?q=' + this.searchValue).then((res) => {
          let data = res.data.data;
          this.lists = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].name !== null) {
              let list = {};
              list.house_name = data[i].name;
              if (data[i].lords.length !== 0) {
                list.id = data[i].lords[0].id;
                list.house_id = data[i].lords[0].house_id;
                if (data[i].lords[0].user.length !== 0) {
                  list.staff_name = data[i].lords[0].user[0].name;
                  list.department_name = data[i].lords[0].user[0].org[0].name;
                } else {
                  list.staff_name = '';
                  list.department_name = '';
                }
              } else {
                list.staff_name = '';
                list.department_name = '';
              }
              this.lists.push(list);
            }
          }
        })
      },
      // select关闭
      onCancel() {
        this.searchShow = false;
        this.lists = [];
        this.searchValue = '';
      },
      // 房屋地址
      houseAddress(name, id, house) {
        this.form.houseName = name;
        this.form.contract_id = id;
        this.form.house_id = house;
        this.onCancel();
        this.$emit('house', this.form, this.type);
      },
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
