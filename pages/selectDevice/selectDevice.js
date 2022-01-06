// pages/selectDevice/selectDevice.js
const req = require('../../request/request.js');
let currentPage = 0;
let pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage: false,
    noMessage: true,
    type:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.type && '1' === options.type){
        that.setData({
          type:'1',
        })
    }else{
      that.setData({
        type:'0',
      })
    }
    that.getDoorList();
  },
  
  //重试
  again(){
    const that = this;
    that.getDoorList();
  },

  //获取远程开门列表
  getDoorList(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","device/search",{
      "appId": appId,
      "currentPage": currentPage,
      "name": "",
      "id": "",
      // "online":true,
      "pageSize": pageSize,
      "serial": ""
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let data = res.data.data.records;
        if('1' === that.data.type){
          if(0 < data.length){
            that.setData({
              list:data
            }) 
          }else{
            that.setData({
              list:[]
            }) 
          }
        }else{
          if(0 < data.length){
            data.unshift({
              online:true,
              deviceId:'',
              deviceName:'全部设备'
            },)
            that.setData({
              list:data
            }) 
          }else{
            that.setData({
              list:[
                // {
                //   online:false,
                //   deviceId:'',
                //   deviceName:'全部设备'
                // }
              ]
            }) 
          }
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  selectDevice(e){
    // console.log('e:',e);
    const that = this;
    let deviceId = e.currentTarget.dataset.deviceid;
    let deviceName = e.currentTarget.dataset.devicename;
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    // console.log(prevPage);
    if('pages/addCard/addCard' == prevPage.route){
        wx.setStorageSync('selectDeviceName',deviceName);
        wx.setStorageSync('selectDeviceId',deviceId);
        prevPage.setData({
          deviceName:deviceName,
          deviceId:deviceId,
        });
        // prevPage.getDeviceId();
    }else{
      prevPage.setData({
        recordList:[],
      })
      prevPage.getSelectDevice(deviceId,deviceName);
      
    }
    wx.navigateBack({
      delta: 1
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