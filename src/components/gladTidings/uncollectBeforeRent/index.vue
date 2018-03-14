<template>
    <div>
      <van-cell-group>
        <van-field
          v-model="username"
          label="用户名"
          icon="clear"
          placeholder="请输入用户名"
          required
        ></van-field>

        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        ></van-field>
      </van-cell-group>
    </div>
</template>

<script>
//  import { Cell, CellGroup, Icon, DatetimePicker,PasswordInput, NumberKeyboard , Row, Col} from 'vant';

  export default {
//    components: {
//      [Cell.name]: Cell,
//      [CellGroup.name]: CellGroup,
//      [Icon.name]: Icon,
//      [DatetimePicker.name]: DatetimePicker,
//      [PasswordInput.name]: PasswordInput,
//      [NumberKeyboard.name]: NumberKeyboard,
//      [Row.name]: Row,
//      [Col.name]: Col,
//
//    },
    data() {
      return {
        username:'',
        password:'',
      };
    },
    mounted() {

    },
    methods: {

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
