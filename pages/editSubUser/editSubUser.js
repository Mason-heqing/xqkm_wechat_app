// pages/editSubUser/editSubUser.js
var req = require('../../request/request.js');
let currentPage = 0
let pageSize = 100
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId:'',
    items: [],
    inputValue:'',
    childAdminList:[],
    personNum:0,
  },

  inputBind(e){
    const that = this;
    that.setData({
      inputValue:e.detail.value,
    })
  },

  checkboxChange(e) {
    console.log(e.detail.value)
    const that = this;
    that.setData({
      childAdminList:e.detail.value,
      personNum:e.detail.value.length
    }) 
  },

  query(){
    const that = this;
    that.setData({
      personNum:0
    })
    that.getUserList(that.data.inputValue);
  },

  getUserList(value){
    const that = this;
    let appId = that.data.appId;
    req.request("post","app/search/grant",{
      "appId":appId,
      "currentPage":currentPage,
      "pageSize":pageSize,
      "searchStr":value
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let data = res.data.data.records;
        let userData = [];
        let id = [];
        let personNums = that.data.personNum;
        if(0 < data.length){
           data.forEach(e=>{
             let userJson = {};
             userJson.value = e.wxUserId;
             userJson.name = e.personName;
             if(e.isChildAdmin){
              userJson.checked = true;
              id.push(e.wxUserId)
              personNums++
             }else{
              userJson.checked = false
             }
             userData.push(userJson);
           })
        }
        that.setData({
          childAdminList:id,
          items:userData,
          personNum:personNums
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
    wx.showLoading({
      title: '提交中',
    })
    req.request("post","app/grant/child/admin",{
      "appId":appId,
      "childAdminList":that.data.childAdminList
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title:"编辑子管理员成功",
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.appId && '' != options.appId){
      that.setData({
        appId:options.appId
      })
    }
    that.getUserList("");
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