// pages/user/address/index.js
import { address, remove } from '../../../api/address'
import { setAddress } from '../../../utils/location'
import { getParams, redirect } from '../../../utils/util'
Page({
  data: {
    list: [],
    isChoose: !1,

  },

  onLoad: function (options) {
    if (options && options.action && options.action ==='choose' ) {
      // 选择地址
      this.setData({ isChoose: 1})
    }
  },

  onShow: function () {
    this.list()
  },
  async list() {
    const res = await address().catch(_ => false)
    if (res) {
      this.setData({ list: res.data })
    }
  },
  async newAddress() {
    redirect('/pages/user/address/add')
  },
  move(event) {
    const { x, y, source } = event.detail
    const index = event.target.dataset.index
    let list = this.data.list
    if (x > -60 && source === 'touch') {
      list[index]['x'] = 0
      this.setData({ list: list })
    } else if (source === 'touch') {
      list[index]['x'] = -142
      this.setData({ list: list })
    }
  },
  async del(event) {
    const { id } = event.currentTarget.dataset
    const res = await wx.$confirm('删除', '确定删除么?').catch(_ => false)
    if (res) {
      const res = await remove(id).catch(_ => false)
      if (res) {
        this.list()
      }
    }

  },
  edit(e){
    const {id} = getParams(e)
    redirect(`/pages/user/address/add?id=${id}`)
  },
  chooseAddress(e){
    const {index} = getParams(e)
    const {list} = this.data
    setAddress(list[index].id)
    wx.navigateBack()
  }
})