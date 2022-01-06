// pages/authorizationList/authorizationList.js
const req = require('../../request/request.js');
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const version = util.version
let currentPage = 1;
let pageSize = 10;
let number = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:0,
    dataUrl:dataUrl,
    isFacePic:true,
    isShowClear:false,
    deviceId:'',
    faceUrl:'person/face/picture?personId=',
    personNum:0,
    inputValue:'',
    list:[
      // {
      //   faceUrl:'',
      //   name:'赵海涛',
      //   status:0,
      // },
      // {
      //   faceUrl:'',
      //   name:'赵海涛',
      //   status:1,
      // },
      // {
      //   faceUrl:'',
      //   name:'赵海涛',
      //   status:2,
      // }
    ]
  },

  inputBind(e){
    const that = this;
    if('' != e.detail.value){
      that.setData({
        inputValue:e.detail.value.replace(/\s+/g, ''),
      })
    }else{
      that.setData({
        inputValue:'',
      })
    }
  },

  initCurrentPage(){
    currentPage = 1;
    number=0;
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

  //添加人员授权
  addPerson(){
    const that = this;
    wx.navigateTo({
      url: '../addAuthorization/addAuthorization?deviceId=' + that.data.deviceId,
    })
  },

  clearPerson(){
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要清空该设备上的所有授权人员吗？',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          that.confirmClear();
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  confirmClear(){
    const that = this;
    let deviceId = that.data.deviceId;
    wx.showLoading({
      title: '人员清空中',
    })
   req.request("post","device/config/clear/grant?deviceId="+deviceId,{}).then(res=>{
    wx.hideLoading();
    if(res.data.code && 200 == res.data.code){
      that.setData({
        list:[]
      })
      that.getGrantList();
    }else{
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
  });
  },

  query(){
    const that = this;
    number = 0;
    currentPage = 1;
    that.setData({
      list:[],
    })
    that.getGrantList();
  },

  getGrantList(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","grant/search",{
      "appId": appId,
      "currentPage": currentPage,
      "deviceId": that.data.deviceId,
      "pageSize": pageSize,
      "searchStr": that.data.inputValue
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        currentPage++
        if (currentPage >= res.data.data.pages+1) {
          currentPage = res.data.data.pages+1
        } 
        let oldData = that.data.list;
        let data = res.data.data.records;
        if(0 < data.length){
          number+= data.length
          console.log("授权数量:",number);
          that.setData({
            list:oldData.concat(data),
            personNum:res.data.data.total,
            isShowClear:true
          }) 
        }else{
          if(0 === that.data.list.length){
            that.setData({
              list:[],
              personNum:0,
              isShowClear:false
            }) 
          }else{
            that.setData({
              isShowClear:true
            })
          }
          wx.showToast({
            title: '没有数据了',
            icon: 'none',
            duration: 2000
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

  //授权日志
  tipsLog(e){
    const that = this;
    const grantId = e.currentTarget.dataset.grantid;
    wx.navigateTo({
      url: '../tipsLog/tipsLog?grantId='+grantId,
    })
   },

  //删除授权
  delete(value){
   const that = this;
   wx.showLoading({
    title: '正在删除中',
  })
   req.request("post","grant/delete",{
    "grantIdList":[value],
  }).then(res=>{
    wx.hideLoading();
    if(res.data.code && 200 == res.data.code){
      currentPage = 1;
      that.setData({

        list:[]
      })
      that.getGrantList();
    }else{
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
  });
  },

  personDelete(e){
    const that = this;
    let grantId = e.currentTarget.dataset.grantid;
    wx.showModal({
      title: '提示',
      content: '确定要删除该设备上的当前授权人员吗？',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          that.delete(grantId);
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  upper(){
    const that = this;
    that.getGrantList()
  },

  //重新授权人员
  againAuthentication(){
    const that = this;
    wx.showLoading({
      title: '重新授权中...',
    })
     req.request("post","device/refresh/grant?deviceId="+that.data.deviceId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: "刷新授权成功",
          icon: 'none',
          duration: 2000
        })
        that.getGrantList();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  refreshAuthentication(){
    const that = this;
    wx.showModal({
      title: '提示',
      content: '您是否重新授权设备上的所有人员？',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          currentPage = 1;
          number = 0;
          that.setData({
            list:[],
          })
          that.againAuthentication();
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    currentPage = 1;
    number = 0;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 260
        })
      }
    });
    if(options.deviceId && '' != options.deviceId){
      that.setData({
        deviceId:options.deviceId
      })
      wx.setNavigationBarTitle({
        title: options.deviceName
      })
      that.getGrantList();
    }
    that.isShowFace();
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
    currentPage = 1;
    number = 0;
    that.setData({
      list:[],
    })
    that.getGrantList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉刷新：')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})