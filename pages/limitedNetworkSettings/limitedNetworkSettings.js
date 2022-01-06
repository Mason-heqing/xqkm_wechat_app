// pages/limitedNetworkSettings/limitedNetworkSettings.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventDuplication:true,
    deviceId:'',
    deviceSn:'',
    uuid:'',
    characteristic_write_uuid:'',
    characteristic_indicate_uuid:'',
    bMagicNumber:null,
    bVer:null,
    nLength:null,
    nCmdId:null,
    nSep:null,
    nProtoType:null
  },

  //wifi设置
  wifiSet(){
    const that = this;
    wx.navigateTo({
      url: `/pages/wifiSet/wifiSet?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}&characteristic_indicate_uuid=${that.data.characteristic_indicate_uuid}&bMagicNumber=${that.data.bMagicNumber}&bVer=${that.data.bVer}&nLength=${that.data.nLength}&nCmdId=${that.data.nCmdId}&nSep=${that.data.nSep}&nProtoType=${that.data.nProtoType}`  
    })
  },

  //有线设置
  limitedSet(){
    const that = this;
    wx.navigateTo({
      url: `/pages/limitedSet/limitedSet?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}&characteristic_indicate_uuid=${that.data.characteristic_indicate_uuid}&bMagicNumber=${that.data.bMagicNumber}&bVer=${that.data.bVer}&nLength=${that.data.nLength}&nCmdId=${that.data.nCmdId}&nSep=${that.data.nSep}&nProtoType=${that.data.nProtoType}`  
    })
  },

  nextStep(){
    const that = this;
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
      wx.showModal({
        title: '提示',
        content: '当前设备运行模式为单机模式,请将设备运行模式设置为云平台模式!',
        success (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
           })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
      // wx.showToast({
      //   title:"请选择设备运行模式为云平台联机模式",
      //   icon: 'none',
      //   duration: 2000
      // })
    }
    // if(that.data.preventDuplication){
    //   // wx.showLoading({
    //   //   title: '加载中，请等待',
    //   // })
    //   // const that = this;
    //   // let buff = that.queryDevice(that.data.bMagicNumber,that.data.bVer,9,[117,52],that.data.nSep,that.data.nProtoType);
    //   // that.bleQUeryDevice(buff);
    //   // setTimeout(()=>{
    //   //   wx.hideLoading();
    //   //   that.setData({
    //   //     preventDuplication:true
    //   //   })
    //   // },2000)
    // }
    // that.setData({
    //   preventDuplication:false
    // })
    
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


  // 9.监听低功耗蓝牙设备的特征值变化事件 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
  onBLECharacteristicValueChange () {
    const that = this;
    wx.onBLECharacteristicValueChange(function(res) {
      /**/
      that.setData({
        preventDuplication:true
      })
      that.processingData(res.value)
      if('10004' == that.data.saveNCmdId){
        let inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9))
        that.setData({
          preventDuplication:true
        })
        console.log("获取设备状态包体内容：",inclusionBodies)
        console.log("wifi状态：",inclusionBodies.errcode)
        console.log("wifi是否连接成功：",inclusionBodies.wifi_connected)
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
          console.log('获取查询设备状态返回的头文件：',that.data.bMagicNumber,that.data.bVer,that.data.nLength,that.data.nCmdId,that.data.nSep,that.data.nProtoType);
         
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
      }
      if('10808' == that.data.saveNCmdId){
        wx.hideLoading();
        console.log("查询设备运行模式状态成功！");
        let pages = getCurrentPages();   //当前页面
        let prevPage = pages[pages.length - 2];   //上一页面
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
        let prevPage = pages[pages.length - 2];   //上一页面
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
    let buff = that.queryDevice(that.data.bMagicNumber,that.data.bVer,9,[42,52],that.data.nSep,that.data.nProtoType);
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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("网络传参：",options)
    const that = this;
     if(options){
       that.setData({
        deviceId:options.deviceId,
        deviceSn:options.deviceSn,
        uuid:options.uuid,
        characteristic_write_uuid:options.characteristic_write_uuid,
        characteristic_indicate_uuid:options.characteristic_indicate_uuid,
        bMagicNumber:options.bMagicNumber,
        bVer:options.bVer,
        nLength:options.nLength,
        nCmdId:options.nCmdId,
        nSep:options.nSep,
        nProtoType:options.nProtoType,
       })
     }
     that.onBLECharacteristicValueChange(); 

    //  let wifi = app.globalData.dataWifiList;
    //  let wifiJson = JSON.parse(wifi)
    //  console.log("wifi列表数据获取",wifiJson);
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
    that.setData({
      preventDuplication:true
    })
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