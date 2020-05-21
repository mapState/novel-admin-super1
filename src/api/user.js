import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/system/back/login',
    method: 'post',
    data
  })
}

export function getMenu(userId) {
  return request({
    url: '/system/menu/tree',
    method: 'get',
    params: { userId }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
