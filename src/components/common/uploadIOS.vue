<template>
  <div>
    <div :id="ID" @click="active" style="width: 200px;height: 30px;background-color: #aaaaaa;"></div>
    <div id="SwiftDiv">
      <span id="jsParamFuncSpan" style="color: orange; font-size: 50px;"></span>
    </div>
    <input type="text" id="input">
  </div>
</template>

<script>
  export default {
    name: "upload-ios",
    props: ['ID', 'editImage', 'isClear'],
    data() {
      return {}
    },
    mounted() {
    },
    activated() {
    },
    watch: {},
    methods: {
      active() {
        if (confirm('Confirm', 'Please show confirm')) {
          document.getElementById('jsParamFuncSpan').innerHTML = 'true';
        } else {
          document.getElementById('jsParamFuncSpan').innerHTML = 'false';
        }
        window.webkit.messageHandlers.senderModel.postMessage({body: 'Confirm'});
      },
      sendKey(user_id) {
        alert(user_id);
        $('#input').val(user_id);
      }
    },
  }
</script>

<style lang="scss">

</style>
