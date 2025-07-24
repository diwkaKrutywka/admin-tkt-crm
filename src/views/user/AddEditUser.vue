<template>
    <a-modal
      v-model:open="visible"
      :title="isEdit ? 'Edit User' : 'Add User'"
      @ok="handleOk"
      :confirm-loading="loading"
      @cancel="handleCancel"
      destroyOnClose
    >
      <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
        <a-form-item label="Username" name="username">
          <a-input v-model:value="form.username" />
        </a-form-item>
  
        <a-form-item label="Full Name" name="full_name">
          <a-input v-model:value="form.full_name" />
        </a-form-item>
  
        <a-form-item v-if="!isEdit" label="Password" name="password">
          <a-input-password v-model:value="form.password" />
        </a-form-item>
  
        <a-form-item label="User Role" name="user_role">
          <a-select v-model:value="form.user_role" :options="roleOptions" />
        </a-form-item>
  
        <a-form-item label="Organization" name="organization_id">
          <a-input v-model:value="form.organization_id" />
        </a-form-item>
  
        <a-form-item label="Organization Name" name="organization_name">
          <a-input v-model:value="form.organization_name" />
        </a-form-item>
  
        <a-form-item label="Department" name="department">
          <a-input v-model:value="form.department" />
        </a-form-item>
  
        <a-form-item label="Position" name="position">
          <a-input v-model:value="form.position" />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, watch, computed } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  
  interface User {
    username: string;
    full_name: string;
    password?: string;
    user_role: string;
    organization_id: string;
    organization_name: string;
    department: string;
    position: string;
  }
  
  const props = defineProps<{
    open: boolean;
    user?: User;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:open', val: boolean): void;
    (e: 'submit', payload: User): void;
  }>();
  
  const visible = computed({
    get: () => props.open,
    set: (val: boolean) => emit('update:open', val),
  });
  
  const isEdit = computed(() => !!props.user);
  
  const form = reactive<User>({
    username: '',
    full_name: '',
    password: '',
    user_role: 'system_admin',
    organization_id: '',
    organization_name: '',
    department: '',
    position: '',
  });
  
  const roleOptions = [
    { label: 'System Admin', value: 'system_admin' },
    { label: 'User', value: 'user' },
    { label: 'Manager', value: 'manager' },
  ];
  
  const formRef = ref<FormInstance>();
  const loading = ref(false);
  
  watch(
    () => props.user,
    (val) => {
      if (val) {
        Object.assign(form, { ...val });
        form.password = ''; // don't pre-fill password
      } else {
        Object.assign(form, {
          username: '',
          full_name: '',
          password: '',
          user_role: 'system_admin',
          organization_id: '',
          organization_name: '',
          department: '',
          position: '',
        });
      }
    },
    { immediate: true }
  );
  
  const rules = {
    username: [{ required: true, message: 'Please enter username' }],
    full_name: [{ required: true, message: 'Please enter full name' }],
    password: [
      {
        required: computed(() => !isEdit.value),
        message: 'Please enter password',
      },
    ],
    user_role: [{ required: true, message: 'Please select user role' }],
  };
  
  const handleOk = async () => {
    try {
      await formRef.value?.validate();
      loading.value = true;
  
      const payload = { ...form };
      if (isEdit.value) delete payload.password;
  
      emit('submit', payload as User);
      loading.value = false;
      visible.value = false;
    } catch (err) {
      message.error('Please fix validation errors.');
    } finally {
      loading.value = false;
    }
  };
  
  const handleCancel = () => {
    visible.value = false;
  };
  </script>
  