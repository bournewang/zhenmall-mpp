import {
  getLocalToken, removeLocalToken, setLocalToken,
  setLocalUserInfo
} from './auth'
import { login } from '../api/user.js'
import { log } from './util'

let api = 'https://shop.yzsmjkkjcom.com/api'
const accountInfo = wx.getAccountInfoSync()
console.log('accountInfo', accountInfo)
if (accountInfo.miniProgram.envVersion == "develop") {
  api = 'http://mall.yzsmjkkjcom.com/api'
}

// const api = 'http://mall.yzsmjkkjcom.com/api'

var wxloginRes = null
export var wxLogin = () => {
  if (wxloginRes) {
    return wxloginRes
  } else {
    wxloginRes = new Promise((resolve, reject) => {
      wx.login({
        success: res2 => {
          login({ code: res2.code }).then(res3 => {
            log('login', res3)
            if (res3.data.api_token) {
              setLocalToken(res3.data.api_token)
              resolve(res3.data)
            } else {
              console.log('login reject session_key')
              reject(res3.data)
            }

            log('reset wxloginRes')
            wxloginRes = null
          })
        },
        error: res => {
          reject('获取code失败 ' + res)
        }
      })
    })
    return wxloginRes

  }
}

var request = async (config) => {
  log("request", config)
  const token = getLocalToken()
  if (!config.header) {
    config.header = {}
  }
  if (config.method === 'post' || config.method === 'POST') {
    config.header['content-type'] = 'application/x-www-form-urlencoded'
  }
  config.header['Accept'] = 'application/json'
  config.header.Authorization = 'Bearer ' + token
  if (token) {
    config.header['api-token'] = token
  }
  if (config.data) {
    for (let key in config.data) {
      if (config.data[key] === undefined) {
        delete (config.data[key])
      } else if (typeof config.data[key] === 'object' && config.data[key] !== null) {
        Object.keys(config.data[key]).forEach(k => {
          const form_k = `${key}[${k}]`
          config.data[form_k] = config.data[key][k]
        })
        delete (config.data[key])
        // config.data[key] = JSON.stringify(config.data[key])
      }
    }
  }
  const res = await new Promise((resolve, reject) => {
    wx.request({
      url: api + config.uri,
      method: config.method,
      data: config.data,
      header: config.header,
      success(res) {
        // log('request success', res)
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 403) {
          reject(res)
          // wxLogin().then(res => {
          //   resolve(request(config))
          // }, _ => {
          //   //跳转到授权
          //   // wx.navigateTo({
          //   //   url: '/pages/user/center/login',
          //   // })
          //   reject(res)
          // })

        } else {
          console.warn('服务器错误', res)
          reject(res)
        }

      },
      fail(res) {
        reject(res)
      }
    })
  })
  log("request res", config.uri, res)
  if (!res) {
    return null
  }
  return res
}

export function uploadFile(config) {
  const token = getLocalToken()
  if (!config.header) {
    config.header = {}
  }
  config.header.Authorization = 'Bearer ' + token
  if (token) {
    config.header['api-token'] = token
  }
  config.header['content-type'] = 'multipart/form-data'
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${api}${config.uri}`,
      filePath: config.filePath,
      header: config.header,
      formData: config.data,
      name: "img",
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        }
      },
      fail(res) {
        reject(res)
      }
    })
  })

}

export default request
