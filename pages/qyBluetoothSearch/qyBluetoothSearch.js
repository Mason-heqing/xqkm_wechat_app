const app = getApp();
var that;
var timeOut = null;
var sendTimeout = null;
const util = require('../../utils/util.js')
var random6 = util.random6
var sha1 = require('../../utils/sha1.js');
var key = "qyzn5728dbc237xbm81017t6e86ezde9" //密钥


Page({
  data: {
    serial:'',
    devices: [],
    log: [],
    connected: true, //原本是false
    chs: [],
    deviceId: '',
    writeDeviceId: '',
    writeServiceId: '',
    writeCharacteristicId: '',
    packData: [], // 分包数据
    bMagicNumber: null, // 消息前缀
    bVer: null, // 包格式版本
    nLength: null, // 包头包体长度
    nCmdId: null, //命令号 
    nSep:null,//递增序列号
    nProtoType:null,//数据类型
    client_nonce:null,//包体64位随机数
    sn:null,//包体sn号
    scene:null,//包体固定为handshake
    saveNCmdId:null,//标记命令号 
    wifiList:null,
    itemWifiData:null,
    req_key_id:'',
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
    keySnrList :[],      //键值对列表，用于过滤重复项
    isApplyBle:false,
    timesName:'',
  },
  //事件处理函数
  onLoad: function (options) {
    console.log("onLoad");
    that = this;
    this.getSystemInfo()
    options = {q:wx.getStorageSync('scanCode')};
    // options = {q:'https://www.ai-alloy.com/weixin/ble/B8F00980B55E'}
    console.log(options);
    let deviceId = app.globalData.bleCharacteristicId;
     if(null !=deviceId){
      wx.closeBLEConnection({
        deviceId,
        success (res) {
          console.log(res)
        }
      })
     }
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
       let mac = that.getQueryVariable(options.q,mac).replace(/:/g,"");
       let serial = that.getQueryVariableSN(options.q)
       console.log("获取sn:",serial);
       app.globalData.serial = serial;
        // let scan_url = decodeURIComponent(options.q);
        // console.log("scan_url+:" + scan_url)
        // var patt1 = /[^/\n]+$/gm;
        // let mac = scan_url.match(patt1); // 提取链接中mac号 和序列号

      //  let macList = mac[0].split('-'); // 二维码地址后面变成/xxx-bbb xxx是mac地址，bbb是序列号，做兼容处理，避免老的代码用不了
     //  macList[0] = macList[0].toLowerCase();
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

  onShow:function(){
     const that = this;
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

   //获取sn地址
   getQueryVariableSN(url){
    let vars = url.split("&");
    console.log("parameter:",vars);
    let sn = vars[0].split("?");
    let serial = sn[1].split("=");
    return serial[1]
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
        console.log("openBluetoothAdapter fail",res);
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
      wx.showModal({
        title: '提示',
        content: '是否直接添加设备',
        success (res) {
          if (res.confirm) {
            let projectId = wx.getStorageSync('currentAppId'); 
            wx.stopBluetoothDevicesDiscovery();
            wx.closeBluetoothAdapter();
            console.log("projectId:",projectId);
            if('' == projectId || undefined == projectId || null == projectId){
              wx.navigateTo({
                url: '../scanAddDevice/scanAddDevice?isNoBle=0'  
              })
            }else{
              wx.navigateTo({
                url: '/pages/selectAddProject/selectAddProject?isConnect=2'
              })
            }
          } else if (res.cancel) {
            wx.stopBluetoothDevicesDiscovery();
            wx.closeBluetoothAdapter();
            wx.navigateBack({
               delta: 1
            })
          }
        }
      })
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
          that.onBluetoothDeviceFound(res);
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
  
  // ab2hex(buffer) {
  //   var hexArr = Array.prototype.map.call(
  //     new Uint8Array(buffer),
  //     function(bit) {
  //       return ('00' + bit.toString(16)).slice(-2)
  //     }
  //   )
  //   return hexArr.join('');
  // },

  //监听蓝牙搜索
  onBluetoothDeviceFound(){
    const that = this
    wx.onBluetoothDeviceFound(function(res) {
      var devices = res.devices;
      console.log('new device list has founded')
      console.log("监听蓝牙设备信息",devices);
      // console.log(this.ab2hex(devices[0].advertisData))
     if(devices[0].advertisData){
      var buff = new Uint8Array(devices[0].advertisData);
      var arrayBuff = Array.prototype.map.call(new Uint8Array(buff), x => ('00' + 
      x.toString(16)).slice(-2)).join(':');
      var arrayMac = arrayBuff.toUpperCase();
      console.dir("获取所有的设备MAC地址：",arrayMac)
     }
      
    })
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
      console.log("扫码进入：");
      devices.forEach((list) => {
        // console.log("获取设备参数1：",list);
        

        //测试将mac地址写入
        var buf = new Uint8Array(list.advertisData);
          // var mac = buf.subarray();
          // mac = that.buf2hex(mac);
          // mac = mac.toLowerCase();
          // var snr = buf.subarray();
          // snr = String.fromCharCode.apply(null, snr);
          // console.log("获取Mac地址：",list.deviceId,list.llocalName,mac,snr);
          let snr = '';
          if(list.localName && undefined != list.localName){
            if((-1 != app.globalData.serial.indexOf(list.localName.split(':')[1]))|| (-1 != app.globalData.serial.indexOf(list.name.split(':')[1]))){
              snr = list.localName.split(':')[1];
              // snr = '3d6e7969faa570d';
              console.log("-------snr:",snr)
              wx.stopBluetoothDevicesDiscovery({
                success: function success(res) { },
                fail: function fail(res) {
                  console.log("stopBluetoothDevicesDiscovery fail :" + JSON.stringify(res));
                }
            });
            that.setData({
              deviceId:list.deviceId, //保存当前连接设备
              scanNumber: 0,
              deviceSn : snr
            });
            that.createBLEConnection();
            return;
           }
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
        app.globalData.bleCharacteristicId = that.data.deviceId;
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
        console.log("createBLEConnection fail " + that.data.connectNumber);
        console.log(res);
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
        for(var i = 0; i < res.services.length; i++){
          if(res.services[i].isPrimary){
            that.setData({
              uuid: res.services[0].uuid
            });
          }
        }
        
        // for (var i = 0; i < res.services.length; i++) {
        //   console.log(res.services[i].uuid.toString());
        //   if (res.services[i].uuid.toLowerCase().indexOf("a002") != -1) {
        //     that.setData({
        //       uuid: res.services[i].uuid
        //     });
        //   }
        // }
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

        for(var i = 0; i < res.characteristics.length; i++){
         if(res.characteristics[i].properties.write){
            that.setData({
              characteristic_write_uuid: res.characteristics[2].uuid,
              characteristic_indicate_uuid:res.characteristics[1].uuid
            });
         }
        }

        // for (var i = 0; i < res.characteristics.length; i++) {
        //   // if (res.characteristics[i].uuid.toLowerCase().indexOf("c304") != -1) {
        //   //   if (res.characteristics[i].properties.write) {
        //   //     that.setData({
        //   //         characteristic_write_uuid: res.characteristics[i].uuid
        //   //     });
        //   //   }
        //   // } else if (res.characteristics[i].uuid.toLowerCase().indexOf("c306") != -1) {
        //   //   if (res.characteristics[i].properties.indicate) {
        //   //     that.setData({
        //   //         characteristic_indicate_uuid: res.characteristics[i].uuid
        //   //     })
        //   //   }
        //   // }
        // }
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
    // setTimeout(function () {
    //   that.createBLEConnectionTryAgain();
    // }, 3000);

    // wx.navigateTo({
    //   url: `/pages/limitedNetworkSettings/limitedNetworkSettings?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}&characteristic_indicate_uuid=${that.data.characteristic_indicate_uuid}` 
    // })

    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: that.data.deviceId,
      serviceId: that.data.uuid,
      characteristicId: that.data.characteristic_indicate_uuid,
      success: function(res) {
        console.log("notifyBLECharacteristicValueChange success");
        console.log(res)
        that.setData({
          bleServicesTry : false,
        });


          console.log("deviceId:",that.data.deviceId)
          console.log("deviceSn:",that.data.deviceSn)
          console.log("uuid:",that.data.uuid)
          console.log("characteristic_write_uuid:",that.data.characteristic_write_uuid)
          // wx.navigateTo({
          //   url: `/pages/limitedNetworkSettings/limitedNetworkSettings?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}&characteristic_indicate_uuid=${that.data.characteristic_indicate_uuid}` 
          // })
          let times = setTimeout(()=>{
            if(!that.data.isApplyBle){
              that.setData({
                bleConnnectting:false,
                initBleSuccess:false,
              })
              wx.showModal({
                title: '提示',
                content: '连接失败,请重新连接!',
                success (res) {
                  if (res.confirm) {    
                    that.bleStart();
                  } else if (res.cancel) {
                    wx.stopBluetoothDevicesDiscovery();
                    wx.closeBluetoothAdapter();
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            }
          },15*1000)
          that.setData({
            timesName:times
          })
          wx.onBLECharacteristicValueChange(function(res) {
            console.log("元数据：",res.value);
            clearTimeout(times);
            that.setData({
              isApplyBle:true,
            })
            let flow = new Uint8Array(res.value)
            let placeholder = that.systemFun(flow[4],16) + "" + that.systemFun(flow[5],16);
            let cmds = parseInt(placeholder,16);
            console.log("命令符",cmds);
            console.log("第一位",flow[0])
            console.log('获取设备返回数据',that.ab2hex(res.value))
            let inclusion;
            if('10001' == cmds){
              inclusion = JSON.parse(that.ab2hex(res.value).slice(9))
              that.setData({
                client_nonce:inclusion.client_nonce,
                sn:inclusion.sn,
                scene:inclusion.scene
              })
            }
            console.log('获取设备返回数据截取',inclusion)
            

            console.log(res.value);
            that.processingData(res.value)
            if('10001' == that.data.saveNCmdId){
              let arr = new Array(4);
              let randoms = '';
              arr[0] = 'wxwork';
              arr[1] = that.data.client_nonce;
              arr[2] = random6();
              randoms = arr[2];
              arr[3] = 'handshake';
              let sort = arr.sort().toString();
              console.log("倒叙加密：",sort.replace(/,/g,''));
              let sha1Pw = sha1.HmacSHA1(sort.replace(/,/g,''),key);
              console.log('sha1加密:', sha1Pw.toString());
              let bleReset = {};
                bleReset["errcode"] = '0';
                bleReset["errmsg"] = 'ok';
                bleReset["server_nonce"] = randoms;
                bleReset["signature"] = sha1Pw.toString();
                console.log("包体内容: " + JSON.stringify(bleReset));
                let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
                var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
                var bufViewL = new Uint8Array(bufLength);
                console.log("包体内容",bleResetBuff);
                let pkgfixhead = new Uint8Array(bleResetBuff);
                let buffer = that.systemCommand(bufViewL.length+ 9,that.str16ToBuffer(bufViewL.length + 9),that.str16ToBuffer(20001),bleResetBuff);
                console.log("返回设备上的包文件：",buffer)
                that.bleWrite(buffer);
            }

            if('10002' == that.data.saveNCmdId){
               console.log("握手成功！");
               that.setData({
                initBleSuccess :true,
               })
                wx.navigateTo({
                  url: `/pages/bleOperationMode/bleOperationMode?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}&characteristic_indicate_uuid=${that.data.characteristic_indicate_uuid}&bMagicNumber=${that.data.bMagicNumber}&bVer=${that.data.bVer}&nLength=${that.data.nLength}&nCmdId=${that.data.nCmdId}&nSep=${that.data.nSep}&nProtoType=${that.data.nProtoType}` 
                })
              //  console.log('获取握手返回的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType)
              //  let buff = that.queryDevice(that.data.bMagicNumber,that.data.bVer,9,[117,52],that.data.nSep,that.data.nProtoType);
              //  that.bleQUeryDevice(buff);
            }

            if('10004' == that.data.saveNCmdId){
              console.log("查询设备状态成功！");
              let inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9))
              console.log("获取设备状态包体内容：",inclusionBodies)
              if(0 != inclusionBodies.errcode){
                console.log('获取查询设备状态返回的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType);
              let bleReset = {};
              bleReset['req_id'] = that.data.deviceId;
              bleReset['limit'] = 5;
              let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
              var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
              var bufViewL = new Uint8Array(bufLength);
              let buffer = that.getWifiListCommand(bufViewL.length+ 9,[117,53],bleResetBuff);
              that.blewifiList(buffer);
              }else if(0 == inclusionBodies.errcode && inclusionBodies.wifi_connected){
                wx.showToast({
                  title:"wifi设置成功",
                  icon: 'none',
                  duration: 2000
                })
              //   wx.navigateTo({
              //   url: `/pages/limitedNetworkSettings/limitedNetworkSettings?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}`  
              // })
              }
            }

            if('10005' == that.data.saveNCmdId){
              that.setData({
                wifiList:that.ab2hex(res.value).slice(9),
              })
              console.log("当前返回的wifi数据：",that.ab2hex(res.value))
              console.log('wifi数据：',that.data.wifiList); 
            }
            if(isNaN(that.data.saveNCmdId)){
              that.setData({
                wifiList:that.data.wifiList+that.ab2hex(res.value)
              })
              console.log("当前返回的wifi数据：",that.ab2hex(res.value))
              console.log('wifi数据：',that.data.wifiList); 

              let lastWifiData = that.ab2hex(res.value).indexOf(']');
              console.log("是否是最后一条数据：",lastWifiData)
              if(-1 != lastWifiData){
                let completeData =  that.data.wifiList.replace(/\\/g,"");
                console.log("完整数据",completeData);
                console.log("判断类型：",typeof completeData);
                let wifiJson = completeData.replace(/\s*/g,"");
                console.log("获取[下标",wifiJson.indexOf('['));
                console.log("获取]下标",wifiJson.indexOf(']'));
                let beforeFlag = wifiJson.indexOf('[');
                let afterFlag = wifiJson.indexOf(']');
                let wifiList = wifiJson.slice(beforeFlag,afterFlag+1);
                console.log("wifi转换",JSON.parse(wifiList));  
                console.log('获取wifi列表的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType);
                let bleReset = {};
                bleReset['ssid'] = 'QY08';
                bleReset['password'] = 'qianyi888';
                let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
                var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
                var bufViewL = new Uint8Array(bufLength);
                let buffer = that.getWifiListCommand(bufViewL.length+ 9,[117,51],bleResetBuff);
                that.bleSetwifi(buffer); 
              } 
            }
          })
      },
      fail: function(res) {
        console.error("notifyBLECharacteristicValueChange fail");
        console.error(res);
      },
      complete:function(res){
        console.log("notifyBLECharacteristicValueChange complete");
        console.log(res);
      }
    });
  },


  //握手确认
  systemCommand(totalTength,headerLength,cmd,bodies){ //totalTength=>总长度;headerLength=>头长度;cmd=>命令符;bodies=>包体内容
    const that = this;
    let pkgfixhead = new Uint8Array(bodies);
    let arr = [];
    pkgfixhead.forEach((item,index)=>{
      arr.push(item);
    })
    console.log(totalTength)
    let buffer = new ArrayBuffer(totalTength);
    let dataView = new DataView(buffer);
    dataView.setUint8(0,that.data.bMagicNumber);
    dataView.setUint8(1,that.data.bVer);
    dataView.setUint8(2,0);
    dataView.setUint8(3,totalTength);
    // if(headerLength.length <= 2){
    //   dataView.setUint8(2,0);
    //   dataView.setUint8(3,parseInt(headerLength[0]+headerLength[1]));
    // }else if(2 < headerLength.length <= 3){
    //   dataView.setUint8(2,parseInt(headerLength[0]));
    //   dataView.setUint8(3,parseInt(headerLength[1]+headerLength[2]));
    // }else{
    //   dataView.setUint8(2,parseInt(headerLength[0]+headerLength[1]));
    //   dataView.setUint8(3,parseInt(headerLength[2]+headerLength[3]));
    // }
    // if(cmd.length <= 2){
    //   dataView.setUint8(4,0);
    //   dataView.setUint8(5,parseInt(cmd[0]+cmd[1]));
    // }else if(2 < cmd.length <= 3){
    //   dataView.setUint8(4,parseInt(cmd[0]));
    //   dataView.setUint8(5,parseInt(cmd[1]+cmd[2]));
    // }else{
    //   dataView.setUint8(4,78);
    //   dataView.setUint8(5,33);
    // }
    dataView.setUint8(4,78);
    dataView.setUint8(5,33);
    dataView.setUint8(6,parseInt(that.data.nSep[0]));
    dataView.setUint8(7,parseInt(that.data.nSep[1]));
    dataView.setUint8(8,parseInt(that.data.nProtoType));
    for(let i=9;i<totalTength;i++){
      dataView.setUint8(i,parseInt(arr[i-9]));
    }
    console.log("发送包文件:",buffer);
    return buffer;
  },

  //查询设备状态
  queryDevice(bMagicNumber,bVer,nLength,nCmdId,nSeq,nProtoType){
    let buffer = new ArrayBuffer(20);
    let dataView = new DataView(buffer);
    dataView.setUint8(0,bMagicNumber);
    dataView.setUint8(1,bVer);
    dataView.setUint8(2,0);
    dataView.setUint8(3,nLength);
    dataView.setUint8(4,nCmdId[0]);
    dataView.setUint8(5,nCmdId[1]);
    dataView.setUint8(6,nSeq[0]);
    dataView.setUint8(7,nSeq[1]);
    dataView.setUint8(8,nProtoType);
    for(let i=9;i<20;i++){
      dataView.setUint8(i,0);
    }
    console.log("发送查询设备包文件:",buffer);
    return buffer;
  },

  //获取wifi列表
  getWifiListCommand(totalTength,cmd,bodies){
    const that = this;
    let pkgfixhead = new Uint8Array(bodies);
    let arr = [];
    pkgfixhead.forEach((item,index)=>{
      arr.push(item);
    })
    let buffer = new ArrayBuffer(totalTength);
    let dataView = new DataView(buffer);
    dataView.setUint8(0,that.data.bMagicNumber);
    dataView.setUint8(1,that.data.bVer);
    dataView.setUint8(2,0);
    dataView.setUint8(3,totalTength);
    dataView.setUint8(4,cmd[0]);
    dataView.setUint8(5,cmd[1]);
    dataView.setUint8(6,parseInt(that.data.nSep[0]));
    dataView.setUint8(7,parseInt(that.data.nSep[1]));
    dataView.setUint8(8,parseInt(that.data.nProtoType));
    for(let i=9;i<totalTength;i++){
      dataView.setUint8(i,parseInt(arr[i-9]));
    }
    console.log("发送包文件:",buffer);
    return buffer;
  },

 

  str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
      if(bufView[i] == 0){
        bufView[i] = 0x30;
      }
    }
    return buf;
  },

  processingData(buf){
    // console.log("返回数据：",buf);
    let pkgfixhead = new Uint8Array(buf);
    let bMagicNumber = null;
    let bVer = null;
    let nLength = null;
    let nCmdId = null;
    let nSep = null;
    let nProtoType = null;
    // pkgfixhead.forEach((item,index)=>{
    //   if('fe' == that.ab2hex16(item)){
    //     bMagicNumber
    //   }
    // })
    if(-1 != that.ab2hex16(buf).indexOf('fe')){
      bMagicNumber = that.systemFun(pkgfixhead[0],16);
      bVer = that.systemFun(pkgfixhead[1],16);
      nLength = that.systemFun(pkgfixhead[2],16) + "" + that.systemFun(pkgfixhead[3],16);
      nCmdId = that.systemFun(pkgfixhead[4],16) + "" + that.systemFun(pkgfixhead[5],16);
      nSep = that.systemFun(pkgfixhead[6],16) + "" + that.systemFun(pkgfixhead[7],16);
      nProtoType = that.systemFun(pkgfixhead[8],16);

    }
    if(isNaN(parseInt(nCmdId,16))){
      that.setData({
        saveNCmdId:parseInt(nCmdId,16),
      })
    }else{
      that.setData({
        bMagicNumber:pkgfixhead[0],
        bVer:pkgfixhead[1],
        nLength:[pkgfixhead[2],pkgfixhead[3]],
        nCmdId:[pkgfixhead[4],pkgfixhead[5]],
        saveNCmdId:parseInt(nCmdId,16),
        nSep:[pkgfixhead[6],pkgfixhead[7]],
        nProtoType:parseInt(pkgfixhead[8])
      })
    }
    
    console.log("返回指令：",parseInt(nCmdId,16));
  },

  //16进制转arrayBuffer
  str16ToBuffer(str16){
    let value = str16.toString(16);
    var hex = value;
    console.log(hex.match(/[\da-f]{1}/gi))
    return hex.match(/[\da-f]{1}/gi);
  },

  //10转16进制
  systemFun(num,sys){//进制转换 ，num 将被转换的10进制数，sys 进行转换的进制变量 (值: 2 --- 16 )
    let s=[],num1;
    function ShiftFun(num){//变量 s 声明提前了 ，在同一个函数里用的是同一个变量 ---- s
      switch(num){//
        case 0:s.push("a");break;
        case 1:s.push("b");break;
        case 2:s.push("c");break;
        case 3:s.push("d");break;
        case 4:s.push("e");break;
        case 5:s.push("f");break;
      }
    }
    if(sys<2 || sys>16){
      console.error("只能进行2-16进制的转换");
      return ;
    }
    if(sys>10){//
      for(;num>=sys;){
        num1 = num%sys
        // console.log("num1",num1)
        if(num1>=10){
          ShiftFun(num1-10);
        }else{
          s.push(num1);
        }
        num = parseInt(num/sys);
      }
      
      if(num>=10){
        ShiftFun(num-10);
      }else{
        s.push(num);
      }
      
    } else {//
      for(;num>=sys;){
        s.push(num%sys);
        num = parseInt(num/sys);
      }
      s.push(num);
    }
    s.reverse();//前后颠倒
    s=s.join("");//数组合并
    // console.log(s);
    return s;
    
  },

  hex2int10(hex) {
    var len = hex.length, a = new Array(len), code;
    for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48<=code && code < 58) {
            code -= 48;
        } else {
            code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
    }
     
    return a.reduce(function(acc, c) {
        acc = 16 * acc + c;
        return acc;
    }, 0);
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
  
  ab2hex(e) {
    for (var a = e, i = new DataView(a), n = "", s = 0; s < i.byteLength; s++) n += String.fromCharCode(i.getUint8(s));
    return n
  },

  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },

   //发送报文给设备
   bleWrite(buf) {
    //  console.log("write buf:" + String.fromCharCode.apply(null, new Uint8Array(buf)));
    console.log("deviceId:",that.data.deviceId);
    console.log("uuid:",that.data.uuid);
    console.log("characteristic_write_uuid:",that.data.characteristic_write_uuid);
    console.log("value:",buf);
      let buffer = buf;
      let pos = 0;
      let bytes = buffer.byteLength;
      console.log("bytes", bytes)
      while (bytes > 0) {
        console.log("pos:",pos)
        let tmpBuffer;
        if (bytes > 20) {
          tmpBuffer = buffer.slice(pos, pos + 20);
            pos += 20;
            bytes -= 20;
            console.log("tmpBuffer", tmpBuffer)
            wx.writeBLECharacteristicValue({
              deviceId: that.data.deviceId,
              serviceId: that.data.uuid,
              characteristicId: that.data.characteristic_write_uuid,
              value: tmpBuffer,
              success(res) {
                console.log('第一次发送', res)
              }
            })
        } else {
            tmpBuffer = buffer.slice(pos, pos + bytes);
            let pkgfixhead = new Uint8Array(tmpBuffer);
            let newBuffer = new ArrayBuffer(20);
            let newDataView = new DataView(newBuffer);
            for(let i = 0;i<20;i++){
              if(i > pkgfixhead.length){
                newDataView.setUint8(i,0)
              }else{
                newDataView.setUint8(i,pkgfixhead[i])
              }
            }
            console.log("pkgfixhead长度",pkgfixhead.length);
            console.log("tmpBuffer",tmpBuffer);
            console.log("newBuffer",newBuffer);
            pos += bytes;
            bytes -= bytes;
            wx.writeBLECharacteristicValue({
              deviceId: that.data.deviceId,
              serviceId: that.data.uuid,
              characteristicId: that.data.characteristic_write_uuid,
              value:newBuffer,
              success: function(res) {
                console.log('第二次发送', res)
              },
              fail: function(res) {
                console.log('发送失败', res)
              },
              complete :function(res) {
              //  console.log("sendData writeBLECharacteristicValue1 complete");
              }
            });
        }
      }
    },

    //发送查询设备文件
    bleQUeryDevice(buf){
      const that = this;
      wx.writeBLECharacteristicValue({
            deviceId: that.data.deviceId,
            serviceId: that.data.uuid,
            characteristicId: that.data.characteristic_write_uuid,
            value:buf,
            success: function(res) {
              console.log('发送查询设备成功', res)
            },
            fail: function(res) {
              console.log('发送失败', res)
            },
            complete :function(res) {
            //  console.log("sendData writeBLECharacteristicValue1 complete");
            }
          });
    }, 

    //发送获取wifi列表文件
    blewifiList(buf){
      let buffer = buf;
      let pos = 0;
      let bytes = buffer.byteLength;
      console.log("bytes", bytes)
      while (bytes > 0) {
        console.log("pos:",pos)
        let tmpBuffer;
        if (bytes > 20) {
          tmpBuffer = buffer.slice(pos, pos + 20);
            pos += 20;
            bytes -= 20;
            console.log("tmpBuffer", tmpBuffer)
            wx.writeBLECharacteristicValue({
              deviceId: that.data.deviceId,
              serviceId: that.data.uuid,
              characteristicId: that.data.characteristic_write_uuid,
              value: tmpBuffer,
              success(res) {
                console.log('第一次发送', res)
              }
            })
        } else {
            tmpBuffer = buffer.slice(pos, pos + bytes);
            let pkgfixhead = new Uint8Array(tmpBuffer);
            let newBuffer = new ArrayBuffer(20);
            let newDataView = new DataView(newBuffer);
            for(let i = 0;i<20;i++){
              if(i > pkgfixhead.length){
                newDataView.setUint8(i,0)
              }else{
                newDataView.setUint8(i,pkgfixhead[i])
              }
            }
            console.log("pkgfixhead长度",pkgfixhead.length);
            console.log("tmpBuffer",tmpBuffer);
            console.log("newBuffer",newBuffer);
            pos += bytes;
            bytes -= bytes;
            wx.writeBLECharacteristicValue({
              deviceId: that.data.deviceId,
              serviceId: that.data.uuid,
              characteristicId: that.data.characteristic_write_uuid,
              value:newBuffer,
              success: function(res) {
                console.log('第二次发送', res)
              },
              fail: function(res) {
                console.log('发送失败', res)
              },
              complete :function(res) {
              //  console.log("sendData writeBLECharacteristicValue1 complete");
              }
            });
        }
      }
    },

    //设置wifi密码
    bleSetwifi(buf){
      let buffer = buf;
      let pos = 0;
      let bytes = buffer.byteLength;
      console.log("bytes", bytes)
      while (bytes > 0) {
        console.log("pos:",pos)
        let tmpBuffer;
        if (bytes > 20) {
          tmpBuffer = buffer.slice(pos, pos + 20);
            pos += 20;
            bytes -= 20;
            console.log("tmpBuffer", tmpBuffer)
            wx.writeBLECharacteristicValue({
              deviceId: that.data.deviceId,
              serviceId: that.data.uuid,
              characteristicId: that.data.characteristic_write_uuid,
              value: tmpBuffer,
              success(res) {
                console.log('第一次发送', res)
              }
            })
        } else {
            tmpBuffer = buffer.slice(pos, pos + bytes);
            let pkgfixhead = new Uint8Array(tmpBuffer);
            let newBuffer = new ArrayBuffer(20);
            let newDataView = new DataView(newBuffer);
            for(let i = 0;i<20;i++){
              if(i > pkgfixhead.length){
                newDataView.setUint8(i,0)
              }else{
                newDataView.setUint8(i,pkgfixhead[i])
              }
            }
            console.log("pkgfixhead长度",pkgfixhead.length);
            console.log("tmpBuffer",tmpBuffer);
            console.log("newBuffer",newBuffer);
            pos += bytes;
            bytes -= bytes;
            wx.writeBLECharacteristicValue({
              deviceId: that.data.deviceId,
              serviceId: that.data.uuid,
              characteristicId: that.data.characteristic_write_uuid,
              value:newBuffer,
              success: function(res) {
                console.log('第二次发送', res)
              },
              fail: function(res) {
                console.log('发送失败', res)
              },
              complete :function(res) {
              //  console.log("sendData writeBLECharacteristicValue1 complete");
              }
            });
        }
      }
    },

    delay(ms,res) {
      return new Promise(function(resolve,reject) {
          setTimeout(function() {
              resolve(res);
          }, ms);
      });
    },


  next: function(){
    if(this.data.initBleSuccess){
      wx.navigateTo({
      //  url: `/pages/setMode/setMode?deviceId=${this.data.deviceId}&deviceSn=${this.data.deviceSn}&uuid=${this.data.uuid}&characteristic_write_uuid=${this.data.characteristic_write_uuid}`  
        url: `/pages/connectWifi/connectWifi?deviceId=${this.data.deviceId}&deviceSn=${this.data.deviceSn}&uuid=${this.data.uuid}&characteristic_write_uuid=${this.data.characteristic_write_uuid}&Antifea=true&Score=2` 
      })
    }
  },

  onHide:function(){
    clearTimeout(that.data.timesName);
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    prevPage.onPullDownRefresh();
  },

  onUnload:function(){
    clearTimeout(that.data.timesName);
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    prevPage.onPullDownRefresh();
  }
})

