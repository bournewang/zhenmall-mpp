import request from '../utils/request'

export function logs(data) {
  return request({
    uri: '/quota-logs',
    data
  })
}