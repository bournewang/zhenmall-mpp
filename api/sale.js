import request from '../utils/request'

export function sales(data) {
  return request({
    uri: '/sales',
    data
  })
}

export function userSales(query) {
  return request({
    uri: `/sales/${query.user_id}`,
    data:query
  })
}