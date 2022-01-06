// pages/projectChange/projectChange.js
var req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage: true,
    noMessage: false,
    searchLeft:252,
    inputText: "center",
    villageName:'',
    inputValue:"",
    list:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getRoomList("");
  },

  query(){
   const that = this;
   let value = that.data.inputValue;
   that.getRoomList(value);
  },


  //输入信息
  inputBind(e) {
    console.log(e.detail.value);
    const that = this;
    that.setData({
      inputValue: e.detail.value.trim()
    })
  },




  //按小区名称进行搜索
  search(){
    const that = this;
    let value = that.data.inputValue.trim();
    that.getRoomList(value)
  },

  //键盘搜索按钮
  bindconfirm(){
    const that = this;
    let value = that.data.inputValue.trim();
    that.getRoomList(value)
  },
 
  //获取项目列表
  getRoomList(value){
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","app/search/list?appName="+value,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(res.data.data && 0 < res.data.data.length){
          that.setData({
            list:res.data.data,
            showMessage:false,
            noMessage:true,
          })
        }else{
          that.setData({
            list:[],
            showMessage:true,
            noMessage:false,
          })
        }
      }else{
        that.setData({
          showMessage:true,
          noMessage:false,
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
 
 

  projectChange(e){
    const that = this;
    let appId = e.currentTarget.dataset.appid;
    wx.showLoading();
    req.request("post","app/select?appId="+appId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '切换成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
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
    let value = that.data.inputValue.trim();
    that.getRoomList(value)
    wx.stopPullDownRefresh();
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