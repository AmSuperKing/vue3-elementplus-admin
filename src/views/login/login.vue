<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">Vue3后台管理系统</div>
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="ms-content"
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" size="large" placeholder="账号" tabindex="1">
            <template #prepend>
              <el-button class="prepend-btn" :icon="User" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            size="large"
            type="password"
            placeholder="密码"
            show-password
            tabindex="2"
            @keyup.enter="submitForm(loginFormRef)"
          >
            <template #prepend>
              <el-button class="prepend-btn" :icon="Lock" />
            </template>
          </el-input>
        </el-form-item>
        <div class="pwd-about">
          <el-checkbox v-model="isRemember">记住账号密码</el-checkbox>
          <el-link @click="forgetPwd">忘记密码</el-link>
        </div>
        <div class="login-btn">
          <el-button type="primary" size="large" @click="submitForm(loginFormRef)">登录</el-button>
        </div>
        <p class="login-tips">
          Tips : <br>管理员账号: admin, 密码: 任意, 如 123456<br>
          其他用户: 账号/密码随意, 如: 账号: visitor, 密码: 123456
        </p>
      </el-form>
    </div>
    <div class="ms-copyright hidden-sm-and-down">
      <span>Copyright &copy; {{ currYear }} Vue3 + Element-Plus + Vite 后台管理系统</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { Action, FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { VueCookies } from 'vue-cookies'
import CryptoJS from 'crypto-js'
import { useTagsListStore } from '@/stores/tagsList'
import { userApi } from '@/api/userApi'
import { useUserInfoStore } from '@/stores/userInfo'

const $cookies: VueCookies | any = inject('$cookies')

const route = useRoute()
const router = useRouter()

const userInfo = useUserInfoStore()

const loginForm = reactive({
  username: '',
  password: ''
})
const loginFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度 6 到 16 位', trigger: 'blur' }
  ]
})

const isRemember = ref(false)

const currYear = ref()

onMounted(() => {
  currYear.value = new Date().getFullYear()
  ElNotification({
    title: '请进行登录操作!',
    type: 'info'
  })
  checkLoginInfo()
})

const redirectPath = (route: any) => {
  if (route.query && route.query.redirect) {
    return route.query.redirect
  } else {
    return ''
  }
}
watchEffect(() => redirectPath(route))

const submitForm = async(formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      userApi.login(loginForm).then(res => {
        if(res) {
          userInfo.setUserInfo(res.data.userInfo)
          ElNotification({
            title: '登录成功!',
            type: 'success'
          })
          if (isRemember.value) saveUserInfoToCookie()
          else removeUserInfoFromCookie()
          router.push({ path: redirectPath(route) || '/', replace: true })
        }
      }).catch(e => {
        console.log(e)
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
    callback: (action: Action) => {}
  })
}

const ENCRYPT_CODE = 'HEHE_SCM_2022'
const checkLoginInfo = () => {
  const username = $cookies.get('userName') ? $cookies.get('userName') : ''
  let userPwd = ''
  const enUserPwd = $cookies.get('enUserPwd') ? $cookies.get('enUserPwd') : ''
  if (enUserPwd) {
    // 对密码进行解密
    userPwd = CryptoJS.AES.decrypt(enUserPwd, ENCRYPT_CODE).toString(CryptoJS.enc.Utf8)
  }
  if (username && userPwd) {
    isRemember.value = true
    loginForm.username = username
    loginForm.password = userPwd
  } else { removeUserInfoFromCookie() }
}
const saveUserInfoToCookie = () => {
  $cookies.set('userName', loginForm.username, { expires: '30d' })
  $cookies.set('enUserPwd', CryptoJS.AES.encrypt(loginForm.password, ENCRYPT_CODE).toString(), {
    expires: '30d' // 存储30天
  })
}
const removeUserInfoFromCookie = () => {
  $cookies.remove('userName')
  $cookies.remove('enUserPwd')
  loginForm.username = ''
  loginForm.password = ''
  isRemember.value = false
}

</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.login-wrap {
  width: 100%;
  height: 100%;
  background-color: $loginBg;
  background-image: url('../../assets/images/login-bg.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 375px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, .9);;
  overflow: hidden;
  .ms-title {
    width: 100%;
    line-height: 80px;
    text-align: center;
    font-size: 28px;
    color: $theme-color;
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
  color: $theme-color;
}
.ms-copyright {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 0;
  font-size: 14px;
  color: $theme-color;
  text-align: center;
  background-color: rgba(255, 255, 255, .7);
}
</style>
