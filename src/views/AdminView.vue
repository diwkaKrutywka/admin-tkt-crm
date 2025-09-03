<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Sidebar -->
    <div v-if="!isDrawerOpen" class="h-full">
      <div class="h-full hidden md:block">
        <div class="h-full flex flex-col bg-[#f5f6f7] text-gray-200 w-[220px] overflow-hidden relative">
          <div class="flex items-center justify-center pt-4 pb-4 border-b px-3">
            <heartPulse />
            <p class="font-manrope text-sm text-black font-bold ml-3 my-auto">Almaty Digital <br> Medical
              Center</p>
          </div>
          <div class="flex-1 overflow-y-auto">
            <MenuBox></MenuBox>

          </div>
        </div>
      </div>
    </div>
    <!-- Main content -->
    <div class="flex-1 flex flex-col h-screen overflow-x-auto">
      <TopBox @toggle-drawer="isDrawerOpen = !isDrawerOpen" />
      <div class="p-3 flex-1 overflow-y-auto">
        <div class="bg-gray-100 rounded-xl px-10 py-5 h-full w-full">
          <router-view />
        </div>
      </div>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import MenuBox from '../components/menu-bar.vue'
import TopBox from '../components/top-box.vue'
import { closeWebSocket } from '../services/ws'


// Drawer
const isDrawerOpen = ref(false)



// onMounted(() => {
//   const clientId = userStore.user?.agent_id || 'test-client-1'
//  // console.log(userStore.user?.agent_id)
//   if (clientId) {
//     initWebSocket(clientId, (message) => {
//       console.log(message)
//       if(message.type === 'appeal_created'){
//       notificationStore.addMessage(message)
//       }
//     })
//   }
// })

onBeforeUnmount(() => {
  closeWebSocket()
})
</script>
