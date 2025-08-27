<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-5">
    <div class="bg-white rounded-[20px] shadow-lg shadow-black/5 border border-white/80 w-full max-w-[440px] px-10 py-14 md:px-8 md:py-12 sm:px-5 sm:py-8">
      <h1 class="text-[28px] md:text-[26px] sm:text-2xl font-medium text-[#1a1a1a] mb-9 md:mb-8 sm:mb-6 text-center leading-[1.3] tracking-[-0.02em]">
        Вход в аккаунт
      </h1>
      
      <a-form layout="vertical" @submit.prevent="onLogin" class="w-full">
        <div class="mb-6 md:mb-[22px] sm:mb-5">
          <label class="block text-base md:text-[15px] sm:text-sm font-medium text-gray-700 mb-[10px] md:mb-2 sm:mb-1.5 tracking-[-0.01em] leading-[1.4]">
            Логин
          </label>
          <a-input 
            v-model:value="info.username" 
            type="text" 
            placeholder="Введите ваш логин"
            class="custom-input"
          />
        </div>

        <div class="mb-6 md:mb-[22px] sm:mb-5">
          <label class="block text-base md:text-[15px] sm:text-sm font-medium text-gray-700 mb-[10px] md:mb-2 sm:mb-1.5 tracking-[-0.01em] leading-[1.4]">
            Пароль
          </label>
          <div class="relative">
            <a-input
              :type="passwordVisible ? 'text' : 'password'"
              v-model:value="info.password"
              placeholder="Введите ваш пароль"
              class="custom-input pr-12 md:pr-11 sm:pr-10"
            />
            <button 
              type="button" 
              class="absolute right-3 md:right-2.5 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:text-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200 ease-out"
              @click="togglePasswordVisibility"
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

        <button 
          type="submit" 
          class="w-full h-[50px] md:h-12 sm:h-[46px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl md:rounded-xl sm:rounded-[10px] text-base md:text-[15px] sm:text-sm font-medium cursor-pointer transition-all duration-300 ease-out shadow-md shadow-blue-500/20 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:-translate-y-px active:shadow-lg active:shadow-blue-500/25 tracking-[-0.01em] mt-2.5 md:mt-2 sm:mt-1.5"
          @click="onLogin"
          style="color: white !important;"
        >
          Войти
        </button>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/index'
import { ApiApi } from '../api/auth'

const router = useRouter()
const userStore = useUserStore()

const info = ref({
  username: '',
  password: ''
})

const passwordVisible = ref(false)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const onLogin = async () => {
  if (!info.value.username || !info.value.password) return

  try {
    const res = await ApiApi('login', info.value, 'POST')

    if (res.data.success === true) {
      // ✅ Save to Pinia
      userStore.setUser(res.data)

      // ✅ Navigate
      router.push('/')
    } else {
      console.error('Login error:', res)
    }
  } catch (error) {
    console.error('API error:', error)
  }
}
</script>

<style scoped>
/* Ant Design input overrides */
:deep(.custom-input.ant-input) {
  width: 100% !important;
  border: 2px solid #e5e7eb !important;
  background: white !important;
  font-size: 16px !important;
  height: 50px !important;
  border-radius: 12px !important;
  padding: 14px 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

:deep(.custom-input.ant-input:hover:not(:focus)) {
  border-color: #cbd5e1 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
}

:deep(.custom-input.ant-input:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 2px 8px rgba(59, 130, 246, 0.08) !important;
  transform: translateY(-1px) !important;
}

:deep(.custom-input.ant-input::placeholder) {
  color: #9ca3af !important;
  font-size: 15px !important;
}

:deep(.pr-12.ant-input) {
  padding-right: 48px !important;
}

:deep(.ant-form-item) {
  margin-bottom: 0 !important;
}

:deep(.ant-form-item-label) {
  display: none !important;
}

/* Responsive overrides */
@media (max-width: 768px) {
  :deep(.custom-input.ant-input) {
    height: 48px !important;
    padding: 12px 14px !important;
    font-size: 15px !important;
  }
  
  :deep(.pr-11.ant-input) {
    padding-right: 44px !important;
  }
  
  :deep(.custom-input.ant-input::placeholder) {
    font-size: 14px !important;
  }
}

@media (max-width: 480px) {
  :deep(.custom-input.ant-input) {
    height: 46px !important;
    padding: 10px 12px !important;
    font-size: 14px !important;
    border-radius: 10px !important;
  }
  
  :deep(.pr-10.ant-input) {
    padding-right: 40px !important;
  }
  
  :deep(.custom-input.ant-input::placeholder) {
    font-size: 13px !important;
  }
}
</style>
