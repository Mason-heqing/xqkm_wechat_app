// tabBarComponent/tabBar.js
const app = getApp();
const req = require('../request/request.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#DA2C1F",
        "list": [
          {
            "pagePath": "pages/index/index",
            "iconPath": "image/home_off_icon.png",
            "selectedIconPath": "image/hom_icon.png",
            "text": "首页"
          },
          {
            "pagePath": "pages/index/index",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": "一件开门"
          },
          {
            "pagePath": "pages/test/test",
            "iconPath": "image/user_off_icon.png",
            "selectedIconPath": "image/user_icon.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
    openDoorMessage:true,
    tipsList:[],
    tipsHeight:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {  
    //设置默认开门
    openDoorTips(e){
    const that = this;
    let appId = wx.getStorageSync('currentAppId');
    let token = wx.getStorageSync('token');
    if(token && undefined != token){
      wx.showLoading({
        title: '开启中',
      })
      req.request("post","device/config/open/gate/double?appId="+appId,{}).then(res=>{
        wx.hideLoading();
        if(res.data.code && 200 == res.data.code){
          console.log(res.data.data)
           that.setData({
             tipsHeight:res.data.data.length*30+30,
             tipsList:res.data.data,
             openDoorMessage:false
           })
           setTimeout(()=>{
            that.setData({
              openDoorMessage:true,
              tipsHeight:0,
              tipsList:[],
            })
           },5000)
        }else if(res.data.code && 300 == res.data.code){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '../openingDoor/openingDoor'
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
    }else{
      that.goLogin();
    }
    },
    hiddenMask(){
      const that = this;
      that.setData({
        openDoorMessage:true,
        tipsHeight:0,
        tipsList:[],
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
  }
})
