import { detail } from "../../../api/order"
import { healthDetail } from "../../../api/user"
import { getParams } from "../../../utils/util"

// pages/user/health/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    titles: [],
    list: [],
    detail: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id })
    this.loadDetail()
  },

  onShow: function () {

  },


  async loadDetail() {
    let { id } = this.data

    const res = await healthDetail(id).catch(_ => false)
    if (!res.success) {
      wx.$confirm('提示', res.msg)
      return
    }
    this.setData({ detail: res.data })
  },
  preview(e) {
    const { index } = getParams(e)
    wx.previewImage({
      current: this.data.detail.imgs.large[index],
      urls: this.data.detail.imgs.large,
    })
  }
})