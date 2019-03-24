<template>
  <div>
    <van-popup :overlay-style="{'background':'rgba(0,0,0,.2)'}" v-model="pickerModule" position="bottom"
               :overlay="true">
      <van-picker
        show-toolbar
        :columns="pickers.columns"
        @cancel="pickerModule = false"
        @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "picker",
    props: ['module', 'pickers', 'form', 'formData'],
    data() {
      return {
        pickerModule: false,
        forms: {},
        formatData: {},
      }
    },
    mounted() {
    },
    activated() {
    },
    watch: {
      module(val) {
        this.pickerModule = val;
      },
      pickerModule(val) {
        if (!val) {
          this.$emit('close');
        } else {
          this.forms = this.form;
          this.formatData = this.formData;
        }
      },
    },
    computed: {},
    methods: {
      onConfirm(value, index) {
        let picker = this.pickers;
        let form = this.forms;
        let formatData = this.formatData;
        switch (picker.id) {
          case 'district_id':
            form.district = value;
            form.district_id = picker.ids[index];
            break;
          case 306:
            form.city = value;
            form.city_id = picker.ids[index];
            break;
          case 437:// 空置期规则)
            formatData.vacancy_way = value;
            form.vacancy_way = picker.ids[index];
            break;
          case 443:// 支付方式 月付。。。
            formatData.pay_way_arr[picker.index] = value;
            form.pay_way_arr[picker.index] = picker.ids[index];
            break;
          case 449:// 物业费承担
            formatData.property_payer = value;
            form.property_payer = picker.ids[index];
            break;
          default:
            formatData[picker.id] = value;
            form[picker.id] = picker.ids[index];
            break;
        }
        this.$emit('succeed', form, formatData);
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
