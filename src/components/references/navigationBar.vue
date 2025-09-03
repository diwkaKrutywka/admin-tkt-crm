<template>
    <div class="mb-6">
        <div class="border-b border-gray-300 dark:border-gray-700 ">
            <nav class="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
                <button v-for="(tab, index) in getMenuList" :key="index" @click="setActiveTab(tab.title, index)" :class="[
                    'relative inline-flex items-center whitespace-nowrap px-4 py-2 text-sm font-semibold transition-colors duration-300 ease-in-out cursor-pointer',
                    activeTab === index
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-blue-500 border-b-2 border-transparent hover:border-gray-300'
                ]">
                    <span>
                        {{ tab.title }}
                    </span>
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useReferencesStore } from '../../store/references.ts'
import i18n from "../../locales"

const $t = i18n.global.t
const emit = defineEmits<{
    (e: 'selectedTab', payload: string): void
}>()
const store = useReferencesStore();
const activeTab = ref(0)

const setActiveTab = (tab: string, index: number) => {
    activeTab.value = index
    emit('selectedTab', tab)
}

interface tabItem {
    title: string
    amount: number
}


const getMenuList = computed((): tabItem[] => {
    return [
        {
            title: $t("l_Call_types"),
            amount: store.callTypes.length,
        },
        {
            title: $t("l_Call_subtypes"),
            amount: store.callSubtypes.length,
        },
        {
            title: $t("l_Complaint_statuses"),
            amount: store.complaintStatuses.length,
        },
        {
            title: $t("l_Complaint_category"),
            amount: store.complaintCategories.length,
        },
        {
            title: $t("l_Complaint_subcategory"),
            amount: store.complaintSubcategories.length,
        },
        {
            title: $t("l_Organizations"),
            amount: store.organizations.length,
        },
    ]
})


</script>