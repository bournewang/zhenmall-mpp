import { services } from "../../../api/service"
import { getParams, redirect } from "../../../utils/util"

// pages/user/sales/index.js
Page({
  data: {
    query: {
      prev_month: '',
      page: 1,
    },
    list: [],
    total: 0,
    titles: []
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
    const res = await services(query).catch(_ => false)
    query.page++
    this.setData({ list: list.concat(res.data.items), query, titles: res.data.titles })
  },
  toDetail(e) {
    const { id } = getParams(e)
    redirect(`/pages/user/sales/detail?id=${id}`)
  }
})