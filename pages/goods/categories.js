import { categories, fetchList } from "../../api/goods"
import { getParams } from "../../utils/util"
import { info } from '../../api/user'
// pages/goods/categories.js
Page({
  data: {
    index: 0,
    list: [],
    goodsList: [],
    page: 1,
    info: {}
  },
  onLoad: function (options) {
    this.loadCategories()
    let referer_id = options.referer_id
    if (referer_id) {
      wx.setStorageSync('referer_id', referer_id)
    }
    this.loadInfo()
  },
  onShow: function () {

  },
  async loadCategories() {
    const res = await categories()
    res.data.forEach(cate => {
      if (!cate.pid) {
        cate.children = []
        res.data.forEach(child => {
          if (child.pid === cate.id) {
            cate.children.push(child)
          }
        })
      }
    })
    this.setData({ list: res.data.filter(c => !c.pid) })
    this.loadGoods()
  },
  async handleCategory(e) {
    const { index } = getParams(e)
    // const cate = this.data.categories[index]
    this.setData({ index, page: 1 })
    this.loadGoods()
  },
  async loadGoods() {
    const category_id = this.data.list[this.data.index].id
    const { page } = this.data
    const res = await fetchList({ category_id: category_id, page })
    if(page === 1){
      this.setData({ goodsList: res.data.items, page: page + 1 })
    }else{
      this.setData({ goodsList: this.data.goodsList.concat(res.data.items), page: page + 1 })
    }
  
  },
  onReachBottom() {
    console.log('onreachBottom')
    this.loadGoods()
  },
  onShareAppMessage() {
    return {
      path: `/pages/index/index?referer_id=${this.data.info.id}`
    }
  },
  async loadInfo() {
    const res = await info().catch(_ => false)
    this.setData({ info: res.data })
  },
})