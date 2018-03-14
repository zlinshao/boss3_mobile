<template>
    <div>
        <router-link to="/unCollectBeforeRent">未收先租</router-link>
        <router-link to="/collectReport">收房报备</router-link>
        <router-link to="/rentReport">租房报备</router-link>
        <router-link to="/transferReport">调房报备</router-link>
        <router-link to="/continueCollect">续收报备</router-link>
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
