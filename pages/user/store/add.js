import { getParams, redirect } from "../../../utils/util"
import { provinces, cities, districts } from '../../../api/address'
import { uploadCommonFile } from "../../../api/user"
import { createStore } from "../../../api/store"
// pages/user/store/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name: '',
      company_name: '',
      license_no: '',
      account_no: '',
      contact: '',
      mobile: '',
      province_id: 0,
      city_id: 0,
      street: '',
      contract: [],
      id_card: [],
      photo: []
    },
    provinces: [],
    cities: [],
    districts: [],
    multiArray: [[], [], []],
    multiIndex: [0, 0, 0],
    fileList: {
      contract: [],
      id_card: [],
      photo: []
    },
    errors: {
      name: false,
      // company_name: false,
      // license_no: false,
      // account_no: false,
      contact: false,
      mobile: false,
      province_id: false,
      // city_id: false,
      street: false,
      // contract: false,
      // id_card: false,
      // photo: false
    }
  },

  onLoad: async function (options) {
    await this.getProvinces()
    await this.getCities(this.data.multiArray[0][0].value)
    await this.getDistricts(this.data.multiArray[1][0].value)
  },

  onShow: function () {

  },
  onChange(e) {
    const { form, errors } = this.data
    const { key } = getParams(e)
    const value = e.detail
    form[key] = value
    errors[key] = false
    this.setData({ form, errors })
    console.log(key, value)
  },
  onInputChange(e) {
    const { form, errors } = this.data
    const { key } = getParams(e)
    const { value } = e.detail
    form[key] = value
    errors[key] = false
    this.setData({ form, errors })
    console.log(key, value)
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
    const { form, errors } = this.data
    form.province_id = this.data.multiArray[0][this.data.multiIndex[0]].value
    form.city_id = this.data.multiArray[1][this.data.multiIndex[1]].value
    form.district_id = this.data.multiArray[2][this.data.multiIndex[2]].value
    errors.province_id = false
    this.setData({
      form, errors
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
    this.setData({ fileList, errors, form })

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
      return12
    }
    await wx.$loading.show()
    const res = await createStore(this.data.form).catch(res => {
      console.log('catch', res)
      if (res.statusCode !== 200) {
        wx.$confirm('提示', Object.values(res.data.errors)[0][0])
      }
      return false
    })
    console.log('res', res)
    if (res && res.success) {
      await wx.$message.success()
      redirect('/pages/user/store/detail', [`id=${res.data.store_id.id}`], true)
    }else{
      wx.$confirm('提示', res.msg)
    }
    wx.$loading.hide()
  }

})