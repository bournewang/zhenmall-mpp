// pages/user/address/add.js
import { provinces, cities, districts, create, detail, update } from '../../../api/address'
import { getValues } from '../../../utils/util'
Page({
  data: {
    formData: {
      contact: '',
      mobile: '',
      province_id: 0,
      province: '',
      city_id: 0,
      city: '',
      district_id: 0,
      district: '',
      street: '',
      default: 0
    },
    provinces: [],
    cities: [],
    districts: [],
    multiArray: [[], [], []],
    multiIndex: [0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.getProvinces()
    if (options.id) {
      const { multiIndex } = this.data
      const res = await detail(options.id)
      if (res.data.province_id) {
        if (res.data.province_id) {
          const curProvince = this.data.multiArray[0].findIndex(p => p.value === res.data.province_id)
          multiIndex[0] = curProvince > -1 ? curProvince : 0
          await this.getCities(res.data.province_id)
        }
        if (res.data.city_id) {
          const curCity = this.data.multiArray[1].findIndex(p => p.value === res.data.city_id)
          multiIndex[1] = curCity > -1 ? curCity : 0
          await this.getDistricts(res.data.city_id)
        }
        if (res.data.district_id) {
          const curD = this.data.multiArray[2].findIndex(p => p.value === res.data.district_id)
          multiIndex[2] = curD > -1 ? curD : 0
        }
      }
      this.setData({ multiIndex, formData: res.data })
    } else {
      await this.getCities(this.data.multiArray[0][0].value)
      await this.getDistricts(this.data.multiArray[1][0].value)
    }

  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getProvinces() {
    const res = await provinces().catch(_ => false)
    if (res) {
      this.setData({ 'multiArray[0]': res })
    }
  },
  async getCities(pid) {
    const res = await cities(pid).catch(_ => false)
    if (res) {
      this.setData({ 'multiArray[1]': res })
    }

  },
  async getDistricts(cid) {
    const res = await districts(cid).catch(_ => false)
    if (res) {
      this.setData({ 'multiArray[2]': res })
    }
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
    })
    const { formData } = this.data
    formData.province_id = this.data.multiArray[0][this.data.multiIndex[0]].value
    formData.city_id = this.data.multiArray[1][this.data.multiIndex[1]].value
    formData.district_id = this.data.multiArray[2][this.data.multiIndex[2]].value
    this.setData({
      formData,
    })
  },
  async bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    switch (e.detail.column) {
      case 0:
        //改变省份
        await this.getCities(this.data.multiArray[0][e.detail.value].value)
        this.getDistricts(this.data.multiArray[1][0].value)
        break;
      case 1:
        this.getDistricts(this.data.multiArray[1][e.detail.value].value)
        break;
    }

  },
  handleInputAddr(e) {
    const { value } = e.detail
    this.setData({ 'formData.street': value })
  },
  resetAddr() {
    this.setData({ 'formData.street': '' })
  },
  handleInputUsername(e) {
    const { value } = e.detail
    this.setData({ 'formData.contact': value })
  },
  handleInputMobile(e) {
    const { value } = e.detail
    this.setData({ 'formData.mobile': value })
  },
  clickDefault() {
    this.setData({ 'formData.default': this.data.formData.default ? 0 : 1 })
  },
  async formSubmit() {
    if (this.data.formData.id) {
      const res = await update(this.data.formData.id, this.data.formData).catch(_ => false)
      if (res) {
        await wx.$message.success()
        wx.navigateBack()
      }
    } else {
      const res = await create(this.data.formData).catch(_ => false)
      if (res) {
        await wx.$message.success()
        wx.navigateBack()
      }
    }
  }

})