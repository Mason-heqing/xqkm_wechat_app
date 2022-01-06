// pages/recognitionTips/recognitionTips.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    deviceId:'',
    switchChecked:false,
    successTips:[],
    successIndex:0,
    failTips:[],
    failIndex:0,
    displayName:false,
    isShowName:0,
  },

  bindPickerSuccessChange(e){
    const that = this;
    that.setData({
      successIndex:parseInt(e.detail.value)
    })
  },

  bindPickerFailChange(e){
    const that = this;
    that.setData({
      failIndex:parseInt(e.detail.value)
    })
  },

  switchChange(e){
    const that = this;
    that.setData({
      switchChecked:e.detail.value
    })
  },

  switchChangeDisplayName(e){
    const that = this;
    if(e.detail.value){
      that.setData({
        displayName:e.detail.value,
        isShowName:1
      })
    }else{
      that.setData({
        displayName:e.detail.value,
        isShowName:0
      })
    }
  },

  getRecognitionTips(){
    const that = this;
    let recognitionTips = app.globalData.dataDistinguish;
    for(let i =0;i<recognitionTips.length;i++){
       if('SuccessTips' == recognitionTips[i].key){
          if(recognitionTips[i].optionName){
              that.setData({
                successTips:recognitionTips[i].optionName,
                successIndex:recognitionTips[i].optionValue.indexOf(recognitionTips[i].value),
              })
          }
       }
       if('FailTips' == recognitionTips[i].key){
          if(recognitionTips[i].optionName){
            that.setData({
              failTips:recognitionTips[i].optionName,
              failIndex:recognitionTips[i].value,
            })
          }
       }
       if('displayName' == recognitionTips[i].key){
         if(1 == recognitionTips[i].value){
           that.setData({
            displayName:true,
            isShowName:1
           })
         }else{
          that.setData({
            displayName:false,
            isShowName:0
           })
         }
       } 
    }
  },

  formSubmit(e){
    const that = this;
    // let formData = e.detail.value;
    // console.log("提交信息：",formData)

    let formData = e.detail.value;
    let recognitionTips = app.globalData.dataDistinguish;
    for(let i =0;i<recognitionTips.length;i++){
      if('SuccessTips' == recognitionTips[i].key){
        formData.SuccessTips = parseInt(recognitionTips[i].optionValue[parseInt(formData.SuccessTips)])
      }
    }

    let sendJson = {};
    let json = {};
    json.SuccessTips = parseInt(formData.SuccessTips);
    json.FailTips = parseFloat(formData.FailTips);
    json.displayName = parseInt(formData.displayName);
    sendJson.VoiceTips = json;
    if(that.data.preventDuplication){
      wx.showLoading({
        title: '提交中',
      })
      req.request("post","device/config/set",{
        dataConfigStr:sendJson,
        deviceId:that.data.deviceId,
      }).then(res=>{
        wx.hideLoading();
        that.setData({
          preventDuplication:true,
        })
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: "补光灯模式修改成功",
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
    that.getRecognitionTips();
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