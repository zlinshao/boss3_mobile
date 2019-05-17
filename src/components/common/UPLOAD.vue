<template>
  <div id="upLoad">
    <label class="labelTitle" v-if="file.label">{{file.label}}
      <span v-if="file.placeholder">({{file.placeholder}})</span>
    </label>
    <transition-group name="list" tag="p" class="items-center">
      <div v-for="(item,index) in showFile" :key="JSON.stringify(item)" class="showFile"
           :style="uploadCss">
        <div class="img">
          <!--图片-->
          <img :src="item.uri" v-if="item.mime.includes('image')" @click="$bigPhoto(showFile,item.uri)" alt="">
          <!--视频-->
          <!--@click="videoPlay($event)" 播放事件-->
          <img src="../../assets/image/file/video.png" :alt="item.uri" @click="videoPlay($event)"
               v-else-if="item.mime.includes('video')">
          <!--其它类型-->
          <img src="../../assets/image/file/xls.png" alt="xls" v-else-if="item.mime.includes('xls')">
          <img src="../../assets/image/file/doc.png" alt="doc" v-else-if="item.mime.includes('doc')">
          <img src="../../assets/image/file/txt.png" alt="text" v-else-if="item.mime.includes('text')">
          <img src="../../assets/image/file/pdf.png" alt="pdf" v-else-if="item.mime.includes('pdf')">
          <img src="../../assets/image/file/file.png" alt="file" v-else>
        </div>
        <!--进图条-->
        <div class="progress" :id="'progress' + file.keyName + index"
             v-if="!item.uri.includes('http://')">
          {{progress['progress' + file.keyName + index]}}
        </div>
        <!--删除按钮-->
        <div class="remove flex" @click="removeFile(index)">
          <img src="../../assets/image/file/closeBtn.png" alt="">
        </div>
      </div>
      <!--上传按钮-->
      <label class="uploadPic" :key="file.keyName" :style="uploadCss" :for="file.keyName" @change="uploadPic($event)">
        <img src="../../assets/image/file/upload.png" alt="">
        <input type="file" :id="file.keyName" hidden multiple>
      </label>
    </transition-group>

    <!--视频播放-->
    <div id="videoId" :class="['video-' + phoneType()]" v-show="videoSrc !== ''">
      <video id="video" :src="videoSrc" muted controls autoplay></video>
      <div class="items-center close">
        <span class="flex-center" @click="videoPlay()">
          <img src="../../assets/image/file/closeBtn.png" alt="">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as qiniu from 'qiniu-js'
  import {md5} from '../../assets/js/MD5.js'

  export default {
    name: "upload",
    props: ['file', 'getImg', 'close'],
    data() {
      return {
        url: globalConfig.server,
        subscription: {},
        token: '',//上传凭证
        ids: [],
        showFile: [],//本地文件地址
        isVideo: '',//是否视频
        progress: {},
        uploadCss: this.file.size || {width: '1rem', height: '1rem'},
        videoSrc: '',
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      getImg: {
        handler(val, oldVal) {
          this.ids = [];
          this.showFile = [];
          this.progress = {};
          if (val.length > 0) {
            let index = 0;
            for (let item of val) {
              this.ids.push(Number(item.id));
              if (item.info) {
                item.mime = item.info.mime;
              }
              this.showFile.push(item);
              this.progress['progress' + this.file.keyName + index] = 0;
              index++;
            }
          }
          console.log(this.progress);
          this.$emit('success', [this.file.keyName, this.ids, true]);
        },
        deep: true,
      },
      close(val) {
        if (!val) return;
        this.ids = [];
        this.showFile = [];
        this.progress = {};
        this.$emit('success', [this.file.keyName, this.ids, true]);
      }
    },
    computed: {},
    methods: {
      // 视频播放
      videoPlay(event = '') {
        if (event && event.target.alt.includes('http')) {
          this.videoSrc = event.target.alt;
        } else {
          this.videoSrc = '';
          // alert('不支持的视频文件！');
        }
      },
      removeFile(index) {
        this.showFile.splice(index, 1);
        this.ids.splice(index, 1);
        let progress = 'progress' + this.file.keyName + index;
        if (this.subscription[progress]) {
          this.subscription[progress].unsubscribe();
        }
        delete this.progress[progress];
        let pro = this.progress;
        let newPro = {};
        for (let [i, item] of new Map(Object.keys(pro).map((item, i) => [i, item]))) {
          newPro['progress' + this.file.keyName + i] = pro[item];
        }
        this.progress = newPro;
        let status = this.ids.length === this.showFile.length;
        this.$emit('success', [this.file.keyName, this.ids, status]);
      },
      // 获取token
      uploadPic(event) {
        this.$http.get(this.url + 'api/v1/token').then((res) => {
          this.token = res.data.data;
          this.startUpload();
          event.target.value = '';
        })
      },
      // 图片地址
      showPhoto(val, type, key) {
        let data = {};
        data.info = {};
        data.uri = val;
        data.mime = type;
        data.key = key;
        this.showFile.push(data);
      },
      // 开始上传
      startUpload() {
        let that = this;
        let files = document.getElementById(that.file.keyName).files;
        for (let file of files) {
          let reader = new FileReader();//构造FileReader对象
          let fileType = '';
          let fileName = file.name;
          let fileSize = file.size;
          if (fileSize > 104857600) {
            alert('文件最大小不得超过100MB');
            return;
          }
          let pro = 'progress' + that.file.keyName + (Object.keys(that.progress).length);
          that.progress[pro] = '0%';
          let key = "lejia" + md5(fileName + new Date().getTime()).toLowerCase() + "." + fileName.split(".")[1];
          reader.readAsDataURL(file);
          new Promise((resolve, reject) => {
            reader.onload = function (event) {
              if (file.type.includes('image')) {
                fileType = 'image';
                that.showPhoto(event.target.result, 'image', key);
              } else if (file.type.includes('video')) {
                fileType = 'video';
                that.showPhoto('', 'video', key);
              } else if (fileName.includes('.xls')) {
                fileType = 'xls';
                that.showPhoto(event.target.result, 'xls', key);
              } else if (fileName.includes('.doc') || fileName.includes('.rtf')) {
                fileType = 'doc';
                that.showPhoto(event.target.result, 'doc', key);
              } else if (fileName.includes('.txt')) {
                fileType = 'text';
                that.showPhoto(event.target.result, 'txt', key);
              } else if (fileName.includes('.pdf')) {
                fileType = 'pdf';
                that.showPhoto(event.target.result, 'pdf', key);
              } else {
                fileType = 'file';
                that.showPhoto(event.target.result, 'file', key);
              }
              resolve(fileType);
            };
          }).then(fileType => {
            let qiniuUploadUrl;
            if (window.location.protocol === 'https:') {
              qiniuUploadUrl = 'https://up.qbox.me';
            } else {
              qiniuUploadUrl = 'http://upload.qiniu.com';
            }
            let putExtra = {
              fname: fileName,
              params: {},
              mimeType: null,
            };
            let config = {
              useCdnDomain: true,
              region: null,
            };
            if (file.type.includes('image')) {
              // 图片压缩
              let options = {
                noCompressIfLarger: true,
                maxWidth: 1200,
                maxHeight: 1200
              };
              qiniu.compressImage(file, options).then(data => {
                that.uploadProgress(data.dist, key, that.token, putExtra, config, fileType, that, pro);
              });
            } else {
              that.uploadProgress(file, key, that.token, putExtra, config, fileType, that, pro);
            }
          });
        }
      },
      // 上传文件
      uploadProgress(file, key, token, putExtra, config, fileType, that, pro) {
        let observable = qiniu.upload(file, key, token, putExtra, config);
        this.subscription[pro] = observable.subscribe({
          next(res) {
            console.log(res);
            that.progress[pro] = Math.floor(res.total.percent) + '%';
            that.progress = Object.assign({}, that.progress);
            console.log(that.progress);
          },
          error(err) {
            console.log(err);
          },
          complete(res) {
            let data = {};
            data.url = globalConfig.domain + '/' + res.key;
            data.name = res.key;
            data.raw_name = res.key;
            data.type = fileType;
            data.size = file.size;
            that.$http.post(that.url + 'api/v1/upload-direct', data).then(res => {
              if (res.data.code === "110100") {
                that.ids.push(Number(res.data.data.id));
                let status = that.ids.length === that.showFile.length;
                that.$emit('success', [that.file.keyName, that.ids, status]);
              }
            })
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/common.scss";

  #upLoad {
    padding: .24rem 0 0 .3rem;
    width: 100%;

    video {
      width: 100%;
      height: 100%;
      @include radius(.1rem);
    }

    .list-enter-active, .list-leave-active {
      transition: all .6s;
    }

    .list-enter, .list-leave-to {
      opacity: 0;
      transform: translateY(.3rem);
    }

    .showFile, .uploadPic {
      overflow: hidden;
      @include radius(.1rem);
    }

    .items-center {
      flex-wrap: wrap;
    }

    .labelTitle {
      white-space: nowrap;
      margin: .2rem .3rem 0 0;

      span {
        color: #A2A2A2;
      }
    }

    .showFile {
      position: relative;
      margin: .2rem .2rem 0 0;

      .img {
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        color: #FFFFFF;
        background-color: rgba(0, 0, 0, .5);
        opacity: .8;
        font-size: .22rem;
        height: .4rem;
        line-height: .4rem;
        text-align: center;
      }

      .remove {
        cursor: pointer;
        position: absolute;
        top: -.2rem;
        right: -.2rem;
        width: .6rem;
        height: .6rem;
        @include radius(50%);
        background-color: #CF2E33;
        align-items: flex-end;

        img {
          margin: 0 0 .14rem .14rem;
          width: .16rem;
          height: .16rem;
        }
      }
    }

    .uploadPic {
      cursor: pointer;
      background-color: #F0F0F0;
      margin-top: .2rem;
      opacity: .7;
      @include flex('flex-center');

      img {
        width: .3rem;
        height: .3rem;
      }
    }
  }

</style>
