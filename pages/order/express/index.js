import { detail } from "../../../api/order"
Page({

  data: {
    id: 0,
    active: 0,
    steps: [
     
    ],
  },

  onLoad: function (options) {
      this.setData({id: options.id})
      this.loadOrder()
  },

  onShow: function () {

  },
  async loadOrder() {
    const res = await detail(this.data.id).catch(_ => false)
    const steps = res.data.express.map(e => {
      return {
        text: e.context,
        desc: e.time
      }
    })
    this.setData({ order: res.data,steps })
  },
})