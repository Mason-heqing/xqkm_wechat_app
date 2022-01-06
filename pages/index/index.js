//index.js
//获取应用实例
const app = getApp()
const req = require('../../request/request.js');
var util = require('../../utils/util.js');

Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: ''
    }
  },
  
  data: {
    tabbar: {},
    currentProject:'',
    isProject:false,
    jurisdiction:false,//权限设置
    openDoorMessage:false,//是否显示提示信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerImg: [
      "../../image/banner.png",
    ],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    tool:[
      {
        name: "人员管理",
        toolIcon: "../../image/person_manage_icon.png",
        events: "personManage",
        jurisdiction: true,
      },
      {
        name: "开门记录",
        toolIcon: "../../image/door_manage.png",
        events: "accessControl",
        jurisdiction: true,
      },
      {
        name: "远程开门",
        toolIcon: "../../image/open_door_icon.png",
        events: "openingDoor",
        jurisdiction: true,
      },
      {
        name: "设备管理",
        toolIcon: "../../image/device_manage_icon.png",
        events: "deviceManagement",
        jurisdiction: true,
      },
    ]
  },


  //轮播图
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  goLogin(){
    wx.showToast({
      title: '未登录,请先登录',
      icon: 'none',
      duration: 2000
    })
    setTimeout(()=>{
      wx.reLaunch({
        url: '../userLogin/userLogin'
      })
    },1000)
  },
   

  selectAdress(){
    const that = this;
    let token = wx.getStorageSync('token');
    if(token && undefined != token){
      that.setData({
        openDoorMessage:true,
      })
    }else{
      that.goLogin();
    }
    
  },

   //人员管理
   personManage() {
    const that = this;
    let jurisdiction = that.data.jurisdiction;
    let token = wx.getStorageSync('token');
    if(token && undefined != token){
      if(jurisdiction){
        wx.navigateTo({
          url: '../person/person'
        })
      }else{
        that.setData({
          openDoorMessage:true,
        })
      }
    }else{
      that.goLogin();
    }
    
  },

   //门禁管理
   accessControl() {
    const that = this;
    let jurisdiction = that.data.jurisdiction;
    let token = wx.getStorageSync('token');
    if(token && undefined != token){
      if(jurisdiction){
        wx.navigateTo({
          url: '../openingRecord/openingRecord',
        })
      }else{
        that.setData({
          openDoorMessage:true,
        })
      }
    }else{
      that.goLogin();
    }
  },

    //远程开门
    openingDoor() {
      const that = this;
      let jurisdiction = that.data.jurisdiction;
      let token = wx.getStorageSync('token');
      if(token && undefined != token){
        if(jurisdiction){
          wx.navigateTo({
            url: '../openingDoor/openingDoor'
          })
        }else{
          that.setData({
            openDoorMessage:true,
          })
        }
      }else{
        that.goLogin();
      }
    },

    //设备管理
  deviceManagement() {
    const that = this;
    let jurisdiction = that.data.jurisdiction;
    let token = wx.getStorageSync('token');
    if(token && undefined != token){
      if(jurisdiction){
        wx.navigateTo({
          url: '../deviceManagement/deviceManagement'
        })
      }else{
        that.setData({
          openDoorMessage:true,
        })
      }
    }else{
      that.goLogin();
    }
  },


  //事件处理函数

  onLoad: function () {
    app.editTabbar();
    console.log(this.data.tabbar);
    // req.request("post","heartbeat",{}).then(res=>{
    //   console.log(res)
    // })
    // req.request("post","heartbeat",{}).then(res=>{
    // });
    // var a = '2a95';
    // console.log(parseInt(a,16))
    // var hex = '2a95'
    // var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    //   return parseInt(h, 16)
    // }))
    // var buffer = typedArray.buffer
    // console.log(buffer)
  
    //  var aa = '{"errcode":0,"ip_address":"192.168.1.184","net_mask":"255.255.255.0","gate_way":"0.0.0.0","dns1":"0.0.0.0","dns2":"","dhcp_state":true,"timestamp":1617697657,"mac_address":"5E:07:7F:FC:86:4F"}'
    //  console.log(JSON.parse(aa));
    // this.getParam('sn');
    // console.log('sn:',this.getUrlParams('mac'))
  },


  getUrlParams(paras) {
    let url = 'https://brilliants.oss-cn-shenzhen.aliyuncs.com/app/AZ02.apk?sn=5460dd8793a3f4ab&mac=38:01:46:2E:B9:51';
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    let i,j;
    for ( i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
  },
  
  ab2hex16(buffer) {
    let hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  onShow: function(){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.hideTabBar();
    console.log("token：",token);
    if(token && undefined != token){
      that.getProject();
    }
  },

  //获取所有项目
  getProject(){
    const that = this;
    req.request("post","app/search/list",{}).then(res=>{
      wx.hideLoading();
      console.log("appLIST长度：",res.data.data.length)
      if(res.data.code && 200 == res.data.code){
        if( 0 < res.data.data.length){
          res.data.data.forEach((item,index)=>{
             if(item.selectFlag){
              wx.setStorageSync('currentAppId', item.id);
              wx.setStorageSync('currentAppName', item.name);
               that.setData({
                currentProject:item.name
               })
             }
          })
          that.setData({
            jurisdiction:true,
            isProject:true
          })
        }else{
          if('' != wx.getStorageSync('currentAppId')){
            wx.removeStorageSync('currentAppId');
            wx.removeStorageSync('currentAppName');
          }
          that.setData({
            jurisdiction:false,
            isProject:false
          })
          wx.navigateTo({
            url: '../creatDevice/creatDevice',
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

  //切换项目
  projectChange(){
    wx.navigateTo({
      url: '../projectChange/projectChange'
    })
  },

  modalConfirm(){
    const that = this;
    wx.switchTab({
      url: '../test/test'
    })
  }

})
