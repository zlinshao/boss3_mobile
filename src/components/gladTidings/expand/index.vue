<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="form.village_name"
        label="小区名称"
        type="text"
        readonly
        placeholder="请选择小区名称">
      </van-field>
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
    </van-cell-group>

    <Picker :module="pickerModule" :pickers="pickers" :form="form" :formData="{}" @close="onCancel"
            @succeed="onConPicker"></Picker>
  </div>
</template>

<script>
  import Picker from '../../common/picker.vue'

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
    },
    watch: {},
    computed: {},
    methods: {
      // 显示下拉
      selectShow(val) {
        setTimeout(() => {
          this.pickerModule = true;
        }, 200);
        let dict;
        if (val === 306) {
          dict = this.cities;
        } else {
          dict = this.areas;
        }
        console.log(dict);
        this.pickers.columns = Object.values(dict);
        this.pickers.ids = Object.keys(dict);
        this.pickers.id = val;
      },
      // 下拉选择结果
      onConPicker(value) {
        this.form = value;
        this.getArea(value.city_id);
        this.onCancel();
      },
      getArea(id) {
        this.$http.get(this.url + 'setting/village/district?city_id=' + id).then(res => {
          for (let item of res.data.data) {
            this.areas[item.area_id] = item.name;
          }
        });
      },
      // 关闭模态框
      onCancel() {
        this.pickerModule = false;
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
