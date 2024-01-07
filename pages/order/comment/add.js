import { detail, uploadCommentFile, review } from "../../../api/order"
import { getParams } from "../../../utils/util";

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
  },
  rateChange(e) {
    this.setData({ 'form.rating': e.detail })
  },
  addImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.form.imgs
    if (images.length >= 6) {
      return
    }
    wx.chooseImage({
      count: 6 - images.length,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.showLoading({
          title: '上传中',
        })
        const allPromise = tempFilePaths.map((image) => {
          return uploadCommentFile(image, { order_no: this.data.order_no })
        })

        Promise.all(allPromise).then(res => {
          console.log('allPromise', res)
          wx.hideLoading()
          res.forEach(item => {
            item = JSON.parse(item)
            if (item.code === 0) {
              images.push(item.data.url)
            } else {
              wx.$message.error('上传失败')
            }
          })
          this.setData({ 'form.imgs': images })
        })

      }
    })
  },
  bindInpuntValue(e) {
    this.setData({ 'form.comment': e.detail.value })
  },
  async submit() {
    await wx.$loading.show()
    const res = await review(this.data.id, this.data.form).catch(_ => false)
    wx.$loading.hide()
    await wx.$message.success()
    wx.navigateBack()
  },
  close(e) {
    const { index } = getParams(e)
    const images = this.data.form.imgs
    images.splice(index, 1)
    this.setData({ 'form.imgs': images })
  }
})