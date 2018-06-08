<template>
  <div>
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../../../assets/loding1.gif">
    </div>
    <div class="container" v-if="!loading">
      <div class="content">
        <div class="content_img"><img src="../../../../assets/waiting.png" style="width: 45%;"></div>
        <div class="title">您目前没有问卷调查</div>
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
        loading: false,
      };
    },
    activated() {
      this.goAnswerNaire();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('');
        vm.ddRent('');
      })
    },
    methods: {
      goAnswerNaire() {
        this.loading = true;
        this.$http.get(globalConfig.server + 'questionnaire/active').then((res) => {
          this.loading = false;
          if (res.data.code === '30000') {
            this.questionnaireData = res.data.data;
            if(this.questionnaireData.available){
              this.$router.push({path: '/questionnaire', query: {id: this.questionnaireData.id}});
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
        margin-top: 30px;
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
