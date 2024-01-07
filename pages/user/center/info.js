// pages/user/center/info.js
import { info, mobile, type, saveInfo } from '../../../api/user'
import { removeLocalToken } from '../../../utils/auth'
Page({
  data: {
    info: {},
    array: ['customer', 'manager', 'clerk'],
    index: 0,
    editing: 0,
    old_info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  async loadInfo() {
    const res = await info().catch(_ => false)
    const index = this.data.array.indexOf(res.data.type)
    this.setData({ info: res.data, index, old_info: { ...res.data } })
  },
  async getPhoneNumber(e) {
    console.log('getPhoneNumber', e.detail.code)
    if (!e.detail.code) {
      return
    }
    await wx.$loading.show()
    const res = await mobile({ code: e.detail.code }).catch(_ => false)
    wx.$loading.hide()
    if (res) {
      wx.$message.success()
      this.loadInfo()
    } else {
      wx.$message.error()
    }
  },
  async upType($type) {
    await wx.$loading.show()
    const res = await type($type).catch(_ => false)
    wx.$loading.hide()
    this.loadInfo()
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const type = this.data.array[e.detail.value]
    this.upType(type)
    this.setData({
      index: e.detail.value
    })
  },
  bindToEdit() {
    this.setData({ editing: 1 })
  },
  chooseAvatar(e) {
    console.log(e)
    this.setData({ 'info.avatar': e.detail.avatarUrl })
  },
  bindinputnickname(e) {
    console.log(e)
    this.setData({ 'info.nickname': e.detail.value })
  },
  cancelSave() {
    this.setData({ editing: 0, info: this.data.old_info })
  },
  save() {
    let { nickname, avatar, alipay } = this.data.info
    if(!nickname){
      wx.$message.error('请输入昵称')
      return
    }
    if(!avatar){
      wx.$message.error('请选择头像')
      return
    }
    if(!alipay){
      alipay = ""
      // wx.$message.error('请输入支付宝账号')
    }
    console.log()
    saveInfo({ nickname, avatar, alipay }).then(res => {
      this.setData({ editing: 0 })
      this.loadInfo()
    })
  },
  outLogin() {
    wx.$confirm('确定退出么?').then(_ => {
      removeLocalToken()
      wx.navigateBack()
    })

  },
  bindinputAlipay(e){
    this.setData({ 'info.alipay': e.detail.value })
  }

})