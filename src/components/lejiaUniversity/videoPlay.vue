<template>
    <div id="videoplayw">
      <div style="position: relative">
        <div class="videoDetail">
          <video :src="file" controls autoplay style=" width:100%; object-fit: fill; height: 212px;"></video>
          </div>
      </div>
      <div class="comment">
        <p class="commentText">评论</p>    
        <div class="commentList">
          <ul>
            <li v-for="(item, index) in commentList.list" :key="index">
              <p class="commentName">
                <span style="font-size: 12px;height: 13px;">{{item.user.name}}</span>
                <span style="font-size: 12px;height: 13px;">{{item.create_time}}</span>
              </p>
              <div class="commentConent">{{item.content}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="publishComment">
        <textarea v-model="params.content" placeholder="请输入评论..." style="resize:none"></textarea>
        <van-button type="primary" size="small" @click="publishComment">发表评论</van-button>
      </div>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "videoplayw",
  components: { Toast },
  data() {
    return {
      commentList: [],   //评论列表
      commentId: "",   // 评论id
       params: {
        video_id: "",
        content: ""
      },
      file: "",  // 视频路径
      classify_id: "",
    }
  },
   // 清除缓存
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.routerIndex("/VideoPlay", "video1");
      vm.ddRent("/VideoPlay", "video1");
    });
  },
  beforeRouteLeave(to, from, next) {
    Toast.clear();
    next();
  },
  methods: {
    // 获取评论
    getComment(id) {
      Toast.loading({
        mask: true,
        duration: 10,
        message: "加载中..."
      });
      this.$http.get(globalConfig.server + "video/comment/" + this.commentId).then(res => {
        if (res.data.code == "10000") {
          Toast.clear();
          this.commentList = res.data.data;
        }
      });
    },
    // 发表评论
    publishComment() {
      this.params.video_id = this.commentId;
      this.$http.post(globalConfig.server + "video/comment", this.params).then(res => {
          if (res.data.code == "10000") {
            Toast(res.data.msg);
            this.getComment(this.params.video_id);
            this.params.content = ""
          }
        });
    },
    // 播放次数
    getCount(id) {
      this.$http.post(globalConfig.server + "video/play-video", { video_id: id }).then(res => {
          if (res.data.code == "10000") {
            // Toast(res.data.msg);
          } else {
            Toast(res.data.msg);
          }
        });
    },
  },
  created() {
    // console.log(this.commentId, this.classify_id)
  },
  activated() {
    this.routerIndex('/LejiaUniversity');
    this.ddRent('/LejiaUniversity');
    this.classify_id = this.$route.query.classify_id;
    this.commentId = this.$route.query.video_id;
    this.file = this.$route.query.filePath;
    this.getCount(this.commentId);
    this.getComment();
  },
  mounted() {
  }
}
</script>

<style lang="scss">
  #videoplayw {
    #quan {
    width: 33px;
    height: 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #666;
    z-index: 999;
  }
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
</style>
