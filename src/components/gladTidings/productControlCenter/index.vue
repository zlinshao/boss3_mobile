<template>
  <div id="house">
    <div class="header">
      <div>
        <van-search
          show-action
          @search="onSearch">
          <div slot="action" @click="onSearch" style="padding: 0 .2rem">搜索</div>
        </van-search>
      </div>
      <div class="filter">
        <div class="filter_item" @click="openSelectModal('first')">
          {{houseStatusName}}<i class="iconfont icon-xiayibu rotate"/>
        </div>
        <div class="filter_item" @click="openSelectModal('forth')">
          所属部门<i class="iconfont icon-xiayibu rotate"/>
        </div>
        <div class="filter_item" @click="openSelectModal('second')">
          房型<i class="iconfont icon-xiayibu rotate"/>
      </div>
        <div class="filter_item" @click="openSelectModal('third')">
          筛选<i class="iconfont icon-xiayibu rotate"/>
        </div>
      </div>
    </div>

    <div class="mainContent">
      <div class="houseItem" @click="searchDetail" v-for="item in 10">
        <div class="image">
          <img src="../../../assets/doc.png" alt="">
        </div>
        <div class="houseItemDescribe">
          <div style="font-weight: bold">仙居雅苑1-101</div>
          <div>
            <i class="iconfont icon-favoritesfilling"
                  style="font-size: 0.2rem;color: #FFD000;" v-for="item in 5">
            </i>
            <span style="font-size: 0.2rem;margin-left: .2rem">精装/住宅</span>
            <span style="color: #ff3f77;font-weight: bold;float: right">未出租</span>
          </div>
          <div>
            <span style="font-size: 0.2rem">87m²</span>
            <span style="font-size: 0.2rem;margin: 0 .1rem">丨</span>
            <span style="font-size: 0.2rem">3/8层</span>
            <span style="font-size: 0.2rem;margin: 0 .1rem">丨</span>
            <span style="font-size: 0.2rem">2室1厅1卫</span>
          </div>
          <div class="otherInfo">
            <span>余 369天</span>
            <span>首次出租</span>
            <span>西北</span>
            <span>一般出租</span>
          </div>
        </div>
      </div>
    </div>


    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="top" :overlay="true">
      <div v-if="filterType == 'first'">
        <ul style="line-height: 40px;padding: 0 10px">
          <li :class="activeIndex==index?'active':''" v-for="(item,index) in columns"
              @click="selectHouseStatus(item,index)">{{item}}</li>
        </ul>
      </div>
      <div class="filterModal" v-if="filterType == 'second'">
        <div class="title">房型</div>
        <div class="label_box">
          <span class="label">不限</span>
          <span class="label">1室</span>
          <span class="label">2室</span>
          <span class="label">2室+</span>
        </div>
        <div class="title">装修</div>
        <div class="label_box">
          <span class="label">不限</span>
          <span class="label">毛坯</span>
          <span class="label">简装</span>
          <span class="label">精装</span>
          <span class="label">豪装</span>
        </div>

        <div class="title">房屋评分</div>
        <div class="label_box">
          <span class="label">不限</span>
          <span class="label">毛坯</span>
          <span class="label">简装</span>
          <span class="label">精装</span>
          <span class="label">豪装</span>
        </div>
        <div class="title">朝向</div>
        <div class="label_box">
          <span class="label">不限</span>
          <span class="label">毛坯</span>
          <span class="label">简装</span>
          <span class="label">精装</span>
          <span class="label">豪装</span>
          <span class="label">豪装</span>
          <span class="label">豪装</span>
          <span class="label">豪装</span>
          <span class="label">豪装</span>
        </div>

        <div class="footer">
          <div class="">重置</div>
          <div class="">确定</div>
        </div>
      </div>
      <div class="filterModal" v-if="filterType == 'third'">
        <div class="title">房屋剩余时长</div>
        <div class="label_box">
          <span class="label">不限</span>
          <span class="label">1室</span>
          <span class="label">2室</span>
          <span class="label">2室+</span>
        </div>
        <div class="title">预警状态</div>
        <div class="label_box">
          <span class="label">不限</span>
          <span class="label">毛坯</span>
          <span class="label">简装</span>
          <span class="label">精装</span>
          <span class="label">豪装</span>
        </div>

        <div class="title">当前空置时长</div>
        <div class="label_box">
          <span class="label">不限</span>
          <span class="label">毛坯</span>
          <span class="label">简装</span>
          <span class="label">精装</span>
          <span class="label">豪装</span>
          <span class="label">豪装</span>
          <span class="label">豪装</span>
          <span class="label">豪装</span>
        </div>

        <div class="footer">
          <div class="">重置</div>
          <div class="">确定</div>
        </div>
      </div>

      <div v-if="filterType == 'forth'">
        <Organization ></Organization>
      </div>
    </van-popup>


  </div>
</template>

<script>
  import Organization from '../../common/organization.vue'
  export default {
    name: 'house',
    components:{Organization},
    data () {
      return {
        selectHide: false,
        columns: ['房屋状态','杭州', '宁波', '温州', '嘉兴', '湖州'],
        activeIndex : '',
        houseStatusName:'房屋状态',
        filterType:'',
      }
    },
    mounted(){
      $('.label').click(function () {
        $(this).addClass('selected_tr').siblings().removeClass('selected_tr');
      });
    },
    watch:{
      selectHide(val){
        if(val){
          document.getElementsByTagName('body')[0].className = 'showContainer';
        }else {
          document.getElementsByTagName('body')[0].className = '';
        }
      }
    },
    methods: {
      onSearch(){
        console.log(222)
      },
      openSelectModal(val){
        if(!this.filterType){
          this.filterType = val;
          this.selectHide = true
        }else {
          if(this.filterType == val){
            this.selectHide = !this.selectHide;
          }else {
            this.filterType = val;
            this.selectHide = true;
          }
        }
      },
      selectHouseStatus(item,index){
        this.activeIndex = index;
        this.houseStatusName = item;
      },
      searchDetail(){
        this.$router.push('/productDetail');
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .flex {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  .rotate {
    margin-left: 2px;
    transform: rotate(90deg);
  }

  .van-popup--top {
    top: 83px !important;
  }
  .active{
    color: #409EFF;
  }
  .selected_tr{
    background: #409EFF;
  }
  #house {
    background: #FFFFFF;
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 99999;
      background: #FFFFFF;
      .filter {
        width: 100%;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        @extend .flex;
        .filter_item {
          font-size: .25rem;
          width: 25%;
          height: 30px;
          border-right: 1px solid #eee;
          @extend .flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .mainContent{
      margin-top: 83px;
      .houseItem{
        padding: .3rem .15rem .3rem .15rem;
        border-bottom: 1px solid #eee;
        @extend .flex;
        img{
          width: 1.6rem;
          height: 1.2rem;
          margin-right: .2rem;
        }
        .houseItemDescribe{
          flex-grow: 1;
          >div{
            margin-bottom: 6px;
            span{
              color: #999;
            }
          }
          .otherInfo{
            margin: .2rem 0 0 0;
            span{
              border: 1px solid #ccc;
              border-radius: 3px;
              padding: 2px;
              margin-right: .1rem;
              font-size: .2rem;
              display: inline-block;
            }
          }
        }
      }
    }

    .filterModal{
      padding:0 .3rem .3rem .3rem;
      margin-bottom: 1.2rem;
      color: #777;
      .title{
        text-align: center;
        margin-top: .3rem;
      }
      .label_box{
        @extend .flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .label{
          margin-top: .3rem;
          display: inline-block;
          min-width: 1.5rem;
          font-size: .2rem;
          padding: .15rem 0;
          text-align: center;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      }
    }
  }
</style>
