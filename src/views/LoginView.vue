<template>
  <div class="h-screen w-full flex overflow-hidden relative bg-gray-100">
    <ChangeLanguageBox
      class="absolute rounded  opacity-80 right-3 top-3 text-white w-10 h-6 flex justify-center items-center " />
    <div class="w-full flex h-full">
      <div class="w-1/2 h-full flex justify-center items-center">
        <!-- <img class=" object-cover m-auto opacity-80" src="../assets/il3.jpg" alt="login" /> -->
      </div>
      <div class="w-1/2 h-full flex items-center justify-center">
        <div class=" w-96 z-10 flex flex-col gap-4 p-5">
          <div class="font-extrabold text-xl text-black text-start tracking-wide ">{{ $t('l_Sign_in') }}</div>
          <div class="font-ligh text-sm text-start text-[#444] mb-1">{{ $t('l_Enter_detail') }}</div>
          <div>
            <label for="username" class="input-label">{{ $t('l_Username') }}</label>
            <Input id="username" size="medium" class="input-dark small-input" v-model:value="info.username"
              :placeholder="$t('l_Username')" />
          </div>
          <div>
            <label for="password" class="input-label">{{ $t('l_Password') }}</label>
            <div style="position: relative; display: flex; align-items: center;">
              <Input id="password" size="medium" class="input-dark small-input" v-model:value="info.password"
                :placeholder="$t('l_Password')" :type="passwordVisible ? 'text' : 'password'" />
              <span @click="togglePasswordVisibility"
                style="position: absolute; right: 10px; cursor: pointer; color: #888; user-select: none; font-size: 15px;"
                :title="passwordVisible ? 'Hide password' : 'Show password'" class="material-symbols-outlined">
                {{ passwordVisible ? 'visibility' : 'visibility_off' }}
              </span>
            </div>
          </div>
          <div
            class="login-btn text-center flex justify-center items-center bg-gradient-to-r from-[#a8a8a8] to-[#cccccc] text-white px-4 py-1.5 rounded-lg text-base cursor-pointer font-semibold shadow-md hover:scale-105 transition-transform duration-200"
            @click="onLogin">
            {{ $t("l_Login") }}
          </div>
          <div class="forgot-password-link flex items-center gap-2 mb-1 justify-center">
            <span class="line"></span>
            <span class="forgot-link">{{ $t('l_Remember') }}</span>
            <span class="line"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Input } from "ant-design-vue"
import ChangeLanguageBox from "../components/change-language-box.vue"
import { ApiApi } from "../api/api"
import { useUserStore } from '../store/index.ts'
// const BaseUrl = config.baseURL
export default {
  components: {
    Button,
    Input,
    ChangeLanguageBox,
  },
  data() {
    return {
      info: {
        username: "",
        password: "",

      },
      passwordVisible: false,
    };
  },

  methods: {
    onLogin() {
      this.info.username = 'admin'
      this.info.password = 'admin_EKC1'
      if (!this.info.username || !this.info.password) return
      ApiApi('login', this.info, 'POST').then((res) => {
        if (res.success == true) {
          const userStore = useUserStore()
          userStore.setUser(res)
          this.$router.push("/")
        }
        else {
          console.log(res)
          console.log('error')
        }
      })
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },

};
</script>

<style scoped>
.bg-blur::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  backdrop-filter: blur(12px);
}

.input-dark .ant-input {
  background: #fff;
  color: #fff;
  border: 1px solid #888;
  transition: border-color 0.2s;
  opacity: 0.85;
  height: 36px;
  font-size: 15px;
  padding: 4px 10px;
}

.input-dark .ant-input::placeholder {
  color: #aaa;
}

.input-dark .ant-input:focus,
.input-dark .ant-input:hover {
  border-color: #fff;
  box-shadow: none;
}

.small-input .ant-input {
  height: 32px !important;
  font-size: 14px !important;
  padding: 2px 8px !important;
}

.login-btn {
  background: linear-gradient(90deg, #888888 0%, #6f7172 100%);
  border: none;
  transition: transform 0.2s;
  font-size: 16px;
  padding: 4px 0;
}

.login-btn:hover {
  background: linear-gradient(90deg, #6a6c6d 0%, #cccccc 100%);
  transform: scale(1.05);
}

.forgot-link {
  color: #888;
  cursor: pointer;
  transition: color 0.2s, text-decoration 0.2s;
  font-size: 14px;
}

.forgot-link:hover {
  color: #232526;
  text-decoration: underline;
}

.line {
  display: inline-block;
  height: 1px;
  width: 60px;
  background: #ccc;
  vertical-align: middle;
}

.input-label {
  display: block;
  color: #444;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 2px;
  margin-left: 2px;
  text-align: left;
}
</style>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
