<template>
  <div id="hello" v-wechat-title="$route.meta.title">
    <div class="container">
      <div class="mainMain">
        <div @click="routerLink('/gladTidings')">
          <p>
            <i class="iconfont icon-wancheng"></i>
          </p>
          <h1>喜报</h1>
        </div>
        <div @click="routerLink('/examine')">
          <p>
            <i class="iconfont icon-wancheng"></i>
          </p>
          <h1>审批</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Cell, CellGroup, Icon, DatetimePicker,PasswordInput, NumberKeyboard } from 'vant';

  export default {
    components: {
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Icon.name]: Icon,
      [DatetimePicker.name]: DatetimePicker,
      [PasswordInput.name]: PasswordInput,
      [NumberKeyboard.name]: NumberKeyboard,

    },
    data() {
      return {
        paths: [],
        minHour: 10,
        maxHour: 20,
        minDate: new Date(1000,1,1),
        maxDate: new Date(2070, 10, 1),
        currentDate: new Date(2018, 0, 1),
        value: '',
        showKeyboard:false,
      };
    },
    mounted() {
      this.paths = this.$router.options.routes;
    },
    methods: {
      routerLink(val) {
        this.$router.push({path: val});
      },
      onInput(key) {
        this.value = (this.value + key).slice(0, 6);
      },
      onDelete() {
        this.value = this.value.slice(0, this.value.length - 1);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container{
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
