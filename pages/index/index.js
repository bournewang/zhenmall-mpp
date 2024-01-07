// index.js
// 获取应用实例

import { fetchList } from "../../api/goods"
import { fetchList as bannerList } from "../../api/banner"
import { getParams, getScene, log, redirect } from "../../utils/util"
import { add } from '../../api/cart'
import { wxLogin } from "../../utils/request"
import { redpackets, openRedpacket, info } from '../../api/user'
const defaultImage = '/static/images/search_no.png'
Page({
  data: {
    components: [
      {
        type: 'carousel', options: {
          images: [
            { url: defaultImage, route: {} },
            { url: defaultImage, route: {} }
          ],
          height: '750rpx'
        }
      },
      {
        type: 'custom'
      },
      {
        type: 'title', options: {
          type: 1,
          title: '热门',
          titleColor: '#333',
          backgroundColor: '',
          subtitle: 'RECOMMEND',
          subtitleColor: '#333',
        }
      },
      {
        type: 'goods',
        options: {
          type: 1,
          visible: 1,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 0,
          marginBottom: 0,
          goodsMargin: 20,
          titleColor: '#000',
          goods: [

          ],
        }
      }
    ],
    shop: {},
    selectStore: false,
    goods: [],
    scene: {
      referer_id: 0
    },
    referer_id: 0,


    redpackets: {},
    redpacketsCount: 0,

    redpacketBtnClass: '',
    redpacketStep: 0, //0 关闭， 1 显示红包， 2 显示打开后的红包
    redpacketAmount: 0,
    info: {}
  },

  onLoad(options) {
    console.log('options', options)
    if (options.scene) {
      const params = getScene(options.scene)
      this.data.scene = params
      console.log('params',params)
      if (params.referer_id) {
        wx.setStorageSync('referer_id', params.referer_id)
      }
    }
    let referer_id = options.referer_id
    if (referer_id) {
      console.log('referer_id', referer_id)
      wx.setStorageSync('referer_id', referer_id)
    }

  },

  onShow() {
    // const referer_id = this.data.referer_id
    // if (referer_id) {
    //   wxLogin().then(res => {
    //     // this.data.scene.referer_id = 0
    //   }, loginRes => {
    //     //还未注册跳到注册页面
    //     redirect(`/pages/user/center/login?referer_id=${referer_id}`)
    //   })
    // }
    this.loadInfo()
    this.getRedpackets()
    this.init()
  },


  async init() {
    this.getGoods()
    this.loadBanners()
  },
  async loadBanners() {
    const res = await bannerList().catch(_ => false)
    if (res) {
      this.setData({
        'components[0].options.images': res.data.map(i => {
          return { url: i.image, route: { path: i.link } }
        })
      })
    }
  },
  async getGoods() {
    const res = await fetchList()
    this.setData({ 'components[3].options.goods': res.data.items })
  },

  redirect(e) {
    const { url } = e.currentTarget.dataset
    redirect(url)
  },
  onShareAppMessage() {
    return {
      path: `/pages/index/index?referer_id=${this.data.info.id}`
    }
  },
  async addCart(e) {
    const { id } = getParams(e)
    const res = await add(id).catch(err => {
      console.log('err', err)
      if (err.statusCode === 403) {
        redirect('/pages/user/center/login')
      }
      return false
    })
    if (res) {
      // wx.showToast({
      //   title: '添加购物车成功',
      // })
      redirect('/pages/cart/index')
    }
  },

  showbtn() {
    if (!this.data.info.id) {
      redirect('/pages/user/center/login')
      return
    }
    this.setData({ redpacketStep: 1 })
  },
  async openbtn() {
    if (this.data.opening) {
      return
    }
    this.data.opening = 1
    this.setData({ redpacketBtnClass: 'xuanzhuan' })
    setTimeout(async () => {
      const redpacketId = Object.keys(this.data.redpackets)[0]
      if (!redpacketId) {
        return
      }
      const redpacketAmount = this.data.redpackets[redpacketId]
      const res = await openRedpacket(redpacketId).catch(_ => false)
      if (res && !res.code) {
        this.getRedpackets()
      }
      this.setData({ redpacketBtnClass: '', redpacketStep: 2, redpacketAmount })
      this.data.opening = 0
    }, 800)
  },
  continuebtn() {
    this.showbtn()
    this.openbtn()
  },
  closebtn() {
    this.setData({ redpacketStep: 0 })
  },
  async getRedpackets() {
    const res = await redpackets().catch(err => {
      if (err.statusCode === 403) {
        this.setData({ redpackets: { 0: 0 }, redpacketsCount: 1 })
      }
      return false
    })

    if (res && res.data) {
      this.setData({ redpackets: res.data, redpacketsCount: Object.keys(res.data).length })
    }
  },
  async loadInfo() {
    const res = await info().catch(_ => false)
    if (res) {
      this.setData({ info: res.data || {} })
    }
  },
})
