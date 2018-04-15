<template>
  <div id="quality">
    <div class="main">
      <van-cell-group>
        <van-field
          v-model="form.city_name"
          label="城市"
          @click="selectShow(2)"
          type="text"
          readonly
          placeholder="请选择城市"
          required>
        </van-field>
        <van-field
          v-model="community_name"
          label="小区"
          @click="searchSelect(1)"
          type="text"
          readonly
          placeholder="请选择小区地址"
          required>
        </van-field>
        <div class="fourth">
          <van-field
            label="门牌号"
            required>
          </van-field>
          <van-field
            style="width: 22%"
            v-model="form.door_address[0]"
            type="text"
            placeholder="栋">
          </van-field>
          <span class="cut">-</span>
          <van-field
            style="width: 22%"
            v-model="form.door_address[1]"
            type="text"
            placeholder="单元">
          </van-field>
          <span class="cut">-</span>
          <van-field
            class="twoBorder"
            v-model="form.door_address[2]"
            type="text"
            placeholder="门牌">
          </van-field>
        </div>
        <van-field
          @click="selectShow(1)"
          v-model="house_type_name"
          readonly
          type="text"
          label="户型"
          placeholder="请选择户型"
          required>
        </van-field>
        <van-field
          v-model="form.area"
          label="面积"
          required
          type="number"
          placeholder="请填写面积">
        </van-field>
        <van-field
          @click="selectShow(3)"
          v-model="form.direction.name"
          label="朝向"
          required
          type="text"
          placeholder="请选择朝向"
          readonly>
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
            type="number"
            placeholder="请填写房屋楼层">
          </van-field>
          <van-field
            class="twoBorder"
            v-model="form.floors"
            type="number"
            placeholder="请填写总楼层">
          </van-field>
        </div>
        <van-field
          v-model="form.house_age"
          label="年限"
          required
          type="number"
          placeholder="请填写年限">
        </van-field>
        <van-field
          v-model="form.vacancy"
          label="空置期"
          required
          type="number"
          placeholder="请填写空置期">
        </van-field>
        <van-field
          v-model="form.price"
          label="价格"
          required
          type="number"
          placeholder="请填写价格">
        </van-field>

        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="is_agencyOn" title="是否中介"/>
          </div>
        </div>

        <van-field
          @click="selectShow(4)"
          v-model="form.air_condition"
          label="空调"
          required
          type="text"
          readonly
          placeholder="请选择空调数量">
        </van-field>
        <van-field
          @click="selectShow(5)"
          v-model="form.fridge"
          label="冰箱"
          required
          type="text"
          readonly
          placeholder="请选择冰箱数量">
        </van-field>
        <van-field
          @click="selectShow(6)"
          v-model="form.television"
          label="电视"
          required
          type="text"
          readonly
          placeholder="请选择电视数量">
        </van-field>
        <van-field
          @click="selectShow(7)"
          v-model="form.gas_stove"
          label="燃气灶"
          required
          type="text"
          readonly
          placeholder="请选择燃气灶数量">
        </van-field>
        <van-field
          @click="selectShow(8)"
          v-model="form.hood"
          label="油烟机"
          required
          type="text"
          readonly
          placeholder="请选择油烟机数量">
        </van-field>
        <van-field
          @click="selectShow(9)"
          v-model="form.microwave"
          label="微波炉"
          required
          type="text"
          readonly
          placeholder="请选择微波炉数量">
        </van-field>
        <van-field
          @click="selectShow(10)"
          v-model="form.wash_machine"
          label="洗衣机"
          required
          type="text"
          readonly
          placeholder="请选择洗衣机数量">
        </van-field>
        <van-field
          @click="selectShow(11)"
          v-model="form.water_heater"
          label="热水器"
          required
          type="text"
          readonly
          placeholder="请选择热水器数量">
        </van-field>
        <van-field
          @click="selectShow(12)"
          v-model="form.sofa"
          label="沙发"
          required
          type="text"
          readonly
          placeholder="请填写沙发数量">
        </van-field>
        <van-field
          @click="selectShow(13)"
          v-model="form.clothe_rack"
          label="晾衣架"
          required
          type="text"
          readonly
          placeholder="请填写晾衣架数量">
        </van-field>
        <div class="unit">
          <van-field
            v-model="form.dining_table"
            label="餐桌"
            required
            type="number"
            placeholder="请填写餐桌数量">
          </van-field>
          <b>张</b>
        </div>
        <div class="unit">
          <van-field
            v-model="form.chair"
            label="椅子"
            required
            type="number"
            placeholder="请填写椅子数量">
          </van-field>
          <b>把</b>
        </div>

        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="heaterOn" title="暖气"/>
          </div>
        </div>
        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="gasOn" title="天然气"/>
          </div>
        </div>
        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="is_cleanOn" title="房屋交接是否干净"/>
          </div>
        </div>
        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="bedOn" title="是否每个房间有床+床垫"/>
          </div>
        </div>

        <van-field
          v-if="!bedOn"
          v-model="form.bed_remark"
          label="备注"
          required
          type="textarea"
          placeholder="请填写床+床垫备注">
        </van-field>

        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="wardrobeOn" title="是否每个房间有衣柜"/>
          </div>
        </div>

        <van-field
          v-if="!wardrobeOn"
          v-model="form.wardrobe_remark"
          label="备注"
          required
          type="textarea"
          placeholder="请填写衣柜备注">
        </van-field>

        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="curtainOn" title="是否每个房间有窗帘"/>
          </div>
        </div>

        <van-field
          v-if="!curtainOn"
          v-model="form.curtain_remark"
          label="备注"
          required
          type="textarea"
          placeholder="请填写窗帘备注">
        </van-field>

        <div class="titleSwitch">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="is_fillOn" title="家电是否齐全"/>
          </div>
        </div>

        <div class="titleSwitch" v-if="!is_fillOn">
          <div class="cellGroup">
            <span class="requiredIcon">*</span>
            <van-switch-cell v-model="is_lordOn" title="房东是否予以配齐"/>
          </div>
        </div>
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
      </div>

      <van-cell-group>
        <van-field
          @click="searchSelect(2)"
          v-model="form.staff_name"
          label="开单人"
          required
          type="text"
          placeholder="请选择开单人"
          required
          readonly>
        </van-field>
        <van-field
          @click="searchSelect(4)"
          v-model="form.department_name"
          label="部门"
          required
          type="text"
          placeholder="请选择部门"
          required
          readonly>
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
    name: "index",
    components: {UpLoad, Toast},
    data() {
      return {
        urls: globalConfig.server,
        selectHide: false,
        columns: [],                //select值
        tabs: '',

        isClear: false,             //删除图片
        picStatus: true,

        allCity: [],                //城市
        cities: [],                 //城市
        house_type_name: '1室1厅1卫',
        refundSta: true,
        direction_name: '',

        is_agencyOn: false,         //是否中介
        heaterOn: true,             //暖气
        gasOn: true,                //天然气
        is_cleanOn: true,           //房屋交接是否干净
        bedOn: true,                //床+床垫
        wardrobeOn: true,           //衣柜
        curtainOn: true,            //窗帘
        is_fillOn: true,            //家电是否齐全
        is_lordOn: false,            //房东是否予以配齐

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

        form: {
          id: '',
          is_draft: 0,
          city_id: '',                  //城市
          city_name: '',                //城市
          community: {},                //小区id
          door_address: ['', '', ''],
          house_type: [0, 1, 1],
          area: '',                     //面积
          direction: {
            id: '',
            name: '',
          },                //朝向
          floor: '',                    //楼层
          floors: '',                   //总楼层
          house_age: '',                //年限
          vacancy: '',                  //空置期
          price: '',                    //价格
          is_agency: 0,                 //是否中介
          air_condition: 1,           //空调
          fridge: 1,                  //冰箱
          television: 1,              //电视
          gas_stove: 1,               //燃气灶
          hood: 1,                    //油烟机
          microwave: 1,               //微波炉
          wash_machine: 1,            //洗衣机
          water_heater: 1,            //热水器
          sofa: 1,                    //沙发
          clothe_rack: 1,             //晾衣架
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
          staff_name: '',                 //开单人name
          department_name: '',            //部门name
        },
        city_name: '',
        community_name: '',
        photos: {},                       //房屋影像
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
      dicts() {
        //城市
        this.dictionary(306, 1).then((res) => {
          this.cities = [];
          this.allCity = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.cities.push(res.data[i].dictionary_name);
          }
          this.qualityDetail();
        });
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
      },
      searchSelect(val) {
        switch (val) {
          case 1:
            if (this.form.city_id !== '') {
              this.$router.push({path: '/citySearch', query: {city: this.form.city_id}});
            } else {
              Toast('请选择城市');
            }
            break;
          case 2:
            this.$router.push({path: '/organize'});
            break;
          case 4:
            this.$router.push({path: '/depart'});
            break;
        }
      },
      selectShow(val) {
        this.tabs = val;
        this.selectHide = true;
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
            this.form.house_type = index;
            break;
          case 2:
            for (let i = 0; i < this.allCity.length; i++) {
              if (this.allCity[i].dictionary_name === value) {
                this.form.city_id = this.allCity[i].variable.city_id;
              }
            }
            this.form.city_name = value;
            this.form.community = '';
            this.community_name = '';
            break;
          case 3:
            this.form.direction.id = index + 1;
            this.form.direction.name = value;
            break;
          case 4: //空调
            this.form.air_condition = value;
            break;
          case 5: //冰箱
            this.form.fridge = value;
            break;
          case 6: //电视
            this.form.television = value;
            break;
          case 7: //燃气灶
            this.form.gas_stove = value;
            break;
          case 8: //油烟机
            this.form.hood = value;
            break;
          case 9: //微波炉
            this.form.microwave = value;
            break;
          case 10: //洗衣机
            this.form.wash_machine = value;
            break;
          case 11: //热水器
            this.form.water_heater = value;
            break;
          case 12: //沙发
            this.form.sofa = value;
            break;
          case 13: //晾衣架
            this.form.clothe_rack = value;
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
        this.picStatus = !val[2];
        this.form.photo = val[1];
      },

      saveCollect(val) {
        if (this.picStatus) {
          this.form.is_agency = this.is_agencyOn ? 1 : 0;
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
            if (res.data.code === "51410") {
              Toast.success(res.data.msg);
              this.close_();
              $('.imgItem').remove();
              this.routerDetail(res.data.data.data.id);
            } else if (res.data.code === "51420") {
              this.form.id = res.data.data.id;
              Toast.success(res.data.msg);
            } else {
              Toast(res.data.msg);
            }
          })
        } else {
          Toast('图片上传中...');
        }
      },

      qualityDetail() {
        this.$http.get(this.urls + 'bulletin/quality').then((res) => {
          if (res.data.code === "51420") {
            this.isClear = false;
            let data = res.data.data;
            this.form.id = res.data.id;
            this.form.city_id = data.city_id;                   //城市
            this.form.city_name = data.city_name;                //城市
            this.form.community = data.community;                //小区id
            this.community_name = data.community.village_name;    //小区id
            this.form.door_address = data.door_address;

            this.house_type = data.house_type;
            let house = data.house_type;
            let room = dicts.value2[house[1]] === '无' ? '0厅' : dicts.value2[house[1]];
            let hall = dicts.value3[house[2]] === '无' ? '0厅' : dicts.value3[house[2]];
            this.house_type_name = dicts.value1[house[0]] + room + hall;

            this.form.area = data.area;                             //面积
            this.form.direction = data.direction;                   //朝向
            this.form.floor = data.floor;                    //楼层
            this.form.floors = data.floors;                   //总楼层
            this.form.house_age = data.house_age;                //年限
            this.form.vacancy = data.vacancy;                 //空置期
            this.form.price = data.price;                    //价格
            this.form.is_agency = data.is_agency;                 //是否中介
            this.is_agencyOn = data.is_agency === 1 ? true : false;    //是否中介
            this.form.air_condition = data.air_condition;           //空调
            this.form.fridge = data.fridge;                       //冰箱
            this.form.television = data.television;              //电视
            this.form.gas_stove = data.gas_stove;               //燃气灶
            this.form.hood = data.hood;                       //油烟机
            this.form.microwave = data.microwave;               //微波炉
            this.form.wash_machine = data.wash_machine;            //洗衣机
            this.form.water_heater = data.water_heater;            //热水器
            this.form.sofa = data.sofa;                       //沙发
            this.form.clothe_rack = data.clothe_rack;             //晾衣架
            this.form.heater = data.heater;                    //暖气
            this.heaterOn = data.heater === 1 ? true : false;    //是否暖气
            this.form.gas = data.gas;                           //天然气
            this.gasOn = data.gas === 1 ? true : false;       //是否天然气
            this.form.bed = data.bed;                            //床
            this.bedOn = data.bed === 1 ? true : false;       //床
            this.form.bed_remark = data.bed_remark;               //床备注
            this.form.wardrobe = data.wardrobe;                  //衣柜
            this.wardrobeOn = data.wardrobe === 1 ? true : false;       //衣柜
            this.form.wardrobe_remark = data.wardrobe_remark;          //衣柜备注
            this.form.curtain = data.curtain;                   //窗帘
            this.curtainOn = data.curtain === 1 ? true : false;       //窗帘
            this.form.curtain_remark = data.curtain_remark;           //窗帘备注
            this.form.is_fill = data.is_fill;                   //家电是否齐全
            this.is_fillOn = data.is_fill === 1 ? true : false;       //家电是否齐全
            this.form.is_lord_fill = data.is_lord_fill;               //房东是否补齐
            this.is_lordOn = data.is_lord_fill === 1 ? true : false;  //房东是否补齐
            this.form.is_lord_fill_days = data.is_lord_fill_days;        //房东是否补齐天数
            this.form.dining_table = data.dining_table;             //餐桌
            this.form.chair = data.chair;                       //椅子
            this.form.is_clean = data.is_clean;                //是否干净
            this.is_cleanOn = data.is_clean === 1 ? true : false;       //是否干净
            this.form.other_remark = data.other_remark;             //其他问题
            this.form.other_furniture = data.other_furniture;          //其他家具
            this.photos = data.photo;                         //房屋影像
            this.form.photo = [];                             //房屋影像
            for (let key in data.photo) {
              this.form.photo.push(key);                           //房屋影像
            }

            this.form.staff_id = data.staff_id;
            this.form.staff_name = data.staff_name;
            this.form.department_id = data.department_id;
            this.form.department_name = data.department_name;
          } else {
            this.form.id = '';
          }
        })
      },

      houseInfo() {
        let t = this.$route.query;
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
          this.stick();
        }
        if (t.depart !== undefined && t.depart !== '') {
          let val = JSON.parse(t.depart);
          this.form.department_name = val.name;
          this.form.department_id = val.id;
          this.stick();
        }
        if (t.tops === '') {
          this.stick();
        }
      },

      close_() {
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        this.picStatus = true;
        this.form.id = '';
        this.form.city_id = '';                   //城市
        this.form.city_name = '';                 //城市
        this.form.community = {};                 //小区id
        this.community_name = '';                 //小区名称
        this.form.door_address = ['', '', ''];

        this.house_type = [0, 1, 1];
        this.house_type_name = '1室1厅1卫';

        this.form.area = '';                      //面积
        this.form.direction = '';                  //朝向
        this.direction_name = '';                 //朝向
        this.form.floor = '';                    //楼层
        this.form.floors = '';                   //总楼层
        this.form.house_age = '';                //年限
        this.form.vacancy = '';                 //空置期
        this.form.price = '';                    //价格
        this.form.is_agency = 0;                 //是否中介
        this.is_agencyOn = false;               //是否中介
        this.form.air_condition = 1;           //空调
        this.form.fridge = 1;                       //冰箱
        this.form.television = 1;              //电视
        this.form.gas_stove = 1;               //燃气灶
        this.form.hood = 1;                       //油烟机
        this.form.microwave = 1;               //微波炉
        this.form.wash_machine = 1;            //洗衣机
        this.form.water_heater = 1;            //热水器
        this.form.sofa = '';            //沙发
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
        this.is_lordOn = false;                   //房东是否补齐
        this.form.is_lord_fill_days = '';        //房东是否补齐天数
        this.form.dining_table = '';             //餐桌
        this.form.chair = '';                     //椅子
        this.form.is_clean = true;               //是否干净
        this.is_cleanOn = 1;                      //是否干净
        this.form.other_remark = '';             //其他问题
        this.form.other_furniture = '';          //其他家具
        this.form.photo = [];                    //房屋影像
        this.photos = {};                    //房屋影像
        this.form.staff_id = '';
        this.form.staff_name = '';
        this.form.department_id = '';
        this.form.department_name = '';
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
        margin-left: -7px;
        align-items: center;
        .requiredIcon {
          color: #f44;
        }
      }
    }
  }
</style>
