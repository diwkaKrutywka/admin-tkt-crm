<template>
  <a-modal
    :open="open"
    :title="isEdit ? $t('l_Edit_complaint_subcategory') : $t('l_Add_complaint_subcategory')"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="loading"
    destroyOnClose
  >
    <a-form :model="form" layout="vertical">
      <a-form-item :label="$t('l_Complaint_category_id')" name="complaint_category_id" required>
        <a-input v-model:value="form.complaint_category_id" />
      </a-form-item>
      <a-form-item :label="$t('l_Name')" name="name" required>
        <a-input v-model:value="form.name" />
      </a-form-item>
      <a-form-item :label="$t('l_Code')" name="code" required>
        <a-input v-model:value="form.code" />
      </a-form-item>
      <a-form-item :label="$t('l_Description')" name="description">
        <a-input v-model:value="form.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import type { ComplaintSubcategory } from '../../../types/ref'
import { createComplaintSubcategory, updateComplaintSubcategory } from '../../../api/ref'

const props = defineProps({
  open: Boolean,
  subcategory: Object as () => ComplaintSubcategory | null,
})
const emit = defineEmits(['update:open', 'submit'])
const { t: $t } = useI18n()

const loading = ref(false)
const isEdit = ref(false)
const form = ref({
  complaint_category_id: '',
  name: '',
  code: '',
  description: '',
})

watch(
  () => props.subcategory,
  (subcat) => {
    if (subcat) {
      isEdit.value = true
      form.value = {
        complaint_category_id: subcat.complaint_category_id,
        name: subcat.name,
        code: subcat.code,
        description: subcat.description || '',
      }
    } else {
      isEdit.value = false
      form.value = {
        complaint_category_id: '',
        name: '',
        code: '',
        description: '',
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  try {
    if (!isEdit.value) {
      await createComplaintSubcategory(form.value)
      message.success($t('l_Complaint_subcategory_created'))
    } else {
      if (props.subcategory && props.subcategory.id) {
        await updateComplaintSubcategory(props.subcategory.id, form.value)
        message.success($t('l_Complaint_subcategory_updated'))
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
