// pages/person/person.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const version = util.version;
const req = require('../../request/request.js');
const app = getApp()
let currentPage = 1
let pageSize = 10
let number = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:0,
    personNum:0,//人员数量
    dataUrl:dataUrl,
    faceUrl:'person/face/picture?faceId=',
    isFacePic:true,
    inputValue:'',
    personList:[
      // {
      //   personUrl:'/image/icon_component.png',
      //   name:'赵海涛',
      //   jobNum:'8001',
      //   department:'产品部'
      // },
      // {
      //   personUrl:'/image/icon_component.png',
      //   name:'赵海涛',
      //   jobNum:'8001',
      //   department:'产品部'
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // req.request("post","person/search",{
    //   "appId":app.globalData.appid,
    //   "currentPage":0,
    //   "groupId": "",
    //   "id": "",
    //   "pageSize":10,
    //   "searchStr": ""
    // }).then(res=>{
    //   console.log(res)
    // })
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 310
        })
      }
    });
    that.isShowFace();
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

  //人员详情
  personDetails(e){
    console.log(e);
    console.log(e.currentTarget.dataset.personid);
    let id = e.currentTarget.dataset.personid;
    let groupName = e.currentTarget.dataset.groupname;
    wx.navigateTo({
      url: '../addPerson/addPerson?id=' + id + '&groupName=' + groupName,
    })
  },

  //手动添加
  manualAdd(){
    wx.navigateTo({
      url: '../addPerson/addPerson',
    })
  },

  //部门设置
  department(){
    wx.navigateTo({
      url: '../department/department',
    })
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

  //获取人员列表信息
  getPersonList(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","person/search",{
      "appId": appId,
      "currentPage": currentPage,
      "groupId": "",
      "id": "",
      "pageSize": pageSize,
      "searchStr": ""
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        currentPage++
        if (currentPage >= res.data.data.pages+1) {
          currentPage = res.data.data.pages+1
        } 
        let data = res.data.data.records;
        let oldData = that.data.personList;
        if(0 < data.length){
          number+= data.length
          that.setData({
            personList:oldData.concat(data),
            personNum:res.data.data.total
          })
        }else{
          if(0 === that.data.personList){
            that.setData({
              personList:[],
              personNum:0
            })
          }
          wx.showToast({
            title:"没有数据了",
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

  //根据条件搜索
  query(){
    const that = this;
    currentPage = 1;
    number = 0;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    });
    req.request("post","person/search",{
      "appId": appId,
      "currentPage":currentPage,
      "groupId": "",
      "id": "",
      "pageSize": pageSize,
      "searchStr":that.data.inputValue,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){ 
        let data = res.data.data.records;
        if(0 < data.length){
          that.setData({
            personList:data,
            personNum:res.data.total
          })
        }else{
          that.setData({
            personList:[],
            personNum:0
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

  upper(){
    const that = this;
    that.getPersonList();
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
     currentPage = 1;
     number = 0;
     that.setData({
      inputValue:'',
      personList:[]
     })
     that.getPersonList();
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
    console.log("下拉刷新")
    const that = this;
    currentPage = 1;
    number = 0;
    that.setData({
      personList:[],
    })
    that.getPersonList();
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
    let projectName = wx.getStorageSync('currentAppName');
    let appId = wx.getStorageSync('currentAppId');
    console.log('appid:',appId,projectName);
    // wx.redirectTo({
    //   url: '../invitation/invitation?appId='+appId+'&projectName='+projectName
    // })
    return {
      title: '邀请您加入:'+projectName,
      path: '/pages/userLogin/userLogin?appId=' + appId + '&projectName=' + projectName,
      imageUrl: '/image/amd.png'
    }
  }
})