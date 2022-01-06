// pages/openingDoor/openingDoor.js
// const util = require('../../utils/util.js')
// const dataUrl = util.dataUrl
// const requestId = util.requestId
// const timeStamp = Date.parse(new Date())
const req = require('../../request/request.js');
let currentPage = 1;
let pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage: false,
    noMessage: true,
    list:[
      // {
      //   online:true,
      //   deviceName:'123',
      //   deviceId:123
      // },
      // {
      //   online:true,
      //   deviceName:'222',
      //   deviceId:222
      // },
      // {
      //   online:false,
      //   deviceName:'345',
      //   deviceId:345
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    currentPage = 1;
    that.getDoorList();
  },
  
  //重试
  again(){
    const that = this;
    that.getDoorList();
  },

  //选择默认开门
  checkboxChange(e){
    const that = this;
    let index = e.currentTarget.dataset.index;
    let defaultOpenDeviceFlag = e.detail.value;
    let changeDefault = "list[" + index + "].defaultOpenDeviceFlag";
    // console.log(index,defaultOpenDeviceFlag)
    let deviceIdList = [];
    if(0 == defaultOpenDeviceFlag.length){
      that.setData({
        [changeDefault]:false
      })
      that.data.list.forEach((item,index)=>{
         if(item.defaultOpenDeviceFlag){
          deviceIdList.push(item.deviceId);
         }
      })
      that.setopenDoor(deviceIdList);
      console.log(that.data.list)
    }else{
      if('false' == defaultOpenDeviceFlag[0]){
        that.setData({
          [changeDefault]:true
        })
        that.data.list.forEach((item,index)=>{
          if(item.defaultOpenDeviceFlag){
           deviceIdList.push(item.deviceId);
          }
       })
       that.setopenDoor(deviceIdList);
        console.log(that.data.list)
      }else{
        that.setData({
          [changeDefault]:false
        })
        that.data.list.forEach((item,index)=>{
          if(item.defaultOpenDeviceFlag){
           deviceIdList.push(item.deviceId);
          }
       })
       that.setopenDoor(deviceIdList);
        console.log(that.data.list)
      }
    }
  },

  //设置常开门设备
  setopenDoor(deviceList){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '常开门设置中',
    })
    req.request("post","device/set/default/open/door",{
      "appId": appId,
      "deviceIdList":deviceList
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 2000
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

  //获取远程开门列表
  getDoorList(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","device/search/open",{
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
        currentPage++
        if (currentPage >= res.data.data.pages+1) {
          currentPage = res.data.data.pages+1
        } 
        let oldData = that.data.list;
        let data = res.data.data.records;
        if(0 < data.length){
          that.setData({
            list:oldData.concat(data),
          }) 
        }else{
          if(0 === that.data.list.length){
            that.setData({
              list:[]
            }) 
          }
          wx.showToast({
            title: '没有数据了',
            icon: 'none',
            duration: 2000
          })
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

  openDoor(e){
    const that = this;
    let appId = wx.getStorageSync('appId');
    let deviceId = e.currentTarget.dataset.deviceid;
    let online = e.currentTarget.dataset.online;
    if (online){
      wx.showLoading();
      req.request("post","device/config/open/gate?deviceId=" + deviceId,{}).then(res=>{
        wx.hideLoading();
        if(res.data.code && 200 == res.data.code){
          wx.vibrateLong();
          wx.showToast({
            title: "请通行",
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    }else{
      wx.showToast({
        title: "设备已离线",
        icon: 'none',
        duration: 2000
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
    const that = this;
    currentPage = 1;
    that.setData({
      list:[]
    })
    that.getDoorList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
     const that = this;
     that.getDoorList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})