<template>
  <a-modal
    :open="open"
    :title="isEdit ? $t('l_Edit_organization') : $t('l_Add_organization')"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="loading"
    destroyOnClose
  >
    <a-form :model="form" layout="vertical">
      <a-form-item :label="$t('l_Organization_number')" name="organization_number">
        <a-input v-model:value="form.organization_number" />
      </a-form-item>
      <a-form-item :label="$t('l_Full_name')" name="full_name" required>
        <a-input v-model:value="form.full_name" />
      </a-form-item>
      <a-form-item :label="$t('l_Short_name')" name="short_name" required>
        <a-input v-model:value="form.short_name" />
      </a-form-item>
      <a-form-item :label="$t('l_Organization_type')" name="organization_type" required>
        <a-select v-model:value="form.organization_type">
          <a-select-option value="company">{{ $t('l_Company') }}</a-select-option>
          <a-select-option value="private_clinic">{{ $t('l_Private_clinic') }}</a-select-option>
          <a-select-option value="public_clinic">{{ $t('l_Public_clinic') }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('l_Phone')" name="phone">
        <a-input v-model:value="form.phone" />
      </a-form-item>
      <a-form-item :label="$t('l_Email')" name="email">
        <a-input v-model:value="form.email" />
      </a-form-item>
      <a-form-item :label="$t('l_Website')" name="website">
        <a-input v-model:value="form.website" />
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
import type { Organization } from '../../../types/ref'
import { createOrganization, updateOrganization } from '../../../api/ref'

const props = defineProps({
  open: Boolean,
  organization: Object as () => Organization | null,
})
const emit = defineEmits(['update:open', 'submit'])
const { t: $t } = useI18n()

const loading = ref(false)
const isEdit = ref(false)
const form = ref({
  organization_number: '',
  full_name: '',
  short_name: '',
  organization_type: 'company',
  phone: '',
  email: '',
  website: '',
  description: '',
  
})

watch(
  () => props.organization,
  (org) => {
    if (org) {
      isEdit.value = true
      form.value = {
        organization_number: org.organization_number || '',
        full_name: org.full_name,
        short_name: org.short_name,
        organization_type: org.organization_type,
        phone: org.phone || '',
        email: org.email || '',
        website: org.website || '',
        description: org.description || '',
      
      }
    } else {
      isEdit.value = false
      form.value = {
        organization_number: '',
        full_name: '',
        short_name: '',
        organization_type: 'company',
        phone: '',
        email: '',
        website: '',
        description: '',
      
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  try {
    // Очищаем пустые строки, заменяя их на null
    const cleanedData: any = { ...form.value }
    
    // Очищаем пустые строки для опциональных полей
    if (cleanedData.organization_number === '') cleanedData.organization_number = null
    if (cleanedData.phone === '') cleanedData.phone = null
    if (cleanedData.email === '') cleanedData.email = null
    if (cleanedData.website === '') cleanedData.website = null
    if (cleanedData.description === '') cleanedData.description = null

    if (!isEdit.value) {
      await createOrganization(cleanedData)
      message.success($t('l_Organization_created'))
    } else {
      if (props.organization && props.organization.id) {
        await updateOrganization(props.organization.id, cleanedData)
        message.success($t('l_Organization_updated'))
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