<template>
    <div>
        <input type="text" v-model="searchQuery" placeholder="Search..." class="w-full p-2 border rounded mb-4" />
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps<{
    searchQuery: string;
}>();
const emit = defineEmits<{
    (e: 'update:searchQuery', value: string): void;
}>();
const updateSearchQuery = (value: string) => {
    emit('update:searchQuery', value);
};
const searchQuery = ref(props.searchQuery);
watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});
// const debounce = (func: Function, delay: number) => {
//     let timeout: ReturnType<typeof setTimeout>;
//     return (...args: any[]) => {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func(...args), delay);
//     };
// };
// const debouncedUpdate = debounce((value: string) => {
//     updateSearchQuery(value);
// }, 300);
</script>