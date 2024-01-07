export function setAddress(data) {
  wx.setStorageSync('address', data)
}

export function getAddress() {
  return wx.getStorageSync('address')
}

export function removeAddress() {
  wx.removeStorageSync('address')
}