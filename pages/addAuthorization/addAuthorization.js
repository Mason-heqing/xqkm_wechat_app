// pages/addAuthorization/addAuthorization.js
const req = require('../../request/request.js');
const util = require('../../utils/util.js');
const version = util.version;
const dataUrl = util.dataUrl
let currentPage = 1;
let pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    scrollHeight:0,
    flag:0,
    dataUrl:dataUrl,
    isFacePic:true,
    faceUrl:'person/face/picture?personId=',
    deviceId:'',
    select_all:false,
    personNum:0,
    personIdList:[],
    inputValue:'',
    list: [
      // {value: 'USA', name: '美国'},
      // {value: 'CHN', name: '中国'},
      // {value: 'BRA', name: '巴西'},
      // {value: 'JPN', name: '日本'},
      // {value: 'ENG', name: '英国'},
      // {value: 'FRA', name: '法国'}
    ]
  },
  checkboxChange(e) {
    console.log(e.detail.value)
    const that = this;
    that.setData({
      personIdList:e.detail.value,
      personNum:e.detail.value.length
    })
  },
  selectall:function(e){
    const that = this;
    let newPersonIdList = [];
    console.log(that.data.select_all);
    if(that.data.select_all){
      that.setData({
        flag:0
      })
    }else{
      that.setData({
        flag:1
      })
    }
    that.data.select_all=!that.data.select_all;
    for (let i = 0; i < that.data.list.length;i++){
      that.data.list[i].checked=that.data.select_all;
      newPersonIdList.push( that.data.list[i].personId)
    }
    if(that.data.select_all){
       that.setData({
        personNum:that.data.list.length
       })
    }else{
      that.setData({
        personNum:0
       })
    }
    that.setData({
      list: that.data.list,
      personIdList:newPersonIdList,
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

   //是否展示人脸图片
   isShowFace(){
    const that = this;
   console.log("version:",version);
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

  query(){
     const that = this;
     currentPage = 1;
     that.setData({
       list:[],
     })
     that.getPersonGrant();
  },

  getPersonGrant(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","person/search/not/grant",{
      "appId": appId,
      "currentPage": currentPage,
      "deviceId": that.data.deviceId,
      "pageSize": pageSize,
      "searchStr":that.data.inputValue
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
          that.setData({
            list:oldData.concat(data),
          })
          console.log("标记:",that.data.flag)
          if(1 == that.data.flag){
            // that.selectall();
            let newPersonIdList = [];
            for (let i = 0; i < that.data.list.length;i++){
              that.data.list[i].checked=that.data.select_all;
              newPersonIdList.push( that.data.list[i].personId)
            }
            if(that.data.select_all){
               that.setData({
                personNum:that.data.list.length
               })
            }else{
              that.setData({
                personNum:0
               })
            }
            that.setData({
              list: that.data.list,
              personIdList:newPersonIdList,
            })
          } 
        }else{
          if(0 === that.data.list.length){
            that.setData({
              list:[],
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

  upper(){
    const that = this;
    that.getPersonGrant();
  },

  submit(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    if(that.data.preventDuplication){
      wx.showLoading({
        title: '授权中',
      })
      req.request("post","grant/update",{
        "appId": appId,
        "deviceIdList":[that.data.deviceId],
        "personIdList": that.data.personIdList,
      }).then(res=>{
        wx.hideLoading();
        that.setData({
          preventDuplication:true,
        })
        if(res.data.code && 200 == res.data.code){
          wx.showToast({
            title: '授权成功',
            icon: 'none',
            duration: 2000
          })
          let pages = getCurrentPages();   //当前页面
          let prevPage = pages[pages.length - 2];   //上一页面
          setTimeout(()=>{
            prevPage.initCurrentPage();
            prevPage.setData({
              list:[],
            })
            prevPage.getGrantList();
            wx.navigateBack({
              delta: 1
            })
          },2000)
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
     const that = this;
     currentPage = 1;
     wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 464
        })
      }
    });
     if(options.deviceId && '' != options.deviceId){
       that.setData({
        deviceId:options.deviceId
       }) 
       that.getPersonGrant();
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
      that.setData({
        list:[],
      })
      that.getPersonGrant();
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