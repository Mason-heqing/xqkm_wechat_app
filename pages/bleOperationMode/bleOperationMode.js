// pages/bleOperationMode/bleOperationMode.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSetbleOperationMode:false,
    preventDuplication:true,
    singlechipBg:"#fff",
    singlechipCor:"#666",
    lanBg:"#fff",
    lanCor:"#666",
    cloudPlatformBg:"#000",
    cloudPlatformCor:"#fff",
    mode:3,
    server:false,
    client:true,
    form:{
      name:"",
      address:"",
      port:"",
      ip:""
    },
    deviceId:'',
    deviceSn:'',
    uuid:'',
    characteristic_write_uuid:'',
    characteristic_indicate_uuid:'',
    saveNCmdId:null,
    bMagicNumber:null,
    bVer:null,
    nLength:null,
    nCmdId:null,
    nSep:null,
    nProtoType:null,
  },

  //选择单片机
  singlechip(){
    const that = this;
  //   if(1 != that.data.mode){
  //     that.setData({
  //      ['form.name']:"",
  //      ['form.address']:"",
  //      ['form.port']:"",
  //      ['form.ip']:"",
  //     })
  //  }
    that.setData({
      mode:1,
      client:true,
      server:true,
      singlechipBg:"#000",
      singlechipCor:"#fff",
      lanBg:"#fff",
      lanCor:"#666",
      cloudPlatformBg:"#fff",
      cloudPlatformCor:"#666",
    })
  },

  //选择局域网联机
  lan(){
    const that = this;
  //   if(2 != that.data.mode){
  //     that.setData({
  //      ['form.name']:"",
  //      ['form.address']:"",
  //      ['form.port']:"",
  //      ['form.ip']:"",
  //     })
  //  }
    that.setData({
      mode:2,
      server:true,
      client:false,
      singlechipBg:"#fff",
      singlechipCor:"#666",
      lanBg:"#000",
      lanCor:"#fff",
      cloudPlatformBg:"#fff",
      cloudPlatformCor:"#666",
    })
  },

  //选择云平台联机
  cloudPlatform(){
    const that = this;
    // if(3 != that.data.mode){
    //    that.setData({
    //     ['form.name']:"",
    //     ['form.address']:"",
    //     ['form.port']:"",
    //     ['form.ip']:"",
    //    })
    // }
    that.setData({
      mode:3,
      server:false,
      client:true,
      singlechipBg:"#fff",
      singlechipCor:"#666",
      lanBg:"#fff",
      lanCor:"#666",
      cloudPlatformBg:"#000",
      cloudPlatformCor:"#fff",
    })
  },

  trimName(e){
   const that = this;
   that.setData({
    ['form.name']:e.detail.value.replace(/\s/g,''),
  })
  },

  //校验ip地址
  isValidIP(ip){
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
  },

  //校验端口号
  isValidPort(port){
    let parten=/^(\d)+$/g;
    if(parten.test(port)&&parseInt(port)<=65535&&parseInt(port)>=0){
        return true;
     }else{
        return false;
     }
  },


  formSubmit(e){
    console.log(e.detail.value)
    const that = this;
    let mode = that.data.mode;
    let parms = e.detail.value;
    if(3 == mode){
      if('' == parms.name){
        wx.showToast({
          title: '请填写设备名称',
          icon: 'none',
          duration: 2000
        })
      }else if('' == parms.address){
        wx.showToast({
          title: '请填写服务器地址',
          icon: 'none',
          duration: 2000
        })
      }else if('' == parms.port){
        wx.showToast({
          title: '请填写端口号',
          icon: 'none',
          duration: 2000
        })
      }else if(!that.isValidPort(parms.port)){
        wx.showToast({
          title: '请填写正确的端口号',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.showLoading({
          title: '提交中',
        })
        that.setBleOperationMode(parms)
        // wx.showToast({
        //   title: '云平台提交成功',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    }else if(2 == mode){
      if('' == parms.name){
        wx.showToast({
          title: '请填写设备名称',
          icon: 'none',
          duration: 2000
        })
      }else{
        if('' != parms.ip){
          if(!that.isValidIP(parms.ip)){
            wx.showToast({
              title: '请填写正确的客户端主机IP地址',
              icon: 'none',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '局域网联机提交成功',
              icon: 'none',
              duration: 2000
            })
          }
        }else{
          that.setBleOperationMode(parms)
          // wx.showToast({
          //   title: '局域网联机提交成功',
          //   icon: 'none',
          //   duration: 2000
          // })
        }
      }
    }else{
      if('' == parms.name){
        wx.showToast({
          title: '请填写设备名称',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '在单机模式下无法使用本小程序!',
          success (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              let deviceId = app.globalData.bleCharacteristicId;
              wx.closeBLEConnection({
                deviceId,
                success (res) {
                  console.log("断开低功耗蓝牙连接")
                  console.log(res)
                }
              })
              wx.closeBluetoothAdapter();
              app.globalData.bleCharacteristicId = null;
              wx.switchTab({
                url: '/pages/index/index',
              })
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
        // that.setBleOperationMode(parms)
        // wx.showToast({
        //   title: '单机提交成功',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    }
  },

  // 9.监听低功耗蓝牙设备的特征值变化事件 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
  onBLECharacteristicValueChange () {
    const that = this;
    wx.onBLECharacteristicValueChange(function(res) {
      /**/
      console.log("元数据：",res.value);
      that.processingData(res.value)
      console.log("获取指令----》",that.data.saveNCmdId);
      if('10808' == that.data.saveNCmdId){
        wx.hideLoading();
        let hex16 = that.ab2hex16(res.value);
        console.log("转译数据:",hex16);
        console.log("查询设备运行模式状态成功！",that.hexToString(hex16));
        let indx = that.hexToString(hex16).lastIndexOf('{');
        // let inclusionBodies = JSON.parse(that.ab2hex(res.value).slice(9))
        // console.log(JSON.parse(that.hexToString(hex16)));
        let inclusionBodies = JSON.parse(that.hexToString(hex16).slice(indx))
        console.log("获取设备运行模式状态包体内容：",inclusionBodies)
        if(3 == inclusionBodies.mode){
          that.setData({
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
          that.setData({
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
          that.setData({
            client:true,
            server:true,
            singlechipBg:"#000",
            singlechipCor:"#fff",
            lanBg:"#fff",
            lanCor:"#666",
            cloudPlatformBg:"#fff",
            cloudPlatformCor:"#666",
          })
        }else{
          inclusionBodies.mode = 3;
        }
        that.setData({
          ['form.name']:inclusionBodies.device_name,
          ['form.address']:inclusionBodies.ip_address,
          ['form.port']:inclusionBodies.port,
          ['form.ip']:inclusionBodies.project_id,
          mode:inclusionBodies.mode,
        })
        if(that.data.isSetbleOperationMode){
          app.globalData.bleOperationMode = inclusionBodies.mode;
          app.globalData.bleSetDeviceName = inclusionBodies.device_name;
          wx.navigateTo({
            url: `/pages/limitedNetworkSettings/limitedNetworkSettings?deviceId=${that.data.deviceId}&deviceSn=${that.data.deviceSn}&uuid=${that.data.uuid}&characteristic_write_uuid=${that.data.characteristic_write_uuid}&characteristic_indicate_uuid=${that.data.characteristic_indicate_uuid}&bMagicNumber=${that.data.bMagicNumber}&bVer=${that.data.bVer}&nLength=${that.data.nLength}&nCmdId=${that.data.nCmdId}&nSep=${that.data.nSep}&nProtoType=${that.data.nProtoType}` 
          })
        }
      }
      if('10909' == that.data.saveNCmdId){
        console.log("设置设备运行模式状态包体内容：",JSON.parse(that.ab2hex(res.value).slice(9)))
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
          that.setData({
            isSetbleOperationMode:true
          });
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

  //设备配置运行模式
  setBleOperationMode(value){
    const that = this;
    let mode = that.data.mode;
    let bleReset = {};
    bleReset['mode'] = parseInt(mode);
    bleReset['timestamp'] = Date.parse(new Date());
    bleReset['client_type'] = 1,
    bleReset['device_name'] = value.name;
    if(3 == mode){
      bleReset['ip_address'] = value.address;
      bleReset['port'] = parseInt(value.port);
    }else if(2 == mode){
      if('' != value.ip){
        bleReset['ip_address'] = value.ip;
      }
    }

    let chanL = 0;
    if('' != value.name){
      if(null == value.name.match(/[\u4e00-\u9fa5]/g)){
        chanL = 0;
      }else{
        chanL = parseInt(value.name.match(/[\u4e00-\u9fa5]/g).length)
      }
    }
    console.log("json格式运行模式：",JSON.stringify(bleReset));
    let bleResetBuff = util.hexStringToBuff(JSON.stringify(bleReset));
    // let bleResetBuff = that.str2ab(JSON.stringify(bleReset))
    var bufLength = new ArrayBuffer(JSON.stringify(bleReset).length)
    var bufViewL = new Uint8Array(bufLength);
    console.log("发送运行模式文件",bleResetBuff);
    let buffer = that.getBleOperationMode(bufViewL.length+9+chanL,[42,149],bleResetBuff);
    that.bleSetDeviceBleOperationMode(buffer);
  },


  //写入设备运行模式二进制转换
  getBleOperationMode(totalTength,cmd,bodies){
    const that = this;
    let pkgfixhead = new Uint8Array(bodies);
    console.log("发送运行模式文件转二进制流",pkgfixhead);
    
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


  //蓝牙写入设备运行模式
  bleSetDeviceBleOperationMode(buf){
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("设备运行模式传参：",options)
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
     };
     that.onBLECharacteristicValueChange(); 
     that.getOperationModeStatus();
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