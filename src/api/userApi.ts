import request from '@/utils/request'
interface LoginForm {
  username: string,
  password: string
}
export const userApi = {
  login(data: LoginForm) {
    return request.post('/user/login', data).then(res => Promise.resolve(res.data))
  },
  getUserInfo(username: string) {
    return request.get('/user/info', { params: { username }}).then(res => Promise.resolve(res.data))
  },
  getUserAuthMenu() {
    return request.get('/user/authMenu').then(res => Promise.resolve(res.data))
  }
}
