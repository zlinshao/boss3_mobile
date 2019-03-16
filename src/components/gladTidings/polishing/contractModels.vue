<template>
  <div>
    <van-tabs @click="changeTab" style="position: fixed;top: 0;z-index: 1000;width: 100%;">
      <van-tab title="收房"></van-tab>
      <van-tab title="租房"></van-tab>
    </van-tabs>
    <van-list
      style="position: absolute;top: 3.5em;width: 100%"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了">
      <van-cell v-for="(item,index) in list" :key="index" @click="showPdf(item)">
        <div style="text-align: center">
          {{(type===1?'收房模板':'租房模板')+(index+1)}}
        </div>
      </van-cell>
    </van-list>
    <pdf-dialog style="width: 100%;height: 100%;position: fixed;top:0;z-index: 1000"
                ref="pdf"></pdf-dialog>
  </div>
</template>

<script>
  import PdfDialog from '@/components/common/pdf/PdfDialog'

  export default {
    name: "contractModels",
    components:{
      PdfDialog
    },
    activated(){
      this.routerIndex('eContract');
      this.ddRent('eContract');
    },
    data() {
      return {
        list: [],
        finished:true,
        loading:false,
        eurls: globalConfig.e_server,
        type:1
      }
    },
    activated(){
      this.getData();
    },
    methods: {
      //更改tab
      changeTab(index, title) {
        this.type = index + 1;
        this.getData();
      },

      getData() {
        this.loading=true;
        this.$http.get(this.eurls + 'fdd/pdf' + '?page=1' + '&limit=100' + "&pdf_scene=" + this.type).then(res => {
          this.loading=false;
          this.list=res.data.data.data;
          console.log(this.list)
        }).catch(e=>{
          this.loading=false;
        });
      },
      showPdf(item){
        this.$refs.pdf.show(item.file_url, 1);
      }
    }
  }
</script>

<style scoped>

</style>
