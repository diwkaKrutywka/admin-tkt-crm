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
        <a-select
          v-model:value="form.complaint_category_id"
          :options="categoryOptions"
          :placeholder="$t('l_Complaint_category_id')"
        />
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
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import type { ComplaintSubcategory, ComplaintCategory } from '../../../types/ref'
import { createComplaintSubcategory, updateComplaintSubcategory, getComplaintCategories } from '../../../api/ref'

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
  name_kk: '',
  name_ru: '',
  name_en: '',
  code: '',
  description: '',
})

const categoryOptions = ref<{ label: string, value: string }[]>([])

onMounted(async () => {
  try {
    const res = await getComplaintCategories()
    categoryOptions.value = (res.data?.items || []).map((cat: ComplaintCategory) => ({
      label: cat.name,
      value: cat.id,
    }))
  } catch (e) {
    categoryOptions.value = []
  }
})

watch(
  () => props.subcategory,
  (subcat) => {
    if (subcat) {
      isEdit.value = true
      form.value = {
        complaint_category_id: subcat.complaint_category_id,
        name_kk: subcat.name_kk || '',
        name_ru: subcat.name || '',
        name_en: subcat.name_en || '',
        code: subcat.code,
        description: subcat.description || '',
      }
    } else {
      isEdit.value = false
      form.value = {
        complaint_category_id: '',
        name_kk: '',
        name_ru: '',
        name_en: '',
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
    // Only send the required fields
    const payload = {
      complaint_category_id: form.value.complaint_category_id,
      name_kk: form.value.name_kk,
      name_ru: form.value.name_ru,
      name_en: form.value.name_en,
      code: form.value.code,
      description: form.value.description,
    }
    if (!isEdit.value) {
      await createComplaintSubcategory(payload)
      message.success($t('l_Complaint_subcategory_created'))
    } else {
      if (props.subcategory && props.subcategory.id) {
        await updateComplaintSubcategory(props.subcategory.id, payload)
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
