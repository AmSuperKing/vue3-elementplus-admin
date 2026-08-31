import request from '@/utils/request'
interface LoginForm {
  username: string
  password: string
}
export const userApi = {
  adminLogin(data: LoginForm) {
    return request.get('/adminLogin.json', { params: data }).then((res) => Promise.resolve(res.data))
  },
  otherLogin(data: LoginForm) {
    return request.get('/otherLogin.json', { params: data }).then((res) => Promise.resolve(res.data))
  },
  getUserInfo(username: string) {
    return request.get('/userInfo.json', { params: { username } }).then((res) => Promise.resolve(res.data))
  },
  getOtherUserInfo(username: string) {
    return request.get('/otherUserInfo.json', { params: { username } }).then((res) => Promise.resolve(res.data))
  },
  getUserAuthMenu() {
    return request.get('/authMenus.json').then((res) => Promise.resolve(res.data))
  },
  getNormalUserAuthMenu() {
    return request.get('/normalMenus.json').then((res) => Promise.resolve(res.data))
  },
}
