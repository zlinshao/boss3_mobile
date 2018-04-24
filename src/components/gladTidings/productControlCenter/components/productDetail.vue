<template>
  <div>
    <div class="banner">
      <van-swipe :autoplay="0" :show-indicators="false" @change="onChange">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <div class="img" @click="showLargePic(images,index)">
            <img :src="image"/>
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="indicators">{{imgIndex}}/{{images.length}}</div>
    </div>

    <div class="mainContent">
      <div class="content_top">
        <div class="address">
          <h3 style="font-size: .38rem;font-weight: bold">仙居雅苑1-101</h3>
          <div style="font-size: .2rem;color: #777">仙林大学城仙鹤门二号路1号</div>
          <div>
            <i class="iconfont icon-favoritesfilling"
               style="font-size: .2rem;color: #FFD000" v-for="item in 5">
            </i>
            <span class="otherInfo">首次出租</span>
            <span class="otherInfo">一般出租</span>
          </div>
        </div>
        <div class="rentStatus">
          <div style="width: 100%;font-size: .33rem;font-weight: bold;color: #e4393c">未出租</div>
          <div style="font-size: .2rem;color: #777">已空置 15天</div>
        </div>
      </div>

      <div class="content_other">
        <div>87m²</div>
        <div>3/8层</div>
        <div>2室1厅1卫</div>
        <div>南北</div>
      </div>

      <div class="more_detail">
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">方式 : </van-col>
              <van-col span="16" class="value">整租</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">负责人 : </van-col>
              <van-col span="12" class="value">李智勋</van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">装修 : </van-col>
              <van-col span="16" class="value">整租</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">所属部门 : </van-col>
              <van-col span="12" class="value">李智勋</van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">类型 : </van-col>
              <van-col span="16" class="value">房屋剩余时长</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">房屋剩余时长 : </van-col>
              <van-col span="12" class="value">李智勋</van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">特色 : </van-col>
              <van-col span="16" class="value">整租</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">租晚于收结束 : </van-col>
              <van-col span="12" class="value">李智勋</van-col>
            </van-row>
          </van-col>
        </van-row>
      </div>

      <div class="house_set">
        <div class="title">房屋配套</div>
        <div>
          <van-row  class="house_set_item">
            <van-col span="4" class="key">装修 : </van-col>
            <van-col span="20" class="value">
              沙发*1, 晾衣架*1, 餐桌*1, 椅子*2, 床+床垫(齐全), 衣柜(不齐), 窗帘(齐全)
            </van-col>
          </van-row>
          <van-row  class="house_set_item">
            <van-col span="4" class="key">家电 : </van-col>
            <van-col span="20" class="value">
              沙发*1, 晾衣架*1, 餐桌*1, 椅子*2, 床+床垫(齐全), 衣柜(不齐), 窗帘(齐全)
            </van-col>
          </van-row>
          <van-row  class="house_set_item">
            <van-col span="4" class="key">其他 : </van-col>
            <van-col span="20" class="value">
              沙发*1, 晾衣架*1, 餐桌*1, 椅子*2, 床+床垫(齐全), 衣柜(不齐), 窗帘(齐全)
            </van-col>
          </van-row>
        </div>
      </div>

      <div class="house_img">
        <div class="img_title">
          <div class="title">房屋照片</div>
          <div class="more"  @click="router('img')">查看更多></div>
        </div>
        <div class="imgContent">
         <div class="imgItem" v-for="item in 4">
           <img src="../../../../assets/doc.png" style="width: 1.2rem;height: 1.2rem" alt="">
           <div style="font-size: .24rem;color: #777">17/10/23</div>
         </div>
        </div>
      </div>

      <div class="house_contract">
        <div class="contract_title">
          <div class="title">相关合同</div>
          <div class="more" @click="router('contract')">查看更多></div>
        </div>
        <div class="contractInfo" v-for="item in 2">
          <van-row class="contractItem">
            <van-col class="itemWord" span="6">房屋地址 : </van-col>
            <van-col class="itemWord" span="18">天华硅谷12-3-301</van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col class="itemWord" span="6">合同状态 : </van-col>
            <van-col class="itemWord" span="18">天华硅谷12-3-301</van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">报备时间 : </van-col>
                <van-col class="itemWord" span="14">天华</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">签约时长 : </van-col>
                <van-col class="itemWord" span="14">天华硅谷12</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">开单人 : </van-col>
                <van-col class="itemWord" span="14">天华</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">客户姓名 : </van-col>
                <van-col class="itemWord" span="14">天华硅谷12-3</van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="contractItem">
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">所属部门 : </van-col>
                <van-col class="itemWord" span="14">天华</van-col>
              </van-row>
            </van-col>
            <van-col span="12">
              <van-row>
                <van-col class="itemWord" span="10">结束时间 : </van-col>
                <van-col class="itemWord" span="14">天华硅谷12</van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';
  export default {
    name: 'hello',
    components: {ImagePreview, Toast},
    data () {
      return {
        imgIndex: 1,
        images: [
          'http://p17.qhimg.com/bdr/__/t015202cb89cc16b344.jpg',
          'http://img.zcool.cn/community/03872d6599bde0ca80121ad7bcf0095.jpg',
          'http://pic.5442.com/2012/0809/19/14.jpg',
        ]
      }
    },
    methods: {
      onChange(index){
        this.imgIndex = index + 1;
      },
      router(val){
        if(val == 'img'){
          this.$router.push('/imgDetail');
        }else {
          this.$router.push('/contractDetail');
        }
      },
      showLargePic(images,index){
        ImagePreview(images,index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .flex {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  .banner {
    width: 100%;
    height: 4.2rem;
    position: relative;
    box-sizing: border-box;
    .img {
      img {
        width: 100%;
        height: 4.2rem;
      }
    }
    .indicators {
      display: inline-block;
      color: #FFFFFF;
      background: #666;
      border-radius: 4px;
      height: .35rem;
      width: .7rem;
      text-align: center;
      line-height: .35rem;
      position: absolute;
      bottom: .2rem;
      right: .3rem;
      font-size: 0.2rem;
    }
  }

  .mainContent {
    padding: 0 .15rem;
    .content_top {
      padding: .4rem 0 0.3rem 0;
      border-bottom: 1px solid #ddd;
      @extend .flex;
      flex-wrap: wrap;
      .address {
        width: 75%;
        > div {
          padding: .15rem 0;
        }
        .otherInfo {
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 2px;
          margin-right: .1rem;
          font-size: .2rem;
          display: inline-block;
        }
      }
      .rentStatus {
        > div {
          padding: .1rem 0;
        }
        width: 25%;
        @extend .flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: center;
      }
    }

    .content_other {
      color: #777;
      @extend .flex;
      > div {
        flex-grow: 1;
        height: .4rem;
        line-height: .4rem;
        text-align: center;
        margin: .15rem 0;
        border-right: 1px solid #DDDDDD;
        &:last-child {
          border: none;
        }
      }
      border-bottom: 1px solid #DDDDDD;
    }
    .more_detail {
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .row_item {
        padding: .1rem 0;
        .key {
          color: #777;
          text-align: right;
          font-size: .26rem;
        }
        .value{
          text-align: left;
          font-size: .26rem;
        }
      }
    }

    .house_set{
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .title{
        font-weight: bold;
      }
      .house_set_item{
        padding: .15rem 0;
        .key {
          color: #777;
          font-size: .28rem;
        }
        .value{
          font-size: .28rem;
          line-height: 130%;
        }
      }
    }

    .house_img{
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .img_title{
        @extend .flex;
        justify-content: space-between;
        .title{
          font-weight: bold;
        }
        .more{
          color: #777;
          font-size: .24rem;
        }
      }
      .imgContent{
        padding: .2rem 0;
        @extend .flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .imgItem{
          text-align: center;
          padding-bottom: .2rem;
        }
      }
    }

    .house_contract{
      padding: .3rem 0;
      .contract_title{
        @extend .flex;
        justify-content: space-between;
        .title{
          font-weight: bold;
        }
        .more{
          color: #777;
          font-size: .24rem;
        }
      }
      .contractInfo{
        border-bottom: 1px solid #DDDDDD;
        &:last-child{
          border: none;
        }
        padding: .2rem 0;
        .contractItem{
          padding: .05rem 0;
          .itemWord{
            font-size: .28rem;
          }
        }
      }
    }
  }
</style>
