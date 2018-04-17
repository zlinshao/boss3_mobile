<template>
  <div id="special">
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio-group v-model="form.collect_or_rent" @change="rentChange">
            <van-radio name="0">收房</van-radio>
            <van-radio name="1">租房</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          @click="searchSelect(form.collect_or_rent)"
          readonly
          placeholder="选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.content"
          label="报备内容"
          type="textarea"
          placeholder="请填写报备内容"
          required>
        </van-field>
      </van-cell-group>

      <div class="aloneModel">
        <div class="title">截图</div>
        <UpLoad :ID="'jieTu'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots"></UpLoad>
      </div>

      <div class="aloneModel required">
        <div class="title"><span>*</span>特殊情况截图</div>
        <UpLoad :ID="'tongYi'" @getImg="getImgData" :isClear="isClear" :editImage="screenshots_leader"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="staff_name"
          label="开单人"
          type="text"
          placeholder="开单人已被禁用"
          disabled>
        </van-field>
        <van-field
          v-model="department_name"
          label="部门"
          type="text"
          placeholder="部门已被禁用"
          disabled>
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
  import {Toast} from 'vant'

  export default {
    name: "index",
    components: {Toast, UpLoad},
    data() {
      return {
        haveInHand: true,
        urls: globalConfig.server,
        refundSta: false,
        isClear: false,           //删除图片
        picStatus: true,

        form: {
          address: '',
          id: '',
          draft: 0,
          collect_or_rent: '',
          house_id: '',
          contract_id: '',
          content: '',
          screenshot: [],
          screenshot_leader: [],
        },
        screenshots: {},
        screenshots_leader: {},
        staff_name: '',                 //开单人name
        department_name: '',            //部门name
        numbers: '',
      }
    },
    mounted() {
      this.specialDetail();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      searchSelect(val) {
        if (val === '0') {
          this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
        } else if (val === '1') {
          this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
        } else {
          Toast('请选择收租标记');
        }
      },

      //照片
      getImgData(val) {
        this.picStatus = !val[2];
        if (val[0] === 'tongYi') {
          this.form.screenshot_leader = val[1]
        } else {
          this.form.screenshot = val[1]
        }
      },

      rentChange(val) {
        if (this.numbers !== val) {
          this.form.address = '';
          this.form.house_id = '';
          this.form.contract_id = '';
          this.numbers = val;
        }
      },

      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.$http.post(this.urls + 'bulletin/special', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '51010') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '51020') {
                this.form.id = res.data.data.id;
                Toast.success(res.data.msg);
              } else {
                Toast.fail(res.data.msg);
              }
            })
          } else {
            Toast('正在提交...');
          }
        } else {
          Toast('图片上传中...');
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.staff_name = val.staff_name;
          this.department_name = val.department_name;
        }
      },

      specialDetail() {
        this.$http.get(globalConfig.server + 'bulletin/special').then((res) => {
          if (res.data.code === '51010') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.address = data.address;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;
            this.form.house_id = draft.house_id;
            this.form.contract_id = draft.contract_id;
            this.form.content = draft.content;
            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots_leader = data.screenshot_leader;
            this.staff_name = data.staff_name;
            this.department_name = data.department_name;
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
        this.picStatus = true;
        this.form.id = '';
        this.form.address = '';
        this.form.collect_or_rent = '';
        this.form.house_id = '';
        this.form.contract_id = '';
        this.form.content = '';
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.screenshots_leader = {};
        this.staff_name = '';
        this.department_name = '';
      }
    },
  }
</script>

<style lang="scss">
  #special {
    overflow: hidden;
  }
</style>
