// pages/doorDelayTime/doorDelayTime.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    inputValue:'',
    max:0,
    min:0,
  },

  trimTimes(e){
    let that = this;
    let value = that.validateNumber(e.detail.value)
    that.setData({
      inputValue: value
    })    
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  doorDelayTime(){
    const that = this;
    let doorDelayTime = app.globalData.dataDoorDelayTime;
    console.log("doorDelayTime:",doorDelayTime);
    that.setData({
      inputValue:doorDelayTime.value,
      max:doorDelayTime.maxValue,
      min:doorDelayTime.minValue,
    })
  },

  submit(){
    const that = this;
    let formData = parseInt(that.data.inputValue);
    if(formData > that.data.max){
      wx.showToast({
        title: "开锁持续时间最大值为："+that.data.max+",请重新设置开锁持续时间",
        icon: 'none',
        duration: 2000
      })
      return false;
    }else if(formData < that.data.min){
      wx.showToast({
        title: "开锁持续时间最小值为："+that.data.max+",请重新设置开锁持续时间",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
      let pages = getCurrentPages();   //当前页面
      let prevPage = pages[pages.length - 2];   //上一页面
      console.log(prevPage);
      prevPage.setData({
        indexDoorDelayTime:formData,
        ['form.doorDelayTime']:formData
      })
      wx.navigateBack({
        delta: 1
      })
  //   let sendJson = {};
  //   let json = {};
  //   json.doorDelayTime = formData;
  //   sendJson.general = json;
  //  req.request("post","device/config/set",{
  //    dataConfigStr:sendJson,
  //    deviceId:that.data.deviceId,
  //  }).then(res=>{
  //    if(res.data.code && 200 == res.data.code){
  //      wx.showToast({
  //        title: "开锁持续时间修改成功",
  //        icon: 'none',
  //        duration: 2000
  //      })
  //      wx.navigateBack({
  //        delta: 1
  //      })
  //    }else{
  //      wx.showToast({
  //        title: res.data.msg,
  //        icon: 'none',
  //        duration: 2000
  //      })
  //    }
  //  });
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
    that.doorDelayTime();
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