<template>
    <a-modal
      :open="open"
      :title="district_id ? $t('l_Edit_district') : $t('l_Add_district')"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="loading"
      :destroyOnClose="true"
      width="600px"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item :label="$t('l_City')" name="city_id" required>
          <a-select v-model:value="form.city_id" :options="cities" :fieldNames="{ label: 'name', value: 'id' }" />
        </a-form-item>
        <a-form-item :label="$t('l_Name_kz')" name="name_kk" required>
          <a-input v-model:value="form.name_kk" />
        </a-form-item>
        <a-form-item :label="$t('l_Name_ru')" name="name_ru" required>
          <a-input v-model:value="form.name_ru" />
        </a-form-item>
        <a-form-item :label="$t('l_Name_en')" name="name_en" required>
          <a-input v-model:value="form.name_en" />
        </a-form-item>
        <a-form-item :label="$t('l_District_code')" name="district_code">
          <a-input v-model:value="form.district_code" />
        </a-form-item>
        <a-form-item :label="$t('l_District_type')" name="district_type">
          <a-select v-model:value="form.district_type">
            <a-select-option value="urban">urban</a-select-option>
            <a-select-option value="rural">rural</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('l_Administrative_center')" name="administrative_center">
          <a-input v-model:value="form.administrative_center" />
        </a-form-item>
        <a-form-item :label="$t('l_Display_order')" name="display_order">
          <a-input-number v-model:value="form.display_order" style="width: 100%" />
        </a-form-item>
        <a-form-item :label="$t('l_Description')" name="description">
          <a-textarea v-model:value="form.description" rows="3" />
        </a-form-item>
      
      </a-form>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  import { getDistrictById, createDistrict, updateDistrict, getCities } from '../../../api/ref'
  
  const props = defineProps<{
    open: boolean
    district_id: string | null
  }>()
  
  const emit = defineEmits(['update:open', 'submit'])
  
  const { t: $t } = useI18n()
  
  const loading = ref(false)
  const cities = ref<any[]>([])
  
  const form = ref({
    name_kk: '',
    name_ru: '',
    name_en: '',
    city_id: '',
    district_code: '',
    district_type: 'urban',
    administrative_center: '',
    display_order: 0,
    description: '',
  })
  
  const resetForm = () => {
    form.value = {
      name_kk: '',
      name_ru: '',
      name_en: '',
      city_id: '',
      district_code: '',
      district_type: 'urban',
      administrative_center: '',
      display_order: 0,
      description: '',
    }
  }
  
  const fetchCities = async () => {
    try {
      const { data } = await getCities()
      cities.value = data.items || []
    } catch {
      message.error($t('l_Load_error') || 'Failed to load cities')
    }
  }
  
  watch(
    () => props.open,
    async (val) => {
      if (val) {
        await fetchCities()
        if (props.district_id) {
          loading.value = true
          try {
            const { data } = await getDistrictById(props.district_id)
            form.value = {
              name_kk: data.name_kk ?? '',
              name_ru: data.name_ru ?? '',
              name_en: data.name_en ?? '',
              city_id: data.city_id ?? '',
              district_code: data.district_code ?? '',
              district_type: data.district_type ?? 'urban',
              administrative_center: data.administrative_center ?? '',
              display_order: data.display_order ?? 0,
              description: data.description ?? '',
            }
          } catch (error) {
            message.error($t('l_Load_error') || 'Load error')
          } finally {
            loading.value = false
          }
        } else {
          resetForm()
        }
      }
    }
  )
  
  const handleSubmit = async () => {
    loading.value = true
    try {
      if (props.district_id) {
        await updateDistrict(props.district_id, form.value)
        message.success($t('l_Updated_successfully') || 'Updated successfully')
      } else {
        await createDistrict(form.value)
        message.success($t('l_Added_successfully') || 'Added successfully')
      }
      emit('update:open', false)
      emit('submit')
    } catch (error) {
      message.error($t('l_Save_error') || 'Save error')
    } finally {
      loading.value = false
    }
  }
  
  const handleCancel = () => {
    emit('update:open', false)
    resetForm()
  }
  </script>
  