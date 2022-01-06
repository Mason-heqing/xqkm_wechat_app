// pages/screenSaver/screenSaver.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    form:{
      enable:false,
      times:'',
      style:'',
    },
    index:'',
    indexs:'',
    timeName:[],
    timeVale:[],
    timeIndex:0,
    screenStyleName:[],
    screenStyleValue:[],
    screenStyleIndex:0
  },

  switchChangeEnable(e){
    const that = this;
    that.setData({
      ['form.enable']:e.detail.value
    })
  },

  bindPickerChangeTimes(e){
    console.log(e);
    const that = this;
    let value = parseInt(e.detail.value);
    that.setData({
      timeIndex:value
    })
  },
  bindPickerChangeStyle(e){
    const that = this;
    let value = parseInt(e.detail.value);
    that.setData({
      screenStyleIndex:value
    })
  },

  screenSaver(){
    const that = this;
    let dataScreensaver = app.globalData.dataScreensaver;
    dataScreensaver.forEach((e)=>{
      if('enable' == e.key){
         that.setData({
          ['form.enable']:e.value,
         })
      }else if('time' == e.key){
       let index = e.optionValue.indexOf(e.value);
       that.setData({
         timeName:e.optionName,
         timeValue:e.optionValue,
         timeIndex:index
       })
     }else if('InputType' == e.key){
       let index = e.optionValue.indexOf(e.value);
       that.setData({
         inputTypeName:e.optionName,
         inputTypeValue:e.optionValue,
         inputTypeIndex:index
       })
     }else if('index' == e.key){
      let index = e.optionValue.indexOf(e.value);
      that.setData({
        screenStyleName:e.optionName,
        screenStyleValue:e.optionValue,
        screenStyleIndex:index
      })
     }
   })
  },

   formSubmit(e){
      const that = this;
      let formData = e.detail.value;
      let json = {};
      let sendJson = {};
      if('true' == formData.enable){
        json.enable = true;
      }else{
        json.enable = false;
      }
      json.time = parseInt(formData.time);
      json.index = parseInt(formData.index);
      sendJson.screensaver = json;
      if(that.data.preventDuplication){
        wx.showLoading({
          title: '提交中',
        })
        req.request("post","device/config/set",{
          dataConfigStr:sendJson,
          deviceId:that.data.deviceId,
        }).then(res=>{
          wx.hideLoading()
          setTimeout(()=>{
            that.setData({
              preventDuplication:true,
            })
          },2300)
          if(res.data.code && 200 == res.data.code){
            wx.showToast({
              title: "屏幕保护修改成功",
              icon: 'none',
              duration: 2000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },2000)
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
        preventDuplication:false,
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
   that.screenSaver();
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