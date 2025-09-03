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
        <a-form-item :label="$t('l_Name')" name="name" required>
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item :label="$t('l_Region_code')" name="region_code" required>
          <a-input v-model:value="form.region_code" />
        </a-form-item>
        <a-form-item :label="$t('l_Admin_code')" name="admin_code" required>
          <a-input v-model:value="form.admin_code" />
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
    name: '',
    region_code: '',
    admin_code: '',
    region_type: 'oblast',
    capital_city: '',
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
              name: data.name ?? '',
              region_code: data.region_code ?? '',
              admin_code: data.admin_code ?? '',
              region_type: data.region_type ?? 'oblast',
              capital_city: data.capital_city ?? '',
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
      name: '',
      region_code: '',
      admin_code: '',
      region_type: 'oblast',
      capital_city: '',
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
  