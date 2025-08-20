<template>
    <a-modal :open="true" :title="isEdit ? 'Update Appeal' : 'Add Contact'" @ok="handleOk" :confirm-loading="loading"
        @cancel="handleCancel" destroyOnClose>
        <a-form :model="form" ref="formRef" layout="vertical">
            <a-form-item label="Reason" name="reason">
                <a-textarea v-model:value="form.reason" />
            </a-form-item>
            <a-form-item label="Call Type" name="call_type_id">
                <a-select v-model:value="form.call_type_id" :options="callTypeOptions" placeholder="Выберите тип звонка"
                    :loading="callTypeLoading" show-search option-filter-prop="label" />
            </a-form-item>

            <a-form-item label="Full Name" name="full_name">
                <a-input v-model:value="form.full_name" />
            </a-form-item>
            <a-form-item label="Phone Number" name="phone_number">
                <a-input v-model:value="form.phone_number" />
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
import { ref, reactive, computed, onMounted } from "vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { AppealApi } from "../../api/appeal";
import { toRaw } from "vue";
import { useNotificationStore } from "../../store/index";
import { useRoute } from "vue-router";
import { useUserStore } from '../../store/index'

const userStore = useUserStore()

const route = reactive(useRoute())
const notificationStore = useNotificationStore();


const props = defineProps<{
    open: true;
    id?: string;
}>();

const isEdit = computed(() => !!props.id);
import { getAppealBpGiid } from "../../api/brightPattern"; // твой путь к API

const callTypeOptions = ref<{ label: string; value: string }[]>([]);
const callTypeLoading = ref(false);


const form = reactive({
    reason: "",
    full_name: "",
    birth_date: '',
    iin: "",
    gender: "not_specified",
    call_type_id: "",
    home_address: "",
    phone_number: ""
});

const genderOptions = [
    { label: "Мужчина", value: "male" },
    { label: "Женщина", value: "female" },
    { label: "Не указано", value: "not_specified" },
];

const formRef = ref<FormInstance>();
const loading = ref(false);

const handleOk = async () => {
    try {
        await formRef.value?.validate();
        loading.value = true;

        const payload = { ...toRaw(form) };

        if (payload.birth_date) {
            payload.birth_date = dayjs(payload.birth_date).format("YYYY-MM-DD");
        }


        await AppealApi(`${props.id}`, payload, "PUT");
        message.success("Contact updated successfully");

        // notificationStore.removeMessageByAppealId(props.id);


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

};
onMounted(async () => {


    if (!userStore.accessToken) {
        userStore.getUserInfo()
    }

    try {
        const res = await getAppealBpGiid({
            bp_giid: route.query.bp_giid as string
        });
    } catch (err) {
        message.error("Не удалось загрузить Call Types");
    } finally {
        callTypeLoading.value = false;
    }

})
</script>
