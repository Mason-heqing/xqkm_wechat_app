// pages/soundStranger/soundStranger.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    mode:null,
    name:0,
    items: []
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    const that = this;
    that.setData({
      mode:e.detail.value,
      name:app.globalData.dataSoundStranger.optionName[e.detail.value]
    })
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }  
  },
  
  soundStranger(){
    const that = this;
    let dataSoundStranger = app.globalData.dataSoundStranger;
    let data = [];
    for(let i =0;i<dataSoundStranger.optionName.length;i++){
      let json = {};
      json.value = dataSoundStranger.optionValue[i];
      json.name = dataSoundStranger.optionName[i];
      data.push(json)
    }
    let index = app.globalData.dataSoundStranger.value;
    data[index].checked="true";
   that.setData({
     mode:index,
     items:data
   })
  },

  submit(){
     const that = this;
     let formData = parseInt(that.data.mode);
     let pages = getCurrentPages();   //当前页面
     let prevPage = pages[pages.length - 2];   //上一页面
     console.log(prevPage);
     prevPage.setData({
      indexSoundStranger:formData,
      ['form.soundStranger']:that.data.name
     })
     wx.navigateBack({
       delta: 1
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
     that.soundStranger();
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