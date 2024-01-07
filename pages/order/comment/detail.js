import { detail} from "../../../api/order"
import { getParams } from "../../../utils/util";
import {detail as commentDetail} from '../../../api/review'
Page({
  data: {
    id: 0,
    activeNames: [0],
    order: {},
    form: {
      rating: 5,
      comment: '',
      imgs: []
    }
  },

  onLoad: function (options) {
    this.setData({ id: options.id })
  },
  onShow: function () {
    this.loadOrder()
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  async loadOrder() {
    const res = await detail(this.data.id).catch(_ => false)
    this.setData({ order: res.data })
    this.loadComment(res.data.review_id)
  },
  async loadComment(id){
    const res = await commentDetail(id).catch(_=>false)
    this.setData({form: res.data})
  }
})