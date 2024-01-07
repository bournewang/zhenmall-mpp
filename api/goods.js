import request from '../utils/request'

export function categories() {
  return request({
    uri: '/categories'
  })
}

export function fetchList(data) {
  return request({
    uri: '/goods',
    data
  })
}

export function detail(id) {
  return request({
    uri: `/goods/${id}`,
  })
}
export function like(id) {
  return request({
    uri: `/goods/${id}`,
    method: 'post'
  })
}
export function disLike(id) {
  return request({
    uri: `/goods/${id}`,
    method: 'delete'
  })
}