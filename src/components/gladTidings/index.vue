<template>
    <div>

      <router-link to="/unCollectBeforeRent">
        <van-button size="large">
          未收先租
        </van-button>
      </router-link>
      <router-link to="/continueRent">
        <van-button size="large">
          续租报备
        </van-button>
      </router-link>

      <router-link to="/drawback">
        <van-button size="large">
          退款报备
        </van-button>
      </router-link>
      <router-link to="/friedBill">
        <van-button size="large">
          炸单报备
        </van-button>
      </router-link>
      <router-link to="/agencyRent">
        <van-button size="large">
          中介费报备
        </van-button>
      </router-link>
      <router-link to="/special">
        <van-button size="large">
          特殊事项报备
        </van-button>
      </router-link>
      <router-link to="/confiscate">
        <van-button size="large">
          充公报备
        </van-button>
      </router-link>
      <router-link to="/finalPayment">
        <van-button size="large">
          尾款房租报备
        </van-button>
      </router-link>
    </div>
</template>

<script>
    export default {
        name: 'hello',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
