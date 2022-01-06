// pages/selectAuthorized/selectAuthorized.js
var req = require('../../request/request.js');
let currentPage = 1;
const pageSize = 100;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personId:'',
    number:0,
    deviceIdList:[],
    authorizedList:[]
  },

  checkboxChange(e) {
    console.log(e.detail.value)
    const that = this;
    that.setData({
      deviceIdList:e.detail.value,
      number:e.detail.value.length
    }) 
  },

  selectAuthorized(e){
    console.log(e)
    const that = this;
    let index = e.currentTarget.dataset.index;
    let checked = e.currentTarget.dataset.checked;
    if(checked){
      that.setData({
        [`authorizedList[${index}].deviceGrantStatus`]: false,
        number:that.data.number -1
      })
    }else{
      that.setData({
        [`authorizedList[${index}].deviceGrantStatus`]: true,
        number:that.data.number + 1
      })
    }
  },

  //日子打印
  tipsLog(e){
   const that = this;
   const grantId = e.currentTarget.dataset.grantid;
   wx.navigateTo({
    url: '../tipsLog/tipsLog?grantId='+grantId,
  })
  },

  getAuthorized(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","grant/search/device",{
      "appId":appId,
      // "currentPage":currentPage,
      "personId":that.data.personId,
      // "pageSize":pageSize,
      "serial": ""
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let data = res.data.data
        if(0 < data.length){
          let arr = [];
          data.forEach((item,index)=>{
            console.log(item,index);
            if(item.deviceGrantStatus){
              arr.push(index);
            }
          })
          that.setData({
            authorizedList:data,
            number:arr.length,
          })
        }else{
          that.setData({
            authorizedList:[]
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

  //提交
  submit(){
    const that = this;
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    console.log(prevPage);
    prevPage.setData({
      ['form.grantUpdateFlag']:true,
      ['form.grantDeviceIdList']:that.data.deviceIdList,
      grantDeviceaNum:that.data.deviceIdList.length,
    })
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '../addPerson/addPerson'
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.personId && '' != options.personId){
      that.setData({
        personId:options.personId,
      })
    }
    that.getAuthorized();
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