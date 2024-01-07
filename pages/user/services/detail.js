import { userServices } from "../../../api/service"

// pages/user/sales/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{
      user_id: 0,
      page: 1
    },
    titles: [],
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({'query.user_id':options.id})
    this.getList(1)
  },

  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },
  async getList(reset = 0) {
    let { query, list } = this.data
    if (reset) {
      query.page = 1
      list = []
    }
    const res = await userServices(query).catch(_ => false)
    query.page++
 
    this.setData({ list: list.concat(res.data.items), query, titles: res.data.titles })
  }
})