// pages/authorization/authorization.js
const req = require('../../request/request.js');
let currentPage = 1;
let pageSize = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      // {
      //   name:'802大门口'
      // },
      // {
      //   name:'802会议室'
      // },
      // {
      //   name:'财务办公室'
      // },
      // {
      //   name:'总经理办公司'
      // },
    ]
  },

  authorization(e){
    console.log(e);
    let info = e.currentTarget.dataset.item;
    let deviceId = info.deviceId;
    let deviceName = info.deviceName;
    wx.navigateTo({
      url: '../authorizationList/authorizationList?deviceId=' + deviceId + '&deviceName=' + deviceName,
   })
  },


  getDeviceList(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","device/search",{
      "appId": appId,
      "currentPage": currentPage,
      "name": "",
      "id": "",
      // "online":true,
      "pageSize": pageSize,
      "serial": ""
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        currentPage++;
        if (currentPage >= res.data.data.pages+1) {
          currentPage = res.data.data.pages+1
        } 
        let data = res.data.data.records;
        let oldData = that.data.list;
        if(0 < data.length){
          that.setData({
            list:oldData.concat(data),
          }) 
        }else{
          if(0 === that.data.list){
            that.setData({
              list:[]
            }) 
          }
          wx.showToast({
            title: '没有数据了',
            icon: 'none',
            duration: 2000
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
    currentPage = 1;
    that.getDeviceList();
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
    const that = this;
    currentPage = 1;
    that.setData({
      list:[]
    })
    that.getDeviceList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉刷新")
    const that = this;
    that.getDeviceList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})