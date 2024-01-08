// pages/order/confirm/index.js
import { cart } from '../../../api/cart'
import { detail, getDefault } from '../../../api/address'
import { getAddress } from '../../../utils/location'
import { redirect } from '../../../utils/util'
import { create, toPay } from '../../../api/order'
import { info } from '../../../api/user'
Page({
  data: {
    ids: [],
    list: [],
    amount: 0,
    address: {},
    isPayBack: 0,
    info: {},
    useBalance: false
  },

  onLoad: function (options) {
    if (options.ids) {
      this.data.ids = options.ids.split(',').map(i => parseInt(i))
    } else {
      // wx.navigateBack()
      return
    }
  },

  onShow: function () {
    this.getUserInfo()
    this.loadList()
    this.loadAddress()
  },
  async getUserInfo() {
    const res = await info().catch(_ => false)
    res.data.useable_balance = Number(res.data.useable_balance)
    this.setData({ info: res.data })
  },
  async loadList() {
    const res = await cart().catch(_ => false)
    if (!res || !res.data.items.length) {
      if (!this.data.isPayBack) {
        // wx.navigateBack()
      }
      return
    }

    const list = res.data.items   //.filter(i => this.data.ids.includes(i.id))

    let amount = 0
    list.map(i => {
      amount += parseFloat(i.subtotal)
    })
    this.setData({ list, amount })

  },
  async loadAddress() {
    const selectedAddressId = getAddress()
    if (selectedAddressId) {
      const res = await detail(selectedAddressId).catch(_ => false)
      if (res && res.data && res.data.id) {
        this.setData({ address: res.data })
        return
      }
    }
    const res = await getDefault().catch(_ => false)
    if (res && res.data && res.data.id) {
      this.setData({ address: res.data })
    }
  },
  chooseAddress() {
    redirect('/pages/user/address/index', ['action=choose'])
  },
  async toOrder() {
    if (this.data.amount <= 0) {
      wx.$message.error('金额错误')
      return
    }
    if (!this.data.address.id) {
      wx.$message.error('请选择地址')
      return
    }
    await wx.$loading.show()
    const res = await create({ address_id: this.data.address.id, use_balance: this.data.useBalance?1:0 }).catch(_ => false)
    wx.$loading.hide()
    if (!res || !res.success) {
      wx.$message.error('下单错误')
      return
    }
    if (this.data.useBalance) {
      wx.$message.success('支付成功')
      redirect(`/pages/order/detail/index?id=${res.data}`, [], true)
      return
    }
    const res2 = await toPay(res.data).catch(_ => false)
    if (!res2 || !res2.success) {
      await wx.$message.error('发起支付失败')
      //跳转到订单详情页
      redirect(`/pages/order/detail/index?id=${res.data}`, [], true)
      return
    }
    this.data.isPayBack = 1
    wx.requestPayment({
      timeStamp: res2.data.timeStamp.toString(),
      nonceStr: res2.data.nonceStr,
      package: res2.data.package,
      signType: res2.data.signType,
      paySign: res2.data.paySign,
      success: (payRes) => {
        wx.$message.success('支付成功')
        redirect(`/pages/order/detail/index?id=${res.data}`, [], true)
      },
      fail: () => {
        wx.$message.error('发起支付失败')
        redirect(`/pages/order/detail/index?id=${res.data}`, [], true)
      },
      complete: () => {
        // redirect(`/pages/order/detail/index?id=${res.data}`)
      }
    })
  },
  useBalanceChange() {
    this.setData({ useBalance: !this.data.useBalance })
  }
})