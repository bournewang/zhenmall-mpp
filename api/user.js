import request, { uploadFile } from '../utils/request'
export function login(data) {
  return request({
    uri: '/wxapp/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    uri: '/wxapp/register',
    method: 'post',
    data
  })
}

export function info() {
  return request({
    uri: '/user/info',

  })
}
export function saveInfo(data) {
  return request({
    uri: '/user/info',
    method: 'post',
    data

  })
}

export function type(type) {
  return request({
    uri: `/user/type/${type}`,
    method: 'put'
  })
}

export function uploadCommonFile(filePath, data) {
  return uploadFile({
    uri: '/file',
    filePath,
    data
  })
}

export function mobile(data) {
  return request({
    uri: '/user/mobile',
    method: 'post',
    data
  })
}

export function qrcode() {
  return request({
    uri: '/user/qrcode',
  })
}

export function health() {
  return request({
    uri: '/health',
  })
}

export function healthCreate(data) {
  return request({
    uri: '/health',
    method: 'post',
    data
  })
}


export function healthDetail(id) {
  return request({
    uri: `/health/${id}`,
  })
}

export function redpackets(){
  return request({
    uri: `/red-packets`,
  })
}

export function openRedpacket(id){
  return request({
    uri: `/red-packets/${id}`,
    method: 'put'
  })
}

export function withdrawList(){
  return request({
    uri: `/withdraw`,
  })
}

export function withdraw(data){
  return request({
    uri: `/withdraw`,
    method: 'post',
    data
  })
}

export function team(){
  return request({
    uri: `/user/team`,
  })
}
export function directMembersRange(){
  return request({
    uri: `/direct-members-range`,
  })
}

export function directTeam(){
  return request({
    uri: `/user/direct-team`,
  })
}
