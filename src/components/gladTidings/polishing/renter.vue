<template>
  <div id="rentReport">
    <div class="main" id="main">
      <van-cell-group>
        <van-field
          v-model="form.address"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
          required>
        </van-field>

        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请填写备注"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.staff_name"
          @click="searchSelect(2)"
          readonly
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required>
        </van-field>
        <van-field
          v-model="form.department_name"
          @click="searchSelect(4)"
          readonly
          label="部门"
          type="text"
          placeholder="请选择部门"
          required>
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(1)">草稿</div>
      <div class="" @click="saveCollect(0)">发布</div>
    </div>

    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import {Toast} from 'vant';

  export default {
    name: "renter",
    components: {UpLoad, Toast},
    data() {
      return {
        haveInHand: true,
        personal: JSON.parse(sessionStorage.personal),
        urls: globalConfig.server,
        selectHide: false,        //select选择
        isClear: false,           //删除图片
        picStatus: true,

        tabs: '',

        form: {
          address: '',
          id: '',
          draft: 0,
          contract_id: '',              //合同id
          house_id: '',                 //房屋地址id

          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
      }
    },
    mounted() {
      this.userInfo();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      userInfo() {
        this.form.staff_id = this.personal.id;
        this.form.staff_name = this.personal.name;
        this.form.department_id = this.personal.department_id;
        this.form.department_name = this.personal.department_name;
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            this.$router.push({path: '/collectHouse', query: {type: 'lord'}});
            break;
          case 2:
            this.$router.push({path: '/organize'});
            break;
          case 4:
            this.$router.push({path: '/depart'});
            break;
        }
      },

      // 截图
      getImgData(val) {
        this.picStatus = !val[2];
      },
      // select 显示
      selectShow(val) {
        this.tabs = val;
        this.selectHide = true;
        switch (val) {

        }
      },
      // select选择
      onConfirm(value) {
        switch (this.tabs) {

        }
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
      },

      saveCollect(val) {
        if (this.picStatus) {
          if (this.haveInHand) {
            this.haveInHand = false;
            this.form.draft = val;
            this.$http.post(this.urls + 'bulletin/rent', this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '50210') {
                Toast.success(res.data.msg);
                this.close_();
                $('.imgItem').remove();
                this.routerDetail(res.data.data.data.id);
              } else if (res.data.code === '50220') {
                this.form.id = res.data.data.id;
                Toast.success(res.data.msg)
              } else {
                Toast(res.data.msg);
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
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = JSON.parse(t.staff);
          this.form.staff_id = val.staff_id;
          this.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.department_name = val.depart_name;
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.department_name = val.name;
          this.form.department_id = val.id;
          this.stick();
        }
        if (t.tops === '') {
          this.stick();
        }
      },

      rentDetail() {
        this.$http.get(this.urls + 'bulletin/rent?type=1').then((res) => {
          if (res.data.code === '50210') {
            this.isClear = false;
            let data = res.data.data;

            this.form.id = data.id;
            this.form.contract_id = data.contract_id;
            this.form.house_id = data.house_id;
            this.form.address = data.address;

            this.form.remark = data.remark;
            this.form.staff_id = data.staff_id;
            this.form.staff_name = data.staff_name;
            this.form.department_id = data.department_id;
            this.form.department_name = data.department_name;
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
        this.userInfo();
        $('.imgItem').remove();
        this.picStatus = true;
        this.form.id = '';
        this.form.contract_id = '';
        this.form.house_id = '';

        this.form.address = '';
        this.form.remark = '';
      }
    },
  }
</script>

<style lang="scss">
  #rentReport {
    overflow: hidden;
  }
</style>
