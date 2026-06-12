import request from '@/utils/request'
interface LoginForm {
  username: string
  password: string
}
export const userApi = {
  login(data: LoginForm) {
    return request.post('/login.json', data).then((res) => Promise.resolve(res.data))
  },
  getUserInfo(username: string) {
    return request.get('/userInfo.json', { params: { username } }).then((res) => Promise.resolve(res.data))
  },
  getUserAuthMenu() {
    return request.get('/authMenus.json').then((res) => Promise.resolve(res.data))
  },
}
