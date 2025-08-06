<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <navigationBar @selectedTab="getData" />

            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <button
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    @click="openModal">
                    <!-- <PlusIcon class="w-4 h-4" /> -->
                    <span class="text-white">Добавить</span>
                </button>
                <BaseModal v-model="isModalOpen" title="Add New Call Type" confirmText="Create" :loading="isSubmitting"
                    @confirm="submitData" @cancel="closeModal">
                    <form>
                        <div v-for="(value, key) in activeTabFields" :key="key" class="mb-4  ">
                            <div class="flex">

                                <label :for="key" class="block text-sm font-medium text-gray-700 mr-2">
                                    {{ $t(`l_${String(key)}`) }}
                                </label>


                                <input v-if="typeof value === 'boolean'" v-model="activeTabFields[key]" :id="key"
                                    type="checkbox"
                                    class="h-5 w-5 text-blue-600 accent-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <label class="inline-flex items-center space-x-2 cursor-pointer">

                                </label>
                            </div>

                            <input v-if="typeof value === 'string' || typeof value === 'number'"
                                v-model="activeTabFields[key]" :id="key" type="text"
                                class="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                </div>
                    </form>
                    <!-- <form @submit.prevent="submitData" class="space-y-4">
                        <div>
                            <label class="block font-medium">
                                Name <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.name" class="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                placeholder="Enter name" required />
                        </div>

                        <div>
                            <label class="block font-medium">
                                Code <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.code" class="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                placeholder="Enter code (e.g., TECH-01)" required />
                        </div>

                        <div>
                            <label class="block font-medium">Description</label>
                            <textarea v-model="form.description"
                                class="w-full border border-gray-300 rounded px-3 py-2 mt-1" rows="3"
                                placeholder="Enter description"></textarea>
                        </div>

                        <div>
                            <label class="block font-medium">Display Order</label>
                            <input v-model.number="form.displayOrder" type="number"
                                class="w-full border border-gray-300 rounded px-3 py-2 mt-1" min="0" />
                        </div>
                    </form> -->
                </BaseModal>
            </div>
            <a-table bordered :dataSource="refTable" :columns="columns" rowKey="id">
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'Action'">
                        <a-space>
                            <span style="color: black; font-size: 21px" class="icon material-symbols-outlined "
                                @click="onEdit(record)">
                                edit
                            </span>
                            <a-popconfirm placement="leftBottom" title="Сіз расымен қолданушыны өшіргіңіз келеді ме?"
                                :ok-text="$t('l_Yes')" :cancel-text="$t('l_No')" @confirm="onDelete(record)">
                                <span style="color: red; font-size: 21px" class="icon material-symbols-outlined">
                                    delete
                                </span>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, h, ref, computed, reactive } from 'vue'
import navigationBar from '../components/references/navigationBar.vue';
import i18n from "../locales"
import { Tag } from "ant-design-vue";
import { referencesApi } from '../api/refrences.ts'
import BaseModal from '../common/BaseModal.vue'
import { useReferencesStore } from '../store/references.ts'
// POST объекты
import { callTypePost as callTypePostDefaultValues } from '../interfaces/references/refForms.ts'
import { callSubtypePost as callSubtypePostDefaultValues } from '../interfaces/references/refForms.ts'
import { complaintStatusPost as complaintStatusPostDefaultValues } from '../interfaces/references/refForms.ts'
import { complaintCategoryPost as complaintCategoryPostDefaultValues } from '../interfaces/references/refForms.ts'
import { complaintSubcategoryPost as complaintSubcategoryPostDefaultValues } from '../interfaces/references/refForms.ts'
import { organizationsPost as organizationsPostDefaultValues } from '../interfaces/references/refForms.ts'
// PUT объекты
import { callTypePut as callTypePutDefaultValues } from '../interfaces/references/refForms.ts'
import { callSubtypePut as callSubtypePuttDefaultValues } from '../interfaces/references/refForms.ts'
import { complaintStatusPut as complaintStatusPutDefaultValues } from '../interfaces/references/refForms.ts'
import { complaintCategoryPut as complaintCategoryPutDefaultValues } from '../interfaces/references/refForms.ts'
import { complaintSubcategoryPut as complaintSubcategoryPutDefaultValues } from '../interfaces/references/refForms.ts'
import { organizationsPut as organizationsPutDefaultValues } from '../interfaces/references/refForms.ts'

// import type { TableRenderProps } from "../types/table.ts";
interface currentModal {
    create: string;
    edit: string;
    delete: string;
}

const store = useReferencesStore();
const $t = i18n.global.t

const selectedItemId = ref<string | number>(''); // для редактирования и удаления
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const currentTab = ref($t(`${"l_Call_types"}`));
const currentModal = ref(('') as keyof currentModal);

// ниже представлены объекты по образу интерфейсов, для дальнешей отрисовки их полей в форме
// POST поля
const callTypePostFields = reactive({ ...callTypePostDefaultValues })
const callSubtypePostFields = reactive({ ...callSubtypePostDefaultValues })
const complaintStatusPostFields = reactive({ ...complaintStatusPostDefaultValues })
const complaintCategoryPostFields = reactive({ ...complaintCategoryPostDefaultValues })
const complaintSubcategoryPostFields = reactive({ ...complaintSubcategoryPostDefaultValues })
const organizationsPostFields = reactive({ ...organizationsPostDefaultValues })
// PUt поля
const callTypePutFields = reactive({ ...callTypePutDefaultValues })
const callSubtypePutFields = reactive({ ...callSubtypePuttDefaultValues })
const complaintStatusPutFields = reactive({ ...complaintStatusPutDefaultValues })
const complaintCategoryPutFields = reactive({ ...complaintCategoryPutDefaultValues })
const complaintSubcategoryPutFields = reactive({ ...complaintSubcategoryPutDefaultValues })
const organizationsPutFields = reactive({ ...organizationsPutDefaultValues })

// Возвращает поля в зависимости от текущей вкладки 
// и выбранного способоа заполнения формы
const activeTabFields = computed(() => {
    if (currentModal.value === 'create') {

        return currentTabRequest.value === 'call-types/' ? callTypePostFields
            : currentTabRequest.value === 'call-subtypes/' ? callSubtypePostFields
                : currentTabRequest.value === 'complaint-statuses/' ? complaintStatusPostFields
                    : currentTabRequest.value === 'complaint-categories/' ? complaintCategoryPostFields
                        : currentTabRequest.value === 'complaint-subcategories/' ? complaintSubcategoryPostFields
                            : currentTabRequest.value === 'organizations/' ? organizationsPostFields
                                : {};
    }

    return currentTabRequest.value === 'call-types/' ? callTypePutFields
        : currentTabRequest.value === 'call-subtypes/' ? callSubtypePutFields
            : currentTabRequest.value === 'complaint-statuses/' ? complaintStatusPutFields
                : currentTabRequest.value === 'complaint-categories/' ? complaintCategoryPutFields
                    : currentTabRequest.value === 'complaint-subcategories/' ? complaintSubcategoryPutFields
                        : currentTabRequest.value === 'organizations/' ? organizationsPutFields
                            : {};
})

// Возвращает таблицу в зависимости от текущей вкладки
const refTable = computed(() => {
    return currentTabRequest.value === 'call-types/' ? store.callTypes
        : currentTabRequest.value === 'call-subtypes/' ? store.callSubtypes
            : currentTabRequest.value === 'complaint-statuses/' ? store.complaintStatuses
                : currentTabRequest.value === 'complaint-categories/' ? store.complaintCategories
                    : currentTabRequest.value === 'complaint-subcategories/' ? store.complaintSubcategories
                        : currentTabRequest.value === 'organizations/' ? store.organizations
                            : {};

})

// В зависмости от текущей вкладки, определяем, какой запрос отправлять
const currentTabRequest = computed(() => {
    return currentTab.value === $t(`${"l_Call_types"}`) ?
        'call-types/' : currentTab.value === $t(`${"l_Call_subtypes"}`) ?
            'call-subtypes/' : currentTab.value === $t(`${"l_Complaint_statuses"}`) ?
                'complaint-statuses/' : currentTab.value === $t(`${"l_Complaint_category"}`) ?
                    'complaint-categories/' : currentTab.value === $t(`${"l_Complaint_subcategory"}`) ?
                        'complaint-subcategories/' : currentTab.value === $t(`${"l_Organizations"}`) ?
                            'organizations/' : '';
});



function onEdit(record: any) {
    selectedItemId.value = record.id;

    //  currentTabRequest.value === 'call-types/' ? record.call_type_id
    //         : currentTabRequest.value === 'call-subtypes/' ? record.call_subtype_id
    //             : currentTabRequest.value === 'complaint-categories/' ? record.complaint_category_id
    //                 : currentTabRequest.value === 'complaint-subcategories/' ? record.complaint_subcategory_id
    //                     : currentTabRequest.value === 'complaint-statuses/' ? record.complaint_status_id
    //                         :
    isModalOpen.value = true;
    currentModal.value = 'edit';
}

async function onDelete(record: any) {

    selectedItemId.value = record.id;

    currentModal.value = 'delete';
    await submitData()
    getData(currentTab.value);

}

const openModal = () => {
    isModalOpen.value = true;
    currentModal.value = 'create';
};
const closeModal = () => {
    isModalOpen.value = false;
    selectedItemId.value = '';
};
const submitData = async () => {
    console.log(JSON.parse(JSON.stringify(activeTabFields.value)));

    isSubmitting.value = true;
    try {
        const { data } = await referencesApi(
            selectedItemId.value ? currentTabRequest.value + selectedItemId.value : currentTabRequest.value,
            JSON.parse(JSON.stringify(activeTabFields.value)),
            currentModal.value === 'create' ? 'POST' : currentModal.value === 'edit' ? 'PUT' : 'DELETE'
        );

        isModalOpen.value = false;
    } catch (error) {
        console.error(error);
    } finally {
        isSubmitting.value = false;
    }


};
const getData = async (tab: string) => {
    currentTab.value = tab;
    try {
        const { data } = await referencesApi(
            currentTabRequest.value,
            {},
            "GET"
        );
        currentTabRequest.value === 'call-types/' ? store.setCallTypes(data.items)
            : currentTabRequest.value === 'call-subtypes/' ? store.setCallSubtypes(data.items)
                : currentTabRequest.value === 'complaint-statuses/' ? store.setComplaintStatuses(data.items)
                    : currentTabRequest.value === 'complaint-categories/' ? store.setComplaintCategories(data.items)
                        : currentTabRequest.value === 'complaint-subcategories/' ? store.setComplaintSubcategories(data.items)
                            : currentTabRequest.value === 'organizations/' ? store.setOrganizations(data.items)
                                : {};

    } catch (error) {
        console.error(error);
    }
}
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '10%',
    },
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: '20%',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
    },
    {
        title: 'Created at',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '30%',
    },
    {
        title: 'Updated at',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: '50%',
    },
    {
        title: 'Is_complaint',
        dataIndex: 'is_complaint',
        key: 'is_complaint',
        customRender: () => {
            return Text
                ? h(Tag, { color: "green" }, () => "Да")
                : h(Tag, { color: "red" }, () => "Нет");
        },
        width: '2%',
    },
    {
        title: 'is_active',
        dataIndex: 'is_active',
        key: 'is_active',
        customRender: () => {
            return Text
                ? h(Tag, { color: "green" }, () => "Активен")
                : h(Tag, { color: "red" }, () => "Неактивен");
        },
        width: '2%',
    },
    {
        title: "Действия",
        key: "Action",
        width: 110,
        align: "center",
    },
];
onMounted(() => {
    getData(currentTab.value);
})
</script>