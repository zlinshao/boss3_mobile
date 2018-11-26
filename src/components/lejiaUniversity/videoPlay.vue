<template>
    <div id="videoplay">
      <div style="position: relative">
        <div class="videoDetail"><img src='../../assets/bofang1.jpg' id='imgRecording' style="width: 100%; position: fixed;top: 46px; z-index: 999;"  /></div>
        <div id="quan" @click="fullScreen">全屏</div>
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
export default {
  
}
</script>

<style lang="scss">

</style>
