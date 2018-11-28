<template>
  <div id="video1">
    <van-nav-bar  left-arrow left-text="返回"  @click-left="goBack"  />
    <div class="videoList">
      <div class="video" v-for="(item, index) in videoList" :key="index">
        <img src="../../assets/bofang1.jpg" alt="" @click="palyVideo(item.id, index)">
        <p class="videoName">{{item.video_name}}</p>
        <p class="count">
          <span>人数：{{item.play_user}}</span>
          <span>次数：{{item.play_count}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "video1",
  components: { Toast },
  data() {
    return {
      videoList: [], // 视屏列表
      // isRouterAlive: true,
      path: "",
    };
  },
  // 清除缓存
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // console.log(from.path)
      vm.path = from.path;
      vm.routerIndex(vm.path, "lejiaAlub");
      vm.ddRent(vm.path, "lejiaAlub");
    });
  },
  beforeRouteLeave(to, from, next) {
    Toast.clear();
    next();
  },
  methods: {
    // 获取视屏列表
    getVideoList() {
      Toast.loading({
        mask: true,
        duration: 10,
        message: "加载中..."
      });
      this.videoList = [];
      this.$http.get(globalConfig.server + "video/classify-video?classify_id=" + this.$route.query.classify_id).then(res => {
          if (res.data.code == "10000") {
            Toast.clear();
            this.videoList = res.data.data;
          }
        });
    },
    
    // 点击播放视屏
    palyVideo(videoId, id) {
      let file = "";
      this.videoList.forEach((item, index) => {
        if(index == id) {
          file = item.file;
        }
      })
      this.$router.push({path: "/VideoPlay", query: {video_id:videoId,filePath: file,classify_id: this.$route.query.classify_id}});
    },
    goBack() {
      window.history.go(-1);
    }
  },
  activated() {
    this.routerIndex(this.path);
    this.ddRent(this.path);
    if (this.$route.query.classify_id) {
      this.getVideoList();
    }
  },
};
</script>

<style lang="scss" scoped>
#video1 {
  font-size: 12px !important;
  .videoDetail {
    position: relative;
    height: 212px;
    // #videoRecording {
    //   // position: fixed;
    //   // top: 0;
    // }
  }
  #quan {
    width: 33px;
    height: 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #666;
    z-index: 999;
  }
  .back {
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid rgba(199, 187, 187, 0.8);
    // box-shadow: -1px 5px 5px rgba(199, 187, 187, .8);
    .van-icon {
      float: left;
      margin-top: 12px;
    }
  }
  .video {
    width: 49%;
    height: 100px;
    object-fit: fill;
    margin: 0.33%;
    display: inline-block;
    // border: 1px solid #666;
    img {
      width: 100%;
    }
    .videoName {
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      color: black;
      text-align: center;
    }
    .count {
      overflow: hidden;
      span {
        font-size: 12px;
        color: gray;
        float: right;
        padding-right: 10px;
        :first-of-type {
          float: left
        }
        :last-of-type {
          float: right;
        }
      }
    }
  }
  .videoMask {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    overflow: auto;
    display: none;
  }
  .popup {
    width: 100%;
    height: 100%;
    .commentList {
      ul {
        height: 340px;
        overflow-y: scroll;
      }
      li {
        padding: 0 10px 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #e5e5e5;
        p {
          overflow: hidden;
          margin-bottom: 10px;
          color: #969696;
          font-size: 12px;
          span:first-of-type {
            float: left;
          }
          span:last-of-type {
            float: right;
          }
        }
        .commentConent {
          padding-left: 10px;
        }
      }
    }
    .comment {
      .commentText {
        margin: 10px auto 20px;
        width: 80%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #409eff;
        border-radius: 5px;
      }
    }
    .publishComment {
      position: fixed;
      bottom: 0;
      padding-top: 20px;
      width: 100%;
      height: 148px;
      background: #fff;
      textarea {
        display: block;
        margin: auto;
        width: 80%;
        height: 60px;
        padding: 10px;
        margin-bottom: 10px;
      }
      .van-button--primary {
        float: right;
        margin-right: 7%;
        width: 70px;
        background: #409eff;
        border: 1px solid #409eff;
      }
    }
  }
}
</style>
