// pages/selectAddProject/selectAddProject.js
const app = getApp()
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isConnect:null,
    items:[],
    selectApp:null
  },

  radioChange(e){
    const that = this;
    that.setData({
      selectApp:e.detail.value
    })
  },

  submit(){
    const that = this;
    let currentApp = that.data.selectApp;
    if('' == currentApp){
      wx.navigateTo({
        url: '../addProject/addProject?ble=1'  
      })
    }else{
      if('1' === that.data.isConnect){
        that.sendData();
      }else if('2' === that.data.isConnect){
        wx.navigateTo({
          url: '../scanAddDevice/scanAddDevice?isNoBle=1'  
        })
      }else{
        wx.navigateTo({
          url: '../setDeviceName/setDeviceName'  
        })
      }
    }
    // if(null != currentApp){
      
    // }else{
    //     wx.showToast({
    //       title: "请选择是否创建新项目！",
    //       icon: 'none',
    //       duration: 2000
    //     })
    // }
  },

  sendData(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    let serial = app.globalData.serial;
    let bleSetDeviceName = app.globalData.bleSetDeviceName;
    let bleCharacteristicId = app.globalData.bleCharacteristicId;
    req.request("post","device/update",{
      "appId": appId,
      "name": bleSetDeviceName,
      "serial": serial,
    }).then(res=>{
      if(res.data.code && 200 == res.data.code){
        wx.closeBLEConnection({
          deviceId: bleCharacteristicId
        });
        wx.closeBluetoothAdapter();
        wx.showToast({
          title: "设备添加成功！",
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/index/index',
          })
        },2000)
      }else{
        wx.closeBLEConnection({
          deviceId: bleCharacteristicId
        });
        wx.closeBluetoothAdapter();
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const that = this;
     console.log("isConnect:",options)
     if(options.isConnect){
         that.setData({
          isConnect:options.isConnect
         }) 
     }
    //  let currentApp = wx.getStorageSync('currentAppId');
     let currentApp = '1';
     let arr = [
      {
        name:'添加到当前项目',
        id:currentApp,
        checked:true
      },
      {
        name:'创建新项目',
        id:'',
      }
     ];
     
     that.setData({
       items:arr,
       selectApp:currentApp
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