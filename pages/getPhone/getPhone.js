// pages/getPhone/getPhone.js
const req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getPhoneNumber (e) {
    const that = this;
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if(e.detail.encryptedData && (undefined != e.detail.encryptedData) ){
      wx.login({
        success: res => {
          wx.showLoading({
            title: '请等待',
          })
          req.request("post","user/search/phone",{
            "encryptedData": e.detail.encryptedData,
            "iv": e.detail.iv,
            "appletCode": res.code
          }).then(res=>{
            wx.hideLoading();
            if(res.data.code && 200 == res.data.code){
              let data = JSON.parse(res.data.data)
              if(data.phoneNumber && '' != data.phoneNumber){
                wx.setStorageSync('phone',data.phoneNumber);
                wx.reLaunch({
                  url: '../userLogin/userLogin'
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