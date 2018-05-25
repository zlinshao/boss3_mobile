<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="content_img"><img src="../../../../assets/waiting.png" style="width: 60%;"></div>
        <div class="title">您目前没有问卷调查</div>
        <!--<div class="last_title">最近一场</div>-->
        <!--<div style="margin-top: 10px;color: #333;line-height: 28px;">-->
          <!--<div >调查名称：关于乐伽公寓</div>-->
          <!--<div>周期：2018-05-01 ~ 2018-08-30</div>-->
        <!--</div>-->
        <van-button class="view_history" @click="goHistory">查看历史问卷</van-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "before-naire",
    data() {
      return {
        questionnaireData: {},
      };
    },
    activated(){
      this.goAnswerNaire();
    },
    methods: {
      goAnswerNaire() {
        this.$http.get(globalConfig.server + 'questionnaire/active').then((res) => {
          if (res.data.code === '30000') {
            this.questionnaireData = res.data.data;
            if(this.questionnaireData.available){
              this.$router.push({path: '/questionnaire', query: {id: this.questionnaireData.id}});
            }else{
              setTimeout(() => {
                this.goAnswerNaire();
              }, 1000);
            }
          }
        });
      },
      goHistory(val) {
          this.$router.push({path: '/myNaire'});
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    background: #fff;
    color: #999;
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    .content {
      .content_img{
        position: relative;
        margin-top: 100px;
      }
      .title{
        position: relative;
        margin-top: 20px;
        font-size: 25px;
        color: #39b1ff;
      }
      .last_title{
        position: relative;
        margin-top: 25px;
        font-size: 14px;
      }
      .view_history {
        position: relative;
        padding: 0px 30px;
        background: #39b1ff;
        color: #fff;
        margin-top: 50px;
      }
    }

  }

</style>
