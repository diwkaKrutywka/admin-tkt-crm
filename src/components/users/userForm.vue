<!-- EditUserModal.vue -->
<template>
  <a-modal
    :visible="visible"
    title="Редактировать пользователя"
    :width="600"
    @cancel="handleCancel"
    :footer="null"
  >
    <div class="mb-4">
      <p class="text-gray-600">Изменение данных пользователя</p>
    </div>

    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <!-- ФИО -->
      <a-form-item label="ФИО" name="full_name">
        <a-input
          v-model:value="formData.full_name"
          placeholder="Введите полное имя"
          size="large"
        />
      </a-form-item>

      <!-- Организация -->
      <a-form-item label="Организация" name="organization_id">
        <a-select
          v-model:value="formData.organization_id"
          placeholder="Выберите организацию"
          size="large"
          @change="handleOrganizationChange"
        >
          <a-select-option
            v-for="org in organizations"
            :key="org.id"
            :value="org.id"
          >
            {{ org.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <!-- Название организации (readonly, заполняется автоматически) -->
      <a-form-item label="Название организации" name="organization_name">
        <a-input
          v-model:value="formData.organization_name"
          placeholder="Автоматически заполняется"
          size="large"
          :disabled="true"
        />
      </a-form-item>

      <!-- Отдел -->
      <a-form-item label="Отдел" name="department">
        <a-input
          v-model:value="formData.department"
          placeholder="Введите название отдела"
          size="large"
        />
      </a-form-item>

      <!-- Должность -->
      <a-form-item label="Должность" name="position">
        <a-input
          v-model:value="formData.position"
          placeholder="Введите должность"
          size="large"
        />
      </a-form-item>

      <!-- Статус активности -->
      <a-form-item label="Статус" name="is_active">
        <a-switch
          v-model:checked="formData.is_active"
          checked-children="Активен"
          un-checked-children="Неактивен"
          size="default"
        />
      </a-form-item>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 mt-6">
        <a-button @click="handleCancel" size="large">
          Отмена
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          :loading="loading"
        >
          Сохранить изменения
        </a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { EditUserRequest, Organization } from '../../interfaces/userForm'

// Props
interface Props {
  visible: boolean
  initialData?: Partial<EditUserRequest>
  organizations: Organization[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialData: () => ({})
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: EditUserRequest): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

// Refs
const formRef = ref<FormInstance>()

// Reactive data
const formData = ref<EditUserRequest>({
  full_name: '',
  organization_id: '',
  organization_name: '',
  department: '',
  position: '',
  is_active: true
})

// Validation rules
const rules: Record<string, Rule[]> = {
  full_name: [
    { required: true, message: 'Введите ФИО пользователя', trigger: 'blur' },
    { min: 2, message: 'ФИО должно содержать минимум 2 символа', trigger: 'blur' }
  ],
  organization_id: [
    { required: true, message: 'Выберите организацию', trigger: 'change' }
  ],
  department: [
    { required: true, message: 'Введите название отдела', trigger: 'blur' }
  ],
  position: [
    { required: true, message: 'Введите должность', trigger: 'blur' }
  ]
}

// Methods
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    emit('submit', { ...formData.value })
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const handleCancel = () => {
  resetForm()
  emit('update:visible', false)
  emit('cancel')
}

const handleOrganizationChange = (organizationId: string) => {
  const selectedOrg = props.organizations.find(org => org.id === organizationId)
  if (selectedOrg) {
    formData.value.organization_name = selectedOrg.name
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    full_name: '',
    organization_id: '',
    organization_name: '',
    department: '',
    position: '',
    is_active: true
  }
}

// Watchers
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible && props.initialData) {
      // Заполняем форму данными при открытии
      formData.value = {
        full_name: props.initialData.full_name || '',
        organization_id: props.initialData.organization_id || '',
        organization_name: props.initialData.organization_name || '',
        department: props.initialData.department || '',
        position: props.initialData.position || '',
        is_active: props.initialData.is_active ?? true
      }
    } else if (!newVisible) {
      // Сбрасываем форму при закрытии
      resetForm()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 20px;
}

.ant-modal-header {
  border-bottom: 1px solid #f0f0f0;
}

.ant-input-lg,
.ant-select-lg {
  border-radius: 8px;
}

.ant-switch {
  margin-top: 4px;
}
</style>