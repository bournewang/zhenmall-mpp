import request from '../utils/request'
export function fetchList(data) {
  return request({
    uri: '/reviews',
    data
  })
}

export function detail(id) {
  return request({
    uri: `/reviews/${id}`,
  })
}