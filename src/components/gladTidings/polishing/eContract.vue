<template>
  <div>
    <van-search
      v-model="searchInfo"
      placeholder="地址/房东/租客"
      show-action
      shape="round"
      @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <van-tabs @click="changeTab">
      <van-tab title="收房"></van-tab>
      <van-tab title="租房"></van-tab>
    </van-tabs>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onSearch">
      <van-cell
        v-for="item in list"
        :key="item"
        :title="item"
      />
    </van-list>
    <van-button round type="danger" class="new" @click="showChooseDialog()">新增合同</van-button>
    <van-popup v-model="show" class="popup">
      <div>
        <div class="choose" @click="collect">收房</div>
        <div class="line"></div>
        <div class="choose" @click="rent">租房</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "eContract",
    data() {
      return {
        list: [],
        searchInfo: '',//搜索内容
        finished: false,
        loading: false,
        show:false,//是否显示收租房弹框
      }
    },
    methods: {
      onSearch() {

      },
      //更改tab
      changeTab(index, title) {

      },
      //显示选择收租房弹框
      showChooseDialog(){
        this.show=true;
      },
      //添加收房合同
      collect(){
        this.$router.push({path:'/newCollectContract',query:{type:'0'}});//type 0为新签 1为作废重签
      },
      //添加租房合同
      rent(){
        this.$router.push({path:'/newRentContract',query:{type:'0'}});//type 0为新签 1为作废重签
      }
    }
  }
</script>

<style scoped>
  .new {
    position: absolute;
    bottom: 4em;
    right: 4em;
  }
  .choose{
    width: 100%;
    height: 2.5em;
    line-height: 2.5em;
    text-align: center;
  }
  .line{
    width: 100%;
    background-color: #666666;
    height: 1px;
  }
  .popup{
    border-radius: 5px;
    width: 50%;
  }
</style>
