// pages/openingRecord/openingRecord.js
const req = require('../../request/request.js');
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const version = util.version
let currentPage = 1;
let pageSize = 10;
// const data = new Date().toLocaleDateString().replace(/\//g,'-').toString();
let str = new Date();
let data = str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate();
let number = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openDoorMessage:false,//是否显示提示信息
    isFacePic:true,
    recordNum:0,//开门记录条数
    items: [
      {value: 0, name: '导出图片'},
    ],
    exportPicFlag:false,
    mailbox:'',
    scrollHeight:0,
    dataUrl:dataUrl,
    passUrl:'record/picture?path=',
    date:data,
    index:0,
    deviceList:[],
    deviceName:'全部设备',
    deviceId:'',
    inputValue:'',
    recordList:[
      // {
      //   name:'赵海涛',
      //   jobNum:'8001',
      //   department:'研发部',
      //   address:'802大门口',
      //   times:'09:30:23'
      // },
      // {
      //   name:'赵海涛',
      //   jobNum:'8001',
      //   department:'研发部',
      //   address:'802大门口',
      //   times:'09:30:23'
      // },
      // {
      //   name:'赵海涛',
      //   jobNum:'8001',
      //   department:'研发部',
      //   address:'802大门口',
      //   times:'09:30:23'
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

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const that = this;
    currentPage = 1;
    number = 0;
    that.setData({
      date: e.detail.value,
      recordList:[]
    })
    that.getOpenRecord();
  },

  bindDevicePickerChange(e){
    console.log(e.currentTarget.dataset.deviceid);
    const that = this
    that.setData({
      deviceId: e.currentTarget.dataset.deviceid
    })
    that.getOpenRecord();
  },

  mailChange(e){
    const that = this;
    that.setData({
      mailbox:e.detail.value
    })
  },

  checkboxChange(e){
    const that = this;
    if(undefined == e.detail.value[0]){
      that.setData({
        exportPicFlag:false
      })
    }else{
      that.setData({
        exportPicFlag:true
      })
    }
  },

  modalConfirm(){
    const that = this;
    console.log("图片开启状态：",that.data.exportPicFlag);
    let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); 
　　let obj = that.data.mailbox;
　　if(obj === ""){
  　　　　wx.showToast({
          title: '邮箱不能位空',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          openDoorMessage:true
        })
　　}else if(!reg.test(obj)){
  　　　　wx.showToast({
            title: '邮箱格式不正确',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            openDoorMessage:true
          })
　　}else{
       let appId = wx.getStorageSync('currentAppId');
  　　　req.request("post","record/export",{
          "appId": appId,
          "deviceId":that.data.deviceId,
          "searchStr":that.data.inputValue,
          "snapTime":that.data.date,
          "email":that.data.mailbox,
          "exportPicFlag":that.data.exportPicFlag
        }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        that.setData({
          mailbox:'',
          exportPicFlag:false
        })
        wx.showToast({
          title: '稍后开门记录已发送到邮箱,请关注您的邮箱！',
          icon: 'none',
          duration: 2000
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
  },

  query(){
     const that = this;
     currentPage = 1;
     number = 0;
     that.setData({
      recordList:[],
     })
     that.getOpenRecord();
  },

  refresh(){
    const that = this;
     currentPage = 1;
     number = 0;
     that.setData({
      recordList:[],
     })
     that.getOpenRecord();
  },

  selectDevice(){
    wx.navigateTo({
      url: '../selectDevice/selectDevice',
    })
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

  //获取设备列表
  getDeviceList(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","device/search",{
      "appId": appId,
      "currentPage": currentPage,
      "name": "",
      "id": "",
      // "online":true,
      "pageSize": pageSize,
      "serial": ""
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        currentPage++
        if (currentPage >= res.data.data.pages+1) {
          currentPage = res.data.data.pages+1
        } 
        let data = res.data.data.records;
        let oldData = that.data.deviceList;
        if(0 < data.length){
          number+= data.length
          that.setData({
            deviceList:oldData.concat(data),
            deviceId:data[0].deviceId,
            recordNum:number
          }) 
        }else{
          if(0 === that.data.deviceList.length){
            that.setData({
              deviceList:[],
              deviceId:'',
              recordNum:0
            })
          }
          wx.showToast({
            title:'没有数据了',
            icon: 'none',
            duration: 2000
          })
        }
        that.getOpenRecord();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
 
  getSelectDevice(deviceId,deviceName){
    const that = this;
    // console.log("选中设备",deviceId,deviceName)
    currentPage = 1;
    number = 0;
    that.setData({
      deviceId:deviceId,
      deviceName:deviceName
    })
    that.getOpenRecord()
  },
  
  getOpenRecord(){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    wx.showLoading({
      title: '加载中',
    })
    req.request("post","record/search",{
      "appId": appId,
      "currentPage":currentPage,
      "deviceId":that.data.deviceId,
      "pageSize":pageSize,
      "searchStr":that.data.inputValue,
      "snapTime":that.data.date,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        currentPage++
        if (currentPage >= res.data.data.pages+1) {
          currentPage = res.data.data.pages+1
        }
        let data = res.data.data.records;
        let oldData = that.data.recordList;
        if(0 < data.length){
          number+= data.length
          data.forEach((item)=>{
             if('-1' == item.snapPic.indexOf('https')){
              item.snapPic = dataUrl + 'record/picture?path=' + item.snapPic
             }else{
              item.snapPic = item.snapPic
             }
          })
          that.setData({
            recordList:oldData.concat(data),
            recordNum:number
          }) 
        }else{
          if(0 === that.data.recordList.length){
            that.setData({
              recordList:[],
              recordNum:0
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
    that.getOpenRecord();
  },

  getEamil(){
    const that = this;
    req.request("post","user/email/get",{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
         if(res.data.data && null != res.data.data){
            that.setData({
              mailbox:res.data.data
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

  exportbox(){
    const that = this;
    if(0 != that.data.recordList.length){
      that.getEamil();
      that.setData({
        openDoorMessage:true,
      })
    }else{
      wx.showToast({
        title: "当前没有记录",
        icon: 'none',
        duration: 2000
      })
    }
  },

  bigImg(e){
    let src = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: [src],
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
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 254
        })
      }
    });
    that.getOpenRecord();
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
      recordList:[]
    })
    that.getOpenRecord();
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