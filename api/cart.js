import request from '../utils/request'

export function cart() {
  return request({
    uri: '/cart'
  })
}

export function add(goods_id) {
  return request({
    uri: `/cart/${goods_id}`,
    method: 'post',
  })
}

export function remove(goods_id) {
  return request({
    uri: `/cart/${goods_id}`,
    method: 'delete',
  })
}

export function update(goods_id, data) {
  return request({
    uri: `/cart/${goods_id}`,
    method: 'put',
    data
  })
}