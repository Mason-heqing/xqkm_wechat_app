// pages/projectSet/projectSet.js
var req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childrenNum:0,
    preventDuplication:true,
    id:'',
    appName:'',
    parentAdminName:'',
    childAdminMap:[],
  },

  setProjectName(){
    wx.navigateTo({
      url: '../addProject/addProject?changeProjectName=1&ble=0',
   })
  },

  editUser(){
    const that = this;
    let appId = that.data.id;
    wx.navigateTo({
      url: '../changeUser/changeUser?appId='+appId,
   })
  },

  //编辑子管理员
  editSubUser(){
    const that = this;
    let appId = that.data.id;
    wx.navigateTo({
      url: '../editSubUser/editSubUser?appId='+appId,
   })
  },

  //项目设置获取
  getProjectSet(){
    const that = this;
    // let appId = wx.getStorageSync('currentAppId');
    req.request("post","app/details?appId="+that.data.id,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        let childAdminMap = [];
        if(res.data.data.childAdminMap){
          for (var key in res.data.data.childAdminMap){
            let json = {};
            json.name = res.data.data.childAdminMap[key];
            json.value = key;
            childAdminMap.push(json);
          }
        }
         that.setData({
          appName:res.data.data.appName,
          parentAdminName:res.data.data.parentAdminName,
          childAdminMap:childAdminMap,
          childrenNum:childAdminMap.length
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

  delete(e){
    const that = this;
    let appId = that.data.id;
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否要删除该子管理员 ',
      success (res) {
        if (res.confirm) {
          req.request("post","app/delete/child/admin",{
            appId:appId,
            childAdminList:[id]
          }).then(res=>{
            wx.hideLoading();
            if(res.data.code && 200 == res.data.code){
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              })
              that.getProjectSet();
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  submit(){
   const that =this;
  //  let appId = wx.getStorageSync('currentAppId');
   if(that.data.preventDuplication){
    req.request("post","app/delete?appId="+that.data.id,{}).then(res=>{
      wx.hideLoading();
      that.setData({
        preventDuplication:true,
       })
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title:'项目注销成功',
          icon: 'none',
          duration: 2000
        })
        // let pages = getCurrentPages();   //当前页面
        // let prevPage = pages[pages.length - 2];   //上一页面
        // console.log(prevPage);
        // prevPage.onShow();
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
   }
   that.setData({
    preventDuplication:false,
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that =this;
     if(options.id && '' != options.id){
       that.setData({
         id:options.id
       })
      //  that.getProjectSet();
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
    that.getProjectSet();
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