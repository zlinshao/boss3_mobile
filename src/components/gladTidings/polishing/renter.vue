<template>
  <div id="rentPolishing">
    <div class="main" id="main">
      <van-cell-group>
        <div class="crop_name noBorder">
          <van-field
            v-model="address"
            label="房屋地址"
            type="text"
            readonly
            @click="searchSelect(1)"
            placeholder="请选择房屋地址">
          </van-field>
          <div class="titleRed" v-if="form.corp_name">{{form.corp_name}}</div>
          <div class="showBorder" v-else></div>
        </div>
        <van-field
          v-model="form.contract_number"
          label="合同编号"
          type="text"
          placeholder="请填写合同编号"
          icon="clear"
          @click-icon="form.contract_number = ''"
          required>
        </van-field>
        <van-field
          v-model="form.penalty"
          label="违约金"
          type="text"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.penalty = ''">
        </van-field>
      </van-cell-group>

      <!--<div class="changes" v-for="(key,index) in amountReceipt">-->
      <!--<div class="paddingTitle">-->
      <!--<span>收据编号<span v-if="amountReceipt > 1">({{index + 1}})</span></span>-->
      <!--<span class="colors" v-if="amountReceipt > 1" @click="deleteAmount(index,2)">删除</span>-->
      <!--</div>-->
      <!--<van-cell-group>-->
      <!--<van-field-->
      <!--v-model="form.receipt[index]"-->
      <!--type="text"-->
      <!--label="收据编号"-->
      <!--placeholder="请填写收据编号">-->
      <!--</van-field>-->
      <!--</van-cell-group>-->
      <!--</div>-->
      <!--<div @click="addAmount(2)" class="addInput">-->
      <!--+增加收据编号-->
      <!--</div>-->

      <div class="changes" v-for="(key,index) in amount">
        <div class="paddingTitle">
          <span>客户信息<span v-if="amount > 1">({{index + 1}})</span></span>
          <span class="colors" v-if="amount > 1 && index !== 0" @click="deleteAmount(index,1)">删除</span>
        </div>
        <van-cell-group>
          <van-field
            v-model="form.customers[index].name"
            type="text"
            label="客户姓名"
            placeholder="请填写客户姓名">
          </van-field>
          <van-field
            v-model="form.customers[index].phone"
            type="text"
            label="联系方式"
            placeholder="请填写联系方式">
          </van-field>
          <div class="checks noBorder">
            <div class="titles required">性别</div>
            <van-radio-group v-model="sexs[index]">
              <van-radio name="1">男</van-radio>
              <van-radio name="2">女</van-radio>
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
          type="text"
          class="number"
          placeholder="请填写水表底数"
          icon="clear"
          @click-icon="form.water = ''">
        </van-field>
        <div class="first_date noBorder">
          <div class="titles">电表底数</div>
          <van-field
            v-model="form.electricity_peak"
            type="text"
            class="number"
            placeholder="峰值"
            icon="clear"
            @click-icon="form.electricity_peak = ''">
          </van-field>
          <van-field
            class="twoBorder number"
            v-model="form.electricity_valley"
            type="text"
            placeholder="谷值"
            icon="clear"
            @click-icon="form.electricity_valley = ''">
          </van-field>
        </div>
        <van-field
          v-model="form.gas"
          label="燃气表底数"
          type="text"
          class="number"
          placeholder="请填写燃气表底数"
          icon="clear"
          @click-icon="form.gas = ''">
        </van-field>
        <van-field
          v-model="form.public_fee"
          label="公摊费用"
          type="text"
          class="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.public_fee = ''">
        </van-field>
        <van-field
          v-model="form.manage_fee"
          label="管理费"
          type="text"
          class="number"
          placeholder="请填写金额"
          icon="clear"
          @click-icon="form.manage_fee = ''">
        </van-field>
        <van-field
          v-model="form.data_date"
          @click="timeChoose('data_date', form.data_date)"
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
      <div class="aloneModel">
        <div class="title">押金收条</div>
        <UpLoad :ID="'photo8'" @getImg="getImgData" :isClear="isClear" :editImage="pics.deposit_photo"></UpLoad>
      </div>
      <div class="aloneModel">
        <div class="title">其他照片</div>
        <UpLoad :ID="'photo9'" @getImg="getImgData" :isClear="isClear" :editImage="pics.other_photo"></UpLoad>
      </div>

      <van-cell-group>
        <!--<van-field-->
          <!--v-model="form.remark_terms"-->
          <!--label="备注条款"-->
          <!--type="textarea"-->
          <!--placeholder="请填写备注条款"-->
          <!--icon="clear"-->
          <!--@click-icon="form.remark_terms = ''">-->
        <!--</van-field>-->
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
          disabled
          label="开单人"
          type="text"
          placeholder="开单人已禁用">
        </van-field>
        <van-field
          v-model="form.department_name"
          disabled
          label="部门"
          type="text"
          placeholder="部门已禁用">
        </van-field>
      </van-cell-group>
    </div>

    <div class="footer">
      <div class="" @click="close_()">重置</div>
      <div class="" @click="saveCollect(0)">保存</div>
      <div class="" @click="saveCollect(1)">提交审核</div>
    </div>

    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="selectHide" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>

    <!--日期-->
    <ChooseTime :module="timeModule" :formatData="formatData" @close="onCancel" @onDate="onConTime"></ChooseTime>
  </div>
</template>

<script>
  import UpLoad from '../../common/UPLOAD.vue'
  import ChooseTime from '../../common/chooseTime.vue'
  import {Toast} from 'vant';

  export default {
    name: "collect",
    components: {UpLoad, Toast, ChooseTime},
    data() {
      return {
        haveInHand: true,
        urls: globalConfig.server,
        selectHide: false,        //select选择
        isClear: false,           //删除图片
        picStatus: 'success',

        timeModule: false,          //日期状态
        formatData: {
          dateVal: '',            //格式化日期
          dataKey: '',            //字段区分
          dateType: '',
        },

        amount: 1,
        tabs: '',
        tabIndex: '',
        columns: [],

        retry: 0,

        prove_name: [],
        prove_all: [],

        cardName: [],

        amountReceipt: 1,                  //收据编号
        receiptDate: '',

        address: '',
        corp_name: '',
        contract_id: '',                    //合同id
        sexs: [''],
        form: {
          is_submit: 1,
          penalty: '',                      //违约金
          house_id: '',
          contract_number: '',              //合同编号
          receipt: [],                    //收据编号
          customers: [{
            id: '',                         //客户ID
            name: '',                       //客户姓名
            phone: '',                      //客户电话
            sex: '',                        //性别
            idtype: '',                     //证件类型
            idcard: '',                     //证件号码
          }],
          water: '',                        //水表底数
          electricity_peak: '',             //电表底数
          electricity_valley: '',           //电表底数
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
          identity_photo: {},               //证件照片
          photo: {},                        //合同照片
          water_photo: {},                  //水表照片
          electricity_photo: {},            //电表照片
          gas_photo: {},                    //气表照片
          checkin_photo: {},                //交接单照片
          certificate_photo: {},            //凭证截图
          deposit_photo: {},                //押金收条
          other_photo: {},                  //其他照片
        },
      }
    },
    mounted() {
      this.dicts();
    },
    activated() {
      this.houseInfo();
      this.routerIndex('');
      this.ddRent('');
    },
    methods: {
      userInfo() {
        // let per = JSON.parse(sessionStorage.personal);
        // this.form.staff_id = per.id;
        // this.form.staff_name = per.name;
        // this.form.department_id = per.department_id;
        // this.form.department_name = per.department_name;
        this.form.staff_id = '';
        this.form.staff_name = '';
        this.form.department_id = '';
        this.form.department_name = '';
      },
      dicts() {
        this.receiptNum();
        // 证件类型
        this.dictionary(409, 1).then((res) => {
          this.prove_name = [];
          this.prove_all = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.prove_name.push(res.data[i].dictionary_name);
          }
        });
      },

      receiptNum() {
        // 收据编号默认城市
        this.form.receipt = [];
        this.$http.get(this.urls + 'setting/others/ip_address').then((res) => {
          if (res.data.code === '1000120') {
            // 收据编号默认日期
            if (res.data.data.py) {
              this.receiptDate = res.data.data.data.py + res.data.data.data.year;
              let receipt = res.data.data.data.py + res.data.data.data.year;
              this.form.receipt.push(receipt);
            } else {
              this.receiptDate = 'NJ' + res.data.data.data.year;
              let receipt = 'NJ' + res.data.data.data.year;
              this.form.receipt.push(receipt);
            }
          }
        });
      },

      // 增加附属租客
      addAmount(val) {
        if (val === 1) {
          this.amount++;
          let data = {
            id: '',                       //客户ID
            name: '',                     //客户姓名
            phone: '',                    //客户电话
            sex: '',                      //性别
            idtype: '',                   //证件类型
            idcard: '',                   //证件号码
          };
          this.sexs.push('');
          this.form.customers.push(data);
        } else {
          this.amountReceipt++;
          this.form.receipt.push(this.receiptDate);
        }
      },
      // 删除客户
      deleteAmount(index, val) {
        if (val === 1) {
          if (this.amount > 1) {
            this.amount--;
            this.form.customers.splice(index, 1);
            this.sexs.splice(index, 1);
          }
        } else {
          this.amountReceipt--;
          this.form.receipt.splice(index, 1);
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
      // 显示日期
      timeChoose(val, time) {
        setTimeout(() => {
          this.timeModule = true;
        }, 200);
        this.formatData.dateVal = time;
        this.formatData.dataKey = val;
        this.formatData.dateType = 'date';
      },
      // 确定日期
      onConTime(val) {
        this.form[val.dataKey] = val.dateVal;
        this.onCancel();
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
        this.timeModule = false;
      },
      // select 显示
      selectShow(val, index) {
        this.tabs = val;
        this.tabIndex = index;
        setTimeout(() => {
          this.selectHide = true;
        }, 200);
        switch (val) {
          case 1:
            this.columns = this.prove_name;
            break;
          case 2:
            this.columns = this.cities;
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
          case 2:
            this.form.receipt[this.tabIndex].city = value;
            break;
        }
        this.onCancel();
      },
      // 截图
      getImgData(val) {
        this.picStatus = val[2];
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
      saveCollect(val) {
        if (this.contract_id !== '') {
          if (this.picStatus === 'err') {
            Toast(this.alertMsg('errPic'));
            return;
          } else if (this.picStatus === 'lose') {
            Toast(this.alertMsg('pic'));
            return;
          }
          if (this.haveInHand) {
            this.haveInHand = false;
            let receipt = [];
            for (let i = 0; i < this.form.receipt.length; i++) {
              if (this.form.receipt[i] !== this.receiptDate) {
                receipt.push(this.form.receipt[i]);
              }
            }
            this.amountReceipt = receipt.length === 0 ? 1 : receipt.length;
            this.form.receipt = receipt;
            for (let i = 0; i < this.sexs.length; i++) {
              this.form.customers[i].sex = this.sexs[i];
            }
            this.form.is_submit = val;
            this.$http.put(this.urls + 'bulletin/complete/rent/' + this.contract_id, this.form).then((res) => {
              this.haveInHand = true;
              this.retry = 0;
              if (res.data.code === '51610') {
                if (receipt.length === 0) {
                  this.form.receipt = [];
                  this.form.receipt.push(this.receiptDate);
                }
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

                      this.saveCollect(this.form.is_submit);
                    }
                  });
                }
              }
            })
          } else {
            Toast(this.alertMsg('sub'));
          }
        } else {
          Toast('请选择房屋...');
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.contract_id = val.id;
          this.address = val.house_name;
          this.corp_name = val.corp_name;
          this.form.house_id = val.house_id;
          this.form.staff_name = val.staff_name;
          this.form.department_name = val.department_name;
          this.form.staff_id = val.staff_id;
          this.form.department_id = val.department_id;
          this.rentDetail(val.id);
        }
        // if (t.staff !== undefined && t.staff !== '') {
        //   let val = JSON.parse(t.staff);
        //   this.form.staff_id = val.staff_id;
        //   this.form.staff_name = val.staff_name;
        //   this.form.department_id = val.depart_id;
        //   this.form.department_name = val.depart_name;
        //   this.stick();
        // }
        // if (t.depart !== undefined && t.depart !== '') {
        //   let val = JSON.parse(t.depart);
        //   this.department_name = val.name;
        //   this.form.department_id = val.id;
        //   this.stick();
        // }
        // if (t.tops === '') {
        //   this.stick();
        // }
      },

      rentDetail(id) {
        this.picClose();
        this.$http.get(this.urls + 'bulletin/complete/rent/' + id).then((res) => {
          if (res.data.code === '51610') {
            let data = res.data.data;
            this.form.customers = [];
            for (let key in this.form) {
              for (let item in data) {
                if (key === item) {
                  if (item !== 'album' && item !== 'customers' && item !== 'receipt') {
                    this.form[key] = data[item] !== null ? data[item] : '';
                  }
                  if (item === 'receipt') {
                    if (typeof data[item] !== "string") {
                      if (data[item].length !== 0) {
                        this.amountReceipt = data[item].length;
                        this.form.receipt = [];
                        for (let i = 0; i < data[item].length; i++) {
                          this.form.receipt.push(data[item][i]);
                        }
                      } else {
                        this.amountReceipt = 1;
                        this.form.receipt = [];
                        this.form.receipt[0] = this.receiptDate;
                      }
                    } else {
                      this.amountReceipt = 1;
                      this.form.receipt = [];
                      this.form.receipt[0] = data[item];
                    }
                  }
                  if (item === 'customers') {
                    this.cardName = [];
                    this.sexs = [];
                    this.amount = data.customers.length;
                    for (let i = 0; i < data.customers.length; i++) {
                      let obj = {};
                      let cus = data.customers[i];
                      this.form.customers.push(obj);
                      this.sexs.push('');
                      this.form.customers[i].id = cus.id !== null ? cus.id : '';
                      this.form.customers[i].name = cus.name !== null ? cus.name : '';
                      this.form.customers[i].phone = cus.phone !== null ? cus.phone : '';
                      this.form.customers[i].sex = cus.sex !== null ? String(cus.sex) : '';
                      this.sexs[i] = cus.sex !== null ? String(cus.sex) : '';
                      this.form.customers[i].idtype = cus.idtype !== null ? cus.idtype : '';
                      this.form.customers[i].idcard = cus.idcard !== null ? cus.idcard : '';
                      for (let j = 0; j < this.prove_all.length; j++) {
                        if (this.prove_all[j].id === cus.idtype) {
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
        this.userInfo();
        this.picStatus = 'success';
        this.amount = 1;
        this.cardName = [];
        this.address = '';
        this.contract_id = '';
        this.sexs = [''];
        this.form.house_id = '';

        this.amountReceipt = 1;
        this.form.receipt = [];
        this.form.receipt[0] = this.receiptDate;

        this.form.contract_number = '';
        this.form.penalty = '';
        this.form.customers = [{
          id: '',                         //客户ID
          name: '',                       //客户姓名
          phone: '',                      //客户电话
          sex: '',                        //性别
          idtype: '',                     //证件类型
          idcard: '',                     //证件号码
        }];
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
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        $('.imgItem').remove();
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
