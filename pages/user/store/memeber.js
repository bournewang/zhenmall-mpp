import { clerks } from "../../../api/store"

// pages/user/sales/index.js
Page({
  data: {
    query: {
      prev_month: '',
      page: 1,
    },
    list: [
      // {avatar:'',nickname:'test'}
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
    const res = await clerks(query).catch(_ => false)
    query.page++
    this.setData({ list: list.concat(res.data.items), query })
  }
})