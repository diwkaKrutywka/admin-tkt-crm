<template>
  <a-modal
    v-model:open="visible"
    :title="$t('l_Filter_users')"
    @ok="handleOk"
    :confirm-loading="loading"
    @cancel="handleCancel"
    destroyOnClose
    :width="modalWidth"
    :getContainer="false"
    :wrapClassName="'filter-modal-wrapper'"
  >
    <a-form :model="form" layout="vertical">
      <!-- Organization ID и User Role в одной строке -->
      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_Organization_ID')" name="organization_id">
            <a-input 
              v-model:value="form.organization_id" 
              :placeholder="$t('l_Enter_org_id')"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_User_role')" name="user_role">
            <a-select 
              v-model:value="form.user_role" 
              :placeholder="$t('l_Select_status')"
              allow-clear
            >
              <a-select-option value="system_admin">System Admin</a-select-option>
              <a-select-option value="senior_doctor">Senior Doctor</a-select-option>
              <a-select-option value="dispatcher">Dispatcher</a-select-option>
              <a-select-option value="manager">Manager</a-select-option>
              <a-select-option value="employee">Employee</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- Is Active -->
      <a-form-item :label="$t('l_Active_status')" name="is_active">
        <a-select 
          v-model:value="form.is_active" 
          :placeholder="$t('l_Select_status')"
          allow-clear
        >
          <a-select-option value="true">{{ $t('l_Active') }}</a-select-option>
          <a-select-option value="false">{{ $t('l_Inactive') }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Даты в одной строке на больших экранах -->
      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!--
          <a-form-item :label="$t('l_Create_time')" name="create_date">
            <a-range-picker
              v-model:value="form.create_date"
              :placeholder="[$t('l_From'), $t('l_To')]"
              format="DD.MM.YYYY"
              allow-clear
              style="width: 100%"
            />
          </a-form-item>
          -->
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <!--
          <a-form-item :label="$t('l_Last_login')" name="last_login">
            <a-range-picker
              v-model:value="form.last_login"
              :placeholder="[$t('l_From'), $t('l_To')]"
              format="DD.MM.YYYY"
              allow-clear
              style="width: 100%"
            />
          </a-form-item>
          -->
        </a-col>
      </a-row>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="handleReset">
          {{ $t('l_Reset_filter') }}
        </a-button>
        <a-button @click="handleCancel">
          {{ $t('l_Cancel') }}
        </a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">
          {{ $t('l_Apply_filter') }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import type { Dayjs } from 'dayjs'

const { t: $t } = useI18n()

interface FilterForm {
  organization_id: string
  user_role: string
  is_active: string | null
  create_date: [Dayjs, Dayjs] | null
  last_login: [Dayjs, Dayjs] | null
}

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'filter', payload: FilterForm): void
}>()

const visible = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val),
})

const loading = ref(false)

const form = reactive<FilterForm>({
  organization_id: '',
  user_role: '',
  is_active: null,
  create_date: null,
  last_login: null,
})

// Сброс формы при открытии модального окна
watch(
  () => props.open,
  (val) => {
    if (val) {
      resetForm()
    }
  }
)

const resetForm = () => {
  form.organization_id = ''
  form.user_role = ''
  form.is_active = null
  form.create_date = null
  form.last_login = null
}

const handleOk = async () => {
  loading.value = true
  
  try {
    // Проверяем, что хотя бы одно поле заполнено
    const hasFilters = form.organization_id || form.user_role || form.is_active !== null || 
                      form.create_date || form.last_login
    
    if (!hasFilters) {
      message.warning($t('l_Choose_filter_criteria'))
      return
    }

    // Эмитим событие с данными фильтра
    emit('filter', { ...form })
    
    message.success($t('l_Filter_applied'))
    visible.value = false
  } catch (error) {
    message.error('Ошибка при применении фильтра')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
}

const handleReset = () => {
  resetForm()
  message.info($t('l_Filter_reset'))
}

const modalWidth = computed(() => {
  return window.innerWidth < 768 ? '95vw' : '700px'
})

// Позиционирование модального окна под кнопкой фильтра
onMounted(() => {
  // Добавляем стили для позиционирования модального окна
  const style = document.createElement('style')
  style.textContent = `
    .filter-modal-wrapper .ant-modal {
      position: absolute !important;
      top: 190px !important;
      right: 60px !important;
      left: auto !important;
      transform: none !important;
      margin: 0 !important;
      z-index: 1000 !important;
      max-height: 80vh !important;
      overflow-y: auto !important;
      width: 700px !important;
    }
    @media (max-width: 767px) {
      .filter-modal-wrapper .ant-modal {
        width: 95vw !important;
        right: 2.5vw !important;
        left: 2.5vw !important;
        top: 10vw !important;
      }
    }
    .filter-modal-wrapper .ant-modal-mask {
      position: fixed !important;
    }
  `
  document.head.appendChild(style)
})
</script>
