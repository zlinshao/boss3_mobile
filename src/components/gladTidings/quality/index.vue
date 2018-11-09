<template>
  <div id="quality">
    {{hhhhhh}}
    <div class="main" id="main">
      <van-cell-group>
        <div class="checks">
          <div style="min-width: 110px;margin-left: -7px"><span style="color: red;">*</span>报备类型</div>
          <van-radio-group :disabled="counts === '2' || counts === '21'" v-model="form.quality_up"
                           @change="qualityChange">
            <van-radio name="0">新增</van-radio>
            <van-radio name="1">跟进</van-radio>
          </van-radio-group>
        </div>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-if="followUp"
          v-model="house_name"
          label="房屋地址"
          type="text"
          @click="searchSelect(3)"
          readonly
          placeholder="选择房屋地址"
          required>
        </van-field>
        <van-field
          v-model="form.city_name"
          label="城市"
          @click="selectShow(2)"
          type="text"
          :disabled="followUp"
          :readonly="!followUp"
          placeholder="请选择城市"
          required>
        </van-field>
        <van-field
          v-model="community_name"
          label="小区"
          @click="searchSelect(1)"
          type="text"
          :disabled="followUp"
          :readonly="!followUp"
          placeholder="请选择小区地址"
          required>
        </van-field>
        <!--<div class="month">-->
        <!--<van-field-->
        <!--v-model="property_fee"-->
        <!--label="物业费单价"-->
        <!--type="text"-->
        <!--:disabled="followUp"-->
        <!--:placeholder="form.community.property_fee ? form.community.property_fee : '请填写物业费单价'"-->
        <!--required>-->
        <!--</van-field>-->
        <!--</div>-->
        <!--<div class="titleRed">单位：元/平米/月</div>-->
        <!--<van-field-->
        <!--v-model="form.community.property_phone"-->
        <!--label="物业联系方式"-->
        <!--type="text"-->
        <!--:disabled="followUp"-->
        <!--placeholder="请填写物业联系方式"-->
        <!--required>-->
        <!--</van-field>-->
        <div class="fourth">
          <van-field
            label="门牌号"
            required>
          </van-field>
          <van-field
            style="width: 22%"
            v-model="form.door_address[0]"
            type="text"
            :disabled="followUp"
            placeholder="栋">
          </van-field>
          <span class="cut">-</span>
          <van-field
            style="width: 22%"
            v-model="form.door_address[1]"
            type="text"
            :disabled="followUp"
            placeholder="单元">
          </van-field>
          <span class="cut">-</span>
          <van-field
            class="twoBorder"
            v-model="form.door_address[2]"
            type="text"
            :disabled="followUp"
            placeholder="门牌">
          </van-field>
        </div>
        <van-field
          @click="selectShow(1)"
          v-model="house_type_name"
          :readonly="!followUp"
          type="text"
          :disabled="followUp"
          label="户型"
          placeholder="请选择户型"
          required>
        </van-field>

        <van-field
          v-model="form.area"
          label="面积"
          required
          type="text"
          class="number"
          :disabled="followUp"
          placeholder="请填写面积">
        </van-field>
        <van-field
          @click="selectShow(14)"
          v-model="form.decorate.name"
          label="装修"
          :disabled="followUp"
          required
          :readonly="!followUp"
          type="text"
          placeholder="请选择装修">
        </van-field>
        <van-field
          @click="selectShow(15)"
          v-model="form.property_type.name"
          label="房屋类型"
          required
          :disabled="followUp"
          :readonly="!followUp"
          type="text"
          placeholder="请选择房屋类型">
        </van-field>
        <van-field
          @click="selectShow(3)"
          v-model="form.direction.name"
          label="朝向"
          required
          :disabled="followUp"
          :readonly="!followUp"
          type="text"
          placeholder="请选择朝向">
        </van-field>
        <div class="first_date">
          <van-field
            style="width: 110px;"
            class="title"
            label="楼层"
            required>
          </van-field>
          <van-field
            v-model="form.floor"
            type="text"
            class="number"
            :disabled="followUp"
            placeholder="请填写房屋楼层">
          </van-field>
          <van-field
            class="twoBorder number"
            v-model="form.floors"
            type="text"
            :disabled="followUp"
            placeholder="请填写总楼层">
          </van-field>
        </div>
        <van-field
          v-model="form.price"
          label="价格"
          required
          type="text"
          :disabled="followUp"
          placeholder="请填写价格">
        </van-field>

        <!--<div class="titleSwitch">-->
        <!--<div class="cellGroup">-->
        <!--<span class="requiredIcon">*</span>-->
        <!--<van-switch-cell v-model="cusFrom1" title="是否中介"/>-->
        <!--</div>-->
        <!--</div>-->

        <van-field
          v-model="cusFrom"
          @click="selectShow(16)"
          label="是否中介"
          type="text"
          readonly
          :disabled="followUp"
          placeholder="是否中介"
          required>
        </van-field>

        <van-field
          @click="selectShow(4)"
          v-model="air_condition_name"
          label="空调"
          type="text"
          readonly
          placeholder="请选择空调数量">
        </van-field>
        <van-field
          @click="selectShow(5)"
          v-model="fridge_name"
          label="冰箱"
          type="text"
          readonly
          placeholder="请选择冰箱数量">
        </van-field>
        <van-field
          @click="selectShow(6)"
          v-model="television_name"
          label="电视"
          type="text"
          readonly
          placeholder="请选择电视数量">
        </van-field>
        <van-field
          @click="selectShow(7)"
          v-model="gas_stove_name"
          label="燃气灶"
          type="text"
          readonly
          placeholder="请选择燃气灶数量">
        </van-field>
        <van-field
          @click="selectShow(8)"
          v-model="hood_name"
          label="油烟机"
          type="text"
          readonly
          placeholder="请选择油烟机数量">
        </van-field>
        <van-field
          @click="selectShow(9)"
          v-model="microwave_name"
          label="微波炉"
          type="text"
          readonly
          placeholder="请选择微波炉数量">
        </van-field>
        <van-field
          @click="selectShow(10)"
          v-model="wash_machine_name"
          label="洗衣机"
          type="text"
          readonly
          placeholder="请选择洗衣机数量">
        </van-field>
        <van-field
          @click="selectShow(11)"
          v-model="water_heater_name"
          label="热水器"
          type="text"
          readonly
          placeholder="请选择热水器数量">
        </van-field>
        <van-field
          @click="selectShow(12)"
          v-model="sofa_name"
          label="沙发"
          type="text"
          readonly
          placeholder="请填写沙发数量">
        </van-field>
        <van-field
          @click="selectShow(13)"
          v-model="clothe_rack_name"
          label="晾衣架"
          type="text"
          readonly
          placeholder="请填写晾衣架数量">
        </van-field>
        <div class="unit">
          <van-field
            v-model="form.dining_table"
            label="餐桌"
            type="text"
            class="number"
            placeholder="请填写餐桌数量">
          </van-field>
          <b>张</b>
        </div>
        <div class="unit">
          <van-field
            v-model="form.chair"
            label="椅子"
            type="text"
            class="number"
            placeholder="请填写椅子数量">
          </van-field>
          <b>把</b>
        </div>

        <van-switch-cell v-model="heaterOn" title="暖气"/>
        <van-switch-cell v-model="gasOn" title="天然气"/>
        <van-switch-cell v-model="is_cleanOn" title="房屋交接是否干净"/>
        <van-switch-cell v-model="bedOn" title="是否每个房间有床+床垫"/>

        <van-field
          v-if="!bedOn"
          v-model="form.bed_remark"
          label="备注"
          required
          type="textarea"
          placeholder="请填写床+床垫备注">
        </van-field>

        <van-switch-cell v-model="wardrobeOn" title="是否每个房间有衣柜"/>

        <van-field
          v-if="!wardrobeOn"
          v-model="form.wardrobe_remark"
          label="备注"
          required
          type="textarea"
          placeholder="请填写衣柜备注">
        </van-field>

        <van-switch-cell v-model="curtainOn" title="是否每个房间有窗帘"/>

        <van-field
          v-if="!curtainOn"
          v-model="form.curtain_remark"
          label="备注"
          required
          type="textarea"
          placeholder="请填写窗帘备注">
        </van-field>

        <van-switch-cell v-model="is_fillOn" title="家电是否齐全"/>

        <van-switch-cell v-if="!is_fillOn" v-model="is_lordOn" title="房东是否予以配齐"/>
        <van-field
          v-if="!is_fillOn && is_lordOn"
          v-model="form.is_lord_fill_days"
          label="补齐天数"
          required
          type="text"
          placeholder="请填写天数">
        </van-field>

        <van-field
          v-model="form.other_furniture"
          label="其他家具家电"
          type="textarea"
          placeholder="请填写家电">
        </van-field>
        <van-field
          v-model="form.other_remark"
          label="其他问题"
          type="textarea"
          placeholder="如房子地板起泡；墙面脱皮等等其他问题">
        </van-field>
      </van-cell-group>

      <div class="aloneModel required">
        <div class="title"><span>*</span>房屋影像</div>
        <UpLoad :ID="'headman'" @getImg="myGetImg" :isClear="isClear" :editImage="photos"></UpLoad>
        <div class="upload-tips">提示：请上传6张以上房屋照片和1个以上房屋视频哦~</div>
      </div>

      <van-cell-group>
        <van-field
          @click="searchSelect(2)"
          v-model="form.staff_name"
          label="开单人"
          type="text"
          placeholder="请选择开单人"
          required
          :disabled="followUp"
          :readonly="!followUp">
        </van-field>
        <van-field
          @click="searchSelect(4)"
          v-model="form.department_name"
          label="部门"
          type="text"
          placeholder="请选择部门"
          required
          :disabled="followUp"
          :readonly="!followUp">
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
    name: "index",
    components: {UpLoad, Toast},
    data() {
      return {
        haveInHand: true,
        urls: globalConfig.server,
        selectHide: false,
        columns: [],                        //select值
        tabs: '',

        isClear: false,                     //删除图片
        picStatus: 'success',

        allCity: [],                        //城市
        cities: [],                         //城市
        beforeCity: '',                     //当前城市
        beforeCityId: '',                   //当前城市ID
        beforeProvinceId: '',               //当前城市ID
        house_type_name: '1室1厅1卫',
        refundSta: true,

        cusFrom: '',                        //是否中介
        heaterOn: true,                     //暖气
        gasOn: true,                        //天然气
        is_cleanOn: true,                   //房屋交接是否干净
        bedOn: true,                        //床+床垫
        wardrobeOn: true,                   //衣柜
        curtainOn: true,                    //窗帘
        is_fillOn: true,                    //家电是否齐全
        is_lordOn: true,                    //房东是否予以配齐

        air_condition_name: '1台',           //空调
        fridge_name: '1台',                  //冰箱
        television_name: '1台',              //电视
        gas_stove_name: '1个',               //燃气灶
        hood_name: '1个',                    //油烟机
        microwave_name: '1台',               //微波炉
        wash_machine_name: '1台',            //洗衣机
        water_heater_name: '1台',            //热水器
        sofa_name: '1个',                    //沙发
        clothe_rack_name: '1个',             //晾衣架

        decorateAll: [],
        decorate_name: [],

        propertyAll: [],
        property_name: [],

        house_name: '',
        form: {
          id: '',
          processable_id: '',
          house_id: '',
          quality_up: '0',
          is_draft: 0,
          city_id: '',                  //城市
          city_name: '',                //城市
          community: {},                //小区
          door_address: ['', '', ''],
          house_type: [1, 1, 1],
          area: '',                     //面积
          direction: {
            id: '',                     //朝向
            name: '',
          },
          decorate: {
            id: '',                    //装修
            name: '',
          },
          property_type: {
            id: '',                     //房屋类型
            name: '',
          },
          floor: '',                    //楼层
          floors: '',                   //总楼层
          price: '',                    //价格
          is_agency: '',                 //是否中介
          air_condition: 1,             //空调
          fridge: 1,                    //冰箱
          television: 1,                //电视
          gas_stove: 1,                 //燃气灶
          hood: 1,                      //油烟机
          microwave: 1,                 //微波炉
          wash_machine: 1,              //洗衣机
          water_heater: 1,              //热水器
          sofa: 1,                      //沙发
          clothe_rack: 1,               //晾衣架
          heater: 1,                    //暖气
          gas: 1,                       //天然气
          bed: 1,                       //床
          bed_remark: '',               //床备注
          wardrobe: 1,                  //衣柜
          wardrobe_remark: '',          //衣柜备注
          curtain: 1,                   //窗帘
          curtain_remark: '',           //窗帘备注
          is_fill: 1,                   //家电是否齐全
          is_lord_fill: 0,              //房东是否补齐
          is_lord_fill_days: '',        //房东是否补齐天数

          dining_table: '',             //餐桌
          chair: '',                    //椅子
          is_clean: 1,                  //是否干净
          other_remark: '',             //其他问题
          other_furniture: '',          //其他家具
          photo: [],                    //房屋影像
          staff_id: '',
          department_id: '',
          staff_name: '',               //开单人name
          department_name: '',          //部门name
        },
        community_name: '',
        // property_fee: '',
        photos: [],                     //房屋影像

        isValue1: true,
        numbers: '',

        followUp: false,                    //后续报备
        counts: '',

        retry: 0,
        hhhhhh: '',
      }
    },
    mounted() {
      let count = sessionStorage.count;
      if (count === '11') {
        this.routerIndex('');
        this.ddRent('');
        this.close_();
        this.dicts('');
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
        this.dicts('');
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
        this.dicts(newID);
        count = count + '1';
        sessionStorage.setItem('count', count);
      }
      this.houseInfo();
    },

    methods: {
      qualityChange(val) {
        if (this.numbers !== val) {
          this.close_();
          this.numbers = val;
          this.followUp = val === '1';
        }
      },
      userInfo(val1) {
        if (val1 && this.form.quality_up !== '1') {
          let per = JSON.parse(sessionStorage.personal);
          this.form.staff_id = per.id;
          this.form.staff_name = per.name;
          this.form.department_id = per.department_id;
          this.form.department_name = per.department_name;
        }
      },
      dicts(val) {
        // 城市
        this.dictionary(306, 1).then((res) => {
          this.cities = [];
          this.allCity = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.cities.push(res.data[i].dictionary_name);
          }

          this.$http.get(this.urls + 'setting/others/ip_address').then((res) => {
            if (res.data.code === '1000120') {
              this.form.province_id = '';
              this.form.city_id = '';
              let address = res.data.data.data[2] + '市';
              this.form.city_name = address;
              this.beforeCity = address;
              for (let i = 0; i < this.allCity.length; i++) {
                if (this.allCity[i].dictionary_name === address) {
                  if (this.allCity[i].variable.is_province) {
                    this.form.province_id = this.allCity[i].variable.city_id;
                    this.beforeProvinceId = this.allCity[i].variable.city_id;
                  } else {
                    this.form.city_id = this.allCity[i].variable.city_id;
                    this.beforeCityId = this.allCity[i].variable.city_id;
                  }
                }
              }
            }
          });

          // 装修
          this.dictionary(404, 1).then((res) => {
            this.decorate_name = [];
            this.decorateAll = res.data;
            for (let i = 0; i < res.data.length; i++) {
              this.decorate_name.push(res.data[i].dictionary_name);
            }
            // 房屋类型
            this.dictionary(410, 1).then((res) => {
              this.property_name = [];
              this.propertyAll = res.data;
              for (let i = 0; i < res.data.length; i++) {
                this.property_name.push(res.data[i].dictionary_name);
              }
              this.qualityDetail(val);
            });

          });

        }).catch(err => {
          this.hhhhhh = JSON.stringify(err);
        });
      },

      // select关闭
      onCancel() {
        this.selectHide = false;
      },
      searchSelect(val) {
        let types;
        if (this.form.quality_up === '0') {
          types = 'quality';
        } else {
          types = 'allHouse';
        }
        switch (val) {
          case 1:
            if (this.form.city_id !== '') {
              this.$router.push({path: '/citySearch', query: {city: this.form.city_id, type: 1}});
            } else if (this.form.province_id !== '') {
              this.$router.push({path: '/citySearch', query: {city: this.form.province_id, type: 2}});
            } else {
              Toast('请选择城市');
            }
            break;
          case 2:
            this.$router.push({path: '/organize'});
            break;
          case 3:
            this.$router.push({path: '/collectHouse', query: {type: types}});
            break;
          case 4:
            this.$router.push({path: '/depart'});
            break;
        }
      },

      selectShow(val) {
        this.tabs = val;
        setTimeout(() => {
          this.selectHide = true;
        }, 200);
        switch (val) {
          case 1:
            this.columns = [
              {
                values: dicts.value1,
                className: 'column1',
                defaultIndex: 0
              },
              {
                values: dicts.value2,
                className: 'column2',
                defaultIndex: 1
              },
              {
                values: dicts.value3,
                className: 'column3',
                defaultIndex: 1
              }
            ];
            break;
          case 2:
            this.columns = this.cities;
            break;
          case 3:
            this.columns = dicts.value6;
            break;
          case 7:
            this.columns = dicts.value4;
            break;
          case 8:
            this.columns = dicts.value4;
            break;
          case 12:
            this.columns = dicts.value4;
            break;
          case 13:
            this.columns = dicts.value4;
            break;
          case 14:
            this.columns = this.decorate_name;
            break;
          case 15:
            this.columns = this.property_name;
            break;
          case 16:
            this.columns = dicts.value8;
            break;
          default:
            this.columns = dicts.value5;
        }
      },

      onConfirm(value, index) {
        switch (this.tabs) {
          case 1:
            if (value[1] === '无') {
              value[1] = '0厅';
            }
            if (value[2] === '无') {
              value[2] = '0卫';
            }
            this.house_type_name = value.join('');
            index[0] = index[0] + 1;
            this.form.house_type = index;
            break;
          case 2:
            this.form.city_id = '';
            this.form.province_id = '';
            for (let i = 0; i < this.allCity.length; i++) {
              if (this.allCity[i].dictionary_name === value) {
                if (this.allCity[i].variable.is_province) {
                  this.form.province_id = this.allCity[i].variable.city_id;
                } else {
                  this.form.city_id = this.allCity[i].variable.city_id;
                }
              }
            }
            this.form.city_name = value;
            this.form.community = {};
            this.community_name = '';
            break;
          case 3:
            this.form.direction.id = index + 1;
            this.form.direction.name = value;
            break;
          case 4: //空调
            this.air_condition_name = value;
            this.form.air_condition = index;
            break;
          case 5: //冰箱
            this.fridge_name = value;
            this.form.fridge = index;
            break;
          case 6: //电视
            this.television_name = value;
            this.form.television = index;
            break;
          case 7: //燃气灶
            this.gas_stove_name = value;
            this.form.gas_stove = index;
            break;
          case 8: //油烟机
            this.hood_name = value;
            this.form.hood = index;
            break;
          case 9: //微波炉
            this.microwave_name = value;
            this.form.microwave = index;
            break;
          case 10: //洗衣机
            this.wash_machine_name = value;
            this.form.wash_machine = index;
            break;
          case 11: //热水器
            this.water_heater_name = value;
            this.form.water_heater = index;
            break;
          case 12: //沙发
            this.sofa_name = value;
            this.form.sofa = index;
            break;
          case 13: //晾衣架
            this.clothe_rack_name = value;
            this.form.clothe_rack = index;
            break;
          case 14: //装修
            this.form.decorate.name = value;
            for (let i = 0; i < this.decorateAll.length; i++) {
              if (this.decorateAll[i].dictionary_name === value) {
                this.form.decorate.id = this.decorateAll[i].id;
              }
            }
            break;
          case 15: //类型
            this.form.property_type.name = value;
            for (let i = 0; i < this.propertyAll.length; i++) {
              if (this.propertyAll[i].dictionary_name === value) {
                this.form.property_type.id = this.propertyAll[i].id;
              }
            }
            break;
          case 16:
            this.form.is_agency = index;
            this.cusFrom = value;
            break;
        }
        this.selectHide = false;
      },

      payWayClick(val) {
        if (val === 1) {
          this.payStatus = !this.payStatus;
          this.priceStatus = false;
        } else {
          this.priceStatus = !this.priceStatus;
          this.payStatus = false;
        }
      },

      // 截图
      myGetImg(val) {
        this.picStatus = val[2];
        this.form.photo = val[1];
      },

      saveCollect(val) {
        if (this.picStatus === 'err') {
          Toast(this.alertMsg('errPic'));
          return;
        } else if (this.picStatus === 'lose') {
          Toast(this.alertMsg('pic'));
          return;
        }
        if (this.haveInHand) {
          // this.form.community.property_fee = this.property_fee;
          this.haveInHand = false;
          this.form.heater = this.heaterOn ? 1 : 0;                 //暖气
          this.form.gas = this.gasOn ? 1 : 0;                       //天然气
          this.form.is_clean = this.is_cleanOn ? 1 : 0;             //房屋交接是否干净
          this.form.bed = this.bedOn ? 1 : 0;                       //床+床垫
          this.form.wardrobe = this.wardrobeOn ? 1 : 0;             //衣柜
          this.form.curtain = this.curtainOn ? 1 : 0;               //窗帘
          this.form.is_fill = this.is_fillOn ? 1 : 0;               //家电是否齐全
          this.form.is_lord_fill = this.is_lordOn ? 1 : 0;          //房东是否予以配齐
          this.form.is_draft = val;
          this.$http.post(this.urls + 'bulletin/quality', this.form).then((res) => {
            this.haveInHand = true;
            this.retry = 0;
            if (res.data.code === "51410" || res.data.code === "51430") {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.id);
            } else if (res.data.code === "51420") {
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

                    this.saveCollect(this.form.is_draft);
                  }
                });
              }
            }
          })
        } else {
          Toast(this.alertMsg('sub'));
        }
      },

      houseInfo() {
        let t = this.$route.query;
        if (t.house !== undefined && t.house !== '') {
          let val = JSON.parse(t.house);
          this.house_name = val.house_name;
          this.form.house_id = val.house_id;
          this.prefill(val.house_res, 'house');
        }
        if (t.city !== undefined && t.city !== '') {
          let val = JSON.parse(t.city);
          this.form.community = val;
          this.community_name = val.village_name;
        }
        if (t.staff !== undefined && t.staff !== '') {
          let val = JSON.parse(t.staff);
          this.form.staff_id = val.staff_id;
          this.form.staff_name = val.staff_name;
          this.form.department_id = val.depart_id;
          this.form.department_name = val.depart_name;
          this.isValue1 = val.activeRevise;
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.form.department_name = val.name;
          this.form.department_id = val.id;
          this.isValue1 = val.activeRevise;
          this.stick();
        }
        if (t.tops === '') {
          this.stick();
        }
        this.userInfo(this.isValue1);
        console.log(1)
      },

      qualityDetail(val) {
        this.form.processable_id = '';
        let type;
        if (val !== '') {
          type = 'bulletin/quality/' + val.newID;
          if (val.type === 2) {
            this.form.processable_id = val.ids;
          } else {
            this.userInfo(true);
            console.log(2)
          }
        } else {
          this.userInfo(true);
          console.log(3);
          type = 'bulletin/quality';
        }
        this.$http.get(this.urls + type).then((res) => {
          if (res.data.code === "51420") {
            let data = res.data.data;
            this.form.id = res.data.id;
            this.form.house_id = data.house_id;
            if (data.quality_up && data.quality_up !== undefined) {
              this.form.quality_up = String(data.quality_up);
              this.numbers = String(data.quality_up);
              if (String(data.quality_up) === '1') {
                this.followUp = true;
                this.house_name = data.address;
              } else {
                this.followUp = false;
                this.house_name = '';
              }
            } else {
              this.followUp = false;
              data.quality_up = '0';
              this.form.quality_up = '0';
            }
            this.prefill(data, 'draught');
          } else {
            this.form.id = '';
          }
        })
      },

      prefill(data, val) {
        this.isClear = false;
        this.form.city_id = data.city_id;                     //城市
        this.form.province_id = data.province_id;             //城市
        this.form.city_name = data.city_name;                 //城市
        if (data.community) {
          this.form.community = data.community;              //小区id
          // this.property_fee = data.community.property_fee;   //小区id
          this.community_name = data.community.village_name; //小区id
        }
        this.form.door_address = data.door_address;

        this.form.house_type = data.house_type;
        let house = data.house_type;
        let room = dicts.value2[house[1]] === '无' ? '0厅' : dicts.value2[house[1]];
        let hall = dicts.value3[house[2]] === '无' ? '0厅' : dicts.value3[house[2]];
        this.house_type_name = dicts.value1[house[0] - 1] + room + hall;

        this.form.decorate = data.decorate;

        this.form.area = data.area;                                     //面积
        this.form.direction = data.direction;                           //朝向
        this.form.property_type = data.property_type;                   //类型
        this.form.floor = data.floor;                                   //楼层
        this.form.floors = data.floors;                                 //总楼层
        this.form.price = data.price;                                   //价格
        this.form.is_agency = data.is_agency;                           //是否中介
        this.cusFrom = dicts.value8[data.is_agency];                    //是否中介
        this.form.air_condition = data.air_condition;                   //空调
        this.air_condition_name = dicts.value5[data.air_condition];     //空调
        this.form.fridge = data.fridge;                                 //冰箱
        this.fridge_name = dicts.value5[data.fridge];                   //冰箱
        this.form.television = data.television;                         //电视
        this.television_name = dicts.value5[data.television];           //电视
        this.form.gas_stove = data.gas_stove;                           //燃气灶
        this.gas_stove_name = dicts.value4[data.gas_stove];             //燃气灶
        this.form.hood = data.hood;                                     //油烟机
        this.hood_name = dicts.value4[data.hood];                       //油烟机
        this.form.microwave = data.microwave;                           //微波炉
        this.microwave_name = dicts.value5[data.microwave];             //微波炉
        this.form.wash_machine = data.wash_machine;                     //洗衣机
        this.wash_machine_name = dicts.value5[data.wash_machine];       //洗衣机
        this.form.water_heater = data.water_heater;                     //热水器
        this.water_heater_name = dicts.value5[data.water_heater];       //热水器
        this.form.sofa = data.sofa;                                     //沙发
        this.sofa_name = dicts.value4[data.sofa];                       //沙发
        this.form.clothe_rack = data.clothe_rack;                       //晾衣架
        this.clothe_rack_name = dicts.value4[data.clothe_rack];         //晾衣架
        this.form.heater = data.heater;                                 //暖气
        this.heaterOn = data.heater === 1 ? true : false;               //是否暖气
        this.form.gas = data.gas;                                       //天然气
        this.gasOn = data.gas === 1 ? true : false;                     //是否天然气
        this.form.bed = data.bed;                                       //床
        this.bedOn = data.bed === 1 ? true : false;                     //床
        this.form.bed_remark = data.bed_remark;                         //床备注
        this.form.wardrobe = data.wardrobe;                             //衣柜
        this.wardrobeOn = data.wardrobe === 1 ? true : false;           //衣柜
        this.form.wardrobe_remark = data.wardrobe_remark;               //衣柜备注
        this.form.curtain = data.curtain;                               //窗帘
        this.curtainOn = data.curtain === 1 ? true : false;             //窗帘
        this.form.curtain_remark = data.curtain_remark;                 //窗帘备注
        this.form.is_fill = data.is_fill;                               //家电是否齐全
        this.is_fillOn = data.is_fill === 1 ? true : false;             //家电是否齐全
        this.form.is_lord_fill = data.is_lord_fill;                     //房东是否补齐
        this.is_lordOn = data.is_lord_fill === 1 ? true : false;        //房东是否补齐
        this.form.is_lord_fill_days = data.is_lord_fill_days;           //房东是否补齐天数
        this.form.dining_table = data.dining_table;                     //餐桌
        this.form.chair = data.chair;                                   //椅子
        this.form.is_clean = data.is_clean;                             //是否干净
        this.is_cleanOn = data.is_clean === 1 ? true : false;           //是否干净
        this.form.other_remark = data.other_remark;                     //其他问题
        this.form.other_furniture = data.other_furniture;               //其他家具
        this.form.staff_id = data.staff_id;
        this.form.staff_name = data.staff_name;
        this.form.department_id = data.department_id;
        this.form.department_name = data.department_name;
        console.log(val);
        if (val === 'draught' && data.photo) {
          this.photos = data.photo;                                       //房屋影像
          this.form.photo = [];
          console.log(data.photo)
          //房屋影像
          for (let i = 0; i < data.photo.length; i++) {
            this.form.photo.push(data.photo[i].id);                       //房屋影像
          }
        }
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.userInfo(true);
        $('.imgItem').remove();
        this.picStatus = 'success';
        this.form.id = '';
        this.form.processable_id = '';
        this.form.house_id = '';
        this.house_name = '';
        this.form.city_id = this.beforeCityId;            //城市
        this.form.province_id = this.beforeProvinceId;    //城市
        this.form.city_name = this.beforeCity;            //城市
        this.form.community = {};                         //小区id
        // this.property_fee = '';                         //小区id
        this.community_name = '';                         //小区名称
        this.form.door_address = ['', '', ''];

        this.form.house_type = [1, 1, 1];
        this.house_type_name = '1室1厅1卫';

        this.form.area = '';                      //面积
        this.form.direction.name = '';            //朝向
        this.form.direction.id = '';              //朝向
        this.form.property_type.id = '';          //类型
        this.form.property_type.name = '';        //类型
        this.form.decorate.id = '';             //装修
        this.form.decorate.name = '';           //装修
        this.form.floor = '';                    //楼层
        this.form.floors = '';                   //总楼层
        this.form.price = '';                    //价格
        this.form.is_agency = '';                 //是否中介
        this.cusFrom = '';                  //是否中介
        this.form.air_condition = 1;           //空调
        this.form.fridge = 1;                       //冰箱
        this.form.television = 1;              //电视
        this.form.gas_stove = 1;               //燃气灶
        this.form.hood = 1;                       //油烟机
        this.form.microwave = 1;               //微波炉
        this.form.wash_machine = 1;            //洗衣机
        this.form.water_heater = 1;            //热水器
        this.form.sofa = 1;                   //沙发
        this.form.clothe_rack = 1;             //晾衣架
        this.form.heater = 1;                    //暖气
        this.heaterOn = true;               //是否暖气
        this.form.gas = 1;                           //天然气
        this.gasOn = true;                  //是否天然气
        this.form.bed = 1;                  //床
        this.bedOn = true;                    //床
        this.form.bed_remark = '';               //床备注
        this.form.wardrobe = 1;                  //衣柜
        this.wardrobeOn = true;                 //衣柜
        this.form.wardrobe_remark = '';          //衣柜备注
        this.form.curtain = 1;                   //窗帘
        this.curtainOn = true;                    //窗帘
        this.form.curtain_remark = '';           //窗帘备注
        this.form.is_fill = 1;                   //家电是否齐全
        this.is_fillOn = true;                    //家电是否齐全
        this.form.is_lord_fill = 0;               //房东是否补齐
        this.is_lordOn = true;                   //房东是否补齐
        this.form.is_lord_fill_days = '';        //房东是否补齐天数
        this.form.dining_table = '';             //餐桌
        this.form.chair = '';                     //椅子
        this.form.is_clean = 1;                 //是否干净
        this.is_cleanOn = true;                  //是否干净
        this.form.other_remark = '';             //其他问题
        this.form.other_furniture = '';          //其他家具
        this.form.photo = [];                    //房屋影像
        this.photos = [];                    //房屋影像
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
        border-bottom: 1px solid #F4F4F4;
      }
    }

    .titleSwitch {
      background: #FFFFFF;
      border-bottom: 1px solid #F4F4F4;
      .cellGroup {
        @include flex;
        align-items: center;
        justify-content: space-between;
        .van-cell {
          width: 66px;
        }
        .cellA {
          @include flex;
          align-items: center;
          margin-left: -7px;
          .requiredIcon {
            color: #f44;
          }
        }
      }
    }
    .upload-tips {
      color: red;
      font-size: 14px;
      text-indent: 1em;
      margin: .2rem 0 0 0;
    }
  }
</style>
