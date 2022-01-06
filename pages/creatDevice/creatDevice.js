// pages/creatDevice/creatDevice.js
const req = require('../../request/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getPhone:false,
    bannerImg: [
      "../../image/banner.png",
    ],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
  },

  //跳转添加设备
  addDevice(){
    wx.navigateTo({
      url: '../deviceManagement/deviceManagement'
    })
  },

  //获取手机号
  getPhoneNumber (e) {
    const that = this;
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if(e.detail.encryptedData && (undefined != e.detail.encryptedData) ){
      wx.login({
        success: res => {
          req.request("post","user/search/phone",{
            "encryptedData": e.detail.encryptedData,
            "iv": e.detail.iv,
            "appletCode": res.code
          }).then(res=>{
            if(res.data.code && 200 == res.data.code){
              let data = JSON.parse(res.data.data)
              if(data.phoneNumber && '' != data.phoneNumber){
                wx.setStorageSync('phone',data.phoneNumber);
                that.setData({
                  getPhone:true
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
        }
      })
    }
    
  },


  //扫码添加
  qrcodeCode(){
    const that = this;
    let token = wx.getStorageSync('token');
    if(token && undefined != token){
      wx.scanCode({
        success(res) {
          if (res.result){
             console.log("获取二维码信息:",res.result);
             wx.setStorageSync('scanCode',res.result)
             let https = /^https:\/\/.*/i.test(res.result);
             let qft = /^QFT\/\/.*/i.test(res.result);
            if(https){
              if((-1 != res.result.indexOf('pre.qy-rgs.com:9019')) || (-1 != res.result.indexOf('guard.qy-rgs.com:9019'))){
                let isBle = that.getQueryVariable(res.result)
                console.log("ble地址:",isBle)
                // wx.navigateTo({
                //   url: '../manualInput/manualInput',
                // })
                //预留扫码是否需要配网
                if('1' == isBle){
                  wx.navigateTo({
                      url: '../qyBluetoothSearch/qyBluetoothSearch',
                  })
                }else{
                  wx.navigateTo({
                    url: '../manualInput/manualInput',
                  })
                }
              }else if(-1 != res.result.indexOf('brilliants')){
                //包含brilliants字符
                wx.navigateTo({
                  url: '../manualInput/manualInput',
                })
              }else{
                //向北设备
                wx.navigateTo({
                  url: '../bluetoothSearch/bluetoothSearch',
                })
              }
            }else if(0 == res.result.indexOf('QFT')){
              //以QTF开头
              wx.navigateTo({
                url: '../manualInput/manualInput',
              })
            }else{
              wx.showToast({
                title: '二维码无效',
                icon: 'none',
                duration: 2000
              })
            }           
          }
        },
        fail(err){
          wx.showToast({
            title: '未检测到二维码',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      that.goLogin();
    }

    
  },

  //获取url参数
  getQueryVariable (url){
    var vars = url.split("?");
    var serial = vars[1].split("&");
    var ble = serial[2].split("=")
    return ble[1]
  },

   //手动录入
   addManually(){
    const that = this;
    let token = wx.getStorageSync('token');
    if(token && undefined != token){
      wx.navigateTo({
        url: '../manualInput/manualInput',
      })
    }else{
      that.goLogin();
    } 
  },

  goLogin(){
    wx.showToast({
      title: '未登录,请先登录',
      icon: 'none',
      duration: 2000
    })
    setTimeout(()=>{
      wx.reLaunch({
        url: '../userLogin/userLogin'
      })
    },1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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