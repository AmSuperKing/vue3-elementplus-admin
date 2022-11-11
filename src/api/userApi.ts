import request from '@/utils/request'
interface LoginForm {
  username: string,
  password: string
}
export const userApi = {
  login(data: LoginForm) {
    return request.post('/api/user/login', data).then(res => Promise.resolve(res.data))
  },
  getUserInfo(username: string) {
    return request.get('/api/user/info', { params: { username }}).then(res => Promise.resolve(res.data))
  },
  getUserAuthMenu() {
    return request.get('/api/user/authMenu').then(res => Promise.resolve(res.data))
  }
}
