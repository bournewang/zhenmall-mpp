// pages/goods/comments/list.js
import { fetchList } from "../../../api/review"
import { getParams } from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {
      goods_id: 0,
      page: 1
    },
    comments: [],
    commentTotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.query.goods_id = options.id
    // this.setData({ 'query.goods_id': options.id })
    this.loadComments(true)
  },
  async loadComments(reset = false) {
    await wx.$loading.show()
    let comments = this.data.comments
    if (reset) {
      this.data.query.page = 1
      comments = []
    }else{
      this.data.query.page++
    }
    const res = await fetchList(this.data.query).catch(_ => false)
    wx.$loading.hide()
    if (res) {
      comments = comments.concat(res.data.items)
      this.setData({ comments, commentTotal: res.data.total })
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadComments()
  },
  previewImage(e) {
    const { index, cindex } = getParams(e)
    const images = this.data.comments[cindex].imgs.large
    const cur = images[index]
    wx.previewImage({
      current: cur,
      urls: images,
    })
  }

})