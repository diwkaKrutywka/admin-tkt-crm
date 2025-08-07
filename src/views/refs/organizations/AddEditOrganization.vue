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
      <a-form-item :label="$t('l_Name')" name="full_name" required>
        <a-input v-model:value="form.full_name" />
      </a-form-item>
      <a-form-item :label="$t('l_Short_name')" name="short_name" required>
        <a-input v-model:value="form.short_name" />
      </a-form-item>
      <a-form-item :label="$t('l_Organization_type')" name="organization_type" required>
        <a-select v-model:value="form.organization_type">
          <a-select-option value="private_clinic">{{ $t('l_Private_clinic') }}</a-select-option>
          <a-select-option value="public_clinic">{{ $t('l_Public_clinic') }}</a-select-option>
          <a-select-option value="hospital">{{ $t('l_Hospital') }}</a-select-option>
          <a-select-option value="government_agency">{{ $t('l_government_agency') }}</a-select-option>
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
import {
  createOrganization,
  updateOrganization,
  getOrganizationById,
} from '../../../api/ref'

const props = defineProps({
  open: Boolean,
  organization_id: String as () => string | null,
})
const emit = defineEmits(['update:open', 'submit'])
const { t: $t } = useI18n()

const loading = ref(false)
const isEdit = ref(false)
const form = ref({
  organization_number: '',
  full_name: '',
  short_name: '',
  organization_type: '',
  phone: '',
  email: '',
  website: '',
  description: '',
})

watch(
  () => props.open,
  async (val) => {
    if (val) {
      if (props.organization_id) {
        isEdit.value = true
        loading.value = true
        try {
          const { data } = await getOrganizationById(props.organization_id)
          form.value = {
            organization_number: data.organization_number || '',
            full_name: data.full_name,
            short_name: data.short_name,
            organization_type: data.organization_type || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            description: data.description || '',
          }
        } catch {
          message.error($t('l_Load_error'))
        } finally {
          loading.value = false
        }
      } else {
        isEdit.value = false
        form.value = {
          organization_number: '',
          full_name: '',
          short_name: '',
          organization_type: '',
          phone: '',
          email: '',
          website: '',
          description: '',
        }
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  try {
    const cleanedData = { ...form.value }
    for (const key in cleanedData) {
      if (cleanedData[key] === '') cleanedData[key] = null
    }

    if (!isEdit.value) {
      await createOrganization(cleanedData)
      message.success($t('l_Organization_created'))
    } else if (props.organization_id) {
      await updateOrganization(props.organization_id, cleanedData)
      message.success($t('l_Organization_updated'))
    }

    emit('update:open', false)
    emit('submit')
  } catch {
    message.error($t('l_Save_error'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>

<style scoped></style>
