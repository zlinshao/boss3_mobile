<template>
  <div id="content">
    <div class="canvasParent">
      <canvas id="the-canvas" class="canvas"></canvas>
    </div>
    <img v-if="curPage!==1" class="changePage previous" ref="previous" src="./left.png" @click="renderPage(--curPage)">
    <img v-if="curPage!==totalPages" class="changePage next" ref="next" src="./right.png"
         @click="renderPage(++curPage)">
    <pre v-if="totalPages!==-1" class="pages">{{curPage+"/"+totalPages}}</pre>
    <div class="ratioParent">
      <img src="./cut.png" class="changeRatio" @click="reduceRatio">
      <span style="margin-left: .2em;margin-right: .2em"><!--{{(20-curRatio*10)/10+"倍"}}-->  </span>
      <img src="./add.png" class="changeRatio" @click="addRatio">
    </div>
  </div>
</template>

<script>
  import PDFJS from 'pdfjs-dist'

  export default {
    name: "PdfViewer",
    props: {
      url: "",
      firstPage: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        pdfDoc: '',
        totalPages: -1,//总页数
        curPage: 1,//当前页
        curRatio: 1,//当前缩放
        minRatio: 0.2,//最小缩放
        maxRatio: 1.8,//最大缩放
        ratioCount: 0.2//每次缩放多少
      }
    },
    mounted() {
      this.curPage = this.firstPage;
      let app = this;
      PDFJS.getDocument({
        url: app.url
        , cMapUrl: "../../../../static/cmaps/"
        , cMapPacked: true
      }).then(function (pdf) {
        app.pdfDoc = pdf;
        console.log(pdf);
        app.totalPages = pdf._pdfInfo.numPages;
        app.renderPage()
      })
    },
    methods: {
      renderPage() {
        let app = this;
        let num = app.curPage;
        let r = app.curRatio;
        app.pdfDoc.getPage(num).then(function (page) {
          let canvas = document.getElementById('the-canvas');
          let content = document.getElementById('content');

          let viewport = page.getViewport(r);
          let pdfHeight = viewport.height;
          let pdfWidth = viewport.width;
          let contentWidth = content.offsetWidth;
          let contentHeight = content.offsetHeight;

          let widthRatio = contentWidth / pdfWidth;
          let heightRatio = contentHeight / pdfHeight;
          let ratio = Math.min(widthRatio, heightRatio);
          viewport = page.getViewport(ratio);
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          if (canvas.height < contentHeight) {
            canvas.style.top = (contentHeight - canvas.height) / 2 + "px";
          } else {
            canvas.style.top = "0px";
          }
          let renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          };
          page.render(renderContext);
        });
      },
      reduceRatio() {
        if (this.curRatio === this.maxRatio) return;
        this.curRatio = (this.curRatio * 10 + this.ratioCount * 10) / 10;
        this.renderPage();
      },
      addRatio() {
        if (this.curRatio === this.minRatio) return;
        this.curRatio = (this.curRatio * 10 - this.ratioCount * 10) / 10;
        this.renderPage();
      },
    }
  }
</script>

<style scoped>
  .canvasParent {
    width: 100%;
    height: 100%;
    overflow: scroll;
    text-align: center;
  }

  .canvas {
    position: relative;
  }

  .changePage {
    width: 2em;
    height: 2em;
    position: absolute;
    top: 45%;
  }

  .previous {
    left: 1em;
  }

  .next {
    right: 1em;
  }

  .pages {
    position: absolute;
    bottom: 2em;
    width: 100%;
    text-align: center;
  }

  .changeRatio {
    width: 2em;
    height: 2em;
  }

  .ratioParent {
    display: flex;
    align-items: center;
    position: absolute;
    right: 3em;
    bottom: 1.8em;
  }
</style>
