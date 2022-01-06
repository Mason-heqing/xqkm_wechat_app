// pages/wifiSet/wifiSet.js
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:0,
    selectName:'',
    bMagicNumber:null,
    bVer:null,
    nLength:null,
    nCmdId:null,
    saveNCmdId:null,
    nSep:null,
    nProtoType:null,
    openDoorMessage:true,
    switchChecked:false,
    isClickCheck:false,
    currentName:'',
    wifiPassword:'',
    wifiLists:null,
    wifiList:[],
    deviceId:'',
    deviceSn:'',
    uuid:'',
    characteristic_write_uuid:'',
    characteristic_indicate_uuid:'',
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
    itemWifiData:null,
    bMagicNumber:null,
    bVer:null,
    nLength:null,
    nCmdId:null,
    nSep:null,
    nProtoType:null,
    isSetWifiPassword:0,
    isCanSet:true,
    isCurrentPage:false,
    // Antifea:'',
    // LANUrl:'',
    // Score:''
  },

  switchChange(e){
     const that = this;
     console.log(e.detail.value)
     if(that.data.isClickCheck){
      that.setData({
        switchChecked:e.detail.value,
        isSetWifiPassword:2
       })
       if(e.detail.value){
        let bleReset = {};
        bleReset['wifi_switch'] = true;
        let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
        var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
        var bufViewL = new Uint8Array(bufLength);
        let buffer = that.getWifiListCommand(bufViewL.length+ 9,[117,141],bleResetBuff);
        console.log("开启蓝牙",buffer)
        that.bleSetwifi(buffer); 
       }else{
        let bleReset = {};
        bleReset['wifi_switch'] = false;
        let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
        var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
        var bufViewL = new Uint8Array(bufLength);
        let buffer = that.getWifiListCommand(bufViewL.length+ 9,[117,141],bleResetBuff);
        console.log("关闭蓝牙",buffer)
        that.bleSetwifi(buffer); 
       }  
     }
  },



  trimWifiPassword(e){
     const that = this;
     that.setData({
       wifiPassword:e.detail.value.replace(/\s+/g, ''),
     })
  },

  clickMask(){
    this.setData({ openDoorMessage: true })
  },

  setPassword(e){
    const that = this;
    let name = e.currentTarget.dataset.ssid;
    if(that.data.isCanSet){
      this.setData({ 
        selectName:name,
        openDoorMessage: false,
        wifiPassword:''
       })
    }
    
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


  // 9.监听低功耗蓝牙设备的特征值变化事件 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
  onBLECharacteristicValueChange () {
    const that = this;
    wx.onBLECharacteristicValueChange(function(res) {
      /**/
      console.log("元数据：",res.value);
      that.processingData(res.value)
      if('10002' == that.data.saveNCmdId){
         console.log("握手成功！");
         console.log('获取握手返回的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType)
         let buff = that.queryDevice(that.data.bMagicNumber,that.data.bVer,9,[117,52],that.data.nSep,that.data.nProtoType);
         that.bleQUeryDevice(buff);
      }

      if('10004' == that.data.saveNCmdId){
        console.log("查询设备状态成功！");
        that.setData({
          isClickCheck:true
        })
        let pages = getCurrentPages();   //当前页面
        console.log("当前页面路径:",pages)
        let arr = [];
        pages.forEach((item,index)=>{
          arr.push(item.__route__)
        })
        if(-1 == arr.indexOf('pages/wifiSet/wifiSet')){
          let inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9))
          wx.hideLoading();
          if(0 != inclusionBodies.errcode){
            let title = '';
            if(1001 == inclusionBodies.errcode){
              if(1 == that.data.isSetWifiPassword){
                title = 'wifi不存在，请设置设置'
              }else{
                console.log("获取wifi状态3");
                title = '未设置wifi，请设置wifi'
              }
              
            }else if(1002 == inclusionBodies.errcode){
              title = '密码错误,请重新设置'
            }else if(1003 == inclusionBodies.errcode){
              title = '连接中，请等待'
            }else if(1091 == inclusionBodies.errcode){
              title = 'wifi功能已关闭，请重新设置'
            }
            wx.showToast({
              title:title,
              icon: 'none',
              duration: 2000
            })           
          }else if(0 == inclusionBodies.errcode && inclusionBodies.wifi_connected){
              let bleOperationMode = app.globalData.bleOperationMode;
              let projectId = wx.getStorageSync('currentAppId');
              console.log('获取当前appid:',projectId);
              console.log('获取运行模式:',bleOperationMode);
              if(3 == bleOperationMode){
                  if('' == projectId || undefined == projectId){
                    wx.navigateTo({
                      url: '/pages/addProject/addProject?ble=1'
                    })               
                  }else{
                    wx.navigateTo({
                      url: '/pages/selectAddProject/selectAddProject?isConnect=1'
                    })
                  }
              }else{
                wx.showToast({
                  title:"请选择设备运行模式为云平台联机模式",
                  icon: 'none',
                  duration: 2000
                })
              }
          }else if(0 == inclusionBodies.errcode && !inclusionBodies.wifi_connected){
            console.log("获取wifi状态1");
            wx.showToast({
              title:"未设置wifi，请设置wifi",
              icon: 'none',
              duration: 2000
            })
          }
        }else{
          let inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9))
        console.log("获取设备状态包体内容：",inclusionBodies)
        wx.hideLoading();
        that.setData({
          isCanSet:true
        })
        if(0 != inclusionBodies.errcode){
          let title = '';
          if(1001 == inclusionBodies.errcode){
            if(1 == that.data.isSetWifiPassword){
              title = 'wifi不存在，请重新设置'
            }else{
              console.log("获取wifi状态2");
              title = '未设置wifi，请设置wifi'
            }
            
          }else if(1002 == inclusionBodies.errcode){
            title = '密码错误,请重新设置'
          }else if(1003 == inclusionBodies.errcode){
            title = '连接中，请等待'
          }else if(1091 == inclusionBodies.errcode){
            title = 'wifi功能已关闭，请重新设置'
          }
          if('wifi功能已关闭，请重新设置' == title){
            that.setData({
              switchChecked:false
            })
          }else{
            that.setData({
              switchChecked:true
            })
          }
          wx.showToast({
            title:title,
            icon: 'none',
            duration: 2000
          })
          console.log('获取查询设备状态返回的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType);
        }else if(0 == inclusionBodies.errcode && inclusionBodies.wifi_connected){
          that.setData({
            currentName:inclusionBodies.wifi_name,
            switchChecked:true
          })
          if(1 == that.data.isSetWifiPassword){
            wx.showToast({
              title:"wifi设置成功",
              icon: 'none',
              duration: 2000
            })
            let bleOperationMode = app.globalData.bleOperationMode;
            let projectId = wx.getStorageSync('currentAppId');
            console.log('获取当前appid:',projectId);
            console.log('获取运行模式:',bleOperationMode);
            if(3 == bleOperationMode){
                if('' == projectId || undefined == projectId){
                  wx.navigateTo({
                    url: '/pages/addProject/addProject?ble=1'
                  })               
                }else{
                  wx.navigateTo({
                    url: '/pages/selectAddProject/selectAddProject?isConnect=1'
                  })
                }
            }
          }else if(2 == that.data.isSetWifiPassword){
            wx.showToast({
              title:"wifi已开启",
              icon: 'none',
              duration: 2000
            })
          }
        }else if(0 == inclusionBodies.errcode && !inclusionBodies.wifi_connected){
          that.setData({
            currentName:inclusionBodies.wifi_name,
            switchChecked:true
          })
        }
        }
        }

      if('10005' == that.data.saveNCmdId){
        that.setData({
          wifiLists:that.ab2hex(res.value).slice(9),
        })
        console.log("当前返回的wifi数据：",that.ab2hex(res.value))
        console.log('wifi数据：',that.data.wifiLists); 
      }
      if(isNaN(that.data.saveNCmdId)){
        that.setData({
          wifiLists:that.data.wifiLists+that.ab2hex(res.value)
        })
        console.log("当前返回的wifi数据：",that.ab2hex(res.value))
        console.log('wifi数据：',that.data.wifiLists); 

        let lastWifiData = that.ab2hex(res.value).indexOf(']');
        console.log("是否是最后一条数据：",lastWifiData)
        if(-1 != lastWifiData){
          wx.hideLoading();
          let wifiJson = that.data.wifiLists;
          let beforeFlag = wifiJson.indexOf('[');
          let afterFlag = wifiJson.indexOf(']');
          let wifiListIntercept = wifiJson.slice(beforeFlag,afterFlag+1);
          let wifiList = JSON.parse(wifiListIntercept);
          let arr = [];
          wifiList.forEach((item,index)=>{
            if('' != item.ssid){
              arr.push(item)
            }
          })
          that.setData({
            wifiList:arr
          })
          let buff = that.queryDevice(that.data.bMagicNumber,that.data.bVer,9,[117,52],that.data.nSep,that.data.nProtoType);
          that.bleQUeryDevice(buff);
          console.log('获取wifi列表的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType);
          
        } 
      }

      if('10808' == that.data.saveNCmdId){
        wx.hideLoading();
        console.log("查询设备运行模式状态成功！");
        let pages = getCurrentPages();   //当前页面
        let prevPage = pages[pages.length - 3];   //上一页面
        let hex16 = that.ab2hex16(res.value);
        let indx = that.hexToString(hex16).indexOf('{');
        console.log(that.hexToString(hex16).slice(indx));
        // let inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9))
        let inclusionBodies = JSON.parse(that.hexToString(hex16).slice(indx))
        console.log("获取设备运行模式状态包体内容：",inclusionBodies)
        if(3 == inclusionBodies.mode){
          prevPage.setData({
            server:false,
            client:true,
            singlechipBg:"#fff",
            singlechipCor:"#666",
            lanBg:"#fff",
            lanCor:"#666",
            cloudPlatformBg:"#000",
            cloudPlatformCor:"#fff",
          })
        }else if(2 == inclusionBodies.mode){
          prevPage.setData({
            server:true,
            client:false,
            singlechipBg:"#fff",
            singlechipCor:"#666",
            lanBg:"#000",
            lanCor:"#fff",
            cloudPlatformBg:"#fff",
            cloudPlatformCor:"#666",
          })
        }else if(1 == inclusionBodies.mode){
          prevPage.setData({
            client:true,
            server:true,
            singlechipBg:"#000",
            singlechipCor:"#fff",
            lanBg:"#fff",
            lanCor:"#666",
            cloudPlatformBg:"#fff",
            cloudPlatformCor:"#666",
          })
        }
        prevPage.setData({
          ['form.name']:inclusionBodies.device_name,
          ['form.address']:inclusionBodies.ip_address,
          ['form.port']:inclusionBodies.port,
          ['form.ip']:inclusionBodies.project_id,
          mode:inclusionBodies.mode,
        })
        if(prevPage.data.isSetbleOperationMode){
          app.globalData.bleOperationMode = inclusionBodies.mode;
          app.globalData.bleSetDeviceName = inclusionBodies.device_name;
          wx.navigateTo({
            url: `/pages/limitedNetworkSettings/limitedNetworkSettings?deviceId=${prevPage.data.deviceId}&deviceSn=${prevPage.data.deviceSn}&uuid=${prevPage.data.uuid}&characteristic_write_uuid=${prevPage.data.characteristic_write_uuid}&characteristic_indicate_uuid=${prevPage.data.characteristic_indicate_uuid}&bMagicNumber=${prevPage.data.bMagicNumber}&bVer=${prevPage.data.bVer}&nLength=${prevPage.data.nLength}&nCmdId=${prevPage.data.nCmdId}&nSep=${prevPage.data.nSep}&nProtoType=${prevPage.data.nProtoType}` 
          })
        }
      }
      if('10909' == that.data.saveNCmdId){
        console.log("设置设备运行模式状态包体内容：",JSON.parse(that.ab2hex(res.value).slice(9))) 
        let pages = getCurrentPages();   //当前页面
        let prevPage = pages[pages.length - 3];   //上一页面
        wx.hideLoading();
        let hex16 = that.ab2hex16(res.value);
        let indx = that.hexToString(hex16).indexOf('{');
        let inclusionBodies = JSON.parse(that.hexToString(hex16).slice(indx));
        if(0 == inclusionBodies.errcode){
          console.log("设备运行模式状态设置成功！");
          wx.showToast({
            title: inclusionBodies.errmsg,
            icon: 'none',
            duration: 2000
          });
          // that.setData({
          //   isSetbleOperationMode:true
          // });
          prevPage.setData({
            //直接给上一个页面赋值
            isSetbleOperationMode:true
          });
          console.log("prevPage:",prevPage)
          that.getOperationModeStatus();
        }
      }
    })
  },

  //wifilie列表下发指令
  getCmdWifi(){
    wx.showLoading({
      title: '正在获取wifi列表',
    })
    const that = this;
    let bleReset = {};
    bleReset['req_id'] = that.data.deviceId;
    bleReset['limit'] = 20;
    let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
    var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
    var bufViewL = new Uint8Array(bufLength);
    let buffer = that.getWifiListCommand(bufViewL.length+ 9,[117,53],bleResetBuff);
    that.blewifiList(buffer);
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
    dataView.setUint8(1,1);
    dataView.setUint8(2,0);
    dataView.setUint8(3,totalTength);
    dataView.setUint8(4,cmd[0]);
    dataView.setUint8(5,cmd[1]);
    dataView.setUint8(6,0);
    dataView.setUint8(7,82);
    dataView.setUint8(8,0);
    for(let i=9;i<totalTength;i++){
      dataView.setUint8(i,parseInt(arr[i-9]));
    }
    console.log("发送包文件:",buffer);
    return buffer;
  },


   //查询运行模式状态
   getOperationModeStatus(){
    const that = this;
    let buff = that.queryDevices(that.data.bMagicNumber,that.data.bVer,9,[42,52],that.data.nSep,that.data.nProtoType);
    that.bleQUeryDevices(buff);
  },

   //查询设备状态
   queryDevices(bMagicNumber,bVer,nLength,nCmdId,nSeq,nProtoType){
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

   //发送查询设备文件
   bleQUeryDevices(buf){
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

   //16进制转字符串
   hexToString(str){
    　　let val="";
        let len = str.length/2;
    　　for(let i = 0; i < len; i++){
    　　　　val += String.fromCharCode(parseInt(str.substr(i*2,2),16));
    　　}
        return this.utf8to16(val);
      },
  
    //处理中文乱码问题
    utf8to16(str) {
      let out, i, len, c;
      let char2, char3;
      out = "";
      len = str.length;
      i = 0;
      while(i < len) {
      c = str.charCodeAt(i++);
      switch(c >> 4){ 
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          out += str.charAt(i-1);
        break;
          case 12: case 13:
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
          case 14:
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
        }
      }
      return out;
    },

  

  ab2hex(e) {
    for (var a = e, i = new DataView(a), n = "", s = 0; s < i.byteLength; s++) n += String.fromCharCode(i.getUint8(s));
    return n
  },

  buf2str: function (buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  },




  changePasswrd(){
     const that = this;
     that.setData({
       isSetWifiPassword:1,
       isCanSet:false
     })
     if('' == that.data.wifiPassword){
      wx.showToast({
        title: '请输入WIFI密码',
        icon: 'none',
        duration: 2000
      })
     }else{
      that.setData({ openDoorMessage: true })
      console.log(that.data.selectName);
      console.log(that.data.wifiPassword);
      wx.showLoading({
        title: '设置wifi中',
      })
      let bleReset = {};
      bleReset['ssid'] = that.data.selectName;
      bleReset['password'] = that.data.wifiPassword;
      let chanL = 0;
      if('' != that.data.selectName){
        if(null == that.data.selectName.match(/[\u4e00-\u9fa5]/g)){
          chanL = 0;
        }else{
          chanL = parseInt(that.data.selectName.match(/[\u4e00-\u9fa5]/g).length)
        }
      }
      let bleResetBuff = util.hexStringToBuff(JSON.stringify(bleReset));
      // let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
      var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
      var bufViewL = new Uint8Array(bufLength);
      let buffer = that.getWifiListCommand(bufViewL.length+ 9+chanL,[117,51],bleResetBuff);
      console.log("设置wifi",buffer)
      that.bleSetwifi(buffer); 
     }
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("wifi设置界面：",options);
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 420
        })
      }
    });
    that.setData({
      deviceId:options.deviceId || '',
      characteristic_write_uuid:options.characteristic_write_uuid  || '',
      uuid:options.uuid || '',
      deviceSn:options.deviceSn || "",
      bMagicNumber:options.bMagicNumber || "",
      bVer:options.bVer || "",
      nLength:options.nLength || "",
      nCmdId:options.nCmdId || "",
      nSep:options.nSep || "",
      nProtoType:options.nProtoType || "",
      isCurrentPage:true,
    })
    that.onBLECharacteristicValueChange(); 
    that.getCmdWifi();

    // let buffer = new ArrayBuffer('appcmd:connectok');
    // that.onBLECharacteristicValueChange();

    // let bleReset = {};
    // bleReset['req_id'] = that.data.deviceId;
    // bleReset['limit'] = 20;
    // let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
    // var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
    // var bufViewL = new Uint8Array(bufLength);
    // let buffer = that.getWifiListCommand(bufViewL.length+ 9,[117,53],bleResetBuff);
    // console.log("发送获取wifi列表:",buffer)
    // that.blewifiList(buffer);
    



    // let buffer = this.str2ab('appcmd:connectok');
    // console.log("发送连立连接:",buffer)
    // this.bleWriteHeart(buffer);
    // setInterval(() => {
    //   console.log("写入数据：",buffer);
    //   this.bleWriteHeart(buffer);
    // }, 5000);
    
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
    const that = this;
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
     const that = this;
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
      const that = this;
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
      const that = this;
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