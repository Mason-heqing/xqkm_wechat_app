// pages/test/test.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const version = util.version
const req = require('../../request/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataUrl:dataUrl,
    faceUrl:'person/face/picture?path=',
    isShowUser:true,
    isFacePic:true,
    name:"",
    avatarUrl:''
  },

  //是否展示人脸图片
  isShowFace(){
    const that = this;
    req.request("post","privacy?version="+version,{}).then(res=>{
      if(res.data.code && 200 == res.data.code){
        if('true' == res.data.data){
          that.setData({
            isFacePic:true
          })
        }else{
          that.setData({
            isFacePic:false
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

  // getPhoneNumber (e) {
  //   const that = this;
  //   console.log(e)
  //   console.log(e.detail.errMsg)
  //   console.log(e.detail.iv)
  //   console.log(e.detail.encryptedData)
  //   if(e.detail.encryptedData && (undefined != e.detail.encryptedData) ){
  //     wx.login({
  //       success: res => {
  //         wx.showLoading({
  //           title: '请等待',
  //         })
  //         req.request("post","user/search/phone",{
  //           "encryptedData": e.detail.encryptedData,
  //           "iv": e.detail.iv,
  //           "appletCode": res.code
  //         }).then(res=>{
  //           wx.hideLoading();
  //           if(res.data.code && 200 == res.data.code){
  //             let data = JSON.parse(res.data.data)
  //             if(data.phoneNumber && '' != data.phoneNumber){
  //               wx.setStorageSync('phone',data.phoneNumber);
  //             }
  //             that.setData({
  //               isShowUser:false
  //             })
  //           }else{
  //             wx.showToast({
  //               title: res.data.msg,
  //               icon: 'none',
  //               duration: 2000
  //             })
  //           }
  //         });
  //       }
  //     })
  //   }
    
  // },

  getPersonInfo(){
    const that = this;
    req.request("post","user/info/get",{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(res.data.data != null){
          if(res.data.data.phone && '' != res.data.data.phone){
            that.setData({
              isShowUser:false
            })
          }else{
            that.setData({
              isShowUser:true
            })
          }
          if(('' != res.data.data.avatarUrl) && (-1 == res.data.data.avatarUrl.indexOf('https'))){
            that.setData({
              dataUrl:dataUrl,
              faceUrl:'person/face/picture?path='
             }) 
          }else if(('' != res.data.data.avatarUrl) && (-1 != res.data.data.avatarUrl.indexOf('https'))){
            that.setData({
              dataUrl:'',
              faceUrl:''
             }) 
          }else{
            that.setData({
              dataUrl:dataUrl,
              faceUrl:that.data.faceUrl
             }) 
          }
          that.setData({
            name:res.data.data.nickName,
            avatarUrl:res.data.data.avatarUrl
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

  myProject(){
    wx.navigateTo({
      url: '../myProject/myProject',
    })
  },

  myInfo(){
    wx.navigateTo({
      url: '../myInfo/myInfo',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
     const that = this;
     let token = wx.getStorageSync('token');
     let phone = wx.getStorageSync('phone') ? wx.getStorageSync('phone') :'';
     if('' != phone){
        that.setData({
          isShowUser:false
        })
     }else{
      that.setData({
        isShowUser:true
      })
     }
     if(token && undefined != token){
      that.isShowFace();
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
    const that = this;
    let token = wx.getStorageSync('token');
    wx.hideTabBar();
    if(token && undefined != token){
      that.getPersonInfo();
    }else{
      that.goLogin();
    }
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