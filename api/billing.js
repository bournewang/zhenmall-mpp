import request from '../utils/request'
export function list() {
  return request({
    uri: '/billing'
  })
}
export function items() {
  return request({
    uri: '/billing/items'
  })
}