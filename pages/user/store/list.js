import { stores } from "../../../api/store"
import { getParams, redirect } from "../../../utils/util"

// pages/user/sales/index.js
Page({
  data: {
    query: {
      prev_month: '',
      page: 1,
    },
    list: [
    ],
    total: 0
  },

  onLoad: function (options) {
    this.getList(1)
  },

  onShow: function () {

  },

  onReachBottom: function () {
    this.getList()
  },
  async getList(reset = 0) {
    let { query, list } = this.data
    if (reset) {
      query.page = 1
      list = []
    }
    const res = await stores(query).catch(_ => false)
    query.page++
    this.setData({ list: list.concat(res.data.items), query })
  },
  callPhone(e) {
    const { index } = getParams(e)
    const phone = this.data.list[index].mobile
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    }

  },
  toDetail(e){
    const {index} = getParams(e)
    redirect('/pages/user/store/detail',[`id=${this.data.list[index].id}`])
  }
})