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
  
  const activeTab = ref(route.params.tab || tabs[0].key)
  
  watch(() => route.params.tab, (newTab) => {
    activeTab.value = newTab as string
  })
  
  function onTabChange(key: string) {
    router.push({ name: 'RefViewChild', params: { tab: key } })
  }
  </script>
  