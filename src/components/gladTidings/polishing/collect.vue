<template>
  <div id="rentReport">
    <div class="main" id="main">
      <van-cell-group>
        <van-field
          v-model="form.house.name"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.remark"
          label="丘号"
          type="number"
          placeholder="请填写丘号"
          icon="clear"
          required
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.remark"
          label="房产证号"
          type="number"
          placeholder="请填写房产证号"
          icon="clear"
          required
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          @click="selectShow(1)"
          v-model="form.prove.name"
          label="证件类型"
          type="text"
          readonly
          required
          placeholder="请选择证件类型">
        </van-field>
        <van-field
          v-model="form.remark"
          label="证件号"
          type="number"
          placeholder="请填写证件号"
          icon="clear"
          required
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.remark"
          label="中介费"
          type="number"
          placeholder="请填写中介费"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.remark"
          label="水表底数"
          type="number"
          placeholder="请填写水表底数"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.remark"
          label="电表底数"
          type="number"
          placeholder="请填写电表底数"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.remark"
          label="燃气表底数"
          type="number"
          placeholder="请填写燃气表底数"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.remark"
          label="公摊费用"
          type="number"
          placeholder="请填写公摊费用"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
        <van-field
          v-model="form.remark"
          @click="timeChoose"
          label="资料补齐时间"
          type="number"
          readonly
          placeholder="请选择资料补齐时间"
          icon="clear"
          @click-icon="form.remark = ''">
        </van-field>
      </van-cell-group>

      <div class="aloneModel readonly">
        <div class="title"><span>*</span>证件照片</div>
        <UpLoad :ID="'photo1'" @getImg="getImgData" :isClear="isClear" :editImage="photos1"></UpLoad>
      </div>
      <div class="aloneModel readonly">
        <div class="title"><span>*</span>银行卡照片</div>
        <UpLoad :ID="'photo2'" @getImg="getImgData" :isClear="isClear" :editImage="photos2"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">水表照片</div>
        <UpLoad :ID="'photo3'" @getImg="getImgData" :isClear="isClear" :editImage="photos3"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">电表照片</div>
        <UpLoad :ID="'photo4'" @getImg="getImgData" :isClear="isClear" :editImage="photos4"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">燃气表照片</div>
        <UpLoad :ID="'photo5'" @getImg="getImgData" :isClear="isClear" :editImage="photos5"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">交接单照片</div>
        <UpLoad :ID="'photo6'" @getImg="getImgData" :isClear="isClear" :editImage="photos6"></UpLoad>
      </div>
      <div class="aloneModel readonly">
        <div class="title"><span>*</span>委托书照片</div>
        <UpLoad :ID="'photo7'" @getImg="getImgData" :isClear="isClear" :editImage="photos7"></UpLoad>
      </div>
      <div class="aloneModel readonly">
        <div class="title"><span>*</span>押金收条照片</div>
        <UpLoad :ID="'photo8'" @getImg="getImgData" :isClear="isClear" :editImage="photos8"></UpLoad>
      </div>
      <div class="aloneModel readonly">
        <div class="title"><span>*</span>承诺书照片</div>
        <UpLoad :ID="'photo9'" @getImg="getImgData" :isClear="isClear" :editImage="photos9"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">房产证照片</div>
        <UpLoad :ID="'photo10'" @getImg="getImgData" :isClear="isClear" :editImage="photos10"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">水卡照片</div>
        <UpLoad :ID="'photo11'" @getImg="getImgData" :isClear="isClear" :editImage="photos11"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">电卡照片</div>
        <UpLoad :ID="'photo12'" @getImg="getImgData" :isClear="isClear" :editImage="photos12"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">燃气照片</div>
        <UpLoad :ID="'photo13'" @getImg="getImgData" :isClear="isClear" :editImage="photos13"></UpLoad>
      </div>

      <van-cell-group>
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

    <!--日期-->
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
  import UpLoad from '../../common/UPLOAD.vue'
  import {Toast} from 'vant';

  export default {
    name: "collect",
    components: {UpLoad, Toast},
    data() {
      return {
        haveInHand: true,
        personal: JSON.parse(sessionStorage.personal),
        urls: globalConfig.server,
        selectHide: false,        //select选择
        isClear: false,           //删除图片
        picStatus: true,

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeValue: '',            //日期value

        tabs: '',
        columns: [],

        prove_name: [],
        prove_all: [],

        form: {
          address: '',
          id: '',
          draft: 0,
          contract_id: '',              //合同id
          house: {
            id: '',
            name: '',                   //房屋地址id
          },
          prove: {
            id: '',
            name: '',
          },

          photo1: [],
          photo2: [],
          photo3: [],
          photo4: [],
          photo5: [],
          photo6: [],
          photo7: [],
          photo8: [],
          photo9: [],
          photo10: [],
          photo11: [],
          photo12: [],
          photo13: [],

          remark: '',                   //备注
          staff_id: '',                 //开单人id
          department_id: '',            //部门id
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        photos1: {},
        photos2: {},
        photos3: {},
        photos4: {},
        photos5: {},
        photos6: {},
        photos7: {},
        photos8: {},
        photos9: {},
        photos10: {},
        photos11: {},
        photos12: {},
        photos13: {},
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.userInfo();
      this.dict();
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
      dict() {
        // 证件类型
        this.dictionary(409, 1).then((res) => {
          this.prove_name = [];
          this.prove_all = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.prove_name.push(res.data[i].dictionary_name);
          }
        });
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
        this.timeShow = true;
      },
      // 日期拼接
      monthDate(peaker) {
        this.timeValue = peaker.getValues().join('-');
      },
      // 确认日期
      onDate() {
        this.form.remark = this.timeValue;
        this.timeShow = false;
      },
      // 截图
      getImgData(val) {
        this.picStatus = !val[2];
        switch (val[0]) {
          case 'photo1':
            this.form.photo1 = val[1];
            break;
          case 'photo2':
            this.form.photo2 = val[1];
            break;
          case 'photo3':
            this.form.photo3 = val[1];
            break;
          case 'photo4':
            this.form.photo4 = val[1];
            break;
          case 'photo5':
            this.form.photo5 = val[1];
            break;
          case 'photo6':
            this.form.photo6 = val[1];
            break;
          case 'photo7':
            this.form.photo7 = val[1];
            break;
          case 'photo8':
            this.form.photo8 = val[1];
            break;
          case 'photo9':
            this.form.photo9 = val[1];
            break;
          case 'photo10':
            this.form.photo10 = val[1];
            break;
          case 'photo11':
            this.form.photo11 = val[1];
            break;
          case 'photo12':
            this.form.photo12 = val[1];
            break;
          case 'photo13':
            this.form.photo13 = val[1];
            break;
        }
      },
      // select 显示
      selectShow(val) {
        this.tabs = val;
        this.selectHide = true;
        switch (val) {
          case 1:
            this.columns = this.prove_name;
            break;
        }
      },
      // select选择
      onConfirm(value) {
        switch (this.tabs) {
          case 1:
            this.form.prove.name = value;
            for (let i = 0; i < this.prove_all.length; i++) {
              if (this.prove_all[i].dictionary_name === value) {
                this.form.prove.id = this.prove_all[i].id;
              }
            }
            break;
        }
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeShow = false;
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
          this.form.contract_id = val.id;
          this.form.house.name = val.house_name;
          this.form.house.id = val.house_id;
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
            this.form.house = data.house;

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
        this.form.house.id = '';
        this.form.house.name = '';
        this.form.prove.id = '';
        this.form.prove.name = '';

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
