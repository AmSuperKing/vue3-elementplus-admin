import request from '@/utils/request'

export const tableApi = {
  getUserList() {
    return request.get('/api/getUsers').then(res => Promise.resolve(res.data))
  }
}
