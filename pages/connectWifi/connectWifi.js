// pages/connectWifi/connectWifi.js
var utils = require('../../utils/util.js');
const app = getApp();
var that;
var timeOut = null;

var sendTimeout = null;
var writeTimeout = null;

var writeTimeoutCount = 0;
var sendJsonPacket = "";

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
    mac: "c44f3322db83",

    //蓝牙通讯接收的缓存
    bleRecvBuf: "",

    //配置设备所需要的变量
    //--通讯方式
    netMode: "wifi",  
    //--wifi相关
    ssid: "",
    wifiPwdInput: "",
    //--以太网相关
    dhcp: true,
    ipInput: "",
    maskInput: "",
    gatewayInput: "",

    //连接蓝牙设备所需要的变量
    scanNumber: 10,

    deviceId: "",

    uuid: "",
    characteristic_read_uuid: "",
    characteristic_write_uuid: "",
    characteristic_indicate_uuid: "",

    //初始化是否成功表示
    initBleSuccess : false,
    initWifiSuccess :false,

    bleConnnectting: true,
    
    //控制UI界面所需要的变量
    showWifiFail : false,
    showWifiConfig : true,
    wifiDhcpEnable: false,
    showWifiNoDhcpConfig: false,
    showWifiListBox:false,

    showEthConfig: false,
    showEthNoDhcpConfig: false, 
    ethDhcpEnable: false,

    failtipshow : false,

    packetReturnOk : false,

    sysinfo:'',
    deviceSn:'',

    itemsList:[  // 云端连接 
      {value: '1', name: '云端平台', checked: 'true'},
      {value: '2', name: '本地服务'}
    ],
    socketUrl:'openhw.work.weixin.qq.com:443',
    openEyes:false,

    Antifea:'',//活体开关
    LANUrl:'', // 局域网地址
    Score:'', // 阈值,

    dhcpSelctShow : true
  },
  //事件处理函数
  onLoad: function (options) {
    that = this;
    this.setData({
      deviceId:options.deviceId || '',
      characteristic_write_uuid:options.characteristic_write_uuid  || '',
      uuid:options.uuid || '',
      deviceSn:options.deviceSn || "",
      Antifea:options.Antifea || '',  // 局域网开关
      LANUrl:options.LANUrl || '', // 局域网地址
      Score:options.Score || '' // 阈值
    })
    this.getSystemInfo() // 判断系统是IOS还是安卓
    this.onBLECharacteristicValueChange()  // 蓝牙连接成功，需要监听蓝牙变化，以便发送数据
    that.startWifi();
    wx.setNavigationBarTitle({
      title:'连接wifi'
    })
  },
  // 获取系统版本是 苹果还是安卓
  getSystemInfo(){
    wx.getSystemInfo({
      success: function(res) {
        if(res.system && res.system.indexOf('iOS') > -1){
          that.setData({sysinfo: 'iOS'})
          that.showTipsBox()
        }else{
          that.setData({ sysinfo: 'Android'})
        }
      }
    });
  },
  // 9.监听低功耗蓝牙设备的特征值变化事件 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
  onBLECharacteristicValueChange () {
    console.log("11.onBLECharacteristicValueChange");
    wx.onBLECharacteristicValueChange(function (res) {
      console.log(that.buf2str(res.value))
      that.setData({bleRecvBuf: that.data.bleRecvBuf + that.buf2str(res.value).replace("\r\n", "")})
      console.log("last:" + that.data.bleRecvBuf)
      if (timeOut != null) {
        clearTimeout(timeOut);
      }

      if(that.data.packetReturnOk){
        clearTimeout(timeOut);
        timeOut = null;
        clearTimeout(sendTimeout);
        clearTimeout(writeTimeout);
        that.setData({
          bleRecvBuf:''
        })
        return;
      }

      timeOut = setTimeout(function () {
        console.log("rev time out start to handle!");

        var returnOk = false;
        var packetOk = false;
        var returnFail = false;
        console.log("bleRecvBuf",that.data.bleRecvBuf)
        while(that.data.bleRecvBuf.length > 0){
          var count = 0;
          var findFirst = false;
          var firstPos = 0;
          for (var i = 0; i < that.data.bleRecvBuf.length; i++) {
            var c = that.data.bleRecvBuf.substr(i, 1);
            if(c == '{'){
              console.log('c值1:',c)
              count++;
              if(!findFirst){
                firstPos = i;
                findFirst = true;
              }
            }else if(c == '}'){
              console.log('c值2:',c)
              if(findFirst){
                count--;
                if(count == 0){
                  var subBuf = that.data.bleRecvBuf.substr(firstPos, i + 1 - firstPos);
                  try{
                    var rJson = JSON.parse(subBuf);
                    console.log('rJson',rJson)
                    packetOk = true;
                    if (rJson.c.toString() == "dC") {
                      if (rJson.r.toString() == 1) {
                        returnOk = true;
                        that.setData({
                          packetReturnOk : true
                        });
                      }else if (rJson.r.toString() == 0) {
                        returnFail = true;
                      }
                    }
                  }catch(err){
    
                  }
                  break;
                }
              }
            }
          }
          that.data.bleRecvBuf = that.data.bleRecvBuf.substr(i+1);
        }

        if(packetOk){
          if(returnOk){

            var bleReset = {};
            bleReset["cmd"] = "uReset";
            console.log("reset: " + JSON.stringify(bleReset));
            var buffer = that.str2ab(JSON.stringify(bleReset));
            that.bleWrite(buffer);

            // wx.navigateTo({url: `/pages/codeConfigDeviceName/codeConfigDeviceName?from=mode`});
          }else{

            if(returnFail){
              wx.showToast({
                image : '../../image/error.png',
                title: '配网不成功',
                duration: 3000,
                mask: true
              });
              that.setData({
                failtipshow : true
              });
            }
          }

          clearTimeout(timeOut);
          timeOut = null;
          clearTimeout(sendTimeout);
          clearTimeout(writeTimeout);
          that.setData({
            bleRecvBuf:''
          })
        }

      }, 100);
    });
  },
  buf2str: function (buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  },
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  //1.初始化 Wi-Fi 模块
  startWifi : function(){
    console.log("startWifi");
    wx.startWifi({
      success(res) {
        that.getWifiList();
      },fail(e){}
    });
  },
  //2.获取 Wi-Fi 列表数据
  getWifiList(){
    console.log('getWifiList')
    // ios系统不允许微信获取到wifi列表
    if(that.data.sysinfo === 'iOS'){
      that.setData({
        wifiList: [],
        initWifiSuccess : true,
      });
    }else{  // 安卓
      wx.getWifiList({//成功后，就可以获取列表了
        success: function(res) {
          //列表获取成功后，要到事件里提取  苹果到这里回调到手机WiFi设置去
          that.onGetWifiList()
        },  
        fail: function(res) {
          console.log("getWifiList fail");
        }
      });
    }
  },
  //3.监听获取到 Wi-Fi 列表数据
  onGetWifiList : function(){
    console.log("onetWifiList");
    wx.onGetWifiList(function (res) {
      that.createWifiDeviceList(res.wifiList);
    });
  },
  createWifiDeviceList: function (wifiList) {
    console.log('createWifiDeviceList')
    wifiList.sort(function (a, b) {
      return b.signalStrength - a.signalStrength
    });
    var cb = new Array();
    cb.splice(0, cb.length);
    wifiList.forEach(function (list) {
    //  console.log(list);
      // 过滤掉5G网络  2020/08/29 小茶 add
      if (list.SSID != ""){
      //  if(list.frequency == undefined){
          cb.push(list);
      //  }else{
     //     if (list.frequency < 5000){
      //      cb.push(list);
       //   }
      //  }
      }
    });
    that.setData({
      wifiList: cb,
      initWifiSuccess : true,
    });
    // that.showWifiList();
  },
  netConnModeChange: function (e) {
    switch (e.currentTarget.dataset.item.name) {
      case 'wifi':
        this.setData({
          dhcpSelctShow : true,
          netMode: "wifi",
          showWifiConfig: true,
          showEthConfig: false,
          dhcp : true,
          showWifiNoDhcpConfig: false
        });
        break;
      case 'eth':
        this.setData({
          dhcpSelctShow : false,
          netMode: "eth",
          showWifiConfig: false,
          showEthConfig: true,
          dhcp: false,
          showWifiNoDhcpConfig: true
        });
        break;
    };
  },
  wifiDhcpChange : function(e){
    if (e.detail.value == "true"){
      this.setData({
        dhcp : true,
        showWifiNoDhcpConfig: false
      });
    } else{
      this.setData({
        dhcp: false,
        showWifiNoDhcpConfig: true
      });
    }
  },
  ethDhcpChange : function(e){
    if (e.detail.value == "true"){
      this.setData({
        dhcp : true,
        showEthNoDhcpConfig: false
      });
    } else{
      this.setData({
        dhcp: false,
        showEthNoDhcpConfig: true
      });
    }

  },
  wifiPwdInput: function wifiPwdInput(e) {
    this.setData({
      wifiPwdInput: e.detail.value
    });
  },
  ipInput: function ipInput(e) {
    this.setData({
      ipInput: e.detail.value
    });
  },
  maskInput: function maskInput(e) {
    this.setData({
      maskInput: e.detail.value
    });
  },
  gatewayInput: function gatewayInput(e) {
    this.setData({
      gatewayInput: e.detail.value
    });
  },
  wifiSsidInput: function wifiSsidInput(e){
    this.setData({
      ssid: e.detail.value
    })
  },
  wifiPwdInput: function(e){
    this.setData({
      wifiPwdInput: e.detail.value
    })
  },
  configBLE: function configBLE() {

    that.setData({
      failtipshow : false
    });

    this.data.bleRecvBuf = "";
    var bleConfig = {};
    bleConfig["cmd"] = "uConfig";
    if (this.data.netMode == "wifi"){
      if (this.data.ssid == '' ||  this.data.wifiPwdInput == ''){
        wx.showToast({
          title: 'Wi-Fi和密码不能为空喔！',
          icon: 'none',  //success,loading,none
          duration: 2000
        })
        return;
      }
      bleConfig["Communication"] = "Wifi";
      
      bleConfig["WifiSsid"] = this.data.ssid;
      bleConfig["WifiPwd"] = this.data.wifiPwdInput;

      bleConfig["SsidBase64"] = utils.base64Encode(this.data.ssid);
      bleConfig["PwdBase64"] = utils.base64Encode(this.data.wifiPwdInput);
    //  var base = new Base64();
    //  bleConfig["SsidBase64"] = base.encode(this.data.ssid);

      if(this.data.dhcp == true){
        bleConfig["DHCP"] = "true";
      }else{
        if (this.data.ipInput == '' || this.data.maskInput == '' || this.data.gatewayInput == '') {
          wx.showToast({
            title: 'IP地址、子掩码、网关IP不能为空喔！',
            icon: 'none',  //success,loading,none
            duration: 2000
          })
          return;
        }
        bleConfig["DHCP"] = "false";

        bleConfig["SrcIp"] = this.data.ipInput;
        bleConfig["Netmask"] = this.data.maskInput;
        bleConfig["Gateway"] = this.data.gatewayInput;
      }
      
    } else if (this.data.netMode == "eth"){
      bleConfig["Communication"] = "Ethernet";

      if (this.data.dhcp == true){
        bleConfig["DHCP"] = "true";
      }else{
        if (this.data.ipInput == '' || this.data.maskInput == '' || this.data.gatewayInput == '') {
          wx.showToast({
            title: 'IP地址、子掩码、网关IP不能为空喔！',
            icon: 'none',  //success,loading,none
            duration: 2000
          })
          return;
        }
        bleConfig["DHCP"] = "false";

        bleConfig["SrcIp"] = this.data.ipInput;
        bleConfig["Netmask"] = this.data.maskInput;
        bleConfig["Gateway"] = this.data.gatewayInput;
      }
    }
    bleConfig["Antifea"] = this.data.Antifea // 活体打开与否
    bleConfig["Score"] = this.data.Score; // 阈值
  //  bleConfig["SSIDBase64"] = 
    // 选择企业微信，DIP默认不给
    //if(this.data.LANUrl){
   //   var domainMetas = this.data.LANUrl.split(":");
   //   var protocol = domainMetas&&domainMetas.length>1&&domainMetas[1]==='443'?'wss://':'ws://';
      bleConfig["DIP"] = this.data.LANUrl;
    //}

    bleConfig["flow"] = Date.parse(new Date()) / 1000;
    sendJsonPacket = JSON.stringify(bleConfig);

    writeTimeoutCount = 2;
    that.setWriteBleAgainTimer();

    console.log("config: " + JSON.stringify(bleConfig));
    var buffer = that.str2ab(JSON.stringify(bleConfig));
    that.bleWrite(buffer);

    wx.showLoading({
      title: '配置中...',
    });
    sendTimeout = setTimeout(function () { 
      wx.showToast({
        title: '配置超时！',
        icon: 'none',
        duration: 2000
      });
    }, 60000);
  },
  setWriteBleAgainTimer(){
    writeTimeout = setTimeout(function () { 
      var buffer = that.str2ab(sendJsonPacket);
      that.bleWrite(buffer);    //重发

      if(writeTimeoutCount > 0 ){
        writeTimeoutCount --;        
        that.setWriteBleAgainTimer();
      }
      
    }, 5000);
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
  //发送报文给设备
  bleWrite(buf) {
  //  console.log("write buf:" + String.fromCharCode.apply(null, new Uint8Array(buf)));
  console.log("deviceId:",that.data.deviceId);
  console.log("uuid:",that.data.uuid);
  console.log("characteristic_write_uuid:",that.data.characteristic_write_uuid);
  console.log("value:",buf);
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.uuid,
      characteristicId: that.data.characteristic_write_uuid,
      value: buf,
      success: function(res) {
        console.log("sendData writeBLECharacteristicValue success",res);
      },
      fail: function(res) {
        console.log("sendData writeBLECharacteristicValue fail: " + JSON.stringify(res));
      },
      complete :function(res) {
      //  console.log("sendData writeBLECharacteristicValue1 complete");
      }
    });
  },
  selecttWifiBtn: function (even) {
    that.setData({
      ssid: even.detail.currentTarget.dataset.id || '', //保存当前连接设备
      showWifiConfig: true,
      showWifiListBox:false
    });
  },
  flushWifiBtn : function(even){
    console.log(even);
    that.setData({
      wifiList : {}
    });
    that.startWifi();
  },
  showWifiList() {
    if(that.data.initWifiSuccess){
      this.setData({
        showWifiListBox : !this.data.showWifiListBox
      })
      if(this.data.showWifiListBox){
        this.selectComponent("#wifi-ref").showModel();
      }else{
        this.selectComponent("#wifi-ref").closeModel();
        that.flushWifiBtn();
      }
    }
  },
  onUnload: function(){
    console.log("onUnload");
    wx.closeBLEConnection({
      deviceId : that.data.deviceId,
      success(res) {
        console.log(res)
      }
    });

    wx.closeBluetoothAdapter({
      complete: function (res) {
      }
    });
  },
  toggleEyes(){
    this.setData({
      openEyes:!this.data.openEyes,
      wifiPwdInput:this.data.wifiPwdInput
    })
  },
  closeTipsBox(){
    this.selectComponent("#tips-ref").closeModel()
  },
  showTipsBox(){
    this.selectComponent("#tips-ref").showModel()
  }
})