import { qrcode } from "../../../api/user"

// pages/user/center/qr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: ''
  },

  onLoad: function (options) {

  },
  onShow: function () {
    this.loadQr()
  },
  async loadQr() {
    const res = await qrcode().catch(_ => false)
    this.setData({ img: res.data })
  }
})