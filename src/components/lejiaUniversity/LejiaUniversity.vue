<template>
  <div id="video">
    <!-- <div class="back"><van-icon name="arrow-left" @click="goBack" />{{titleName}}</div> -->
      <van-nav-bar :title="titleName"  left-arrow left-text="返回"  @click-left="goBack"  />
    <div class="videoList">
      <div class="video" v-for="(item, index) in videoList" :key="index">
        <video :src="item.file" width="100%" height="100%" @click.stop="palyVideo(item.id, index)"></video>
        <p class="videoName">{{item.video_name}}</p>
        <p class="count">
          <span>人数：{{item.play_user}}</span>
          <span>次数：{{item.play_count}}</span>
        </p>
        <!-- <img src="../../assets/chexiao.png" alt="" "> -->
      </div>
    </div>
    <!-- 遮罩 -->
    <van-popup v-model="show" position="right" :overlay="false" class="popup">
      <van-nav-bar :title="videoTitle" left-text="返回"  left-arrow @click-left="onClickLeft"  />
      <div style="position: relative">
        <div class="videoDetail"></div>
        <div id="quan" @click="fullScreen">全屏</div>
      </div>
      <div class="comment">评论</div>
      <div class="commentList">
        <ul>
          <li v-for="(item, index) in commentList.list" :key="index">
            <p class="commentName">
              <span>{{item.user.name}}</span>
              <span>{{item.create_time}}</span>
            </p>
            <div class="commentConent">{{item.content}}</div>
          </li>
        </ul>
      </div>
      <div class="publishComment">
        <textarea v-model="params.content" placeholder="请输入评论..." style="resize:none"></textarea>
        <van-button type="primary" size="small" @click="publishComment">发表评论</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "video",
  components: { Toast },
  data() {
    return {
      videoList: [], // 视屏列表
      scale: 0.3,
      videoAlbumId: "",
      countId: "",
      titleName: "",
      videoTitle: "",
      show: false,
      commentList: [],
      params: {
        video_id: "",
        content: ""
      }
    };
  },
  // 清除缓存
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.routerIndex("lejiaUniversity", "lejiaAlub");
      vm.ddRent("lejiaUniversity", "lejiaAlub");
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
      this.$http
        .get(
          globalConfig.server +
            "video/classify-video?classify_id=" +
            this.$route.query.classify_id
        )
        .then(res => {
          if (res.data.code == "10000") {
            Toast.clear();
            this.videoList = res.data.data;
          }
        });
    },
    // 播放次数
    getCount(id) {
      this.$http
        .post(globalConfig.server + "video/play-video", { video_id: id })
        .then(res => {
          if (res.data.code == "10000") {
            // Toast(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        });
    },
    // 点击播放视屏
    palyVideo(videoId, id) {
      this.show = true;
      var mobileWidth = document.body.clientWidth;
      var mobileHeight = document.body.clientHeight;
      var video = $("<video id='videoRecording' controlsList='nodownload'></video>");
      video.css({
        width: mobileWidth + "px"
      });
      this.videoList.forEach((item, index) => {
        if (index == id) {
          $(".videoDetail").append(video);
          video.attr("src", item.file);
          this.videoTitle = item.video_name
        }
      });
      this.params.video_id = videoId;
      var video = document.getElementById("videoRecording");
      let _this = this
      video.onclick = function() {
        video.play();
        _this.getCount(videoId);
      }
      this.getComment(videoId);
    },
    // 获取评论
    getComment(id) {
      this.$http.get(globalConfig.server + "video/comment/" + id).then(res => {
        if (res.data.code == "10000") {
          this.commentList = res.data.data;
        }
      });
    },
    // 发表评论
    publishComment() {
      this.$http
        .post(globalConfig.server + "video/comment", this.params)
        .then(res => {
          if (res.data.code == "10000") {
            Toast(res.data.msg);
            this.getComment(this.params.video_id);
            this.params.content = ""
          }
        });
    },
    // 全屏
    fullScreen() {
      var video = document.getElementById("videoRecording");
      video.webkitRequestFullScreen()
    },
    onClickLeft() {
      this.show = false;
      $(".videoDetail").children().remove();
      this.getVideoList();
    },
    goBack() {
      window.history.go(-1);
    }
  },
  activated() {
    this.titleName = this.$route.query.titleName;
    if (this.$route.query.classify_id) {
      this.getVideoList();
    }
  }
};
</script>

<style lang="scss" scoped>
#video {
  font-size: 12px !important;
  .videoDetail {
    position: relative;
  }
  #quan {
    width: 33px;
    height: 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #666;
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
    width: 32%;
    height: 100px;
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
      margin: 10px auto 20px;
      width: 80%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #409eff;
      background-color: #409eff;
      color: #fff;
      border-radius: 5px;
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
