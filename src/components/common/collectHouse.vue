<template>
  <div>
    <div class="searchClass" v-if="houseVisible">
      <van-search
        autofocus="autofocus"
        v-model="searchValue"
        show-action
        @keyup="onSearch(types)"
        @cancel="onCancel"/>

      <div class="searchContent">
        <div class="notData" v-if="lists.length === 0">请输入搜索内容</div>
        <div class="searchList" v-for="key in lists" @click="houseAddress(key)">
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
    props: ['module', 'types'],
    data() {
      return {
        address: globalConfig.server_user,
        searchValue: '',          //搜索
        lists: [],
        form: {},
        formDetail: {},
        houseVisible: false,
      }
    },

    watch: {
      module(val) {
        this.houseVisible = val;
        this.ddReturn(val);
      },
      houseVisible(val) {
        if (!val) {
          this.ddReturn(!val);
          this.$emit('close');
        }
      }
    },
    methods: {
      // 搜索
      onSearch(val) {
        let value = this.searchValue.replace(/\s+/g, '');
        if (value !== '') {
          let type;
          switch (val) {
            case 'lord0':
              type = 'lord?q=';
              this.myData(type, value);
              break;
            case 'rent0':
              type = 'renter?q=';
              this.myData(type, value);
              break;
            case 'lord1':
              type = 'lord?status=1&q=';
              this.myData(type, value);
              break;
            case 'rent1':
              type = 'renter?status=1&q=';
              this.myData(type, value);
              break;
            case 'lord4':
              type = 'lord?status=4&q=';
              this.myData(type, value);
              break;
            case 'rent4':
              type = 'renter?status=4&q=';
              this.myData(type, value);
              break;
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
            if (data[i].house !== null) {
              list.house_name = data[i].house.name;
              list.house_id = data[i].house.id;
            }
            list.pay_way = data[i].pay_way !== null ? data[i].pay_way : '';
            if (data[i].sign_user !== null) {
              list.staff_name = data[i].sign_user.name;
              list.department_name = data[i].sign_user.org[0].name;
            } else {
              list.staff_name = '';
              list.department_name = '';
            }
            this.lists.push(list);
          }
        })
      },
      // 房屋地址
      houseAddress(data) {
        this.$emit('houseInfo', data, this.types);
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.houseVisible = false;
      },
      ddReturn(val) {
        let that = this;
        // 钉钉头部左侧
        dd.biz.navigation.setLeft({
          control: val,
          onSuccess: function (result) {
            that.onCancel();
            that.ddReturn(false);
          },
          onFail: function (err) {
          }
        });
      },
      ddBack() {
        let that = this;
        //返回按钮点击的事件监听(android)
        document.addEventListener('backbutton', function(e) {
          e.preventDefault();
          dd.device.notification.alert({
            message: '哎呀，你不小心点到返回键啦!',
            title: '...警告...'
          });
        }, false);
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
