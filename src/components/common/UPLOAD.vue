<template>
  <div>
    <div id="container">
      <div :id="'pickfiles'+ID" class="pickfiles">
        <div class="imgItem" v-for="(val,key) in editImg" v-if="editImg.length > 0">
          <div style=" position: relative;">
            <img v-if="val.is_video" src="../../assets/video.jpg" style="width: 1.5rem; height: 1.5rem;">
            <img :src="val.uri" style="width: 1.5rem; height: 1.5rem;" v-else>
            <div class="progress"><b style="color: #fff !important;"></b></div>
            <div class="remove pic_delete van-icon van-icon-close" @click="deleteImage(key)">
            </div>
          </div>
        </div>
        <div class="upButton" @click="getToken" :id="ID">
          <span class="plus">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import fileImage from '../../assets/video.jpg'
  import {Dialog} from 'vant';
  import {Toast} from 'vant';

  export default {
    name: 'hello',
    components: {Toast},
    props: ['ID', 'editImage', 'isClear', 'dis'],
    data() {
      return {
        imgArray: [],
        imgId: [],
        isUploading: false,
        activeIndex: null,
        uploader: null,
        editImg: [],
        token: '',
      }
    },
    mounted() {
      this.active();
    },
    watch: {
      editImage: {
        deep: true,
        handler(val, old) {
          this.editImg = this.editImage;
          this.imgId = [];
          for (let i = 0; i < val.length; i++) {
            this.imgId.push(val[i].id)
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
      active() {
        let _this = this;
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
        }, 1000)
      },
      getToken() {
        this.$http.defaults.timeout = 5000;
        this.$http.get(globalConfig.server_user + 'files').then((res) => {
          this.token = res.data.data;
          this.$http.defaults.timeout = null;
          if (!this.uploader) {
            this.uploaderReady(res.data.data);
          }
        }).catch((res) => {
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

      getTokenMessage() {
        this.$http.get(globalConfig.server_user + 'files').then((res) => {
          this.token = res.data.data;
          this.uploaderReady(res.data.data);
        })
      },
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
          drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb',                  // 分块上传时，每块的体积
          auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传

          init: {
            'FilesAdded': function (up, files) {
              _this.isUploading = true;
              _this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);

              plupload.each(files, function (file) {
                if (!file || !/image\//.test(file.type) || /photoshop/.test(file.type)) {

                  $('#pickfiles' + _this.ID).prepend(`
                    <div class="imgItem" id="${file.id}">
                      <div style=" width: 1.5rem;  height: 1.5rem; position: relative;">
                        <img src="${fileImage}" style="width: 1.5rem; height: 1.5rem; ">
                        <div class="progress"><b style="color: #aaa !important;"></b></div>
                        <div class="remove pic_delete van-icon van-icon-close"  data-val=${file.id}>

                        </div>
                      </div>
                    </div>
                   `);
                } else {
                  let fr = new mOxie.FileReader();

                  fr.onload = function () {
//                     文件添加进队列后，处理相关的事情
                    $('#pickfiles' + _this.ID).prepend(`
                    <div class="imgItem" id="${file.id}">
                      <div style=" position: relative;">
                        <img src="${fr.result}" style="width: 1.5rem; height: 1.5rem; ">
                        <div class="progress"><b style="color: #fff !important;"></b></div>
                        <div class="remove pic_delete van-icon van-icon-close"  data-val=${file.id}>

                        </div>
                      </div>
                    </div>
                   `);
                  };
                  fr.readAsDataURL(file.getSource());
                }
              });
            },
            'BeforeUpload': function (up, file) {
              // 每个文件上传前，处理相关的事情
              _this.isUploading = true;
              up.setOption('multipart_params', {
                token: _this.token,               // 上传凭证
              });
            },
            'UploadProgress': function (up, file) {
              // 每个文件上传时，处理相关的事情
              if (document.getElementById(file.id)) {
                if (file.percent < 100) {
                  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                } else {
                  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>处理中</span>';
                }
              }
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
                  _this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);
                  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span class="van-icon van-icon-passed"></span>';
                }
              }).catch(error => {
                _this.$http.defaults.timeout = null;
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span class="van-icon van-icon-close"></span>';
              });
            },
            'UploadComplete': function () {
              //队列文件处理完毕后，处理相关的事情
              _this.isUploading = false;
              _this.$emit('getImg', [_this.ID, _this.imgId, _this.isUploading]);
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

  #container {
    padding: 0 .1rem;
    .pickfiles {
      display: flex;
      display: -webkit-flex; /* Safari */
      flex-wrap: wrap;
      > div {
        margin-left: .3rem;
        margin-top: .3rem;
      }
      .upButton {
        width: 1.5rem;
        height: 1.5rem;
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
        bottom: .5rem;
        font-size: .5rem;
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
        z-index: 1;
        background: #333;
        color: #fff;
        font-size: .5rem;
      }
    }
  }
</style>
