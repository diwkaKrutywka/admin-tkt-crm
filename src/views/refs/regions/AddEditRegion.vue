<template>
    <a-modal
      :open="open"
      :title="region_id ? $t('l_Edit_region') : $t('l_Add_region')"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="loading"
      :destroyOnClose="true"
      width="600px"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item :label="$t('l_Name_kz')" name="name_kk" required>
          <a-input v-model:value="form.name_kk" />
        </a-form-item>
        <a-form-item :label="$t('l_Name_ru')" name="name_ru" required>
          <a-input v-model:value="form.name_ru" />
        </a-form-item>
        <a-form-item :label="$t('l_Name_en')" name="name_en" required>
          <a-input v-model:value="form.name_en" />
        </a-form-item>
        <a-form-item :label="$t('l_Region_code')" name="region_code" required>
          <a-input v-model:value="form.region_code" />
        </a-form-item>
        <a-form-item :label="$t('l_Display_order')" name="display_order">
          <a-input-number v-model:value="form.display_order" style="width: 100%" />
        </a-form-item>
        <a-form-item :label="$t('l_Capital_city')" name="capital_city">
          <a-input v-model:value="form.capital_city" />
        </a-form-item>
        <a-form-item :label="$t('l_Region_type')" name="region_type">
          <a-select v-model:value="form.region_type">
            <a-select-option value="oblast">oblast</a-select-option>
            <a-select-option value="city">city</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { message } from 'ant-design-vue'
  import { getRegionById, createRegion, updateRegion } from '../../../api/ref'
  import { useI18n } from 'vue-i18n'
  
  const props = defineProps<{
    open: boolean
    region_id: string | null
  }>()
  
  const emit = defineEmits(['update:open', 'submit'])
  
  const { t: $t } = useI18n()
  
  const loading = ref(false)
  
  const form = ref({
    name_kk: '',
    name_ru: '',
    name_en: '',
    region_code: '',
    display_order: 0,
    capital_city: '',
    region_type: 'oblast',
  })
  
  watch(
    () => props.open,
    async (val) => {
      if (val) {
        if (props.region_id) {
          loading.value = true
          try {
            const { data } = await getRegionById(props.region_id)
            form.value = {
              name_kk: data.name_kk ?? '',
              name_ru: data.name_ru ?? '',
              name_en: data.name_en ?? '',
              region_code: data.region_code ?? '',
              display_order: data.display_order ?? 0,
              capital_city: data.capital_city ?? '',
              region_type: data.region_type ?? 'oblast',
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
  
  const resetForm = () => {
    form.value = {
      name_kk: '',
      name_ru: '',
      name_en: '',
      region_code: '',
      display_order: 0,
      capital_city: '',
      region_type: 'oblast',
    }
  }
  
  const handleSubmit = async () => {
    loading.value = true
    try {
      if (props.region_id) {
        await updateRegion(props.region_id, form.value)
        message.success($t('l_Updated_successfully') || 'Updated successfully')
      } else {
        await createRegion(form.value)
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
  