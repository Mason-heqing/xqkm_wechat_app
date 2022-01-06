// pages/codeConfigDeviceName/codeConfigDeviceName.js
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    namesContent:false,
    inputValue:'',
    deviceId:'',
     form:{
      id:'',
      name:'',
      serial:'',
     }
  },

  trimName(e){
    const that = this;
    if('' != e.detail.value){
      that.setData({
        ['form.name']:e.detail.value.replace(/\s+/g, ''),
        namesContent:true
      })
    }else{
      that.setData({
        ['form.name']:'',
        namesContent:false
      })
    }
  },

  submit(){
    const that = this;
     let getName = that.data.form.name;
     if("" != getName){
      let appId = wx.getStorageSync('currentAppId');
      if(that.data.preventDuplication){
        wx.showLoading({
          title: '添加中',
        })
        req.request("post","device/update",{
          "appId": appId,
          "id":that.data.form.id,
          "name": that.data.form.name,
          "serial": that.data.form.serial,
        }).then(res=>{
          wx.hideLoading();
          that.setData({
            preventDuplication:true,
          })
          if(res.data.code && 200 == res.data.code){
            wx.showToast({
              title: '设备添加成功',
              icon: 'none',
              duration: 2000
            })
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/index/index',
              })
            },2000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
           setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
           },2000)
          }
        });
      }
      that.setData({
        preventDuplication:false,
      })
     }else{
      wx.showModal({
        content: '设备名称不能为空！',
        showCancel: false,
      })
     }
  },

  addDevice(){
    const that = this;

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log("options:",options);
     const that = this;
     if(options.serial && '' != options.serial){
        that.setData({
          ['form.serial']:options.serial
        })
     }
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