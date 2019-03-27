<template>
  <div id="expand">
    <div class="main">
      <van-cell-group>
        <van-field
          v-model="form.city"
          @click="selectShow(306)"
          label="城市名"
          type="text"
          readonly
          placeholder="请选择城市名称"
          required>
        </van-field>
        <van-field
          v-model="form.district"
          @click="selectShow('district_id')"
          label="区/县名称"
          type="text"
          readonly
          placeholder="请选择区/县名称"
          required>
        </van-field>
        <van-field
          v-model="form.village_name"
          label="小区名称"
          type="text"
          placeholder="请输入小区名称"
          required>
        </van-field>
        <van-field
          v-model="form.village_alias"
          label="小区别名"
          type="text"
          placeholder="请输入小区别名"
          required>
        </van-field>
        <van-field
          v-model="form.address"
          label="街道地址"
          type="text"
          placeholder="请输入街道地址"
          required>
        </van-field>
        <van-field
          v-model="form.built_year"
          label="建筑年限"
          type="text"
          readonly
          @click="selectShow('built_year')"
          placeholder="请选择建筑年限"
          required>
        </van-field>
        <van-field
          v-model="formatData.house_type"
          label="房屋类型"
          type="text"
          readonly
          @click="selectShow('house_type')"
          placeholder="请选择房屋类型"
          required>
        </van-field>
        <van-field
          v-model="form.total_buildings"
          label="总栋数"
          type="number"
          placeholder="请输入总栋数"
          required>
        </van-field>
        <van-field
          v-model="form.total_houses"
          label="房屋总数"
          type="number"
          placeholder="请输入房屋总数"
          required>
        </van-field>
        <van-field
          v-model="form.property_fee"
          label="物业费"
          type="number"
          placeholder="请输入物业费"
          required>
        </van-field>
        <van-field
          v-model="form.property_phone"
          label="物业联系电话"
          type="number"
          placeholder="请输入物业联系电话"
          required>
        </van-field>
        <van-field
          v-model="form.property_com"
          label="物业公司"
          type="text"
          placeholder="请输入物业公司"
          required>
        </van-field>
        <van-field
          v-model="form.content"
          label="详情"
          type="textarea"
          placeholder="请输入详情"
          required>
        </van-field>
        <van-field
          v-model="form.remark"
          label="备注"
          type="textarea"
          placeholder="请输入备注"
          required>
        </van-field>
        <van-field
          v-model="form.peripheral_info"
          label="周边信息"
          type="text"
          placeholder="请输入周边信息"
          required>
        </van-field>
        <van-field
          v-model="form.subway_road"
          label="地铁线路"
          type="text"
          placeholder="请输入地铁线路"
          required>
        </van-field>
        <div class="aloneModel" v-for="item in photo">
          <div class="title">{{item.label}}</div>
          <UpLoad :ID="item.key" @getImg="getImgData" :isClear="isClear" :editImage="photos"></UpLoad>
        </div>

      </van-cell-group>
    </div>
    <div class="footer">
      <div @click="close_()">重置</div>
      <div @click="saveVillage()">提交</div>
    </div>
    <Picker :module="pickerModule" :pickers="pickers" :form="form" :formData="formatData" @close="onCancel"
            @succeed="onConPicker"></Picker>
  </div>
</template>

<script>
  import {Toast} from 'vant'
  import Picker from '../../common/picker.vue'
  import UpLoad from '../../common/UPLOAD.vue'

  export default {
    name: "index",
    components: {Picker, UpLoad},
    data() {
      return {
        url: globalConfig.server,
        pickerModule: false,//下拉框
        formatData: {},
        form: {
          village_name: '',//小区名称
          city: '',//城市名
          city_id: '',//城市id
          district: '',//小区名称
          district_id: '',//区县id
          address: '',//街道地址
          village_alias: '',//小区别名
          built_year: '',//建筑年代
          house_type: '',//房屋类型
          total_buildings: '',//总栋数
          total_houses: '',//房屋总数
          property_fee: '',//物业费
          property_phone: '',//物业联系电话
          property_com: '',//物业公司
          album: {
            village_photo: [],
            home_photo: [],
            files: [],
          },
          content: '',//详情
          remark: '',//备注
          peripheral_info: '',//周边信息
          subway_road: '',//地铁线路
        },
        // 下拉相关
        pickers: {
          id: '',
          ids: [],
          index: '',
          columns: [],//下拉数据
        },
        cities: {},
        areas: {},
        house_type: {},
        selectType: '',

        isClear: false,
        photos: {},
        photo: [
          {
            label: '小区照片',
            key: 'village_photo'
          }, {
            label: '房屋照片',
            key: 'home_photo'
          }, {
            label: '调研报告',
            key: 'files'
          }
        ],
      }
    },
    mounted() {
      this.$http.get(this.url + 'setting/village/city').then(res => {
        this.cities = res.data.data;
      });
      for (let i = 1970; i < 2100; i++) {
        dicties.built_year.push(i);
      }
      this.dictionary(410, 1).then(res => {
        if (res.code === '30010') {
          for (let item of res.data) {
            this.house_type[item.id] = item.dictionary_name;
          }
        }
      })
    },
    activated() {
      this.routerIndex('');
      this.ddRent('');
      let t = this.$route.query;
      if (t.city) {
        let val = JSON.parse(t.city);
        this.form.village_name = val.village_name;
      }
    },
    watch: {},
    computed: {},
    methods: {
      getImgData(val) {
        this.pickers.album[val[0]] = val[1];
      },
      searchSelect() {
        if (!this.form.city_id) {
          Toast('请选择城市');
          return;
        }
        if (!this.form.district_id) {
          Toast('请选择区/县');
          return;
        }
        let data = {
          city: this.form.city_id,
          area: this.form.district_id,
        };
      },
      // 显示下拉
      selectShow(val) {
        this.selectType = val;
        setTimeout(() => {
          this.pickerModule = true;
        }, 200);
        let dict;
        switch (val) {
          case 306:
            dict = this.cities;
            break;
          case 'district_id':
            dict = this.areas;
            break;
          case 'built_year':
            dict = dicties[val];
            break;
          case 'house_type':
            dict = this.house_type;
            break;
        }
        this.pickers.columns = Object.values(dict);
        this.pickers.ids = Object.keys(dict);
        this.pickers.id = val;
      },
      // 下拉选择结果
      onConPicker(value, formatData) {
        this.form = value;
        this.formatData = formatData;
        if (this.selectType === 306) {
          this.form.district = '';
          this.form.district_id = '';
          this.getArea(value.city_id);
        }
        this.onCancel();
      },
      // 关闭模态框
      onCancel() {
        this.pickerModule = false;
      },
      getArea(id) {
        this.areas = [];
        this.$http.get(this.url + 'setting/village/district?city_id=' + id).then(res => {
          for (let item of res.data.data) {
            this.areas[item.area_id] = item.area_name;
          }
        });
      },
      saveVillage() {
        this.prompt('正在提交...', 'send');
        this.$http.post(this.url + 'setting/village/save', this.form).then(res => {
          this.prompt('', 'close');
          if (res.data.code === '9920') {
            this.prompt(res.data.msg, 'succeed');
            this.close_();
            this.$router.push('/index');
          } else {
            this.prompt(res.data.msg);
          }
        }).catch(_ => {
          this.prompt('', 'close');
        })
      },
      close_() {
        this.form = {
          village_name: '',//小区名称
          city: '',//城市名
          city_id: '',//城市id
          district: '',//小区名称
          district_id: '',//区县id
          address: '',//街道地址
          village_alias: '',//小区别名
          built_year: '',//建筑年代
          house_type: '',//房屋类型
          total_buildings: '',//总栋数
          total_houses: '',//房屋总数
          property_fee: '',//物业费
          property_phone: '',//物业联系电话
          property_com: '',//物业公司
          album: {
            village_photo: [],
            home_photo: [],
            files: [],
          },
          content: '',//详情
          remark: '',//备注
          peripheral_info: '',//周边信息
          subway_road: '',//地铁线路
        };
        this.formatData = {};
        this.photos = {};
        this.isClear = true;
        setTimeout(() => {
          this.isClear = false;
        });
        $('.imgItem').remove();
      }
    },
  }
</script>

<style lang="scss" scoped>
  #expand {
    .main {
      padding-bottom: 1rem;
    }
  }
</style>
