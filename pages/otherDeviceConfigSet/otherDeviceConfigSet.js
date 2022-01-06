// pages/otherDeviceConfigSet/otherDeviceConfigSet.js
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
    indexWorkMode:0,
    indexDoorDelayTime:0,
    indexAntifea:0,
    indexScore:0,
    indexSoundSuccess:0,
    indexSoundStranger:0,
    indexLight:0,
    indexCardFormat:0,
    form:{
      workMode: '',
      doorDelayTime:'',
      authentication:'',
      antifea:'',
      score:'',
      soundSuccess:'',
      soundStranger:'',
      light:'',
      cardFormat:'',
    }
  },

  workMode(){
    const that = this;
    let deviceId = that.data.deviceId
     wx.navigateTo({
        url: '../workMode/workMode?deviceId='+deviceId,
     })
  },
  
  doorDelayTime(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../doorDelayTime/doorDelayTime?deviceId='+deviceId,
   })
  },

  antifea(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../antifea/antifea?deviceId='+deviceId,
   })
  },

  score(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../score/score?deviceId='+deviceId,
   })
  },

  soundSuccess(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../soundSuccess/soundSuccess?deviceId='+deviceId,
   })
  },

  soundStranger(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../soundStranger/soundStranger?deviceId='+deviceId,
   })
  },

  light(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../light/light?deviceId='+deviceId,
   })
  },

  cardFormat(){
    const that = this;
    let deviceId = that.data.deviceId
    wx.navigateTo({
      url: '../cardFormat/cardFormat?deviceId='+deviceId,
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
      that.getDeviceConfig();
     }
  },

  getDeviceConfig(){
    const that = this;
    req.request("post","device/config/get?deviceId="+that.data.deviceId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let jsonData = res.data.data;
        console.log("dataForm:",jsonData[0]);
        jsonData[0].item.forEach(e => {
          if('workMode' == e.key){
            app.globalData.dateWorkMode = e;
            that.setData({
              ['form.workMode']:e.optionName[e.value],
              indexWorkMode:e.value,
            })
          }
          if('doorDelayTime' == e.key){
            app.globalData.dataDoorDelayTime = e;
            that.setData({
              ['form.doorDelayTime']:e.value,
              indexDoorDelayTime:e.value,
             })
                
          }
          if('antifea' == e.key){
            app.globalData.dateAntifea = e;
            that.setData({
              ['form.antifea']:e.optionName[e.value],
              indexAntifea:e.value,
            })
          }
          if('score' == e.key){
            app.globalData.dateScore = e;
            that.setData({
              ['form.score']:e.optionName[e.optionValue.indexOf(e.value)],
              indexScore:e.value,
            })
          }
         if('soundSuccess' == e.key){
          app.globalData.dataSoundSuccess = e;
          that.setData({
            ['form.soundSuccess']:e.optionName[e.optionValue.indexOf(e.value)],
            indexSoundSuccess:e.value,
          })
         }
         if('soundStranger' == e.key){
          app.globalData.dataSoundStranger = e;
          that.setData({
            ['form.soundStranger']:e.optionName[e.optionValue.indexOf(e.value)],
            indexSoundStranger:e.value
          })
         }
         if('light' == e.key){
          app.globalData.dataLight = e;
          that.setData({
            ['form.light']:e.optionName[e.optionValue.indexOf(e.value)],
            indexLight:e.value,
          })
         }
         if('cardFormat' == e.key){
          app.globalData.dataCardFormat = e;
          that.setData({
            ['form.cardFormat']:e.optionName[e.optionValue.indexOf(e.value)],
            indexCardFormat:e.value,
          })
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
    let formData = parseInt(that.data.mode);
    let sendJson = {};
    let json = {};
    json.workMode = that.data.indexWorkMode;
    json.doorDelayTime = that.data.indexDoorDelayTime;
    json.antifea = that.data.indexAntifea;
    json.score = that.data.indexScore;
    json.soundSuccess = that.data.indexSoundSuccess;
    json.soundStranger =  that.data.indexSoundStranger;
    json.light = that.data.indexLight;
    json.cardFormat = that.data.indexCardFormat;
    sendJson.general = json;
    if(that.data.preventDuplication){
      wx.showLoading({
        title: '提交中',
      })
      req.request("post","device/config/set",{
        dataConfigStr:sendJson,
        deviceId:that.data.deviceId,
      }).then(res=>{
        wx.hideLoading();
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: '设备配置修改成功',
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