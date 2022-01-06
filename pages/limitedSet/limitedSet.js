// pages/limitedSet/limitedSet.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      switchChecked:false,
      ip:'',
      mask:'',
      gateway:'',
      DNS:'',
      spareDNS:'',
    },
    preventDuplication:true,
    onlineNetWork:null,
    bMagicNumber:null,
    bVer:null,
    nLength:null,
    nCmdId:null,
    saveNCmdId:null,
    nSep:null,
    nProtoType:null,
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
    nProtoType:null

  },

  switchChange(e){
    const that = this;
    that.setData({
      ['form.switchChecked']:e.detail.value
    })
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
        let inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9))
        let pages = getCurrentPages();   //当前页面
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
            wx.showToast({
              title:"未设置wifi，请设置wifi",
              icon: 'none',
              duration: 2000
            })
          }
        }else{
          if(0 != inclusionBodies.errcode){
            let title = '';
            if(1001 == inclusionBodies.errcode){
              title = 'wifi不存在，请重新设置'
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
            console.log('获取查询设备状态返回的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType);
           
          
          }else if(0 == inclusionBodies.errcode && inclusionBodies.wifi_connected){
            that.setData({
              currentName:inclusionBodies.wifi_name
            })
            wx.showToast({
              title:"wifi设置成功",
              icon: 'none',
              duration: 2000
            })
          }
        }
        
      }

      if('10606' == that.data.saveNCmdId){
        that.setData({
          onlineNetWork:that.ab2hex(res.value).slice(9),
        })
        console.log("有线网络数据",that.data.onlineNetWork);
        let lastNetworkData = that.ab2hex(res.value).indexOf('}');
        let inclusionBodies;
        if(-1 != lastNetworkData){
          wx.hideLoading();
          that.setData({
            preventDuplication:true
           })
          inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9));
          if(0 != inclusionBodies.errcode){
            let title = '';
            if(1001 == inclusionBodies.errcode){
              title = '未连接有线网络，请将设备连接有线网络'
              that.setData({
                ['form.switchChecked']:false,
                ['form.ip']:'',
                ['form.mask']:'',
                ['form.gateway']:'',
                ['form.DNS']:'',
                ['form.spareDNS']:'',
              })
            }else if(1002 == inclusionBodies.errcode){
              title = '有线网络连接失败,请重新设置有线网络'
            }else if(1003 == inclusionBodies.errcode){
              title = '连接中，请等待'
            }
            wx.showToast({
              title:title,
              icon: 'none',
              duration: 2000
            })
          }else{
            that.setData({
              ['form.switchChecked']:inclusionBodies.dhcp_state,
              ['form.ip']:inclusionBodies.ip_address,
              ['form.mask']:inclusionBodies.net_mask,
              ['form.gateway']:inclusionBodies.gate_way,
              ['form.DNS']:inclusionBodies.dns1,
              ['form.spareDNS']:inclusionBodies.dns2,
            })
            wx.showToast({
              title:"设备有线网络连接成功",
              icon: 'none',
              duration: 2000
            })
          }
        }
        
      }

      if(isNaN(that.data.saveNCmdId)){
        that.setData({
          onlineNetWork:that.data.onlineNetWork+that.ab2hex(res.value)
        })
        let lastNetworkData = that.ab2hex(res.value).indexOf('}');
        console.log("是否是最后一条数据：",lastNetworkData)
        if(-1 != lastNetworkData){
          wx.hideLoading();
          that.setData({
            preventDuplication:true
           })
          let newNetwork = that.data.onlineNetWork;
          let beforeFlag = newNetwork.indexOf('{');
          let afterFlag = newNetwork.indexOf('}');
          let networkIntercept = newNetwork.slice(beforeFlag,afterFlag+1);
          let neckwork = JSON.parse(networkIntercept);
          if(0 != neckwork.errcode){
            let title = '';
            if(1001 == neckwork.errcode){
              title = '未连接有线网络，请将设备连接有线网络'
              that.setData({
                ['form.switchChecked']:false,
                ['form.ip']:'',
                ['form.mask']:'',
                ['form.gateway']:'',
                ['form.DNS']:'',
                ['form.spareDNS']:'',
              })
            }else if(1002 == neckwork.errcode){
              title = '有线网络连接失败,请重新设置有线网络'
            }else if(1003 == neckwork.errcode){
              title = '连接中，请等待'
            }
            wx.showToast({
              title:title,
              icon: 'none',
              duration: 2000
            })
          }else{
            that.setData({
              ['form.switchChecked']:neckwork.dhcp_state,
              ['form.ip']:neckwork.ip_address,
              ['form.mask']:neckwork.net_mask,
              ['form.gateway']:neckwork.gate_way,
              ['form.DNS']:neckwork.dns1,
              ['form.spareDNS']:neckwork.dns2,
            })
            wx.showToast({
              title:"设备有线网络设置成功",
              icon: 'none',
              duration: 2000
            })
          }          
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

  //查询有线网络状态
  getOnlineNetworkStatus(){
   const that = this;
   let buff = that.queryDevice(that.data.bMagicNumber,that.data.bVer,9,[41,108],that.data.nSep,that.data.nProtoType);
   that.bleQUeryDevice(buff);
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


  //设备配置网络
  setDeviceNetwork(value){
    const that = this;
    if('true' == value.DHCP){
      value.DHCP = true;
    }else{
      value.DHCP = false;
    }
    let bleReset = {};
    bleReset['dhcp_state'] = value.DHCP;
    if('' != value.ip){
      bleReset['ip_address'] = value.ip;
    }
    if('' != value.mask){
      bleReset['net_mask'] = value.mask;
    }
    if('' != value.gateway){
      bleReset['gate_way'] = value.gateway;
    }
    if('' != value.DNS){
      bleReset['dns1'] = value.DNS;
    }
    if('' != value.spareDNS){
      bleReset['dns2'] = value.spareDNS;
    }
    let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
    var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
    var bufViewL = new Uint8Array(bufLength);
    let buffer = that.getWifiListCommand(bufViewL.length+ 9,[41,205],bleResetBuff);
    that.bleSetDeviceOnlineNetwork(buffer);
  },

  //写入配置有线网络
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
    dataView.setUint8(4,41);
    dataView.setUint8(5,205);
    dataView.setUint8(6,0);
    dataView.setUint8(7,82);
    dataView.setUint8(8,0);
    for(let i=9;i<totalTength;i++){
      dataView.setUint8(i,parseInt(arr[i-9]));
    }
    console.log("发送包文件:",buffer);
    return buffer;
  },


  //蓝牙写入配置有线网络
  bleSetDeviceOnlineNetwork(buf){
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

  //校验ip地址
  isValidIP(ip){
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
  },
 
  //校验子网掩码
  isValidMASK(mask){
    var reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
    return reg.test(mask);
  },

  //校验默认网关
  isValidGateway(gateway){
    var reg = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    return reg.test(gateway);
  },

  //校验DNS服务器
  isValidDNS(dns){
    var reg = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    return reg.test(dns);
  },

  isValidSpareDNS(spareDNS){
    var reg = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    return reg.test(spareDNS);
  },


  //发送请求
  formSubmit(e){
     console.log(e.detail.value);
     const that = this;
     let parms = e.detail.value
     if('false' == parms.DHCP){
       if('' == parms.ip){
          wx.showToast({
            title: '请填写IP地址',
            icon: 'none',
            duration: 2000
          })
       }else if(!that.isValidIP(parms.ip)){
        wx.showToast({
          title: '请填写正确的IP地址',
          icon: 'none',
          duration: 2000
        })
       }else if('' == parms.mask){
        wx.showToast({
          title: '请填写子网掩码',
          icon: 'none',
          duration: 2000
        })
       }else if(!that.isValidMASK(parms.mask)){
        wx.showToast({
          title: '该子网掩码不合法，请填写合法的子网掩码',
          icon: 'none',
          duration: 2000
        })
       }
       else if('' == parms.gateway){
        wx.showToast({
          title: '请填写默认网关',
          icon: 'none',
          duration: 2000
        })
       }else if(!that.isValidGateway(parms.gateway)){
        wx.showToast({
          title: '请填写正确的默认网关',
          icon: 'none',
          duration: 2000
        })
       }else if('' == parms.DNS){
        wx.showToast({
          title: '请填写DNS服务器',
          icon: 'none',
          duration: 2000
        })
       }else if(!that.isValidDNS(parms.DNS)){
        wx.showToast({
          title: '请填写正确的DNS服务器',
          icon: 'none',
          duration: 2000
        })
       }else if('' == parms.spareDNS){
        wx.showToast({
          title: '请填写备用DNS服务器',
          icon: 'none',
          duration: 2000
        })
       }else if(!that.isValidSpareDNS(parms.spareDNS)){
        wx.showToast({
          title: '请填写正确的备用DNS服务器',
          icon: 'none',
          duration: 2000
        })
       }else{
         if(that.data.preventDuplication){
          wx.showLoading({
            title: '提交中',
          }) 
          that.setDeviceNetwork(parms);
         }
         that.setData({
          preventDuplication:false
         })
       }
     }else{
       if(that.data.preventDuplication){
        wx.showLoading({
          title: '提交中',
        }) 
        that.setDeviceNetwork(parms);
       }
       that.setData({
        preventDuplication:false
       })
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
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
    })
    that.onBLECharacteristicValueChange(); 
    that.getOnlineNetworkStatus();
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