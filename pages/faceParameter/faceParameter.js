// pages/faceParameter/faceParameter.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    preventDuplication:true,
    similarThresContent:false,
    detThresContent:false,
    liveThresContent:false,
    similarThresMin:0,
    similarThresMax:0,
    detThresMin:0,
    detThresMax:0,
    liveSwitchName:[],
    liveSwitchValue:[],
    liveSwitchIndex:0,
    liveThresMin:0,
    liveThresMax:0,
    qualityContent:false,
    form:{
      similarThres:'',//N匹配阈值
      liveThres:'',//1匹配阈值
      quality:''
    }
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  trimSimilarThres(e){
     console.log(e.detail.value);
     const that = this;
     let value = that.validateNumber(e.detail.value)
     if('' == e.detail.value){
       that.setData({
        similarThresContent:false
       })
     }else{
      that.setData({
        similarThresContent:true
       })
     }
     if(parseInt(value) > that.data.similarThresMax){
        that.setData({
           ['form.similarThres']:that.data.similarThresMax
        })
     }else if(parseInt(value) < that.data.similarThresMin){
        that.setData({
          ['form.similarThres']:that.data.similarThresMin
        })
     }else{
      that.setData({
        ['form.similarThres']:value
      })
     }
  },

  trimDetThres(e){
    const that = this;
    let value = that.validateNumber(e.detail.value)
    if('' == e.detail.value){
      that.setData({
        detThresContent:false
      })
    }else{
     that.setData({
      detThresContent:true
      })
    }
    if(parseInt(value) > that.data.detThresMax){
       that.setData({
          ['form.detThres']:that.data.detThresMax
       })
    }else if(parseInt(value) < that.data.detThresMin){
       that.setData({
         ['form.detThres']:that.data.detThresMin
       })
    }else{
     that.setData({
       ['form.detThres']:value
     })
    }
  },

  bindPickerChangeLiveSwitch(e){
    const that = this;
    that.setData({
      liveSwitchIndex:e.detail.value,
    })
  },

  trimLiveThres(e){
    let that = this;
    let value = that.validateNumber(e.detail.value)
    if('' == e.detail.value){
      that.setData({
        liveThresContent:false
      })
    }else{
     that.setData({
      liveThresContent:true
      })
    }
    if(parseInt(value) > that.data.liveThresMax){
      that.setData({
         ['form.liveThres']:that.data.liveThresMax
      })
   }else if(parseInt(value) < that.data.liveThresMin){
      that.setData({
        ['form.liveThres']:that.data.liveThresMin
      })
   }else{
    that.setData({
      ['form.liveThres']:value
    })
   }
  },

  qualityChange(e){
    const that = this;
    let value = that.validateNumber(e.detail.value)
    if('' != value){
      that.setData({
        ['form.quality']:value,
        qualityContent:true
      })
    }else{
      that.setData({
        ['form.quality']:'',
        qualityContent:false
      })
    }
    
  },


  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  getFaceParameter(){
    const that = this;
    let dataVaparam = app.globalData.dataVaparam;
    console.log("dataVaparam:",dataVaparam);
    dataVaparam.forEach((e)=>{
      if("SimilarThres" == e.key){
        that.setData({
          ['form.similarThres']:e.value,
          similarThresMin:e.minValue,
          similarThresMax:e.maxValue,
          similarThresContent:true
        })
      }
      if("DetThres" == e.key){
        that.setData({
          ['form.detThres']:e.value,
          detThresMin:e.minValue,
          detThresMax:e.maxValue,
          detThresContent:true 
        })
      }
      if('quality' == e.key){
        that.setData({
          ['form.quality']:e.value,
          qualityContent:true
         })
      }
      if('LiveSwitch' == e.key){
         that.setData({
          liveSwitchName:e.optionName,
          liveSwitchValue:e.optionValue,
          liveSwitchIndex:e.optionValue.indexOf(e.value),
          liveThresContent:true
         })
      }
      if("LiveThres" == e.key){
        that.setData({
          ['form.liveThres']:e.value,
          liveThresMin:e.minValue,
          liveThresMax:e.maxValue,
        })
      }
    })
  },

  formSubmit(e){
    const that = this;
    let formData = e.detail.value;
    let sendJson = {};
    let json = {};
    json.SimilarThres = parseInt(formData.similarThres);
    json.DetThres = parseInt(formData.detThres);
    json.LiveSwitch = parseInt(formData.liveSwitch);
    json.LiveThres = parseInt(formData.liveThres);
    json.quality = parseInt(formData.quality);
    sendJson.vaparam = json;
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const that = this;
     if(options.deviceId && '' != options.deviceId){
      that.setData({
        deviceId:options.deviceId
      })
     }
     that.getFaceParameter();
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