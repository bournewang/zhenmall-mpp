import { fetchList, toPay, summary } from "../../../api/order"
import { getParams, redirect } from "../../../utils/util"

// pages/order/list/index.js
Page({
  data: {
    active: 0,
    texts: ['全部', '待付款', '待发货', '待收货', '待评价'],
    lists: [[], [], [], [], []],
    listsQuery: [{ page: 1}, { page: 1, status: 'created' }, { page: 1, status: 'paid' }, { page: 1, status: 'shipped' }, { page: 1, status: 'complete' }],
    statuses: ['all','created', 'paid', 'shipped', 'complete'],
    orderCount:{
 
    }
  },

  onLoad: function (options) {
    if (!options.status) {
      // this.loadList(true)
    } else {
      this.setData({ active: parseInt(options.status) })
    }

  },

  onShow: function () {
    this.loadList(true)
    this.loadOrderCount()
  },
  async loadOrderCount() {
    const res = await summary().catch(_ => false)
    this.setData({ orderCount: res.data })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadList(1).then(_ => {
      console.log('stop')
      wx.stopPullDownRefresh()
      this.loadOrderCount()
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
    this.loadList()
  },
  async loadList(reset = false) {
    const { active, listsQuery, lists } = this.data
    let query = listsQuery[active]
    let list = lists[active]
    if (reset) {
      query.page = 1
      list = []
    }
    const res = await fetchList(query).catch(_ => false)
    if (res) {
      list = list.concat(res.data)
      query.page++
      lists[active] = list
      listsQuery[active] = query
      this.setData({ lists, listsQuery })
    }
  },
  onChange(e) {
    const { index, name } = e.detail
    this.setData({ active: index })
    if (!this.data.lists[index].length) {
      this.loadList(true)
    }

  },
  async payAgain(e) {
    await wx.$loading.show()
    const { id } = getParams(e)
    const res2 = await toPay(id).catch(_ => false)
    await wx.$loading.hide()
    if (!res2 || !res2.success) {
      await wx.$message.error('发起支付失败')
      //跳转到订单详情页
      // redirect(`/pages/order/detail/index?id=${res.data}`)
      return
    }
    await wx.$loading.show()
    wx.requestPayment({
      timeStamp: res2.data.timeStamp.toString(),
      nonceStr: res2.data.nonceStr,
      package: res2.data.package,
      signType: res2.data.signType,
      paySign: res2.data.paySign,
      success: (payRes) => {
        wx.$message.success('支付成功')
        redirect(`/pages/order/detail/index?id=${res.data}`)
      },
      fail: (res) => {
        // console.log(res)
        wx.$message.error('支付失败')
        // redirect(`/pages/order/detail/index?id=${res.data}`)
      },
      complete: () => {
        wx.$loading.hide()
      }
    })
  },
  toComment(e) {
    const { id } = getParams(e)
    redirect(`/pages/order/comment/add?id=${id}`)
  },
  toShowComment(e) {
    const { id } = getParams(e)
    redirect(`/pages/order/comment/detail?id=${id}`)
  },

})