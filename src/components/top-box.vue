<template>
  <div
    class="relative flex shadow gap-1 h-20 pr-3 pl-3 justify-between items-center"
  >
    <!-- Left section -->
    <div class="flex items-center gap-1">
      <div
        class="bg-transparent flex items-center border border-blue-100 rounded-md"
        @click="$emit('toggle-drawer')"
      >
        <span
          class="text-xl material-symbols-outlined text-blue-400 bg-blue-100"
          >menu</span
        >
      </div>
      <div class="flex items-center gap-1 h-full ml-4">
        <div class="flex flex-col">
          <span class="font-bold text-2xl">{{ $t('l_Ticket_system') }}</span>
        </div>
      </div>
    </div>

    <!-- Right section -->
    <div class="flex items-center gap-4 z-10">
      <ChangeLanguageBox class="flex items-center" />
      <div class="relative" ref="dropdownRef">
        <div class="flex items-center gap-2 cursor-pointer" @click="toggleUserDropdown">
  <span class="text-xl material-symbols-outlined">person</span>
  <span class="font-medium">{{ userStore.user?.full_name }}</span>
</div>

        <div
          v-show="isUserDropdownOpen"
          class="absolute right-0 mt-2 w-72 bg-white text-gray-900 rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
        >
          <div
            class="flex flex-col items-center p-6 pb-4 bg-gradient-to-b from-blue-50 to-white"
          >
            <div
              class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2"
            >
              <span class="material-symbols-outlined text-4xl text-blue-500"
                >person</span
              >
            </div>
            <div class="font-bold text-lg mb-1">
              {{userStore.user?.full_name || "User" }}
            </div>
            <div
              class="text-sm text-gray-500 mb-2"
              v-if="userStore.user?.email"
            >
              {{ userStore.user?.email }}
            </div>
            <div class="flex flex-col gap-1 w-full">
              <template v-for="(value, key) in userInfo.user.value" :key="key">
                <div
                  v-if="
                    key !== 'username' && key !== 'email' && key !== 'avatar'
                  "
                >
                  <span
                    class="text-xs text-gray-400 uppercase tracking-wider"
                    >{{ key }}</span
                  >
                  <span class="text-sm text-gray-700">{{ value }}</span>
                </div>
              </template>
            </div>
          </div>
          <div
            class="px-6 pb-4 pt-2 text-red cursor-pointer"
            @click="onSignOut"
          >
            <span class="material-symbols-outlined">logout</span>
            Sign Out
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import ChangeLanguageBox from "./change-language-box.vue";
import MenuBox from "./menu-bar.vue";
import { useUserStore } from "../store/index";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();

const emit = defineEmits(["toggle-drawer"]);
const userStore = useUserStore();
const userInfo = storeToRefs(userStore);
const hasLogin = computed(() => !!userStore.user?.full_name);
const isUserDropdownOpen = ref(false);
const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};
const onSignOut = () => {
  //userStore.signOut();
  isUserDropdownOpen.value = false;
};
const dropdownRef = ref<HTMLElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isUserDropdownOpen.value = false;
  }
};
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
