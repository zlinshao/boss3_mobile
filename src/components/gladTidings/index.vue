<template>
  <div v-wechat-title="$route.meta.title">

    <div class="paths">
      <div class="mainMain">
        <div v-for="key in paths" v-if="key.hidden === 'glad'" @click="routerLink(key.path)">
          <p>
            <i class="iconfont icon-wancheng"></i>
          </p>
          <h1>{{key.name}}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data() {
      return {
        paths: [],
      }
    },
    mounted() {
      this.paths = this.$router.options.routes;
    },
    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .paths {
    margin-top: .2rem;
    background: #ffffff;
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    @mixin border_radius($p) {
      -webkit-border-radius: $p;
      -moz-border-radius: $p;
      border-radius: $p;
    }
    .mainMain {
      padding: .3rem 0 .6rem;
      @include flex;
      flex-wrap: wrap;
      div {
        width: 25%;
        text-align: center;
        P {
          margin: .3rem auto .2rem;
          @include border_radius(6px);
          background: red;
          width: .86rem;
          height: .86rem;
          line-height: .86rem;
          i {
            color: #ffffff;
          }
        }
        h1 {
          font-size: .24rem;
          padding: 0 .1rem;
          line-height: .36rem;
        }
      }
    }
  }
</style>
