<template>
  <div>
    <div class="banner">
      <div v-if="albumData.length<1&&detailData.house_goods&&detailData.house_goods.photo">
        <van-swipe :autoplay="0" :show-indicators="false" @change="onChange">
          <van-swipe-item v-if="detailData.house_goods"
                          v-for="(image, index) in detailData.house_goods.photo" :key="index">
            <div class="img" @click="showLargePic(detailData.house_goods.photo,index)">
              <img v-if="image.info.mime&&image.info.mime.indexOf('image')>-1" :src="image.uri"/>
              <img v-else src="../../../../assets/file.png" alt="">
            </div>
          </van-swipe-item>
        </van-swipe>
        <div class="indicators">{{imgIndex}}/{{detailData.house_goods.photo.length}}</div>
      </div>
      <div class="img" v-if="!detailData.house_goods && albumData.length<1">
        <img src="../../../../assets/file.png" alt="">
      </div>
      <div v-if="albumData.length>0">
        <van-swipe :autoplay="0" :show-indicators="false" @change="onChange">
          <van-swipe-item v-for="(image, index) in albumData[albumData.length-1].album.album_file" :key="index">
            <div class="img" @click="showLargePic(albumData[albumData.length-1].album.album_file,index)">
              <img v-if="image.info.mime&&image.info.mime.indexOf('image')>-1" :src="image.uri"/>
              <img v-else src="../../../../assets/file.png" alt="">
            </div>
          </van-swipe-item>
        </van-swipe>
        <div class="indicators">{{imgIndex}}/{{albumData[albumData.length-1].album.album_file.length}}</div>
      </div>
    </div>

    <div class="mainContent">
      <div class="content_top">
        <div class="address">
          <h3>
            <span v-if="detailData.community">{{detailData.community.name}}</span>
            <span>{{detailData.door_address}}</span>
          </h3>
          <div style="font-size: .2rem;color: #777"  v-if="detailData.community">
            {{detailData.community.detailed_address}}
          </div>
          <div>
            <i class="iconfont icon-favoritesfilling"
               style="font-size: .2rem;color: #FFD000" v-for="item in 5">
            </i>
            <span class="otherInfo">
              <span v-if="detailData.is_again_rent>0">二次出租</span>
              <span v-else="">首次出租</span>
            </span>
            <span class="otherInfo" v-if="detailData.house_feature">
              {{matchDictionary(detailData.house_feature)}}
            </span>
          </div>
        </div>
        <div class="rentStatus">
          <div style="width: 100%;font-size: .33rem;font-weight: bold;color: #e4393c">
            <span style="color: #1ecb4e" v-if="detailData.status==1">已出租</span>
            <span v-else-if="detailData.status == 2">待收房</span>
            <span style="color: #ef4292" v-else="">未出租</span>
          </div>
          <div style="font-size: .2rem;color: #777" v-if="detailData.current_ready_days">
            已空置 {{detailData.current_ready_days}}天
          </div>
        </div>
      </div>

      <div class="content_other">
        <div>{{detailData.area}}</div>
        <div v-if="detailData.floor">{{detailData.floor.this}}/{{detailData.floor.all}}层</div>
        <div v-if="detailData.house_type">{{detailData.house_type[0]}}室{{detailData.house_type[1]}}厅{{detailData.house_type[2]}}卫</div>
        <div v-if="detailData.direction">{{detailData.direction.name}}</div>
      </div>

      <div class="more_detail">
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">方式 :</van-col>
              <van-col span="16" class="value">/</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">负责人 :</van-col>
              <van-col span="12" class="value" v-if="detailData.staffs">{{detailData.staffs.name}}</van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">装修 :</van-col>
              <van-col span="16" class="value">{{matchDictionary(detailData.decorate)}}</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">所属部门 :</van-col>
              <van-col span="12" class="value" v-if="detailData.department">{{detailData.department.name}}</van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">类型 :</van-col>
              <van-col span="16" class="value" v-if="detailData.property_type">{{detailData.property_type.name}}</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">房屋剩余时长 :</van-col>
              <van-col span="12" class="value">{{detailData.lord_remainder_days}}天</van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="row_item">
          <van-col span="10">
            <van-row>
              <van-col span="8" class="key">特色 :</van-col>
              <van-col span="16" class="value">{{matchDictionary(detailData.house_feature)}}</van-col>
            </van-row>
          </van-col>
          <van-col span="14">
            <van-row>
              <van-col span="12" class="key">租晚于收结束 :</van-col>
              <van-col span="12" class="value">
                <span v-if="detailData.rent_end_than_days>0">晚于{{detailData.rent_end_than_days}}天</span>
                <span v-else-if="detailData.rent_end_than_days<0">否</span>
                <span v-else="">/</span>
              </van-col>
            </van-row>
          </van-col>
        </van-row>
      </div>

      <div class="house_set" v-if="detailData.house_goods">
        <div class="title">房屋配套</div>
        <div>
          <van-row class="house_set_item">
            <van-col span="4" class="key">装修 :</van-col>
            <van-col span="20" class="value">
              沙发*{{detailData.house_goods.sofa}}, 晾衣架*{{detailData.house_goods.clothe_rack}},
              餐桌*{{detailData.house_goods.dining_table}}, 椅子*{{detailData.house_goods.chair}},
              床+床垫(<span v-if="detailData.house_goods.bed">齐全</span><span v-else="">不齐</span>),
              衣柜(<span v-if="detailData.house_goods.wardrobe_remark">齐全</span><span v-else="">齐全</span>),
              窗帘(<span v-if="detailData.house_goods.curtain">齐全</span><span v-else="">齐全</span>)
            </van-col>
          </van-row>
          <van-row class="house_set_item">
            <van-col span="4" class="key">家电 :</van-col>
            <van-col span="20" class="value">
              空调*{{detailData.house_goods.air_condition}}, 冰箱*{{detailData.house_goods.fridge}},
              电视*{{detailData.house_goods.television}}, 燃气灶*{{detailData.house_goods.gas_stove}},
              油烟机*{{detailData.house_goods.hood}}, 微波炉*{{detailData.house_goods.microwave}},
              洗衣机*{{detailData.house_goods.wash_machine}}, 热水器*{{detailData.house_goods.water_heater}}
            </van-col>
          </van-row>
          <van-row class="house_set_item">
            <van-col span="4" class="key">其他 :</van-col>
            <van-col span="20" class="value">
              <span v-if="detailData.house_goods.heater">暖气,</span><span v-else=""></span>
              <span v-if="detailData.house_goods.gas">天然气,</span><span v-else=""></span>
              <span v-if="detailData.house_goods&&detailData.house_goods.other_furniture!='无'">
                {{detailData.house_goods.other_furniture}}
              </span>
            </van-col>
          </van-row>
        </div>
      </div>

      <div class="house_img">
         <div class="img_title">
           <div class="title">房屋照片</div>
           <div class="more" v-if="albumData.length>3" @click="router('img',detailData.id)">查看更多></div>
         </div>
         <div class="imgContent">
           <div class="imgItem" v-for="(item,index) in albumData" v-if="index<4"
                @click="showLargePic(item.album.album_file,0)">
             <div v-if="item.album.album_file[0].info.mime&&item.album.album_file[0].info.mime.indexOf('image')>-1">
               <img :src="item.album.album_file[0].uri" style="width: 1.2rem;height: 1.2rem" alt="">
               <div style="font-size: .24rem;color: #777">{{item.create_time.split(' ')[0]}}</div>
             </div>
           </div>
           <div class="imgItem" v-if="albumData.length<4 && detailData.house_goods"
                @click="showLargePic(detailData.house_goods.photo,0)">
             <div v-if="detailData.house_goods.photo[0].info.mime&&detailData.house_goods.photo[0].info.mime.indexOf('image')>-1">
               <img :src="detailData.house_goods.photo[0].uri" style="width: 1.2rem;height: 1.2rem" alt="">
               <div style="font-size: .24rem;color: #777">{{detailData.create_time.split(' ')[0]}}</div>
             </div>
           </div>
         </div>
      </div>
      <div class="house_img" v-if="videoArray.length>0">
        <div class="img_title">
          <div class="title">视频影像</div>
        </div>
        <div class="imgContent">
          <div class="imgItem" v-for="(item,index) in videoArray">
            <img src="../../../../assets/video.jpg" @click="checkTv(item.uri)" style="width: 1.2rem;height: 1.2rem" alt="">
          </div>
        </div>
      </div>

      <div id="videoId" v-if="videoSrc !== ''">
        <video style="position: absolute; top: 6%;left: 5%;" :src="videoSrc" muted controls autoplay width="90%" height="100%"></video>
        <p class="close" @click="checkTv('')"><i class="iconfont icon-cuowutishi"></i></p>
      </div>

      <div class="house_contract">
        <div class="contract_title">
         <div class="title">相关合同</div>
         <div class="more" @click="router('contract',detailData.id)" v-if="lords.length>1 || renters.length>1">查看更多>
         </div>
        </div>
        <div class="contractInfo" v-if="lords.length>0">
         <van-row class="contractItem">
           <van-col class="itemWord" span="5">合同编号 :</van-col>
           <van-col class="itemWord" span="19">{{lords[0].contract_number}}</van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col class="itemWord" span="5">合同状态 :</van-col>
           <van-col class="itemWord" span="19">
             <span v-if="lords[0].status == 1">未签约</span>
             <span v-else-if="lords[0].status == 2">已签约</span>
             <span v-else-if="lords[0].status == 3">快到期(60天内)</span>
             <span v-else-if="lords[0].status == 4">已结束</span>
             <span v-else-if="lords[0].status == 5">已过期</span>
             <span v-else="">/</span>
           </van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">报备时间 :</van-col>
               <van-col class="itemWord" span="14">{{lords[0].created_at.split(' ')[0]}}</van-col>
             </van-row>
           </van-col>
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">签约时长 :</van-col>
               <van-col class="itemWord" span="14">{{lords[0].duration_days}}天</van-col>
             </van-row>
           </van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">开单人 :</van-col>
               <van-col class="itemWord" span="14">{{lords[0].sign_user.name}}</van-col>
             </van-row>
           </van-col>
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">客户姓名 :</van-col>
               <van-col class="itemWord" span="14">{{lords[0].customers.name}}</van-col>
             </van-row>
           </van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">所属部门 :</van-col>
               <van-col class="itemWord" span="14">{{lords[0].sign_org.name}}</van-col>
             </van-row>
           </van-col>
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">结束时间 :</van-col>
               <van-col class="itemWord" span="14">{{lords[0].end_at}}</van-col>
             </van-row>
           </van-col>
         </van-row>
        </div>
        <div class="contractInfo" v-else=""
            style="text-align: center;font-size: .5rem;color: #777;height: 3rem;line-height: 3rem">
         暂无生效收房合同
        </div>

        <div class="contractInfo" v-if="renters.length>0">
         <van-row class="contractItem">
           <van-col class="itemWord" span="5">合同编号 :</van-col>
           <van-col class="itemWord" span="19">{{renters[0].contract_number}}</van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col class="itemWord" span="5">合同状态 :</van-col>
           <van-col class="itemWord" span="19">
             <span v-if="renters[0].status == 1">未签约</span>
             <span v-else-if="renters[0].status == 2">已签约</span>
             <span v-else-if="renters[0].status == 3">快到期(60天内)</span>
             <span v-else-if="renters[0].status == 4">已结束</span>
             <span v-else-if="renters[0].status == 5">已过期</span>
             <span v-else="">/</span>
           </van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">报备时间 :</van-col>
               <van-col class="itemWord" span="14">{{renters[0].created_at.split(' ')[0]}}</van-col>
             </van-row>
           </van-col>
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">签约时长 :</van-col>
               <van-col class="itemWord" span="14">{{renters[0].duration_days}}天</van-col>
             </van-row>
           </van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">开单人 :</van-col>
               <van-col class="itemWord" span="14">{{renters[0].sign_user.name}}</van-col>
             </van-row>
           </van-col>
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">客户姓名 :</van-col>
               <van-col class="itemWord" span="14">{{renters[0].customers.name}}</van-col>
             </van-row>
           </van-col>
         </van-row>
         <van-row class="contractItem">
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">所属部门 :</van-col>
               <van-col class="itemWord" span="14">{{renters[0].sign_org.name}}</van-col>
             </van-row>
           </van-col>
           <van-col span="12">
             <van-row>
               <van-col class="itemWord" span="10">结束时间 :</van-col>
               <van-col class="itemWord" span="14">{{renters[0].end_at}}</van-col>
             </van-row>
           </van-col>
         </van-row>
        </div>
        <div class="contractInfo" v-else=""
             style="text-align: center;font-size: .5rem;color: #777;height: 3rem;line-height: 3rem">
          暂无生效租房合同
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
    data() {
      return {
        imgIndex: 1,
        detailData: {},
        albumData: [],
        lords: [],
        renters: [],
        videoArray : [],

        videoSrc: '',
      }
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = false;
      Toast.clear();
      if (to.path === '/imgDetail' || to.path === '/contractDetail' || to.path === '/productControlCenter') {
        next();
      } else {
        next({ path: '/productControlCenter'});
      }
    },

    mounted() {
      this.getData();
      this.getDictionary();
    },

    methods: {
      //字典匹配
      getDictionary() {
        this.$http.get(globalConfig.server + 'setting/dictionary/all').then((res) => {
          this.all_dic = res.data.data;
        })
      },

      matchDictionary(id) {
        let dictionary_name = null;
        this.all_dic.map((item) => {
          if (item.id == id) {
            dictionary_name = item.dictionary_name;
          }
        });
        return dictionary_name;
      },
      checkTv(val) {
        alert(val)
        this.videoSrc = val;
      },
      getData() {
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.detailData = [];
        this.albumData = [];
        this.albumData = [];
        this.lords = [];
        this.renters = [];
        this.videoArray = [];
        this.$http.get(globalConfig.server + 'house/album/' + this.$route.query.id).then((res) => {
          if (res.data.code === '30070') {
            Toast.clear();
            this.detailData = res.data.data.detail;
            this.albumData = res.data.data.album;
            this.lords = res.data.data.detail.lords;
            this.renters = res.data.data.detail.renters;
            this.videoArray = this.getVideo(res.data.data);
          } else {

          }
        }).catch((error)=>{
          Toast.fail("详情获取失败！");
        })
      },
      //筛选视频
      getVideo(data){
        let videoArray = [];
        if(data.album.length>0){
          data.album.forEach((item) => {
            if(item.album.album_file.length>0){
              let album = item.album.album_file;
              album.forEach((image)=>{
                if(image.info.mime.indexOf('video')>-1){
                  videoArray.push(image);
                }
              })
            }
          })
        }
        if(data.detail&&data.detail.house_goods){
          let houseGoods = data.detail.house_goods;
          if(houseGoods.photo.length>0){
            houseGoods.photo.forEach((image)=>{
              if(image.info.mime.indexOf('video')>-1){
                videoArray.push(image);
              }
            })
          }
        }

        return videoArray;
      },
      //**********************
      onChange(index) {
        this.imgIndex = index + 1;
      },
      router(val, id) {
        if (val == 'img') {
          this.$router.push({path: '/imgDetail', query: {id: id}});
        } else {
          this.$router.push({path: '/contractDetail', query: {id: id}});
        }
      },
      showLargePic(images, index) {
        let imgArray = [];
        images.forEach((item) => {
          if(item.info.mime.indexOf('image')>-1){
            imgArray.push(item.uri);
          }
        });
        ImagePreview(imgArray, index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  @mixin flex {
    display: flex;
    display: -webkit-flex;
  }

  @mixin border_radius($p) {
    -webkit-border-radius: $p;
    -moz-border-radius: $p;
    border-radius: $p;
  }

  @mixin scale($p) {
    -moz-transform: scale($p, $p);
    -webkit-transform: scale($p, $p);
    -o-transform: scale($p, $p);
    transform: scale($p, $p);
  }

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
      img , video{
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
    padding: 0 .3rem;
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
        h3 {
          span {
            font-size: .38rem;
            font-weight: bold
          }
        }
        .otherInfo {
          span {
            font-size: .2rem;
          }
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
        .value {
          text-align: left;
          font-size: .26rem;
        }
      }
    }

    .house_set {
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .title {
        font-weight: bold;
      }
      .house_set_item {
        padding: .15rem 0;
        .key {
          color: #777;
          font-size: .28rem;
        }
        .value {
          font-size: .28rem;
          line-height: 130%;
        }
      }
    }

    .house_img {
      padding: .3rem 0;
      border-bottom: 1px solid #DDDDDD;
      .img_title {
        @extend .flex;
        justify-content: space-between;
        .title {
          font-weight: bold;
        }
        .more {
          color: #777;
          font-size: .24rem;
        }
      }
      .imgContent {
        padding: .2rem 0;
        @extend .flex;
        flex-wrap: wrap;
        .imgItem {
          width: 25%;
          text-align: center;
          padding-bottom: .2rem;
        }
      }
    }

    .house_contract {
      padding: .3rem 0;
      .contract_title {
        @extend .flex;
        justify-content: space-between;
        .title {
          font-weight: bold;
        }
        .more {
          color: #777;
          font-size: .24rem;
        }
      }
      .contractInfo {
        border-bottom: 1px solid #DDDDDD;
        &:last-child {
          border: none;
        }
        padding: .2rem 0;
        .contractItem {
          padding: .05rem 0;
          .itemWord {
            font-size: .28rem;
            line-height: 130%;
          }
        }
      }
    }

    #videoId {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      @include flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 1);
      z-index: 10000;
      .close {
        position: absolute;
        width: .8rem;
        height: .8rem;
        text-align: center;
        line-height: .8rem;
        @include border_radius(50%);
        /*background-color: rgba(0, 0, 0, .8);*/
        bottom: 1rem;
        /*border: 1px solid rgba(255, 255, 255, .8);*/
        right: 2%;
        top: 2%;
        transform: translate(-50%);
        i {
          color: #FFFFFF;
          font-size: .6rem;
        }
      }
    }
  }



</style>
