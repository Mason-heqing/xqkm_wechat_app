// pages/volumeSet/volumeSet.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    deviceId:'',
    mode:null,
    items: [
      {value: '自动', name: '自动',checked:"true"},
      {value: '常开', name: '常开'},
      {value: '常闭', name: '常闭'},
    ]
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const that = this;
    const items = this.data.items;
    that.setData({
      mode:e.detail.value,
    })
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }  
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
     that.getVolumeSet();
  },

  getVolumeSet(){
    const that = this;
    let volumeSet = app.globalData.dataVolumeSet;
     let data = [];
     for(let i =0;i<volumeSet.optionName.length;i++){
       let json = {};
       json.value = volumeSet.optionValue[i];
       json.name = volumeSet.optionName[i];
       data.push(json)
     }
     let index = app.globalData.dataVolumeSet.value;
     data[index].checked="true";
    that.setData({
      mode:index,
      items:data
    })
    console.log("volumeSet:",volumeSet);

  },

  submit(){
    const that = this;
     let formData = parseInt(that.data.mode);
     let sendJson = {};
     let json = {};
     json.mode = formData;
     sendJson.ledctl = json;
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