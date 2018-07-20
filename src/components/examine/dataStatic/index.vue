<template>
  <div id="dataStatic">
    <div class="modules" style="padding: .3rem 0;">
      <div>
        <p class="titleP">姓名</p>
        <p style="color: #000000;">{{personal}}</p>
      </div>
      <div>
        <p class="titleP">业绩统计</p>
        <p><span style="color: #46C460;font-size: .45rem!important;">{{personPerformance}}</span>&nbsp;元</p>
      </div>
      <div>
        <p class="titleP">资料待提交单数</p>
        <p><span style="color: #F2617B;font-size: .45rem!important;">{{personMaterials}}</span>&nbsp;单</p>
      </div>
    </div>
    <div style="background-color: #FFFFFF;margin: .24rem 0;">
      <div class="chart-wrapper">
        <canvas id="mountNode"></canvas>
      </div>
    </div>
    <div class="modules">
      <table style="width: 100%;height: auto;">
        <thead style="background-color: #F5F3F6;">
        <tr style="height: .7rem;line-height: .7rem;">
          <td align=left>地址</td>
          <td style="min-width: 1.2rem;" align=left>总金额</td>
          <td style="min-width: 1.2rem;" align=left>月单价</td>
          <td style="min-width: 1.6rem;" align=left>付款方式</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="key in tableData">
          <td style="color: #000000;" align=left>{{key.address}}</td>
          <td align=left>{{key.money}}</td>
          <td align=left>{{key.month}}</td>
          <td align=left>{{key.payWay}}</td>
        </tr>
        </tbody>
      </table>
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
        screenWidth: document.body.offsetWidth,
        data: [{            //个人业绩占比小组业绩
          x: 1,
          y: 85,
        }],
        personMaterials: '',        //个人资料待审核的数量
        personPerformance: '',      //个人业绩总额
        // personPerformanceRatio: '', //个人业绩占比小组业绩
        personPerformanceList: '',  //个人业绩详情
        tableData: [
          {
            address: '发的还是是范德萨法10-10-10',
            money: '1000000',
            month: '3000',
            payWay: '押1付10',
          },
          {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          },
          {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          },
          {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          },
          {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          },
          {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          }, {
            address: '发的还是卡10-10-10',
            money: '100000',
            month: '3000',
            payWay: '押1付10',
          },
        ]
      }
    },
    mounted() {
      this.drawing();
      this.search();
    },
    activated() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.personal = JSON.parse(sessionStorage.personal).name;
    },
    watch: {},
    methods: {
      search() {
        let url1 = 'personMaterials';
        let url2 = 'personPerformanceList';
        let url3 = 'personPerformance';
        let url4 = 'personPerformanceRatio';
        this.antVIndex(url1);
        this.antVIndex(url2);
        this.antVIndex(url3);
        this.antVIndex(url4);
      },

      antVIndex(url) {
        this.$http.get(this.urls + url, {
          params: {
            start_time: '',
            end_time: '',
          }
        }).then((res) => {
          switch (url) {
            case 'personMaterials':
              console.log('个人资料待审核的数量');
              console.log(res.data);
              this.personMaterials = res.data.data;
              break;
            case 'personPerformanceList':
              console.log('获取个人业绩详情');
              console.log(res.data);
              this.personPerformanceList = res.data.data;
              break;
            case 'personPerformance':
              console.log('个人业绩总额');
              console.log(res.data);
              this.personPerformance = res.data.data;
              break;
            case 'personPerformanceRatio':
              console.log('个人业绩占比小组业绩');
              console.log(res.data);
              this.personPerformanceRatio = res.data.data;
              this.data[0].y = res.data.data;
              break;
          }
        })
      },

      drawing() {
        let Shape = F2.Shape;
        let G = F2.G;
        let Util = F2.Util;
        let Global = F2.Global;
        let Vector2 = G.Vector2;
        Shape.registerShape('interval', 'tick', {
          draw: function draw(cfg, container) {
            let points = this.parsePoints(cfg.points);
            let style = Util.mix({
              stroke: cfg.color
            }, Global.shape.interval, cfg.style);
            if (cfg.isInCircle) {
              let newPoints = points.slice(0);
              if (this._coord.transposed) {
                newPoints = [points[0], points[3], points[2], points[1]];
              }

              let _cfg$center = cfg.center,
                x = _cfg$center.x,
                y = _cfg$center.y;

              let v = [1, 0];
              let v0 = [newPoints[0].x - x, newPoints[0].y - y];
              let v1 = [newPoints[1].x - x, newPoints[1].y - y];
              let v2 = [newPoints[2].x - x, newPoints[2].y - y];

              let startAngle = Vector2.angleTo(v, v1);
              let endAngle = Vector2.angleTo(v, v2);
              let r0 = Vector2.length(v0);
              let r = Vector2.length(v1);

              if (startAngle >= 1.5 * Math.PI) {
                startAngle = startAngle - 2 * Math.PI;
              }

              if (endAngle >= 1.5 * Math.PI) {
                endAngle = endAngle - 2 * Math.PI;
              }

              let lineWidth = r - r0;
              let newRadius = r - lineWidth / 2;

              return container.addShape('Arc', {
                className: 'interval',
                attrs: Util.mix({
                  x: x,
                  y: y,
                  startAngle: startAngle,
                  endAngle: endAngle,
                  r: newRadius,
                  lineWidth: lineWidth,
                  lineCap: 'round'
                }, style)
              });
            }
          }
        });
        this.initialise(Util);
      },

      initialise(Util) {
        let that = this;
        this.chart = new F2.Chart({
          id: 'mountNode',
          width: this.screenWidth,
          pixelRatio: window.devicePixelRatio,
        });
        this.chart.source(this.data, {
          y: {
            max: 100,
            min: 0
          }
        });
        this.chart.axis(false); // hide all axis 坐标
        this.chart.tooltip(false); // hide tooltip 个性化配置

        // set polar coordinate 设置坐标系类型
        this.chart.coord('polar', {  //极坐标系
          transposed: true,
          innerRadius: 0.9,
          radius: 1
        });

        // draw a cricle 辅助弧线
        this.chart.guide().arc({
          start: [1, 0],
          end: [1, 99.98],
          top: false,
          style: {
            lineWidth: 15,
            stroke: '#ccc'
          }
        });

        // 辅助 html
        this.chart.guide().html({
          position: ['49%', '50%'],
          html: '<p id="number" style="font-size: .56rem;margin: 0;color: #1890ff;">0%</p>',
        });
        // 使用矩形或者弧形，用面积来表示大小关系的图形，一般构成柱状图、饼图等图表
        this.chart.interval().position('x*y').size(15).shape('tick').animate({
          appear: {
            duration: 1200,
            easing: 'cubicIn',
            animation: function animation(shape, animateCfg) {
              let startAngle = shape.attr('startAngle');
              let endAngle = shape.attr('endAngle');
              shape.attr('endAngle', startAngle);
              shape.animate().to(Util.mix({
                attrs: {
                  endAngle: endAngle,
                }
              }, animateCfg)).onUpdate(function (frame) {
                $('#number').text(Math.floor(frame * that.personPerformanceRatio) + '%');
              });
            }
          }
        });
        this.chart.guide().text({
          top: true, // 指定 guide 是否绘制在 canvas 最上层，默认为 true, 即绘制在最上层
          position: [0, 0], // 文本的起始位置，值为原始数据值，支持 callback
          content: '业绩占比(%)', // 显示的文本内容
          style: {
            fill: '#666', // 文本颜色
            fontSize: '12', // 文本大小
            fontWeight: 'bold', // 文本粗细
            rotate: 0 // 旋转角度
          }, // 文本的图形样式属性
          offsetX: this.screenWidth / 3, // x 方向的偏移量
          offsetY: 40, // y 方向偏移量
        });
        this.chart.render();
      },
    },
  }
</script>

<style lang="scss">
  #dataStatic {
    .titleP {
      padding-bottom: .24rem;
      color: #5C5C5C;
    }
    .modules {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      background: #FFFFFF;
    }

    .modules > div {
      width: 33.33%;
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
      padding: .1rem .1rem;
    }
  }
</style>
