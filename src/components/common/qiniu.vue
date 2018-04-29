<!--<template>-->
  <!--<div>-->
    <!--<div id="container">-->
      <!--<div :id="'pickfiles'+ID" class="pickfiles">-->
        <!--<div class="imgItem" v-for="(val,key) in editImg" v-if="editImg.length > 0">-->
          <!--<div style=" position: relative;">-->
            <!--<img v-if="val.is_video" src="../../assets/video.jpg" style="width: 1.5rem; height: 1.5rem;">-->
            <!--<img :src="val.uri" style="width: 1.5rem; height: 1.5rem;" v-else>-->
            <!--<div class="progress"><b style="color: #fff !important;"></b></div>-->
            <!--<div class="remove pic_delete van-icon van-icon-close" @click="deleteImage(key)">-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="upButton" @click="getToken" :id="ID">-->
          <!--<span class="plus">+</span>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import fileImage from '../../assets/video.jpg'-->
  <!--import {Dialog} from 'vant';-->

  <!--export default {-->
    <!--name: "qiniu",-->
    <!--props: ['ID', 'editImage', 'isClear'],-->
    <!--data() {-->
      <!--return {-->
        <!--imgArray: [],-->
        <!--imgId: [],-->
        <!--isUploading: false,-->
        <!--activeIndex: null,-->
        <!--uploader: null,-->
        <!--editImg: [],-->
        <!--token: '',-->
        <!--isStatus: true,-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--this.active();-->
    <!--},-->
    <!--watch: {-->
      <!--editImage: {-->
        <!--deep: true,-->
        <!--handler(val, old) {-->
          <!--this.editImg = this.editImage;-->
          <!--this.imgId = [];-->
          <!--for (let i = 0; i < val.length; i++) {-->
            <!--this.imgId.push(val[i].id)-->
          <!--}-->
        <!--}-->
      <!--},-->
      <!--isClear(val) {-->
        <!--if (val) {-->
          <!--this.imgId = [];-->
          <!--this.imgArray = [];-->
          <!--this.editImg = [];-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--methods: {-->
      <!--active() {-->
        <!--let _this = this;-->
        <!--$(document).on('click', '#pickfiles' + this.ID + ' ' + '.pic_delete', function () {-->
          <!--let id = $(this).attr("data-val");-->
          <!--let toremove = '';-->
          <!--for (let i in _this.uploader.files) {-->
            <!--if (_this.uploader.files[i].id === id) {-->
              <!--toremove = i;-->
            <!--}-->
          <!--}-->
          <!--$('#' + id).remove();-->
          <!--_this.uploader.splice(toremove, 1);-->
          <!--for (let i = 0; i < _this.imgArray.length; i++) {-->
            <!--if (_this.imgArray[i].name.indexOf(id) > -1) {-->

              <!--_this.imgId.forEach((item) => {-->
                <!--if (_this.imgArray[i].id === item) {-->
                  <!--_this.imgId = _this.imgId.filter((x) => {-->
                    <!--return x !== item-->
                  <!--})-->
                <!--}-->
              <!--});-->

              <!--_this.imgArray.splice(i, 1);-->
            <!--}-->
          <!--}-->
          <!--_this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);-->
        <!--});-->
        <!--this.getTokenMessage();-->
        <!--setInterval(() => {-->
          <!--if (_this.uploader) {-->
            <!--this.uploader.refresh();-->
          <!--}-->
        <!--}, 1000)-->
      <!--},-->
      <!--deleteImage(key) {-->
        <!--this.imgId.splice(key, 1);-->
        <!--this.editImg.splice(key, 1);-->
      <!--},-->
      <!--getToken() {-->
        <!--this.$http.get(globalConfig.server_user + 'files').then((res) => {-->
          <!--this.token = res.data.data;-->
        <!--})-->
      <!--},-->
      <!--getTokenMessage() {-->
        <!--this.$http.get(globalConfig.server_user + 'files').then((res) => {-->
          <!--this.token = res.data.data;-->
          <!--this.initQiniu(res.data.data);-->
        <!--})-->
      <!--},-->

      <!--initQiniu(token) { // 初始化七牛-->
        <!--this.token = token;-->
        <!--let _this = this;-->
        <!--this.uploader = Qiniu.uploader({-->
          <!--runtimes: 'html5,flash,html4', // 上传模式,依次退化-->
          <!--browse_button:  _this.ID, // 上传选择的点选按钮，**必需**-->
          <!--// 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func-->
          <!--uptoken: _this.token, // uptoken 是上传凭证，由其他程序生成-->
          <!--get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的 uptoken-->
          <!--// Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址-->
          <!--unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）-->
          <!--save_key: false, // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理-->
          <!--domain: globalConfig.domain, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**-->
          <!--container: 'container', // 上传区域 DOM ID，默认是 browser_button 的父元素，-->
          <!--max_file_size: '100mb', // 最大文件体积限制-->
          <!--flash_swf_url: 'path/of/plupload/Moxie.swf', //引入 flash,相对路径-->
          <!--max_retries: 1, // 上传失败最大重试次数-->
          <!--dragdrop: false, // 开启可拖曳上传-->
          <!--drop_element: 'container', // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传-->
          <!--chunk_size: '4mb', // 分块上传时，每块的体积-->
          <!--auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,-->
          <!--// filters: { //文件类型过滤，这里限制为图片类型-->
          <!--//   mime_types: [{-->
          <!--//     title: "Image files",-->
          <!--//     extensions: "jpg,jpeg,gif,png"-->
          <!--//   }]-->
          <!--//   // prevent_duplicates : false //不允许选取重复文件-->
          <!--// },-->
          <!--init: {-->
            <!--'FilesAdded': function (up, files) {-->
              <!--_this.isUploading = true;-->
              <!--_this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);-->

              <!--plupload.each(files, function (file) {-->
                <!--if (!file || !/image\//.test(file.type) || /photoshop/.test(file.type)) {-->

                  <!--$('#pickfiles' + _this.ID).prepend(`-->
                    <!--<div class="imgItem" id="${file.id}">-->
                      <!--<div style=" width: 1.5rem;  height: 1.5rem; position: relative;">-->
                        <!--<img src="${fileImage}" style="width: 1.5rem; height: 1.5rem; ">-->
                        <!--<div class="progress"><b style="color: #aaa !important;"></b></div>-->
                        <!--<div class="remove pic_delete van-icon van-icon-close"  data-val=${file.id}>-->

                        <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->
                   <!--`);-->
                <!--} else {-->
                  <!--let fr = new mOxie.FileReader();-->

                  <!--fr.onload = function () {-->
<!--//                     文件添加进队列后，处理相关的事情-->
                    <!--$('#pickfiles' + _this.ID).prepend(`-->
                    <!--<div class="imgItem" id="${file.id}">-->
                      <!--<div style=" position: relative;">-->
                        <!--<img src="${fr.result}" style="width: 1.5rem; height: 1.5rem; ">-->
                        <!--<div class="progress"><b style="color: #fff !important;"></b></div>-->
                        <!--<div class="remove pic_delete van-icon van-icon-close"  data-val=${file.id}>-->

                        <!--</div>-->
                      <!--</div>-->
                    <!--</div>-->
                   <!--`);-->
                  <!--};-->
                  <!--fr.readAsDataURL(file.getSource());-->
                <!--}-->
              <!--});-->
            <!--},-->
            <!--'BeforeUpload': function (up, file) {-->
              <!--_this.isUploading = true;-->
              <!--// 每个文件上传前,处理相关的事情-->
            <!--},-->
            <!--'UploadProgress': function (up, file) {-->
              <!--if (document.getElementById(file.id)) {-->

                <!--if (file.percent < 100) {-->
                  <!--document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";-->
                <!--} else {-->
                  <!--document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span class="van-icon van-icon-passed"></span>';-->
                <!--}-->

              <!--}-->
              <!--// 每个文件上传时,处理相关的事情-->
            <!--},-->
            <!--'FileUploaded': function (up, file, info) {-->
              <!--let domain = up.getOption('domain');-->
              <!--let url = JSON.parse(info);-->
              <!--let sourceLink = domain + "/" + url.key;-->

              <!--// _this.isUpId = file.id;-->

              <!--_this.$http.post(globalConfig.server_user + 'files', {-->
                <!--url: sourceLink,-->
                <!--name: url.key,-->
                <!--raw_name: file.name,-->
                <!--type: file.type,-->
                <!--size: file.size-->
              <!--}).then((res) => {-->
                <!--if (res.data.status === "success") {-->
                  <!--_this.imgId.push(res.data.data.id);-->

                  <!--let object = {};-->
                  <!--object.id = res.data.data.id;-->
                  <!--object.name = res.data.data.name;-->
                  <!--_this.imgArray.push(object);-->
                  <!--_this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);-->
                <!--}-->
              <!--})-->
            <!--},-->
            <!--'Error': function (up, err, errTip) {-->
              <!--if (err.file && err.file.size !== undefined && err.file.size > 104857600) {-->
                <!--Dialog.alert({-->
                  <!--message: '文件最大不能超过100MB'-->
                <!--}).then(() => {-->
                  <!--// on close-->
                <!--});-->
              <!--}-->
              <!--//上传出错时,处理相关的事情-->
              <!--// console.log('失败&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;');-->
            <!--},-->
            <!--'UploadComplete': function () {-->
              <!--_this.isUploading = false;-->
              <!--//队列文件处理完毕后,处理相关的事情-->
            <!--},-->
            <!--// 'Key': function (up, file) {-->
              <!--// 若想在前端对每个文件的key进行个性化处理，可以配置该函数-->
              <!--// 该配置必须要在 unique_names: false , save_key: false 时才生效-->
              <!--// 获取当前时间戳-->
              <!--// var timestamp = new Date().getTime();-->
              <!--// var key = "image/cxw/" + timestamp + ".png";-->
              <!--// do something with key here-->
              <!--// return key-->
            <!--// }-->
          <!--}-->
        <!--});-->
      <!--},-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style lang="scss">-->
  <!--.cx-upload {-->
    <!--display: inline-block;-->
    <!--.uploadBtn {-->
      <!--width: 64px;-->
      <!--height: 30px;-->
      <!--color: #2f363c;-->
      <!--outline: none;-->
      <!--border: 2px solid #2f363c;-->
    <!--}-->
  <!--}-->

  <!--@media screen and (max-width: 648px) {-->
    <!--.cx-upload {-->
      <!--float: left;-->
    <!--}-->
  <!--}-->
<!--</style>-->
