<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Вход в аккаунт</h1>
      
      <a-form layout="vertical" @submit.prevent="onLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">Логин</label>
          <a-input 
            v-model:value="info.username" 
            type="text" 
            placeholder="Введите ваш логин"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <div class="password-input-wrapper">
            <a-input
              :type="passwordVisible ? 'text' : 'password'"
              v-model:value="info.password"
              placeholder="Введите ваш пароль"
              class="form-input password-input"
            />
            <button 
              type="button" 
              class="password-toggle"
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

        <button type="submit" class="login-button" @click="onLogin">
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
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 45px 40px;
  width: 100%;
  max-width: 440px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.login-title {
  font-size: 28px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 35px 0;
  text-align: center;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.form-input {
  width: 100%;
  height: 50px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 2px 8px rgba(59, 130, 246, 0.08);
  transform: translateY(-1px);
}

.form-input:hover:not(:focus) {
  border-color: #cbd5e1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.form-input::placeholder {
  color: #9ca3af;
  font-size: 15px;
}

.password-input-wrapper {
  position: relative;
}

.password-input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.password-toggle:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.login-button {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  letter-spacing: -0.01em;
}

.login-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(59, 130, 246, 0.15);
}

.login-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

/* Override Ant Design styles */
:deep(.ant-input) {
  border: 2px solid #e5e7eb !important;
  border-radius: 12px !important;
  height: 50px !important;
  padding: 14px 16px !important;
  font-size: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

:deep(.ant-input:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 2px 8px rgba(59, 130, 246, 0.08) !important;
  transform: translateY(-1px) !important;
}

:deep(.ant-input:hover:not(:focus)) {
  border-color: #cbd5e1 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
}

:deep(.ant-input::placeholder) {
  color: #9ca3af !important;
}

:deep(.ant-form-item) {
  margin-bottom: 0 !important;
}

:deep(.ant-form-item-label) {
  display: none !important;
}
</style>
