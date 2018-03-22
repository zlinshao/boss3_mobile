<template>
  <div>
    <div :class="{'searchClass':organizeShow}" v-if="organizeShow">
      <van-search
        v-model="searchValue"
        placeholder="请输入商品名称"
        show-action
        @keyup="organize"
        @cancel="onClose"/>
      <div class="notData" v-if="lists.length === 0">暂无数据</div>
      <div class="searchContent">
        <div class="searchList" v-for="key in lists" @click="organizeSure(key.staff_name, key.id)">
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
    props: ['module'],
    data() {
      return {
        organizeShow: false,
        address: globalConfig.server_user,
        searchValue: '',
        lists: [],
        form: {}
      }
    },

    watch: {
      module(val) {
        this.organizeShow = val;
      },
      organizeShow(val) {
        if (!val) {
          this.$emit('close', val);
        }
      }
    },
    methods: {
      organize() {
        this.$http.get(this.address + 'api/v1/users', {
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
              list.id = data[i].id;
              list.staff_name = data[i].name;
              list.depart_name = data[i].org[0].name;
              this.lists.push(list);
            }
          }
        })
      },
    },

    // 开单人
    organizeSure(name, id) {
      this.form.staff_id = name;
      this.form.leader_id = id;
      this.$emit('organization', this.form);
      this.onClose();
    },

    // select关闭
    onClose() {
      this.organizeShow = false;
      this.lists = [];
      this.searchValue = '';
    },
  }
</script>

<style lang="scss">
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
