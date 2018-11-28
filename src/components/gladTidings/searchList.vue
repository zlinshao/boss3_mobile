<template>
  <div id="searchClass">
    <div class="searchClass">
      <div class="searchCustom">
        <div>
          <i class="van-icon van-icon-search"></i>
          <input type="text" v-model="searchValue" @keyup.enter="onSearch">
          <i v-if="searchValue.length !== 0" class="iconfont icon-cuowu-guanbi" @click="searchValue = ''"></i>
        </div>
        <p v-if="searchValue.length > 0" @click="onSearch" style="color: #666666;">搜索</p>
        <p v-else @click="onCancel">取消</p>
      </div>
      <div class="searchContent">
        <van-list
          :finished="finished"
          @load="onLoad">
          <div class="started">
            <div class="startedMain" v-for="item in lists" @click="bulletinList(item)">

              <div class="leftPic">
                <img :src="item.avatar" v-if="item.avatar !== '' && item.avatar !== null">
                <img src="../../assets/head.png" v-else>
              </div>
              <div class="rightTitle">
                <div class="title">
                  <h2>
                    <span>{{item.name}}</span><span>&nbsp;-&nbsp;{{item.depart}}</span>
                  </h2>
                  <span class="times">{{item.created_at}}</span>
                </div>
                <h3>
                  报备类型：
                  <span v-if="active !== 3">{{item.title}}</span>
                  <span v-if="active === 3">我的{{item.bulletin}}</span>
                </h3>
                <h3>
                  房屋地址：
                  <span>{{item.house_name}}</span>
                </h3>
                <h3>
                  <!--结束时间：0000-00-00 00:00:00-->
                </h3>
                <div class="progress"
                     :class="{'published':item.status === 'published','rejected':item.status === 'rejected','cancelled':item.status === 'cancelled'}">
                  <div>
                    <h4></h4>
                    <h5></h5>
                  </div>
                  <div>
                    {{item.place}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <div class="notData" style="line-height: .46rem" v-if="lists.length === 0 && showDetail === 0">输入搜索内容结束后<br>请点击「回车」或搜索按钮
        </div>
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 2">暂无相关信息</div>
        <div class="notData" v-if="lists.length === 0 && this.searchValue.length > 0 && showDetail === 1">
          <van-loading type="spinner" color="black"/>
        </div>

        <div class="bottom">
          <div class="abc" v-if="loading && this.lists.length > 5">没有更多了</div>
          <div class="abc" v-if="!loading && this.lists.length !== 0">
            <van-loading type="spinner" color="black"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "collect-house",
    data() {
      return {
        urls: globalConfig.server,
        showDetail: 0,
        loading: true,
        finished: true,
        searchValue: '',          //搜索
        lists: [],
        params: {},

        path: '',
      }
    },
    activated() {
      this.close_();
      this.params = JSON.parse(this.$route.query.term);
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path;
        vm.routerIndex(from.path);
        vm.ddRent(from.path);
      })
    },
    watch: {
      searchValue(val) {
        let value = val.replace(/\s+/g, '');
        this.searchValue = value;
        if (value !== '') {
        } else {
          this.close_();
        }
      }
    },
    methods: {
      onLoad(val) {
        // 异步更新数据
        setTimeout(() => {
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (!this.finished) {
            this.myData(val);
            this.params.page++;
          }
        }, 500);
      },
      // 搜索
      onSearch() {
        this.finished = false;
        this.lists = [];
        if (this.searchValue !== '') {
          this.showDetail = 1;
          this.params.page = 1;
          this.params.q = this.searchValue;
          this.onLoad(this.params);
        }
      },
      myData(val) {
        this.finished = true;
        this.$http.get(this.urls + 'workflow/process', {
          params: val,
        }).then((res) => {
          if (res.data.code === '20000') {
            let data = res.data.data.data;
            if (data.length !== 0) {
              for (let i = 0; i < data.length; i++) {
                let user = {};
                user.title = data[i].title;
                user.created_at = data[i].created_at;
                if (val.type === 3) {
                  if (data[i].content.house) {
                    user.house_name = data[i].content.house.name;
                  } else {
                    user.house_name = '/';
                  }
                  if (data[i].user) {
                    user.avatar = data[i].user.avatar;
                    user.name = data[i].user.name;
                    user.depart = data[i].user.org[0].name;
                  } else {
                    user.avatar = '';
                    user.name = '';
                    user.staff = '';
                  }
                  user.id = data[i].id;
                  user.place = data[i].place.display_name;
                  user.status = data[i].place.status;
                  user.bulletin = data[i].content.bulletin_name;
                }
                if (val.type === 1 || val.type === 2 || val.type === 4) {
                  if (data[i].flow) {
                    if (user.house_name = data[i].flow.content.house) {
                      user.house_name = data[i].flow.content.house.name;
                    } else {
                      user.house_name = '/';
                    }
                    if (data[i].user) {
                      user.avatar = data[i].flow.user.avatar;
                      user.name = data[i].flow.user.name;
                      user.depart = data[i].flow.user.org[0].name;
                    } else {
                      user.avatar = '';
                      user.name = '';
                      user.staff = '';
                    }
                    user.id = data[i].flow.id;
                    user.place = data[i].flow.place.display_name;
                    user.status = data[i].flow.place.status;
                    if (data[i].flow.content.type) {
                      user.bulletin = data[i].flow.content.type.name;
                    } else {
                      user.bulletin = '';
                    }
                  } else {
                    user.place = '';
                    user.status = '';
                    user.bulletin = '';
                  }
                }
                this.lists.push(user);
              }
              this.finished = false;
            } else {
              this.loading = true;
            }
          } else {
            this.loading = true;
            this.showDetail = 2;
          }
        })
      },

      // 房屋地址
      bulletinList(data) {
        this.routerDetail(data.id);
        this.close_();
      },
      // select关闭
      onCancel() {
        this.close_();
        this.$router.replace({path: this.path});
      },
      close_() {
        this.showDetail = 0;
        this.lists = [];
        this.searchValue = '';
      },
    },
  }
</script>

<style lang="scss">
  #searchClass {
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }

    @mixin border_radius($p) {
      -webkit-border-radius: $p;
      -moz-border-radius: $p;
      border-radius: $p;
    }

    @mixin img($p) {
      min-width: $p;
      max-width: $p;
      min-height: $p;
      max-height: $p;
    }
    $onColor: #39b1ff;
    $color: #a4a5a8;
    .started {
      background: #FFFFFF;
      padding: .3rem .3rem 0;
      @include flex;
      flex-wrap: wrap;
      width: 100%;
      P, h2 {
        text-align: center;
        i {
          font-size: .42rem;
          color: #ffffff;
        }
      }
    }
    .started {
      @include flex;
      .startedMain {
        width: 100%;
        @include flex;
        padding-bottom: .3rem;
        .leftPic {
          @include img(.9rem);
          margin-right: .3rem;
          img {
            @include img(.9rem);
            @include border_radius(50%);
          }
        }
        .rightTitle {
          width: 100%;
          border-bottom: .02rem solid #ebebeb;
          padding-bottom: .3rem;
          span {
            color: #9c9c9c;
          }
          div.title, div.progress {
            @include flex;
            justify-content: space-between;
            align-items: center;
          }
          div.title {
            line-height: .42rem;
            h2 {
              max-width: 3.5rem;
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              span {
                color: #101010;
              }
            }
            span.times {
              min-width: 2rem;
              text-align: right;
            }
          }
          h3 {
            margin: .15rem 0;
            color: $color;
          }
          div.progress {
            div {
              @include border_radius(10px);
            }
            div:first-of-type {
              width: 100%;
              @include flex;
              align-items: center;
              h4, h5 {
                height: .06rem;
                width: 100%;
                background: #cccccc;
              }
              h4 {
                background: -webkit-linear-gradient(left, #2BD7A1, #39b1ff);
                background: -o-linear-gradient(left, #2BD7A1, #39b1ff);
                background: -moz-linear-gradient(left, #2BD7A1, #39b1ff);
                background: linear-gradient(left, #2BD7A1, #39b1ff);
              }
            }
            div:last-of-type {
              margin-top: -.03rem;
              min-width: 2.4rem;
              text-align: right;
              color: $onColor;
            }
          }
          /*通过*/
          div.published {
            div:first-of-type {
              h5 {
                width: 0;
              }
            }
            div:last-of-type {
              color: #2BD7A1;
            }
          }
          /*拒绝*/
          div.rejected {
            div:first-of-type {
              h5 {
                width: 0;
              }
              h4 {
                background: -webkit-linear-gradient(left, #2BD7A1, #e4393c);
                background: -o-linear-gradient(left, #2BD7A1, #e4393c);
                background: -moz-linear-gradient(left, #2BD7A1, #e4393c);
                background: linear-gradient(left, #2BD7A1, #e4393c);
              }
            }
            div:last-of-type {
              color: #e4393c;
            }
          }
          /*撤回*/
          div.cancelled {
            div:first-of-type {
              h4 {
                width: 0;
              }
            }
            div:last-of-type {
              color: #cccccc;
            }
          }
        }
      }
    }
    .bottom {
      @include flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      color: #DDDDDD;
      .abc {
        @include flex;
        justify-content: center;
        line-height: .4rem;
        color: #aaaaaa;
        text-align: center;
        background-color: #f4f4f4;
        padding: .2rem 0;
        width: 100%;
      }
    }
  }
</style>
