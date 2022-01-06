// pages/changeUser/changeUser.js
var req = require('../../request/request.js');
let currentPage = 0
let pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    parentAdminId:'',
    inputValue:'',
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const that = this;
    let items = this.data.items
    that.setData({
      parentAdminId:e.detail.value,
    })
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }  
  },

  inputBind(e){
    const that = this;
    that.setData({
      inputValue:e.detail.value
    })
  },

  query(){
   const that = this;
    that.getUserList(that.data.inputValue);
  },
  
  getUserList(value){
    const that = this;
    let appId = that.data.appId;
    req.request("post","app/search/grant",{
      "appId":appId,
      "currentPage":currentPage,
      "pageSize":pageSize,
      "searchStr": value
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let data = res.data.data.records;
        let userData = [];
        if(0 < data.length){
           data.forEach(e=>{
             let userJson = {};
             userJson.value = e.wxUserId;
             userJson.name = e.personName;
             userData.push(userJson);
           })
        }
        that.setData({
          items:userData
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

  submit(){
    const that = this;
    let appId = that.data.appId;
    if("" != that.data.parentAdminId){
      wx.showLoading({
        title: '提交中',
      })
      req.request("post","app/grant/parent/admin",{
        "appId":appId,
        "parentAdminId":that.data.parentAdminId
      }).then(res=>{
        wx.hideLoading();
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title:"管理员变更成功",
            icon: 'none',
            duration: 2000
          })
          wx.reLaunch({
            url: '../userLogin/userLogin'
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
        title: "请先选择变更管理员",
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const that = this;
     if(options.appId && '' != options.appId){
       that.setData({
         appId:options.appId,
       })
     }
     that.getUserList();
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