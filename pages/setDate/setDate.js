// pages/setDate/setDate.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    deviceId:'',
    jurisdiction:1,
    dateAggregate:[],
    timeControl:[],
    timeControlValue:[],
    timeControlIndex:0,
    timeZone:[],
    timeZoneValue:[],
    index:0,
    date:'',
    time:'',
    second:'',
    ntpServer:[],
    ntpServerValue:[],
    ntpServerIndex:0,
    form:{

      // switchChecked: true,
      date:'',
      time:'',
      ntpServer:'',
      ntpPort:'',
    }
  },

  bindPickerChangeTimeControl(e){
   const that = this;
   if(e.detail.value){
     that.setData({
      timeControlIndex:e.detail.value
     })
   }
  },

  switch1Change(e){
    console.log("switch:",e.detail.value)
    const that = this;
    if(e.detail.value){
      that.setData({
        jurisdiction:1
      })
      that.getDate();
    }else{
      that.setData({
        jurisdiction:0
      })
    }
    that.setData({
      switchChecked:e.detail.value,
    })
  },

  bindDateChange(e){
    console.log(e)
    const that = this;
    that.setData({
      ['form.date']:e.detail.value
    })
  },

  bindTimeChange(e){
    console.log(e)
    const that = this;
    that.setData({
      ['form.time']:e.detail.value
    })
  },

  bindPickerChange(e){
    const that = this;
    that.setData({
      index:e.detail.value
    })
  },

  ntpServerChange(e){
    const that = this;
    if(e.detail.value){
      that.setData({
        ['form.ntpServer']:e.detail.value
      })
    }
  },

  ntpPortChange(e){
    const that = this;
    let value = that.validateNumber(e.detail.value)
    if(e.detail.value){
      that.setData({
        ['form.ntpPort']:value
      })
    }
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
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
     console.log("时间集合：",app.globalData.dateAggregate);
     that.getDate()
  },

  getDate(){
    const that = this;
    let dateAggregate = app.globalData.dateAggregate;
    dateAggregate.forEach(e=>{
      if('time_control' == e.key){
        that.setData({
          timeControl:e.optionName,
          timeControlValue:e.optionValue,
          timeControlIndex:e.value,
         })
      }
      if('timezone' == e.key){
        that.setData({
         timeZone:e.optionName,
         timeZoneValue:e.optionValue,
         index:e.value,
        })
      }
      if('currenttime' == e.key){
        that.setData({
         ['form.date']:e.value.slice(0, 10),
         ['form.time']:e.value.slice(10, 16),
         second:e.value.slice(16),
        })
      }
      if('ntpServer' == e.key){
        that.setData({
          ['form.ntpServer']:e.value,
         })
      }
      if('ntpPort' == e.key){
        that.setData({
          ['form.ntpPort']:e.value,
         })
      }
    })
  },

  formSubmit(e){
     console.log("提交数据:",e.detail.value);
     const that = this;
     let formData = e.detail.value;
     let sendJson = {};
     let json = {};
     if(!(/^[1-9]\d*$/.test(parseInt(formData.ntpPort)) && 0 < parseInt(formData.ntpPort) && 1 * parseInt(formData.ntpPort) <= 65535)){
        wx.showToast({
          title: '您的端口不符合范围：1-65535',
          icon: 'none',
          duration: 2000
        })
        return false;
     }
     json.timezone = parseInt(formData.timeZone);
     json.currenttime = formData.date + ' ' + formData.time + that.data.second;
     json.time_control = parseInt(formData.timeControl);
     json.ntpServer = formData.ntpServer;
     json.ntpPort = parseInt(formData.ntpPort);
     sendJson.time = json;
    console.log(sendJson);
    if(that.data.preventDuplication){
      wx.showLoading({
        title: '提交中',
      })
      req.request("post","device/config/set",{
        dataConfigStr:sendJson,
        deviceId:that.data.deviceId,
      }).then(res=>{
        wx.hideLoading();
        setTimeout(()=>{
          that.setData({
            preventDuplication:true,
          })
        },2300)
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: "时间和日期修改成功",
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