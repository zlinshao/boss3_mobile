<template>
  <div id="special">
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;">收租标记</div>
          <van-radio-group :disabled="counts === '2' || counts === '21'" v-model="form.collect_or_rent"
                           @change="rentChange">
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
          v-model="form.staff_name"
          label="开单人"
          type="text"
          placeholder="开单人已禁用"
          disabled>
        </van-field>
        <van-field
          v-model="form.department_name"
          label="部门"
          type="text"
          placeholder="部门已禁用"
          disabled>
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer" v-if="counts === '2' || counts === '21'">
      <div @click="saveCollect(0)">修改</div>
    </div>

    <div class="footer" v-if="counts === '1' || counts === '11'">
      <div @click="close_()">重置</div>
      <div @click="saveCollect(1)">草稿</div>
      <div @click="saveCollect(0)">发布</div>
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
        urls: globalConfig.server_new,
        refundSta: false,
        isClear: false,           //删除图片
        picStatus: true,

        form: {
          address: '',
          id: '',
          processable_id: '',
          draft: 0,
          collect_or_rent: '',
          house_id: '',
          contract_id: '',
          content: '',
          screenshot: [],
          screenshot_leader: [],
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        screenshots: {},
        screenshots_leader: {},
        numbers: '',
        counts: '',

        retry: 0,
      }
    },
    mounted() {
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.specialDetail('');
      }
    },
    activated() {
      let count = sessionStorage.count;
      this.counts = count;

      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
      }
      if (count === '1') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.specialDetail('');
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      if (count === '21') {
        let newID = JSON.parse(sessionStorage.process);
        if (newID.type === 2) {
          this.routerTo('/publishDetail', newID.ids);
        } else {
          this.counts = '1';
          this.routerIndex('');
          this.ddRent('');
        }
      }
      if (count === '2') {
        sessionStorage.setItem('process', JSON.stringify(this.$route.query));
        let newID = JSON.parse(sessionStorage.process);
        if (newID.type === 2) {
          this.close_();
          this.routerTo('/publishDetail', newID.ids);
        } else {
          this.counts = '1';
          this.close_();
          this.routerIndex('');
          this.ddRent('');
        }
        this.close_();
        this.specialDetail(newID);
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      this.houseInfo();
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
              this.retry = 0;
              if (res.data.code === '51010' || res.data.code === '51030') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '51020') {
                this.form.id = res.data.data.id;
                Toast.success(res.data.msg);
              } else {
                Toast(res.data.msg);
              }
            }).catch((error) => {
              this.haveInHand = true;
              if (error.response === undefined) {
                this.alertMsg('net');

              } else {
                if (error.response.status === 401) {
                  this.personalGet().then((data) => {
                    if (data && this.retry === 0) {
                      this.retry++;

                      this.saveCollect(this.form.draft);
                    }
                  });
                }
              }
            })
          } else {
            Toast(this.alertMsg('sub'));
          }
        } else {
          Toast(this.alertMsg('pic'));
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.form.address = val.house_name;
          this.form.contract_id = val.id;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
        }
      },

      specialDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/special/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          }
        } else {
          type = 'bulletin/special';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === '51020') {
            this.isClear = false;
            let data = res.data.data;
            let draft = res.data.data.draft_content;

            this.form.id = data.id;
            this.form.address = draft.address;
            this.form.collect_or_rent = draft.collect_or_rent;
            this.numbers = draft.collect_or_rent;
            this.form.house_id = draft.house_id;
            this.form.contract_id = draft.contract_id;
            this.form.content = draft.content;
            this.form.screenshot = draft.screenshot;
            this.screenshots = data.screenshot;
            this.form.screenshot_leader = draft.screenshot_leader;
            this.screenshots_leader = data.screenshot_leader;
            this.form.staff_name = draft.staff_name;
            if (draft.department_name) {
              this.form.department_id = draft.department_id;
              this.form.department_name = draft.department_name;
            } else {
              this.form.department_id = data.department_id;
              this.form.department_name = data.department_name;
            }

            this.form.staff_id = draft.staff_id;

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
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.id = '';
        this.form.processable_id = '';
        this.form.address = '';
        this.form.collect_or_rent = '';
        this.form.house_id = '';
        this.form.contract_id = '';
        this.form.content = '';
        this.form.screenshot = [];
        this.screenshots = {};
        this.form.screenshot_leader = [];
        this.screenshots_leader = {};
        this.form.staff_name = '';
        this.form.department_name = '';
        this.form.staff_id = '';
        this.form.department_id = '';
      }
    },
  }
</script>

<style lang="scss">
  #special {
    overflow: hidden;
  }
</style>
