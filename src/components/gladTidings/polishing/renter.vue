<template>
  <div id="rentPolishing">
    <div class="main" id="main">
      <van-cell-group>
        <van-field
          v-model="address"
          label="房屋地址"
          type="text"
          readonly
          @click="searchSelect(1)"
          placeholder="请选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.mound_number"
          label="丘号"
          type="number"
          placeholder="请填写丘号"
          icon="clear"
          @click-icon="form.mound_number = ''">
        </van-field>
        <van-field
          v-model="form.property_number"
          label="房产证号"
          type="number"
          placeholder="请填写房产证号"
          icon="clear"
          required
          @click-icon="form.property_number = ''">
        </van-field>
        <van-field
          v-model="form.contract_number"
          label="合同编号"
          type="text"
          placeholder="请填写合同编号"
          icon="clear"
          required
          @click-icon="form.contract_number = ''">
        </van-field>
      </van-cell-group>

      <div class="changes" v-for="(key,index) in amount">
        <div class="paddingTitle">
          <span>客户信息<span v-if="amount > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amount > 1" @click="deleteAmount(index,1)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.customers[index].name"
            type="text"
            :disabled="index === 0"
            label="客户姓名"
            placeholder="请填写客户姓名"
            required>
          </van-field>
          <van-field
            v-model="form.customers[index].phone"
            type="text"
            label="联系方式"
            :disabled="index === 0"
            placeholder="请填写联系方式"
            required>
          </van-field>
          <div class="checks radio">
            <span class="req">*</span>
            <div class="checkTitle">性别</div>
            <van-radio-group v-model="form.customers[index].sex">
              <van-radio name="0">男</van-radio>
              <van-radio name="1">女</van-radio>
            </van-radio-group>
          </div>
          <van-field
            v-model="cardName[index]"
            type="text"
            @click="selectShow(1, index)"
            readonly
            label="证件类型"
            placeholder="请选择证件类型"
            required>
          </van-field>
          <van-field
            v-model="form.customers[index].idcard"
            type="text"
            label="证件号码"
            placeholder="请填写证件号码"
            required>
          </van-field>
        </van-cell-group>
      </div>
      <div @click="addAmount(1)" class="addInput">
        +增加附属租客
      </div>
      <van-cell-group>
        <van-field
          v-model="form.water"
          label="水表底数"
          type="number"
          placeholder="请填写水表底数"
          icon="clear"
          @click-icon="form.water = ''">
        </van-field>
        <div class="first_date">
          <van-field
            style="width: 110px;"
            label="电表底数">
          </van-field>
          <van-field
            v-model="form.electricity_peak"
            type="number"
            placeholder="峰值"
            icon="clear"
            @click-icon="form.electricity_peak = ''">
          </van-field>
          <van-field
            class="twoBorder"
            v-model="form.electricity_valley"
            type="number"
            placeholder="谷值"
            icon="clear"
            @click-icon="form.electricity_valley = ''">
          </van-field>
        </div>
        <van-field
          v-model="form.gas"
          label="燃气表底数"
          type="number"
          placeholder="请填写燃气表底数"
          icon="clear"
          @click-icon="form.gas = ''">
        </van-field>
        <van-field
          v-model="form.public_fee"
          label="公摊费用"
          type="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.public_fee = ''">
        </van-field>
        <van-field
          v-model="form.manage_fee"
          label="管理费"
          type="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.manage_fee = ''">
        </van-field>
        <van-field
          v-model="form.data_date"
          @click="timeChoose"
          label="资料补齐时间"
          type="text"
          readonly
          placeholder="请选择资料补齐时间"
          icon="clear"
          @click-icon="form.data_date = ''">
        </van-field>
      </van-cell-group>

      <div class="aloneModel required">
        <div class="title"><span>*</span>证件照片</div>
        <UpLoad :ID="'photo1'" @getImg="getImgData" :isClear="isClear" :editImage="pics.identity_photo"></UpLoad>
      </div>
      <div class="aloneModel required">
        <div class="title"><span>*</span>合同照片</div>
        <UpLoad :ID="'photo2'" @getImg="getImgData" :isClear="isClear" :editImage="pics.photo"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">水表照片</div>
        <UpLoad :ID="'photo3'" @getImg="getImgData" :isClear="isClear" :editImage="pics.water_photo"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">电表照片</div>
        <UpLoad :ID="'photo4'" @getImg="getImgData" :isClear="isClear" :editImage="pics.electricity_photo"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">燃气表照片</div>
        <UpLoad :ID="'photo5'" @getImg="getImgData" :isClear="isClear" :editImage="pics.gas_photo"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">交接单照片</div>
        <UpLoad :ID="'photo6'" @getImg="getImgData" :isClear="isClear" :editImage="pics.checkin_photo"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">凭证截图</div>
        <UpLoad :ID="'photo7'" @getImg="getImgData" :isClear="isClear" :editImage="pics.certificate_photo"></UpLoad>
      </div>
      <div class="aloneModel required">
        <div class="title"><span>*</span>押金收条</div>
        <UpLoad :ID="'photo8'" @getImg="getImgData" :isClear="isClear" :editImage="pics.deposit_photo"></UpLoad>
      </div>
      <div class="aloneModel required">
        <div class="title"><span>*</span>其他照片</div>
        <UpLoad :ID="'photo9'" @getImg="getImgData" :isClear="isClear" :editImage="pics.other_photo"></UpLoad>
      </div>

      <van-cell-group>
        <van-field
          v-model="form.remark_terms"
          label="备注条款"
          type="textarea"
          placeholder="请填写备注条款"
          icon="clear"
          @click-icon="form.remark_terms = ''">
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
      <div class="" @click="saveCollect(0)">保存</div>
      <div class="" @click="saveCollect(1)">提交</div>
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
        urls: globalConfig.server,
        selectHide: false,        //select选择
        isClear: false,           //删除图片
        picStatus: true,

        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2200, 12, 31),
        currentDate: '',
        timeShow: false,          //日期状态
        timeValue: '',            //日期value
        amount: 1,
        tabs: '',
        tabIndex: '',
        columns: [],

        prove_name: [],
        prove_all: [],

        cardName: [],

        address: '',
        contract_id: '',                  //合同id
        form: {
          is_submit: 1,
          house_id: '',
          contract_number: '',            //合同编号
          customers: [{
            id: '',                         //客户ID
            name: '',                       //客户姓名
            phone: '',                      //客户电话
            sex: '',                        //性别
            idtype: '',                     //证件类型
            idcard: '',                     //证件号码
          }],
          mound_number: '',                 //丘号
          property_number: '',              //房产证号
          water: '',                        //水表底数
          electricity_peak: '',                  //电表底数
          electricity_valley: '',                  //电表底数
          gas: '',                          //燃气表底数
          public_fee: '',                   //公摊费用
          manage_fee: '',                   //管理费
          data_date: '',                    //资料补齐时间
          remark_terms: '',                 //备注条款
          remark: '',                       //备注
          album: {
            identity_photo: [],             //证件照片
            photo: [],                      //合同照片
            water_photo: [],                //水表照片
            electricity_photo: [],          //电表照片
            gas_photo: [],                  //气表照片
            checkin_photo: [],              //交接单照片
            certificate_photo: [],          //凭证截图
            deposit_photo: [],              //押金收条
            other_photo: [],                //其他照片
          },
          staff_id: '',                     //开单人id
          department_id: '',                //部门id
          staff_name: '',                   //开单人name
          department_name: '',              //部门name
        },
        pics: {
          identity_photo: {},                        //证件照片
          photo: {},                        //银行卡照片
          water_photo: {},                        //合同照片
          electricity_photo: {},                        //水表照片
          gas_photo: {},                        //电表照片
          checkin_photo: {},                        //气表照片
          certificate_photo: {},                        //交接单照片
          deposit_photo: {},                        //委托书照片
          other_photo: {},                        //押金照片
        },
      }
    },
    mounted() {
      this.getNowFormatDate();
      this.dict();
      this.userInfo();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      userInfo() {
        let per = JSON.parse(sessionStorage.personal);
        this.form.staff_id = per.id;
        this.form.staff_name = per.name;
        this.form.department_id = per.department_id;
        this.form.department_name = per.department_name;
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
      // 增加附属租客
      addAmount(val) {
        this.amount++;
        let data = {
          id: '',                       //客户ID
          name: '',                     //客户姓名
          phone: '',                    //客户电话
          sex: '',                      //性别
          idtype: '',                   //证件类型
          idcard: '',                   //证件号码
        };
        this.form.customers.push(data);
      },
      // 删除客户
      deleteAmount(index, val) {
        if (this.amount > 1) {
          this.amount--;
          this.splice(this.form.customers, index);
        }
      },

      searchSelect(val) {
        switch (val) {
          case 1:
            this.$router.push({path: '/collectHouse', query: {type: 'renter'}});
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
        this.form.data_date = this.timeValue;
        this.timeShow = false;
      },
      // 截图
      getImgData(val) {
        this.picStatus = !val[2];
        switch (val[0]) {
          case 'photo1'://证件照片
            this.form.album.identity_photo = val[1];
            break;
          case 'photo2'://合同照片
            this.form.album.photo = val[1];
            break;
          case 'photo3'://水表照片
            this.form.album.water_photo = val[1];
            break;
          case 'photo4'://电表照片
            this.form.album.electricity_photo = val[1];
            break;
          case 'photo5'://气表照片
            this.form.album.gas_photo = val[1];
            break;
          case 'photo6'://交接单照片
            this.form.album.checkin_photo = val[1];
            break;
          case 'photo7'://凭证截图
            this.form.album.certificate_photo = val[1];
            break;
          case 'photo8'://押金收条
            this.form.album.deposit_photo = val[1];
            break;
          case 'photo9'://其他照片
            this.form.album.other_photo = val[1];
            break;
        }
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.tabIndex = index;
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
            this.cardName[this.tabIndex] = value;
            for (let i = 0; i < this.prove_all.length; i++) {
              if (this.prove_all[i].dictionary_name === value) {
                this.form.customers[this.tabIndex].idtype = this.prove_all[i].id;
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
            this.is_submit = val;
            this.$http.put(this.urls + 'bulletin/complete/rent/' + this.contract_id, this.form).then((res) => {
              this.haveInHand = true;
              if (res.data.code === '51610') {
                Toast.success(res.data.msg);
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
          this.contract_id = val.id;
          this.address = val.house_name;
          this.form.house_id = val.house_id;
          this.rentDetail(val.id);
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = JSON.parse(t.staff);
          this.form.staff_id = val.staff_id;
          this.form.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.form.department_name = val.depart_name;
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

      rentDetail(id) {
        this.$http.get(this.urls + 'bulletin/complete/rent/' + id).then((res) => {
          if (res.data.code === '51610') {
            let data = res.data.data;
            this.picClose();
            for (let key in this.form) {
              for (let item in data) {
                if (key === item) {
                  if (item !== 'album' && item !== 'customers') {
                    this.form[key] = data[item] !== null ? data[item] : '';
                  }
                  if (item === 'customers') {
                    this.cardName = [];
                    this.amount = data[item].length;
                    for (let i = 0; i < data[item].length; i++) {
                      this.form[key] = data[item] !== null ? data[item] : '';
                      this.form[key][i].sex = String(data[item][i].sex);
                      for (let j = 0; j < this.prove_all.length; j++) {
                        if (this.prove_all[j].id === data[item][i].idtype) {
                          this.cardName[i] = this.prove_all[i].dictionary_name;
                        }
                      }
                    }
                  }
                  if (item === 'album') {
                    for (let pic in data[item]) {
                      for (let pics in this.pics) {
                        if (pics === pic) {
                          this.pics[pics] = data[item][pic];
                          for (let i = 0; i < data[item][pic].length; i++) {
                            this.form[key][pics].push(data[item][pic][i].id);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            Toast(res.data.msg);
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
        this.amount = 1;
        this.cardName = [];
        this.address = '';
        this.contract_id = '';
        this.form.house_id = '';
        this.form.customers = [{
          id: '',                         //客户ID
          name: '',                       //客户姓名
          phone: '',                      //客户电话
          sex: '',                        //性别
          idtype: '',                     //证件类型
          idcard: '',                     //证件号码
        }];
        this.form.mound_number = '';        //丘号
        this.form.property_number = '';     //房产证号
        this.form.water = '';               //水表底数
        this.form.electricity_peak = '';    //电表峰
        this.form.electricity_valley = '';  //电表谷
        this.form.gas = '';                 //燃气表底数
        this.form.public_fee = '';          //公摊费用
        this.form.manage_fee = '';          //管理费
        this.form.data_date = '';           //资料补齐时间
        this.form.remark_terms = '';        //备注条款
        this.form.remark = '';              //备注
        this.picClose();
      },
      picClose() {
        this.form.album.identity_photo = [];                //证件照片
        this.form.album.photo = [];                         //合同照片
        this.form.album.water_photo = [];                   //水表照片
        this.form.album.electricity_photo = [];             //电表照片
        this.form.album.gas_photo = [];                     //气表照片
        this.form.album.checkin_photo = [];                 //交接单照片
        this.form.album.certificate_photo = [];             //凭证截图
        this.form.album.deposit_photo = [];                 //押金照片
        this.form.album.other_photo = [];                   //其他照片

        this.pics.identity_photo = {};                //证件照片
        this.pics.photo = {};                         //合同照片
        this.pics.water_photo = {};                   //水表照片
        this.pics.electricity_photo = {};             //电表照片
        this.pics.gas_photo = {};                     //气表照片
        this.pics.checkin_photo = {};                 //交接单照片
        this.pics.certificate_photo = {};             //凭证截图
        this.pics.deposit_photo = {};                 //押金照片
        this.pics.other_photo = {};                   //其他照片
      },
    },
  }
</script>

<style lang="scss">
  #rentPolishing {
    overflow: hidden;
  }
</style>
