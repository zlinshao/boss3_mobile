<template>
  <div id="uploadContainer">
    <div id="container">
      <div :id="'pickfiles'+ID" class="pickfiles">
        <div class="imgItem" v-for="(val,key) in editImg" v-if="editImg.length > 0">
          <div style="position: relative; margin: .3rem 0 0 .3rem;">
            <img v-if="val.is_video" class="videos" src="../../assets/video.jpg">
            <img :src="val.uri" v-else>
            <div class="progress"><b></b></div>
            <div class="remove pic_delete van-icon van-icon-close" @click="deleteImage(key)">
            </div>
          </div>
        </div>
        <div class="upButton" @click="getToken" :id="ID">
          <span class="plus">+</span>
        </div>
      </div>
    </div>

    <div class="bigPhoto" @click="closePic" v-if="bigPic">
      <img :src="bigPic">
    </div>
  </div>
</template>

<script>
  import fileImage from '../../assets/video.jpg'
  import {Dialog} from 'vant';
  import {Toast} from 'vant';
  import {ImagePreview} from 'vant';

  export default {
    name: 'hello',
    components: {ImagePreview, Toast, Dialog},
    props: ['ID', 'editImage', 'isClear', 'dis'],
    data() {
      return {
        imgArray: [],
        imgId: [],
        errorId: [],
        isUploading: false,
        activeIndex: null,
        uploader: null,
        editImg: [],
        token: '',
        bigPic: '',
        fileLength: 0,
      }
    },
    mounted() {
      this.active();
      // this.fileLength = this.editImg.length;
    },
    watch: {
      editImage: {
        deep: true,
        handler(val, old) {
          this.editImg = [];
          this.imgId = [];
          for (let i = 0; i < val.length; i++) {
            this.imgId.push(val[i].id);
            this.editImg.push(val[i])
          }
        }
      },
      isClear(val) {
        if (val) {
          this.imgId = [];
          this.imgArray = [];
          this.editImg = [];
        }
      }
    },
    methods: {
      closePic() {
        this.bigPic = '';
      },
      active() {
        let _this = this;
        $(document).on('click', '#pickfiles' + this.ID + ' ' + 'img', function () {
          _this.bigPic = $(this).attr("src");
        });
        $(document).on('click', '#pickfiles' + this.ID + ' ' + '.progress', function () {
          _this.bigPic = $(this).prev().attr("src");
        });
        $(document).on('click', '#pickfiles' + this.ID + ' ' + '.pic_delete', function () {
          let id = $(this).attr("data-val");
          let toremove = '';
          for (let i in _this.uploader.files) {
            if (_this.uploader.files[i].id === id) {
              toremove = i;
            }
          }
          $('#' + id).remove();
          _this.uploader.splice(toremove, 1);
          for (let i = 0; i < _this.imgArray.length; i++) {
            if (_this.imgArray[i].name.indexOf(id) > -1) {

              _this.imgId.forEach((item) => {
                if (_this.imgArray[i].id === item) {
                  _this.imgId = _this.imgId.filter((x) => {
                    return x !== item
                  })
                }
              });
              _this.imgArray.splice(i, 1);
            }
          }
          _this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);
        });
        this.getTokenMessage();
        setInterval(() => {
          if (_this.uploader) {
            this.uploader.refresh();
          }
        }, 1000);
      },
      getToken() {
        this.$http.defaults.timeout = 5000;
        this.$http.get(globalConfig.server_user + 'files').then((res) => {
          this.token = res.data.data;
          this.$http.defaults.timeout = null;
          if (!this.uploader) {
            this.uploaderReady(res.data.data);
            globalConfig.header.Authorization = '';
          }
        }).catch((error) => {
          this.$http.defaults.timeout = null;
          if (!this.uploader) {
            alert('网络故障，上传组件创建失败，请保存草稿，稍后再试');
          }
        })
      },
      deleteImage(key) {
        this.imgId.splice(key, 1);
        this.editImg.splice(key, 1);
      },

      // 获取token
      getTokenMessage() {
        this.$http.get(globalConfig.server_user + 'files').then((res) => {
          this.token = res.data.data;
          this.uploaderReady(res.data.data);
        })
      },
      // 生成实例
      uploaderReady(token) {
        this.token = token;
        let _this = this;
        _this.uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4',      // 上传模式，依次退化
          browse_button: _this.ID,     //上传按钮的ID
          uptoken: _this.token,                  // uptoken是上传凭证，由其他程序生成

          get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
          unique_names: true,                 // 默认false，key为文件
          domain: globalConfig.domain,  // bucket域名，下载资源时用到，必需

          max_file_size: '100mb',               // 最大文件体积限制
          flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
          max_retries: 1,                     // 上传失败最大重试次数
          dragdrop: true,                     // 开启可拖曳上传
          drop_element: 'pickfiles' + _this.ID, // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb',                  // 分块上传时，每块的体积
          auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传

          init: {
            'FilesAdded': function (up, files) {
              _this.fileLength = _this.imgId.length + files.length;
              _this.isUploading = true;
              _this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);
              plupload.each(files, function (file) {
                if (!file || !/image\//.test(file.type) || /photoshop/.test(file.type)) {

                  $('#pickfiles' + _this.ID).prepend(`
                    <div class="imgItem" id="${file.id}">
                      <div class="picCss">
                        <img class="videos" src="${fileImage}">
                        <div class="progress"><b>正在上传</b></div>
                        <div class="remove pic_delete van-icon van-icon-close" data-val=${file.id}></div>
                      </div>
                    </div>
                   `);
                } else {
                  let fr = new mOxie.FileReader();

                  fr.onload = function () {
//                     文件添加进队列后，处理相关的事情
                    $('#pickfiles' + _this.ID).prepend(`
                    <div class="imgItem" id="${file.id}">
                      <div class="picBig picCss">
                        <img src="${fr.result}">
                        <div class="progress"><b>正在上传</b></div>
                        <div class="remove pic_delete van-icon van-icon-close" data-val=${file.id}></div>
                      </div>
                    </div>
                   `);
                  };
                  fr.readAsDataURL(file.getSource());
                }
              });
            },
            'UploadProgress': function (up, file) {
              // 每个文件上传时，处理相关的事情
              if (document.getElementById(file.id)) {
                if (file.percent < 100) {
                  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span>';
                } else {
                  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span class="texts">处理中</span>';
                }
              }
            },
            // 'FilesRemoved': function (uploader, files) {
            //   console.log(uploader.files.length);
            //   console.log(_this.editImg.length);
            //   _this.fileLength = _this.editImg.length + uploader.files.length;
            // },
            'BeforeUpload': function (up, file) {
              // 每个文件上传前，处理相关的事情
              _this.isUploading = true;
              up.setOption('multipart_params', {
                token: _this.token,               // 上传凭证
              });
            },
            'FileUploaded': function (up, file, info) {
              let domain = up.getOption('domain');
              let url = JSON.parse(info);
              let sourceLink = domain + "/" + url.key;
              _this.$http.defaults.timeout = 5000;
              _this.$http.post(globalConfig.server_user + 'files', {
                url: sourceLink,
                name: url.key,
                raw_name: file.name,
                type: file.type,
                size: file.size
              }).then((res) => {
                _this.$http.defaults.timeout = null;
                if (res.data.status === "success") {
                  _this.imgId.push(res.data.data.id);
                  let object = {};
                  object.id = res.data.data.id;
                  object.name = file.id;
                  _this.imgArray.push(object);
                  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = `<span class="van-icon van-icon-passed"></span>`;
                }
                if (_this.fileLength === _this.imgId.length) {
                  _this.isUploading = false;
                  _this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);
                }
              }).catch(error => {
                _this.$http.defaults.timeout = null;
                this.errorId.push(1);
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = `<span class="van-icon van-icon-close"></span>`;
              });
            },
            'UploadComplete': function () {
              //队列文件处理完毕后，处理相关的事情
              // _this.isUploading = false;
              // _this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);
            },
            'Error': function (up, err, errTip) {// 每个文件上传失败后,处理相关的事情
              if (err.file && err.file.size !== undefined && err.file.size > 104857600) {
                Dialog.alert({
                  message: '文件最大不能超过100MB'
                }).then(() => {
                  // on close
                });
              } else {
                Toast(errTip);
              }
            }
//            'Key': function (up, file) {
//              // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
//              // 该配置必须要在unique_names: false，save_key: false时才生效
//              let key = "";
//              // do something with key here
//              return key
//            }
          }
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #uploadContainer {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
    }
    .bigPhoto {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1000;
      background-color: rgba(0, 0, 0, .4);
      @include flex;
      img {
        max-width: 100%;
        max-height: 100%
      }
    }
    #container {
      img {
        width: 1.5rem;
        height: 1.5rem;
      }
      padding: 0 .1rem;
      .pickfiles {
        display: flex;
        display: -webkit-flex; /* Safari */
        flex-wrap: wrap;
        .upButton {
          width: 1.5rem;
          height: 1.5rem;
          margin: .3rem 0 0 .3rem;
          background: #f6f6f6;
          text-align: center;
          line-height: 1.5rem;
          .plus {
            font-size: 1rem;
            color: #aaa;
          }
        }
        .progress {
          width: 100%;
          position: absolute;
          bottom: 0;
          text-align: center;
        }
        .remove {
          text-align: center;
          width: .5rem;
          height: .5rem;
          line-height: .5rem;
          border-radius: 50%;
          position: absolute;
          top: -.2rem;
          right: -.2rem;
          z-index: 12;
          background: #333;
          color: #fff;
          font-size: .5rem;
        }
        .picCss {
          width: 1.5rem;
          height: 1.5rem;
          position: relative;
          margin: .3rem 0 0 .3rem;
          b {
            display: flex;
            display: -webkit-flex;
            align-items: center;
            justify-content: center;
            font-size: .28rem;
            color: #fff !important;
            background: rgba(0, 0, 0, .2);
            width: 1.5rem;
            height: 1.5rem;
            margin: 0 auto;
            border-radius: 6px;
            span {
              font-size: .42rem;
            }
            .texts {
              font-size: .28rem;
            }
          }
          .videos {
            width: 1.66rem;
            height: 1.66rem;
            margin: -.1rem;
          }
        }
      }
    }
  }
</style>
