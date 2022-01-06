// pages/tipsLog/tipsLog.js
var req = require('../../request/request.js');
let currentPage = 1;
const pageSize = 100;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grantId:'',
    logList:[],
  },

  tipsLog(){
    const that = this;
    let grantId = that.data.grantId;
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","grant/search/log",{
      // "appId":appId,
      "currentPage":currentPage,
      "grantId":grantId,
      "pageSize":pageSize,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(0 < res.data.data.records.length){
           that.setData({
            logList:res.data.data.records
           })
        }else{
          that.setData({
            logList:[]
           })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const that = this; 
     if(options.grantId && '' != options.grantId){
       that.setData({
        grantId:options.grantId
       })
       that.tipsLog();
     }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})