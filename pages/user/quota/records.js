// pages/user/balance/records.js
import {logs} from '../../../api/quota'
import { getParams, redirect } from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {
      prev_month: '',
      page: 1,
    },
    list: [
    ],
    total: 0
  },

  async getList(reset = false){
    let { query, list } = this.data
    if (reset) {
      query.page = 1
      list = []
    }
    const res = await logs(query).catch(_ => false)
    console.log(res)
    if (!res.success) {
      return
    }
    if(res.data.items.length){
      query.page++
    }

    this.setData({ list: list.concat(res.data.items), query, titles: res.data.titles })
  },

  onLoad(options) {
    this.getList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getList()
  },

  toDetail(e) {
    console.log('toDetail', e)
    const { id } = getParams(e)
    redirect(`/pages/user/balance/detail?id=${id}`)
  }
})