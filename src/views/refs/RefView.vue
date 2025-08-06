<template>
    <div>
      <a-page-header title="" />
  
      <a-tabs v-model:activeKey="activeTab" @change="onTabChange" type="card">
        <a-tab-pane
          v-for="tab in tabs"
          :key="tab.key"
          :tab="$t(tab.label)"
        />
      </a-tabs>
  
      <div class="mt-4">
        <router-view />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  
  interface TabItem {
    key: string
    label: string
    path: string
  }
  
  const tabs: TabItem[] = [
    { key: 'regions', label: 'l_Regions', path: 'regions' },
    { key: 'cities', label: 'l_Cities', path: 'cities' },
    { key: 'districts', label: 'l_Districts', path: 'districts' },
    { key: 'addresses', label: 'l_Addressses', path: 'addresses' },
    { key: 'streets', label: 'l_Streets', path: 'streets' },
    { key: 'types', label: 'l_Call_types', path: 'types' },
    { key: 'subtypes', label: 'l_Call_subtypes', path: 'subtypes' },
    { key: 'complaint_status', label: 'l_Statuses', path: 'complaint_status' },
    { key: 'complaint_categories', label: 'l_Categories', path: 'complaint_categories' },
    { key: 'complaint_subcategories', label: 'l_Subcategories', path: 'complaint_subcategories' },
    { key: 'organizations', label: 'l_Organizations', path: 'organizations' },
  ]
  
  const route = useRoute()
const router = useRouter()

const activeTab = ref('')

watch(() => route.path, (newPath) => {
  const tab = tabs.find(t => newPath.endsWith(t.path))
  if (tab) {
    activeTab.value = tab.key
  }
}, { immediate: true })

  function onTabChange(key: string) {
  const selectedTab = tabs.find(tab => tab.key === key)
  if (selectedTab) {
    router.push(`/settings/${selectedTab.path}`)
  }
}

  </script>
  