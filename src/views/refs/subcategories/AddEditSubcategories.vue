<template>
  <a-modal
    :open="open"
    :title="subtype_id ? $t('l_Edit_subtype') : $t('l_Add_subtype')"
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
        <a-textarea v-model:value="form.description" />
      </a-form-item>
      <a-form-item :label="$t('l_Call_type')" name="call_type_id" required>
        <a-select v-model:value="form.call_type_id" allowClear>
          <a-select-option
            v-for="type in callTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'

import { getSubtypeById, createSubtype, updateSubtype, getCallTypes } from '../../../api/ref'

const props = defineProps<{
  open: boolean
  subtype_id: string | null
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
  call_type_id: '',
})

const callTypes = ref<{ id: string; name: string }[]>([])

const fetchCallTypes = async () => {
  try {
    const { data } = await getCallTypes()
    callTypes.value = data.items
  } catch {
    message.error($t('l_Load_error') || 'Failed to load call types')
  }
}

watch(
  () => props.open,
  async (val) => {
    if (val) {
      fetchCallTypes()
      if (props.subtype_id) {
        loading.value = true
        try {
          const { data } = await getSubtypeById(props.subtype_id)
          form.value = {
            name_kk: data.name_kk ?? '',
            name_ru: data.name_ru ?? '',
            name_en: data.name_en ?? '',
            code: data.code ?? '',
            description: data.description ?? '',
            call_type_id: data.call_type_id ?? '',
          }
        } catch {
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
    code: '',
    description: '',
    call_type_id: '',
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (props.subtype_id) {
      await updateSubtype(props.subtype_id, form.value)
      message.success($t('l_Updated_successfully') || 'Updated successfully')
    } else {
      await createSubtype(form.value)
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
