<template>
    <div class="flex flex-col mt-3 mb-3 gap-2 text-sm">
      <div v-for="(menu, index) in menuList" :key="index">
        <div
          class="flex items-start gap-1 p-2 cursor-pointer mx-1 rounded overflow-hidden"
          :class="menu.routerPath === menuPath ? 'bg-blue-100 text-blue-400 font-semibold' : 'text-gray-400 font-medium'"
          @click="() => {
            if (menu.children.length > 0) {
              toggleMenu(menu.routerPath)
            } else {
              onClickMenu(menu.routerPath)
            }
          }"
        >
          <div class="text-xl material-symbols-outlined">{{ menu.icon }}</div>
          <div class="text-ellipsis whitespace-nowrap overflow-hidden">{{ menu.name }}</div>
          <div
            v-if="menu.children.length > 0"
            class="material-symbols-outlined cursor-pointer text-xl transition-transform"
            :class="openPathList.includes(menu.routerPath) ? 'rotate-90' : ''"
          >
            chevron_right
          </div>
        </div>
  
        <div
          v-if="openPathList.includes(menu.routerPath) && menu.children.length > 0"
          class="border-l ml-4 border-gray-600"
        >
          <div
            v-for="(child, childIndex) in menu.children"
            :key="childIndex"
            class="p-2 mx-2 flex gap-2 items-center cursor-pointer rounded overflow-hidden"
            :class="child.routerPath === menuPath ? 'bg-blue-500 text-white' : ''"
            @click="() => onClickMenu(child.routerPath)"
          >
            <div class="text-ellipsis whitespace-nowrap overflow-hidden">{{ child.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getMenuList } from '../common/menu-list'
import type { MenuItem } from '../common/menu-list'

  const router = useRouter()
  const route = useRoute()

  const expandAll = ref(false)
  const openPathList = ref<string[]>([])
  const menuList = ref<MenuItem[]>([])
  
  // Получаем путь текущего маршрута
  const menuPath = computed(() => route.path)
  
  // Получаем список всех путей с вложенными дочерними пунктами
  const ExpandMenuIdList = computed(() =>
    menuList.value
      .filter((item) => item.children.length > 0)
      .map((item) => item.routerPath)
  )
  
  function onSetExpand() {
    expandAll.value = !expandAll.value
    openPathList.value = expandAll.value ? [...ExpandMenuIdList.value] : []
  }
  
  function toggleMenu(path: string) {
    const index = openPathList.value.indexOf(path)
    if (index !== -1) {
      openPathList.value.splice(index, 1)
    } else {
      openPathList.value.push(path)
    }
  }
  
  function onClickMenu(path: string) {
    router.push(path)
  }
  
  onMounted(() => {
    const rawMenu = getMenuList()
    menuList.value = rawMenu
  })
  </script>
  