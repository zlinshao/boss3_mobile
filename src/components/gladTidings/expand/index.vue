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
        @click="selectShow()"
        label="城市名"
        type="text"
        readonly
        placeholder="请选择城市名称"
        required>
      </van-field>
      <van-field
        v-model="form.district"
        @click="selectShow()"
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
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {},
    computed: {},
    methods: {
      // 显示下拉
      selectShow(val, index) {
        setTimeout(() => {
          this.pickerModule = true;
        }, 200);
        let dict;
        if (typeof val === 'string') {
          dict = dicties[val];
        } else {
          dict = this.dictData[val];
        }
        this.pickers.columns = Object.values(dict);
        this.pickers.ids = Object.keys(dict);
        this.pickers.id = val;
        this.pickers.index = index;
      },
      // 下拉选择结果
      onConPicker(value, index) {
        this.form = value;
        this.onCancel();
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
