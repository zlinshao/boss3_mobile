<template>
  <div id="app">
    <!--<div class="routerLink">-->
    <!--<div v-for="(key,index) in paths" v-if="key.hidden">-->
    <!--<router-link :to="{path: key.path}">{{key.name}}</router-link>-->
    <!--</div>-->
    <!--</div>-->
    <!--<transition :name="transitionName">   </transition>-->
      <keep-alive>
        <router-view v-wechat-title="$route.meta.title"/>
      </keep-alive>

    <!--<van-cell-group class="item-list">-->
    <!--<van-cell isLink icon="points" title="我的积分" ></van-cell>-->
    <!--<van-cell isLink icon="gift" title="我收到的礼物" ></van-cell>-->
    <!--</van-cell-group>-->


    <!--<van-datetime-picker-->
    <!--v-model="currentDate"-->
    <!--type="date"-->
    <!--:min-hour="minHour"-->
    <!--:max-hour="maxHour"-->
    <!--:min-date="minDate"-->
    <!--&gt;</van-datetime-picker>-->

    <!--&lt;!&ndash; 密码输入框 &ndash;&gt;-->
    <!--<van-password-input-->
    <!--:value="value"-->
    <!--info="密码为 4 位数字"-->
    <!--lenght="4"-->
    <!--@focus="showKeyboard = true"-->
    <!--&gt;</van-password-input>-->

    <!--&lt;!&ndash; 数字键盘 &ndash;&gt;-->
    <!--<van-number-keyboard-->
    <!--:show="showKeyboard"-->
    <!--@input="onInput"-->
    <!--@delete="onDelete"-->
    <!--@blur="showKeyboard = false"-->
    <!--&gt;</van-number-keyboard>-->
  </div>
</template>

<script>
  import {Cell, CellGroup, Icon, DatetimePicker, PasswordInput, NumberKeyboard} from 'vant';

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
        minDate: new Date(1000, 1, 1),
        maxDate: new Date(2070, 10, 1),
        currentDate: new Date(2018, 0, 1),
        value: '',
        showKeyboard: false,
        transitionName: '',
      };
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = 'slide-left';
        } else {
          this.transitionName = 'slide-right';
        }
      }
    },
    mounted() {
      this.paths = this.$router.options.routes;
    },
    methods: {
      onInput(key) {
        this.value = (this.value + key).slice(0, 6);
      },
      onDelete() {
        this.value = this.value.slice(0, this.value.length - 1);
      }
    }
  };
</script>

<style>
  body {
    background-color: #f8f8f8;
  }

  .van-cell__title .van-icon {
    font-size: 18px;
  }

  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }

  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
</style>
