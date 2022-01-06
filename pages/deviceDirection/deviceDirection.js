// pages/deviceDirection/deviceDirection.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:null,
    name:'',
    deviceId:'',
    items: []
  },

  deviceDirection(){
    const that = this;
    let dataDevicedDirection = app.globalData.dataDevicedDirection;
    let data = [];
    for(let i =0;i<dataDevicedDirection.optionName.length;i++){
      let json = {};
      json.value = dataDevicedDirection.optionValue[i];
      json.name = dataDevicedDirection.optionName[i];
      data.push(json)
    }
    let index = app.globalData.dataDevicedDirection.optionValue.indexOf(app.globalData.dataDevicedDirection.value);
    data[index].checked="true";
   that.setData({
     mode:index,
     items:data
   })
  },

  radioChange(e) {
    const items = this.data.items
    const that = this;
    console.log(app.globalData.dataDevicedDirection.optionName[e.detail.value]);
    that.setData({
      mode:e.detail.value,
      name:app.globalData.dataDevicedDirection.optionName[e.detail.value]
    })
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }   
  },

  submit(){
    const that = this;
    let formData = parseInt(that.data.mode);
    let sendJson = {};
    let json = {};
    json.direction = formData;
    sendJson.vaparam = json;
   req.request("post","device/config/set",{
     dataConfigStr:sendJson,
     deviceId:that.data.deviceId,
   }).then(res=>{
     if(res.data.code && 200 == res.data.code){
       wx.showToast({
         title: "设备方向修改成功",
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
    that.deviceDirection();
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