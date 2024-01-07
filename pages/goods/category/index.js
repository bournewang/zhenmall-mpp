import { fetchList } from "../../../api/goods"
import { info } from '../../../api/user'

// pages/goods/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    page: 1,
    list: [],
    info: {}
  },

  onLoad: function (options) {
    this.setData({ id: options.id, referer_id: options.referer_id })
    this.loadGoods()
    this.loadInfo()
  },

  onShow: function () {

  },
  async loadInfo() {
    const res = await info().catch(_ => false)
    this.setData({ info: res.data })
  },
  async loadGoods() {
    const res = await fetchList({ category_id: this.data.id, page: this.data.page })
    this.setData({ list: res.data.items, page: this.data.page + 1 })

  },
  onShareAppMessage() {
    return {
      path: `/pages/index/index?referer_id=${this.data.info.id}`
    }
  },
})