<template>
  <div>
    数据统计
  </div>
</template>

<script>
  import F2 from '@antv/f2'

  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server,
        chart: null,
        screenWidth: window.screen.width,
        data: [{
          x: 1,
          y: 85,
        }],
      }
    },
    mounted() {
      this.drawing();
    },
    activated() {
      this.$http.get(this.urls + 'antv/index/personMaterials',{
        params: {
          start_time: '',
          end_time: '',
        }
      }).then((res) => {
        console.log('个人资料待审核的数量');
        console.log(res);
      });
      this.$http.get(this.urls + 'antv/index/personPerformanceList',{
        params: {
          start_time: '',
          end_time: '',
        }
      }).then((res) => {
        console.log('获取个人业绩详情');
        console.log(res);
      });
      this.$http.get(this.urls + 'antv/index/personPerformance',{
        params: {
          start_time: '',
          end_time: '',
        }
      }).then((res) => {
        console.log('个人业绩总额');
        console.log(res);
      });
      this.$http.get(this.urls + 'antv/index/personPerformanceRatio',{
        params: {
          start_time: '',
          end_time: '',
        }
      }).then((res) => {
        console.log('个人业绩占比小组业绩');
        console.log(res);
      })
    },
    watch: {},
    methods: {
      drawing() {

      }
    },
  }
</script>

<style lang="scss">

</style>
