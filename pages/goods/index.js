// pages/goods/index.js

import { add } from "../../api/cart"
import { detail } from "../../api/goods"
import { fetchList } from "../../api/review"
import { getParams, redirect } from "../../utils/util"
import { info } from '../../api/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detail: {},
    comments: [],
    commentTotal: 0,
    type: 0,
    closePictureInPictureMode: 0,
    customParams: '',
    roomId: 2
  },

  onLoad: function (options) {
    this.setData({ id: options.id })
    // this.loadZhibo()
    this.loadDetail()

    let referer_id = options.referer_id
    if (referer_id) {
      wx.setStorageSync('referer_id', referer_id)
    }
    this.loadInfo()
  },

  onShow: function () {

  },

  onShareAppMessage() {
    return {
      path: `/pages/goods/index?id=${this.data.id}&referer_id=${this.data.info.id}`
    }
  },
  async loadDetail() {
    const res = await detail(this.data.id).catch(_ => false)
    this.setData({ detail: res.data })
    wx.setNavigationBarTitle({
      title: this.data.detail.name,
    })
    this.loadComments()
  },
  async onClickButton() {
    await wx.$loading.show()
    const res = await add(this.data.id).catch(err => {
      console.log('err', err)
      if(err.statusCode === 403){
        redirect('/pages/user/center/login')
      }
      return false
    })
    wx.$loading.hide()
    // wx.$message.success('添加购物车成功')
    if (res) {
      redirect('/pages/cart/index')
    }
  },
  async addCart(){
    await wx.$loading.show()
    const res = await add(this.data.id).catch(err => {
      console.log('err', err)
      if(err.statusCode === 403){
        redirect('/pages/user/center/login')
      }
      return false
    })
    wx.$loading.hide()
    if(res&&!res.code){
      wx.$message.success('添加购物车成功')
    }
    
  },
  async loadComments() {
    const res = await fetchList({ goods_id: this.data.id, perpage: 3 }).catch(_ => false)
    this.setData({ comments: res.data.items, commentTotal: res.data.total })
  },
  async loadZhibo() {
    let type = 0 // 0. 显示直播、预告、商品讲解、回放其中之一的挂件；1. 只显示直播的挂件；2. 只显示预告的挂件；3. 只显示商品讲解的挂件；4. 只显示回放的挂件
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    let closePictureInPictureMode = 0 // 是否关闭小窗
    this.setData({
      type, // 可选 
      customParams, // 可选
      closePictureInPictureMode, // 可选
      roomId: 2
    })
    //   wx.navigateTo({
    //     url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=2`
    // })

    // let roomId = [直播房间id] // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    // let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    // this.setData({
    //   roomId,
    //   customParams
    // })
  },
  previewImage(e) {
    const { index, cindex } = getParams(e)
    const images = this.data.comments[cindex].imgs.large
    const cur = images[index]
    wx.previewImage({
      current: cur,
      urls: images,
    })
  },
  async loadInfo() {
    const res = await info().catch(_ => false)
    this.setData({ info: res.data })
  },
})