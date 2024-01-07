import { store } from "../../../api/store"
import { getParams } from "../../../utils/util"

// pages/user/store/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.loadDetail()
  },
  async loadDetail() {
    const res = await store(this.data.id).catch(_ => false)
    if (!res.success) {
      wx.$confirm('提示', res.msg)
      return
    }
    if (res) {
      this.setData({ detail: res.data })
    }
  },
  preview(e) {
    const { index, key } = getParams(e)
    wx.previewImage({
      current: this.data.detail[key].large[index],
      urls: this.data.detail[key].large,
    })
  },
  callPhone(e) {
    const phone = this.data.detail.mobile
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    }

  },
})