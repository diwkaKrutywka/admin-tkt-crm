<template>
    <a-modal
      :open="open"
      :title="call_type_id ? $t('l_Edit_call_type') : $t('l_Add_call_type')"
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
        <a-form-item :label="$t('l_Code')" name="code" required>
          <a-input v-model:value="form.code" />
        </a-form-item>
        <a-form-item :label="$t('l_Description')" name="description">
          <a-textarea v-model:value="form.description" rows="3" />
        </a-form-item>
        <a-form-item :label="$t('l_Complaint')" name="is_complaint">
          <a-switch v-model:checked="form.is_complaint" />
        </a-form-item>
        <a-form-item :label="$t('l_Display_order')" name="display_order">
          <a-input-number v-model:value="form.display_order" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  
  import {
    getCallTypeById,
    createCallType,
    updateCallType,
  } from '../../../api/ref'
  
  const props = defineProps<{
    open: boolean
    call_type_id: string | null
  }>()
  
  const emit = defineEmits(['update:open', 'submit'])
  
  const { t: $t } = useI18n()
  const loading = ref(false)
  
  const form = ref({
    name_kk: '',
    name_ru: '',
    name_en: '',
    code: '',
    description: '',
    is_complaint: false,
    display_order: 0,
  })
  
  const resetForm = () => {
    form.value = {
      name_kk: '',
      name_ru: '',
      name_en: '',
      code: '',
      description: '',
      is_complaint: false,
      display_order: 0,
    }
  }
  
  watch(
    () => props.open,
    async (val) => {
      if (val) {
        if (props.call_type_id) {
          loading.value = true
          try {
            const { data } = await getCallTypeById(props.call_type_id)
            form.value = {
              name_kk: data.name_kk ?? '',
              name_ru: data.name_ru ?? '',
              name_en: data.name_en ?? '',
              code: data.code ?? '',
              description: data.description ?? '',
              is_complaint: data.is_complaint ?? false,
              display_order: data.display_order ?? 0,
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
      if (props.call_type_id) {
        await updateCallType(props.call_type_id, form.value)
        message.success($t('l_Updated_successfully') || 'Updated successfully')
      } else {
        await createCallType(form.value)
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
  