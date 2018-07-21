<template>
  <div id="dataStatic">
    <div class="modules" style="padding: .3rem 0;">
      <div>
        <p class="titleP">姓名</p>
        <p style="color: #000000;">{{personal}}</p>
      </div>
      <div>
        <p class="titleP">业绩统计</p>
        <p><span style="font-weight: bold;color: #46C460;font-size: .45rem!important;">{{personPerformance}}</span>&nbsp;元
        </p>
      </div>
    </div>
    <div class="modules" style="background-color: #FFFFFF;margin: .24rem 0;padding-bottom: .24rem">
      <div class="chart-wrapper">
        <canvas id="mountNode"></canvas>
      </div>
      <div>
        <p class="titleP">资料待提交单数</p>
        <p><span style="font-weight: bold;color: #F2617B;font-size: .6rem!important;">{{personMaterials}}</span>&nbsp;单
        </p>
      </div>
    </div>
    <div class="mainContent">
      <div class="mainList">
        <div class="modules">
          <table style="width: 100%;height: auto;">
            <thead style="background-color: #F5F3F6;">
            <tr style="height: .7rem;line-height: .7rem;">
              <td style="padding-left: .3rem;" align=left>地址</td>
              <td style="min-width: 1.2rem;" align=left>总金额</td>
              <td style="min-width: 1.2rem;" align=left>月单价</td>
              <td style="min-width: 1.6rem;" align=left>付款方式</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="key in personPerformanceList">
              <td style="color: #000000;padding-left: .3rem;" align=left>{{key.name}}</td>
              <td align=left>{{key.performance}}</td>
              <td align=left>{{key.month_price}}</td>
              <td align=left>{{key.pay_way_name}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--<div class="notData" v-if="state === 0">输入搜索内容结束后<br>请点击「回车」或搜索按钮</div>-->
      <!--<div class="notData" v-if="state === 2 && houseList.length < 1">暂无相关信息</div>-->
      <!--<div class="notData bgColor" v-if="isLastPage && !isGetMore">我是有底线的</div>-->
      <!--<div class="notData" v-if="state === 1 && params.page < 2">-->
      <!--<van-loading type="spinner" color="black"/>-->
      <!--</div>-->
    </div>

  </div>
</template>

<script>
  import F2 from '@antv/f2'

  export default {
    name: "index",
    data() {
      return {
        urls: globalConfig.server + 'antv/index/',
        personal: '',
        chart: null,
        params: {},
        paramsList: {},
        isGetMore: true,          //滑动触发加载
        isLastPage: false,        //是否最后一页
        scrollHeight: 0,          //滚动到最底部
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
      this.search(1);
    },
    activated() {
      this.routerIndex('');
      this.ddRent('');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.personal = JSON.parse(sessionStorage.personal).name;
    },
    watch: {},
    methods: {
      // 滚动条
      checkScroll() {
        let mainHeight = $('body').height() - 100;
        let mainContent = $('.mainContent');
        mainContent.scrollTop(0);
        mainContent.css('height', mainHeight + 'px');
        let _this = this;
        mainContent.scroll(function () {
          _this.scroll_bar();
        })
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
      search(page) {
        let url1 = 'personMaterials';
        let url3 = 'personPerformance';
        let url4 = 'personPerformanceRatio';
        this.params.start_time = '';
        this.params.end_time = '';

        this.paramsList.start_time = '';
        this.paramsList.end_time = '';
        this.paramsList.limit = 15;
        this.paramsList.page = page;
        this.antVIndex(url1, this.params);
        this.antVIndex(url3, this.params);
        this.antVIndex(url4, this.params);
        this.antVList(this.paramsList);
      },
      antVList(params) {
        console.log(params);
        this.$http.get(this.urls + 'personPerformanceList', {
          params: params
        }).then((res) => {
          console.log('获取个人业绩详情');
          console.log(res.data);
          if (res.data.code === '20000') {
            this.isLastPage = this.params.page === res.data.page_info.max_page;
            this.personPerformanceList = res.data.data;
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
                this.data[0].y = res.data.data;
                this.drawing(res.data.data);
              } else {
                this.drawing(0);
              }
              break;
          }
        });
      },
      drawing(val) {
        this.chart = new F2.Chart({
          id: 'mountNode',
          width: this.screenWidth / 3,
          height:this.screenWidth / 3,
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
    .titleP {
      padding-bottom: .24rem;
      color: #7D7D7D;
    }
    .modules {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      background: #FFFFFF;
    }

    .modules > div {
      width: 50%;
      text-align: center;
    }

    .chart-wrapper {
      display: flex;
      display: -webkit-flex;
      align-items: center;
    }

    tbody tr:nth-of-type(even) {
      background: #F5F3F6;
    }

    thead td, tbody td {
      color: #5C5C5C;
      vertical-align: middle;
      padding: .2rem .1rem;
    }
    thead td {
      padding: .16rem .1rem;
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
    .mainContent {
      overflow: auto;
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
