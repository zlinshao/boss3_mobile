<template>
  <div id="image">
    <div class="imgContent">
      <div class="imgItem" v-for="item in 6">
        <img src="../../../../assets/doc.png" style="width: 1.2rem;height: 1.2rem" alt="">
        <div style="font-size: .24rem;color: #777">17/10/23</div>
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
        msg: 'Welcome to Your Vue.js App'
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex(from.path, 'house');
        vm.ddBack(from.path, 'house');
      })
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #image{
    padding: .15rem;
    .flex {
      display: -webkit-flex; /* Safari */
      display: flex;
    }
    .imgContent{
      padding: .2rem 0;
      @extend .flex;
      flex-wrap: wrap;
      .imgItem{
        width: 25%;
        text-align: center;
        padding-bottom: .2rem;
      }
    }
  }
</style>
