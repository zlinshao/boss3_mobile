<template>
  <div id="image">
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
        <div
          v-if="detailData.house_goods.photo[0].info.mime&&detailData.house_goods.photo[0].info.mime.indexOf('image')>-1">
          <img :src="detailData.house_goods.photo[0].uri" style="width: 1.2rem;height: 1.2rem" alt="">
          <div style="font-size: .24rem;color: #777">{{detailData.create_time.split(' ')[0]}}</div>
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
        detailData: [],
        albumData: [],
        largePic: null,
      }
    },
    mounted() {
      this.getData();
    },
    activated() {
      this.getData();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('productDetail', 'house');
        vm.ddRent('productDetail', 'house');
      })
    },
    beforeRouteLeave(to, from, next) {
      if (this.largePic) {
        this.largePic.close();
      }
      Toast.clear();
      next();
    },
    methods: {
      getData() {
        Toast.loading({
          mask: true,
          duration: 0,
          message: '加载中...'
        });
        this.$http.get(globalConfig.server_new + 'house/album/' + this.$route.query.id).then((res) => {
          Toast.clear();
          if (res.data.code === '30070') {
            this.detailData = res.data.data.detail;
            this.albumData = res.data.data.album;
          } else {

          }
        })
      },
      showLargePic(images, index) {
        let imgArray = [];
        images.forEach((item) => {
          imgArray.push(item.uri);
        });
        this.largePic = ImagePreview(imgArray, index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #image {
    padding: .15rem;
    .flex {
      display: -webkit-flex; /* Safari */
      display: flex;
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
</style>
