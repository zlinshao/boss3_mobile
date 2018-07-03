<template>
  <div id="staffSquare" :style="{'minHeight': `${windowHeight}px`}">
    <div class="module" v-if="loading"></div>
    <div class="loading" v-if="loading">
      <img src="../../assets/loding1.gif">
    </div>
    <div v-if="!loading">
      <div style="background: rgba(61,90,254,0.08);height: 10px;width: 100%;"></div>
      <div style="height: 140px;">
        <van-swipe :autoplay="3000" v-if="roundSowData.length>0">
          <van-swipe-item v-for="(image, index) in roundSowData" :key="index">
            <span>
              <img :src="image && image.album && image.album.cover_pic && image.album.cover_pic.uri" width="100%"
                   @click="goArticleDetail(image.id)"
                   style="min-height: 140px;"
                   v-if="image && image.album && image.album.cover_pic && image.album.cover_pic.uri"/>
              <img src="../../assets/swipe_no_data.png" width="100%" @click="goArticleDetail(image.id)" v-else>
            </span>
            <div style="position: absolute;z-index: 1;background: rgba(0,0,0,0.3);width: 100%;left: 0;top: 96px;">
              <span
                style="color: #FFFFFF;display: inline-block;height: 25px;line-height: 25px;margin: 10px 20px;width: 70%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;word-break: break-all;">{{image.title}}</span>
            </div>
          </van-swipe-item>
        </van-swipe>
        <div v-if="roundSowData.length<1">
          <img src="../../assets/swipe_no_data.png" width="100%">
        </div>
      </div>
      <div style="background: #fafafe;height: 11px;width: 100%;margin-top: -2px;position: relative;z-index: 1;"></div>
      <div style="position: relative;z-index: 1;background: #FFFFFF;">
        <div class="staff_type">
          <ul>
            <li v-for="(type, index) in staffSquareType" v-if="type.id==142"
                :class="{'active': active==index}" @click="staffSquareTypeMove(index)">
              {{type.dictionary_name}}
            </li>
            <li v-for="(type, index) in staffSquareType"
                v-if="type.id!=144 && type.id!=145 && type.id!=146 && type.id!=142"
                :class="{'active': active==index}" @click="staffSquareTypeMove(index)">
              {{type.dictionary_name}}
            </li>
          </ul>
        </div>
        <div class="staff_article">
          <div style="text-align: center;position: relative;margin-left: 45%;height: 80px;padding-top: 40px;"
               v-if="articleLoading">
            <van-loading type="spinner" color="black"/>
          </div>
          <ul>
            <li class="clearfix" v-for="(item, key) in articleData" v-if="!articleLoading"
                @click="goArticleDetail(item.id)">
              <!--<span v-for="pic in item && item.album && item.album.cover_pic" class="fl">-->
              <!--<img :src="pic.uri" :width="imgWidth" :height="imgWidth/1.53" v-if="pic.uri">-->
              <!--&lt;!&ndash;<span v-for="(p,k) in pic">&ndash;&gt;-->
              <!--&lt;!&ndash;<img :src="p.uri" :width="imgWidth" :height="imgWidth/1.53" v-if="p.uri">&ndash;&gt;-->
              <!--&lt;!&ndash;<img src="../../assets/noImage.png" :width="imgWidth" :height="imgWidth/1.53" v-else>&ndash;&gt;-->
              <!--&lt;!&ndash;</span>&ndash;&gt;-->
              <!--</span>-->
              <span v-if="item && item.album && item.album.cover_pic && item.album.cover_pic.uri" class="fl">
                <img :src="item.album.cover_pic.uri" :width="imgWidth" :height="imgWidth/1.53">
              </span>
              <span class="fl" v-else>
                <img src="../../assets/noImage.png" :width="imgWidth" :height="imgWidth/1.53"/>
              </span>
              <div class="article_right"
                   :style="{marginLeft: `${imgWidth+20}px`, height: `${imgWidth/1.53}px`, width: `${articleWidth}px`}">
                <p class="second_line_camp">{{item.title}}</p>
                <p class="info">
                  <i class="iconfont icon-shijian2"></i> <span>{{item.create_time}}</span>
                  <i class="iconfont icon-pinglun"></i> <span>{{item.comments_count}}</span>
                </p>
              </div>
            </li>
          </ul>
          <div v-if="articleData.length<1 && !articleLoading">
            <div class="content" style="text-align: center;margin-top: 20px;background: #fff;">
              <div class="content_img"><img src="../../assets/no_data2.png" style="width: 40%;"></div>
              <div class="last_title">暂无数据 ...</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {ImagePreview} from 'vant';
  import {Toast} from 'vant';

  export default {
    components: {ImagePreview, Toast},
    name: "index",
    data() {
      return {
        loading: false,
        articleLoading: false,
        urls: globalConfig.server,
        form: {
          status: 149,
          keywords: '',
          pages: 1,
        },
        newsData: {}, // 乐伽新闻
        staffData: {}, // 员工风采
        cusData: {}, // 客户纪实
        lifeData: {}, // 公司生活
        hotData: {},  // 热门导读
        figureData: {},  // 人物志
        hostData: {},   // 主轮播
        lessData: {}, // 次标题1
        lowData: {},  // 次标题2
        staffSquareType: [],
        active: 4,
        imgWidth: window.innerWidth * 0.3,
        articleWidth: window.innerWidth - window.innerWidth * 0.3 - 40,
        windowHeight: window.innerHeight,
        roundSowData: [],  //轮播数据
        articleData: [],  //文章列表数据
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.loading = true;
        vm.routerIndex('', 'house');
        vm.ddRent('', ',house');
      });
    },
    mounted() {
      this.getDictionary();
    },
    activated() {
      this.getRoundSowing();
      this.getArticleData();
    },
    watch: {
      active(val) {
        this.getArticleData();
      }
    },
    methods: {
      staffSquareTypeMove(index) {
        this.active = index;
        let scrollLeft = 0;
        setTimeout(() => {
          $(".staff_type ul li").each(function (index, e) {
            var self = $(this);
            if (!self.hasClass('active')) {
              scrollLeft += self.width();
            } else {
              return false;
            }
          });
          scrollLeft -= (window.innerWidth - $(".staff_type ul li.active").width()) / 2 - 80;
          $(".staff_type ul").scrollLeft(scrollLeft);
        }, 100);
      },
      goArticleDetail(id) {
        this.loading = true;
        this.$router.push({path: '/writings', query: {id: id}});
      },
      getDictionary() {
        this.dictionary(137, 1).then((res) => {
          this.staffSquareType = res.data;
        });
      },
      //轮播图，次标题1，次标题2
      getRoundSowing() {
        this.loading = true;
        // 主轮播
        this.$http.get(this.urls + 'oa/portal/?dict_id=144', {params: this.form}).then((res) => {
          this.roundSowData = [];
          let data = res.data && res.data.data && res.data.data.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              let cover_pic = data[i] && data[i].album && data[i].album.cover_pic;
              let first = true;
              for (let key in cover_pic) {
                if (first) {
                  let pic = {};
                  pic.id = data[i].id;
                  pic.uri = cover_pic && cover_pic[key] && cover_pic[key][0] && cover_pic[key][0].uri;
                  pic.title = data[i].title;
                  data[i].album.cover_pic = pic;
                }
                first = false;
              }
            }
            data.forEach((item) => {
              this.roundSowData.push(item);
            });
            for (let i = 0; i < data.length; i++) {
              let cover_pic = data[i] && data[i].album && data[i].album.cover_pic;
              let first = true;
              for (let key in cover_pic) {
                if (first) {
                  let pic = {};
                  pic.id = data[i].id;
                  pic.uri = cover_pic && cover_pic[key] && cover_pic[key][0] && cover_pic[key][0].uri;
                  pic.title = data[i].title;
                  data[i].album.cover_pic = pic;
                }
                first = false;
              }
            }
            this.roundSowData.push(data[0]);
          }
          this.loading = false;
          // 次标题1
          this.$http.get(this.urls + 'oa/portal/?dict_id=145', {params: this.form}).then((res) => {
            let data = res.data && res.data.data && res.data.data.data;
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                let cover_pic = data[i] && data[i].album && data[i].album.cover_pic;
                let first = true;
                for (let key in cover_pic) {
                  if (first) {
                    let pic = {};
                    pic.id = data[i].id;
                    pic.uri = cover_pic && cover_pic[key] && cover_pic[key][0] && cover_pic[key][0].uri;
                    pic.title = data[i].title;
                    data[i].album.cover_pic = pic;
                  }
                  first = false;
                }
              }
              this.roundSowData.push(data[0]);
            }
            // 次标题2
            this.$http.get(this.urls + 'oa/portal/?dict_id=146', {params: this.form}).then((res) => {
              let data = res.data && res.data.data && res.data.data.data;
              if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  let cover_pic = data[i] && data[i].album && data[i].album.cover_pic;
                  let first = true;
                  for (let key in cover_pic) {
                    if (first) {
                      let pic = {};
                      pic.id = data[i].id;
                      pic.uri = cover_pic && cover_pic[key] && cover_pic[key][0] && cover_pic[key][0].uri;
                      pic.title = data[i].title;
                      data[i].album.cover_pic = pic;
                    }
                    first = false;
                  }
                }
                this.roundSowData.push(data[0]);
              }
            });
          });
        });
      },
      getArticleData() {
        var dict_id = 142;
        switch (this.active) {
          case 0:
            // 乐伽新闻
            dict_id = 138;
            break;
          case 1:
            // 员工风采
            dict_id = 139;
            break;
          case 2:
            // 客户纪实
            dict_id = 140;
            break;
          case 3:
            //公司生活
            dict_id = 141;
            break;
          case 4:
            //热门导读
            dict_id = 142;
            break;
          case 5:
            //人物志
            dict_id = 143;
            break;
        }
        this.articleLoading = true;
        this.$http.get(this.urls + 'oa/portal/?dict_id=' + dict_id, {params: this.form}).then((res) => {
          this.articleLoading = false;
          if (res.data.code === '80000') {
            if (res.data.data.data.length > 0) {
              res.data.data.data.forEach((item) => {
                item.create_time = this.formatDateTime(item.create_time);
              });
              for (let i = 0; i < res.data.data.data.length; i++) {
                let reportData = res.data.data.data;
                let cover_pic = reportData[i] && reportData[i].album && reportData[i].album.cover_pic;
                let first = true;
                for (let key in cover_pic) {
                  if (first) {
                    let pic = {};
                    pic.id = reportData[i].id;
                    pic.uri = cover_pic && cover_pic[key] && cover_pic[key][0] && cover_pic[key][0].uri;
                    pic.title = reportData[i].title;
                    reportData[i].album.cover_pic = pic;
                  }
                  first = false;
                }
              }
              this.articleData = res.data && res.data.data && res.data.data.data;
            } else {
              this.articleData = [];
            }
          } else {
            this.articleData = [];
          }
        });
      },
      formatDateTime(time) {
        let result;
        let create_time = Date.parse(new Date(time.split('-').join('/')));
        let now_time = Date.parse(new Date());
        let difference = (now_time - create_time) / 1000;
        if (difference * 1000 >= 0 && difference < 60) {
          result = Math.floor(difference) + ' 秒前';
        } else if (difference >= 60 && difference < 3600) {
          result = Math.floor(difference / 60) + ' 分钟前';
        } else if (difference >= 3600 && difference < 3600 * 24) {
          result = Math.floor(difference / 3600) + ' 小时前';
        } else if (difference >= 3600 * 24 && difference < 3600 * 24 * 30) {
          result = Math.floor(difference / 3600 / 24) + ' 天前';
        } else if (difference >= 3600 * 24 * 30 && difference < 3600 * 24 * 30 * 12) {
          result = Math.floor(difference / 3600 / 24 / 30) + ' 个月前';
        } else if (difference >= 3600 * 24 * 30 * 12) {
          result = Math.floor(difference / 3600 / 24 / 30 / 12) + ' 年前';
        }
        return result;
      },
      addRegion() {
        // 主轮播
        this.$http.get(this.urls + 'oa/portal/?dict_id=144', {params: this.form}).then((res) => {
          let data = res.data && res.data.data && res.data.data.data;
          this.hostData = Object.assign({}, this.hostData, {data: data});
          localStorage.setItem('convergeHostData', JSON.stringify(this.hostData));
        });
        // 次标题1
        this.$http.get(this.urls + 'oa/portal/?dict_id=145', {params: this.form}).then((res) => {
          let data = res.data && res.data.data && res.data.data.data;
          this.lessData = Object.assign({}, this.lessData, {data: data});
          localStorage.setItem('convergeLessData', JSON.stringify(this.lessData));
        });
        // 次标题2
        this.$http.get(this.urls + 'oa/portal/?dict_id=146', {params: this.form}).then((res) => {
          let data = res.data && res.data.data && res.data.data.data;
          this.lowData = Object.assign({}, this.lowData, {data: data});
          localStorage.setItem('convergeLowData', JSON.stringify(this.lowData));
        });
        // 乐伽新闻
        this.$http.get(this.urls + 'oa/portal/?dict_id=138', {params: this.form}).then((res) => {
          if (res.data.data.data.length > 0) {
            res.data.data.data.forEach((item) => {
              let create_time = Date.parse(new Date(item.create_time.split('-').join('/')));
              let now_time = Date.parse(new Date());
              let difference = (now_time - create_time) / 1000;
              if (difference * 1000 >= 0 && difference < 60) {
                item.create_time = Math.floor(difference) + ' 秒前';
              } else if (difference >= 60 && difference < 3600) {
                item.create_time = Math.floor(difference / 60) + ' 分钟前';
              } else if (difference >= 3600 && difference < 3600 * 24) {
                item.create_time = Math.floor(difference / 3600) + ' 小时前';
              } else if (difference >= 3600 * 24 && difference < 3600 * 24 * 30) {
                item.create_time = Math.floor(difference / 3600 / 24) + ' 天前';
              } else if (difference >= 3600 * 24 * 30 && difference < 3600 * 24 * 30 * 12) {
                item.create_time = Math.floor(difference / 3600 / 24 / 30) + ' 个月前';
              } else if (difference >= 3600 * 24 * 30 * 12) {
                item.create_time = Math.floor(difference / 3600 / 24 / 30 / 12) + ' 年前';
              }
            });
          }
          let data = res.data && res.data.data && res.data.data.data;
          this.newsData = Object.assign({}, this.newsData, {data: data});
          localStorage.setItem('convergeNewsData', JSON.stringify(this.newsData));
        });
        // 员工风采
        this.$http.get(this.urls + 'oa/portal/?dict_id=139', {params: this.form}).then((res) => {
          let data = res.data && res.data.data && res.data.data.data;
          this.staffData = Object.assign({}, this.staffData, {data: data});
          localStorage.setItem('convergeStaffData', JSON.stringify(this.staffData));
        });
        // 客户纪实
        this.$http.get(this.urls + 'oa/portal/?dict_id=140', {params: this.form}).then((res) => {
          let data = res.data && res.data.data && res.data.data.data;
          this.cusData = Object.assign({}, this.cusData, {data: data});
          localStorage.setItem('convergeCusData', JSON.stringify(this.cusData));
        });
        // 热门导读
        this.$http.get(this.urls + 'oa/portal/?dict_id=142', {params: this.form}).then((res) => {
          let data = res.data && res.data.data && res.data.data.data;
          this.hotData = Object.assign({}, this.hotData, {data: data});
          localStorage.setItem('convergeHotData', JSON.stringify(this.hotData));
        });
        // 公司生活
        this.$http.get(this.urls + 'oa/portal/?dict_id=141', {params: this.form}).then((res) => {
          let data = res.data && res.data.data && res.data.data.data;
          this.lifeData = Object.assign({}, this.lifeData, {data: data});
          localStorage.setItem('convergeLifeData', JSON.stringify(this.lifeData));
        });
        // 人物志
        this.$http.get(this.urls + 'oa/portal/?dict_id=143', {params: this.form}).then((res) => {
          let title, data = {};
          title = res.data && res.data.data && res.data.data.data && res.data.data.data[0] && res.data.data.data[0].title;
          data = res.data && res.data.data && res.data.data.data;
          this.figureData = Object.assign({}, this.figureData, {title: title, data: data});
          localStorage.setItem('convergeFigureData', JSON.stringify(this.figureData));
        });
      }
    },
  }
</script>

<style lang="scss">
  #staffSquare {
    .van-swipe .van-swipe__indicators {
      left: initial;
      right: -10px;
      bottom: initial;
      top: 120px;
    }
    .van-swipe__indicator--active {
      background-color: #FFFFFF;
    }
    .van-swipe .van-swipe__indicators i {
      width: 16px;
      height: 2px;
      border-radius: 0;
    }
    background: #FFFFFF;
    .staff_type {
      font-family: PingFangHK-Light;
      width: 100%;
      ul {
        background: #FFFFFF;
        overflow-x: auto;
        white-space: nowrap;
        padding: 0px 20px;
        box-shadow: 0 2px 14px 0 rgba(61, 90, 254, 0.15);
        li {
          margin-left: 26px;
          display: inline-block;
          list-style: none;
          line-height: 60px;
          height: 60px;
          border: 1px solid #FFFFFF;
        }
        li:first-child {
          margin-left: 0;
        }
        li.active {
          color: #536DFE;
          border-bottom: 1px solid #536DFE;
        }
      }

    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .second_line_camp {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-height: 22px;
      -webkit-box-orient: vertical;
      box-orient: vertical;
      word-break: break-all;
      height: 46px;
      padding-right: 20px;
      padding-top: 3px;
      color: #212121;
    }
    .staff_article {
      margin-bottom: 20px;
      font-family: PingFangHK-Light;
      padding: 0 0 0 20px;
      width: 100%;
      ul {
        li {
          display: inline-block;
          margin-top: 20px;
          .article_right {
            box-sizing: border-box;
            border-bottom: 1px solid #e0e0e0;
          }
          .info {
            margin-top: 8px;
            span {
              display: inline-block;
              font-size: 12px;
              color: #9e9e9e;
              width: 70px;
            }
            i {
              vertical-align: middle;
              color: #9e9e9e;
              font-size: 13px;
            }
          }

        }
      }
    }
    .content {
      .content_img {
        position: relative;
        margin-top: 100px;
      }
      .last_title {
        position: relative;
        margin-top: 30px;
        font-size: 16px;
        color: #9e9e9e;
      }
    }
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    @mixin minMaxWidth($n) {
      min-width: $n;
      max-width: $n;
    }
    @mixin minMaxHeight($n) {
      min-height: $n;
      max-height: $n;
    }
    @mixin flow {
      overflow: hidden;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    @mixin border_radius($p) {
      -webkit-border-radius: $p;
      -moz-border-radius: $p;
      border-radius: $p;
    }

  }
</style>
