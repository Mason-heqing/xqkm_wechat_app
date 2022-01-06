// pages/scanAddDevice/scanAddDevice.js
const app = getApp()
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appNamesContent:false,
    deviceNamesContent:false,
    preventDuplication:true,
    isNoBle:'',
    form:{
      appName:'',
      deviceName:''
    }
  },

  trimAppName(e){
    const that = this;
    let t = null;
    if('' == e.detail.value){
      t = false; 
    }else{
      t = true;
    }
    that.setData({
      appNamesContent:t,
      ['form.appName']:e.detail.value
    })
  },

  trimDeviceName(e){
    const that = this;
    let t = null;
    if('' == e.detail.value){
      t = false; 
    }else{
      t = true;
    }
    that.setData({
      deviceNamesContent:t,
      ['form.deviceName']:e.detail.value
    })
  },

  submit(){
    const that = this;
    if(that.data.preventDuplication){
      wx.showLoading({
        title: '提交中',
      })
      req.request("post","app/create/and/add",{
        "appName":that.data.form.appName,
        "deviceName": that.data.form.deviceName,
        "serial": app.globalData.serial,
      }).then(res=>{
        wx.hideLoading();
        that.setData({
          preventDuplication:true,
        })
        if(res.data.code && 200 == res.data.code){
          let deviceId = app.globalData.bleCharacteristicId;
          if(null !=deviceId){
            wx.closeBLEConnection({
              deviceId,
              success (res) {
                console.log(res)
              }
            })
            wx.closeBluetoothAdapter();
          }
          wx.showToast({
            title: '设备添加成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          },2000)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          },2000)
        }
      });
    }
    that.setData({
      preventDuplication:false
    })
    
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let currentAppName = wx.getStorageSync('currentAppName');
    if(options.isNoBle){
      that.setData({
        isNoBle:options.isNoBle
      })
    }
    if('1' == options.isNoBle){
      that.setData({
        appName:currentAppName,
        appNamesContent:true
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