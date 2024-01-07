// pages/cart/index.js
import { cart, update, remove } from '../../api/cart'
import { getParams, redirect } from '../../utils/util'
Page({
  data: {
    canLocation: 1,
    list: [],
    amount: 0,
    checked: []
  },

  onLoad: function (options) {

  },

  onShow: function () {
    this.list()
  },
  async list() {
    const res = await cart().catch(_ => false)
    if (res && res.data.items) {
      this.setData({
        list: res.data.items.map(i => {
          i.quantity = parseInt(i.quantity)
          i.checked = 1
          return i
        }), amount: res.data.total_price
      })
    }
  },
  move(event) {
    const { x, y, source } = event.detail
    const index = event.target.dataset.index
    console.log(index, source, x)
    let list = this.data.list
    if (x > -60 && source === 'touch') {
      list[index]['x'] = 0
      this.setData({ list: list })
    } else if (source === 'touch') {
      list[index]['x'] = -142
      this.setData({ list: list })
    }
  },
  async decNum(e) {
    const { index } = getParams(e)
    const { list } = this.data
    const item = list[index]
    const quantity = item.quantity - 1
    if (quantity < 1) {
      this._remove(item.goods_id)
      return
    }
    await wx.$loading.show()
    await update(item.goods_id, { quantity })
    await wx.$loading.hide()
    this.list()

  },
  async incNum(e) {
    const { index } = getParams(e)
    const { list } = this.data
    const item = list[index]
    const quantity = item.quantity + 1
    if (quantity < 1) {
      this._remove(item.goods_id)
      return
    }
    await wx.$loading.show()
    await update(item.goods_id, { quantity })
    await wx.$loading.hide()
    this.list()
  },

  remove(e) {
    const { index } = getParams(e)
    const { list } = this.data
    const item = list[index]
    this._remove(item.goods_id)
  },
  async _remove(goods_id) {
    const res = await wx.$confirm('删除', '确定删除么?')
    if (res) {
      await remove(goods_id)
      this.list()
    }
  },
  choose(e) {
    const { index } = getParams(e)
    const { list } = this.data
    const item = list[index]
    item.checked = !item.checked
    this.setData({ list })
  },
  toOrder() {
    const { list } = this.data
    const checked = list.filter(i => i.checked)
    if (!checked.length) {
      wx.$message.error('请至少选择一个')
      return
    }
    redirect('/pages/order/confirm/index', [`ids=${checked.map(i => i.id).join(',')}`])
  }
})