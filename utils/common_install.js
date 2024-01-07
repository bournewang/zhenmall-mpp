//进行一些全局方法的安装
wx.$confirm = async (title, content = '', confirmColor = '#db0000') => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      confirmColor,
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else {
          reject(false)
        }
      }
    })
  })
}

wx.$loading = {
  show: async (title = '加载中...', mask = true) => {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title, mask,
        success() {
          resolve(true)
        },
        fail() {
          reject(false)
        }
      })
    })

  },
  hide: async () => {
    return new Promise((resolve, reject) => {
      wx.hideLoading({
        success() {
          resolve(true)
        },
        fail() {
          reject(false)
        }
      })
    })

  }
}

wx.$message = {
  error: async (title = '错误', conf = {}) => {
    const { icon = 'error', image = null, duration = 1500, mask = false } = conf
    return new Promise((resolve, reject) => {
      wx.showToast({
        title, icon, image, duration, mask,
        success() {
          resolve()
        }, fail() {
          reject()
        }
      })
    })
  },
  success: async (title = '成功', conf = {}) => {
    const { icon = 'success', image = null, duration = 1500, mask = false } = conf
    return new Promise((resolve, reject) => {
      wx.showToast({
        title, icon, image, duration, mask,
        success() {
          resolve()
        }, fail() {
          reject()
        }
      })
    })
  }
}