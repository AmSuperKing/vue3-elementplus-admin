import request from '@/utils/request'

export const tableApi = {
  getUserList() {
    return request.get('/user/list').then(res => Promise.resolve(res.data))
  }
}
