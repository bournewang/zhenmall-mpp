import { sales } from "../../../api/sale"
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
    titles: [],
    columnsLen: 0
  },

  onLoad: function (options) {
    this.getList(1)
  },

  onShow: function () {

  },

  onReachBottom: function () {
    this.getList()
  },
  async getList(reset) {
    let { query, list } = this.data
    if (reset) {
      query.page = 1
      list = []
    }
    const res = await sales(query).catch(_ => false)
    console.log(res)
    if (!res.success) {
      wx.$confirm('提示', res.msg)
      return
    }
    query.page++
    // const titleLen = Object.keys(res.data.titles).length
    // const columnsLen = titleLen <= 3 ? 3 : Math.ceil(titleLen / 2)
    this.setData({ list: list.concat(res.data.items), query, titles: res.data.titles })
  },
  toDetail(e) {
    console.log('toDetail', e)
    const { id } = getParams(e)
    redirect(`/pages/user/sales/detail?id=${id}`)
  }
})