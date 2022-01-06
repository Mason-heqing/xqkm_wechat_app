// pages/deviceManagement/deviceManagement.js
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
    deviceNum:0,//设备数量
     openDoorMessage:false,
     deviceList:[
      //  {
      //    status:true,
      //    address:'802大门口',
      //    sn:'123456789',
      //  },
      //  {
      //   status:true,
      //   address:'802大门口',
      //   sn:'123456789',
      // },
      // {
      //   status:true,
      //   address:'802大门口',
      //   sn:'123456789',
      // },
     ]
  },

  //扫码添加
  qrcodeCode(){
    const that = this;
    // that.setData({
    //   openDoorMessage:true,
    // })

    wx.scanCode({
      success(res) {
        if (res.result){
           console.log("获取二维码信息:",res.result);
           console.log("url地址:",res.result,"运行模式:",that.getUrlParams(res.result,'rm')||res.result.split('/')[res.result.split('/').length-1] );
           wx.setStorageSync('scanCode',res.result)
           let https = /^https:\/\/.*/i.test(res.result);
           let qft = /^QFT\/\/.*/i.test(res.result);
           let appId = wx.getStorageSync('currentAppId');
           let rm = null;
           if(-1 == res.result.indexOf('rm')){
            rm = 0;
           }else{
            rm = that.getUrlParams(res.result,'rm')||res.result.split('/')[res.result.split('/').length-1];
           } 
           let serial = that.getUrlParams(res.result,'sn') || res.result.split('/')[2];
           if(0 == parseInt(rm) || 3 == parseInt(rm)){
            req.request("post","device/check/bind?appId="+appId+'&serial='+serial,{}).then(data=>{
              if(data.data.code && 200 == data.data.code){
                console.log("res.result",res.result,res.result.indexOf('QFT'))
                if(https){
                  console.log('11https',https);
                  if((-1 != res.result.indexOf('pre.qy-rgs.com:9019')) || (-1 != res.result.indexOf('guard.qy-rgs.com:9019'))){
                    let isBle = that.getQueryVariable(res.result)
                    console.log("ble地址:",isBle)
                    // wx.navigateTo({
                    //   url: '../manualInput/manualInput',
                    // })
                    //预留扫码是否需要配网
                    if('1' == isBle){
                      wx.navigateTo({
                          url: '../qyBluetoothSearch/qyBluetoothSearch',
                      })
                    }else{
                      wx.navigateTo({
                        url: '../manualInput/manualInput',
                      })
                    }
                  }else if(-1 != res.result.indexOf('brilliants')){
                    //包含brilliants字符
                    wx.navigateTo({
                      url: '../manualInput/manualInput',
                    })
                  }else{
                    //向北设备
                    wx.navigateTo({
                      url: '../bluetoothSearch/bluetoothSearch',
                    })
                  }
                }else if(0 == res.result.indexOf('QFT')){
                  //以QTF开头
                  wx.navigateTo({
                    url: '../manualInput/manualInput',
                  })
                }else{
                  wx.showToast({
                    title: '二维码无效',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }else{
                wx.showToast({
                  title: data.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            });
           }else{
            wx.showToast({
              title: '请将设备上的运行模式修改成云平台模式!',
              icon: 'none',
              duration: 2000
            })
           }
          





          //  if(-1 == res.result.indexOf("sn")){
          //   wx.showToast({
          //     title: '二维码无效',
          //     icon: 'none',
          //     duration: 2000
          //   })
          //  }else{
          //   if(-1 == res.result.indexOf('brilliants')){
          //     if(-1 == res.result.indexOf('QFT')){
                
          //     }else{
          //       wx.navigateTo({
          //         url: '../manualInput/manualInput',
          //       })
          //     }  
          //   }else{
          //     // wx.navigateTo({
          //     //   url: '../qyBluetoothSearch/qyBluetoothSearch',
          //     // })
          //     wx.navigateTo({
          //       url: '../manualInput/manualInput',
          //     })
          //   }
          //  }
           
        }
      },
      fail(err){
        wx.showToast({
          title: '未检测到二维码',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },

  //二维码参数
  getUrlParams(url,paras) {
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    let i,j;
    for ( i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
  },


  //获取url参数
  getQueryVariable (url){
    var vars = url.split("?");
    var serial = vars[1].split("&");
    var ble = serial[2].split("=")
    return ble[1]
  },

  modalConfirm() {
    const that = this;
    wx.navigateTo({
      url: '../scanCode/scanCode',
    })
  },

  //手动录入
  addManually(){
    wx.navigateTo({
      url: '../manualInput/manualInput',
    })
  },

  authorization(e){
    let info = e.currentTarget.dataset.item;
    let deviceId = info.deviceId;
    let deviceName = info.deviceName;
    wx.navigateTo({
      url: '../authorizationList/authorizationList?deviceId=' + deviceId + '&deviceName=' + deviceName,
   })
  },

  //编辑
  edit(e){
    console.log(e.currentTarget.dataset.item)
    const info = e.currentTarget.dataset.item;
    let deviceId = info.deviceId;
    let deviceName = info.deviceName;
    let serial = info.serial;
    console.log("serial:",serial);
    console.log("deviceName:",deviceName);
    wx.navigateTo({
      url: '../setDeviceName/setDeviceName?deviceId=' + deviceId + '&serial=' + serial +'&deviceName=' + deviceName,
    })
  },

  //设置
  set(e){
    const that = this;
    // console.log(e.currentTarget.dataset.deviceid);
    let deviceId = e.currentTarget.dataset.deviceid;
    let vendor = e.currentTarget.dataset.vendor;
    let online = e.currentTarget.dataset.online;
    if(online){
      if('QY' == vendor){
        wx.navigateTo({
          url: '../eqConfig/eqConfig?deviceId=' + deviceId,
        })
      }else if('XB' == vendor){
        // wx.showToast({
        //   title: '暂不支持向北设备参数设置',
        //   icon: 'none',
        //   duration: 2000
        // })
        wx.navigateTo({
          url: '../otherDeviceConfigSet/otherDeviceConfigSet?deviceId=' + deviceId,
        })
      }
    }else{
      that.isGoDetails(deviceId,vendor);
    }
    
  },

  isGoDetails(deviceId,type){
    const that = this;
    req.request("post","device/config/has/config?deviceId="+deviceId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(res.data.data){
          if('QY' == type){
            wx.navigateTo({
              url: '../eqConfig/eqConfig?deviceId=' + deviceId,
            })
          }else if('XB' == type){
            // wx.showToast({
            //   title: '暂不支持向北设备参数设置',
            //   icon: 'none',
            //   duration: 2000
            // })
            wx.navigateTo({
              url: '../otherDeviceConfigSet/otherDeviceConfigSet?deviceId=' + deviceId,
            })
          }
        }else{
          wx.showToast({
            title: '设备已离线',
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
        if (currentPage >= res.data.data.total) {
          currentPage = res.data.data.total
        }
        let oldData = that.data.deviceList;
        let data = res.data.data.records;
        console.log(data)
        if(0 < data.length){
          number+= data.length
          that.setData({
            deviceList:oldData.concat(data),
            deviceNum:number
          })
        }else{
          if(0 === that.data.deviceList.length){
            that.setData({
              deviceList:[],
              deviceNum:0
            })
          }
          // wx.showToast({
          //   title: '没有数据了',
          //   icon: 'none',
          //   duration: 2000
          // })
        }
        // if(data.phoneNumber && '' != data.phoneNumber){
        //   wx.setStorageSync('phone',data.phoneNumber);
        // }
        // that.setData({
        //   isShowUser:false
        // })
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
    that.getDeviceList();
  },

  refresh(){
    const that = this;
    currentPage = 1;
    number = 0;
    that.setData({
      deviceList:[],
      deviceNum:0
    })
    that.getDeviceList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 236
        })
      }
    });
    currentPage = 1;
    number = 0;
    that.setData({
      deviceList:[]
    })
    that.getDeviceList();
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
    let deviceId = app.globalData.bleCharacteristicId;
    let serial = app.globalData.serial;
    // currentPage = 1;
    // number = 0;
    // that.setData({
    //   deviceList:[]
    // })
    // that.getDeviceList();
    console.log("订阅deviceId:",deviceId)
     if(null !=deviceId){
      wx.closeBLEConnection({
        deviceId,
        success (res) {
          console.log("断开低功耗蓝牙连接")
          console.log(res)
        }
      })
      wx.closeBluetoothAdapter();
      // if(null == serial){
      //   wx.closeBluetoothAdapter();
      // }
     }
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
      deviceList:[],
      deviceNum:0
    })
    that.getDeviceList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //  const that = this;
    //  that.getDeviceList();
    //  console.log("触底了");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})