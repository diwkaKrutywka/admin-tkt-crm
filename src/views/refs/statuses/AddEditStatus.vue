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
        <a-input v-model:value="form.name_ru" :placeholder="$t('l_Name_ru')" />
      </a-form-item>
      <a-form-item :label="$t('l_Name_kz')" name="name_kk" required>
        <a-input v-model:value="form.name_kk" :placeholder="$t('l_Name_kz')" />
      </a-form-item>
      <a-form-item :label="$t('l_Name_en')" name="name_en" required>
        <a-input v-model:value="form.name_en" :placeholder="$t('l_Name_en')" />
      </a-form-item>
      <a-form-item :label="$t('l_Code')" name="code" required>
        <a-input v-model:value="form.code" :placeholder="$t('l_Code')" />
      </a-form-item>
      <a-form-item :label="$t('l_Description')" name="description">
        <a-input v-model:value="form.description" :placeholder="$t('l_Description')" />
      </a-form-item>
      <a-form-item :label="$t('l_Status')" name="is_final">
        <a-switch v-model:checked="form.is_final" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
// import type { ComplaintStatus } from '../../../types/ref'
import { createComplaintStatus, updateComplaintStatus, getComplaintStatusById } from '../../../api/ref'

const props = defineProps({
  open: Boolean,
  status_id: String as () => string | null,
})
const emit = defineEmits(['update:open', 'submit'])
const { t: $t } = useI18n()

const loading = ref(false)
const isEdit = ref(false)
const form = ref({
  name_ru: '',
  name_kk: '',
  name_en: '',
  code: '',
  description: '',
  is_final: false,
})

watch(
  () => props.open,
  async (val) => {
    if (val) {
      if (props.status_id) {
        isEdit.value = true
        loading.value = true
        try {
          const { data } = await getComplaintStatusById(props.status_id)
          form.value = {
            name_ru: data.name_ru || data.name || '',
            name_kk: data.name_kk || '',
            name_en: data.name_en || '',
            code: data.code || '',
            description: data.description || '',
            is_final: data.is_final || false,
          }
        } catch {
          message.error($t('l_Load_error') || 'Load error')
        } finally {
          loading.value = false
        }
      } else {
        isEdit.value = false
        form.value = {
          name_ru: '',
          name_kk: '',
          name_en: '',
          code: '',
          description: '',
          is_final: false,
        }
      }
    }
  }
)

const handleSubmit = async () => {
  loading.value = true
  try {
    if (!isEdit.value) {
      await createComplaintStatus(form.value)
      message.success($t('l_Complaint_status_created'))
    } else {
      if (props.status_id) {
        await updateComplaintStatus(props.status_id, form.value)
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