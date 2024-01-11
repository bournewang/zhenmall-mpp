// pages/user/friends/direct.js
import {directTeam} from '../../../api/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: {},
    list: []
  },

  onLoad(options) {
    directTeam().then(res=>{ 
      this.setData({ list:res.data})
    })
  },

  onReachBottom() {

  },

})