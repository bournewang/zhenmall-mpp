import request from '../utils/request'

export function services(data) {
  return request({
    uri: '/services',
    data
  })
}

export function userServices(query) {
  return request({
    uri: `/services/${query.user_id}`,
    data: query
  })
}