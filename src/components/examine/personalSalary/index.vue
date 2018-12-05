<template>
  <div id='personalSalary'>
    个人工资
    <div @click="routerLink">详情</div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    },
    mounted() {
    },
    activated() {
    },
    watch: {},
    computed: {},
    methods: {
      routerLink() {
        this.$router.push({path: '/personalDetail'});
      }
    },
  }
</script>

<style lang="scss">
  #personalSalary {

  }
</style>
