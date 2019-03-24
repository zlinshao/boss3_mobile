<template>
  <div>
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
        label="区县名称"
        type="text"
        readonly
        placeholder="请选择区县名称"
        required>
      </van-field>
      <van-field
        v-model="form.village_name"
        label="小区"
        type="text"
        placeholder="请输入小区地址"
        required>
        <van-button slot="button" size="small" type="primary" @click="searchSelect()">搜索小区</van-button>
      </van-field>
    </van-cell-group>
    <div class="footer">
      <div @click="saveVillage()">提交</div>
    </div>
    <Picker :module="pickerModule" :pickers="pickers" :form="form" :formData="{}" @close="onCancel"
            @succeed="onConPicker"></Picker>
  </div>
</template>

<script>
  import Picker from '../../common/picker.vue'
  import {Toast} from 'vant'

  export default {
    name: "index",
    components: {Picker},
    data() {
      return {
        url: globalConfig.server,
        pickerModule: false,//下拉框
        form: {
          village_name: '',//小区名称
          city: '',//城市名
          city_id: '',//城市id
          district: '',//小区名称
          district_id: '',//区县id
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
        selectType: '',
      }
    },
    mounted() {
      this.dictionary(306, 1).then(res => {
        for (let item of res.data) {
          if (item.variable && item.variable.city_id) {
            this.cities[item.variable.city_id] = item.dictionary_name;
          }
        }
      });
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
        this.$router.push({path: '/citySearch', query: data});
      },
      // 显示下拉
      selectShow(val) {
        this.selectType = val;
        setTimeout(() => {
          this.pickerModule = true;
        }, 200);
        let dict;
        if (val === 306) {
          dict = this.cities;
        } else {
          dict = this.areas;
        }
        this.pickers.columns = Object.values(dict);
        this.pickers.ids = Object.keys(dict);
        this.pickers.id = val;
      },
      // 下拉选择结果
      onConPicker(value) {
        this.form = value;
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
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
