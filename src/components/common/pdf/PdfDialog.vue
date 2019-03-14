<template>
  <div ref="parent" v-if="isShow" >
    <div class="bg" @click="dismiss" ref="bg"></div>
    <pdf-viewer :url="url" :firstPage="firstPage" style="width: 100%;height: 100%;position: absolute;top:0"></pdf-viewer>
    <img src="./delete.png" class="delete" @click="dismiss">
  </div>
</template>

<script>
  import PdfViewer from '@/components/common/pdf/PdfViewer'

  export default {
    name: "PDFDialog",
    components: {
      PdfViewer
    },
    data(){
      return{
        isShow:false,
        url:'',
        firstPage:1
      }
    },
    mounted(){

    },
    methods:{
      show(url,page){
        this.url=url;
        this.firstPage=page||1;
        this.isShow=true;
      },
      dismiss(){
        this.isShow=false;
      }
    }
  }
</script>

<style scoped>

  .bg{
    background: black;
    width: 100%;
    height: 100%;
    opacity: .6;
  }
  .delete{
    position: absolute;
    right: 1em;
    width: 2em;
    height: 2em;
    top: 2em;
  }

</style>
