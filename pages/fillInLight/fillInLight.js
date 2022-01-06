// pages/fillInLight/fillInLight.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    deviceId:'',
    value:0,
    min:null,
    max:null
  },

  sliderchange(e){
    console.log(e.detail.value);
    const that = this;
    that.setData({
      value:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.deviceId && '' != options.deviceId){
      that.setData({
        deviceId:options.deviceId
      })
     }
    that.getFillInLight();
  },

  getFillInLight(){
    const that = this;
    let fillInLight = app.globalData.dataFillInLight;
    console.log("dataFillInLight:",fillInLight);
    that.setData({
      min:fillInLight.minValue,
      max:fillInLight.maxValue,
      value:fillInLight.value
    })
  },

  submit(){
    const that = this;
     let formData = parseInt(that.data.value);
     let sendJson = {};
     let json = {};
     json.level = formData;
     sendJson.audioctl = json;
     if(that.data.preventDuplication){
      wx.showLoading({
        title: '提交中',
      })
      req.request("post","device/config/set",{
        dataConfigStr:sendJson,
        deviceId:that.data.deviceId,
      }).then(res=>{
        wx.hideLoading()
        that.setData({
          preventDuplication:true,
         })
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: "音量设置修改成功",
            icon: 'none',
            duration: 2000
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });
     }
     that.setData({
      preventDuplication:false
     })
    
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