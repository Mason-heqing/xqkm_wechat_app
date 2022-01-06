// pages/userLogin/userLogin.js
//获取应用实例
const app = getApp()
var req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    appid:"",
    appId:'',
    projectName:"",
    code:"",
    userInfo: {},
    sessionkey:"",
    openid:"",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // if(app.globalData.userInfo){
      //   this.setData({
      //      userInfo: app.globalData.userInfo,
      //      hasUserInfo: true,
      //   })
      // }
      const that = this;
      console.log("options",options)
      if(options.appId && '' != options.appId){
        that.setData({ 
          appId:options.appId,
          projectName:options.projectName,
        })
        // wx.reLaunch({
        //   url: '/pages/invitation/invitation?appId='+appId+'&projectName='+projectName
        // })
      }else if(options.scene != undefined){
        let scan_url = decodeURIComponent(options.scene);
        console.log(scan_url);
        wx.setStorageSync('scanCode',that.getQueryString(scan_url,'sn'));
      }else{
        var token = wx.getStorageSync('token') ? wx.getStorageSync('token') : "";
        if("" != token){
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
     
  },

  // getUserProfile: function(e) {
  //   console.log(e)
  //   // console.log(wx.canIUse())
  //   wx.getUserProfile({
  //       desc: '用于完善资料', 
  //       success:(res)=>{
  //         console.log(res)
  //       },
  //       fail:(res)=>{
  //         wx.showModal({
  //           cancelColor: 'cancelColor',
  //           title:'请点击微信授权登录！'
  //         })
  //       }
  //   })
  // },


  getQueryString: function (url, name) {
    // console.log("url = " + url);
    // console.log("name = " + name);
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
      return r[2];
    }
    return null;
  },

  getUserProfile: function(e) {
    let that = this;
    wx.showLoading({
      title: '请等待',
    })
    setTimeout(function() {
      wx.hideLoading();
    }, 10000)
    wx.getUserProfile({
        desc: '用于完善资料', 
        success:(res)=>{
          console.log(res)
          wx.setStorageSync('avatarUrl',res.userInfo.avatarUrl);
          // 登录
          
          if(that.data.preventDuplication){
            that.login(res.userInfo);
            that.setData({
              preventDuplication:false
            })
          }
        },
        fail:(res)=>{
          wx.showToast({
            title: "获取用户信息失败",
            icon: 'none',
            duration: 2000
          })
        }
    })
    // if (e.detail.userInfo) {
    //   console.log(e.detail.userInfo)
    //   console.log("appid:",wx.getAccountInfoSync().miniProgram.appId)
    //   wx.setStorageSync('avatarUrl',e.detail.userInfo.avatarUrl);
      
    // }
  },

  login(userInfo){
    let that = this;
    wx.login({
      success: data => {
        console.log(data);
        // wx.hideTabBar({})
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (data.code) {
         
          req.request("post","user/login",{
            "appletCode":data.code,
            "nickName":userInfo.nickName,
            "wxAppId":wx.getAccountInfoSync().miniProgram.appId,
            "avatarUrl":wx.getStorageSync('avatarUrl')
          }).then(res=>{
            wx.hideLoading();
            that.setData({
              preventDuplication:true
            })
            if(res.data.code && 200 == res.data.code){
              wx.setStorageSync('token', res.data.data.token);
              if('' != that.data.appId){
                wx.redirectTo({
                  url: '/pages/invitation/invitation?appId='+that.data.appId+'&projectName='+that.data.projectName
                })
              }else{
                if('' == res.data.data.phone){
                  wx.reLaunch({
                    url: '/pages/getPhone/getPhone'
                  })
                }else{
                    if(0 < res.data.data.appList.length){
                      wx.switchTab({
                        url: '/pages/index/index',
                      })
                    }else{
                      wx.reLaunch({
                        url: '/pages/creatDevice/creatDevice'
                      })
                    }
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
        } else {
          wx.hideLoading();
          that.setData({
            preventDuplication:true
          })
          wx.showToast({
            title: '登录失败！' + data.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },


  getPhoneNumber:function(e){

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