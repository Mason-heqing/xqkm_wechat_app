// pages/addCard/addCard.js
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceName:'请选择设备',
    idCard:'',
    deviceId:''
  },

  idCard(e){
    const that = this;
    if('' != e.detail.value){
      that.setData({
        idCard:e.detail.value.replace(/\s+/g, ''),
      })
    }else{
      that.setData({
        idCard:'',
      })
    }
  },

  selectDevice(){
    wx.navigateTo({
      url: '../selectDevice/selectDevice?type=1',
    })
  },

  getDeviceId(){
    const that = this;
    if('' != that.data.deviceId){
      wx.showLoading({
        title: '正在获取中',
      })
      req.request("post","device/config/swiping/card?deviceId="+that.data.deviceId,{
      }).then(res=>{
        wx.hideLoading();
        if(res.data.code && 200 == res.data.code){
          that.setData({
            idCard:res.data.data.idNum
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    }else{
      wx.showToast({
        title: '请先选择设备',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  submit(){
    const that = this;
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    console.log(prevPage);
    prevPage.setData({
      ['form.icCard']:that.data.idCard
    })
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.icCard){
      that.setData({
        idCard:options.icCard
      })
    }
    let currentDeviceName = wx.getStorageSync('selectDeviceName');
    let currentDeviceId = wx.getStorageSync('selectDeviceId');
    console.log("currentDeviceId:",currentDeviceId);
    if(currentDeviceName && undefined != currentDeviceName){
       that.setData({
        deviceName:currentDeviceName,
        deviceId:currentDeviceId
       })
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