// pages/user/friends/rank.js
import {team, directMembersRange } from '../../../api/user'
Page({
  data: {
    team:{},
    list: [
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onShow() {
    this.getTeam()
    this.getRankList()
  },

  async getTeam(){
    const res = await team().catch(_=>false)
    if(res){
      this.setData({team:  res.data})
    }
  },
  async getRankList(){
    const res = await directMembersRange().catch(_=>false)
    if(res){
      this.setData({list: res.data})
    }

  },
 
  onPullDownRefresh() {

  },

  onReachBottom() {

  },
  onShareAppMessage() {

  }
})