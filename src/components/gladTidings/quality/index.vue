<template>
  <div id="quality">
    <div class="main">
      <van-cell-group>
        <van-field
          v-model="houseName"
          label="房屋地址"
          type="text"
          @click="searchSelect()"
          readonly
          placeholder="选择房屋地址"
          required>
        </van-field>

        <van-switch-cell size="20px" v-model="refundSta" title="冰箱"/>
        <van-switch-cell v-model="refundSta" title="电视"/>
        <van-switch-cell v-model="refundSta" title="暖气"/>
        <van-switch-cell v-model="refundSta" title="微波炉"/>
        <van-switch-cell v-model="refundSta" title="天然气"/>
        <van-switch-cell v-model="refundSta" title="洗衣机"/>
        <van-switch-cell v-model="refundSta" title="油烟机"/>
        <van-switch-cell v-model="refundSta" title="燃气灶"/>
        <van-switch-cell v-model="refundSta" title="沙发"/>
        <van-switch-cell v-model="refundSta" title="晾衣架"/>
        <van-switch-cell v-model="refundSta" title="房屋交接是否干净"/>

        <van-switch-cell v-model="refundSta" title="床+床垫"/>
        <van-field
          v-if="!refundSta"
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写床+床垫备注">
        </van-field>
        <van-switch-cell v-model="refundSta" title="衣柜"/>
        <van-field
          v-if="!refundSta"
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写衣柜备注">
        </van-field>
        <van-switch-cell v-model="refundSta" title="窗帘"/>
        <van-field
          v-if="!refundSta"
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写窗帘备注">
        </van-field>
        <van-switch-cell v-model="refundSta" title="家电不齐，房东是否予以配齐"/>
        <van-field
          v-if="!refundSta"
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写家电备注">
        </van-field>

        <div class="unit">
          <van-field
            v-model="staff_name"
            label="餐桌"
            type="number"
            placeholder="请填写餐桌数量">
          </van-field>
          <b>张</b>
        </div>
        <div class="unit">
          <van-field
            v-model="staff_name"
            label="椅子"
            type="number"
            placeholder="请填写椅子数量">
          </van-field>
          <b>把</b>
        </div>
        <van-field
          v-model="staff_name"
          label="其他家具家电"
          type="textarea"
          placeholder="请填写家电"
          disabled>
        </van-field>
        <van-field
          v-model="staff_name"
          label="其他问题"
          type="textarea"
          placeholder="如房子地板起泡；墙面脱皮等等其他问题"
          disabled>
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">房屋影像</div>
        <UpLoad :ID="'headman'" @getImg="myGetImg" :isClear="isClear" :editImage="photos"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="staff_name"
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          readonly>
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          placeholder="请选择部门"
          readonly>
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {UpLoad, Toast},
    data() {
      return {
        urls: globalConfig.server,
        isClear: false,           //删除图片
        picStatus: true,

        refundSta: true,

        form: {
          remark: '',
          id: '',
          draft: 0,
          contract_id: '',              //合同id
          photo: [],                    //房屋影像
          house_id: '',                 //房屋地址id
        },
        houseName: '',
        photos: {},                     //房屋影像
        staff_name: '',                 //开单人name
        department_name: '',            //部门name
      }
    },
    mounted() {
      this.friedDetail();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      payWayClick(val) {
        if (val === 1) {
          this.payStatus = !this.payStatus;
          this.priceStatus = false;
        } else {
          this.priceStatus = !this.priceStatus;
          this.payStatus = false;
        }
      },
      searchSelect() {
        this.$router.push({path: '/collectHouse', query: {type: 'lord', bulletin: 'bulletin_rent_basic'}});
      },

      // 截图
      myGetImg(val) {
        this.picStatus = !val[2];
        this.form.photo = val[1];
      },

      saveCollect(val) {
        if (this.picStatus) {
          this.form.draft = val;
          this.$http.post(this.urls + 'bulletin/lose', this.form).then((res) => {
            if (res.data.code === '50710') {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === '50720') {
              Toast.success(res.data.msg);
            } else {
              Toast(res.data.msg);
            }
          })
        } else {
          Toast('图片上传中...');
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.houseName = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
        }
      },

      friedDetail() {
        this.$http.get(this.urls + 'bulletin/lose').then((res) => {
          if (res.data.code === '50710') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.houseName = data.address;
          } else {
            this.form.id = '';
          }
        })
      },
      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.houseName = '';
        this.staff_name = '';
        this.department_name = '';
      },
    },
  }
</script>

<style lang="scss">
  #quality {
    overflow: hidden;
    @mixin flex {
      display: flex;
      display: -webkit-flex;
    }
    .unit {
      @include flex;
      b {
        padding: 0 .3rem;
        height: 44px;
        line-height: 44px;
        border-bottom: 1px solid #F4F4F4
      }
    }
  }
</style>
