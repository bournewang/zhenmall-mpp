export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

export function log(...o) {
  console.log(...o)
}
export function redirectComponentRoute(route) {
  const params = []
  for (let k in route.params) {
    params.push(`${k}=${route.params[k]}`)
  }
  redirect(route.path, params)
}
//通用跳转方法
export function redirect(url, params = [], useRedirect = false) {
  console.log('redirect=>', url, params)
  if (!url) {
    return
  }
  //底部bar
  const bars = [
    "/pages/index/index", "/pages/cart/index", "/pages/user/center/index"
  ]
  if (bars.includes(url)) {
    // switchTab后面不能带参数
    // if (params.length) {
    //   url += '?' + params.join('&')
    // }
    wx.switchTab({ url })
  } else {
    if (params.length) {
      url += '?' + params.join('&')
    }
    if (useRedirect) {
      wx.redirectTo({ url })
    } else {
      wx.navigateTo({ url })
    }

  }
}

export function getParams(e) {
  return e.currentTarget.dataset
}

export function getValues(e) {
  return e.detail.value
}



export function fixUnit(str, unit = 'rpx') {
  return str.toString() + unit
}

export function camelStyleToSnake(style) {
  let arr = []
  for (let key in style) {
    // const snake_key = 
    arr.push(key.replace(/([A-Z])/g, "-$1").toLowerCase() + ':' + style[key])
  }
  return arr.join(';')
}

export function getScene(scene) {
  if (!scene) {
    return {}
  }
  scene = decodeURIComponent(scene)
  const params = scene.split('&')
  let paramsObj = {}
  if (params.length) {
    params.map(param => {
      const [k, v] = param.split('=')
      paramsObj[k] = v
    })
  }
  return paramsObj
}