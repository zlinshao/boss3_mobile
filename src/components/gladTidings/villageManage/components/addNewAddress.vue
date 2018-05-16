<template>
  <div style=" width: 100%;height: 100%;">
    <iframe id="test" src='https://m.amap.com/picker/?center=118.798234,32.087755&key=35ba5c7d8e90a5c95fefa592fdea8d7a'></iframe>
  </div>
</template>

<script>

  export default {
    name: "addNewAddress",
    data(){
      return{
        coordinate:'',
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('/mapSearch', 'house');
        vm.ddRent('/mapSearch', 'house');
      })
    },
    mounted(){
      this.initMap()
    },
    activated(){
      this.initMap()
    },
    methods:{
      initMap(){
        let _this = this;
        let iframe = document.getElementById('test').contentWindow;
        document.getElementById('test').onload = function(){
          iframe.postMessage('hello','https://m.amap.com/picker/');
        };
        window.addEventListener("message", function(e){
          _this.coordinate = e.data.location;
          _this.confirmSelect();
        }, false);
      },
      confirmSelect(){
        this.$router.push({path: '/mapSearch', query: {coordinate: this.coordinate}});
      }
    }
  }
</script>

<style scoped>
  body{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
  }
  iframe{
    width: 100%;
    height: 100%;
  }
</style>
