
//app.js
App({
  onLaunch: function () {
     // 登录
    //获取设备信息
     this.getSystemInfo();
     wx.login({ 
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
         this.globalData.code=res.code
        //  wx.navigateTo({
        //   url: '/pages/userLogin/userLogin'
        // })
      }
    })
     //直接获取用户信息
     wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
     
      
    
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);


    // if(pagePath.indexOf('/') != 0){
    //   pagePath = '/' + pagePath;
    // } 
   
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    systemInfo: null,//客户端设备信息
    userInfo: null,
    sessionKey:null,
    wxOpenId:null,
    appid:"",
    departmentNavigation:[],
    dateAggregate:[],
    dataVolumeSet:[],
    dataAudioctl:[],
    dataFillInLight:[],
    dataAuthentication:[],
    dataDistinguish:[],
    dataWeigand:[],
    dataVaparam:[],
    dataSerial:[],
    dateWorkMode:[],
    dataDoorDelayTime:[],
    dateAntifea:[],
    dateScore:[],
    dataSoundSuccess:[],
    dataSoundStranger:[],
    dataLight:[],
    dataCardFormat:[],
    dataDevicedDirection:[],
    dataVerifySec:[],
    dataSwitchCtrl:[],
    dataScreensaver:[],
    dataWifiList:null,
    serial:'',
    bleOperationMode:null,
    bleSetDeviceName:null,
    bleCharacteristicId:null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#DA2C1F",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "/image/home_off_icon.png",
          "selectedIconPath": "/image/hom_icon.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "一键开门"
        },
        {
          "pagePath": "/pages/test/test",
          "iconPath": "/image/user_off_icon.png",
          "selectedIconPath": "/image/user_icon.png",
          "text": "我的"
        }
      ]
    }
  }
})