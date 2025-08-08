<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? $t('l_Edit_user') : $t('l_Add_user')"
    @ok="handleOk"
    :confirm-loading="loading"
    @cancel="handleCancel"
    destroyOnClose
  >
    <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
      <a-form-item :label="$t('l_Username')" name="username" v-if="!isEdit">
        <a-input v-model:value="form.username" />
      </a-form-item>

      <a-form-item :label="$t('l_Full_name')" name="full_name">
        <a-input v-model:value="form.full_name" />
      </a-form-item>

      <a-form-item v-if="!isEdit" :label="$t('l_Password')" name="password">
        <a-input-password v-model:value="form.password" />
      </a-form-item>

      <a-form-item :label="$t('l_User_role')" name="user_role" v-if="!isEdit">
        <a-select v-model:value="form.user_role" :options="roleOptions" />
      </a-form-item>

      <a-form-item :label="$t('l_Organization')" name="organization_id">
        <a-select
          v-model:value="form.organization_id"
          :options="organizationOptions"
          :loading="orgLoading"
          show-search
          :filter-option="false"
          @search="fetchOrganizations"
          placeholder="Select organization"
        />
      </a-form-item>

      <a-form-item :label="$t('l_Department')" name="department">
        <a-input v-model:value="form.department" />
      </a-form-item>

      <a-form-item :label="$t('l_Position')" name="position">
        <a-input v-model:value="form.position" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from "vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import { UserApi } from "../../api/user";
import { toRaw } from "vue";
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
  user_id?: string;
}>();

const emit = defineEmits<{
  (e: "update:open", val: boolean): void;
  (e: "submit", payload: User): void;
}>();

const visible = computed({
  get: () => props.open,
  set: (val: boolean) => emit("update:open", val),
});

const isEdit = computed(() => !!props.user_id);

const form = reactive<User>({
  username: "",
  full_name: "",
  password: "",
  user_role: "system_admin",
  organization_id: "",
  organization_name: "",
  department: "",
  position: "",
});

const roleOptions = [
  { label: "System Admin", value: "system_admin" },
  { label: "Senior Doctor", value: "senior_doctor" },
  { label: "Manager", value: "manager" },
  { label: "Dispatcher", value: "dispatcher" },
  { label: "Employee", value: "employee" },
];
import { getOrganizations } from "../../api/ref"; // путь поправь под свой проект

const organizationOptions = ref<{ label: string; value: string }[]>([]);
const orgLoading = ref(false);

const fetchOrganizations = async (search?: string) => {
  orgLoading.value = true;
  try {
    const res = await getOrganizations({ search });
    organizationOptions.value = res.data.items.map((org) => ({
      label: org.full_name, // поле названия из API
      value: org.id, // поле ID из API
    }));
  } catch (err) {
    message.error("Failed to load organizations");
  } finally {
    orgLoading.value = false;
  }
};

// Загружаем организации сразу при открытии формы
watch(
  () => props.open,
  async (val) => {
    if (val) {
      await fetchOrganizations();
    }
  }
);

const formRef = ref<FormInstance>();
const loading = ref(false);

const fetchUser = async () => {
  if (!props.user_id) return;

  loading.value = true;
  try {
    const res = await UserApi(`${props.user_id}`, {}, "GET");
    const userData = res.data;

    Object.assign(form, {
      username: "", // disable editing username
      full_name: userData.full_name,
      password: "",
      user_role: userData.user_role || "employee",
      organization_id: userData.organization_id,
      organization_name: userData.organization_name,
      department: userData.department,
      position: userData.position,
    });
  } catch (err) {
    message.error("Failed to load user data");
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.open,
  async (val) => {
    if (val && props.user_id) {
      await fetchUser();
    } else if (val) {
      Object.assign(form, {
        username: "",
        full_name: "",
        password: "",
        user_role: "system_admin",
        organization_id: "",
        organization_name: "",
        department: "",
        position: "",
      });
    }
  },
  { immediate: true }
);

const rules = {
  username: [{ required: true, message: "Please enter username" }],
  full_name: [{ required: true, message: "Please enter full name" }],
  password: [
    {
      required: computed(() => !isEdit.value),
      message: "Please enter password",
    },
  ],
  user_role: [{ required: true, message: "Please select user role" }],
};

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    // Fix: use Record<string, any> to make properties deletable
    const payload: Record<string, any> = { ...toRaw(form) };

    if (isEdit.value && props.user_id) {
      delete payload.password;
      delete payload.user_role;
      delete payload.username;
      await UserApi(`${props.user_id}`, payload, "PUT");
      message.success("User updated successfully");
      emit("submit", payload as User);
    } else {
      const res = await UserApi("", payload, "POST");
      message.success("User created successfully");
      emit("submit", res.data);
    }

    visible.value = false;
  } catch (err: any) {
    if (err?.response?.data?.detail) {
      message.error(err.response.data.detail);
    } else {
      message.error("Please fix validation errors or check API.");
    }
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
};
</script>
