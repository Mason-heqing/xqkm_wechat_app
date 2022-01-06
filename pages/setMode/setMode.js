// pages/setMode/setMode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connectModelSwitch:[  // 云端连接 
      {value: '1', name: '企业微信'},
      {value: '2', name: '局域网', checked: 'true'}
    ],
    livingSwitch:[ // 活体开关
      {value: '2', name: '关闭'},
      {value: '1', name: '打开', checked: 'true'}
    ],
    scoreSwitch:[
      {value: '1', name: '低'},
      {value: '2', name: '中', checked: 'true'},
      {value: '3', name: '高'},
      {value: '4', name: '很'},
      {value: '5', name: '极'}
    ],
    workWay:2,
    scoreWay:2,
    deviceId:'',
    deviceSn:'',
    uuid:'',
    characteristic_write_uuid:'',
    Antifea:true, // 活体开关
    LANUrl:'',//局域网地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      deviceId:options.deviceId || "",
      deviceSn:options.deviceSn || '',
      uuid:options.uuid || '',
      characteristic_write_uuid:options.characteristic_write_uuid || '',
    })
    wx.setNavigationBarTitle({
      title:'配置'
    })
  },
  // 安全性选择
  scoreChange(e){
    const scoreSwitch = this.data.scoreSwitch
    for (let i = 0, len = scoreSwitch.length; i < len; ++i) {
      scoreSwitch[i].checked = scoreSwitch[i].value === e.detail.value
    }
    this.setData({
      scoreSwitch,
      scoreWay:e.detail.value
    })
  },
  // 连接方式
  connectModelChange(e){
    const connectModelSwitch = this.data.connectModelSwitch
    for (let i = 0, len = connectModelSwitch.length; i < len; ++i) {
      connectModelSwitch[i].checked = connectModelSwitch[i].value === e.detail.value
    }
    this.setData({
      connectModelSwitch,
      LANUrl:'',
      workWay:e.detail.value,
    })
  },
  // 活体开关
  livingSwitchChange(e){
    const livingSwitch = this.data.livingSwitch
    for (let i = 0, len = livingSwitch.length; i < len; ++i) {
      livingSwitch[i].checked = livingSwitch[i].value === e.detail.value
    }
    this.setData({
      livingSwitch,
      Antifea:e.detail.value == 1 ? true : false
    })
  },
  //本地服务
  LANUrlInput(e){
    this.setData({
      LANUrl:e.detail.value
    })
  },
  next(){
    if(this.data.workWay == 2){
      if(this.data.LANUrl){
        this.data.LANUrl = this.data.LANUrl.replace("：", ":")
        /*
        this.data.LANUrl = this.data.LANUrl.replace("：", ":")
        var regex = /^((2[0-4]\d|25[0-5]|[1]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[1]?\d\d?)\:([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-6][0-5][0-5][0-3][0-5])$/;//CheckAddressPort
        if(!regex.test(this.data.LANUrl)){
          wx.showToast({
            title: '局域网格式错误',
            icon:'none',
            duration:2000
          })
          return;
        }
        */
      }else{
        wx.showToast({
          title: '局域网地址不能为空',
          icon:'none',
          duration:2000
        })
        return;
      }
    }
    console.log(this.data.Antifea)
    console.log(this.data.LANUrl)
    // wx.navigateTo({
    //   url: `/pages/connectWifi/connectWifi?deviceId=${this.data.deviceId}&deviceSn=${this.data.deviceSn}&uuid=${this.data.uuid}&characteristic_write_uuid=${this.data.characteristic_write_uuid}&Antifea=${this.data.Antifea}&LANUrl=${this.data.LANUrl}&Score=${this.data.scoreWay}`  
    // })

    wx.navigateTo({
      url: `/pages/wifiSet/wifiSet?deviceId=${this.data.deviceId}&deviceSn=${this.data.deviceSn}&uuid=${this.data.uuid}&characteristic_write_uuid=${this.data.characteristic_write_uuid}&Antifea=${this.data.Antifea}&LANUrl=${this.data.LANUrl}&Score=${this.data.scoreWay}`  
    })

  }
})