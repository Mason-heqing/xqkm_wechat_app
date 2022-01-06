// pages/addProject/addProject.js
const app = getApp()
var req = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    name:'',
    flag:false,
    ble:'',
    serial:''
  },

  trim(e){
    const that = this;
    that.setData({
      name:e.detail.value.replace(/\s+/g, ''),
    })
  },

  //创建、修改项目
  submit(){
    const that = this;
    let title ='';
    let appId = '';
    if(that.data.flag){
      appId = wx.getStorageSync('currentAppId');
      title = '项目修改成功'
    }else{
      appId = '';
      title = '项目创建成功'
    }
    if('' == that.data.name){
      wx.showToast({
        title:'请输入项目名',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(that.data.preventDuplication){
      wx.showLoading({
        title: '提交中',
      })
      let ble = that.data.ble;
      if('1' == ble){
        let serial = app.globalData.serial;
        let name = app.globalData.bleSetDeviceName;
        that.addDevice(name,serial);
      }else if('2' == ble){
        let serial = that.data.serial;
        let name = that.data.name;
        that.addDevice(name,serial);
      }else{
        req.request("post","app/update",{
          "appId":appId,
          "name": that.data.name,
        }).then(res=>{
          wx.hideLoading();
          that.setData({
            preventDuplication: true
          })
          if(res.data.code && 200 == res.data.code){
            wx.showToast({
              title:title,
              icon: 'none',
              duration: 2000
            })
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/index/index',
              })
            },1000)

  
            // let pages = getCurrentPages();   //当前页面
            // let prevPage = pages[pages.length - 2];   //上一页面
            // prevPage.getRoomList();
            
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
         }); 
      }
           
    }
    that.setData({
      preventDuplication: false
    })
  },

  //通过蓝牙配网添加设备
  addDevice(name,serial){
    const that = this;
    req.request("post","app/create/and/add",{
      "appName":that.data.name,
      "deviceName": name,
      "serial": serial,
    }).then(res=>{
      wx.hideLoading();
      that.setData({
        preventDuplication:true,
      })
      if(res.data.code && 200 == res.data.code){
        let deviceId = app.globalData.bleCharacteristicId;
        if(null !=deviceId){
          wx.closeBLEConnection({
            deviceId,
            success (res) {
              console.log(res)
            }
          })
          wx.closeBluetoothAdapter();
        }
        wx.showToast({
          title: '设备添加成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/index/index',
          })
        },2000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '/pages/index/index',
          })
        },2000)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.changeProjectName && '' != options.changeProjectName){
      wx.setNavigationBarTitle({
        title:'修改项目',
      })
      that.setData({
        flag:true,
      })
    }else{
      wx.setNavigationBarTitle({
        title:'创建项目',
      })
      that.setData({
        flag:false,
      })
    }
    if(options.ble && '2' == options.ble){
      console.log("options:",options);
       that.setData({
         name:options.name,
         serial:options.serial
       })
    }
    that.setData({
      ble:options.ble
    })
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