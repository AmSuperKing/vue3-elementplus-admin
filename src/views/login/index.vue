<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">Vue3 - Element-Plus - Admin</div>
      <el-form ref="loginFormRef" label-width="0px" class="ms-content" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" size="large" :placeholder="$t('login.username')" tabindex="1">
            <template #prepend>
              <el-button class="prepend-btn" :icon="User" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" size="large" type="password" :placeholder="$t('login.password')" show-password
            tabindex="2" @keyup.enter="submitForm(loginFormRef)">
            <template #prepend>
              <el-button class="prepend-btn" :icon="Lock" />
            </template>
          </el-input>
        </el-form-item>
        <div class="pwd-about">
          <el-checkbox v-model="isRemember">{{ $t('login.rememberMe') }}</el-checkbox>
          <el-link @click="forgetPwd">{{ $t('login.forget') }}</el-link>
        </div>
        <div class="login-btn">
          <el-button type="primary" size="large" @click="submitForm(loginFormRef)">{{  $t('login.login')}}</el-button>
        </div>
        <p class="login-tips">
          Tips : <br />{{ $t('login.tips1')}}<br />
          {{ $t('login.tips2')}}
        </p>
      </el-form>
    </div>
    <div class="ms-copyright hidden-sm-and-down">
      <span>Copyright &copy; {{ currYear }} Vue3 + Element-Plus + Vite - {{ $t('login.systemName') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted, inject } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import CryptoJS from 'crypto-js'
import { useTagsListStore } from '@/stores/tagsList'
import { userApi } from '@/api/userApi'
import { useUserInfoStore } from '@/stores/userInfo'
import { setToken } from '@/utils/auth'

defineOptions({
  name: 'Login',
})

const $cookies = inject<Cookies>('$cookies')!

const route = useRoute()
const router = useRouter()

const userInfo = useUserInfoStore()

const loginForm = reactive({
  username: '',
  password: '',
})
const loginFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度 6 到 16 位', trigger: 'blur' },
  ],
})

const isRemember = ref(false)

const currYear = ref()

onMounted(() => {
  currYear.value = new Date().getFullYear()
  ElNotification({
    title: '请进行登录操作!',
    type: 'info',
  })
  checkLoginInfo()
})

const redirectPath = (route: RouteLocationNormalizedLoaded) => {
  if (route.query && route.query.redirect) {
    const redirect = route.query.redirect
    // 处理可能的数组情况，确保返回 string
    return Array.isArray(redirect) ? redirect[0] : redirect
  } else {
    return ''
  }
}
watchEffect(() => redirectPath(route))

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: boolean) => {
    if (valid) {
      const loginMethod = loginForm.username === 'admin' ? userApi.adminLogin : userApi.otherLogin
      loginMethod(loginForm)
        .then((res) => {
          if (res) {
            setToken(res.data.token)
            userInfo.setUserInfo(res.data)
            ElNotification({
              title: '登录成功!',
              type: 'success',
            })
            userInfo.getAuthMenus().then((menus: MenuRoute[]) => {
              userInfo.setAuthMenus(menus)
            })
            userInfo.getUserInfo().then((info: UserInfo | undefined) => {
              if (info) userInfo.setUserInfo(info)
            })
            if (isRemember.value) saveUserInfoToCookie()
            else removeUserInfoFromCookie()
            router.push({ path: redirectPath(route) || '/', replace: true })
          }
        })
        .catch((e) => {
          ElMessage.error(e)
          removeUserInfoFromCookie()
        })
    } else {
      ElMessage.error('请填写完整登录信息')
    }
  })
}

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }

const tagsList = useTagsListStore()
tagsList.clearTags()

const forgetPwd = () => {
  ElMessageBox.alert('暂不支持在线找回密码，请联系系统管理员重置密码！', '忘记密码', {
    autofocus: false,
    confirmButtonText: '确定',
    callback: () => { },
  })
}

const ENCRYPT_CODE = 'Identity_verification'
const USERNAME_KEY = 'user_name'
const PWD_KEY = 'access_key'

const checkLoginInfo = () => {
  const username = $cookies.get(USERNAME_KEY) ? $cookies.get(USERNAME_KEY) : ''
  let userPwd = ''
  const enUserPwd = $cookies.get(PWD_KEY) ? $cookies.get(PWD_KEY) : ''
  if (enUserPwd) {
    // 对密码进行解密
    userPwd = CryptoJS.AES.decrypt(enUserPwd, ENCRYPT_CODE).toString(CryptoJS.enc.Utf8)
  }
  if (username && userPwd) {
    isRemember.value = true
    loginForm.username = username
    loginForm.password = userPwd
  } else {
    removeUserInfoFromCookie()
  }
}
const saveUserInfoToCookie = () => {
  $cookies.set(USERNAME_KEY, loginForm.username, '30d') // 存储30天
  $cookies.set(PWD_KEY, CryptoJS.AES.encrypt(loginForm.password, ENCRYPT_CODE).toString(), '30d')
}
const removeUserInfoFromCookie = () => {
  $cookies.remove(USERNAME_KEY)
  $cookies.remove(PWD_KEY)
  loginForm.username = ''
  loginForm.password = ''
  isRemember.value = false
}
</script>

<style lang="scss" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: var(--login-bg);
  background-image: url('@/assets/imgs/login-bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}

.dark {
  .ms-login {
    background-color: rgba(0, 0, 0, 0.7);
  }
  .ms-copyright {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 375px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  overflow: hidden;

  .ms-title {
    width: 100%;
    line-height: 80px;
    text-align: center;
    font-size: 22px;
    color: var(--theme-color);
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }

  .ms-content {
    padding: 30px 30px 10px 30px;
  }
}

.prepend-btn {
  height: 40px;
  font-size: 16px !important;
}

.pwd-about {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.login-btn {
  text-align: center;

  & button {
    width: 100%;
    height: 42px;
    margin-bottom: 10px;
  }
}

.login-tips {
  font-size: 12px;
  line-height: 15px;
  color: var(--theme-color);
}

.ms-copyright {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 0;
  font-size: 14px;
  color: var(--theme-color);
  text-align: center;
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
