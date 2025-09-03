<!-- UserManagement.vue -->
<template>
    <div>

        <!-- Статистика -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BaseCard v-for="stat in stats" :key="stat.title" :title="stat.title">
                <template #content>
                    <div class="text-2xl font-bold text-gray-900">{{ stat.value(props) }}</div>
                </template>
            </BaseCard>
        </div>

        <!-- Поиск -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Поиск пользователей</h2>
            <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="searchQuery" type="text" placeholder="Поиск по имени, email или организации..."
                    class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    @input="handleSearch" />
            </div>
        </div>

        <!-- Пользователи -->

        <a-table class="users-table" :loading="loading" :bordered="true" :dataSource="tableData" :columns="columns"
            :pagination="{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                showTotal: (total: number) => `Всего ${total} записей`,
                onChange: onPageChange

            }">
            <template #bodyCell="{ column, index }">
                <template v-if="column.key === 'Action'">
                    <a-space>
                        <span style="color: black; font-size: 21px"
                            class="icon material-symbols-outlined cursor-pointer" @click="handleEdit(index)"> edit
                        </span>
                        <a-popconfirm placement="leftBottom" title="Сіз расымен қолданушыны тоқтатқыңыз келеді ме?"
                            :ok-text="$t('l_Yes')" :cancel-text="$t('l_No')" @confirm="onRecover(index)">
                            <span style="color: rgb(0, 100, 250); font-size: 21px"
                                class="icon material-symbols-outlined cursor-pointer"> cancel </span>
                        </a-popconfirm>
                        <a-popconfirm placement="leftBottom" title="Сіз расымен қолданушыны өшіргіңіз келеді ме?"
                            :ok-text="$t('l_Yes')" :cancel-text="$t('l_No')" @confirm="onRecover(index)">
                            <span style="color: red; font-size: 21px"
                                class="icon material-symbols-outlined cursor-pointer"> delete
                            </span>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>


    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import BaseCard from '../../common/BaseCard.vue'
import { useUserStore } from '../../store/index';
import { h } from 'vue';
import { Avatar, Tag } from "ant-design-vue";
import { SafetyOutlined, BankOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router";
// import { UserApi } from '../../api/users';




const userStore = useUserStore();
const tableData = computed(() => userStore.userViews);
const router = useRouter()
const loading = ref(false);
const onRecover = (userId: string) => {
    console.log('Восстановить пользователя с ID:', userId);

    // Логика восстановления по ID пользователя
};

// Пагинация
const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = computed(() => userStore.pagination.total);

const searchQuery = ref('')

const stats = [
    { title: 'Всего пользователей', value: (props: any) => props.usersList.length },
    { title: 'Активные', value: (props: any) => props.activeUsers.length },
    { title: 'Неактивные', value: (props: any) => props.inactiveUsers.length },
    { title: 'Организаций', value: (props: any) => props.organizations.length },
];

const columns = [

    {
        title: 'Пользователь',
        dataIndex: 'fullName',
        customRender: ({ text }: { text: string }) => {
            const initials = text
                .split(' ')
                .map((word) => word[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

            return h('div', { class: 'flex items-center gap-2' }, [
                h(Avatar, {
                    style: {
                        backgroundColor: '#E5EDFF',
                        color: '#2B4EFF',
                        fontWeight: '600',
                    },
                }, () => initials),
                h('span', text),
            ]);
        },
    },
    {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        customRender: ({ text }: { text: string }) => {
            return h(
                'div',
                { class: 'inline-flex items-center px-3 py-1 rounded-full border border-gray-300 text-gray-800 text-sm gap-2' },
                [
                    h(SafetyOutlined),
                    h('span', text),
                ]
            );
        },
    },
    {
        title: 'Организация',
        dataIndex: 'organization',
        key: 'organization',
        customRender: ({ text }: { text: string }) => {
            return h('div', { class: 'flex items-center gap-2 text-gray-800' }, [
                h(BankOutlined),
                h('span', text),
            ]);
        },
    },
    {
        title: 'Статус',
        dataIndex: 'isActive',
        key: 'isActive',
        customRender: ({ text }: { text: string }) => {
            return text
                ? h(Tag, { color: 'green' }, () => 'Активен')
                : h(Tag, { color: 'red' }, () => 'Неактивен');
        },
    }
    ,
    {
        title: 'Последний вход',
        dataIndex: 'lastLogin',
        key: 'lastLogin',
        customRender: ({ text }: { text: string }) => {
            if (!text) return '-';

            const date = new Date(text);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы с 0
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        }
    },
    {
        title: 'Действия',
        key: 'Action',
        width: 120,

    }
];
const props = defineProps({

    usersList: {
        type: Array,
        default: [],
    },
    activeUsers: {
        type: Array,
        default: [],
    },
    inactiveUsers: {
        type: Array,
        default: [],
    },
    organizations: {
        type: Array,
        default: [],
    },
})


const emit = defineEmits(['openEditModal'])

const handleSearch = async () => {
    try {
        // const res = await UserApi(`?search=${searchQuery.value}`, undefined, 'GET');
        // userStore.setUsersList(res);

    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}
async function onPageChange(page: number, size: number) {
    loading.value = true; // Включаем лоадер

    currentPage.value = page;
    pageSize.value = size;

    router.push({ query: { page: page } })
    try {

        // const res = await users(`?page=${page}&page_size=5`, null, 'GET');
        // userStore.setUsersList(res);

    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
    finally {
        loading.value = false; // Выключаем лоадер в любом случае
    }
}



// Добавьте функции-обработчики
function handleEdit(record: any) {

    emit('openEditModal', record)

    // Ваша логика редактирования
}

// function handleDeactivate(record: any) {
//     console.log('Деактивировать:', record);
//     // Ваша логика деактивации
// }

// function handleDelete(record: any) {
//     console.log('Удалить:', record);
//     // Ваша логика удаления
// }


</script>
<style>
.users-table .ant-table-pagination {
    margin-top: 50px !important;
}
</style>