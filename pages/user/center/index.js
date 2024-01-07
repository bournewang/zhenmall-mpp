// pages/user/center/index.js
import { redirect } from '../../../utils/util'
import { wxLogin } from '../../../utils/request'
import { register, info, redpackets, openRedpacket, withdraw } from '../../../api/user'
import { summary } from '../../../api/order'
let fangdou = null
Page({
  data: {
    info: {},
    authAddress: 0, // 0 还未授权过， 1 已授权， 2 拒绝授权
    orderCount: {

    },
    redpackets: {},
    redpacketsCount: 0,

    opening: 0,
    redpacketBtnClass: '',
    redpacketStep: 0, //0 关闭， 1 显示红包， 2 显示打开后的红包
    redpacketAmount: 0,

    showWithdraw: false,
    withdrawAmount: null,
    withdrawing: 0



  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.loadInfo()
    this.getRedpackets()
    this.loadOrderCount()
  },
  async getRedpackets() {
    const res = await redpackets().catch(_ => false)
    // const res = {data: {1:99}}

    if (res && res.data) {
      this.setData({ redpackets: res.data, redpacketsCount: Object.keys(res.data).length })
    }
  },
  async getUserInfo(e) {
    console.log(e)
    if (!e.detail.rawData) {
      return
    }
    const loginRes = await wxLogin().catch(_ => false)
    if (loginRes && loginRes.session_key) {
      wx.getUserInfo({
        withCredentials: true,
        lang: 'zh_CN',
        success: (res) => {
          const formData = {
            session_key: loginRes.session_key,
            ...res
          }
          register(formData).then(res => {

          })

        }

      })
    }
  },

  getPhoneNumber(e) {
    console.log(e.detail.code)
  },
  selectAddress() {
    redirect('/pages/user/address/index')

  },
  async loadInfo() {
    const res = await info().catch(_ => false)
    this.setData({ info: res.data || {} })
  },
  toQr() {
    redirect('/pages/user/center/qr')
  },
  async loadOrderCount() {
    const res = await summary().catch(_ => false)
    this.setData({ orderCount: res.data })
  },
  showbtn() {
    this.setData({ redpacketStep: 1 })
  },
  async openbtn() {
    if (this.data.opening) {
      return
    }
    this.data.opening = 1
    this.setData({ redpacketBtnClass: 'xuanzhuan' })
    setTimeout(async () => {
      const redpacketId = Object.keys(this.data.redpackets)[0]
      if (!redpacketId) {
        return
      }
      const redpacketAmount = this.data.redpackets[redpacketId]
      const res = await openRedpacket(redpacketId).catch(_ => false)
      if (res && !res.code) {
        this.getRedpackets()
        this.loadInfo()
      }

      this.setData({ redpacketBtnClass: '', redpacketStep: 2, redpacketAmount })
      this.data.opening = 0
    }, 800)
  },
  continuebtn() {
    this.showbtn()
    this.openbtn()
  },
  closebtn() {
    this.setData({ redpacketStep: 0 })
  },
  showWithdraw() {
    this.setData({ showWithdraw: true })
  },
  handleInputWithdrawAmount(e) {
    if (fangdou) {
      clearTimeout(fangdou)
      fangdou = null
    }
    fangdou = setTimeout(() => {
      let { value } = e.detail
      console.log(value)
      if (value > this.data.info.quota) {
        value = this.data.info.quota || 0
      }
      if (value > this.data.info.balance) {
        value = this.data.info.balance
      }
      if (value > 100) {
        value = Math.floor(value / 100) * 100
      }
      this.setData({ withdrawAmount: value })
      fangdou = null
    }, 200)
  },

  toCancelWithdraw() {
    this.setData({ showWithdraw: false, withdrawAmount: 0 })
  },
  async toWithdraw() {
    if (this.data.withdrawing) {
      return
    }
    const withdrawAmount = this.data.withdrawAmount
    if (withdrawAmount > this.data.info.quota) {
      wx.$message.error('提现额度不足')
      return
    }
    if (withdrawAmount > this.data.info.balance) {
      wx.$message.error('余额不足')
      return
    }
    if (withdrawAmount <= 0) {
      // wx.$message.error('金额错误')
      return
    }
    this.data.withdrawing = 1
    if (fangdou !== null) {
      //等待
      await new Promise(resolve => {
        setTimeout(() => {
          console.log('dengdai')
          resolve()
        }, 300)
      })
    }
    console.log('kaishi')
    const res = await withdraw({ amount: withdrawAmount }).catch(_ => false)
    this.data.withdrawing = 0
    if (res && !res.code) {
      wx.$message.success('操作成功')
      this.loadInfo()
      this.toCancelWithdraw()
      return
    }
  },
  onShareAppMessage() {
    return {
      path: `/pages/index/index?referer_id=${this.data.info.id}`
    }
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/user/center/login',
    })
  }
})