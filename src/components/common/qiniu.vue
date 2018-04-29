<template>
  <div>
    <div id="cxUpload" class="cx-upload">
      <button id="pickfiles" class="uploadBtn">上传</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "qiniu",
    data() {
      return {}
    },
    mounted() {
      this.getTokenMessage();
    },
    watch: {},
    methods: {
      getTokenMessage() {
        this.$http.get(globalConfig.server_user + 'files').then((res) => {
          this.initQiniu(res.data.data);
        })
      },
      initQiniu(token) { // 初始化七牛
        let self = this;
        let uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', // 上传模式,依次退化
          browse_button: 'pickfiles', // 上传选择的点选按钮，**必需**
          // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
          uptoken: token, // uptoken 是上传凭证，由其他程序生成
          get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的 uptoken
          // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
          unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
          save_key: false, // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
          domain: globalConfig.domain, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
          container: 'cxUpload', // 上传区域 DOM ID，默认是 browser_button 的父元素，
          max_file_size: '100mb', // 最大文件体积限制
          flash_swf_url: 'path/of/plupload/Moxie.swf', //引入 flash,相对路径
          max_retries: 1, // 上传失败最大重试次数
          dragdrop: false, // 开启可拖曳上传
          drop_element: 'cxUpload', // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb', // 分块上传时，每块的体积
          filters: { //文件类型过滤，这里限制为图片类型
            mime_types: [{
              title: "Image files",
              extensions: "jpg,jpeg,gif,png"
            }]
            // prevent_duplicates : false //不允许选取重复文件
          },
          auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
          init: {
            'FilesAdded': function (up, files) {
              plupload.each(files, function (file) {
                // 文件添加进队列后,处理相关的事情

              });
            },
            'BeforeUpload': function (up, file) {
              // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function (up, file) {
              // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function (up, file, info) {
              // 每个文件上传成功后,处理相关的事情
              // console.log('info+++++++++++++++');
              // console.log(info);
              // 其中 info 是文件上传成功后，服务端返回的json，形式如
              // {
              //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
              //    "key": "gogopher.jpg"
              //  }
              // var domain = up.getOption('domain');
              // var res = eval('(' + info + ')');

              // 获取上传成功后的文件的Url
              // var sourceLink = domain + res.key;
              // var symbolLink = self.uptokenObj.imgPlaceholder + res.key;
              // var linkObject = {
                // "sourceLink": domain + res.key,
                // "symbolLink": self.uptokenObj.imgPlaceholder + res.key
              // };

              // self.$emit('get-path', linkObject);
            },
            'Error': function (up, err, errTip) {
              //上传出错时,处理相关的事情
              // console.log('失败----------');
            },
            'UploadComplete': function () {
              //队列文件处理完毕后,处理相关的事情
            },
            'Key': function (up, file) {
              // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
              // 该配置必须要在 unique_names: false , save_key: false 时才生效
              // 获取当前时间戳
              // var timestamp = new Date().getTime();
              // var key = "image/cxw/" + timestamp + ".png";
              // do something with key here
              // return key
            }
          }

        });
      },
    }
  }
</script>

<style lang="scss">
  .cx-upload {
    display: inline-block;
    .uploadBtn {
      width: 64px;
      height: 30px;
      color: #2f363c;
      outline: none;
      border: 2px solid #2f363c;
    }
  }

  @media screen and (max-width: 648px) {
    .cx-upload {
      float: left;
    }
  }
</style>
