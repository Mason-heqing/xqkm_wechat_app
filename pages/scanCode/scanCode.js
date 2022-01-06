// pages/scanCode/scanCode.js

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;

    // let aa = "https://oss.qy-rgs.com/app/xqkm.html?sn=ed10c9a07b911a7a&model=MBQ521-A&ip=192.168.1.20"
    wx.scanCode({
      success(res) {
        if (res.result){
           console.log("获取二维码信息:",res.result);
           wx.setStorageSync('scanCode',res.result)
           if(-1 == res.result.indexOf('brilliants')){
            wx.navigateTo({
              url: '../manualInput/manualInput',
            })
            // wx.navigateTo({
            //   url: '../bluetoothSearch/bluetoothSearch',
            // })
          }else{
            // wx.navigateTo({
            //   url: '../qyBluetoothSearch/qyBluetoothSearch',
            // })
            wx.navigateTo({
              url: '../manualInput/manualInput',
            })
          }
        }
      }
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