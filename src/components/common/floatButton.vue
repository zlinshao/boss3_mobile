<template>
  <div class="div" id="div">{{this.uniq_code}}</div>
</template>

<script>
  import {Toast} from 'vant';
  export default {
    name: "floatButton",
    components: {Toast},
    props:{
      type:{
        type:Number,
        default:1
      }
    },
    data(){
      return{
        uniq_code:''
      }
    },
    methods:{
      getCode(){
        return this.uniq_code;
      }
    },
    activated(){
      //获取报备码
      let prefix=(this.type===1?'boss3:payable':'boss3:receivable');
      this.bulletinCode(prefix).then(res=>{
        this.uniq_code = res;
      });
    },
    mounted() {
      let app=this;
      var flag = 0; //标记是拖曳还是点击
      var oDiv = document.getElementById('div');
      var disX,disY,moveX,moveY,L,T,starX,starY,starXEnd,starYEnd;
      oDiv.addEventListener('touchstart',function(e){
        flag = 0;
        e.preventDefault();//阻止触摸时页面的滚动，缩放
        disX = e.touches[0].clientX - this.offsetLeft;
        disY = e.touches[0].clientY - this.offsetTop;
//手指按下时的坐标
        starX = e.touches[0].clientX;
        starY = e.touches[0].clientY;
//console.log(disX);
      });
      oDiv.addEventListener('touchmove',function(e){
        flag = 1;
        L = e.touches[0].clientX - disX ;
        T = e.touches[0].clientY - disY ;
//移动时 当前位置与起始位置之间的差值
        starXEnd = e.touches[0].clientX - starX;
        starYEnd = e.touches[0].clientY - starY;
//console.log(L);
        if(L<0){//限制拖拽的X范围，不能拖出屏幕
          L = 0;
        }else if(L > document.documentElement.clientWidth - this.offsetWidth){
          L=document.documentElement.clientWidth - this.offsetWidth;
        }
        if(T<0){//限制拖拽的Y范围，不能拖出屏幕
          T=0;
        }else if(T>document.documentElement.clientHeight - this.offsetHeight){
          T = document.documentElement.clientHeight - this.offsetHeight;
        }
        moveX = L + 'px';
        moveY = T + 'px';
//console.log(moveX);
        this.style.left = moveX;
        this.style.top = moveY;
      });
      oDiv.addEventListener('touchend',function(e){
//alert(parseInt(moveX))
//判断滑动方向
        if(flag === 0) {//点击
          Toast('tips：提醒租客在转账时备注收款识别码，报备通过更快速~')
        }
      });
    }
  }
</script>

<style scoped>
  .div {
    padding-left: 1em;
    padding-right: 1em;
    height: 2em;
    position: fixed;
    color: white;
    text-align: center;
    line-height: 2em;
    top: 10em;
    background-color: dodgerblue;
    border-radius: 2em;
  }

</style>
