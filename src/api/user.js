import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/user/managerLogin',
    method: 'post',
    data:data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/user/managerInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/user/managerLogout',
    method: 'post'
  })
}
