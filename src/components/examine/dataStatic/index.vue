<template>
  <div id="dataStatic">
    <van-cell-group>
      <div class="first_date">
        <van-field
          class="title"
          label="日期筛选">
        </van-field>
        <van-field
          style="width: 29%;"
          v-model="params.start_time"
          readonly
          type="text"
          @click="timeChoose(1)"
          placeholder="开始日期">
        </van-field>
        <van-field
          style="width: 29%;"
          v-model="params.end_time"
          readonly
          type="text"
          @click="timeChoose(2)"
          placeholder="结束日期">
        </van-field>
        <div class="resetClose" @click="resetClose()" v-if="params.start_time || params.end_time">
          <i class="iconfont icon-cuowu-guanbi"></i>
        </div>
      </div>
    </van-cell-group>
    <div class="modules" style="margin-top: .2rem">
      <div>
        <p class="titleP">姓名</p>
        <p style="color: #000000;font-size: .6rem">{{personal}}</p>
      </div>
      <div>
        <p class="titleP">业绩统计</p>
        <p><span style="color: #46C460;">{{personPerformance}}</span>&nbsp;万元
        </p>
      </div>
    </div>
    <div class="modules" style="margin-bottom: .2rem">
      <div>
        <p class="titleP">资料待提交单数</p>
        <p><span style="color: #F2617B;">{{personMaterials}}</span>&nbsp;单
        </p>
      </div>
      <div>
        <p class="titleP">个人业绩小组占比</p>
        <p><span style="color: #409EFF;">{{personPerformanceRatio}}</span>&nbsp;%</p>
      </div>
      <!--<div class="chart-wrapper">-->
      <!--<canvas id="mountNode"></canvas>-->
      <!--</div>-->
    </div>
    <div class="mainContent">
      <div class="mainList">
        <div class="tableCss">
          <table>
            <thead>
            <tr>
              <th style="padding-left: .3rem;" align=left>地址</th>
              <th style="min-width: 1.2rem;" align=left>总金额</th>
              <th style="min-width: 1.2rem;" align=left>月单价</th>
              <th style="min-width: 1.6rem;" align=left>付款方式</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="key in personPerformanceList">
              <!--<td style="color: #000000;padding-left: .3rem;" align=left>{{key.name}}</td>-->
              <td align=left>{{key.name}}</td>
              <td align=left>{{key.performance}}</td>
              <td align=left>{{key.month_price}}</td>
              <td align=left>{{key.pay_way_name}}</td>
            </tr>
            </tbody>
          </table>
          <div class="notData" style="padding: .3rem;" v-if="state === 2 && personPerformanceList.length < 1">暂无相关信息</div>
          <div class="notData bgColor" v-if="state === 2 && personPerformanceList.length > 10">我是有底线的</div>
          <div class="notData" v-if="state === 1">
            <van-loading type="spinner" color="black"/>
          </div>
        </div>
      </div>
    </div>

    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="timeShow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @change="monthDate"
        @cancel="onCancel"
        @confirm="onDate"/>
    </van-popup>
  </div>
</template>

<script>
  import F2 from '@antv/f2'

  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server + 'antv/index/',

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeIndex: '',
        timeValue: '',            //日期value

        personal: '',
        chart: null,
        params: {
          start_time: '',
          end_time: '',
        },
        paramsList: {
          start_time: '',
          end_time: '',
          limit: 10,
          page: 1,
        },
        isGetMore: true,          //滑动触发加载
        isLastPage: false,        //是否最后一页
        scrollHeight: 0,          //滚动到最底部
        state: 0,
        screenWidth: document.body.offsetWidth,
        data: [{                  //个人业绩占比小组业绩
          x: 1,
          y: 0,
        }],
        personMaterials: 0,        //个人资料待审核的数量
        personPerformance: 0,      //个人业绩总额
        personPerformanceRatio: 0, //个人业绩占比小组业绩
        personPerformanceList: [],  //个人业绩详情
      }
    },
    mounted() {
      // this.search(this.params);
      // this.antVList(this.paramsList);
      this.checkScroll();
      this.getNowFormatDate();
    },
    activated() {
      this.resetClose();
      this.routerIndex('');
      this.ddRent('');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.personal = JSON.parse(sessionStorage.personal).name;
    },
    watch: {},
    methods: {
      // 滚动条
      checkScroll() {
        let mainHeight = 6;
        let mainContent = $('.mainContent');
        mainContent.scrollTop(0);
        mainContent.css('maxHeight', mainHeight + 'rem');
        let _this = this;
        mainContent.scroll(function () {
          _this.scroll_bar();
        });
      },
      scroll_bar() {
        let mainContent = $('.mainContent');
        let body_height = mainContent.height();
        let body_scrollTop = mainContent.scrollTop();
        let mainList = $('.mainList').height();
        if (this.scrollHeight < mainList) {
          this.isGetMore = true;
        }
        this.scrollHeight = mainList;
        if (mainList - body_scrollTop - body_height < 200) {
          this.getMore();
          this.isGetMore = false;
        }
      },
      // 加载更多
      getMore() {
        if (this.isGetMore && !this.isLastPage) {
          this.paramsList.page++;
          this.antVList(this.paramsList);
        }
      },
      search(params) {
        let url1 = 'personMaterials';
        let url3 = 'personPerformance';
        let url4 = 'personPerformanceRatio';

        this.antVIndex(url1, params);
        this.antVIndex(url3, params);
        this.antVIndex(url4, params);

      },
      antVList(params) {
        this.state = 1;
        this.$http.get(this.urls + 'personPerformanceList', {
          params: params
        }).then((res) => {
          console.log('获取个人业绩详情');
          console.log(res.data);
          if (res.data.code === '20000') {
            if (res.data.data.length !== 0) {
              this.isLastPage = this.paramsList.page === res.data.page_info.max_page;
              for (let i = 0; i < res.data.data.length; i++) {
                this.personPerformanceList.push(res.data.data[i]);
              }
              this.state = 0;
            } else {
              this.state = 2
            }
          } else {
            this.state = 2;
            this.personPerformanceList = [];
          }
        })
      },
      antVIndex(url, params) {
        this.$http.get(this.urls + url, {
          params: params
        }).then((res) => {
          switch (url) {
            case 'personMaterials':
              console.log('个人资料待审核的数量');
              console.log(res.data);
              if (res.data.code === '20000') {
                this.personMaterials = res.data.data;
              }
              break;
            case 'personPerformance':
              console.log('个人业绩总额');
              console.log(res.data);
              if (res.data.code === '20000') {
                this.personPerformance = res.data.data;
              }
              break;
            case 'personPerformanceRatio':
              console.log('个人业绩占比小组业绩');
              console.log(res.data);
              if (res.data.code === '20000') {
                this.personPerformanceRatio = res.data.data;
                // this.data[0].y = res.data.data;
                // this.drawing(res.data.data);
              }
              // else {
              //   this.drawing(0);
              // }
              break;
          }
        });
      },
      drawing(val) {
        this.chart = new F2.Chart({
          id: 'mountNode',
          width: this.screenWidth / 2,
          height: this.screenWidth / 3,
          pixelRatio: window.devicePixelRatio,
        });
        this.chart.source(this.data, {
          y: {
            max: 100,
            min: 0
          }
        });
        this.chart.axis(false);
        this.chart.tooltip(false);
        this.chart.coord('polar', {
          transposed: true,
          innerRadius: 0.8,
          radius: 0.85
        });
        this.chart.guide().arc({
          start: [1, 0],
          end: [1, 99.98],
          top: false,
          style: {
            lineWidth: 10,
            stroke: '#ccc'
          }
        });
        this.chart.guide().text({
          position: ['50%', '50%'],
          content: val + '%',
          style: {
            fontSize: 16,
            fill: '#1890FF'
          }
        });
        this.chart.interval().position('x*y').size(10).animate({
          appear: {
            duration: 1200,
            easing: 'cubicIn'
          }
        });
        this.chart.render();
      },
      // 获取当前时间
      getNowFormatDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let strDate = date.getDate();
        this.currentDate = new Date(year, month, strDate);
      },

      // 日期选择
      timeChoose(val) {
        setTimeout(() => {
          this.timeShow = true;
        }, 200);
        this.timeIndex = val;
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate() {
        this.timeShow = false;
        this.close_();
        switch (this.timeIndex) {
          case 1:
            this.params.start_time = this.timeValue;
            this.paramsList.start_time = this.timeValue;
            this.search(this.params);
            this.antVList(this.paramsList);
            break;
          case 2:
            this.params.end_time = this.timeValue;
            this.paramsList.end_time = this.timeValue;
            this.search(this.params);
            this.antVList(this.paramsList);
            break;
        }
        this.onCancel();
      },
      onCancel() {
        this.timeShow = false;
      },
      close_() {
        this.personMaterials = 0;
        this.personPerformance = 0;
        this.personPerformanceRatio = 0;
        this.personPerformanceList = [];
      },
      resetClose() {
        this.params.start_time = '';
        this.params.end_time = '';
        this.paramsList.start_time = '';
        this.paramsList.end_time = '';
        this.paramsList.page = 1;
        this.close_();
        this.search(this.params);
        this.antVList(this.paramsList);
      }
      // drawing(data) {
      //   let Shape = F2.Shape;
      //   let G = F2.G;
      //   let Util = F2.Util;
      //   let Global = F2.Global;
      //   let Vector2 = G.Vector2;
      //   Shape.registerShape('interval', 'tick', {
      //     draw: function draw(cfg, container) {
      //       let points = this.parsePoints(cfg.points);
      //       let style = Util.mix({
      //         stroke: cfg.color
      //       }, Global.shape.interval, cfg.style);
      //       if (cfg.isInCircle) {
      //         let newPoints = points.slice(0);
      //         if (this._coord.transposed) {
      //           newPoints = [points[0], points[3], points[2], points[1]];
      //         }
      //
      //         let _cfg$center = cfg.center,
      //           x = _cfg$center.x,
      //           y = _cfg$center.y;
      //
      //         let v = [1, 0];
      //         let v0 = [newPoints[0].x - x, newPoints[0].y - y];
      //         let v1 = [newPoints[1].x - x, newPoints[1].y - y];
      //         let v2 = [newPoints[2].x - x, newPoints[2].y - y];
      //
      //         let startAngle = Vector2.angleTo(v, v1);
      //         let endAngle = Vector2.angleTo(v, v2);
      //         let r0 = Vector2.length(v0);
      //         let r = Vector2.length(v1);
      //
      //         if (startAngle >= 1.5 * Math.PI) {
      //           startAngle = startAngle - 2 * Math.PI;
      //         }
      //
      //         if (endAngle >= 1.5 * Math.PI) {
      //           endAngle = endAngle - 2 * Math.PI;
      //         }
      //
      //         let lineWidth = r - r0;
      //         let newRadius = r - lineWidth / 2;
      //
      //         return container.addShape('Arc', {
      //           className: 'interval',
      //           attrs: Util.mix({
      //             x: x,
      //             y: y,
      //             startAngle: startAngle,
      //             endAngle: endAngle,
      //             r: newRadius,
      //             lineWidth: lineWidth,
      //             lineCap: 'round'
      //           }, style)
      //         });
      //       }
      //     }
      //   });
      //   this.initialise(Util, data);
      // },
      //
      // initialise(Util, data) {
      //   this.chart = new F2.Chart({
      //     id: 'mountNode',
      //     width: this.screenWidth,
      //     pixelRatio: window.devicePixelRatio,
      //   });
      //   this.chart.source(this.data, {
      //     y: {
      //       max: 100,
      //       min: 0
      //     }
      //   });
      //   this.chart.axis(false); // hide all axis 坐标
      //   this.chart.tooltip(false); // hide tooltip 个性化配置
      //
      //   // set polar coordinate 设置坐标系类型
      //   this.chart.coord('polar', {  //极坐标系
      //     transposed: true,
      //     innerRadius: 0.9,
      //     radius: 1
      //   });
      //
      //   // draw a cricle 辅助弧线
      //   this.chart.guide().arc({
      //     start: [1, 0],
      //     end: [1, 99.98],
      //     top: false,
      //     style: {
      //       lineWidth: 15,
      //       stroke: '#ccc'
      //     }
      //   });
      //
      //   // 辅助 html
      //   this.chart.guide().html({
      //     position: ['50%', '50%'],
      //     html: '<p id="number" style="font-size: 32px;margin: 0;color: #1890ff;transform: translate(-50%, -40%);"></p>',
      //   });
      //   // 使用矩形或者弧形，用面积来表示大小关系的图形，一般构成柱状图、饼图等图表
      //   this.chart.interval().position('x*y' ).size(15).shape('tick').animate({
      //     appear: {
      //       duration: 1200,
      //       easing: 'cubicIn',
      //       animation: function animation(shape, animateCfg) {
      //         let startAngle = shape.attr('startAngle');
      //         let endAngle = shape.attr('endAngle');
      //         shape.attr('endAngle', startAngle);
      //         shape.animate().to(Util.mix({
      //           attrs: {
      //             endAngle: endAngle,
      //           }
      //         }, animateCfg)).onUpdate(function (frame) {
      //           if (data) {
      //             $('#number').text(Math.floor(frame * data) + '%');
      //           } else {
      //             $('#number').text(0 + '%');
      //           }
      //         });
      //       }
      //     }
      //   });
      //   this.chart.guide().text({
      //     top: true, // 指定 guide 是否绘制在 canvas 最上层，默认为 true, 即绘制在最上层
      //     position: [0, 0], // 文本的起始位置，值为原始数据值，支持 callback
      //     content: '个人业绩占比(%)', // 显示的文本内容
      //     style: {
      //       fill: '#666', // 文本颜色
      //       fontSize: '12', // 文本大小
      //       fontWeight: 'bold', // 文本粗细
      //       rotate: 0 // 旋转角度
      //     }, // 文本的图形样式属性
      //     offsetX: this.screenWidth / 3, // x 方向的偏移量
      //     offsetY: 40, // y 方向偏移量
      //   });
      //   this.chart.render();
      // },
    },
  }
</script>

<style lang="scss">
  #dataStatic {
    font-family: Futura, Arial, sans-serif;
    .titleP {
      padding-bottom: .4rem;
      color: #7D7D7D;
    }
    .modules {
      display: flex;
      display: -webkit-flex;
      /*align-items: center;*/
      background: #FFFFFF;
      padding: .4rem 0;
      span {
        font-weight: bold;
        font-size: .7rem;
      }
    }

    .modules > div {
      width: 50%;
      text-align: center;
    }

    .chart-wrapper {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      overflow: hidden;
    }

    .tableCss {
      padding: 0 .1rem;
      background-color: #FFFFFF;
      table {
        width: 100%;
        height: auto;
        -webkit-border-radius: .08rem;
        -moz-border-radius: .08rem;
        border-radius: .08rem;
        th, td {
          color: #5C5C5C;
          vertical-align: middle;
          padding: .28rem .1rem;
        }
        th:first-child {
          border-radius: 6px 0 0 0;
        }
        th:last-child {
          border-radius: 0 6px 0 0;
        }
        tr:last-child td:first-child {
          border-radius: 0 0 0 6px;
        }
        tr:last-child td:last-child {
          border-radius: 0 0 6px 0;
        }
        thead {
          background-color: #B8B8B8;
          tr {
            height: .72rem;
            line-height: .72rem;
            th {
              color: #FFFFFF;
              font-size: .31rem;
              padding: .16rem .1rem;
            }
          }
        }
        tbody {
          tr:nth-of-type(odd) {
            background: #F5F3F6;
          }
          tr {
            td {
              font-size: .26rem;
            }
          }
        }
      }
    }

    $colorF: #FFFFFF;
    @mixin flex($n) {
      display: flex;
      display: -webkit-flex;

      @if $n == 'centerSpace' {
        align-items: center;
        -webkit-align-items: center;
        justify-content: space-between;
        -webkit-justify-content: space-between;
      }
      @if $n == 'center' {
        align-items: center;
        -webkit-align-items: center;
        justify-content: center;
        -webkit-justify-content: center;
      }
      @if $n == 'itemCenter' {
        align-items: center;
        -webkit-align-items: center;
      }
      @if $n == 'spaceCenter' {
        justify-content: center;
        -webkit-justify-content: center;
      }
      @if $n == 'space' {
        justify-content: space-between;
        -webkit-justify-content: space-between;
      }
    }
    .resetClose {
      @include flex('spaceCenter');
    }
    .mainContent {
      overflow: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      background-color: $colorF;
      .mainList {
        .contract {
          color: #555555;
          div {
            padding-top: .1rem;
          }
        }
        .staffDepart {
          padding: .18rem .3rem .18rem 0;
          @include flex('space');
        }
      }
    }

    .first_date {
      @include flex('center');
    }
    .notData {
      text-align: center;
      padding: .2rem;
      color: #b3afaf;
      font-size: .33rem;
      @include flex('center');
    }
    .bgColor {
      padding: .33rem;
      background-color: #F8F8F8;
    }
  }
</style>
