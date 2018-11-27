<template>
  <div id="lejiaAlub">
    <!-- <div class="videoTop">
      <van-button type="danger" size="small">视屏分类</van-button>
    </div> -->
    <!-- <div class="back"><van-icon name="arrow-left" @click="goBack" />教学视频</div> -->
    <!-- <van-nav-bar title="教学视频"  left-arrow left-text="返回"  @click-left="goBack"  /> -->
    <div class="videoAlbum">
      <van-row gutter="20">
        <van-col span="12" v-for="(item, index) in videoAlbumlist" :key="index">
          <div class="videoAlbumList">
            <img :src="item.cover" @click="toVideoDetail(item.id,item.name)" v-if="item.cover" >
            <img src="../../assets/default1.png" @click="toVideoDetail(item.id,item.name)" v-else >
            <span>{{item.name}}</span>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import {Toast} from 'vant';
export default {
  name: "lejiaAlub",
   components: {Toast},
  data() {
    return {
      videoAlbumlist: [], // 视屏分类
      videoList: [],
      AlbumName: ""
    };
  },
   //详情页不做缓存
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('');
        vm.ddRent('');
      })
    },
    beforeRouteLeave(to, from, next) {
      Toast.clear();
      next();
    },
  methods: {
    // 视屏相册分类
    getVideoAlbum() {
      this.$http.get(globalConfig.server + "video/list").then(res => {
        if (res.data.code == "10000") {
          this.videoAlbumlist = res.data.data;
        }
      });
    },
    //  跳转视屏详情页
    toVideoDetail(id,name) {
      if(id) {
        this.$router.push({ path: "/LejiaUniversity", query: { classify_id: id} });
      }
    },
    goBack() {
      window.history.go(-1);
    }
  },
  created() {
    this.getVideoAlbum();
  }
};
</script>

<style lang="scss" scoped>
#lejiaAlub {
  overflow: hidden;
  .back {
    padding-left: 20px;
    height:  40px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid rgba(199, 187, 187, .8);
    // box-shadow: -1px 5px 5px rgba(199, 187, 187, .8);
    .van-icon {
      float: left;
      margin-top: 12px;
    }
  }
  .videoTop {
    padding: 10px;
    width: 100%;
    height: 52px;
    border-bottom: 1px solid rgba(102, 102, 102, 0.5);
  }
  .videoAlbum {
    padding-top: 20px;
  }
  .videoAlbumList {
    text-align: center;
    width: 100%;
    height: 120px;
    img {
      width: 100%;
      height: 60%;
    }
    span {
      margin-top: 10px;
    }
  }
}
</style>
