// pages/bluetoothSearch/bluetoothSearch.js
const app = getApp();
var that;
var timeOut = null;

var sendTimeout = null;

Page({
  data: {
    //界面显示文字
    userInfo: {},
    dhcpItems: [
      { name: true, value: '启用', checked: 'true'},
      { name: false, value: '关闭' },
    ],
    netModeItems: [
      { name: 'wifi', value: 'WIFI' , checked: 'true' },
      { name: 'eth', value: '以太网' },
    ],
    // 微信通过扫描提供的蓝牙Mac地址
    mac: "",

    //蓝牙通讯接收的缓存
    bleRecvBuf: "",

    //配置设备所需要的变量
    //--通讯方式
    netMode: "wifi",  
    //--wifi相关
    ssid: "",
    wifiPwdInput: "",
    wifiSSIDPlaceholder: '',
    //--以太网相关
    dhcp: true,
    ipInput: "",
    maskInput: "",
    gatewayInput: "",

    //连接蓝牙设备所需要的变量
    scanNumber: 10,
    connectNumber : 10,
  //  deviceServicesNumber : 10,

    deviceId: "",

    uuid: "",
    characteristic_read_uuid: "",
    characteristic_write_uuid: "",
    characteristic_indicate_uuid: "",

    //初始化是否成功表示
    initBleSuccess : false,
    initWifiSuccess :false,

    bleScanning:false,

    bleConnnectting: true,
    bleWxConnectting : false,
    bleFindSn: false,
    bleConnectCheck : false,

    bleAdapter : false,
    bleServicesTry : false,

    //控制UI界面所需要的变量
    showWifiFail : false,
    showWifiConfig : true,
    wifiDhcpEnable: false,
    showWifiNoDhcpConfig: false,

    showEthConfig: false,
    showEthNoDhcpConfig: false,
    ethDhcpEnable: false,

    showSetting: false,  
    
    systemInfo: '', // 系统信息
    errorInfo:'请先打开蓝牙和定位功能', // 错误信息提醒

    sysinfo:'', // 当前微信版本号
    deviceSn:'', //设备序列号

    isFromWxCode: true,    //是否来自小程序码
    snrList : [],       //序列号列表
    keySnrList :[]      //键值对列表，用于过滤重复项
  },

  //事件处理函数
  onLoad: function (options) {
    console.log("onLoad:",wx.getStorageSync('scanCode'));
    that = this;
    this.getSystemInfo()
    options = {q:wx.getStorageSync('scanCode')};
    console.log(options);
    if(options.q == undefined){
      console.log("in mini program code");
      //扫小程序码入口
      that.data.sysinfo === 'iOS' && that.bleStart();  // 安卓点击上个页面的下一步触发，所以这里做区分调用
      that.setData({
        isFromWxCode:true,
        bleScanning:true
      });
    }else{
     console.log("in normal qcode code");
      //扫小程序二维码的入口
      if (options.q) {
        // console.log("截取mac地址：",that.getQueryVariable(options.q));
        // let mac = that.getQueryVariable(options.q,mac).replace(/:/g,"");
        let scan_url = decodeURIComponent(options.q);
        console.log("scan_url+:" + scan_url)
        var patt1 = /[^/\n]+$/gm;
        let mac = scan_url.match(patt1); // 提取链接中mac号 和序列号
       let macList = mac[0].split('-'); // 二维码地址后面变成/xxx-bbb xxx是mac地址，bbb是序列号，做兼容处理，避免老的代码用不了
        macList[0] = macList[0].toLowerCase();
        that.setData({
          mac: mac.toString().toLowerCase() //macList[0]
        });
        console.log("get mac is " + this.data.mac);
       // console.log("get sn is " + this.data.deviceSn)
        this.data.sysinfo === 'iOS' && that.bleStart();  // 安卓点击上个页面的下一步触发，所以这里做区分调用
        that.setData({
          isFromWxCode:false
        });
      }
    }

    wx.setNavigationBarTitle({
      title:'连接蓝牙'
    })
  },

  //获取url参数
  getQueryVariable (url,parameter){
    var vars = url.split("&");
    console.log("parameter:",vars);
    return vars[1]
    // for (var i=0;i<vars.length;i++) {
    //         var pair = vars[i].split("=");
    //         if(pair[0] == parameter){return pair[1];}
    // }
    // return(false);
   },

  // 获取系统版本是 苹果还是安卓
  getSystemInfo(){
    wx.getSystemInfo({
      success: function(res) {
        if(res.system && res.system.indexOf('iOS') > -1){
          that.setData({
            sysinfo: 'iOS'
          })
        }else{
          that.setData({
            sysinfo: 'Android'
          })
          that.selectComponent("#android-tip").showModel();
        }
      }
    });
  },
  ininData(){
    that.setData({
      bleConnnectting:true,
      initBleSuccess:false,
      scanNumber:10,
   //   deviceServicesNumber : 10,
      connectNumber : 10,
      bleWxConnectting : false,
      bleConnectCheck : false,
      keySnrList : [],
      bleFindSn : false,
      deviceSn : "",
      deviceId: "",
      uuid: "",
      characteristic_read_uuid: "",
      characteristic_write_uuid: "",
      characteristic_indicate_uuid: "",
    })

    if(that.data.isFromWxCode){
      that.setData({
        bleScanning:true
      });
    }else{
      that.setData({
        bleScanning:false
      });
    }
  },
  //关闭蓝牙适配器
  bleStart: function () {
    console.log("1.closeBluetoothAdapter");
    that.ininData();
    wx.closeBluetoothAdapter({
      complete: function (res) {
        that.openBluetoothAdapter();
      }
    })
  },
  //1.初始化蓝牙适配器  
  openBluetoothAdapter: function () {
    console.log("2.openBluetoothAdapter");

    that.setData({
      bleAdapter : true
    });

    setTimeout(function () { 
      if(that.data.bleAdapter == false){
        return;
      }
      that.setData({
        bleAdapter : false
      });
      that.bleStart();
    }, 5000);

    wx.openBluetoothAdapter({
      success: function (res) {
        that.setData({
          bleAdapter : false
        });
        that.getBluetoothAdapterState();
      },
      fail: function (res) {
        that.setData({
          bleAdapter : false
        });
        console.log("openBluetoothAdapter fail");
        that.setData({ bleConnnectting :false,errorInfo:'请打开手机蓝牙喔'});
      }
    })
  },
  //2.获取本机蓝牙适配器状态  
  getBluetoothAdapterState: function () {
    console.log("3.getBluetoothAdapterState");
    wx.getBluetoothAdapterState({
      success: function (res) {
        that.startBluetoothDevicesDiscovery();
      },
      fail: function (res) {
        console.error("getBluetoothAdapterState fail");
        that.setData({
          bleConnnectting: false,
          errorInfo:'获取本机蓝牙适配器状态失败'
        });
      }
    })
  },
  // 3.开始搜寻附近的蓝牙外围设备  
  startBluetoothDevicesDiscovery: function () {
    console.log("4.startBluetoothDevicesDiscovery");
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        setTimeout(function () {
          that.getBluetoothDevices();
        }, 1000);
      },
      fail: function (res) {
        console.error("startBluetoothDevicesDiscovery fail");
        that.setData({
          bleConnnectting: false,
          errorInfo:'搜寻附近的蓝牙外围设备失败'
        });
      }
    })
  },
 //4.获取所有已发现的蓝牙设备  
 getBluetoothDevices: function () {
  console.log("5.getBluetoothDevices scan is " + that.data.scanNumber);
  if (that.data.scanNumber == 1){
    if(that.data.isFromWxCode){
      if(that.data.snrList.length == 0){
        that.setData({
          bleScanning : true,
          bleConnnectting : false,
          errorInfo:'搜寻附近的蓝牙外围设备失败',
          scanNumber: that.data.scanNumber - 1
        });
      }else{
        that.setData({
          bleScanning : false,
          bleConnnectting : true,
          scanNumber: that.data.scanNumber - 1
        });
      }
      return;
    }
    that.setData({
      bleConnnectting : false,
      scanNumber: that.data.scanNumber - 1
    });
    return;
  } else if (that.data.scanNumber == 0) {
    return;
  }
  that.setData({
    scanNumber: that.data.scanNumber - 1
  });
  wx.getBluetoothDevices({
    success: function (res) { 
      console.log(res.devices)
      if (res.devices.length != 0) {
        that.matchDeviceByMac(res.devices);
      } else {
          setTimeout(function () {
            console.log("getBluetoothDevices res.devices.length = 0");
            that.getBluetoothDevices();
          }, 1000);
      }
    },
    fail: function (res) {
      console.error("getBluetoothDevices fail");
      that.setData({
        errorInfo:'获取所有已发现的蓝牙设备失败'
      })
      setTimeout(function () {
        that.getBluetoothDevices();
      }, 1000);
    }
  });
},
  //5.匹配对应的蓝牙设备
  matchDeviceByMac: function (devices) {
    console.log("6.matchDeviceByMac");
    if(that.data.isFromWxCode){
      devices.forEach((list) => {
        if(list.advertisData){
          var buf = new Uint8Array(list.advertisData);
          if((buf[0] == 0xaa) && (buf[1] == 0x66)){
            var snr = buf.subarray(2, 15);
            snr = String.fromCharCode.apply(null, snr);
            if(that.data.keySnrList[snr] == undefined){
              that.data.keySnrList[snr] = list.deviceId;
              //加入新项
              var obj = new Object();
              obj.snr = snr;
              obj.deviceId =  list.deviceId;
              that.data.snrList.push(obj);

              that.setData({
                bleFindSn : true
              });
            }
          }
        } else {
          // console.log("matchDeviceByMac catch e");
        }
      })

      that.setData({
        snrList: that.data.snrList
      });

      setTimeout(function () {
        console.info("find again");
        that.getBluetoothDevices();
      }, 1000);
    }else{
      devices.forEach((list) => {
        if(list.advertisData){
          var buf = new Uint8Array(list.advertisData);
          if((buf[0] == 0xaa) && (buf[1] == 0x66)){
            var snr = buf.subarray(2, 15);
            snr = String.fromCharCode.apply(null, snr);
            var mac = buf.subarray(15, 21);
            mac = that.buf2hex(mac);
            mac = mac.toLowerCase();

            if (that.data.mac == mac) {
              wx.stopBluetoothDevicesDiscovery({
                success: function success(res) { },
                fail: function fail(res) {
                  console.log("stopBluetoothDevicesDiscovery fail :" + JSON.stringify(res));
                }
              });
              
              that.setData({
                deviceId: list.deviceId, //保存当前连接设备
                scanNumber: 0,
                deviceSn : snr
              });
              that.createBLEConnection();
              return;
            }
          }
        } else {
          // console.log("matchDeviceByMac catch e");
        }
      })

      setTimeout(function () {
        console.info("matchDeviceByMac not find");
        that.setData({
          errorInfo:'匹配对应的蓝牙设备失败'
        })
        that.getBluetoothDevices();
      }, 1000);
    }
  },
  connectBtn: function (even) {
    if(even.currentTarget.dataset.snr){
      console.log("存储snr号",even.currentTarget.dataset.snr)
      wx.setStorageSync('serial',even.currentTarget.dataset.snr);
    }
    if(that.data.deviceSn.length > 0){
      return;
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function success(res) { },
      fail: function fail(res) {
        console.error("stopBluetoothDevicesDiscovery fail :" + JSON.stringify(res));
      }
    });
    that.setData({
      deviceSn: even.currentTarget.dataset.sn,
      deviceId: even.currentTarget.dataset.id, //保存当前连接设备
      scanNumber: 0,
      snrList :[],
      bleConnnectting : true,
      bleScanning : false,
      bleWxConnectting : true
    });
    setTimeout(function () {
      that.createBLEConnection();
    }, 1000);
  },
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  failToConnectionAgain : function(){
    console.info("failToConnectionAgain");
    wx.closeBLEConnection({
      deviceId : that.data.deviceId,
      complete : function(res){
        console.log("closeBLEConnection complete");
        console.log(res);
      }
    });

    if(that.data.connectNumber == 0) {
      that.setData({
        bleConnnectting: false,
        errorInfo:'连接低功耗蓝牙设备失败'
      });
    }else{
      that.setData({
        connectNumber : that.data.connectNumber-1
      });
      setTimeout(function () {
        that.createBLEConnection();
      }, 1000);
    }
  },
  //6.连接低功耗蓝牙设备  
  createBLEConnection: function () {
    var connectTimeout = setTimeout(function () {
      that.failToConnectionAgain();
    }, 5000);
    console.log("7.createBLEConnection");
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      timeout : 3000,
      success: function (res) {
        clearTimeout(connectTimeout);
        console.log("createBLEConnection success");
        console.log(res);
        that.setData({
          connectNumber : 0
        });
        setTimeout(function () {
          that.getBLEDeviceServices();
        }, 1500);
      },
      fail: function (res) {
        clearTimeout(connectTimeout);
        console.error("createBLEConnection fail " + that.data.connectNumber);
        console.error(res);
        that.failToConnectionAgain();
      },
      complete:function(res){
        console.log("createBLEConnection complete");
        console.log(res);
      }
    })
  },
  createBLEConnectionTryAgain: function () {
    if(that.data.bleServicesTry == false){
      return;
    }
    that.setData({
      bleServicesTry : false
    });
    console.info("7.createBLEConnectionTryAgain");
    wx.closeBLEConnection({
      deviceId : that.data.deviceId,
      success: function(res) {
        console.log("closeBLEConnection success");
        console.log(res);
      },
      fail : function(res) {
        console.error("closeBLEConnection fail");
        console.error(res);
      },
      complete : function(res){
        console.log("closeBLEConnection complete");
        console.log(res);
      }
    });
    setTimeout(function () {
      that.createBLEConnection();
    }, 1000);
  },
  //7.获取蓝牙设备所有 service（服务）  
  getBLEDeviceServices: function () {
    console.log("8.getBLEDeviceServices");
    that.setData({
      bleServicesTry : true
    });
    setTimeout(function () {
      that.createBLEConnectionTryAgain();
    }, 3000);

    wx.getBLEDeviceServices({
      deviceId: that.data.deviceId,
      success: function(res) {
        that.setData({
          bleServicesTry : false
        });
        console.log("getBLEDeviceServices success ");
        console.log(res);
        for (var i = 0; i < res.services.length; i++) {
          console.log(res.services[i].uuid.toString());
          if (res.services[i].uuid.toLowerCase().indexOf("a002") != -1) {
            that.setData({
              uuid: res.services[i].uuid
            });
          }
        }
        if (that.data.uuid != null) {
          that.getBLEDeviceCharacteristics();
        }
      },
      fail : function(res){
        console.error("getBLEDeviceServices fail ");
        console.error(res);
        setTimeout(function () {
          that.createBLEConnectionTryAgain();
        }, 1000);
      },
      complete : function(res){
        console.log("getBLEDeviceServices complete");
        console.log(res);
      }
    })
  },
  //8.获取蓝牙设备所有 characteristic（特征值）  获取notify 特征值 
  getBLEDeviceCharacteristics: function () {
    console.log("9.getBLEDeviceCharacteristics");

    that.setData({
      bleServicesTry : true
    });
    setTimeout(function () {
      that.createBLEConnectionTryAgain();
    }, 3000);

    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.uuid,
      success: function(res) {
        console.log("getBLEDeviceCharacteristics success");
        that.setData({
          bleServicesTry : false
        });
        for (var i = 0; i < res.characteristics.length; i++) {
          if (res.characteristics[i].uuid.toLowerCase().indexOf("c304") != -1) {
            if (res.characteristics[i].properties.write) {
              that.setData({
                  characteristic_write_uuid: res.characteristics[i].uuid
              });
            }
          } else if (res.characteristics[i].uuid.toLowerCase().indexOf("c306") != -1) {
            if (res.characteristics[i].properties.indicate) {
              that.setData({
                  characteristic_indicate_uuid: res.characteristics[i].uuid
              })
            }
          }
        }
        that.onBLECharacteristicValueChange();
      },
      fail : function(res){
        console.error("getBLEDeviceCharacteristics fail");
        console.error(res);
      },
      complete : function(res){
        console.log("getBLEDeviceCharacteristics complete");
        console.log(res);
      },
    });
  },
  // 9.监听低功耗蓝牙设备的特征值变化事件 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
  onBLECharacteristicValueChange () {
    console.log("10.notifyBLECharacteristicValueChange");
    that.setData({
      bleServicesTry : true
    });
    setTimeout(function () {
      that.createBLEConnectionTryAgain();
    }, 3000);

    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.uuid,
      characteristicId: that.data.characteristic_indicate_uuid,
      success: function(res) {
        console.log("notifyBLECharacteristicValueChange success");
        console.log(res)
        that.setData({
          bleServicesTry : false,
          initBleSuccess :true
        });

        // if(that.data.isFromWxCode){
        //   wx.navigateTo({
        //     url: `/pages/connectWifi/connectWifi?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}&Antifea=true&Score=2` 
        //   })
         
        // }else{
          console.log("deviceId:",that.data.deviceId)
          console.log("deviceSn:",that.data.deviceSn)
          wx.setStorageSync('serial',that.data.deviceSn);
          console.log("uuid:",that.data.uuid)
          console.log("characteristic_write_uuid:",that.data.characteristic_write_uuid)
          wx.navigateTo({
            url: `/pages/setMode/setMode?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}`  
          })
      //  }
      },
      fail: function(res) {
        console.error("notifyBLECharacteristicValueChange fail");
        console.error(res);
      }
    });
  },
  next: function(){
    if(this.data.initBleSuccess){
      wx.navigateTo({
      //  url: `/pages/setMode/setMode?deviceId=${this.data.deviceId}&deviceSn=${this.data.deviceSn}&uuid=${this.data.uuid}&characteristic_write_uuid=${this.data.characteristic_write_uuid}`  
        url: `/pages/connectWifi/connectWifi?deviceId=${this.data.deviceId}&deviceSn=${this.data.deviceSn}&uuid=${this.data.uuid}&characteristic_write_uuid=${this.data.characteristic_write_uuid}&Antifea=true&Score=2` 
      })
    }
  }
})