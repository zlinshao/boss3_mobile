<template>
  <div>
    <van-popup v-model="showContent" class="module">
      <div class="showContentTitle">审核人</div>
      <div class="showContent">
        你已选择使用电子收据取代纸质收据（二者具有同等法律效力）。客户将于审批通过后即刻收到电子收据链接。请确保客户知悉以上信息
      </div>
      <div>
        使用纸质收据时，审批端仍然弹出发送电子收据的提示框。
      </div>
      <div class="showContentFooter" @click="showContent = false">
        关闭
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "is_receipt",
    props: ['module', 'num'],
    data() {
      return {
        showContent: false,
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.showContent = val;
      },
      showContent(val) {
        this.$emit('close');
      }
    },
    computed: {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .showContentTitle, .showContentFooter {
    text-align: center;
    padding: .3rem 0;
    font-size: .36rem
  }

  .showContentTitle {
    border-bottom: 1px solid #f4f4f4;
  }

  .showContentFooter {
    border-top: 1px solid #f4f4f4;
    color: #409EFF;
  }

  .module {
    border-radius: 3px;
  }
</style>
