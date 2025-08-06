<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          @click="$emit('update:modelValue', false)">
          &times;
        </button>

        <!-- Title -->
        <h2 class="text-lg font-semibold mb-4">
          {{ title }}
        </h2>

        <!-- Slot for modal content -->
        <slot></slot>

        <!-- Buttons -->
        <div class="mt-6 flex justify-end gap-2">
          <button class="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="$emit('cancel')">
            Cancel
          </button>
          <button class="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            :disabled="loading" @click="$emit('confirm')">
            <span v-if="loading" class="animate-spin mr-1">⏳</span>
            <span class="text-white">{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title?: string;
  confirmText?: string;
  loading?: boolean;
}>();

defineEmits(["update:modelValue", "confirm", "cancel"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
