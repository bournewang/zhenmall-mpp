import request from '../utils/request'
export function address() {
  return request({
    uri: '/address'
  })
}

export function create(data) {
  return request({
    uri: '/address',
    method: 'post',
    data,
  })
}
export function update(id, data) {
  return request({
    uri: `/address/${id}`,
    method: 'put',
    data,
  })
}
export function detail(id) {
  return request({
    uri: '/address/' + id,
  })
}

export function remove(id) {
  return request({
    uri: '/address/' + id,
    method: 'delete'
  })
}
export function getDefault() {
  return request({
    uri: '/address/default',
  })
}

export function select() {
  return request({
    uri: `/address/${id}/select`,
    method: 'post'
  })
}

export function current() {
  return request({
    uri: '/address/current',
  })
}

export function provinces() {
  return request({
    uri: '/provinces',
  })
}

export function cities(province_id) {
  return request({
    uri: `/provinces/${province_id}/cities`,
  })
}

export function districts(city_id) {
  return request({
    uri: `/cities/${city_id}/districts`,
  })
}