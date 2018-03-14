<template>
  <div id="app">
    <div class="routerLink">
      <div v-for="(key,index) in paths" v-if="key.hidden">
        <router-link :to="{path: key.path}">{{key.name}}</router-link>
      </div>
    </div>
    <router-view/>
    <van-cell-group class="item-list">
      <van-cell isLink icon="points" title="我的积分" />
      <van-cell isLink icon="gift" title="我收到的礼物" />
    </van-cell-group>


    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-hour="minHour"
      :max-hour="maxHour"
      :min-date="minDate"
    />

    <!-- 密码输入框 -->
    <van-password-input
      :value="value"
      info="密码为 6 位数字"
      @focus="showKeyboard = true"
    />

    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
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
      minDate: new Date(),
      maxDate: new Date(2019, 10, 1),
      currentDate: new Date(2018, 0, 1),
      value: '',
      showKeyboard:false,
    };
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
</style>
