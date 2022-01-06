// pages/eqConfig/eqConfig.js
const req = require('../../request/request.js');
const dataForm = require('../../utils/json.js').dataFrom
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    deviceId:'',
    dateAggregate:[],
    form:{
      date: '',
      devicedDirection:'',
      authentication:'',
      openDoor:'',
      fillInLight:'',
      volume:'',
      distinguish:'',
      screen:'',
      faceParameter:'',
      hardwareApi:'',
    }
  },

  dateSet(){
    const that = this;
    let deviceId = that.data.deviceId
     wx.navigateTo({
        url: '../setDate/setDate?deviceId='+deviceId,
     })
  },
  
  deviceDirection(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../deviceDirection/deviceDirection?deviceId='+deviceId,
   })
  },

  authentication(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../authentication/authentication?deviceId='+deviceId,
   })
  },

  openDoorTime(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../openDoorTime/openDoorTime?deviceId='+deviceId,
   })
  },

  volumeSet(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../volumeSet/volumeSet?deviceId='+deviceId,
   })
  },

  fillInLight(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../fillInLight/fillInLight?deviceId='+deviceId,
   })
  },

  recognitionTips(){
    const that = this;
    let deviceId = that.data.deviceId;
    wx.navigateTo({
      url: '../recognitionTips/recognitionTips?deviceId='+deviceId,
   })
  },

  screenSaver(){
    const that = this;
    let deviceId = that.data.deviceId;
    wx.navigateTo({
      url: '../screenSaver/screenSaver?deviceId='+deviceId,
   })
  },

  faceParameter(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../faceParameter/faceParameter?deviceId='+deviceId,
   })
  },

  hardwareInterface(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../hardwareInterface/hardwareInterface?deviceId='+deviceId,
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
  },

  getDeviceConfig(){
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","device/config/get?deviceId="+that.data.deviceId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let jsonData = res.data.data;
        console.log("dataForm:",jsonData);
        jsonData.forEach(e => {
          if('time' == e.groupKey){
            app.globalData.dateAggregate = e.item;
            e.item.forEach(m =>{
              if('currenttime' == m.key){
                that.setData({
                  ['form.date']:m.value
                })
              }
            })
          }
          if('screensaver' == e.groupKey){
            app.globalData.dataScreensaver = e.item;
          }
          if('vaparam' == e.groupKey){
            e.item.forEach(m =>{
              if('direction' == m.key){
                app.globalData.dataDevicedDirection = m;
                that.setData({
                  ['form.devicedDirection']:m.optionName[m.optionValue.indexOf(m.value)]
                })
              }
              if('verifySec' == m.key){
                app.globalData.dataVerifySec = m;
                that.setData({
                  ['form.openDoor']:m.value + 's'
                })
              }
            })
          }
          if('switchCtrl' == e.groupKey){
            app.globalData.dataSwitchCtrl = e.item;
            console.log("获取硬件接口信息：",e.item);
          }
          if('ledctl' == e.groupKey){
            e.item.forEach(m =>{
              if('mode' == m.key){
                app.globalData.dataVolumeSet = m;
                that.setData({
                  ['form.fillInLight']:m.optionName[m.value]
                })
              }
            })
          }
          if('audioctl' == e.groupKey){
            e.item.forEach(m =>{
              if('level' == m.key){
                app.globalData.dataFillInLight = m;
                that.setData({
                ['form.volume']:m.value
              })
              }
            })
        }
        if('OpenDoorModeSet' == e.groupKey){
          e.item.forEach(m =>{
            if('OpenDoor' == m.key){
              app.globalData.dataAuthentication = m
              that.setData({
              ['form.authentication']:m.optionName[m.optionValue.indexOf(m.value)]
            })
            }
          })
        }
         if('VoiceTips' == e.groupKey){
          app.globalData.dataDistinguish = e.item;
         }
         if('weigand' == e.groupKey){
          app.globalData.dataWeigand = e.item;
         }
         if('vaparam' == e.groupKey){
          app.globalData.dataVaparam = e.item;
         }
         if('serial' == e.groupKey){
          app.globalData.dataSerial = e.item;
         }
        });
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  submit(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    if(that.data.preventDuplication){
      wx.showLoading({
        title: '解绑中',
      })
      req.request("post","device/delete",{
        "appId":appId,
        "deviceIdList": [that.data.deviceId],
      }).then(res=>{
        wx.hideLoading();
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: '设备解绑成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
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
      preventDuplication:false,
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
    const that = this;
    that.getDeviceConfig();
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