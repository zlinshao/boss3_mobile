<template>
  <div id="quality">
    <div class="main" id="main">
      <van-cell-group>
        <van-field
          v-model="province_name"
          label="省份"
          type="text"
          readonly
          @click="selectShow('province')"
          placeholder="请选择省份"
          required>
        </van-field>
        <van-field
          v-model="city_name"
          label="市"
          type="text"
          readonly
          @click="selectShow('city')"
          placeholder="请选择城市"
          required>
        </van-field>
        <van-field
          v-model="area_name"
          label="区/县"
          type="text"
          readonly
          @click="selectShow('area')"
          placeholder="请选择区/县"
          required>
        </van-field>
        <van-field
          v-model="region_name"
          label="区域"
          type="text"
          readonly
          @click="selectShow('region')"
          placeholder="请选择区域"
          required>
        </van-field>
        <van-field
          v-model="params.address"
          label="小区地址"
          type="text"
          readonly
          @click="selectShow('address')"
          placeholder="请选择小区地址"
          required>
        </van-field>
        <van-field
          v-model="params.village_name"
          label="小区名字"
          type="text"
          readonly
          placeholder="请输入小区名称"
          required>
        </van-field>
        <van-field
          v-model="params.built_year"
          label="建筑年份"
          type="text"
          readonly
          @click="selectShow('year')"
          placeholder="请选择建筑年份"
          required>
        </van-field>
        <van-field
          v-model="house_type"
          label="房屋类型"
          type="text"
          readonly
          @click="selectShow('houseType')"
          placeholder="请选择房屋类型"
          required>
        </van-field>
      </van-cell-group>

    </div>

    <div class="footer">
      <div class="" @click="clearData">重置</div>
      <div class="" @click="confirmAdd">发布</div>
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
  import {Toast} from 'vant';

  export default {
    name: "index",
    components: {Toast},
    data(){
      return{
        params:{
          province : '',
          city : '',
          area : '',
          region : '',
          address : '',
          village_name : '',
          built_year : '',
          house_type : '',
        },
        house_type:'',
        province_name : '',
        city_name : '',
        area_name : '',
        region_name : '',

        selectHide :false,
        columns:[],
        selectType : '',

        houseTypeDict : [],
        provinceList: [],
        cityList: [],
        areaList: [],
        regionList: [],

      }
    },
    mounted(){
      this.getDictionary();
    },
    activated(){
      this.getVillage(this.$route.query.village)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.routerIndex('/villageCenter', 'house');
        vm.ddRent('/villageCenter', 'house');
      })
    },
    methods:{
      //获取字典
      getDictionary(){
        this.dictionary(10).then((res) => {
          this.houseTypeDict = res.data;
        });
        this.$http.get(globalConfig.server + 'setting/others/province').then((res) => {
          this.provinceList = res.data.data;
        });
      },
      getCityList(id){
        this.$http.get(globalConfig.server + 'setting/others/city?city_parent=' + id).then((res) => {
          if (res.data.code === '100050') {
            this.cityList = res.data.data;
          }
        })
      },
      getAreaList(id){
        this.$http.get(globalConfig.server + 'setting/others/area?area_parent=' + id).then((res) => {
          if (res.data.code === '100060') {
            this.areaList = res.data.data;
          }
        })
      },
      getRegionList(id){
        this.$http.get(globalConfig.server + 'setting/others/region?region_parent=' + id).then((res) => {
          if (res.data.code === '100070') {
            this.regionList = res.data.data;
          }
        })
      },
      selectShow(val){
        this.selectType = val;
        this.selectHide = true;
        this.columns = [];
        switch (val){
          case  'year':
            let year = new Date().getFullYear();
            for(let i=1960;i<=year;i++){
              this.columns.push(i);
            }
            this.columns.reverse();
            break;
          case  'houseType':
            this.houseTypeDict.forEach((item) =>{
              this.columns.push(item.dictionary_name);
            });
            break;
          case  'address':
            this.selectHide = false;
            if(this.city_name){
              this.$router.push({path: '/mapSearch',query: {city: this.city_name}});
            }else {
              Toast.fail('请选择城市！')
            }

            break;
          case  'province':
            this.provinceList.forEach((item) =>{
              this.columns.push(item.province_name);
            });
            break;
          case  'city':
            this.cityList.forEach((item) =>{
              this.columns.push(item.city_name);
            });
            break;
          case  'area':
            this.areaList.forEach((item) =>{
              this.columns.push(item.area_name);
            });
            break;
          case  'region':
            this.regionList.forEach((item) =>{
              this.columns.push(item.region_name);
            });
            break;
        }
      },
      getVillage(data){
        let village = JSON.parse(data);
        this.params.address = village.district;
        this.params.village_name = village.name;
      },
      // select关闭
      onCancel() {
        this.selectHide = false;
      },

      onConfirm(value, index){
        switch (this.selectType){
          case 'year':
            this.params.built_year = value;
            break;
          case 'houseType':
            this.house_type = value;
            this.houseTypeDict.forEach((item) =>{
              if(item.dictionary_name === value){
                this.params.house_type = item.id
              }
            });
            break;
          case 'province':
            if (this.province_name !== value){
              this.city_name = '';
              this.params.city = '';
              this.area_name = '';
              this.params.area = '';
              this.region_name = '';
              this.params.region = '';
              this.cityList =[];
              this.areaList =[];
              this.regionList =[];
            }
            this.province_name = value;
            this.provinceList.forEach((item) =>{
              if(item.province_name === value){
                this.params.province = item.province_id
                this.getCityList(this.params.province);
              }
            });
            break;
          case 'city':
            if(this.city_name !== value){
              this.area_name = '';
              this.params.area = '';
              this.region_name = '';
              this.params.region = '';
              this.areaList =[];
              this.regionList =[];
            }
            this.city_name = value;

            this.cityList.forEach((item) =>{
              if(item.city_name === value){
                this.params.city = item.city_id
                this.getAreaList(this.params.city);
              }
            });
            break;
          case 'area':
            if(this.area_name !== value){
              this.region_name = '';
              this.params.region = '';
              this.regionList =[];
            }
            this.area_name = value;

            this.areaList.forEach((item) =>{
              if(item.area_name === value){
                this.params.area = item.area_id;
                this.getRegionList(this.params.area);
              }
            });
            break;
          case 'region':
            this.region_name = value;
            this.regionList.forEach((item) =>{
              if(item.region_name === value){
                this.params.region = item.id
              }
            });
            break;
        }
        this.selectHide = false;
      },

      confirmAdd(){
        this.$http.post(globalConfig.server+'setting/community/save',this.params).then((res)=>{
          if (res.data.code === '10010') {
            Toast.success(res.data.msg);
            this.clearData();
            this.$router.replace({path: '/villageCenter'});
          } else {
            Toast.fail(res.data.msg)
          }
        })
      },
      clearData(){
        this.params ={
          province : '',
          city : '',
          area : '',
          region : '',
          address : '',
          village_name : '',
          built_year : '',
          house_type : '',
        };
        this.house_type = '';
        this.province_name = '';
        this.city_name = '';
        this.area_name = '';
        this.region_name = '';
        this.selectHide = false;
        this.columns = [];
        this.selectType = '';
        this.cityList =[];
        this.areaList =[];
        this.regionList =[];
      },
    }
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
