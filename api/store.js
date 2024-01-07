import request from '../utils/request'

export function clerks() {
  return request({
    uri: '/clerks'
  })
}

export function customers() {
  return request({
    uri: '/customers'
  })
}

export function stores(data) {
  return request({
    uri: '/stores',
    data
  })
}

export function createStore(data) {
  return request({
    uri: '/stores',
    method: 'post',
    data
  })
}

export function stocks(data) {
  return request({
    uri: '/stocks',
    data
  })
}

export function store(id) {
  return request({
    uri: `/stores/${id}`
  })
}