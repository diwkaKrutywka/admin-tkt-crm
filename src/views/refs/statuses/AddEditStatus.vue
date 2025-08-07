<template>
  <a-modal
    :open="open"
    :title="isEdit ? $t('l_Edit_complaint_status') : $t('l_Add_complaint_status')"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="loading"
    destroyOnClose
  >
    <a-form :model="form" layout="vertical">
      <a-form-item :label="$t('l_Name_ru')" name="name_ru" required>
        <a-input v-model:value="form.name_ru" />
      </a-form-item>
      <a-form-item :label="$t('l_Name_kz')" name="name_kk" required>
        <a-input v-model:value="form.name_kk" />
      </a-form-item>
      <a-form-item :label="$t('l_Name_en')" name="name_en" required>
        <a-input v-model:value="form.name_en" />
      </a-form-item>
      <a-form-item :label="$t('l_Code')" name="code" required>
        <a-input v-model:value="form.code" />
      </a-form-item>
      <a-form-item :label="$t('l_Description')" name="description">
        <a-input v-model:value="form.description" />
      </a-form-item>
      <a-form-item>
          <a-row :gutter="[20, 0]" align="middle">
          <a-col>
            <a-form-item
              :label="$t('l_Status')"
              name="is_final"
              :colon="false"
              style="margin-bottom: 0"
            >
                             <a-switch 
                 v-model:checked="form.is_final" 
               />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>
      
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import type { ComplaintStatus } from '../../../types/ref'
import { createComplaintStatus, updateComplaintStatus } from '../../../api/ref'

const props = defineProps({
  open: Boolean,
  status: Object as () => ComplaintStatus | null,
})
const emit = defineEmits(['update:open', 'submit'])
const { t: $t } = useI18n()

const loading = ref(false)
const isEdit = ref(false)
const form = ref({
  name_kk: '',
  name_ru: '',
  name_en: '',
  code: '',
  description: '',
  is_final: false,
})

watch(
  () => props.status,
  (status) => {
    if (status) {
      isEdit.value = true
      form.value = {
        name_kk: status.name_kk || '',
        name_ru: status.name || '',
        name_en: status.name_en || '',
        code: status.code || '',
        description: status.description || '',
        is_final: status.is_final || false,
      }
    } else {
      isEdit.value = false
      form.value = {
        name_kk: '',
        name_ru: '',
        name_en: '',
        code: '',
        description: '',
        is_final: false,
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  try {
    if (!isEdit.value) {
      await createComplaintStatus(form.value)
      message.success($t('l_Complaint_status_created'))
    } else {
      if (props.status && props.status.id) {
        await updateComplaintStatus(props.status.id, form.value)
        message.success($t('l_Complaint_status_updated'))
      }
    }
    emit('update:open', false)
    emit('submit')
  } catch (e) {
    message.error($t('l_Save_error') || 'Error')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>

<style scoped></style>
