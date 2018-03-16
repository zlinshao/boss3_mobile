<template>
  <div id="hello">
    <div class="container">
      <div>
        <router-link style="font-size: 30px;" to="/gladTidings">喜报</router-link>
        <router-link style="font-size: 30px;" to="/examine">审批</router-link>
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

  }
</style>
