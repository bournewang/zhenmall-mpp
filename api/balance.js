import request from '../utils/request'

export function logs(data) {
  return request({
    uri: '/balance-logs',
    data
  })
}