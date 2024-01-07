import { detail, toPay, receive } from "../../../api/order"
import { redirect } from "../../../utils/util"

// pages/order/detail/index.js
Page({
  data: {
    id: 0,
    order: {}
  },

  onLoad: function (options) {
    this.setData({ id: options.id })
    this.loadOrder()
  },

  onShow: function () {

  },
  onPullDownRefresh: function () {
    this.loadOrder().then(_ => {
      console.log('stop')
      wx.stopPullDownRefresh()
    })

  },
  async loadOrder() {
    const res = await detail(this.data.id).catch(_ => false)
    this.setData({ order: res.data })
  },
  paying: 0,
  async payAgain() {
    if (this.paying) {
      return
    }
    this.paying = 1
    await wx.$loading.show()
    const res2 = await toPay(this.data.id).catch(_ => false)
    wx.$loading.hide()
    this.paying = 0
    if (!res2 || !res2.success) {
      await wx.$message.error('发起支付失败')
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
        // redirect(`/pages/order/detail/index?id=${res.data}`)
      },
      fail: (res) => {
        // console.log(res)
        wx.$message.error('支付失败')
        // redirect(`/pages/order/detail/index?id=${res.data}`)
      },
      complete: () => {
        wx.$loading.hide()
        this.loadOrder()
        // redirect(`/pages/order/detail/index?id=${res.data}`)
      }
    })
  },
  openWorkWx(){
    wx.openCustomerServiceChat({
      extInfo: {url: ''},
      corpId: '',
      success(res) {
        console.log('openCustomerServiceChat success')
      },fail(res){
        console.log('openCustomerServiceChat fail', res)
      }
    })
  },
  async receive(){
    await wx.$loading.show()
    const res = await receive(this.data.id).catch(_=>false)
    wx.$loading.hide()
    wx.$message.success()
    this.loadOrder()
  },
  toComment(){
    redirect(`/pages/order/comment/add?id=${this.data.id}`)
  },
  toSeeComment(){
    redirect(`/pages/order/comment/detail?id=${this.data.id}`)
  }
})