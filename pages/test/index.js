// pages/test/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      rating: 5,
      comment: '',
      imgs: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindInpuntValue(e) {
    this.setData({ 'form.comment': e.detail.value })
  },
  addImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.form.imgs
    if (images.length >= 5) {
      return
    }
    wx.chooseImage({
      count: 6 - images.length,
      sizeType: ['compressed'],
      sourceType: [
        // 'album',
        'camera'
      ],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)

      }
    })
  },
})