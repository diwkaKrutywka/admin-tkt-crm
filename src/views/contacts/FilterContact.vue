<template>
  <a-modal
    v-model:open="visible"
    :title="$t('l_Filter_contacts')"
    @ok="handleOk"
    :confirm-loading="loading"
    @cancel="handleCancel"
    destroyOnClose
    :width="modalWidth"
    :getContainer="false"
    :wrapClassName="'filter-modal-wrapper'"
  >
    <a-form :model="form" layout="vertical">
      <!-- Order By и Order в одной строке -->
      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_Order_by')" name="order_by">
            <a-select 
              v-model:value="form.order_by" 
              :placeholder="$t('l_Select_order_by')"
              allow-clear
            >
              <a-select-option value="id">{{ $t('l_ID') }}</a-select-option>
              <a-select-option value="name">{{ $t('l_Name') }}</a-select-option>
              <a-select-option value="email">{{ $t('l_Email') }}</a-select-option>
              <a-select-option value="phone">{{ $t('l_Phone') }}</a-select-option>
              <a-select-option value="birth_date">{{ $t('l_Birth_date') }}</a-select-option>
              <a-select-option value="created_at">{{ $t('l_Created_at') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_Order')" name="order">
            <a-select 
              v-model:value="form.order" 
              :placeholder="$t('l_Select_order')"
              allow-clear
            >
              <a-select-option value="asc">{{ $t('l_Ascending') }}</a-select-option>
              <a-select-option value="desc">{{ $t('l_Descending') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- Gender -->
      <a-form-item :label="$t('l_Gender')" name="gender__eq">
        <a-select 
          v-model:value="form.gender__eq" 
          :placeholder="$t('l_Select_gender')"
          allow-clear
        >
          <a-select-option value="male">{{ $t('l_Male') }}</a-select-option>
          <a-select-option value="female">{{ $t('l_Female') }}</a-select-option>
          <a-select-option value="not_specified">{{ $t('l_Not_specified') }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Birth Date Range в одной строке -->
      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_Birth_date_from')" name="birth_date__gte">
            <a-date-picker
              v-model:value="form.birth_date__gte"
              :placeholder="$t('l_From')"
              format="DD.MM.YYYY"
              allow-clear
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_Birth_date_to')" name="birth_date__lte">
            <a-date-picker
              v-model:value="form.birth_date__lte"
              :placeholder="$t('l_To')"
              format="DD.MM.YYYY"
              allow-clear
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- Created Date Range в одной строке -->
      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_Created_date_from')" name="created_at__gte">
            <a-date-picker
              v-model:value="form.created_at__gte"
              :placeholder="$t('l_From')"
              format="DD.MM.YYYY"
              allow-clear
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item :label="$t('l_Created_date_to')" name="created_at__lte">
            <a-date-picker
              v-model:value="form.created_at__lte"
              :placeholder="$t('l_To')"
              format="DD.MM.YYYY"
              allow-clear
              style="width: 100%"
            />
          </a-form-item>
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
  order_by: string
  order: string
  gender__eq: string
  birth_date__gte: Dayjs | null
  birth_date__lte: Dayjs | null
  created_at__gte: Dayjs | null
  created_at__lte: Dayjs | null
}

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'filter', payload: FilterForm): void
  (e: 'reset'): void
}>()

const visible = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val),
})

const loading = ref(false)

const form = reactive<FilterForm>({
  order_by: '',
  order: '',
  gender__eq: '',
  birth_date__gte: null,
  birth_date__lte: null,
  created_at__gte: null,
  created_at__lte: null,
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
  form.order_by = ''
  form.order = ''
  form.gender__eq = ''
  form.birth_date__gte = null
  form.birth_date__lte = null
  form.created_at__gte = null
  form.created_at__lte = null
}

const handleOk = async () => {
  loading.value = true
  
  try {
    // Проверяем, что хотя бы одно поле заполнено
    const hasFilters = form.order_by || form.order || form.gender__eq || 
                      form.birth_date__gte || form.birth_date__lte || 
                      form.created_at__gte || form.created_at__lte
    
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
  emit('reset')
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
  