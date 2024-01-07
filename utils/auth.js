export function getLocalToken() {
  return wx.getStorageSync('token')
}

export function setLocalToken(data) {
  wx.setStorageSync('token', data)
}
export function removeLocalToken() {
  wx.removeStorageSync('token')
}


export function getLocalUserInfo() {
  return wx.getStorageSync('userInfo')
}

export function setLocalUserInfo(data) {
  wx.setStorageSync('userInfo', data)
}

export function removeLocalUserInfo() {
  wx.removeStorageSync('userInfo')
}