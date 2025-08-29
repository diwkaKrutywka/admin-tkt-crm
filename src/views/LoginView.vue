<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

    <div class="min-h-screen flex">
      
      
      <div class="flex-[1.6] flex items-center justify-center p-8 lg:p-16">
        <div class="w-full max-w-xl space-y-10">

          <div class="text-center">
            <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <h1 class="text-5xl font-bold text-gray-900 mb-4">
              Вход в систему
            </h1>
            
          </div>


          <div class="bg-white rounded-2xl shadow-2xl shadow-blue-500/15 p-12 border border-blue-100/50">
            <form @submit.prevent="onLogin" class="space-y-8">

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-4">
                  Логин
                </label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <a-input 
                    ref="usernameInput"
                    v-model:value="info.username" 
                    type="text" 
                    placeholder="Введите ваш логин"
                    class="custom-input pl-10"
                    :disabled="isLoading"
                    @keypress.enter="onLogin"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-4">
                  Пароль
                </label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <a-input
                    :type="passwordVisible ? 'text' : 'password'"
                    v-model:value="info.password"
                    placeholder="Введите ваш пароль"
                    class="custom-input pl-10 pr-12"
                    :disabled="isLoading"
                    @keypress.enter="onLogin"
                  />
                  <button 
                    type="button" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    @click="togglePasswordVisibility"
                    :disabled="isLoading"
                  >
                    <svg v-if="passwordVisible" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>

              
              <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="text-red-700 text-sm font-medium">{{ errorMessage }}</p>
                </div>
              </div>

              <button 
                type="submit" 
                class="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative"
                :disabled="isLoading || !info.username || !info.password"
                style="color: white !important;"
              >
                <span v-if="!isLoading">
                  Войти
                </span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вход...
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="hidden lg:flex flex-1 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-white/30 backdrop-blur-[0.5px]"></div>

        <div class="absolute inset-0 opacity-5">
          <svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#3b82f6" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        
        <div class="relative z-10 w-full h-full flex items-center justify-center">
                     <img 
             :src="signInIllustration" 
             alt="Medical Management System" 
             class="max-w-[95%] max-h-[95%] object-contain drop-shadow-lg opacity-90 rounded-2xl"
           />
        </div>
      </div>

      
      <div class="lg:hidden absolute top-4 right-4 w-16 h-16 opacity-20">
        <img 
          :src="signInIllustration" 
          alt="Medical System" 
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/index'
import { ApiApi } from '../api/auth'
import signInIllustration from '../assets/image/sign-in-illustration.png'

const router = useRouter()
const userStore = useUserStore()

const info = ref({
  username: '',
  password: ''
})

const passwordVisible = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const usernameInput = ref()

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const onLogin = async () => {
  if (!info.value.username || !info.value.password) {
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await ApiApi('login', info.value, 'POST')

    if (res.data.success === true) {
      // ✅ Save to Pinia
      userStore.setUser(res.data)

      // ✅ Navigate
      router.push('/')
    } else {
      errorMessage.value = 'Неверный логин или пароль'
    }
  } catch (error) {
    console.error('API error:', error)
    errorMessage.value = 'Ошибка подключения к серверу'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await nextTick()
  if (usernameInput.value) {
    usernameInput.value.focus()
  }
})
</script>

<style scoped>
/* Modern input styling */
:deep(.custom-input.ant-input) {
  width: 100% !important;
  border: 2px solid #e2e8f0 !important;
  background: #fafafa !important;
  font-size: 16px !important;
  height: 48px !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  font-weight: 500 !important;
}

:deep(.custom-input.ant-input:hover:not(:focus)) {
  border-color: #cbd5e1 !important;
  background: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-1px) !important;
}

:deep(.custom-input.ant-input:focus) {
  border-color: #3b82f6 !important;
  background: white !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(59, 130, 246, 0.15) !important;
  transform: translateY(-1px) !important;
}

:deep(.custom-input.ant-input:disabled) {
  background: #f1f5f9 !important;
  border-color: #e2e8f0 !important;
  cursor: not-allowed !important;
  opacity: 0.7 !important;
  transform: none !important;
}

:deep(.custom-input.ant-input::placeholder) {
  color: #94a3b8 !important;
  font-size: 15px !important;
  font-weight: 400 !important;
}

:deep(.pr-12.ant-input) {
  padding-right: 48px !important;
}

:deep(.pl-10.ant-input) {
  padding-left: 40px !important;
}

:deep(.pl-12.ant-input) {
  padding-left: 48px !important;
}

/* Ensure icons are visible above input background */
.relative svg {
  pointer-events: none;
}

:deep(.ant-form-item) {
  margin-bottom: 0 !important;
}

:deep(.ant-form-item-label) {
  display: none !important;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  
  .min-h-screen.flex {
    flex-direction: column !important;
  }
  
  .flex-1:first-child {
    min-height: 100vh;
  }
}

@media (max-width: 768px) {
  :deep(.custom-input.ant-input) {
    height: 46px !important;
    padding: 11px 14px !important;
    font-size: 15px !important;
  }
  
  :deep(.custom-input.ant-input::placeholder) {
    font-size: 14px !important;
  }
}

@media (max-width: 480px) {
  :deep(.custom-input.ant-input) {
    height: 44px !important;
    padding: 10px 12px !important;
    font-size: 14px !important;
    border-radius: 10px !important;
  }
  
  :deep(.custom-input.ant-input::placeholder) {
    font-size: 13px !important;
  }
}


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.max-w-lg img {
  animation: fadeInUp 0.8s ease-out;
}


.bg-gradient-to-r {
  position: relative;
  overflow: hidden;
}

.bg-gradient-to-r::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.bg-gradient-to-r:hover::before {
  left: 100%;
}
</style>

