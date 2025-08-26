<template>
    <a-modal
      v-model:open="visible"
      :title="isEdit ? 'Edit Contact' : 'Add Contact'"
      @ok="handleOk"
      :confirm-loading="loading"
      @cancel="handleCancel"
      destroyOnClose
    >
      <a-form :model="form" ref="formRef" layout="vertical">
        <a-form-item label="Full Name" name="full_name">
          <a-input v-model:value="form.full_name" />
        </a-form-item>
  
        <a-form-item label="Phone Number" name="phone_number">
          <a-input v-model:value="form.called_by" disabled />
        </a-form-item>
  
        <a-form-item label="IIN" name="iin">
          <a-input v-model:value="form.iin" />
        </a-form-item>
  
        <a-form-item label="Gender" name="gender">
          <a-select v-model:value="form.gender" :options="genderOptions" />
        </a-form-item>
  
        <a-form-item label="Address" name="home_address">
          <a-input v-model:value="form.home_address" />
        </a-form-item>
  
        <a-form-item label="Birth Date" name="birth_date">
          <a-date-picker v-model:value="form.birth_date" class="w-full" />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  <script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue'
  import type { FormInstance} from 'ant-design-vue'
  import { message } from 'ant-design-vue'
  import dayjs from 'dayjs'
  import { ContactApi } from '../../api/contact'
  import { toRaw } from 'vue'
  
  interface Contact {
    caller_id: string
    called_by: string
    full_name: string
    birth_date: any // using any for compatibility with dayjs object
    iin: string
    gender: string
    home_address: string
  }
  
  const props = defineProps<{
    open: boolean
    id?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:open', val: boolean): void
    (e: 'submit', payload: Contact): void
  }>()
  
  const visible = computed({
    get: () => props.open,
    set: (val: boolean) => emit('update:open', val),
  })
  
  const isEdit = computed(() => !!props.id)
  
  const form = reactive<Contact>({
    caller_id: '',
    called_by: '',
    full_name: '',
    birth_date: null,
    iin: '',
    gender: 'not_specified',
    home_address: '',
  })
  
  const genderOptions = [
    { label: 'Мужчина', value: 'male' },
    { label: 'Женщина', value: 'female' },
    { label: 'Не указано', value: 'not_specified' },
  ]
  
//   const rules: FormRules = {
//     full_name: [{ required: true, message: 'Full name is required', trigger: 'blur' }],
//     iin: [{ required: true, message: 'IIN is required', trigger: 'blur' }],
//     gender: [{ required: true, message: 'Gender is required', trigger: 'change' }],
//     home_address: [{ required: true, message: 'Address is required', trigger: 'blur' }],
//     birth_date: [{ required: true, message: 'Birth date is required', trigger: 'change' }],
//   }
  
  const formRef = ref<FormInstance>()
  const loading = ref(false)
  
  const fetchUser = async () => {
    if (!props.id) return
    loading.value = true
  
    try {
      const res = await ContactApi(`${props.id}`, {}, 'GET')
      const user = res.data
  
      Object.assign(form, {
        caller_id: user.caller_id,
        called_by: user.phone_number,
        full_name: user.full_name,
        birth_date: user.birth_date ? dayjs(user.birth_date) : null,
        iin: user.iin,
        gender: user.gender,
        home_address: user.home_address,
      })
    } catch (err) {
      message.error('Failed to load user data')
    } finally {
      loading.value = false
    }
  }
  
  watch(
    () => props.open,
    async (val) => {
      if (val && props.id) {
        await fetchUser()
      } else if (val) {
        Object.assign(form, {
          caller_id: '',
          called_by: '',
          full_name: '',
          birth_date: null,
          iin: '',
          gender: 'not_specified',
          home_address: '',
        })
      }
    },
    { immediate: true }
  )
  
  const handleOk = async () => {
    try {
      await formRef.value?.validate()
      loading.value = true
  
      const payload = { ...toRaw(form) }
  
      if (payload.birth_date) {
        payload.birth_date = dayjs(payload.birth_date).format('YYYY-MM-DD')
      }
  
      if (isEdit.value && props.id) {
        await ContactApi(`update`, payload, 'POST')
        message.success('Contact updated successfully')
        emit('submit', payload as Contact)
      } else {
        const res = await ContactApi('', payload, 'POST')
        message.success('User created successfully')
        emit('submit', res.data)
      }
  
      visible.value = false
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        message.error(err.response.data.detail)
      } else {
        message.error('Please fix validation errors or check API.')
      }
    } finally {
      loading.value = false
    }
  }
  
  const handleCancel = () => {
    visible.value = false
  }
  </script>
  