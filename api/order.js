import request, { uploadFile } from '../utils/request'


export function fetchList(data) {
  return request({
    uri: `/orders/`,
    data
  })
}
export function create(data) {
  return request({
    uri: '/orders',
    method: 'post',
    data
  })
}

export function toPay(id) {
  return request({
    uri: `/orders/${id}/place`,
    method: 'put'
  })
}

export function detail(id) {
  return request({
    uri: `/orders/${id}`,
  })
}

export function uploadCommentFile(filePath, data) {
  return uploadFile({
    uri: '/file',
    filePath,
    data
  })
}

export function review(id, data) {
  return request({
    uri: `/orders/${id}/review`,
    method: 'post',
    data
  })
}

export function receive(id) {
  return request({
    uri: `/orders/${id}/receive`,
    method: 'put'

  })
}

export function summary() {
  return request({
    uri: `/orders/summary`,
  })
}