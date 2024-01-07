import { getParams, redirect } from "../../../utils/util"
import { provinces, cities, districts } from '../../../api/address'
import { uploadCommonFile } from "../../../api/user"
import { healthCreate } from "../../../api/user"
// pages/user/store/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      detail: '',
      imgs: [],
    },
    provinces: [],
    cities: [],
    districts: [],
    multiArray: [[], [], []],
    multiIndex: [0, 0, 0],
    fileList: {
      imgs: [],
    },
    errors: {
      detail: false,
      imgs: false

    },
    imgs: []
  },

  onLoad: async function (options) {

  },

  onShow: function () {

  },
  onChange(e) {
    const { form, errors } = this.data
    const { key } = getParams(e)
    const value = e.detail
    form[key] = value
    errors[key] = false
    const str = `form.${key}`
    this.setData({ form, errors })
    console.log(key, value)
  },
  onInputChange(e) {
    const { form, errors } = this.data
    const { key } = getParams(e)
    const {value} = e.detail
    form[key] = value
    errors[key] = false
    const str = `form.${key}`
    this.setData({ form, errors })
    console.log(key, value)
  },
  async afterRead(e) {
    const { fileList, form, errors } = this.data
    const { key } = getParams(e)
    const { file } = e.detail
    console.log('files', file)
    for (let i = 0; i < file.length; i++) {
      const res = await uploadCommonFile(file[i].url)
      res = JSON.parse(res)
      fileList[key].push({ url: res.data.url })
    }
    form[key] = fileList[key].map(f => f.url)
    errors[key] = false
    const str = `form.${key}`
    this.setData({ fileList, errors, imgs: fileList[key].map(f => f.url) })

  },
  addImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.form.imgs
    if (images.length >= 5) {
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
          return uploadCommonFile(image)
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
          this.setData({ 'form.imgs': images, 'errors.imgs': false })
        })

      }
    })
  },
  delFile(e) {
    const { fileList } = this.data
    const { key } = getParams(e)
    const { index } = e.detail
    fileList[key].splice(index, 1)
    this.setData({ fileList })
  },
  async submit() {
    const { form, errors } = this.data
    let ok = true
    Object.keys(form).map(k => {

      if (errors[k] !== undefined && (!form[k] || (typeof (form[k]) == 'object' && !form[k].length))) {
        errors[k] = true
        ok = false
      }
    })
    this.setData({ errors })
    if (!ok) {
      return
    }
    await wx.$loading.show()
    const res = await healthCreate(this.data.form).catch(_ => false)
    if (res) {
      await wx.$message.success()
      redirect('/pages/user/health/detail', [`id=${res.data.id}`], true)
    }
    wx.$loading.hide()


  },
  close(e) {
    const { index } = getParams(e)
    const images = this.data.form.imgs
    images.splice(index, 1)
    this.setData({ 'form.imgs': images })
  }

})