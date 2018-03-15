<template>
  <div>
    <div style="margin-bottom: 5px">
      <van-nav-bar
        title="特殊事项报备"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
    </div>

    <div>
      <van-cell-group>
        <van-field label="房屋地址" placeholder="请输入房屋地址"></van-field>

        <van-field
          v-model="params.content"
          label="报备内容"
          type="textarea"
          placeholder="请输入报备内容"
          rows="1"
          autosize
        ></van-field>
      </van-cell-group>

      <div class="aloneModel" @click="picType === 'jieTu'">
        <div class="title">截图</div>
        <UpLoad :ID="'jieTu'" @getImg="getImgData"></UpLoad>
      </div>

      <!-- -->
      <div class="aloneModel" @click="picType === 'tongYi'">
        <div class="title">组长同意截图</div>
        <UpLoad :ID="'tongYi'" @getImg="getImgData"></UpLoad>
      </div>
      <van-cell-group>
        <!--<van-field-->
          <!--v-model="message"-->
          <!--label="备注"-->
          <!--type="textarea"-->
          <!--placeholder="请输入备注"-->
          <!--rows="1"-->
          <!--autosize-->
        <!--&gt;</van-field>-->

        <van-field
          label="开单人"
          disabled
          placeholder="输入框已禁用"
        ></van-field>
        <van-field
          label="负责人"
          disabled
          placeholder="输入框已禁用"
        ></van-field>
        <van-field
          label="部门"
          disabled
          placeholder="输入框已禁用"
        ></van-field>
      </van-cell-group>
    </div>

    <div style="position: fixed;bottom: 0;width: 80%;margin-left: 10%;">
      <van-button size="large" type="primary" @click="confirmSubmit">提  交</van-button>
    </div>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  export default {
    name: "index",
    components:{UpLoad},
    data() {
      return {
        params:{
          collect_or_rent:1,
          contract_id:'123',
          content:'',
          screenshot:[],
          screenshot_leader:[],
        },
        picType:''
      }
    },
    mounted() {

    },
    watch: {},
    methods: {
      onClickLeft() {
        this.$router.push('/gladTidings')
      },

      //照片
      getImgData(val){
          console.log(val)
        if(val[0] === 'tongYi'){
            this.params.screenshot_leader = val[1]
        }else {
          this.params.screenshot = val[1]
        }
      },
      confirmSubmit(){
        this.$http.post(globalConfig.server + 'bulletin/special',this.params).then((res) => {
          if(res.data.code === '51010'){
            this.$toast.success(res.data.msg);
          }else {
            this.$toast.fail(res.data.msg);
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped="">

  .aloneModel {
    background: #fff;
    width: 100%;
    margin: 5px 0;
    padding-bottom: 10px;
    .title {
      padding: 10px 15px;
    }
  }

  .canBeMore {
    margin: 5px 0 0 0;
    .title {
      padding: 10px 15px;
      display: flex;
      display: -webkit-flex; /* Safari */
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
